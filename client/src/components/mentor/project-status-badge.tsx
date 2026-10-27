import { CheckCircle2, Clock3, XCircle } from "lucide-react";

export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";

type ProjectStatusBadgeProps = {
  status: ProjectStatus;
};

const statusStyles: Record<ProjectStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 ring-rose-200",
};

const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const statusDetails = {
    PENDING: { label: "Pending", icon: Clock3 },
    APPROVED: { label: "Approved", icon: CheckCircle2 },
    REJECTED: { label: "Rejected", icon: XCircle },
  };

  const { label, icon: Icon } = statusDetails[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[status]}`}
    >
      <Icon size={14} />
      {label}
    </span>
  );
};

export default ProjectStatusBadge;
