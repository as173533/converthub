import { ArrowDown, ArrowUp, RotateCw, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "../api/client";
import { StatusPill } from "../components/StatusPill";

export function PdfEditor() {
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([1, 2, 3, 4]);
  const [operations, setOperations] = useState([]);
  const [job, setJob] = useState(null);

  function addOperation(operation) {
    setOperations((items) => [...items, operation]);
    if (operation.type === "delete") setPages((items) => items.filter((page) => page !== operation.page));
  }

  async function save() {
    const payload = await api.pdfEditor(file, operations);
    setJob(payload.job);
  }

  return (
    <section className="grid gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-teal-700">PDF editor</span>
          <h1 className="text-3xl font-black">Page operations</h1>
        </div>
        <button disabled={!file} onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 font-bold text-white disabled:bg-slate-300">
          <Save size={18} /> Save PDF
        </button>
      </div>
      <label className="block w-fit rounded-lg border border-slate-200 bg-white px-5 py-3 font-bold shadow-sm">
        <input className="hidden" type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0])} />
        {file ? file.name : "Choose PDF"}
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        {pages.map((page) => (
          <article key={page} className="flex min-h-36 items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <strong>Page {page}</strong>
            <div className="flex gap-2">
              <button title="Rotate" className="rounded-lg border p-2" onClick={() => addOperation({ type: "rotate", page, degrees: 90 })}><RotateCw size={16} /></button>
              <button title="Move up" className="rounded-lg border p-2" onClick={() => addOperation({ type: "move-up", page })}><ArrowUp size={16} /></button>
              <button title="Move down" className="rounded-lg border p-2" onClick={() => addOperation({ type: "move-down", page })}><ArrowDown size={16} /></button>
              <button title="Delete" className="rounded-lg border p-2" onClick={() => addOperation({ type: "delete", page })}><Trash2 size={16} /></button>
            </div>
          </article>
        ))}
      </div>
      {job && <div className="rounded-lg border bg-white p-5 shadow-sm"><StatusPill status={job.status} /> PDF edit job queued.</div>}
    </section>
  );
}

