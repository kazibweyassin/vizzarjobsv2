import { z } from 'zod';

// Job posting validation
export const jobPostSchema = z.object({
  title: z.string()
    .min(3, { message: "Job title must be at least 3 characters" })
    .max(100, { message: "Job title must not exceed 100 characters" }),
  description: z.string()
    .min(50, { message: "Job description must be at least 50 characters" })
    .max(2000, { message: "Job description must not exceed 2000 characters" }),
  location: z.string()
    .min(1, { message: "Please select a location" }),
  company_id: z.string()
    .min(1, { message: "Please select or add a company" }),
  requirements: z.string()
    .min(20, { message: "Requirements must be at least 20 characters" })
    .max(1500, { message: "Requirements must not exceed 1500 characters" }),
  job_type: z.string().optional(),
  experience_level: z.string().optional(),
  salary_min: z.string().optional(),
  salary_max: z.string().optional(),
  skills: z.string().optional(),
});

// Company creation validation
export const companySchema = z.object({
  name: z.string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must not exceed 100 characters" }),
  logo: z
    .any()
    .refine(
      (file) => {
        if (!file || !file[0]) return false;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        return allowedTypes.includes(file[0].type);
      },
      { message: "Only PNG, JPEG, JPG, and SVG images are allowed" }
    )
    .refine(
      (file) => {
        if (!file || !file[0]) return false;
        return file[0].size <= 5 * 1024 * 1024; // 5MB limit
      },
      { message: "Image size must be less than 5MB" }
    ),
});

// Job application validation
export const jobApplicationSchema = z.object({
  experience: z
    .number()
    .min(0, { message: "Experience must be at least 0 years" })
    .max(50, { message: "Experience cannot exceed 50 years" })
    .int({ message: "Experience must be a whole number" }),
  skills: z.string()
    .min(5, { message: "Please list at least some skills" })
    .max(500, { message: "Skills description is too long" }),
  education: z.enum(["Intermediate", "Graduate", "Post Graduate"], {
    required_error: "Please select your education level",
  }),
  resume: z
    .any()
    .refine(
      (file) => {
        if (!file || !file[0]) return false;
        return file[0] instanceof File;
      },
      { message: "Please upload a resume file" }
    )
    .refine(
      (file) => {
        if (!file || !file[0]) return false;
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return allowedTypes.includes(file[0].type);
      },
      { message: "Only PDF, DOC, and DOCX files are allowed" }
    )
    .refine(
      (file) => {
        if (!file || !file[0]) return false;
        return file[0].size <= 10 * 1024 * 1024; // 10MB limit
      },
      { message: "Resume file size must be less than 10MB" }
    ),
});

// Search/filter validation
export const jobSearchSchema = z.object({
  query: z.string().max(100, { message: "Search query is too long" }).optional(),
  location: z.string().optional(),
  company_id: z.string().optional(),
  requirements: z.string().optional(),
});

export default {
  jobPostSchema,
  companySchema,
  jobApplicationSchema,
  jobSearchSchema,
};
