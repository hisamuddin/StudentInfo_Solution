using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StudentInfo.Models
{
    public class Subject
    {
       
            [Key]
            public int SubjectId { get; set; }
            [Required]
            public string Name { get; set; }
          

        
    }
}