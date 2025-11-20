const apiUrl = "http://localhost:5000";

export async function taskList(projectId) {
    const res = await fetch(`${apiUrl}/project/task/${projectId}`, { method: 'GET' });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to fetch tasks');
    }
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
        id: item.TaskId ?? item.id ?? '',
        name: item.Name ?? item.title ?? '',
        assignee: item.FullName ?? item.assignee ?? '',
        status: item.Status ?? item.status ?? '',
        dueDate: item.DueDate ?? item.dueDate ?? '',
    }));
}