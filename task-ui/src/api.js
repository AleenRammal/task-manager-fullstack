const BASE = import.meta.env.VITE_API_URL;

async function readError(res) {
  const data = await res.json().catch(() => ({}));
  return data.error || data.message || `Request failed (${res.status})`;
}

export async function getTasks() {
  const res = await fetch(`${BASE}/api/tasks`);
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await readError(res));
  return res.json();
}

export async function updateTask(id, updates) {
  const res = await fetch(`${BASE}/api/tasks/${id}`, {
    method: "PUT", // ✅ your backend uses PUT
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE}/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res));
  return true;
}
export async function getTaskById(id) {
  const res = await fetch(`${BASE}/api/tasks/${id}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to fetch task (${res.status})`);
  }
  return res.json();
}