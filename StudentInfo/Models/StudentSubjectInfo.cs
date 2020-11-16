using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentInfo.Models
{
    public class StudentSubjectInfo
    {

        [Key]
        public int Id { get; set; }
        [Required]
        public Students StudentsId { get; set; }
        [Required]
        public Subject SubjectId { get; set; }

        [Required]
        public int Marks { get; set; }
    }
}