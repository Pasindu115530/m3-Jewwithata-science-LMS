import { StudentGuard } from "@/components/student-guard";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentGuard>{children}</StudentGuard>;
}
