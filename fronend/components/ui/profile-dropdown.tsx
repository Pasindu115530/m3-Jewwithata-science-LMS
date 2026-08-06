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
      icon: <User className="h-4 w-4 text-lavender-600" />,
    },
    {
      label: role === "student" ? "Payments & Fees" : "Payment Approvals",
      value: data.status || "Active Student",
      href: paymentsHref,
      icon: <CreditCard className="h-4 w-4 text-lavender-600" />,
    },
    {
      label: "Account Settings",
      href: settingsHref,
      icon: <Settings className="h-4 w-4 text-lavender-600" />,
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
      <div className="flex h-full w-full items-center justify-center rounded-full bg-peach-100 text-base font-black text-amber-800">
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
              className="flex items-center gap-3 md:gap-5 rounded-2xl border-2 border-lavender-200 bg-gradient-to-r from-white via-lavender-50/40 to-peach-50/50 p-2 md:p-2.5 shadow-sm transition-all duration-200 hover:border-peach-400 hover:shadow-card hover:bg-white focus:outline-none"
              type="button"
            >
              <div className="flex-1 text-left hidden sm:block">
                <div className="font-black text-sm text-ink leading-tight">
                  {data.name}
                </div>
                <div className="text-xs font-bold text-lavender-600/80 leading-tight">
                  {data.email}
                </div>
              </div>
              <div className="relative">
                {/* Yellow / Gold Glowing Avatar Ring */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-peach-400 via-amber-400 to-yellow-500 p-0.5 shadow-md shadow-peach-400/40">
                  <div className="h-full w-full overflow-hidden rounded-full bg-white">
                    {renderAvatar()}
                  </div>
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          {/* Bending line indicator in site blue & yellow */}
          <div
            className={cn(
              "absolute top-1/2 -right-3 -translate-y-1/2 transition-all duration-200",
              isOpen ? "opacity-100 scale-110" : "opacity-60 group-hover:opacity-100"
            )}
          >
            <svg
              aria-hidden="true"
              className={cn(
                "transition-colors duration-200",
                isOpen ? "text-peach-400" : "text-lavender-600 group-hover:text-peach-400"
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
                strokeWidth="2"
              />
            </svg>
          </div>

          <DropdownMenuContent
            align="end"
            className="w-64 origin-top-right rounded-2xl border-2 border-lavender-200 bg-white p-2 shadow-2xl shadow-lavender-900/15"
            sideOffset={8}
          >
            <div className="space-y-1">
              {menuItems.map((item) => (
                <DropdownMenuItem asChild key={item.label}>
                  <Link
                    className="group flex cursor-pointer items-center rounded-xl border border-transparent p-2.5 transition-all duration-150 hover:border-lavender-200 hover:bg-gradient-to-r hover:from-lavender-50 hover:to-peach-50/60"
                    href={item.href}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-lavender-100/70 text-lavender-600 group-hover:bg-peach-400 group-hover:text-ink transition-colors">
                        {item.icon}
                      </div>
                      <span className="whitespace-nowrap font-extrabold text-xs text-ink group-hover:text-lavender-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      {item.value && (
                        <span className="rounded-full bg-peach-100 border border-peach-300 px-2.5 py-0.5 font-black text-[10px] text-amber-900 shadow-2xs">
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
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-rose-200/80 bg-rose-50 p-2.5 transition-all duration-150 hover:border-rose-300 hover:bg-rose-100"
                type="button"
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-200">
                  <LogOut className="h-4 w-4" />
                </div>
                <span className="font-black text-xs text-rose-600 group-hover:text-rose-700">
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
