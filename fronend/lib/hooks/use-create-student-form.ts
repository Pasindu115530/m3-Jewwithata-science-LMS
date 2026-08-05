"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentInput } from "@/lib/validations/student";
import { createStudentService, CreateStudentResult } from "@/lib/services/create-student";

export function useCreateStudentForm() {
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<CreateStudentResult | null>(null);

  const form = useForm<StudentInput>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      studentName: "",
      gender: "Male",
      birthday: "",
      grade: "Grade 10",
      schoolName: "",
      classType: "Theory",
      parentName: "",
      mobileNumber: "",
      whatsappNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      password: "",
      confirmPassword: "",
      status: "Active",
      admissionDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const onSubmit = async (data: StudentInput) => {
    setSubmitting(true);
    setApiError(null);
    setSuccessData(null);

    try {
      const result = await createStudentService(data);
      if (!result.success) {
        setApiError(result.error || "Failed to create student.");
      } else {
        setSuccessData(result);
        form.reset();
      }
    } catch (err: any) {
      setApiError(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    apiError,
    successData,
    handleSubmit: form.handleSubmit(onSubmit),
  };
}
