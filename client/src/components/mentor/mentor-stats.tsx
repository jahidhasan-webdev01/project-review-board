import { FolderKanban, Clock3, CheckCircle2, XCircle } from "lucide-react";

export type MentorStatsData = {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
};

type MentorStatsProps = {
  stats: MentorStatsData;
};

const MentorStats = ({ stats }: MentorStatsProps) => {
  const statCards = [
    {
      label: "Total Projects",
      value: stats.total,
      icon: FolderKanban,
      iconClass: "bg-violet-100 text-violet-700",
    },
    {
      label: "Pending Review",
      value: stats.pending,
      icon: Clock3,
      iconClass: "bg-amber-100 text-amber-700",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: CheckCircle2,
      iconClass: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      iconClass: "bg-rose-100 text-rose-700",
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                  {stat.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClass}`}
              >
                <Icon size={23} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default MentorStats;
