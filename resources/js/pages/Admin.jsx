import { useEffect, useState } from "react";
import { api } from "../api/client";
import { MetricCard } from "../components/MetricCard";
import { StatusPill } from "../components/StatusPill";

export function Admin() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    Promise.all([api.adminStats(), api.adminUsers(), api.adminJobs()]).then(([statsPayload, usersPayload, jobsPayload]) => {
      setStats(statsPayload);
      setUsers(usersPayload.users.data);
      setJobs(jobsPayload.jobs.data);
    });
  }, []);

  return (
    <section className="grid gap-6 p-6">
      <div>
        <span className="text-xs font-black uppercase text-teal-700">Admin</span>
        <h1 className="text-3xl font-black">Platform operations</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Users" value={stats?.users_count ?? 0} />
        <MetricCard label="Jobs" value={stats?.jobs_count ?? 0} />
        <MetricCard label="Failed jobs" value={stats?.failed_jobs_count ?? 0} />
        <MetricCard label="Storage" value={`${((stats?.storage_used || 0) / 1024 / 1024).toFixed(2)} MB`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-black">Users</h2>
          {users.map((user) => <div className="border-t border-slate-100 py-3" key={user.id}>{user.name}<span className="ml-2 text-sm text-slate-500">{user.email}</span></div>)}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-xl font-black">Jobs</h2>
          {jobs.map((job) => <div className="flex justify-between border-t border-slate-100 py-3" key={job.id}><span>{job.tool}</span><StatusPill status={job.status} /></div>)}
        </div>
      </div>
    </section>
  );
}

