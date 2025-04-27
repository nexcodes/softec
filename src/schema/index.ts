import { CrimeType } from '@prisma/client';
import { z } from 'zod';

// Crime schemas
export const createCrimeSchema = z.object({
  title: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  location: z.string().min(3, {
    message: 'Location is required.',
  }),
  longitude: z.coerce.number({
    required_error: 'Longitude is required.',
  }),
  latitude: z.coerce.number({
    required_error: 'Latitude is required.',
  }),
  crimeType: z.nativeEnum(CrimeType, {
    required_error: 'Please select a crime type.',
  }),
  incidentDate: z.coerce.date({
    required_error: 'Please select the date of the incident.',
  }),
});

export const updateCrimeSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
});

export const searchCrimeSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
});

// Vote schema
export const voteSchema = z.object({
  value: z.boolean(),
});

// Comment schemas
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
});

// Parameter schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

// Header schemas
export const userIdHeaderSchema = z.object({
  'x-user-id': z.string().min(1, 'User ID is required in header'),
});

// Lawyer schemas
export const createLawyerSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required'),
  userId: z.string().min(1, 'User ID is required'),
  specialization: z.string().optional(),
  experience: z.number().int().positive('Experience must be a positive number'),
  description: z.string().min(1, 'Description is required'),
  licenseNo: z.string().min(1, 'License number is required'),
  fatherName: z.string().min(1, "Father's name is required"),
  cnic: z.string().min(1, 'CNIC is required'),
});

export const updateLawyerSchema = z.object({
  legalName: z.string().min(1, 'Legal name is required').optional(),
  specialization: z.string().optional(),
  experience: z
    .number()
    .int()
    .positive('Experience must be a positive number')
    .optional(),
  description: z.string().min(1, 'Description is required').optional(),
  licenseNo: z.string().min(1, 'License number is required').optional(),
  fatherName: z.string().min(1, "Father's name is required").optional(),
  cnic: z.string().min(1, 'CNIC is required').optional(),
});

export const getLawyersBySpecializationSchema = z.object({
  specialization: z.string().min(1, 'Specialization is required'),
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
