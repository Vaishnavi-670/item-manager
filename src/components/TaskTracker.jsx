// TaskTracker.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import Plot from "react-plotly.js";
import { format } from "date-fns";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TaskTracker.css";

const STORAGE_KEY = "taskTrackerTasksGrouped";
const ICONS = {
    Board: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="3" y="3" width="8" height="8" rx="1" />
            <rect x="13" y="3" width="8" height="8" rx="1" />
            <rect x="3" y="13" width="8" height="8" rx="1" />
            <rect x="13" y="13" width="8" height="8" rx="1" />
        </svg>
    ),
    List: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="11" y="4" width="10" height="4" rx="1" />
            <rect x="11" y="14" width="6" height="4" rx="1" />
        </svg>
    ),
    Calendar: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 11h18" strokeLinecap="round" />
        </svg>
    ),

    Filters: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M22 5H2l8 7v7l4 2v-9l8-7z" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    ),
};
// fallback initial data so the tracker has content on first load
const initialTasksData = {
    todo: [
        {
            id: 1,
            category: "Development",
            userName: "Ava Patel",
            title: "Implement authentication",
            assignDate: "2025-11-01",
            expiryDate: "2025-11-10",
            date: "2025-11-01",
            description: "Add JWT-based login and registration endpoints and connect frontend.",
            comments: 2,
            avatar: null,
            log: "Initial scaffold created",
            duration: "5d",
        },
        {
            id: 2,
            category: "Design",
            userName: "Liam Johnson",
            title: "Landing page redesign",
            assignDate: "2025-11-03",
            expiryDate: "2025-11-12",
            date: "2025-11-03",
            description: "Refresh the marketing landing with new hero and features section.",
            comments: 1,
            avatar: null,
            log: "Wireframes uploaded",
            duration: "4d",
        },
        {
            id: 3,
            category: "QA",
            userName: "Noah Williams",
            title: "Regression test suite",
            assignDate: "2025-11-05",
            expiryDate: "2025-11-20",
            date: "2025-11-05",
            description: "Create and run regression tests for key user flows.",
            comments: 0,
            avatar: null,
            log: "Test plan ready",
            duration: "10d",
        },
    ],
    inProgress: [
        {
            id: 4,
            category: "Backend",
            userName: "Olivia Brown",
            title: "Database indexing",
            assignDate: "2025-10-28",
            expiryDate: "2025-11-06",
            date: "2025-10-28",
            description: "Add missing indexes to improve query performance.",
            comments: 3,
            avatar: null,
            log: "Benchmarks show 2x improvement",
            duration: "6d",
        },
    ],
    reviewReady: [
        {
            id: 5,
            category: "Docs",
            userName: "Emma Davis",
            title: "API documentation",
            assignDate: "2025-10-20",
            expiryDate: "2025-11-02",
            date: "2025-10-20",
            description: "Finalize OpenAPI spec and publish docs site.",
            comments: 0,
            avatar: null,
            log: "Spec draft complete",
            duration: "8d",
        },
    ],
    completed: [
        {
            id: 6,
            category: "Ops",
            userName: "Ethan Clark",
            title: "Deploy monitoring",
            assignDate: "2025-10-10",
            expiryDate: "2025-10-15",
            date: "2025-10-10",
            description: "Set up application monitoring and alerts.",
            comments: 4,
            avatar: null,
            log: "Monitoring live",
            duration: "3d",
        },
    ],
};
const loadTasksData = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // ensure all expected columns exist; merge with defaults
            const normalized = {
                todo: Array.isArray(parsed.todo) ? parsed.todo : [],
                inProgress: Array.isArray(parsed.inProgress) ? parsed.inProgress : [],
                reviewReady: Array.isArray(parsed.reviewReady) ? parsed.reviewReady : [],
                completed: Array.isArray(parsed.completed) ? parsed.completed : [],
            };

            // If parsed exists but contains no tasks at all, seed with initial data
            const total = (normalized.todo?.length || 0) + (normalized.inProgress?.length || 0) + (normalized.reviewReady?.length || 0) + (normalized.completed?.length || 0);
            if (total === 0) {
                console.log('No tasks found, loading initial data');
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasksData)); } catch (e) { }
                return initialTasksData;
            }

            return normalized;
        }

        // Check old flat storage format
        const flat = localStorage.getItem('taskTrackerTasks');
        if (flat) {
            try {
                const arr = JSON.parse(flat);
                if (Array.isArray(arr) && arr.length > 0) {
                    const merged = { ...initialTasksData, todo: arr };
                    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch (e) { }
                    return merged;
                }
            } catch (e) {
                console.error('Error parsing old format:', e);
            }
        }
        console.log('No existing data, loading initial task data');
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasksData)); } catch (e) { }
        return initialTasksData;
    } catch (e) {
        console.error('Error loading tasks:', e);
        return initialTasksData;
    }
};

