import { z } from "zod";

export const phoneOtpSchema = z.object({
  studentName: z.string().min(2, "Student Name is required / ශිෂ්‍යයාගේ නම අවශ්‍ය වේ"),
  mobileNumber: z
    .string()
    .regex(/^07[0-9]{8}$/, "Enter a valid 10-digit Sri Lankan phone number (e.g. 0771234567) / නිවැරදි දුරකථන අංකයක් ඇතුළත් කරන්න"),
  whatsappNumber: z
    .string()
    .regex(/^07[0-9]{8}$/, "Enter a valid 10-digit WhatsApp number / නිවැරදි WhatsApp අංකයක් ඇතුළත් කරන්න"),
  sameAsPhone: z.boolean().default(false),
  otp: z.string().optional(),
});

export type PhoneOtpInput = z.infer<typeof phoneOtpSchema>;

export const registrationDetailsSchema = z.object({
  studentName: z.string().min(2, "Student name is required"),
  parentName: z.string().min(2, "Parent name is required"),
  mobileNumber: z.string().regex(/^07[0-9]{8}$/),
  whatsappNumber: z.string().regex(/^07[0-9]{8}$/),
  gender: z.enum(["Male", "Female"]),
  birthday: z.string().min(1, "Birthday is required"),
  grade: z.string().min(1, "Grade selection is required"),
  schoolName: z.string().min(2, "School name is required"),
  addressLine1: z.string().min(2, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password confirmation is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match / මුරපද ගැලපෙන්නේ නැත",
  path: ["confirmPassword"],
});

export type RegistrationDetailsInput = z.infer<typeof registrationDetailsSchema>;

export const physicalVerificationSchema = z.object({
  smartCardLast4: z
    .string()
    .length(4, "Smart card last 4 digits required / Smart Card අංකයේ අවසාන ඉලක්කම් 4 ඇතුළත් කරන්න"),
  activationCode: z
    .string()
    .length(6, "Activation code must be 6 digits / 6-ඉලක්කම් සක්‍රිය කිරීමේ කේතය ඇතුළත් කරන්න"),
});

export type PhysicalVerificationInput = z.infer<typeof physicalVerificationSchema>;
