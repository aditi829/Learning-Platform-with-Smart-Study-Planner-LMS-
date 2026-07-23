import { useEffect, useState } from "react";
import API from "../api/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await API.get("/dashboard");
    setData(res.data);
  }

  if (!data) return <div className="page">Loading...</div>;

  const chartData = [
    { name: "Completed", value: data.completed_tasks },
    { name: "Pending", value: data.pending_tasks },
  ];

  return (
    <div className="page">

      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Overview of your learning activity</p>
      </div>

      {/* KPI */}
      <div className="kpi-grid-clean">

        <div className="kpi-clean">
          <span>Total Courses</span>
          <h3>{data.total_courses}</h3>
        </div>

        <div className="kpi-clean">
          <span>Total Tasks</span>
          <h3>{data.total_tasks}</h3>
        </div>

        <div className="kpi-clean">
          <span>Completed</span>
          <h3>{data.completed_tasks}</h3>
        </div>

        <div className="kpi-clean">
          <span>Pending</span>
          <h3>{data.pending_tasks}</h3>
        </div>

      </div>

      {/* CONTENT */}
      <div className="dashboard-layout">

        <div className="card clean-card">
          <h3>Task Progress</h3>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#334155" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card clean-card">
          <h3>Summary</h3>

          <div className="summary-row">
            <span>Completion Rate</span>
            <b>
              {data.total_tasks === 0
                ? "0%"
                : Math.round(
                    (data.completed_tasks / data.total_tasks) * 100
                  ) + "%"}
            </b>
          </div>

          <div className="summary-row">
            <span>Active Tasks</span>
            <b>{data.pending_tasks}</b>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;