import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { repo } from "../config/repository";

const createCourseSchema = z.object({
  code: z.string().trim().min(1, "Course code is required."),
  title: z.string().trim().min(1, "Course title is required."),
  category: z.enum(["CCIS_CORE", "GENERAL_EDUCATION", "ELECTIVE"], {
    message: "Invalid course category.",
  }),
});

export async function listCourses(req: Request, res: Response, next: NextFunction) {
  try {
    const courses = await repo.getCoursesForUser(req.user!.sub, req.user!.role);
    res.json({ courses, report: `Total courses: ${courses.length}` });
  } catch (err) {
    next(err);
  }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createCourseSchema.parse(req.body);

    if (await repo.findCourseByCode(input.code)) {
      return res.status(400).json({ error: `Course code ${input.code} already exists.` });
    }

    const course = await repo.createCourse({ ...input, facultyId: req.user!.sub });

    await repo.logAudit({
      userId: req.user!.sub,
      action: "CREATE_COURSE",
      entityType: "Course",
      entityId: course.id,
      details: `${course.code} - ${course.title}`,
    });

    res.status(201).json({ course });
  } catch (err) {
    next(err);
  }
}