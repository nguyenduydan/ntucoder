using api.Infrashtructure.Repositories;
using api.Models.ERD;
using api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Text;
using System.Text.Json;

namespace api.Infrashtructure.Services
{
    public class CodeExecutionService
    {
        
        private readonly IDbContextFactory<ApplicationDbContext> _contextFactory;

        public CodeExecutionService(IDbContextFactory<ApplicationDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task<List<TestRun>> ExecuteSubmissionAsync(int submissionId)
        {

            await using var _context = _contextFactory.CreateDbContext();
            var submission = await _context.Submissions
                .Include(s => s.Problem)
                .Include(s => s.Compiler)
                .FirstOrDefaultAsync(s => s.SubmissionID == submissionId)
                ?? throw new Exception($"Submission ID {submissionId} không tồn tại.");

            if (submission.Compiler.CompilerExtension != ".cpp" && submission.Compiler.CompilerExtension != ".c")
            {
                throw new Exception("Chỉ hỗ trợ C/C++.");
            }

            var testCases = await _context.TestCases
                .Where(tc => tc.ProblemID == submission.ProblemID)
                .ToListAsync();

            var testRunTasks = testCases.Select(testCase => ExecuteTestCase(submission, testCase));
            var testRuns = await Task.WhenAll(testRunTasks);

            //await _context.TestRuns.AddRangeAsync(testRuns);
            await _context.SaveChangesAsync();
            var submissionRepo = new SubmissionRepository(_context);
            await submissionRepo.UpdateSubmissionAfterTestRunAsync(submissionId);
            return testRuns.ToList();
        }
        public async Task<List<TestRun>> ExecuteSubmissionsAsync(List<int> submissionIds)
        {
            var testRuns = new ConcurrentBag<TestRun>();
            var semaphore = new SemaphoreSlim(3);

            await Parallel.ForEachAsync(submissionIds, async (submissionId, _) =>
            {
                await semaphore.WaitAsync();
                try
                {
                    var results = await ExecuteSubmissionAsync(submissionId);
                    foreach (var result in results)
                    {
                        testRuns.Add(result);
                    }
                    await using var _context = _contextFactory.CreateDbContext();
                    var submissionRepo = new SubmissionRepository(_context);
                    await submissionRepo.UpdateSubmissionAfterTestRunAsync(submissionId);
                }
                finally
                {
                    semaphore.Release();
                }
            });

            return testRuns.ToList();
        }

        private async Task<TestRun> ExecuteTestCase(Submission submission, TestCase testCase)
        {
            await using var _context = _contextFactory.CreateDbContext();
            var existingTestRun = await _context.TestRuns
                .FirstOrDefaultAsync(tr => tr.SubmissionID == submission.SubmissionID && tr.TestCaseID == testCase.TestCaseID);

            (string dockerCommand, string containerName) = GetDockerCommand(submission.Compiler, submission.SubmissionCode, testCase.Input);

            var stopwatch = Stopwatch.StartNew();

            //tuple multi value
            (bool isSuccess, string output, string error) result;
            try
            {
                result = await RunProcessAsync(dockerCommand, containerName);
            }
            finally
            {

            }
            stopwatch.Stop();
            string testResult;
            if (!result.isSuccess)
            {
                bool isRuntimeError = Regex.IsMatch(result.error, @"Exception in thread|Error:");
                testResult = isRuntimeError ? "Runtime Error" : "Compilation Error";
            }
            else
            {
                bool isCorrect = string.Equals(result.output.Trim(), testCase.Output.Trim(), StringComparison.Ordinal);
                testResult = isCorrect ? "Accepted" : "Wrong Answer";
            }


            // Log the output for the test case to console
            //Console.WriteLine($"Test Case ID: {testCase.TestCaseID}");
            //Console.WriteLine($"Input: {testCase.Input.Trim()}");
            //Console.WriteLine($"Expected Output: {testCase.Output.Trim()}");
            //Console.WriteLine($"Actual Output: {result.output.Trim()}");
            //Console.WriteLine($"Test Result: {testResult}");

            var checkerLogObj = new
            {
                DockerCommand = dockerCommand,
                ExitStatus = result.isSuccess ? "Success" : "Failed",
                StandardOutput = result.output.Trim(),
                StandardError = result.error.Trim(),
                Time = stopwatch.ElapsedMilliseconds + " ms",
            };

            string checkerLogJson = JsonSerializer.Serialize(checkerLogObj, new JsonSerializerOptions
            {
                WriteIndented = true
            });


            if (existingTestRun != null)
            {
                existingTestRun.TimeDuration = (int)stopwatch.ElapsedMilliseconds;
                existingTestRun.TestOutput = result.output.Trim();
                existingTestRun.Result = testResult;
                existingTestRun.CheckerLog = checkerLogJson;
                existingTestRun.MemorySize = 0;
            }
            else
            {
                existingTestRun = new TestRun
                {
                    SubmissionID = submission.SubmissionID,
                    TestCaseID = testCase.TestCaseID,
                    TimeDuration = (int)stopwatch.ElapsedMilliseconds,
                    MemorySize = 0,
                    TestOutput = result.output.Trim(),
                    Result = testResult,
                    CheckerLog = checkerLogJson,
                };
                await _context.TestRuns.AddAsync(existingTestRun);
            }
            await _context.SaveChangesAsync();
            return existingTestRun;
        }

        private (string, string) GetDockerCommand(Compiler compiler, string sourceCode, string input)
        {
            string containerName = $"code_runner_{Guid.NewGuid()}".Replace("-", "");
            string dockerImage = "gcc:12";

            string extension = compiler.CompilerExtension.ToLower();
            if (extension != ".cpp")
                throw new Exception($"Chỉ hỗ trợ C++ với đuôi .cpp. '{compiler.CompilerName}' không được hỗ trợ.");

            string fileName = "main.cpp";
            string encodedSource = Convert.ToBase64String(Encoding.UTF8.GetBytes(sourceCode));
            // Compile và chạy
            string compileCommand = $"echo '{encodedSource}' | base64 -d > {fileName} && g++ {fileName} -o main.out";
            string runCommand = $"echo '{input.Replace("\"", "\\\"")}' | ./main.out";

