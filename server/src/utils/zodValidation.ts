import * as z from "zod";

// Registration Schema
export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username cannot exceed 20 characters"),

  email: z
    .email("Please enter a valid email address")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),

  password: z.string().min(8, "Password must be at least 8 characters long"),

  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .max(30, "First name cannot exceed 30 characters"),

  lastName: z.string().optional(),
});

// login Schema
export const LoginSchema = z.object({
  identifier: z.object({
    mode: z.enum(["email", "username"]),
    data: z.string(),
  }),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});
