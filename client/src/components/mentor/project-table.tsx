"use client";

import {
  ExternalLink,
  Eye,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import ProjectStatusBadge, { type ProjectStatus } from "./project-status-badge";

export type MentorProject = {
  id: string;
  name: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
  status: ProjectStatus;
  reviewNote?: string | null;
  createdAt: string;
  reviewedBy?: {
    name?: string;
    email?: string;
  } | null;
  student?: {
    name?: string;
    email?: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
};

type ProjectTableProps = {
  projects: MentorProject[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReview: (project: MentorProject) => void;
};

const ProjectTable = ({
  projects,
  loading,
  page,
  totalPages,
  onPageChange,
  onReview,
}: ProjectTableProps) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStudent = (project: MentorProject) => {
    const student = project.student ?? project.user;

    return {
      name: student?.name || "Unknown student",
      email: student?.email || "No email provided",
    };
  };

  const getReviewer = (project: MentorProject) => {
    if (project.status === "PENDING") {
      return "Not assigned";
    }

    return (
      project.reviewedBy?.name ||
      project.reviewedBy?.email ||
      "Reviewer information unavailable"
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Project Submissions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Review student projects and their submission details.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Project</th>
              <th className="px-5 py-4 font-semibold">Student</th>
              <th className="px-5 py-4 font-semibold">Submitted</th>
              <th className="px-5 py-4 text-center font-semibold">
                Repository
              </th>
              <th className="px-5 py-4 text-center font-semibold">Live Demo</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Reviewed By</th>
              <th className="px-5 py-4 text-right font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-slate-500"
                >
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project) => {
                const student = getStudent(project);

                return (
                  <tr
                    key={project.id}
                    className="transition hover:bg-violet-50/40"
                  >
                    <td className="max-w-[220px] px-5 py-4">
                      <p className="truncate font-semibold text-slate-900">
                        {project.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {project.description}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {student.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {student.email}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatDate(project.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <a
                        href={project.repositoryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open repository for ${project.name}`}
                        title="Open repository"
                        className="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-violet-100 hover:text-violet-700"
                      >
                        <Code size={19} />
                      </a>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open live demo for ${project.name}`}
                        title="Open live demo"
                        className="inline-flex rounded-lg p-2 text-slate-600 transition hover:bg-violet-100 hover:text-violet-700"
                      >
                        <ExternalLink size={19} />
                      </a>
                    </td>

                    <td className="px-5 py-4">
                      <ProjectStatusBadge status={project.status} />
                    </td>

                    <td className="max-w-[170px] px-5 py-4 text-slate-600">
                      <span className="block truncate">
                        {getReviewer(project)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => onReview(project)}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:px-6">
          <p className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-800">{page}</span> of{" "}
            <span className="font-semibold text-slate-800">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectTable;
