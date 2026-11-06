"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building,
  DollarSign,
  Link as LinkIcon,
  Mail,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  APPLICATION_STATUS,
  WORKPLACE_TYPES,
  PRIORITY_LEVELS,
} from "@/lib/utils/constants";
import { createApplicationAction } from "@/app/actions/applications";

export function ApplicationForm({ initialData = null, onSuccess, onCancel }) {
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = React.useState({
    company: initialData?.company || "",
    role: initialData?.role || "",
    status: initialData?.status || APPLICATION_STATUS.APPLIED,
    workplaceType: initialData?.workplaceType || WORKPLACE_TYPES.REMOTE,
    location: initialData?.location || "",
    salary: initialData?.salary || "",
    url: initialData?.url || "",
    stage: initialData?.stage || "Application Submitted",
    priority: initialData?.priority || PRIORITY_LEVELS.MEDIUM,
    contactName: initialData?.contactName || "",
    contactEmail: initialData?.contactEmail || "",
    notes: initialData?.notes || "",
    appliedDate: initialData?.appliedDate
      ? initialData.appliedDate.split("T")[0]
      : todayStr,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.company.trim()) {
      setError("Company Name is required.");
      return;
    }

    if (!formData.role.trim()) {
      setError("Job Role / Title is required.");
      return;
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url.trim());
      } catch {
        setError("Please enter a valid URL (including https://).");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const res = await createApplicationAction({
        ...formData,
        appliedDate: new Date(formData.appliedDate).toISOString(),
      });

      if (res.success) {
        toast?.success("Opportunity Tracked!", `Successfully logged ${formData.role} at ${formData.company}.`);
        if (onSuccess) {
          onSuccess(res.data);
        } else {
          router.push("/applications");
          router.refresh();
        }
      } else {
        setError(res.error || "Failed to save application.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300">
          {error}
        </div>
      )}

      {/* Section 1: Role & Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role & Company Information</CardTitle>
          <CardDescription>
            Specify the position and organization you are applying to.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              placeholder="e.g. Stripe, Linear, Figma"
              icon={Building}
              value={formData.company}
              onChange={(e) => handleChange("company", e.target.value)}
              required
              autoFocus
            />
            <Input
              label="Job Role / Title *"
              placeholder="e.g. Staff Full-Stack Engineer"
              icon={Briefcase}
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Job Posting URL"
              type="url"
              placeholder="https://company.com/careers/job"
              icon={LinkIcon}
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              helperText="Direct link to the job specification or posting"
            />
            <Input
              label="Location"
              placeholder="e.g. San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Workplace Arrangement"
              value={formData.workplaceType}
              onChange={(e) => handleChange("workplaceType", e.target.value)}
              options={[
                { label: "Remote", value: WORKPLACE_TYPES.REMOTE },
                { label: "Hybrid", value: WORKPLACE_TYPES.HYBRID },
                { label: "On-site", value: WORKPLACE_TYPES.ONSITE },
              ]}
            />
            <Input
              label="Date Applied"
              type="date"
              icon={Calendar}
              value={formData.appliedDate}
              onChange={(e) => handleChange("appliedDate", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Pipeline Status & Compensation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Status & Compensation</CardTitle>
          <CardDescription>
            Track your interview stage progression and target salary expectations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Initial Status"
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              options={[
                { label: "Wishlist", value: APPLICATION_STATUS.WISHLIST },
                { label: "Applied", value: APPLICATION_STATUS.APPLIED },
                { label: "Interviewing", value: APPLICATION_STATUS.INTERVIEWING },
                { label: "Offer", value: APPLICATION_STATUS.OFFER },
                { label: "Rejected", value: APPLICATION_STATUS.REJECTED },
              ]}
            />
            <Select
              label="Target Priority"
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              options={[
                { label: "High Priority", value: PRIORITY_LEVELS.HIGH },
                { label: "Medium Priority", value: PRIORITY_LEVELS.MEDIUM },
                { label: "Low Priority", value: PRIORITY_LEVELS.LOW },
              ]}
            />
            <Input
              label="Compensation / Salary"
              placeholder="e.g. $180,000 - $210,000"
              icon={DollarSign}
              value={formData.salary}
              onChange={(e) => handleChange("salary", e.target.value)}
            />
          </div>

          <Input
            label="Current Interview Stage"
            placeholder="e.g. Recruiter Screen, Technical Assessment, System Design"
            value={formData.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
            helperText="The immediate milestone or next step in the interview cycle"
          />
        </CardContent>
      </Card>

      {/* Section 3: Point of Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Primary Point of Contact</CardTitle>
          <CardDescription>
            Keep track of the recruiter, hiring manager, or internal referral.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Contact Name"
              placeholder="e.g. Sarah Miller (Tech Recruiter)"
              icon={User}
              value={formData.contactName}
              onChange={(e) => handleChange("contactName", e.target.value)}
            />
            <Input
              label="Contact Email"
              type="email"
              placeholder="e.g. sarah.miller@company.com"
              icon={Mail}
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Notes & Research */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notes & Preparation</CardTitle>
          <CardDescription>
            Record interview feedback, referral discussions, and follow-up items.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="app-form-notes"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
          >
            Notes & Preparation
          </label>
          <textarea
            id="app-form-notes"
            rows={4}
            placeholder="Add key talking points, company tech stack details, questions asked, or follow-up deadlines..."
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel || (() => router.back())}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="default"
          isLoading={isSubmitting}
          className="shadow-sm font-semibold"
        >
          Save Application
        </Button>
      </div>
    </form>
  );
}
