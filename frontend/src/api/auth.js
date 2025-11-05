const apiUrl = "http://localhost:5000";
export async function login({ email, password }) {
  const res = await fetch(`${apiUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Authentication failed');
  }
  return res.json();
}