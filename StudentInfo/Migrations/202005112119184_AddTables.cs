namespace StudentInfo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTables : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Students",
                c => new
                    {
                        StudentId = c.Int(nullable: false, identity: true),
                        FirstName = c.String(nullable: false),
                        LastName = c.String(nullable: false),
                        Gender = c.String(nullable: false),
                        Class = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.StudentId);
            
            CreateTable(
                "dbo.StudentSubjectInfoes",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        StudentsId_StudentId = c.Int(nullable: false),
                        SubjectId_SubjectId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Students", t => t.StudentsId_StudentId, cascadeDelete: true)
                .ForeignKey("dbo.Subjects", t => t.SubjectId_SubjectId, cascadeDelete: true)
                .Index(t => t.StudentsId_StudentId)
                .Index(t => t.SubjectId_SubjectId);
            
            CreateTable(
                "dbo.Subjects",
                c => new
                    {
                        SubjectId = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        Marks = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.SubjectId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.StudentSubjectInfoes", "SubjectId_SubjectId", "dbo.Subjects");
            DropForeignKey("dbo.StudentSubjectInfoes", "StudentsId_StudentId", "dbo.Students");
            DropIndex("dbo.StudentSubjectInfoes", new[] { "SubjectId_SubjectId" });
            DropIndex("dbo.StudentSubjectInfoes", new[] { "StudentsId_StudentId" });
            DropTable("dbo.Subjects");
            DropTable("dbo.StudentSubjectInfoes");
            DropTable("dbo.Students");
        }
    }
}
