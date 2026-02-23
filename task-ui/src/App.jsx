// import { useEffect, useMemo, useState } from "react";
// import { createTask, deleteTask, getTasks, updateTask, getTaskById } from "./api";
// import "./App.css";

// const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
// const STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

// function formatDate(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return String(iso);
//   return d.toISOString().slice(0, 10);
// }

// function pillClass(kind, value) {
//   if (kind === "priority") return `pill pill--${value.toLowerCase()}`;
//   if (kind === "status") return `pill pill--${value.toLowerCase()}`;
//   return "pill";
// }

// export default function App() {
//   const [tasks, setTasks] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   // form state
//   const [taskName, setTaskName] = useState("");
//   const [description, setDescription] = useState("");
//   const [assignedUser, setAssignedUser] = useState("");
//   const [dueDate, setDueDate] = useState("");
//   const [priority, setPriority] = useState("MEDIUM");
//   const [status, setStatus] = useState("PENDING");
//   const [findId, setFindId] = useState("");
//   const [foundTask, setFoundTask] = useState(null);

//   const completedCount = useMemo(
//     () => tasks.filter((t) => t.status === "COMPLETED").length,
//     [tasks]
//   );

//   async function loadTasks() {
//     setError("");
//     setLoading(true);
//     try {
//       const data = await getTasks();
//       setTasks(Array.isArray(data) ? data : data.tasks ?? []);
//     } catch (e) {
//       setError(e.message || "Failed to load tasks");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadTasks();
//   }, []);

//   async function onAdd(e) {
//     e.preventDefault();

//     if (!taskName.trim() || !assignedUser.trim() || !dueDate) {
//       setError("taskName, assignedUser, and dueDate are required.");
//       return;
//     }

//     setError("");
//     try {
//       const created = await createTask({
//         taskName: taskName.trim(),
//         description: description.trim() || null,
//         assignedUser: assignedUser.trim(),
//         dueDate,
//         priority,
//         status,
//       });

//       setTasks((prev) => [created, ...prev]);

//       setTaskName("");
//       setDescription("");
//       setAssignedUser("");
//       setDueDate("");
//       setPriority("MEDIUM");
//       setStatus("PENDING");
//     } catch (e) {
//       setError(e.message || "Failed to create task");
//     }
//   }

//   async function onChangeStatus(t, nextStatus) {
//     const old = t;
//     setError("");

//     setTasks((prev) =>
//       prev.map((x) => (x.id === t.id ? { ...x, status: nextStatus } : x))
//     );

//     try {
//       const updated = await updateTask(t.id, { status: nextStatus });
//       setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
//     } catch (e) {
//       setTasks((prev) => prev.map((x) => (x.id === t.id ? old : x)));
//       setError(e.message || "Failed to update status");
//     }
//   }

//   async function onChangePriority(t, nextPriority) {
//     const old = t;
//     setError("");

//     setTasks((prev) =>
//       prev.map((x) => (x.id === t.id ? { ...x, priority: nextPriority } : x))
//     );

//     try {
//       const updated = await updateTask(t.id, { priority: nextPriority });
//       setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
//     } catch (e) {
//       setTasks((prev) => prev.map((x) => (x.id === t.id ? old : x)));
//       setError(e.message || "Failed to update priority");
//     }
//   }

//   async function onDelete(id) {
//     setError("");
//     const before = tasks;
//     setTasks((prev) => prev.filter((t) => t.id !== id));

//     try {
//       await deleteTask(id);
//     } catch (e) {
//       setTasks(before);
//       setError(e.message || "Failed to delete task");
//     }
//   }
//   async function handleFindById() {
//   setError("");
//   setFoundTask(null);

//   const id = Number(findId);
//   if (!id) {
//     setError("Enter a valid numeric id.");
//     return;
//   }

//   try {
//     const task = await getTaskById(id);
//     setFoundTask(task);
//   } catch (e) {
//     setError(e.message || "Failed to fetch task");
//   }
// }

//   return (
//     <div className="page">
//       <div className="container">
//         <header className="topbar">
//           <div>
//             <h1 className="title">Task Manager</h1>
//             <p className="subtitle">
//               {loading ? "Loading…" : `${completedCount}/${tasks.length} completed`}
//             </p>
//           </div>

