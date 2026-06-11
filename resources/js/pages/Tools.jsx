import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export function Tools() {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    api.tools().then((payload) => setTools(payload.tools));
  }, []);

  return (
    <section className="grid gap-6 p-6">
      <div>
        <span className="text-xs font-black uppercase text-teal-700">Tools</span>
        <h1 className="text-3xl font-black">Conversion tools</h1>
      </div>
      <div className="grid gap-3">
        {tools.map((tool) => (
          <article key={tool.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <strong>{tool.label}</strong>
              <span className="ml-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{tool.group}</span>
              <p className="mt-1 text-sm text-slate-500">Output: {tool.output}</p>
            </div>
            <Link className="rounded-lg border border-slate-300 px-4 py-2 font-bold" to={`/upload?tool=${tool.id}`}>Use tool</Link>
          </article>
        ))}
      </div>
    </section>
  );
}

