import { Course, CourseCategory, Material, Grade, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { RoleName } from "../models/Account";
import { LMSDataRepository, CourseWithFaculty } from "./LMSDataRepository";

export class DatabaseStorage implements LMSDataRepository {
  async getCoursesForUser(userId: string, role: RoleName): Promise<CourseWithFaculty[]> {
    let where: Prisma.CourseWhereInput = {};
    if (role === "FACULTY") where = { facultyId: userId };
    if (role === "STUDENT") where = { enrollments: { some: { studentId: userId } } };

    return prisma.course.findMany({
      where,
      include: { faculty: { select: { name: true } } },
      orderBy: { code: "asc" },
    });
  }

  findCourseByCode(code: string): Promise<Course | null> {
    return prisma.course.findUnique({ where: { code } });
  }

  createCourse(data: {
    code: string;
    title: string;
    category: CourseCategory;
    facultyId: string;
  }): Promise<Course> {
    return prisma.course.create({ data });
  }

  saveMaterial(data: Prisma.MaterialUncheckedCreateInput): Promise<Material> {
    return prisma.material.create({ data });
  }

  // SOFT DELETE: hide the material instead of removing the row
  async deleteMaterial(materialId: string): Promise<void> {
    await prisma.material.update({
      where: { id: materialId },
      data: { isVisibleToStudents: false },
    });
  }

  getCourseMaterials(courseId: string, includeHidden = false): Promise<Material[]> {
    return prisma.material.findMany({
      where: { courseId, ...(includeHidden ? {} : { isVisibleToStudents: true }) },
      orderBy: { uploadDate: "desc" },
    });
  }

  updateStudentGrade(data: Prisma.GradeUncheckedCreateInput): Promise<Grade> {
    return prisma.grade.create({ data });
  }

  async logAudit(data: Prisma.AuditLogUncheckedCreateInput): Promise<void> {
    await prisma.auditLog.create({ data });
  }
}