//           <button className="btn btn--ghost" type="button" onClick={loadTasks}>
//             Refresh
//           </button>
//         </header>

//         <div className="grid">
//           <section className="card cardTasks">
//             <div className="card__header">
//               <h2 className="card__title">Create task</h2>
//               <p className="card__hint">Fields marked * are required</p>
//             </div>

//             <form className="form" onSubmit={onAdd}>
//               <div className="field">
//                 <label className="label">Task Name *</label>
//                 <input
//                   className="input"
//                   value={taskName}
//                   onChange={(e) => setTaskName(e.target.value)}
//                   placeholder="e.g. Finish report"
//                 />
//               </div>

//               <div className="field">
//                 <label className="label">Description</label>
//                 <textarea
//                   className="textarea"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Optional details…"
//                   rows={3}
//                 />
//               </div>

//               <div className="row">
//                 <div className="field">
//                   <label className="label">Assigned User *</label>
//                   <input
//                     className="input"
//                     value={assignedUser}
//                     onChange={(e) => setAssignedUser(e.target.value)}
//                     placeholder="e.g. me"
//                   />
//                 </div>

//                 <div className="field">
//                   <label className="label">Due Date *</label>
//                   <input
//                     className="input"
//                     type="date"
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="row">
//                 <div className="field">
//                   <label className="label">Priority</label>
//                   <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
//                     {PRIORITIES.map((p) => (
//                       <option key={p} value={p}>{p}</option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="field">
//                   <label className="label">Status</label>
//                   <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
//                     {STATUSES.map((s) => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button className="btn btn--primary" type="submit">
//                 Add Task
//               </button>

//               {error && <div className="alert alert--error">⚠️ {error}</div>}
//             </form>
//           </section>

//           <section className="card cardTasks">
//             <div className="card__header">
//               <h2 className="card__title">Your tasks</h2>
//               <p className="card__hint">Update priority/status or delete tasks</p>
//             </div>
//             <div className="findRow">
//   <input
//     className="input"
//     value={findId}
//     onChange={(e) => setFindId(e.target.value)}
//     placeholder="Find task by ID (e.g. 6)"
//   />
//   <button className="btn" type="button" onClick={handleFindById}>
//     Find
//   </button>

//   {foundTask && (
//     <div className="found">
//       <span className="pill">#{foundTask.id}</span>
//       <b>{foundTask.taskName}</b>
//       <span className="muted">({foundTask.status})</span>
//     </div>
//   )}
// </div>

//             {tasks.length === 0 && !loading ? (
//               <div className="empty">No tasks yet. Create one on the left 👈</div>
//             ) : (
//               <div className="tableWrap">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Task</th>
//                       <th>User</th>
//                       <th>Due</th>
//                       <th>Priority</th>
//                       <th>Status</th>
//                       <th>Created</th>
//                       <th></th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {tasks.map((t) => (
//                       <tr key={t.id}>
//                         <td className="taskCell">
//                           <div className={`taskName ${t.status === "COMPLETED" ? "taskName--done" : ""}`}>
//                             {t.taskName}
//                           </div>
//                           {t.description && <div className="taskDesc">{t.description}</div>}
//                         </td>

//                         <td>{t.assignedUser}</td>
//                         <td className="mono">{formatDate(t.dueDate)}</td>

//                         <td>
//                           <div className="chipRow">
//                             <span className={pillClass("priority", t.priority)}>{t.priority}</span>
//                             <select
//                               className="select select--mini"
//                               value={t.priority}
//                               onChange={(e) => onChangePriority(t, e.target.value)}
//                               aria-label="Change priority"
//                             >
//                               {PRIORITIES.map((p) => (
//                                 <option key={p} value={p}>{p}</option>
//                               ))}
//                             </select>
//                           </div>
//                         </td>

