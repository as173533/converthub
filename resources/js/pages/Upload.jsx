import { UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { StatusPill } from "../components/StatusPill";

export function Upload() {
  const [params] = useSearchParams();
  const [tools, setTools] = useState([]);
  const [tool, setTool] = useState(params.get("tool") || "image-to-pdf");
  const [file, setFile] = useState(null);
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.tools().then((payload) => setTools(payload.tools));
  }, []);

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = await api.upload(tool, file);
      setJob(payload.job);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="grid gap-6 p-6">
      <div>
        <span className="text-xs font-black uppercase text-teal-700">Upload</span>
        <h1 className="text-3xl font-black">Queue a conversion</h1>
      </div>
      <form onSubmit={submit} className="grid max-w-3xl gap-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <label className="grid gap-2 font-semibold">
          Tool
          <select className="rounded-lg border border-slate-300 px-3 py-3" value={tool} onChange={(event) => setTool(event.target.value)}>
            {tools.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <label className="relative grid min-h-56 place-items-center rounded-lg border border-dashed border-teal-400 bg-teal-50/50 p-6 text-center">
          <UploadCloud className="text-teal-700" size={42} />
          <strong>{file ? file.name : "Drop or choose a file"}</strong>
          <span className="text-sm text-slate-500">PDF, JPG, PNG, WEBP, DOCX up to configured limit</span>
          <input className="absolute inset-0 opacity-0" type="file" onChange={(event) => setFile(event.target.files?.[0])} />
        </label>
        {error && <p className="font-semibold text-red-700">{error}</p>}
        <button disabled={!file} className="rounded-lg bg-teal-700 px-5 py-3 font-bold text-white disabled:bg-slate-300">Create job</button>
      </form>
      {job && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <strong>Job #{job.id} created</strong>
          <div className="mt-3"><StatusPill status={job.status} /></div>
        </div>
      )}
    </section>
  );
}

