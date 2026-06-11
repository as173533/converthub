import { Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../api/client";
import { StatusPill } from "../components/StatusPill";

export function History() {
  const [jobs, setJobs] = useState([]);

  function refresh() {
    api.conversions().then((payload) => setJobs(payload.jobs.data));
  }

  useEffect(refresh, []);

  async function remove(job) {
    await api.deleteConversion(job.id);
    refresh();
  }

  return (
    <section className="grid gap-6 p-6">
      <div>
        <span className="text-xs font-black uppercase text-teal-700">History</span>
        <h1 className="text-3xl font-black">Conversion history</h1>
      </div>
      <div className="overflow-auto rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <table className="w-full text-left">
          <thead><tr className="text-sm text-slate-500"><th className="py-3">File</th><th>Tool</th><th>Status</th><th>Size</th><th>Created</th><th /></tr></thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-slate-100">
                <td className="py-3">{job.original_filename}</td>
                <td>{job.tool}</td>
                <td><StatusPill status={job.status} /></td>
                <td>{Math.round((job.file_size || 0) / 1024)} KB</td>
                <td>{new Date(job.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="flex justify-end gap-2">
                    {job.status === "completed" && <button className="rounded-lg border p-2" title="Download" onClick={() => api.download(job)}><Download size={16} /></button>}
                    <button className="rounded-lg border p-2" title="Delete" onClick={() => remove(job)}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