const saveTasksData = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { }
};

const formatDate = (val) => {
    if (!val) return null;
    const date = new Date(val);
    return !isNaN(date.getTime()) ? date.toLocaleDateString() : val;
};

const TaskCard = ({ task, onClick, selectable, selected }) => (
    <div
        className={`task-card ${selected ? 'selected' : ''}`}
        onClick={() => onClick?.(task)}
        style={{
            cursor: onClick ? "pointer" : "grab",
            border: selectable ? "2px dashed rgba(59,130,246,0.45)" : undefined,
            padding: selectable ? 10 : undefined,
            borderRadius: selectable ? 8 : undefined,
        }}
    >
        {selected && (
            <div className="task-selected-check" aria-hidden>
                ✓
            </div>
        )}
        <div className="task-header-row">
            <div className="task-category">{task.category}</div>
            {task.avatar ? (
                <img className="avatar" src={task.avatar} alt="avatar" loading="lazy" />
            ) : (
                <div className="avatar placeholder" />
            )}
        </div>

        <div className="task-title">{task.title}</div>

        <div className="task-meta-row">
            <div className="task-meta">
                {task.date && (
                    <MetaItem icon="calendar" text={task.date} />
                )}
                {task.duration && (
                    <MetaItem icon="clock" text={task.duration} />
                )}
            </div>
        </div>

        {task.log && <TaskLog log={task.log} />}
        <TaskFooter comments={task.comments} />
    </div>
);

const MetaItem = ({ icon, text }) => (
    <div className="meta-item">
        <svg
            className="icon"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            {icon === "calendar" ? (
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10m-11 8h12a2 2 0 002-2v-5a2 2 0 00-2-2H6a2 2 0 00-2 2v5a2 2 0 002 2z"
                />
            ) : (
                <>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3"
                    />
                    <circle cx="12" cy="12" r="9" strokeWidth="2" fill="none" />
                </>
            )}
        </svg>
        <span className="meta-text">{text}</span>
    </div>
);

const TaskLog = ({ log }) => (
    <div className="task-log">
        <svg
            className="icon-log"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3M12 19a7 7 0 100-14 7 7 0 000 14z"
            />
        </svg>
        <span>Log: {log}</span>
    </div>
);

const TaskFooter = ({ comments }) => (
    <div className="task-footer">
        <div className="comments">
            <svg
                className="icon-comment"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-6l-4 4v-4H7a2 2 0 01-2-2v-2"
                />
            </svg>
            <span>{comments}</span>
        </div>
    </div>
);

