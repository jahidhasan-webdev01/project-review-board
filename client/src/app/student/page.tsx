"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import Footer from "@/components/footer/footer";
import StudentHeader from "@/components/student/student-header";
import StudentStats from "@/components/student/student-stats";
import ProjectSubmissionForm, {
  type ProjectFormData,
} from "@/components/student/project-submission-form";
import StudentProjectList, {
  type StudentProject,
} from "@/components/student/student-project-list";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialFormData: ProjectFormData = {
  projectName: "",
  repositoryUrl: "",
  liveUrl: "",
  description: "",
};

export default function StudentDashboard() {
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
      return;
    }

    try {
      const response = await fetch(`${API_URL}/projects/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        setError(result.message || "Unable to load your projects.");
        return;
      }

      setProjects(result.data);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProjects();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchProjects]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return;
      }

      if (!response.ok) {
        setError(result.message || "Project submission failed.");
        return;
      }

      setFormData(initialFormData);
      setSuccess("Your project has been submitted successfully.");

      await fetchProjects();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const pending = projects.filter(
    (project) => project.status === "PENDING",
  ).length;

  const approved = projects.filter(
    (project) => project.status === "APPROVED",
  ).length;

  const rejected = projects.filter(
    (project) => project.status === "REJECTED",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50/80 font-sans">
      <StudentHeader />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Student workspace</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Your projects
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Submit your work, follow its review progress, and use mentor
            feedback to improve your projects.
          </p>
        </div>

        <StudentStats
          total={projects.length}
          pending={pending}
          approved={approved}
          rejected={rejected}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <ProjectSubmissionForm
              formData={formData}
              setFormData={setFormData}
              submitting={submitting}
              error={error}
              success={success}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="lg:sticky lg:top-6">
            <div className="lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-3">
              <StudentProjectList
                projects={projects}
                loading={loading}
                onRefresh={fetchProjects}
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}
