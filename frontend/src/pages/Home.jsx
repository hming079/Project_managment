import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectList, logOut , deleteProject,addProject } from '../api/home';

export default function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Modal state and form
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    leader: '',
    status: '',
    startDate: '',
    dueDate: '',
  });
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
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.slice(0, 5).map((p) => (
                <button key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="w-full text-left px-2 py-1 rounded hover:bg-white/30 transition">
                  {/* {p.id ?? '-'}{p.name ? ` — ${p.name}` : ''} */}
                  {"Project " + p.id }
                </button>
              ))
            ) : (
             <div>No recent projects</div>
            )}
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
                onClick={() => setShowCreate(true)}
                className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              >
                + Create project
              </button>
            </div>
          </div>
           {/* Create project modal */}
          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-8 relative">
                <button
                  onClick={() => setShowCreate(false)}
                  className="absolute right-4 top-4 rounded border px-2 py-1"
                >
                  X
                </button>
                <h2 className="text-2xl font-bold mb-2">Create project</h2>
                <p className="text-sm text-slate-600 mb-6">Required fields are marked with an asterisk</p>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-8">
                    <label className="block font-semibold mb-1">Proj_ID</label>
                    <input
                      value={form.id}
                      onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))}
                      className="mb-4 w-40 px-3 py-2 border rounded bg-slate-50"
                    />

                    <label className="block font-semibold mb-1">Name*</label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                      className="w-full mb-4 px-3 py-2 border rounded"
                      placeholder="Project name"
                    />

                    <label className="block text-xl font-semibold mb-2">Description</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
                      className="w-full h-40 p-3 border rounded"
                      placeholder="Describe the project"
                    />
                  </div>

                  <div className="col-span-4">
                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-3">Details</h3>
                      <label className="block mb-2">Leader:</label>
                      <input
                        value={form.leader}
                        onChange={(e) => setForm((s) => ({ ...s, leader: e.target.value }))}
                        className="w-full px-3 py-2 mb-3 border rounded"
                      />
                      <label className="block mb-2">Status:</label>
                      <input
                        value={form.status}
                        onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
                        className="w-full px-3 py-2 mb-3 border rounded"
                      />
                      <label className="block mb-2">Due date:</label>
                      <input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
                        className="w-full px-3 py-2 mb-3 border rounded"
                      />
                      <label className="block mb-2">Start date:</label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) => setForm((s) => ({ ...s, startDate: e.target.value }))}
                        className="w-full px-3 py-2 mb-3 border rounded"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setShowCreate(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // simple validation
                      if (!form.name.trim()) {
                        alert('Name is required');
                        return;
                      }
                      const newProj = {
                        id: form.id || (projects.length ? Math.max(...projects.map(p => Number(p.id) || 0)) + 1 : Date.now()),
                        name: form.name,
                        leader: form.leader,
                        status: form.status || 'Open',
                        due: form.dueDate || '',
                        description: form.description,
                      };
                      // setProjects((prev) => [newProj, ...prev]);
                      setShowCreate(false);
                      setForm({ id: '', name: '', description: '', leader: '', status: '', startDate: '', dueDate: '' });
                      addProject(form).then(() => {
                        window.location.reload();
                      }).catch((err) => {
                        alert(err.message || 'Failed to create project');
                      });
                    }}
                    className="px-4 py-2 rounded bg-blue-500 text-white"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}

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
                        <td className="p-3">
                          <span
                            className={
                              "inline-block px-2 py-1 rounded text-white text-xs font-semibold " +
                              ((String(p?.status || "").toLowerCase() === "open" && "bg-green-600") ||
                                (["close", "closed"].includes(String(p?.status || "").toLowerCase()) && "bg-red-600") ||
                                "bg-gray-400")
                            }
                          >
                            {p?.status ?? "-"}
                          </span>
                        </td>
                        <td className="p-3">{p?.due ?? '-'}</td>
                        <td className="p-3">
                          <button
                            deleteData = {{id: p.id, name: p.name, description: p.description, leader: p.leader, status: p.status, startDate: p.startDate, dueDate: p.dueDate}}
                            onClick={() => deleteProject(deleteData).then(() => {
                              window.location.reload();
                            }).catch((err) => {
                              alert(err.message || 'Failed to delete project');
                            })}
                            className="text-blue-700 hover:underline"
                          >
                            Delete
                          </button>
                        </td>
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