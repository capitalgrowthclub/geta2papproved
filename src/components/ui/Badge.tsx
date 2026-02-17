interface BadgeProps {
  status: "draft" | "in_progress" | "completed" | "waiting_for_client" | "error";
}

const statusConfig = {
  draft: { label: "Draft", className: "bg-slate-100 text-slate-600" },
  in_progress: { label: "In Progress", className: "bg-amber-50 text-amber-700 border border-amber-200" },
  completed: { label: "Completed", className: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  waiting_for_client: { label: "Waiting for Client", className: "bg-blue-50 text-blue-700 border border-blue-200" },
  error: { label: "Error", className: "bg-red-50 text-red-700 border border-red-200" },
};

export default function Badge({ status }: BadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
