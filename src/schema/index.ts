import { z } from "zod";

// Crime schemas
export const createCrimeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  userId: z.string().optional(),
  isLive: z.boolean().default(true),
});

export const updateCrimeSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  location: z.string().min(1, "Location is required").optional(),
  isLive: z.boolean().optional(),
  isVerified: z.boolean().optional(),
});

export const searchCrimeSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});

// Vote schema
export const voteSchema = z.object({
  value: z.boolean(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment content is required"),
});

// Parameter schemas
export const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

// Header schemas
export const userIdHeaderSchema = z.object({
  "x-user-id": z.string().min(1, "User ID is required in header"),
});

// Lawyer schemas
export const createLawyerSchema = z.object({
  legalName: z.string().min(1, "Legal name is required"),
  userId: z.string().min(1, "User ID is required"),
  specialization: z.string().optional(),
  experience: z.number().int().positive("Experience must be a positive number"),
  description: z.string().min(1, "Description is required"),
  licenseNo: z.string().min(1, "License number is required"),
  fatherName: z.string().min(1, "Father's name is required"),
  cnic: z.string().min(1, "CNIC is required"),
});

export const updateLawyerSchema = z.object({
  legalName: z.string().min(1, "Legal name is required").optional(),
  specialization: z.string().optional(),
  experience: z
    .number()
    .int()
    .positive("Experience must be a positive number")
    .optional(),
  description: z.string().min(1, "Description is required").optional(),
  licenseNo: z.string().min(1, "License number is required").optional(),
  fatherName: z.string().min(1, "Father's name is required").optional(),
  cnic: z.string().min(1, "CNIC is required").optional(),
  isVerified: z.boolean().optional(),
});

export const getLawyersBySpecializationSchema = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const limit = val ? parseInt(val, 10) : 10;
      return limit > 100 ? 100 : limit < 1 ? 10 : limit;
    }),
});

// Pagination schema
export const paginationQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => {
      const limit = val ? parseInt(val, 10) : 10;
      return limit > 100 ? 100 : limit < 1 ? 10 : limit;
    }),
});
