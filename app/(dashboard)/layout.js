import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ApplicationModalProvider } from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: {
    default: "ApplyTrack — Job Application Tracker",
    template: "%s | ApplyTrack",
  },
  description: "Track, manage, and accelerate your job search pipeline.",
};

export default function DashboardLayout({ children }) {
  return (
    <ToastProvider>
      <ApplicationModalProvider>
        <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:flex sticky top-0" />

          {/* Content Viewport */}
          <div className="flex flex-1 flex-col min-w-0">
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </ApplicationModalProvider>
    </ToastProvider>
  );
}
