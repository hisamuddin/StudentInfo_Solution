namespace StudentInfo.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTablesUpdate : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.StudentSubjectInfoes", "Marks", c => c.Int(nullable: false));
            DropColumn("dbo.Subjects", "Marks");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Subjects", "Marks", c => c.Int(nullable: false));
            DropColumn("dbo.StudentSubjectInfoes", "Marks");
        }
    }
}
