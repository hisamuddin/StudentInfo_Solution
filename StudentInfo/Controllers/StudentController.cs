using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace StudentInfo.Controllers
{
    public class StudentController : Controller
    {
        // GET: Student
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetStudents(string sidx, string sort, int page, int rows)
        {
            DataContext.SchoolContext db = new DataContext.SchoolContext();
            sort = (sort == null) ? "" : sort;
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;

            var StudentList = db.Students.Select(
                    t => new
                    {
                        t.FirstName,
                        t.LastName,
                        t.Class,
                        t.Gender,
                        t.StudentId
                       
                    });
            int totalRecords = StudentList.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);
            if (sort.ToUpper() == "DESC")
            {
                StudentList = StudentList.OrderByDescending(t => t.FirstName);
                StudentList = StudentList.Skip(pageIndex * pageSize).Take(pageSize);
            }
            else
            {
                StudentList = StudentList.OrderBy(t => t.FirstName);
                StudentList = StudentList.Skip(pageIndex * pageSize).Take(pageSize);
            }
            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = StudentList
            };
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetStudentsMarks(string sidx, string sort, int page, int rows)
        {
            DataContext.SchoolContext db = new DataContext.SchoolContext();
            sort = (sort == null) ? "" : sort;
            int pageIndex = Convert.ToInt32(page) - 1;
            int pageSize = rows;

            var StudentMarksList = db.StudentSubjectInfos.Select(
                    t => new
                    {
                        t.SubjectId,
                        t.SubjectId.Name,
                        t.Marks
                    });
            int totalRecords = StudentMarksList.Count();
            var totalPages = (int)Math.Ceiling((float)totalRecords / (float)rows);
            if (sort.ToUpper() == "DESC")
            {
                StudentMarksList = StudentMarksList.OrderByDescending(t => t.Marks);
                StudentMarksList = StudentMarksList.Skip(pageIndex * pageSize).Take(pageSize);
            }
            else
            {
                StudentMarksList = StudentMarksList.OrderBy(t => t.Name);
                StudentMarksList = StudentMarksList.Skip(pageIndex * pageSize).Take(pageSize);
            }
            var jsonData = new
            {
                total = totalPages,
                page,
                records = totalRecords,
                rows = StudentMarksList
            };
            return Json(jsonData, JsonRequestBehavior.AllowGet);
        }



        [HttpPost]
        public string Create([Bind(Exclude = "StudentId")] Models.Students Model)
        {
            DataContext.SchoolContext db = new DataContext.SchoolContext();
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    //Model.StudentId = Guid.NewGuid().ToString();
                    db.Students.Add(Model);
                    db.SaveChanges();
                    msg = "Saved Successfully";
                }
                else
                {
                    msg = "Validation data not successfully";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }

        public string Edit(Models.Students Model)
        {
            DataContext.SchoolContext db = new DataContext.SchoolContext();
            string msg;
            try
            {
                if (ModelState.IsValid)
                {
                    db.Entry(Model).State = EntityState.Modified;
                    db.SaveChanges();
                    msg = "Saved Successfully";
                }
                else
                {
                    msg = "Validation data not successfully";
                }
            }
            catch (Exception ex)
            {
                msg = "Error occured:" + ex.Message;
            }
            return msg;
        }


        public string Delete(int Id)
        {
            DataContext.SchoolContext db = new DataContext.SchoolContext();
            Models.Students student = db.Students.Find(Id);
            db.Students.Remove(student);
            db.SaveChanges();
            return "Deleted successfully";
        }
    }
}