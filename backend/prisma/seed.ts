import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@pup.edu.ph" },
    update: {},
    create: { schoolId: "ADMIN-001", name: "System Admin", email: "admin@pup.edu.ph", passwordHash, role: "ADMIN" },
  });

  const faculty = await prisma.user.upsert({
    where: { email: "faculty@pup.edu.ph" },
    update: {},
    create: { schoolId: "FAC-001", name: "Prof. Juan Dela Cruz", email: "faculty@pup.edu.ph", passwordHash, role: "FACULTY" },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@pup.edu.ph" },
    update: {},
    create: { schoolId: "2024-00001-MN-0", name: "Maria Santos", email: "student@pup.edu.ph", passwordHash, role: "STUDENT" },
  });

  const course = await prisma.course.upsert({
    where: { code: "COMP 20113" },
    update: {},
    create: { code: "COMP 20113", title: "Web Development", category: "CCIS_CORE", facultyId: faculty.id },
  });

  await prisma.enrollment.upsert({
    where: { studentId_courseId: { studentId: student.id, courseId: course.id } },
    update: {},
    create: { studentId: student.id, courseId: course.id, section: "BSIT 3-1" },
  });

  console.log("Seeded:", admin.email, faculty.email, student.email);
}

main().finally(() => prisma.$disconnect());