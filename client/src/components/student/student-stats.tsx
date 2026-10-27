import { CheckCircle2, Clock3, FolderKanban, XCircle } from "lucide-react";
import type { ProjectStatus } from "./project-status-badge";

type StudentStatsProps = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

export default function StudentStats({
  total,
  pending,
  approved,
  rejected,
}: StudentStatsProps) {
  const cards = [
    {
      label: "Total projects",
      value: total,
      icon: FolderKanban,
      border: "border-slate-200",
      iconColor: "text-primary",
    },
    {
      label: "Pending",
      value: pending,
      icon: Clock3,
      border: "border-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Approved",
      value: approved,
      icon: CheckCircle2,
      border: "border-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Rejected",
      value: rejected,
      icon: XCircle,
      border: "border-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className={`rounded-2xl border ${card.border} bg-white p-5 shadow-sm`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-slate-500">{card.label}</span>
              <Icon size={19} className={card.iconColor} />
            </div>

            <p className="mt-4 text-3xl font-semibold text-slate-900">
              {card.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