//                         <td>
//                           <div className="chipRow">
//                             <span className={pillClass("status", t.status)}>{t.status.replace("_", " ")}</span>
//                             <select
//                               className="select select--mini"
//                               value={t.status}
//                               onChange={(e) => onChangeStatus(t, e.target.value)}
//                               aria-label="Change status"
//                             >
//                               {STATUSES.map((s) => (
//                                 <option key={s} value={s}>{s}</option>
//                               ))}
//                             </select>
//                           </div>
//                         </td>

//                         <td className="mono">{formatDate(t.createdAt)}</td>

//                         <td className="actions">
//                           <button className="btn btn--danger" type="button" onClick={() => onDelete(t.id)}>
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </section>
//         </div>

      
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask, getTaskById } from "./api";
import "./App.css";

const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return d.toISOString().slice(0, 10);
}

function pillClass(kind, value) {
  if (kind === "priority") return `pill pill--${value.toLowerCase()}`;
  if (kind === "status") return `pill pill--${value.toLowerCase()}`;
  return "pill";
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // form state
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [status, setStatus] = useState("PENDING");

  // find by id state
  const [findId, setFindId] = useState("");
  const [foundTask, setFoundTask] = useState(null);
  const [findError, setFindError] = useState("");
  const [findLoading, setFindLoading] = useState(false);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "COMPLETED").length,
    [tasks]
  );

  async function loadTasks() {
    setError("");
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : data.tasks ?? []);
    } catch (e) {
      setError(e.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function onAdd(e) {
    e.preventDefault();

    if (!taskName.trim() || !assignedUser.trim() || !dueDate) {
      setError("taskName, assignedUser, and dueDate are required.");
      return;
    }

    setError("");
    try {
      const created = await createTask({
        taskName: taskName.trim(),
        description: description.trim() || null,
        assignedUser: assignedUser.trim(),
        dueDate,
        priority,
        status,
      });

      setTasks((prev) => [created, ...prev]);

      setTaskName("");
      setDescription("");
      setAssignedUser("");
      setDueDate("");
      setPriority("MEDIUM");
      setStatus("PENDING");
    } catch (e) {
      setError(e.message || "Failed to create task");
    }
  }

  async function onChangeStatus(t, nextStatus) {
    const old = t;
    setError("");

    setTasks((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, status: nextStatus } : x))
    );

    try {
      const updated = await updateTask(t.id, { status: nextStatus });
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (e) {
      setTasks((prev) => prev.map((x) => (x.id === t.id ? old : x)));
      setError(e.message || "Failed to update status");
    }
  }

  async function onChangePriority(t, nextPriority) {
    const old = t;
    setError("");

    setTasks((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, priority: nextPriority } : x))
    );

    try {
      const updated = await updateTask(t.id, { priority: nextPriority });
      setTasks((prev) => prev.map((x) => (x.id === t.id ? updated : x)));
    } catch (e) {
      setTasks((prev) => prev.map((x) => (x.id === t.id ? old : x)));
      setError(e.message || "Failed to update priority");
    }
  }

  async function onDelete(id) {
    setError("");
    const before = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    try {
      await deleteTask(id);
    } catch (e) {
      setTasks(before);
      setError(e.message || "Failed to delete task");
    }
  }

  async function handleFindById() {
    setError("");
    setFindError("");
    setFoundTask(null);

    const id = Number(findId);
    if (!id) {
      setFindError("Enter a valid numeric id.");
      return;
    }

    setFindLoading(true);
    try {
      const task = await getTaskById(id);
      setFoundTask(task);
    } catch (e) {
      setFindError(e.message || "Task not found.");
    } finally {
      setFindLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <header className="topbar">
          <div>
            <h1 className="title">Task Manager</h1>
            <p className="subtitle">
              {loading ? "Loading…" : `${completedCount}/${tasks.length} completed`}
            </p>
          </div>

          <button className="btn btn--ghost" type="button" onClick={loadTasks}>
            Refresh
          </button>
        </header>

        <div className="grid">
          {/* LEFT: Create Task */}
          <section className="card cardCreate">
            <div className="card__header">
              <h2 className="card__title">Create task</h2>
              <p className="card__hint">Fields marked * are required</p>
            </div>

            <form className="form" onSubmit={onAdd}>
              <div className="field">
                <label className="label">Task Name *</label>
                <input
                  className="input"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. Finish report"
                />
              </div>

              <div className="field">
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details…"
                  rows={3}
                />
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Assigned User *</label>
                  <input
                    className="input"
                    value={assignedUser}
                    onChange={(e) => setAssignedUser(e.target.value)}
                    placeholder="e.g. me"
                  />
                </div>

                <div className="field">
                  <label className="label">Due Date *</label>
                  <input
                    className="input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="row">
                <div className="field">
                  <label className="label">Priority</label>
                  <select
                    className="select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="label">Status</label>
                  <select
                    className="select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="btn btn--primary" type="submit">
                Add Task
              </button>

              {error && <div className="alert alert--error">⚠️ {error}</div>}
            </form>

            {/* Tips */}
            <div className="tips">
              <p className="tips__title">Quick tips</p>
              <ul>
                <li>
                  Use <b>HIGH</b> priority for urgent tasks.
                </li>
                <li>
                  Set status to <b>IN_PROGRESS</b> when you start working.
                </li>
                <li>Keep descriptions short so the table stays clean.</li>
              </ul>
            </div>
          </section>

          {/* RIGHT: Tasks */}
          <section className="card cardTasks">
            <div className="card__header">
              <h2 className="card__title">Your tasks</h2>
              <p className="card__hint">Update priority/status or delete tasks</p>
            </div>

            {/* Find bar */}
            <div className="findBar">
              <input
                className="input"
                value={findId}
                onChange={(e) => setFindId(e.target.value)}
                placeholder="Find task by ID (e.g. 6)"
              />

              <button
                className="btn"
                type="button"
                onClick={handleFindById}
                disabled={findLoading}
              >
                {findLoading ? "Finding..." : "Find"}
              </button>

              <button
                className="btn btn--ghost"
                type="button"
                onClick={() => {
                  setFindId("");
                  setFoundTask(null);
                  setFindError("");
                }}
              >
                Clear
              </button>
            </div>

            <div className="findResult">
              {foundTask && (
                <div className="found">
                  <span className="pill">#{foundTask.id}</span>
                  <b>{foundTask.taskName}</b>
                  <span className="muted">({foundTask.status})</span>
                </div>
              )}

              {findError && <div className="findMsg">⚠️ {findError}</div>}
            </div>

            {tasks.length === 0 && !loading ? (
              <div className="emptyState">
                <div className="emptyState__inner">
                  <div className="emptyState__icon">🗂️</div>
                  <p className="emptyState__title">No tasks yet</p>
                  <p className="emptyState__text">
                    Create your first task on the left — then you’ll be able to
                    update status, priority, and delete.
                  </p>
                </div>
              </div>
            ) : (
              <div className="tableWrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>User</th>
                      <th>Due</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((t) => (
                      <tr key={t.id}>
                        <td className="taskCell">
                          <div
                            className={`taskName ${
                              t.status === "COMPLETED" ? "taskName--done" : ""
                            }`}
                          >
                            {t.taskName}
                          </div>
                          {t.description && (
                            <div className="taskDesc">{t.description}</div>
                          )}
                        </td>

                        <td>{t.assignedUser}</td>
                        <td className="mono">{formatDate(t.dueDate)}</td>

                        <td>
                          <div className="chipRow">
                            <span className={pillClass("priority", t.priority)}>
                              {t.priority}
                            </span>
                            <select
                              className="select select--mini"
                              value={t.priority}
                              onChange={(e) =>
                                onChangePriority(t, e.target.value)
                              }
                              aria-label="Change priority"
                            >
                              {PRIORITIES.map((p) => (
                                <option key={p} value={p}>
                                  {p}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td>
                          <div className="chipRow">
                            <span className={pillClass("status", t.status)}>
                              {t.status.replace("_", " ")}
                            </span>
                            <select
                              className="select select--mini"
                              value={t.status}
                              onChange={(e) => onChangeStatus(t, e.target.value)}
                              aria-label="Change status"
                            >
                              {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="mono">{formatDate(t.createdAt)}</td>

                        <td className="actions">
                          <button
                            className="btn btn--danger"
                            type="button"
                            onClick={() => onDelete(t.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}