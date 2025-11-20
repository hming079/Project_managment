import { useState, useMemo, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { logOut } from "../api/home";
import { projectList } from "../api/home";
import { memberList } from "../api/member";
export default function Member() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
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
    async function loadMembers() {
      setLoading(true);
      try {
                if (!projectId) {
          if (mounted) setMembers([]);
          return;
        }
        const data = await memberList(projectId);
        if (mounted) {
          setMembers(Array.isArray(data) ? data : []);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load members');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadMembers();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q)
    );
  }, [members, query]);

  function changeRole(id, role) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  }

  function removeMember(id) {
    if (!confirm("Remove this member?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  function onAddPeople() {
    // navigate to add people page or open modal
    navigate("/project/add-member");
  }

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
            <h2 className="text-2xl font-bold">Project 3</h2>

            <div className="flex items-center gap-4">
              <nav className="flex items-center gap-6 text-sm">
                <button className="px-4 py-1 rounded-full bg-[#3b6aa8] text-white">Member</button>
                <button className="text-[#244a78]/80">Summary</button>
                <button className="text-[#244a78]/80">List</button>
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
                onClick={onAddPeople}
                className="bg-[#4a86d6] text-white px-4 py-2 rounded-md"
              >
                + Add people
              </button>
            </div>
          </div>
        </div>

        {/* table header */}
        <div className="border-t border-b border-[#9fb7df] py-3 mb-4 grid grid-cols-12 gap-4 items-center text-sm">
          <div className="col-span-4 font-medium">Name</div>
          <div className="col-span-2 font-medium">Email</div>
          <div className="col-span-2 font-medium">Task count</div>
          <div className="col-span-2 font-medium">Role</div>
          <div className="col-span-2 font-medium text-right">Action</div>
        </div>

        {/* content */}
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-[#244a78]/70">No members found.</div>
        ) : (
          <div className="space-y-6">
            {filtered.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-12 items-center gap-4 border-b border-[#e6eef9] last:border-b-0"
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#244a78] border border-[#9fb7df]">
                    {/* simple avatar initial */}
                    <span className="font-semibold">{m.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="font-medium">{m.name}</div>
                  </div>
                </div>

                <div className="col-span-2 text-sm text-[#244a78]/70">{m.email || "-"}</div>
                <div className="col-span-2 text-sm text-[#244a78]/70">{m.taskCount ?? "-"}</div>

                <div className="col-span-2">
                  {m.role || "-"}
                  {/* <select
                    value={m.role}
                    onChange={(e) => changeRole(m.id, e.target.value)}
                    className="px-3 py-1 rounded bg-white border border-[#c9d9f0]"
                  >
                    <option>PM</option>
                    <option>Participant</option>
                    <option>Admin</option>
                  </select> */}
                </div>

                <div className="col-span-2 text-right">
                  <button
                    onClick={() => removeMember(m.id)}
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