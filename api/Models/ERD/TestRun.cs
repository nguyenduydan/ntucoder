﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
#pragma warning disable CS8618 // Non-nullable field
namespace api.Models.ERD
{
    public class TestRun
    {
        public int TestRunID { get; set; }
        public int SubmissionID { get; set; }
        public int TestCaseID { get; set; }
        public int TimeDuration { get; set; }
        public int MemorySize { get; set; }
        public string TestOutput { get; set; }
        public string Result { get; set; }
        public string CheckerLog { get; set; }
        public virtual Submission Submission { get; set; }
        public virtual TestCase TestCase { get; set; }
    }
}
