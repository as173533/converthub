const colors = {
  pending: "bg-slate-100 text-slate-700",
  processing: "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800"
};

export function StatusPill({ status }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${colors[status] || colors.pending}`}>{status}</span>;
}

