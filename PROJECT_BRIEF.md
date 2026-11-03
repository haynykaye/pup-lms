# PUP LMS: Project Brief

Web-based Learning Management System for the Polytechnic University of the Philippines (PUP).
Built by a team of 5 over a 5-day sprint. Paste this file into your AI tool at the start of every session.

## Features
- Login with JWT; roles: STUDENT, FACULTY, ADMIN
- Courses organized by code, module title, and section; categories: CCIS_CORE, GENERAL_EDUCATION, ELECTIVE
- Upload and download of .ppt, .pptx, .pdf (max 50 MB) to cloud storage
- Announcements, gradebook with PUP 1.00 to 5.00 equivalent, grade slips
- Search for courses, announcements, and materials
- Audit logs for uploads, announcements, and grade submissions
- Soft delete: hiding a material sets `isVisibleToStudents = false`; never hard delete
- Mini-reports after actions (e.g. "Total uploaded modules: xx")
- Error toasts on bad input, bad tokens, and oversize files; the session stays active

## Tech stack (do NOT change or add alternatives)
- Frontend: React + Vite + Tailwind CSS (theme: PUP maroon and gold, with light and dark mode)
- Backend: Node.js + Express 4 + TypeScript
- Database: PostgreSQL on Supabase, accessed through Prisma 5.22
- File storage: Supabase Storage
- Auth: JWT + bcryptjs
- Validation: Zod (backend) and form validation (frontend)
- Uploads: Multer

## Version rules
- Use Prisma 5 and Express 4. Never upgrade to Prisma 6, 7, or 8, or Express 5.
- Prisma schema uses `url` and `directUrl` with `env(...)`; leave it as is.
- Windows and PowerShell: use `Invoke-RestMethod` instead of `curl`.

## Naming rules
- Roles are exactly STUDENT, FACULTY, ADMIN. Always say "Faculty" (never Instructor or Teacher).
- Files: PascalCase for classes and models (`FacultyUser.ts`), camelCase for the rest.
- API routes start with `/api/...`.
- Error responses use the shape `{ "error": "message" }`.
- Status codes: 400 validation, 401 not logged in or bad token, 403 wrong role.

## Backend structure (backend/src)
- config/: Prisma client
- models/: Account (abstract), FacultyUser, StudentUser, AdminUser, createAccount factory
- repositories/: LMSDataRepository (interface) and DatabaseStorage (Prisma implementation)
- services/: business logic (processFileUpload, processGradeComputation)
- controllers/: request handlers
- middleware/: verifyToken, requireRole, errorHandler
- routes/: Express routers
- app.ts and server.ts

Flow: route, then middleware, then controller, then service, then repository, then database.
Controllers never call Prisma directly (from Day 2 on, they go through the repository).

## Database tables (Prisma models)
User, Course, Enrollment, Material, Announcement, Grade, AuditLog.
Key fields:
- User: id, schoolId, name, email, passwordHash, role
- Course: id, code, title, category, facultyId
- Enrollment: studentId, courseId, section
- Material: courseId, moduleTitle, title, targetSection, fileUrl, fileType, fileSizeBytes, uploadDate, isVisibleToStudents
- Announcement: courseId, title, body, createdAt, authorId
- Grade: studentId, courseId, assessmentType, score, maxScore, pupEquivalentGrade, gradedById
- AuditLog: userId, action, entityType, entityId, details, createdAt

## Test accounts (password for all: Password123!)
- admin@pup.edu.ph (ADMIN)
- faculty@pup.edu.ph (FACULTY)
- student@pup.edu.ph (STUDENT)

## Team rules
- NEVER commit `.env`, passwords, or API keys.
- Do NOT run `prisma migrate` or `prisma db seed` without telling the Project Lead. The database is shared.
- If you need a schema change, ask the Project Lead first.
- Work on your own branch (`git checkout -b feature/your-feature`), push it, and open a Pull Request. Never push straight to `main`.
- Pull the latest `main` before starting work.
- Build in small pieces and test each one. You must be able to explain every line you submit.
- When asking AI for code, say: "Follow PROJECT_BRIEF.md. Use only the listed stack."