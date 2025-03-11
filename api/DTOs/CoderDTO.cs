﻿using api.Infrashtructure.Enums;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace api.DTOs
{
    public class CoderDTO
    {
        public int CoderID { get; set; }
        public string? UserName { get; set; }
        public string? CoderName { get; set; }
        public string? CoderEmail { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public class CreateCoderDTO : CoderDTO
    {
        public string Password { get; set; }
    }
    public class CoderDetailDTO: CoderDTO
    {
        public IFormFile? AvatarFile { get; set; }
        public string? Avatar { get; set; }
        public string? Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public GenderEnum? Gender { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? UpdatedBy { get; set; }
    }
}
