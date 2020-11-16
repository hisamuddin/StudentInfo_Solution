using StudentInfo.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace StudentInfo.DataContext
{
    public class SchoolContext : DbContext
    {
        public SchoolContext() : base("SchoolContext")
        {
        }
        public DbSet<Students> Students { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<StudentSubjectInfo> StudentSubjectInfos { get; set; }
    }
}
