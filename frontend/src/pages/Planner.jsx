import { useState, useEffect } from "react";
import API from "../api/api";

function Planner() {
  const [tasks, setTasks] = useState([]);
  const [planner, setPlanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    task_id: "",
    study_date: "",
    time_slot: "",
  });

  useEffect(() => {
    fetchTasks();
    fetchPlanner();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    }
  };

  const fetchPlanner = async () => {
    try {
      setLoading(true);
      const res = await API.get("/planner/today");
      setPlanner(res.data);
    } catch (err) {
      setError("Failed to load planner");
    } finally {
      setLoading(false);
    }
  };

  const addPlanner = async (e) => {
    e.preventDefault();

    try {
      await API.post("/planner", {
        task_id: Number(form.task_id),
        study_date: form.study_date,
        time_slot: form.time_slot,
      });

      setForm({
        task_id: "",
        study_date: "",
        time_slot: "",
      });

      fetchPlanner();
    } catch (err) {
      setError("Failed to create planner");
    }
  };

  return (
    <div className="page">

      {/* TITLE */}
      <h2>Study Planner</h2>

      {/* FORM (SAME SIZE AS TASKS/COURSES) */}
      <form className="form" onSubmit={addPlanner}>

        <select
          required
          value={form.task_id}
          onChange={(e) =>
            setForm({ ...form, task_id: e.target.value })
          }
        >
          <option value="">Select Task</option>
          {tasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>

        <input
          type="date"
          required
          value={form.study_date}
          onChange={(e) =>
            setForm({ ...form, study_date: e.target.value })
          }
        />

        <input
          type="text"
          required
          placeholder="Time Slot (e.g. 7PM-8PM)"
          value={form.time_slot}
          onChange={(e) =>
            setForm({ ...form, time_slot: e.target.value })
          }
        />

        <button type="submit">Add Planner</button>
      </form>

      {/* ERROR */}
      {error && <p>{error}</p>}

      {/* LOADING / EMPTY STATE */}
      {loading ? (
        <p>Loading...</p>
      ) : planner.length === 0 ? (
        <p>No Study Plans Today</p>
      ) : (
        /* GRID SAME AS TASKS & COURSES */
        <div className="grid">

          {planner.map((item, index) => (
            <div className="card" key={index}>

              <h3>{item.title}</h3>

              <p>Priority: {item.priority}</p>
              <p>Date: {item.study_date}</p>
              <p>Time: {item.time_slot}</p>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default Planner;