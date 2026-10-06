import { z } from 'zod';

export const loginRequestSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  expiresAt: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const authResultSchema = z.object({
  success: z.boolean(),
  error: z.string().optional(),
  response: loginResponseSchema.optional(),
  refreshToken: z.string().optional(),
  refreshTokenExpiry: z.string().optional(),
  xsrfToken: z.string().optional(),
  accessTokenExpiry: z.string().optional(),
  accessToken: z.string().optional(),
});

export type AuthResult = z.infer<typeof authResultSchema>;

export const changePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ChangePasswordRequest = z.infer<typeof changePasswordRequestSchema>;

export const meResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
  mustChangePassword: z.boolean(),
  branchId: z.string(),
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export const userResponseSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  isActive: z.boolean(),
  mustChangePassword: z.boolean(),
  createdAt: z.string(),
  lastLoginAt: z.string().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const pagedResultSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    totalCount: z.number(),
    pageNumber: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasPreviousPage: z.boolean(),
    hasNextPage: z.boolean(),
  });

export type PagedResult<T> = z.infer<ReturnType<typeof pagedResultSchema<z.ZodTypeAny>>> & {
  items: T[];
};