const Column = ({ title, count, tasks, onAddTask, onTaskClick, emptyMessage, showControls, onEditColumn, onRemoveColumn, selectionMode, selectedTaskIds }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function onDocClick(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        }
        if (menuOpen) document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [menuOpen]);

    return (
        <div className="column">
            <div className="column-header">
                <h3>
                    {title} <span className="count">{count}</span>
                </h3>
                {showControls && (
                    <div style={{ position: 'relative' }}>
                        <button className="btn-add" onClick={onAddTask}>+</button>
                        <button
                            className="btn-more"
                            aria-expanded={menuOpen}
                            aria-haspopup="true"
                            onClick={(e) => { e.stopPropagation(); setMenuOpen((s) => !s); }}
                        >
                            :
                        </button>

                        {menuOpen && (
                            <div className="more-menu" ref={menuRef} role="menu">
                                <button
                                    type="button"
                                    className="btn-edit"
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEditColumn && onEditColumn(title); }}
                                    role="menuitem"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    className="btn-remove"
                                    onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onRemoveColumn && onRemoveColumn(title); }}
                                    role="menuitem"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="column-body">
                {tasks.length ? (
                    tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} selectable={!!selectionMode} selected={selectedTaskIds?.includes(task.id)} />
                    ))
                ) : (
                    <div className="empty-state">
                        <EmptyIcon />
                        <p>{emptyMessage}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyIcon = () => (
    <svg className="icon-doc" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
        />
    </svg>
);

// ------------------ Main Component ------------------

const TaskTracker = () => {
    const [tasksData, setTasksData] = useState(loadTasksData);
    const [viewMode, setViewMode] = useState('board'); // 'board' | 'list' | 'table' | 'gantt' | 'calendar'
    const [calendarView, setCalendarView] = useState('month'); // 'month' | 'week' | 'day'
    const [calendarFilterCols, setCalendarFilterCols] = useState({ todo: true, inProgress: true, reviewReady: true, completed: true });
    const [form, setForm] = useState({
        category: "",
        userName: "",
        title: "",
        assignDate: null,
        expiryDate: null,
        description: "",
        email: "",
    });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [detailTask, setDetailTask] = useState(null);

    // Modes for selecting a card after clicking Edit / Remove in the To-do header
    // null | 'edit' | 'remove'
    const [selectionMode, setSelectionMode] = useState(null);
    // when editing a task, this holds the task id being edited
    const [editingTaskId, setEditingTaskId] = useState(null);
    // when in 'remove' mode the user can pick multiple tasks to delete
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const [actionMessage, setActionMessage] = useState(null);
    const actionTimerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
        };
    }, []);

    useEffect(() => saveTasksData(tasksData), [tasksData]);

    const openAssign = (taskToEdit = null) => {
        if (taskToEdit) {
            // prefill form from task
            setForm({
                category: taskToEdit.category || "",
                userName: taskToEdit.userName || "",
                title: taskToEdit.title || "",
                assignDate: taskToEdit.assignDate ? new Date(taskToEdit.assignDate) : null,
                expiryDate: taskToEdit.expiryDate ? new Date(taskToEdit.expiryDate) : null,
                description: taskToEdit.description || "",
                email: taskToEdit.email || "",
            });
            setEditingTaskId(taskToEdit.id);
        } else {
            setForm({ category: "", userName: "", title: "", assignDate: null, expiryDate: null, description: "", email: "" });
            setEditingTaskId(null);
        }
        setShowAssignModal(true);
    };

    const performBulkRemove = () => {
        if (!selectedTaskIds.length) return;
        setTasksData((prev) => {
            const newGroups = {};
            Object.keys(prev).forEach((col) => {
                newGroups[col] = prev[col].filter((t) => !selectedTaskIds.includes(t.id));
            });
            return newGroups;
        });
        setSelectedTaskIds([]);
        setSelectionMode(null);
        // show a short-lived success message instead of an alert
        const msg = `${selectedTaskIds.length} task${selectedTaskIds.length > 1 ? 's' : ''} deleted successfully`;
        setActionMessage(msg);
        if (actionTimerRef.current) clearTimeout(actionTimerRef.current);
        actionTimerRef.current = setTimeout(() => setActionMessage(null), 3500);
    };

    const cancelSelectionMode = () => {
        setSelectedTaskIds([]);
        setSelectionMode(null);
    };

    const closeAssignModal = () => {
        setShowAssignModal(false);
        setEditingTaskId(null);
        setSelectionMode(null);
    };

    const handleFormChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const handleAssignSubmit = (e) => {
        e.preventDefault();

        // Build the task object from the form (assign/expiry are stored as ISO yyyy-mm-dd strings)
        const taskPayload = {
            category: form.category,
            userName: form.userName,
            title: form.title,
            assignDate: form.assignDate ? form.assignDate.toISOString().slice(0, 10) : null,
            expiryDate: form.expiryDate ? form.expiryDate.toISOString().slice(0, 10) : null,
            date: form.assignDate ? form.assignDate.toLocaleDateString() : null,
            description: form.description,
            email: form.email || null,
        };

        if (editingTaskId) {
            // update existing task
            setTasksData((prev) => {
                const newGroups = {};
                Object.keys(prev).forEach((col) => {
                    newGroups[col] = prev[col].map((t) => {
                        if (t.id === editingTaskId) {
                            return { ...t, ...taskPayload };
                        }
                        return t;
                    });
                });
                return newGroups;
            });
            setEditingTaskId(null);
            setShowAssignModal(false);
            setSelectionMode(null);
            return;
        }

        // create new task (default to todo)
        const allTasks = Object.values(tasksData).flat();
        const newTask = {
            id: Math.max(...allTasks.map((t) => t.id || 0), 0) + 1,
            ...taskPayload,
            comments: 0,
            avatar: null,
        };
        setTasksData((prev) => ({ ...prev, todo: [newTask, ...prev.todo] }));
        setShowAssignModal(false);
    };

    // note: individual remove is handled via bulk remove mode; no single-item remove helper needed

    // Handlers for the To-do header menu actions
    const handleEditColumn = (colTitle) => {
        // enable selection mode for editing a single card
        setSelectionMode('edit');
    };

    const handleRemoveColumn = (colTitle) => {
        // enable selection mode for removing a single card
        setSelectionMode('remove');
        setSelectedTaskIds([]);
    };

    // Task click handler that routes based on mode
    const handleTaskClick = (task) => {
        if (selectionMode === 'edit') {
            // open assign modal prefilled for editing
            openAssign(task);
            // leave selectionMode cleared (we're in modal now)
            setSelectionMode(null);
            return;
        }
        if (selectionMode === 'remove') {
            // toggle selection for multi-delete
            setSelectedTaskIds((prev) => {
                const exists = prev.includes(task.id);
                if (exists) return prev.filter((id) => id !== task.id);
                return [...prev, task.id];
            });
            return;
        }

        // default: open detail view
        setDetailTask(task);
    };

    const pendingDaysText = (() => {
        if (!detailTask?.expiryDate) return null;
        const diffDays = Math.ceil(
            (new Date(detailTask.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} left`;
        if (diffDays === 0) return "Due today";
        return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`;
    })();

    // Prepare Gantt data for Plotly from grouped tasksData
    const ganttData = useMemo(() => {
        // preserve column information so we can color by column
        const flat = Object.entries(tasksData || {}).flatMap(([col, arr]) => (arr || []).map((t) => ({ ...t, _col: col })));
        const valid = flat.filter((t) => t && (t.assignDate || t.date) && t.expiryDate);
        if (!valid.length) return [];

        // color by column
        const colColor = {
            todo: '#60a5fa', // blue
            inProgress: '#f59e0b', // amber
            reviewReady: '#7c3aed', // purple
            completed: '#34d399', // green
        };

        return [
            {
                type: 'bar',
                orientation: 'h',
                y: valid.map((t) => t.title || `Task ${t.id}`),
                x: valid.map((t) => {
                    const start = new Date(t.assignDate || t.date);
                    const end = new Date(t.expiryDate);
                    return (end - start) / (1000 * 60 * 60 * 24);
                }),
                base: valid.map((t) => new Date(t.assignDate || t.date)),
                marker: { color: valid.map((t) => colColor[t._col] || '#facc15') },
                text: valid.map((t) => `${t.title}\nStart: ${format(new Date(t.assignDate || t.date), 'MMM d, yyyy')}\nDue: ${format(new Date(t.expiryDate), 'MMM d, yyyy')}\nStatus: ${t._col}`),
                hoverinfo: 'text',
            },
        ];
    }, [tasksData]);

    // color mapping reused by calendar and gantt
    const colColor = {
        todo: '#60a5fa', // blue
        inProgress: '#f59e0b', // amber
        reviewReady: '#7c3aed', // purple
        completed: '#34d399', // green
    };

    // light background colors for calendar events (so calendar looks 'light')
    const colBgColor = {
        todo: '#f3e8ff', // purple-100 (light)
        inProgress: '#fffbeb', // amber-50
        reviewReady: '#ecfeff', // cyan/teal-50
        completed: '#ecfdf5', // green-50
    };

    const colTextColor = {
        todo: '#7c3aed',
        inProgress: '#f59e0b',
        reviewReady: '#06b6d4',
        completed: '#10b981',
    };

    // Flatten tasksData with column info for calendar events
    const flatForCalendar = useMemo(() => Object.entries(tasksData || {}).flatMap(([col, arr]) => (arr || []).map((t) => ({ ...t, _col: col }))), [tasksData]);

    const calendarEvents = useMemo(() => flatForCalendar
        .filter((t) => t && (t.assignDate || t.date || t.expiryDate) && (calendarFilterCols[t._col] ?? true))
        .map((t) => ({
            id: t.id,
            title: t.title || t.userName || `Task ${t.id}`,
            // prefer assignDate as start and expiryDate as end for multi-day spans
            start: new Date(t.assignDate || t.date || t.expiryDate),
            end: new Date(t.expiryDate || t.assignDate || t.date),
            allDay: true,
            resource: t,
        })), [flatForCalendar, calendarFilterCols]);

    // calendar event click handler
    const onCalendarSelect = (event) => {
        if (event && event.resource) setDetailTask(event.resource);
    };

    const toggleCalendarCol = (col) => setCalendarFilterCols((prev) => ({ ...prev, [col]: !prev[col] }));

    return (
        <div className="tt-container">
            <Header onAddTask={openAssign} viewMode={viewMode} setViewMode={setViewMode} />
            {/* Views: board / list / table / gantt / calendar */}
            {viewMode === 'board' && (
                <div className="board">
                    <Column title="To-do" count={tasksData.todo.length} tasks={tasksData.todo} onAddTask={() => openAssign(null)} onTaskClick={handleTaskClick} showControls={true} onEditColumn={handleEditColumn} onRemoveColumn={handleRemoveColumn} selectionMode={selectionMode} selectedTaskIds={selectedTaskIds} />
                    <Column title="In Progress" count={tasksData.inProgress.length} tasks={tasksData.inProgress} onAddTask={() => openAssign(null)} onTaskClick={handleTaskClick} showControls={false} selectionMode={selectionMode} selectedTaskIds={selectedTaskIds} />
                    <Column title="Review Ready" count={tasksData.reviewReady.length} tasks={tasksData.reviewReady} onAddTask={() => openAssign(null)} onTaskClick={handleTaskClick} emptyMessage="No tasks currently. Board is empty" showControls={false} selectionMode={selectionMode} selectedTaskIds={selectedTaskIds} />
                    <Column title="Completed" count={tasksData.completed.length} tasks={tasksData.completed} onAddTask={() => openAssign(null)} onTaskClick={handleTaskClick} showControls={false} selectionMode={selectionMode} selectedTaskIds={selectedTaskIds} />
                </div>
            )}

            {viewMode === 'list' && (
                <div className="tt-panel-wrapper" data-edit-active="false" data-view="table">
                    <div className="tt-table-container">
                        <table className="tt-table">
                            <thead>
                                <tr>
                                    <th>Assign Date</th>
                                    <th>Expiry Date</th>
                                    <th>User</th>
                                    <th>Category</th>
                                    <th>Task Name</th>
                                    <th>Task Description</th>
                                    <th className="tt-updates-col">Updates from User</th>
                                    <th>Status (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(tasksData).flatMap(([col, tasks]) => tasks.map((t) => ({ ...t, _col: col }))).map((t) => (
                                    <tr key={`${t._col}-${t.id}`} onClick={() => handleTaskClick(t)} style={{ cursor: 'pointer' }}>
                                        <td>{t.assignDate || t.date || '-'}</td>
                                        <td>{t.expiryDate || '-'}</td>
                                        <td>{t.userName || '-'}</td>
                                        <td>{t.category || '-'}</td>
                                        <td>{t.title || '-'}</td>
                                        <td>{t.description || '-'}</td>
                                        <td className="tt-updates-td">{t.log || (t.comments ? `${t.comments} comments` : 'No updates')}</td>
                                        <td>{t.progress || t.statusPercent || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* BOARD VIEW removed — table-only list view requested */}
                </div>
            )}

            {viewMode === 'gantt' && (
                <div className="gantt-container">
                    <div className="gantt-legend" aria-hidden>
                        <div className="legend-item"><span className="swatch" style={{ background: '#60a5fa' }} /> To-do</div>
                        <div className="legend-item"><span className="swatch" style={{ background: '#f59e0b' }} /> In Progress</div>
                        <div className="legend-item"><span className="swatch" style={{ background: '#7c3aed' }} /> Review Ready</div>
                        <div className="legend-item"><span className="swatch" style={{ background: '#34d399' }} /> Completed</div>
                    </div>
                    {ganttData.length > 0 ? (
                        <Plot
                            data={ganttData}
                            layout={{
                                title: "Task Gantt Chart",
                                margin: { l: 180, r: 50, t: 60, b: 40 },
                                xaxis: { title: "Duration (days)", type: "date", tickformat: "%b %d" },
                                yaxis: { automargin: true },
                                plot_bgcolor: "#fff",
                                paper_bgcolor: "#fff",
                                height: 500,
                            }}
                            config={{ responsive: true }}
                            style={{ width: "100%", height: "100%" }}
                        />
                    ) : (
                        <div className="gantt-empty">
                            <div style={{ fontSize: 18, marginBottom: 8 }}>No tasks with due dates to display</div>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'calendar' && (
                <div className="calendar-container">
                    <div className="calendar-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button className={`btn ${calendarView === 'month' ? 'active' : ''}`} onClick={() => setCalendarView('month')}>Month</button>
                            <button className={`btn ${calendarView === 'week' ? 'active' : ''}`} onClick={() => setCalendarView('week')}>Week</button>
                            <button className={`btn ${calendarView === 'day' ? 'active' : ''}`} onClick={() => setCalendarView('day')}>Day</button>
                        </div>

                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div className="calendar-legend" aria-hidden>
                                <div className="legend-item"><span className="swatch" style={{ background: colBgColor.todo, border: `1px solid ${colTextColor.todo}` }} /> To-do</div>
                                <div className="legend-item"><span className="swatch" style={{ background: colBgColor.inProgress, border: `1px solid ${colTextColor.inProgress}` }} /> In Progress</div>
                                <div className="legend-item"><span className="swatch" style={{ background: colBgColor.reviewReady, border: `1px solid ${colTextColor.reviewReady}` }} /> Review Ready</div>
                                <div className="legend-item"><span className="swatch" style={{ background: colBgColor.completed, border: `1px solid ${colTextColor.completed}` }} /> Completed</div>
                            </div>

                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                {Object.keys(calendarFilterCols).map((c) => (
                                    <button key={c} className={`btn filter-btn ${calendarFilterCols[c] ? 'active' : ''}`} onClick={() => toggleCalendarCol(c)} style={{ textTransform: 'capitalize' }}>{c.replace(/([A-Z])/g, ' $1')}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {calendarEvents.length > 0 ? (
                        <BigCalendar
                            localizer={momentLocalizer(moment)}
                            events={calendarEvents}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: 600 }}
                            view={calendarView}
                            onView={(v) => setCalendarView(v)}
                            views={["month", "week", "day"]}
                            onSelectEvent={onCalendarSelect}
                            eventPropGetter={(event) => ({
                                style: {
                                    backgroundColor: event.resource._col ? (colBgColor[event.resource._col] || '#fff') : '#fff',
                                    color: event.resource._col ? (colTextColor[event.resource._col] || '#111827') : '#111827',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(0,0,0,0.04)',
                                    padding: '6px 8px',
                                },
                            })}
                        />
                    ) : (
                        <p className="empty">No tasks with due dates</p>
                    )}
                </div>
            )}

            {showAssignModal && (
                <AssignModal
                    form={form}
                    onChange={handleFormChange}
                    onClose={closeAssignModal}
                    onSubmit={handleAssignSubmit}
                    isEditing={!!editingTaskId}
                />
            )}

            {detailTask && (
                <DetailModal
                    task={detailTask}
                    pendingDaysText={pendingDaysText}
                    onClose={() => setDetailTask(null)}
                />
            )}
            {selectionMode === 'remove' && (
                <div className="selection-toolbar" role="region" aria-label="Selection toolbar">
                    <button className="btn-primary" onClick={performBulkRemove} disabled={!selectedTaskIds.length}>
                        Remove selected
                    </button>
                    <button className="btn-secondary" onClick={cancelSelectionMode}>Cancel</button>
                    <div style={{ fontWeight: 600, marginLeft: 8 }}>{selectedTaskIds.length} selected</div>
                </div>
            )}
            {actionMessage && (
                <div className="action-message" role="status">
                    {actionMessage}
                </div>
            )}
        </div>
    );
};

const Header = ({ onAddTask, viewMode, setViewMode }) => {
    const viewMap = { Board: 'board', List: 'list', Gantt: 'gantt', Calendar: 'calendar' };
    return (
        <div className="workspace-header">
            <h1>Task Tracker</h1>
            <div className="actions">
                {['Board', 'List', 'Gantt', 'Calendar', 'Filters', 'Group by: Status'].map((label) => {
                    const key = viewMap[label];
                    const short = label.split(':')[0].trim();
                    const icon = ICONS[short];
                    if (key) {
                        return (
                            <button
                                key={label}
                                className="action-btn"
                                onClick={() => setViewMode && setViewMode(key)}
                                aria-pressed={viewMode === key}
                                type="button"
                            >
                                {icon && <span className="btn-icon" aria-hidden>{icon}</span>}
                                <span>{label}</span>
                            </button>
                        );
                    }
                    return (
                        <button key={label} className="action-btn" type="button">
                            {icon && <span className="btn-icon" aria-hidden>{icon}</span>}
                            <span>{label}</span>
                        </button>
                    );
                })}
                <button className="btn-add-task" onClick={onAddTask} type="button">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Add Task
                </button>
            </div>
        </div>
    );
};

const AssignModal = ({ form, onChange, onClose, onSubmit, isEditing }) => (
    <div className="tt-popup-overlay">
        <div className="tt-popup-content">
            <h3>{isEditing ? 'Edit Task' : 'Add Task'}</h3>
            <form onSubmit={onSubmit} className="tt-form">
                <Input label="Category" value={form.category} onChange={(e) => onChange("category", e.target.value)} />
                <Input label="Title" value={form.title} onChange={(e) => onChange("title", e.target.value)} required />
                <Input label="User Name" value={form.userName} onChange={(e) => onChange("userName", e.target.value)} />
                <Input label="Email" value={form.email || ""} onChange={(e) => onChange("email", e.target.value)} />

                <div className="po-date-range-filter">
                    <label style={{ flex: 1 }}>
                        From:
                        <ReactDatePicker
                            selected={form.assignDate}
                            onChange={(date) => onChange("assignDate", date)}
                            selectsStart
                            startDate={form.assignDate}
                            endDate={form.expiryDate}
                            placeholderText="Select start date"
                            dateFormat="yyyy-MM-dd"
                            className="po-custom-datepicker"
                        />
                    </label>

                    <label style={{ flex: 1 }}>
                        To:
                        <ReactDatePicker
                            selected={form.expiryDate}
                            onChange={(date) => onChange("expiryDate", date)}
                            selectsEnd
                            startDate={form.assignDate}
                            endDate={form.expiryDate}
                            minDate={form.assignDate}
                            placeholderText="Select end date"
                            dateFormat="yyyy-MM-dd"
                            className="po-custom-datepicker"
                        />
                    </label>

                    {(form.assignDate || form.expiryDate) && (
                        <button
                            type="button"
                            className="po-clear-date-btn"
                            onClick={() => {
                                onChange("assignDate", null);
                                onChange("expiryDate", null);
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>


                <label className="full">
                    Task Description
                    <textarea rows={4} value={form.description} onChange={(e) => onChange("description", e.target.value)} />
                </label>

                <div className="tt-form-actions">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary">{isEditing ? 'Save' : 'Create'}</button>
                </div>
            </form>
        </div>
    </div>
);

const Input = ({ label, className, ...props }) => (
    <label>
        {label}
        <input className={(className ? className + ' ' : '') + 'tt-input'} {...props} />
    </label>
);



const DetailModal = ({ task, pendingDaysText, onClose }) => (
    <div className="tt-popup-overlay">
        <div className="tt-popup-content">
            <h3>Task Details</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                {task.avatar ? (
                    <img src={task.avatar} alt="avatar" className="detail-avatar" />
                ) : (
                    <div className="detail-avatar placeholder" />
                )}
                <div>
                    <div style={{ fontWeight: 700 }}>{task.userName || "No user"}</div>
                    <div style={{ fontSize: 12, color: "rgba(55,65,81,0.8)", marginTop: 2 }}>
                        {task.email ||
                            `${(task.userName || "no-user")
                                .trim()
                                .toLowerCase()
                                .replace(/[^a-z0-9\s.-]/g, "")
                                .replace(/\s+/g, ".")}@example.com`}
                    </div>
                    <div style={{ fontSize: 14, color: "var(--primary-color)", marginTop: 6 }}>
                        {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(55,65,81,0.8)", marginTop: 4 }}>
                        {task.category}
                    </div>
                </div>
            </div>
            {task.description && (
                <div style={{ fontSize: 13, color: "var(--primary-color)", marginBottom: 8 }}>
                    {task.description}
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13, color: "rgba(55,65,81,0.9)" }}>
                <div><strong>Assign Date:</strong> {formatDate(task.assignDate) || task.date || "Not set"}</div>
                <div><strong>Expiry Date:</strong> {formatDate(task.expiryDate) || "Not set"}</div>
                <div><strong>Duration:</strong> {task.duration || "Not set"}</div>
                {pendingDaysText && <div><strong>Pending:</strong> {pendingDaysText}</div>}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                <button className="btn-secondary" onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

export default TaskTracker;