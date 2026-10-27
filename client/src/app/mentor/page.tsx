"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Search } from "lucide-react";

import MentorHeader from "@/components/mentor/mentor-header";
import MentorStats, {
  type MentorStatsData,
} from "@/components/mentor/mentor-stats";
import ProjectTable, {
  type MentorProject,
} from "@/components/mentor/project-table";
import ProjectReviewModal, {
  type ReviewStatus,
} from "@/components/mentor/project-review-modal";
import type { ProjectStatus } from "@/components/mentor/project-status-badge";
import Footer from "@/components/footer/footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type FilterStatus = "ALL" | ProjectStatus;

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ProjectsData = {
  projects?: MentorProject[];
  pagination?: {
    page?: number;
    totalPages?: number;
    total?: number;
  };
  totalPages?: number;
};

const initialStats: MentorStatsData = {
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

const MentorPage = () => {
  const [projects, setProjects] = useState<MentorProject[]>([]);
  const [stats, setStats] = useState<MentorStatsData>(initialStats);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const [selectedProject, setSelectedProject] = useState<MentorProject | null>(
    null,
  );

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const getToken = () => localStorage.getItem("token");

  const fetchProjects = useCallback(async () => {
    if (!API_URL) {
      setError("API URL is missing. Check your .env.local file.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/";
        return;
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
      });

      if (filter !== "ALL") {
        params.set("status", filter);
      }

      const response = await fetch(
        `${API_URL}/mentor/projects?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        },
      );

      const result: ApiResponse<MentorProject[] | ProjectsData> =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load projects.");
      }

      const data = result.data;

      if (Array.isArray(data)) {
        setProjects(data);
        setTotalPages(1);
      } else {
        setProjects(data.projects ?? []);
        setTotalPages(
          Math.max(1, data.pagination?.totalPages ?? data.totalPages ?? 1),
        );
      }
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while loading projects.";

      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, filter]);

  const fetchStats = useCallback(async () => {
    if (!API_URL) {
      return;
    }

    try {
      const token = getToken();

      if (!token) {
        return;
      }

      const response = await fetch(`${API_URL}/mentor/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const result: ApiResponse<MentorStatsData> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load statistics.");
      }

      setStats(result.data);
    } catch (requestError) {
      console.error("Failed to fetch mentor statistics:", requestError);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchProjects();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchProjects]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchStats();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchStats]);

  const handleFilterChange = (nextFilter: FilterStatus) => {
    setFilter(nextFilter);
    setPage(1);
    setNotice("");
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setNotice("");
    fetchProjects();
    fetchStats();
  };

  const handleCloseReview = useCallback(() => {
    if (!reviewSubmitting) {
      setSelectedProject(null);
    }
  }, [reviewSubmitting]);

  const handleReviewSubmit = async (
    status: ReviewStatus,
    reviewNote: string,
  ) => {
    if (!API_URL || !selectedProject) {
      return;
    }

    setReviewSubmitting(true);
    setError("");
    setNotice("");

    try {
      const token = getToken();

      if (!token) {
        window.location.href = "/";
        return;
      }

      const response = await fetch(
        `${API_URL}/mentor/projects/${selectedProject.id}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            reviewNote: reviewNote.trim() || undefined,
          }),
        },
      );

      const result: ApiResponse<unknown> = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit the review.");
      }

      setSelectedProject(null);
      setNotice(
        status === "APPROVED"
          ? "Project approved successfully."
          : "Project rejected successfully.",
      );

      await Promise.all([fetchProjects(), fetchStats()]);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Something went wrong while submitting the review.";

      setError(message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filterOptions: {
    label: string;
    value: FilterStatus;
  }[] = [
    { label: "All Projects", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <MentorHeader />

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-primary">
              MENTOR WORKSPACE
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mentor Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review submissions, track project progress, and give students
              feedback.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </section>

        {error && (
          <div
            role="alert"
            className="flex flex-col justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:flex-row sm:items-center"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={handleRefresh}
              className="self-start font-semibold underline sm:self-auto"
            >
              Try again
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {notice}
          </div>
        )}

        <MentorStats stats={stats} />

        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Manage Submissions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Filter projects by their current review status.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => {
                const active = filter === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleFilterChange(option.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <ProjectTable
            projects={projects}
            loading={loading}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onReview={(project) => {
              setError("");
              setNotice("");
              setSelectedProject(project);
            }}
          />
        </section>

        {!loading && projects.length > 0 && (
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Search size={14} />
            Showing {projects.length} project
            {projects.length === 1 ? "" : "s"} on this page.
          </p>
        )}
      </div>

      <Footer />

      <ProjectReviewModal
        key={selectedProject?.id ?? "no-project"}
        project={selectedProject}
        onClose={handleCloseReview}
        onSubmit={handleReviewSubmit}
        submitting={reviewSubmitting}
      />
    </main>
  );
};

export default MentorPage;
