"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { APPLICATION_STATUS, WORKPLACE_TYPES, PRIORITY_LEVELS } from "@/lib/utils/constants";
import { createApplicationAction } from "@/app/actions/applications";

const ApplicationModalContext = React.createContext({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function useApplicationModal() {
  return React.useContext(ApplicationModalContext);
}

export function ApplicationModalProvider({ children }) {
  const router = useRouter();
  const toast = useToast();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const [formData, setFormData] = React.useState({
    company: "",
    role: "",
    status: APPLICATION_STATUS.APPLIED,
    workplaceType: "Remote",
    location: "",
    salary: "",
    url: "",
    priority: "Medium",
    contactName: "",
    contactEmail: "",
    notes: "",
  });

  const openModal = () => {
    setError("");
    setFormData({
      company: "",
      role: "",
      status: APPLICATION_STATUS.APPLIED,
      workplaceType: "Remote",
      location: "",
      salary: "",
      url: "",
      priority: "Medium",
      contactName: "",
      contactEmail: "",
      notes: "",
    });
    setIsOpen(true);
  };

  // Support ?modal=true URL parameter for testing and direct opening
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("modal") === "true") {
        openModal();
      }
    }
  }, []);

  const closeModal = () => {
    if (isSubmitting) return;
    setIsOpen(false);
    setError("");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.company.trim() || !formData.role.trim()) {
      setError("Please fill in both Company Name and Job Role.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createApplicationAction(formData);
      if (res.success) {
        toast.success(
          "Application Added!",
          `Tracked ${formData.role} at ${formData.company}.`
        );
        closeModal();
        router.refresh();
      } else {
        setError(res.error || "Failed to create application.");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ApplicationModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Add Job Application"
        description="Track a new opportunity in your pipeline with company, role, and salary details."
        maxWidth="max-w-xl"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          {/* Scrollable Form Body with min-h-0 and overflow-y: auto */}
          <ModalBody>
            {error && (
              <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                placeholder="e.g. Stripe, Linear"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                required
                autoFocus
              />
              <Input
                label="Job Role / Title *"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={(e) => handleChange("role", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select
                label="Pipeline Status"
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
                label="Workplace"
                value={formData.workplaceType}
                onChange={(e) => handleChange("workplaceType", e.target.value)}
                options={[
                  { label: "Remote", value: WORKPLACE_TYPES.REMOTE },
                  { label: "Hybrid", value: WORKPLACE_TYPES.HYBRID },
                  { label: "On-site", value: WORKPLACE_TYPES.ONSITE },
                ]}
              />
              <Select
                label="Priority"
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                options={[
                  { label: "High", value: PRIORITY_LEVELS.HIGH },
                  { label: "Medium", value: PRIORITY_LEVELS.MEDIUM },
                  { label: "Low", value: PRIORITY_LEVELS.LOW },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Salary / Compensation (Optional)"
                placeholder="e.g. $165,000 - $190,000"
                value={formData.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
              />
              <Input
                label="Location"
                placeholder="e.g. San Francisco, CA"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            <Input
              label="Job Posting URL"
              type="url"
              placeholder="https://company.com/careers/role"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Recruiter / Contact Name"
                placeholder="e.g. Sarah Miller"
                value={formData.contactName}
                onChange={(e) => handleChange("contactName", e.target.value)}
              />
              <Input
                label="Contact Email"
                type="email"
                placeholder="e.g. sarah@company.com"
                value={formData.contactEmail}
                onChange={(e) => handleChange("contactEmail", e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="modal-notes"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5"
              >
                Notes & Next Steps
              </label>
              <textarea
                id="modal-notes"
                rows={3}
                placeholder="Key notes, referral contact, or interview highlights..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
          </ModalBody>

          {/* Sticky/Fixed Footer - Always visible at the bottom */}
          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={closeModal}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
            >
              Add Application
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </ApplicationModalContext.Provider>
  );
}
