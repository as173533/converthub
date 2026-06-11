export function MetricCard({ label, value, helper }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <strong className="mt-2 block text-3xl text-slate-950">{value}</strong>
      {helper && <span className="mt-1 block text-sm text-slate-500">{helper}</span>}
    </article>
  );
}

