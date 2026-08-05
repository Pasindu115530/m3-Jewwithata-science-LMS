import { z } from "zod";

const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;

export const studentSchema = z
  .object({
    studentName: z.string().min(2, "Student Name must be at least 2 characters."),
    gender: z.enum(["Male", "Female", "Other"]),
    birthday: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid Date of Birth.",
    }),
    grade: z.string().min(1, "Please select a grade."),
    schoolName: z.string().min(2, "School Name is required."),
    classType: z.enum(["Theory", "Paper", "Revision", "Online"]),
    parentName: z.string().min(2, "Parent Name is required."),
    mobileNumber: z.string().regex(phoneRegex, "Invalid Mobile Number (e.g. 0771234567)."),
    whatsappNumber: z.string().regex(phoneRegex, "Invalid WhatsApp Number (e.g. 0771234567)."),
    addressLine1: z.string().min(2, "Address Line 1 is required."),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City is required."),
    district: z.string().min(2, "District is required."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters long."),
    status: z.enum(["Active", "Inactive", "Pending"]),
    admissionDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Please enter a valid Admission Date.",
    }),
    notes: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type StudentInput = z.infer<typeof studentSchema>;
