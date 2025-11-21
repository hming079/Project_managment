const apiUrl = "http://localhost:5000";

export async function projectList() {
  const email = localStorage.getItem('email');
  const res = await fetch(`${apiUrl}/project/list/${email}`, { method: 'GET' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch projects');
  }
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.Id ?? item.id ?? '',
    name: item.Name ?? item.name ?? '',
    leader: item.Leader ?? item.leader ?? '',
    status: item.Status ?? item.status ?? '',
    due: item.Due ?? item.due ?? '',
  }));
}
export async function logOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  // best-effort notify server if endpoint exists; ignore errors
  fetch(`${apiUrl}/api/auth/logout`, { method: 'POST' }).catch(() => {});
  window.location.replace('/welcome');
}
export async function deleteProject(projectId) {
  const res = await fetch(`${apiUrl}/project/delete/${projectId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to delete project');
  }
  return true;
}
export async function addProject(data) {
  const email = localStorage.getItem('email');
  const res = await fetch(`${apiUrl}/project/create/${email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create project');
  }
  return await res.json();
}