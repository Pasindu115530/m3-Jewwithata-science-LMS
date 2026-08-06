"use client";

import { CreditCard, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface Profile {
  name: string;
  email: string;
  avatar?: string;
  role?: "student" | "teacher";
  grade?: string;
  status?: string;
}

export interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
}

const SAMPLE_PROFILE_DATA: Profile = {
  name: "Mia Perera",
  email: "mia.perera@student.kalaharascience.lk",
  role: "student",
  grade: "Grade 10",
  status: "Active Student",
};

export interface ProfileDropdownProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Profile;
  onSignOut?: () => void;
}

export default function ProfileDropdown({
  data = SAMPLE_PROFILE_DATA,
  className,
  onSignOut,
  ...props
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const role = data.role || "student";
  const profileHref = role === "student" ? "/student/profile" : "/teacher/profile";
  const paymentsHref = role === "student" ? "/student/payments" : "/teacher/payments";
  const settingsHref = role === "student" ? "/student/settings" : "/teacher/settings";

  const menuItems: MenuItem[] = [
    {
      label: "My Profile",
      value: data.grade || (role === "student" ? "Grade 10" : "Teacher"),
      href: profileHref,
      icon: <User className="h-4 w-4 text-purple-600" />,
    },
    {
      label: role === "student" ? "Payments & Fees" : "Payment Approvals",
      value: data.status || "Active",
      href: paymentsHref,
      icon: <CreditCard className="h-4 w-4 text-purple-600" />,
    },
    {
      label: "Account Settings",
      href: settingsHref,
      icon: <Settings className="h-4 w-4 text-purple-600" />,
    },
  ];

  const renderAvatar = () => {
    if (data.avatar && (data.avatar.startsWith("http") || data.avatar.startsWith("/"))) {
      return (
        <Image
          alt={data.name}
          className="h-full w-full rounded-full object-cover"
          height={36}
          src={data.avatar}
          width={36}
        />
      );
    }
    return (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-lavender-100 text-lg font-black text-lavender-700">
        {role === "student" ? "👩‍🎓" : "👨‍🏫"}
      </div>
    );
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="group relative">
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-3 md:gap-5 rounded-2xl border border-lavender-200/80 bg-white/90 p-2 md:p-2.5 transition-all duration-200 hover:border-lavender-300 hover:bg-white hover:shadow-card focus:outline-none"
              type="button"
            >
              <div className="flex-1 text-left hidden sm:block">
                <div className="font-extrabold text-sm text-ink leading-tight">
                  {data.name}
                </div>
                <div className="text-xs font-semibold text-ink/50 leading-tight">
                  {data.email}
                </div>
              </div>
              <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-lavender-400 via-purple-500 to-lavender-600 p-0.5 shadow-sm">
                  <div className="h-full w-full overflow-hidden rounded-full bg-white">
                    {renderAvatar()}
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* Curved line indicator */}
          <div
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100" : "opacity-50 group-hover:opacity-100"
            )}
          >
            <svg
              aria-hidden="true"
              className={cn(
                "transition-all duration-200",
                isOpen
                  ? "scale-110 text-lavender-600"
                  : "text-ink/30 group-hover:text-ink/60"
              )}
              fill="none"
              height="24"
              viewBox="0 0 12 24"
              width="12"
            >
              <path
                d="M2 4C6 8 6 16 2 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.75"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            className="data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 w-64 origin-top-right rounded-2xl border border-lavender-200/80 bg-white/95 p-2 shadow-soft backdrop-blur-md data-[state=closed]:animate-out data-[state=open]:animate-in"
            sideOffset={6}
          >
            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link
                    className="group flex cursor-pointer items-center rounded-xl border border-transparent p-2.5 transition-all duration-150 hover:bg-lavender-50/80 hover:shadow-xs"
                    href={item.href}
                  >
                    <div className="flex flex-1 items-center gap-2.5">
                      {item.icon}
                      <span className="whitespace-nowrap font-bold text-xs text-ink transition-colors group-hover:text-purple-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && (
                        <span className="rounded-lg bg-lavender-100/80 px-2 py-0.5 font-extrabold text-[10px] text-purple-700">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-2 bg-lavender-100" />

            <DropdownMenuItem asChild>
              <button
                onClick={onSignOut}
                className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent bg-rose-50 p-2.5 transition-all duration-150 hover:bg-rose-100/80"
                type="button"
              >
                <LogOut className="h-4 w-4 text-rose-600 group-hover:text-rose-700" />
                <span className="font-extrabold text-xs text-rose-600 group-hover:text-rose-700">
                  Sign Out
                </span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
