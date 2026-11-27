"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/providers/auth-provider";
import { supabase } from "@/lib/supabase/client";
import { Download, ShieldCheck, User, LogOut, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const toast = useToast();
  const { user, profile, refreshUser, signOut } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [targetRole, setTargetRole] = React.useState("");
  const [targetSalary, setTargetSalary] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  // Sync state when user session is loaded
  React.useEffect(() => {
    if (user) {
      setFullName(
        user.user_metadata?.full_name ||
          profile?.full_name ||
          user.user_metadata?.name ||
          ""
      );
      setEmail(user.email || "");
      setTargetRole(
        user.user_metadata?.target_role || profile?.target_role || ""
      );
      setTargetSalary(
        user.user_metadata?.target_salary || profile?.target_salary || ""
      );
    }
  }, [user, profile]);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    if (isSaving) return;

    try {
      setIsSaving(true);

      // 1. Update Supabase Auth user_metadata directly in Supabase
      const { data, error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          target_role: targetRole.trim(),
          target_salary: targetSalary.trim(),
        },
      });

      if (error) {
        throw error;
      }

      // 2. Also synchronize to profiles table in Supabase if supported
      if (user?.id) {
        try {
          await supabase.from("profiles").upsert({
            id: user.id,
            full_name: fullName.trim(),
          });
        } catch (tableErr) {
          console.warn("Profiles table synchronization note:", tableErr);
        }
      }

      // 3. Refresh user state in AuthContext so Sidebar & Header update immediately
      await refreshUser();

      toast?.success(
        "Preferences Saved",
        "Your candidate profile and search targets have been updated successfully."
      );
    } catch (err) {
      console.error("Save preferences error:", err);
      toast?.error(
        "Failed to Save",
        err.message || "An unexpected error occurred while saving preferences."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Account & Pipeline Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Manage your job search parameters, profile targets, and application data.
        </p>
      </div>

      {/* Candidate Profile Form Card */}
      <Card>
        <form onSubmit={handleSavePreferences}>
          <CardHeader>
            <CardTitle>Candidate Profile</CardTitle>
            <CardDescription>
              Your current search target criteria and default contact information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSaving}
              />
              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                disabled={true}
                type="email"
                helperText="Email is managed through your Supabase authentication account"
              />
              <Input
                label="Target Role Title"
                placeholder="e.g. Senior Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isSaving}
              />
              <Input
                label="Target Compensation Range"
                placeholder="e.g. $160,000 - $190,000"
                value={targetSalary}
                onChange={(e) => setTargetSalary(e.target.value)}
                disabled={isSaving}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={isSaving}
              disabled={isSaving}
              className="gap-1.5 font-semibold shadow-sm"
            >
              <span>{isSaving ? "Saving..." : "Save Preferences"}</span>
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Account & Session Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account & Session</CardTitle>
          <CardDescription>
            Manage your active session and sign out of ApplyTrack.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Active Session
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Signed in as <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email || "Authenticated User"}</span>
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              disabled={isLoggingOut}
              className="gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 dark:border-slate-700 shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Export / Backup */}
      <Card>
        <CardHeader>
          <CardTitle>Data Export & Privacy</CardTitle>
          <CardDescription>
            Download your entire job search history and pipeline records as structured JSON.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Full Applications Backup
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Includes company notes, recruiter contacts, applied dates, and salary figures.
              </p>
            </div>
            <a
              href="/api/applications"
              target="_blank"
              download="applytrack-backup.json"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shrink-0 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export Raw JSON</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
