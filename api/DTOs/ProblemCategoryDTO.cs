﻿namespace api.DTOs
{
    public class ProblemCategoryDTO
    {
        public int ProblemID { get; set; }
        public int CategoryID { get; set; }
        public string Note { get; set; }

        public string ProblemName { get; set; }
        public string CategoryName { get; set; }
    }
}
