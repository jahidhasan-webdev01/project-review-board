"use client";

import { Code, ExternalLink, FolderKanban, RefreshCw } from "lucide-react";
import ProjectStatusBadge, { type ProjectStatus } from "./project-status-badge";

export type StudentProject = {
  id: string;
  name: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  reviewNote?: string | null;
  createdAt: string;
};

type StudentProjectListProps = {
  projects: StudentProject[];
  loading: boolean;
  onRefresh: () => void;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function StudentProjectList({
  projects,
  loading,
  onRefresh,
}: StudentProjectListProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Your submissions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Review your submitted projects and mentor feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh projects"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary disabled:opacity-50"
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-16 text-center">
          <RefreshCw size={25} className="animate-spin text-primary" />
          <p className="mt-3 text-sm text-slate-500">
            Loading your projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-primary">
            <FolderKanban size={25} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-900">No projects yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
            Submit your first project using the form to see its review status
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-xl border border-slate-200 p-5 transition hover:border-violet-200"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="break-words font-semibold text-slate-900">
                    {project.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Submitted {formatDate(project.createdAt)}
                  </p>
                </div>

                <ProjectStatusBadge status={project.status} />
              </div>

              <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-4">
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Repository
                  <Code size={14} />
                </a>

                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  Live demo
                  <ExternalLink size={14} />
                </a>
              </div>

              {project.reviewNote && (
                <div
                  className={`mt-5 rounded-xl p-4 ${
                    project.status === "REJECTED"
                      ? "bg-red-50"
                      : project.status === "APPROVED"
                        ? "bg-emerald-50"
                        : "bg-slate-50"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Mentor feedback
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {project.reviewNote}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
