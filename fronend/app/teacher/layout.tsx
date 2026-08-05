import { TeacherGuard } from "@/components/teacher-guard";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <TeacherGuard>{children}</TeacherGuard>;
}
