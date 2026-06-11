import { FileImage, FileText, FolderArchive, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { MetricCard } from "../components/MetricCard";
import { StatusPill } from "../components/StatusPill";

function bytes(value = 0) {
  return `${(Number(value || 0) / 1024 / 1024).toFixed(2)} MB`;
}

export function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.dashboard().then(setStats);
  }, []);

  return (
    <section className="grid gap-6 p-6">
      <div>
        <span className="text-xs font-black uppercase text-teal-700">Dashboard</span>
        <h1 className="text-3xl font-black">Conversion overview</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Total conversions" value={stats?.total_conversions ?? 0} />
        <MetricCard label="Failed conversions" value={stats?.failed_conversions ?? 0} />
        <MetricCard label="Storage used" value={bytes(stats?.storage_used)} />
        <MetricCard label="Recent jobs" value={stats?.recent_conversions?.length ?? 0} />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[[FileImage, "Image tools"], [FileText, "PDF tools"], [FolderArchive, "Compression"], [Gauge, "Queue status"]].map(([Icon, label]) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="text-teal-700" />
            <strong className="mt-3 block">{label}</strong>
            <span className="text-sm text-slate-500">Available</span>
          </article>
        ))}
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-black">Recent conversions</h2>
        <div className="overflow-auto">
          <table className="w-full text-left">
            <tbody>
              {(stats?.recent_conversions || []).map((job) => (
                <tr className="border-t border-slate-100" key={job.id}>
                  <td className="py-3">{job.original_filename}</td>
                  <td>{job.tool}</td>
                  <td><StatusPill status={job.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

