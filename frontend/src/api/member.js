const apiUrl = "http://localhost:5000";

export async function memberList(projectId) {
    const res = await fetch(`${apiUrl}/project/member/${projectId}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch members');
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        id: item.Id ?? item.id ?? '',
        name: item.FullName ?? '',
        email: item.Email ?? item.email ?? '',
        taskCount: item.TaskCount ?? item.taskCount ?? 0,
        role: item.Role ?? item.role ?? '',
    }));
}