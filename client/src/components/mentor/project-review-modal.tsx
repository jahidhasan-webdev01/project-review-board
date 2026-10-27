"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { X, Code, ExternalLink, LoaderCircle } from "lucide-react";
import type { MentorProject } from "./project-table";

export type ReviewStatus = "APPROVED" | "REJECTED";

type ProjectReviewModalProps = {
  project: MentorProject | null;
  onClose: () => void;
  onSubmit: (status: ReviewStatus, reviewNote: string) => Promise<void>;
  submitting: boolean;
};

const ProjectReviewModal = ({
  project,
  onClose,
  onSubmit,
  submitting,
}: ProjectReviewModalProps) => {
  const [status, setStatus] = useState<ReviewStatus>(
    project?.status === "REJECTED" ? "REJECTED" : "APPROVED",
  );

  const [reviewNote, setReviewNote] = useState(project?.reviewNote ?? "");

  useEffect(() => {
    if (!project) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, submitting, onClose]);

  if (!project) {
    return null;
  }

  const student = project.student ?? project.user;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(status, reviewNote);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <h2
              id="review-modal-title"
              className="text-xl font-bold text-slate-900"
            >
              Review Project
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review the submission and provide feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close review modal"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:opacity-40"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 px-6 py-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {project.name}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Submitted by{" "}
                <span className="font-medium text-slate-700">
                  {student?.name || student?.email || "Unknown student"}
                </span>
              </p>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <Code size={17} />
                Repository
                <ExternalLink size={14} />
              </a>

              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
              >
                <ExternalLink size={17} />
                Live Demo
              </a>
            </div>

            <div>
              <label
                htmlFor="review-status"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Review Decision
              </label>

              <select
                id="review-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ReviewStatus)
                }
                disabled={submitting}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
              >
                <option value="APPROVED">Approve Project</option>
                <option value="REJECTED">Reject Project</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="review-note"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Feedback{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>

              <textarea
                id="review-note"
                value={reviewNote}
                onChange={(event) => setReviewNote(event.target.value)}
                disabled={submitting}
                rows={4}
                placeholder="Share feedback with the student..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <LoaderCircle size={16} className="animate-spin" />
              )}
              {submitting ? "Saving..." : "Save Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectReviewModal;
