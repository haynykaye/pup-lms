import { Course, CourseCategory, Material, Grade, Prisma } from "@prisma/client";
import { RoleName } from "../models/Account";

export type CourseWithFaculty = Course & { faculty: { name: string } };

export interface LMSDataRepository {
  // Courses
  getCoursesForUser(userId: string, role: RoleName): Promise<CourseWithFaculty[]>;
  findCourseByCode(code: string): Promise<Course | null>;
  createCourse(data: {
    code: string;
    title: string;
    category: CourseCategory;
    facultyId: string;
  }): Promise<Course>;

  // Materials (soft delete only)
  saveMaterial(data: Prisma.MaterialUncheckedCreateInput): Promise<Material>;
  deleteMaterial(materialId: string): Promise<void>;
  getCourseMaterials(courseId: string, includeHidden?: boolean): Promise<Material[]>;

  // Grades
  updateStudentGrade(data: Prisma.GradeUncheckedCreateInput): Promise<Grade>;

  // Audit
  logAudit(data: Prisma.AuditLogUncheckedCreateInput): Promise<void>;
}