            // Lệnh Docker tổng hợp
            string command = $"docker run --rm --name {containerName} {dockerImage} sh -c \"{compileCommand} && {runCommand}\"";

            return (command, containerName);
        }

        public async Task<(string Result, string Output, string Error, int TimeDuration)> TryRunCodeAsync(string sourceCode, string compilerExtension, string input, string expectedOutput = "")
        {
            string containerName = $"code_runner_{Guid.NewGuid()}".Replace("-", "");

            string dockerImage = compilerExtension.ToLower() switch
            {
                ".cpp" => "gcc:12",
                ".java" => "openjdk:17-alpine",
                ".py" => "python:3.9.21-alpine",
                _ => throw new Exception($"Compiler {compilerExtension} không được hỗ trợ.")
            };

            string encodedSource = Convert.ToBase64String(Encoding.UTF8.GetBytes(sourceCode));

            string command = compilerExtension.ToLower() switch
            {
                ".cpp" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d | tee temp.cpp | g++ -x c++ - -o temp.out && echo '{input.Replace("\"", "\\\"")}' | ./temp.out\"",
                ".java" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > Main.java && javac Main.java && echo '{input.Replace("\"", "\\\"")}' | java Main\"",
                ".py" => $"docker run --rm --name {containerName} {dockerImage} sh -c \"echo '{encodedSource}' | base64 -d > temp.py && echo '{input.Replace("\"", "\\\"")}' | python3 temp.py\"",
                _ => throw new Exception($"Compiler {compilerExtension} không được hỗ trợ.")
            };

            var stopwatch = Stopwatch.StartNew();
            var result = await RunProcessAsync(command, containerName);
            stopwatch.Stop();

            string testResult;
            if (!result.IsSuccess)
            {
                bool isRuntimeError = Regex.IsMatch(result.Error, @"Exception in thread|Error:");
                testResult = isRuntimeError ? "Runtime Error" : "Compilation Error";
            }
            else
            {
                if (!string.IsNullOrWhiteSpace(expectedOutput))
                {
                    bool isCorrect = string.Equals(result.Output.Trim(), expectedOutput.Trim(), StringComparison.OrdinalIgnoreCase);
                    testResult = isCorrect ? "Accepted" : "Wrong Answer";
                }
                else
                {
                    testResult = "Success";
                }
            }

            return (testResult, result.Output, result.Error, (int)stopwatch.ElapsedMilliseconds);
        }


        private async Task<(bool IsSuccess, string Output, string Error)> RunProcessAsync(string command, string containerName, int timeMs = 5000)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c {command}",
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = new Process { StartInfo = psi };
            process.Start();
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            var waitTask = process.WaitForExitAsync();

            if (await Task.WhenAny(waitTask, Task.Delay(timeMs)) == waitTask)
            {
                string output = await outputTask;
                string error = await errorTask;
                return (string.IsNullOrEmpty(error), output.Trim(), error);
            }
            else
            {
                try
                {
                    var killProcess = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = $"/c docker rm -f {containerName}",
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };

                    using var kill = new Process { StartInfo = killProcess };
                    kill.Start();
                    await kill.WaitForExitAsync();
                    if (!process.HasExited)
                    {
                        process.Kill();
                    }
                }
                catch (Exception ex)
                {
                    return (false, string.Empty, $"Runtime Error: {ex.Message}");
                }

                return (false, string.Empty, "Runtime Error: Time Limit Exceeded");
            }
        }
    }

}
