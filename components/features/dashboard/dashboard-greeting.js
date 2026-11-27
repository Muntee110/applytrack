"use client";

import * as React from "react";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardGreeting() {
  const { user, profile } = useAuth();

  const fullName =
    user?.user_metadata?.full_name ||
    profile?.full_name ||
    user?.user_metadata?.name ||
    (user?.email ? user.email.split("@")[0] : "");

  const firstName = fullName ? fullName.split(" ")[0] : "";

  return (
    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
      Welcome back{firstName ? `, ${firstName}` : ""} 👋
    </h1>
  );
}
