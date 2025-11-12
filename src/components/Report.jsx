import React, { useMemo, useState, useEffect } from "react";
import "./Report.css";

// Lazy-load Plotly (prevents page crash if not available)
function PlotLoader(props) {
  const [Plot, setPlot] = useState(null);

  useEffect(() => {
    let mounted = true;
    import("react-plotly.js")
      .then((mod) => {
        if (mounted) setPlot(() => mod.default || mod);
      })
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  if (!Plot)
    return (
      <div style={{ minHeight: 200 }} className="plot-placeholder">
        Plot library not available
      </div>
    );

  return <Plot {...props} />;
}

const sampleTasks = [
  { id: 1, title: "UI Design", status: "Completed", priority: "High", dueDate: "2025-11-05", owner: "Ava" },
  { id: 2, title: "API Integration", status: "In Progress", priority: "Medium", dueDate: "2025-11-10", owner: "Liam" },
  { id: 3, title: "Testing", status: "Pending", priority: "High", dueDate: "2025-11-12", owner: "Noah" },
  { id: 4, title: "Deployment", status: "Pending", priority: "Low", dueDate: "2025-11-15", owner: "Olivia" },
  { id: 5, title: "Docs", status: "In Progress", priority: "Low", dueDate: "2025-11-18", owner: "Emma" },
  { id: 6, title: "Performance", status: "Completed", priority: "Medium", dueDate: "2025-11-02", owner: "Ethan" },
];

const groupBy = (arr, key) =>
  arr.reduce((acc, cur) => {
    acc[cur[key]] = (acc[cur[key]] || 0) + 1;
    return acc;
  }, {});

const Report = ({ tasks = sampleTasks }) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filtered = useMemo(
    () => (filterStatus === "all" ? tasks : tasks.filter((t) => t.status === filterStatus)),
    [tasks, filterStatus]
  );

  const statusCounts = useMemo(() => groupBy(tasks, "status"), [tasks]);
  const priorityCounts = useMemo(() => groupBy(tasks, "priority"), [tasks]);

  const dates = useMemo(() => {
    const map = {};
    tasks.forEach((t) => {
      map[t.dueDate] = (map[t.dueDate] || 0) + 1;
    });
    const keys = Object.keys(map).sort();
    return { keys, vals: keys.map((k) => map[k]) };
  }, [tasks]);

  // build status-over-time series (counts per dueDate for each status)
  const statusTimeline = useMemo(() => {
    const statuses = ["Completed", "In Progress", "Pending"];
    const datesSet = new Set();
    tasks.forEach((t) => datesSet.add(t.dueDate));
    const timeline = Array.from(datesSet).sort();

    // initialize counts per status per date
    const counts = {};
    statuses.forEach((s) => (counts[s] = {}));
    tasks.forEach((t) => {
      counts[t.status] = counts[t.status] || {};
      counts[t.status][t.dueDate] = (counts[t.status][t.dueDate] || 0) + 1;
    });

    const series = statuses.map((s) => ({
      name: s,
      x: timeline,
      y: timeline.map((d) => counts[s] && counts[s][d] ? counts[s][d] : 0),
    }));

    return { timeline, series };
  }, [tasks]);

  const getOpenVsCompleted = () => {
    const completed = statusCounts["Completed"] || 0;
    const inProgress = statusCounts["In Progress"] || 0;
    const pending = statusCounts["Pending"] || 0;
    return `Open: ${inProgress + pending} • Completed: ${completed}`;
  };

  const getCompletedPercent = () => {
    const total = tasks.length || 1;
    const completed = statusCounts["Completed"] || 0;
    return `${Math.round((completed / total) * 100)}% of all tasks`;
  };

  const getTopInProgress = () => {
    const inProg = tasks.filter((t) => t.status === "In Progress");
    if (!inProg.length) return "";
    const byOwner = inProg.reduce((acc, t) => ((acc[t.owner] = (acc[t.owner] || 0) + 1), acc), {});
    const [owner, count] = Object.entries(byOwner).sort((a, b) => b[1] - a[1])[0];
    return `Top: ${owner} (${count})`;
  };

  const getEarliestPending = () => {
    const pending = tasks.filter((t) => t.status === "Pending");
    return pending.length ? `Earliest due: ${pending.map((p) => p.dueDate).sort()[0]}` : "";
  };

  return (
    <div className="report-page">
      <header className="report-hero">
        <div>
          <h1>Team Progress & Reports</h1>
          <p className="muted">Overview of tasks, priorities and timelines — at a glance.</p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-ghost">
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              <path d="M12 15V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Export CSV
          </button>

          <button className="btn btn-primary">
            <svg className="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Create Report
          </button>
        </div>
      </header>

      <section className="report-grid">
        <div className="cards">
          <MetricCard title="Total Tasks" icon="icon-total" value={tasks.length} sub="Across all projects" detail={getOpenVsCompleted()} />
          <MetricCard title="Completed" icon="icon-completed" value={statusCounts["Completed"] || 0} sub="Tasks finished" detail={getCompletedPercent()} />
          <MetricCard title="In Progress" icon="icon-progress" value={statusCounts["In Progress"] || 0} sub="Active tasks" detail={getTopInProgress()} />
          <MetricCard title="Pending" icon="icon-pending" value={statusCounts["Pending"] || 0} sub="Awaiting action" detail={getEarliestPending()} />
        </div>

        <div className="charts">
          <div className="charts-top">
            <div className="chart card">
              <h3>Status Distribution</h3>
              <PlotLoader
                data={[
                  {
                    labels: Object.keys(statusCounts),
                    values: Object.values(statusCounts),
                    type: "pie",
                    hole: 0.45,
                    marker: { colors: ["#7c3aed", "#06b6d4", "#f59e0b"] },
                    textinfo: "percent+label",
                  },
                ]}
                layout={{
                  margin: { t: 20, b: 20, l: 10, r: 10 },
                  showlegend: false,
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            <aside className="recent-activity card">
              <div className="recent-header">
                <h3>Recent activity</h3>
                <p className="muted">Stay up to date with what's happening across the team.</p>
              </div>
              <div className="recent-list">
                {tasks
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((t) => (
                    <div key={t.id} className="recent-item">
                      <div className="recent-body">
                        <div className="recent-avatar">{t.owner.charAt(0)}</div>

                        <div className="recent-line">
                          <span className="recent-name">{t.owner}</span>
                          <span className="recent-action">updated status on</span>
                          <span className="recent-link">{t.title}</span>
                        </div>
                        <div className="recent-meta">
                          {t.dueDate} • {t.priority} priority
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </aside>
          </div>

          <div className="charts-bottom charts-bottom--full">
            <div className="chart card charts-bottom-card">
              <h3>Tasks by Priority</h3>
              <PlotLoader
                data={[
                  {
                    x: Object.keys(priorityCounts),
                    y: Object.values(priorityCounts),
                    type: "bar",
                    marker: { color: ["#ef4444", "#f97316", "#10b981"] },
                  },
                ]}
                layout={{
                  margin: { t: 20, b: 30, l: 40, r: 10 },
                  xaxis: { title: "Priority" },
                  yaxis: { title: "Count" },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  height: 300,
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "320px" }}
              />
            </div>

            <div className="chart card charts-bottom-card">
              <h3>Upcoming Due Dates</h3>
              <PlotLoader
                data={[
                  {
                    x: dates.keys,
                    y: dates.vals,
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "#7c3aed" },
                    line: { color: "#8b5cf6" },
                  },
                ]}
                layout={{
                  margin: { t: 20, b: 40, l: 40, r: 10 },
                  xaxis: { title: "Due Date" },
                  yaxis: { title: "Tasks Due" },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  height: 260,
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "300px" }}
              />
            </div>

            <div className="chart card charts-bottom-card">
              <h3>Status over time</h3>
              <PlotLoader
                data={statusTimeline.series.map((s, i) => ({
                  x: s.x,
                  y: s.y,
                  type: "scatter",
                  mode: "lines",
                  name: s.name,
                  stackgroup: "one",
                  fill: "tonexty",
                  line: { width: 1.5, color: i === 0 ? "#10b981" : i === 1 ? "#f59e0b" : "#ef4444" },
                }))}
                layout={{
                  margin: { t: 20, b: 40, l: 40, r: 10 },
                  xaxis: { title: "Due Date" },
                  yaxis: { title: "Count" },
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "transparent",
                  showlegend: true,
                }}
                config={{ responsive: true }}
                style={{ width: "100%", height: "300px" }}
              />
            </div>
          </div>
        </div>

        <aside className="table-panel card">
          <div className="table-header">
            <h3>Task Details</h3>
            <div className="filters">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="task-title">{t.title}</td>
                  <td>{t.owner}</td>
                  <td>
                    <span className={`pill status-${t.status.replace(/\s+/g, "-").toLowerCase()}`}>{t.status}</span>
                  </td>
                  <td>{t.priority}</td>
                  <td>{t.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </aside>
      </section>
    </div>
  );
};

const IconSVG = ({ name }) => {
  switch (name) {
    case "icon-total":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 7h18M7 11h10M5 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      );
    case "icon-completed":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M8 12.5l2 2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "icon-progress":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2v6l3-3 3 3V2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "icon-pending":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
};

const MetricCard = ({ title, icon, value, sub, detail }) => (
  <div className="metric-card">
    <div className="metric-header">
      <div className={`metric-icon ${icon}`} aria-hidden>
        <IconSVG name={icon} />
      </div>
      <div className="metric-title">{title}</div>
    </div>
    <div className="metric-row">
      <span className="metric-value">{value}</span>
    </div>
    <div className="metric-detail-row">
      <div className="metric-sub">{sub}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  </div>
);

export default Report;