import { MOCK_USER } from "@/lib/auth/session";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, ShieldCheck, User } from "lucide-react";

export const metadata = {
  title: "Settings & Preferences",
};

export default function SettingsPage() {
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

      {/* Profile Card */}
      <Card>
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
              defaultValue={MOCK_USER.name}
            />
            <Input
              label="Email Address"
              defaultValue={MOCK_USER.email}
              type="email"
            />
            <Input
              label="Target Role Title"
              defaultValue={MOCK_USER.targetRole}
            />
            <Input
              label="Target Compensation Range"
              defaultValue={MOCK_USER.targetSalary}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="default" size="sm">
            Save Preferences
          </Button>
        </CardFooter>
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
