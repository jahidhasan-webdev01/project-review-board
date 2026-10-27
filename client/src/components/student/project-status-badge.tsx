import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

const statusStyles: Record<ProjectStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-red-50 text-red-700 ring-red-200",
};

const statusIcons = {
  PENDING: Clock3,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
};

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
};

export default function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps) {
  const Icon = statusIcons[status];

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <Icon size={13} />
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
