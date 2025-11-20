import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectList, logOut } from '../api/home';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await projectList();
        if (mounted) setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load projects');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => {
      const id = p?.id != null ? String(p.id).toLowerCase() : '';
      const name = p?.name?.toLowerCase() ?? '';
      const leader = p?.leader?.toLowerCase() ?? '';
      return id.includes(q) || name.includes(q) || leader.includes(q);
    });
  }, [projects, query]);
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">Error: {error}</div>;
  }
  return (
    <div className="min-h-screen flex bg-blue-50 text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-200 border-r border-slate-300 p-6">
        <div className="mb-8">
          <div className="text-xl font-semibold mb-6">Project Manager</div>
        </div>
        <nav className="space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-white/40 hover:bg-white/50">
            <span className="text-lg">🏠</span>
            <span>My project</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
            <span className="text-lg">🔔</span>
            <span>Notification</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
            <span className="text-lg">🗄️</span>
            <span>Archive</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
            <span className="text-lg">🕘</span>
            <span>Recent</span>
          </button>

          <div className="mt-6 text-sm text-slate-600 space-y-2 pl-8">
            <div>Project 1</div>
            <div>Project 2</div>
          </div>
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 w-1/2">
            <div className="flex items-center w-full bg-blue-100 border border-slate-300 rounded-lg px-3 py-2">
              <span className="text-slate-500 mr-2">🔍</span>
              <input
                aria-label="global-search"
                className="bg-transparent outline-none w-full text-sm"
                placeholder="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-blue-100">🔔</button>
            <button className="p-2 rounded-full hover:bg-blue-100">👤</button>
            <button className="p-2 rounded-full hover:bg-blue-100" onClick={logOut}>Log out</button>
          </div>
        </header>

        {/* Content */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Projects</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/80 border border-slate-300 rounded-lg px-4 py-2">
                <span className="mr-2">🔍</span>
                <input
                  aria-label="project-search"
                  className="bg-transparent outline-none text-sm"
                  placeholder="Search project"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                onClick={() => navigate('/projects/create')}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                + Create project
              </button>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-400">
            <table className="w-full table-fixed text-sm">
              <thead className="bg-blue-700 text-white">
                <tr>
                  <th className="p-4 text-left rounded-tl-lg w-24">Proj_ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Leader</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Due date</th>
                  <th className="p-4 text-left rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="bg-blue-100">
                {Array.isArray(filtered) && filtered.length > 0
                  ? filtered.map((p, i) => (
                      <tr key={p?.id ?? `project-${i}`} className="border-t border-slate-300">
                        <td className="p-3">{p?.id ?? '-'}</td>
                        <td className="p-3">{p?.name ?? '-'}</td>
                        <td className="p-3">{p?.leader ?? '-'}</td>
                        <td className="p-3">{p?.status ?? '-'}</td>
                        <td className="p-3">{p?.due ?? '-'}</td>
                        <td className="p-3">...</td>
                      </tr>
                    ))
                  : null}

                {filtered.length === 0 && (
                  <tr key="no-projects">
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}