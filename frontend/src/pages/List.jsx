import { useState, useMemo, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { logOut } from "../api/home";
import { projectList } from "../api/home";
import { taskList } from "../api/task";
export default function List() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const {id: projectId} = useParams();
  // mock load (replace with real API call)
    useEffect(() => {
      let mounted = true;
      async function loadProject() {
        try {
          const data = await projectList();
          if (mounted) setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
          if (mounted) setError(err.message || 'Failed to load projects');
        } 
      }
      loadProject();
      return () => {
        mounted = false;
      };
    }, []);
  useEffect(() => {
    let mounted = true;
    async function loadTasks() {
      setLoading(true);
      try {
        if (!projectId) {
          if (mounted) setTasks([]);
          return;
        }
        const data = await taskList(projectId);
        if (mounted) {
          setTasks(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load members');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadTasks();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tasks;
    return tasks.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.email || "").toLowerCase().includes(q)
    );
  }, [tasks, query]);

  return (
    <div className="min-h-screen flex bg-[#dfe8f6] text-[#244a78]">
      {/* Sidebar */}
            <aside className="w-64 bg-blue-200 border-r border-slate-300 p-6">
        <div className="mb-8">
          <div className="text-xl font-semibold mb-6">Project Manager</div>
        </div>
        <nav className="space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
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

          {/* <div className="mt-6 text-sm text-slate-600 space-y-2 pl-8">
            <div>Project 1</div>
            <div>Project 2</div>
          </div> */}
            <div className="mt-6 text-sm text-slate-600 space-y-2 pl-8">
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.slice(0, 5).map((p) => (
                <button 
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className={"w-full text-left px-2 py-1 rounded  transition" + (String(p.id) === String(projectId) ? "bg-white/40 hover:bg-white/50" : "hover:bg-white/30")}>
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

      {/* Main */}
      <div className="flex-1 p-8">
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

        {/* title + tabs */}
        <section>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Project {projectId}</h2>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-6 text-sm">
                <button className="text-[#244a78]/80" onClick={() => navigate(`/projects/${projectId}`)}>Member</button>
                <button className="text-[#244a78]/80">Summary</button>
                <button className="px-4 py-1 rounded-full bg-[#3b6aa8] text-white">List</button>
                <button className="text-[#244a78]/80">Board</button>
              </nav>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="max-w-md w-full">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#244a78]/60">🔍</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search list"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#9fb7df] bg-white/80"
                />
              </div>
            </div>

            <div>
              <button
                // onClick={onAddTask}
                className="bg-[#4a86d6] text-white px-4 py-2 rounded-md"
              >
                + Add Task
              </button>
            </div>
          </div>
        </div>

        {/* table header */}
        <div className="border-t border-b border-[#9fb7df] py-3 mb-4 grid grid-cols-12 gap-4 items-center text-sm">
          <div className="col-span-2 font-medium">Task ID</div>
          <div className="col-span-2 font-medium">Name</div>
          <div className="col-span-2 font-medium">Assignee</div>
          <div className="col-span-2 font-medium">Status</div>
          <div className="col-span-2 font-medium">Due date</div>
          <div className="col-span-2 font-medium text-right">Action</div>
        </div>

        {/* content */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-[#244a78]/70">No tasks found.</div>
        ) : (
          <div className="space-y-6">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-12 items-center gap-4 border-b border-[#e6eef9] last:border-b-0"
              >
                <div className="col-span-2 flex items-center gap-4">
                    <div className="font-medium">{m.id}</div>
                </div>

                <div className="col-span-2 text-sm text-[#244a78]/70">{m.name || "-"}</div>
                <div className="col-span-2 text-sm text-[#244a78]/70">{m.assignee ?? "-"}</div>

                <div className="col-span-2 text-sm text-[#244a78]/70">{m.status || "-"}</div>
                <div className="col-span-2 text-sm text-[#244a78]/70">{m.dueDate || "-"}</div>

                <div className="col-span-2 text-right">
                  <button
                    // onClick={() => removeMember(m.id)}
                    className="text-[#1f497d] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </section>
      </div>
    </div>
  );
}