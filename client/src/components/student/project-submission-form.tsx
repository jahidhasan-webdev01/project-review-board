"use client";

import type { FormEvent } from "react";
import { ArrowUpRight, Plus, RefreshCw } from "lucide-react";

export type ProjectFormData = {
  projectName: string;
  repositoryUrl: string;
  liveUrl: string;
  description: string;
};

type ProjectSubmissionFormProps = {
  formData: ProjectFormData;
  setFormData: (data: ProjectFormData) => void;
  submitting: boolean;
  error: string;
  success: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function ProjectSubmissionForm({
  formData,
  setFormData,
  submitting,
  error,
  success,
  onSubmit,
}: ProjectSubmissionFormProps) {
  const updateField = (field: keyof ProjectFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-primary">
          <Plus size={22} />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Submit a project
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Share your project for mentor review.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="projectName"
            className="text-sm font-medium text-slate-700"
          >
            Project name
          </label>
          <input
            id="projectName"
            required
            minLength={2}
            maxLength={100}
            value={formData.projectName}
            onChange={(event) => updateField("projectName", event.target.value)}
            placeholder="e.g. E-commerce platform"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="repositoryUrl"
            className="text-sm font-medium text-slate-700"
          >
            Repository URL
          </label>
          <input
            id="repositoryUrl"
            type="url"
            required
            value={formData.repositoryUrl}
            onChange={(event) =>
              updateField("repositoryUrl", event.target.value)
            }
            placeholder="https://github.com/username/project"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="liveUrl"
            className="text-sm font-medium text-slate-700"
          >
            Live project URL
          </label>
          <input
            id="liveUrl"
            type="url"
            required
            value={formData.liveUrl}
            onChange={(event) => updateField("liveUrl", event.target.value)}
            placeholder="https://your-project.vercel.app"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Project description
          </label>
          <textarea
            id="description"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe your project, its features, and the technologies you used..."
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <p className="text-right text-xs text-slate-400">
            {formData.description.length}/2000
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {success && (
          <p
            role="status"
            className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700"
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <RefreshCw size={17} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit project
              <ArrowUpRight size={17} />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
