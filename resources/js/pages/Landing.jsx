import { ArrowRight, FileStack, ShieldCheck, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export function Landing() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f7f9fb_0%,#e8f3ef_55%,#f7eee8_100%)]">
      <section className="grid min-h-[92vh] items-center gap-12 px-6 py-14 lg:grid-cols-[1fr_520px] lg:px-20">
        <div>
          <span className="text-xs font-black uppercase text-teal-700">ConvertHub Pro</span>
          <h1 className="mt-3 max-w-4xl text-5xl font-black leading-none tracking-normal text-slate-950 lg:text-7xl">
            File conversion built for SaaS teams
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Upload images and PDFs, queue heavy conversion work through Redis, and give every user a clean history of
            secure downloads.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 font-bold text-white">
              Start converting <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-bold">
              Login
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white/90 p-7 shadow-sm">
            <FileStack size={44} />
            <span className="font-black">PDF</span>
            <span className="font-black">PNG</span>
            <span className="font-black">WEBP</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm">
            <Zap className="text-teal-700" />
            <strong className="mt-3 block">Queue-first processing</strong>
            <p className="mt-2 text-slate-600">Controllers create jobs. Laravel workers do the heavy lifting.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm">
            <ShieldCheck className="text-teal-700" />
            <strong className="mt-3 block">Sanctum protected API</strong>
            <p className="mt-2 text-slate-600">Profiles, history, admin views, and downloads stay authenticated.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

