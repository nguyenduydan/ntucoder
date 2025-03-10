using AddressManagementSystem.Infrashtructure.Helpers;
using api.DTOs;
using api.Infrashtructure.Repositories;

namespace api.Services
{
    public class CourseService
    {
        private readonly CourseRepository _courseRepository;

        public CourseService(CourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<PagedResponse<CourseDTO>> GetAllCoursesAsync(QueryObject query, string? sortField = null, bool ascending = true)
        {
            return await _courseRepository.GetAllCoursesAsync(query, sortField, ascending);
        }

        public async Task<CourseCreateDTO> CreateCourseAsync(CourseCreateDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.CourseName))
            {
                throw new ArgumentException("Tên khóa học không được để trống.");
            }

            return await _courseRepository.CreateCourseAsync(dto);
        }

        public async Task<CourseDetailDTO> UpdateCourseAsync(int id, CourseDetailDTO dto)
        {
            if (id <= 0)
            {
                throw new ArgumentException("ID khóa học không hợp lệ.");
            }

            return await _courseRepository.UpdateCourseAsync(id, dto);
        }

        public async Task<CourseDetailDTO> GetCourseByIdAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("ID khóa học không hợp lệ.");
            }

            return await _courseRepository.GetCourseByIdAsync(id);
        }

        public async Task<bool> DeleteCourseAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("ID khóa học không hợp lệ.");
            }

            return await _courseRepository.DeleteAsync(id);
        }
    }
}
