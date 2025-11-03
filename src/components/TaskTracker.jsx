import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskTracker.css';

const TaskTracker = () => {
    // Start with empty tasks array - initially blank page
    const [tasks, setTasks] = useState([]);

    // Load tasks from localStorage on mount and listen for external updates
    useEffect(() => {
        const loadTasks = () => {
            try {
                const tasksData = localStorage.getItem('taskTrackerTasks');
                if (tasksData) {
                    setTasks(JSON.parse(tasksData));
                } else {
                    setTasks([]);
                }
            } catch (e) {
                console.error('Failed to parse tasks from localStorage', e);
            }
        };
        loadTasks();

        // Listen for updates from other parts of the app
        window.addEventListener('storage', loadTasks);
        window.addEventListener('taskTrackerTasksUpdated', loadTasks);
        window.addEventListener('focus', loadTasks);
        const visibilityHandler = () => {
            if (document.visibilityState === 'visible') loadTasks();
        };
        document.addEventListener('visibilitychange', visibilityHandler);

        return () => {
            window.removeEventListener('storage', loadTasks);
            window.removeEventListener('taskTrackerTasksUpdated', loadTasks);
            window.removeEventListener('focus', loadTasks);
            document.removeEventListener('visibilitychange', visibilityHandler);
        };
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem('taskTrackerTasks', JSON.stringify(tasks));
    }, [tasks]);

    // User list for dropdown
    const userList = [
        'Rajesh Kumar',
        'Priya Sharma',
        'Amit Patel',
        'Sneha Reddy',
        'Vikram Singh',
        'Anjali Verma',
        'Karthik Menon',
        'Divya Nair',
        'Rohit Sharma',
        'Pooja Reddy'
    ];

    // Task name list for dropdown
    const taskNameList = [
        'Update Inventory System',
        'Customer Database Migration',
        'API Integration',
        'UI/UX Redesign',
        'Security Audit',
        'Documentation Update',
        'Performance Optimization',
        'Mobile App Testing',
        'Backup System Setup',
        'Email Campaign Setup',
        'Bug Fixes',
        'Analytics Dashboard',
        'User Training',
        'Report Generation',
        'Code Review',
        'Database Maintenance',
        'Server Configuration',
        'Client Meeting',
        'Feature Development',
        'Testing & QA'
    ];

    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [filteredTasks, setFilteredTasks] = useState(tasks);
    const [showUserDropdown, setShowUserDropdown] = useState(null);
    const [showTaskDropdown, setShowTaskDropdown] = useState(null);
    const [userSearchText, setUserSearchText] = useState({});
    const [taskSearchText, setTaskSearchText] = useState({});
    const [headerUserFilter, setHeaderUserFilter] = useState([]);
    const [headerTaskFilter, setHeaderTaskFilter] = useState([]);
    const [showHeaderUserDropdown, setShowHeaderUserDropdown] = useState(false);
    const [showHeaderTaskDropdown, setShowHeaderTaskDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const headerUserDropdownRef = useRef(null);
    const headerTaskDropdownRef = useRef(null);

    // Assign Task states
    const [showAssignPopup, setShowAssignPopup] = useState(false);
    const [newTask, setNewTask] = useState({
        dateFrom: '',
        dateTo: '',
        user: '',
        taskName: '',
        taskUpdates: ''
    });
    const [showAssignUserDropdown, setShowAssignUserDropdown] = useState(false);
    const [showAssignTaskDropdown, setShowAssignTaskDropdown] = useState(false);
    const assignUserDropdownRef = useRef(null);
    const assignTaskDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowUserDropdown(null);
                setShowTaskDropdown(null);
            }
            if (headerUserDropdownRef.current && !headerUserDropdownRef.current.contains(e.target)) {
                setShowHeaderUserDropdown(false);
            }
            if (headerTaskDropdownRef.current && !headerTaskDropdownRef.current.contains(e.target)) {
                setShowHeaderTaskDropdown(false);
            }
            if (assignUserDropdownRef.current && !assignUserDropdownRef.current.contains(e.target)) {
                setShowAssignUserDropdown(false);
            }
            if (assignTaskDropdownRef.current && !assignTaskDropdownRef.current.contains(e.target)) {
                setShowAssignTaskDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter tasks based on date range
    useEffect(() => {
        let filtered = [...tasks];

        // Apply date range filter - check if task date range overlaps with filter date range
        if (dateRange.from || dateRange.to) {
            filtered = filtered.filter((task) => {
                const taskFrom = new Date(task.dateFrom);
                const taskTo = new Date(task.dateTo);
                taskFrom.setHours(0, 0, 0, 0);
                taskTo.setHours(23, 59, 59, 999);

                const filterFrom = dateRange.from ? new Date(dateRange.from) : null;
                if (filterFrom) filterFrom.setHours(0, 0, 0, 0);

                const filterTo = dateRange.to ? new Date(dateRange.to) : null;
                if (filterTo) filterTo.setHours(23, 59, 59, 999);

                // Check if date ranges overlap
                if (filterFrom && filterTo) {
                    return taskFrom <= filterTo && taskTo >= filterFrom;
                } else if (filterFrom) {
                    return taskTo >= filterFrom;
                } else if (filterTo) {
                    return taskFrom <= filterTo;
                }
                return true;
            });
        }

        // Apply user filter
        if (headerUserFilter.length > 0) {
            filtered = filtered.filter(task => headerUserFilter.includes(task.user));
        }

        // Apply task name filter
        if (headerTaskFilter.length > 0) {
            filtered = filtered.filter(task => headerTaskFilter.includes(task.taskName));
        }

        setFilteredTasks(filtered);
    }, [dateRange, tasks, headerUserFilter, headerTaskFilter]);

    // Handle field changes
    const handleFieldChange = (id, field, value) => {
        setTasks(prev => prev.map(task => 
            task.id === id ? { ...task, [field]: value } : task
        ));
    };

    // Filter users based on search
    const getFilteredUsers = (searchText) => {
        if (!searchText) return userList;
        return userList.filter(user => 
            user.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // Filter task names based on search
    const getFilteredTaskNames = (searchText) => {
        if (!searchText) return taskNameList;
        return taskNameList.filter(taskName => 
            taskName.toLowerCase().includes(searchText.toLowerCase())
        );
    };

    // Get status color based on percentage
    const getStatusColor = (status) => {
        if (status >= 80) return '#22c55e'; // Green
        if (status >= 50) return '#3b82f6'; // Blue
        if (status >= 30) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    // Handle header user filter
    const handleHeaderUserFilter = (user) => {
        setHeaderUserFilter(prev => {
            if (prev.includes(user)) {
                return prev.filter(u => u !== user);
            } else {
                return [...prev, user];
            }
        });
    };

    // Handle header task filter
    const handleHeaderTaskFilter = (taskName) => {
        setHeaderTaskFilter(prev => {
            if (prev.includes(taskName)) {
                return prev.filter(t => t !== taskName);
            } else {
                return [...prev, taskName];
            }
        });
    };

    // Handle select all for user filter
    const handleSelectAllUsers = () => {
        if (headerUserFilter.length === userList.length) {
            setHeaderUserFilter([]);
        } else {
            setHeaderUserFilter([...userList]);
        }
    };

    // Handle select all for task filter
    const handleSelectAllTasks = () => {
        if (headerTaskFilter.length === taskNameList.length) {
            setHeaderTaskFilter([]);
        } else {
            setHeaderTaskFilter([...taskNameList]);
        }
    };

    // Handle assign task
    const handleAssignTask = () => {
        if (!newTask.user || !newTask.taskName) {
            alert('Please select both user and task name');
            return;
        }

        const newTaskObj = {
            id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
            dateFrom: newTask.dateFrom,
            dateTo: newTask.dateTo,
            user: newTask.user,
            taskName: newTask.taskName,
            taskUpdates: newTask.taskUpdates,
            updatesFromUser: '', // Initially blank
            status: 0 // Initially 0
        };

        setTasks(prev => [...prev, newTaskObj]);
        setShowAssignPopup(false);
        
        // Reset form (keep dates empty until user selects)
        setNewTask({
            dateFrom: '',
            dateTo: '',
            user: '',
            taskName: '',
            taskUpdates: ''
        });
    };

    // Handle cancel assign task
    const handleCancelAssign = () => {
        setShowAssignPopup(false);
        setNewTask({
            dateFrom: '',
            dateTo: '',
            user: '',
            taskName: '',
            taskUpdates: ''
        });
    };

    // Get filtered users for assign dropdown
    const getAssignFilteredUsers = () => {
        if (!newTask.user) return userList;
        return userList.filter(user => 
            user.toLowerCase().includes(newTask.user.toLowerCase())
        );
    };

    // Get filtered task names for assign dropdown
    const getAssignFilteredTaskNames = () => {
        if (!newTask.taskName) return taskNameList;
        return taskNameList.filter(taskName => 
            taskName.toLowerCase().includes(newTask.taskName.toLowerCase())
        );
    };

    return (
        <div className="tt-panel-wrapper">
            <div className="tt-panel-header">
                <h3 className="tt-heading">Task Tracker</h3>
                <div className="tt-header-controls">
                    <button 
                        className="tt-assign-task-btn"
                        onClick={() => setShowAssignPopup(true)}
                    >
                        + Assign Task
                    </button>
                    {/* <div className="tt-date-range-filter">
                        <label>
                            From:
                            <DatePicker
                                selected={dateRange.from}
                                onChange={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                                selectsStart
                                startDate={dateRange.from}
                                endDate={dateRange.to}
                                placeholderText="Select start date"
                                dateFormat="yyyy-MM-dd"
                                className="tt-custom-datepicker"
                            />
                        </label>
                        <label>
                            To:
                            <DatePicker
                                selected={dateRange.to}
                                onChange={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                                selectsEnd
                                startDate={dateRange.from}
                                endDate={dateRange.to}
                                minDate={dateRange.from}
                                placeholderText="Select end date"
                                dateFormat="yyyy-MM-dd"
                                className="tt-custom-datepicker"
                            />
                        </label>
                        {(dateRange.from || dateRange.to) && (
                            <button
                                className="tt-clear-date-btn"
                                onClick={() => setDateRange({ from: null, to: null })}
                            >
                                Clear
                            </button>
                        )}
                    </div> */}
                </div>
            </div>

            <div className="tt-table-container">
                <table className="tt-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>
                                <div className="tt-th-filter-wrapper">
                                    User
                                    <button
                                        className="tt-filter-btn"
                                        onClick={() => setShowHeaderUserDropdown(!showHeaderUserDropdown)}
                                    >
                                        ⏷
                                    </button>
                                    {showHeaderUserDropdown && (
                                        <div className="tt-header-filter-dropdown" ref={headerUserDropdownRef}>
                                            <div className="tt-filter-select-all">
                                                <label className="tt-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={headerUserFilter.length === userList.length}
                                                        onChange={handleSelectAllUsers}
                                                    />
                                                    <strong>Select All</strong>
                                                </label>
                                            </div>
                                            <div className="tt-filter-options">
                                                {userList.map((user) => (
                                                    <label key={user} className="tt-filter-option">
                                                        <input
                                                            type="checkbox"
                                                            checked={headerUserFilter.includes(user)}
                                                            onChange={() => handleHeaderUserFilter(user)}
                                                        />
                                                        {user}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </th>
                            <th>
                                <div className="tt-th-filter-wrapper">
                                    Task Name
                                    <button
                                        className="tt-filter-btn"
                                        onClick={() => setShowHeaderTaskDropdown(!showHeaderTaskDropdown)}
                                    >
                                        ⏷
                                    </button>
                                    {showHeaderTaskDropdown && (
                                        <div className="tt-header-filter-dropdown" ref={headerTaskDropdownRef}>
                                            <div className="tt-filter-select-all">
                                                <label className="tt-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        checked={headerTaskFilter.length === taskNameList.length}
                                                        onChange={handleSelectAllTasks}
                                                    />
                                                    <strong>Select All</strong>
                                                </label>
                                            </div>
                                            <div className="tt-filter-options">
                                                {taskNameList.map((taskName) => (
                                                    <label key={taskName} className="tt-filter-option">
                                                        <input
                                                            type="checkbox"
                                                            checked={headerTaskFilter.includes(taskName)}
                                                            onChange={() => handleHeaderTaskFilter(taskName)}
                                                        />
                                                        {taskName}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </th>
                            <th>Task Updates (Description)</th>
                            <th>Updates from User</th>
                            <th>Status (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="tt-empty-state">
                                    <div className="tt-empty-content">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                                        </svg>
                                        <h4>No Tasks Assigned Yet</h4>
                                        <p>Click "Assign Task" button to create your first task</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map((task) => (
                            <tr key={task.id}>
                                <td>
                                    <div className="tt-date-range-cell">
                                        <div className="tt-date-input-group">
                                            <label className="tt-date-label">From:</label>
                                            <DatePicker
                                                selected={task.dateFrom ? new Date(task.dateFrom) : null}
                                                onChange={(date) => handleFieldChange(task.id, 'dateFrom', date ? date.toISOString().split('T')[0] : '')}
                                                selectsStart
                                                startDate={task.dateFrom ? new Date(task.dateFrom) : null}
                                                endDate={task.dateTo ? new Date(task.dateTo) : null}
                                                placeholderText="Select start date"
                                                dateFormat="yyyy-MM-dd"
                                                className="tt-input tt-date-input"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        <div className="tt-date-input-group">
                                            <label className="tt-date-label">To:</label>
                                            <DatePicker
                                                selected={task.dateTo ? new Date(task.dateTo) : null}
                                                onChange={(date) => handleFieldChange(task.id, 'dateTo', date ? date.toISOString().split('T')[0] : '')}
                                                selectsEnd
                                                startDate={task.dateFrom ? new Date(task.dateFrom) : null}
                                                endDate={task.dateTo ? new Date(task.dateTo) : null}
                                                minDate={task.dateFrom ? new Date(task.dateFrom) : null}
                                                placeholderText="Select end date"
                                                dateFormat="yyyy-MM-dd"
                                                className="tt-input tt-date-input"
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="tt-dropdown-wrapper" ref={showUserDropdown === task.id ? dropdownRef : null}>
                                        <input
                                            type="text"
                                            value={task.user}
                                            onChange={(e) => {
                                                handleFieldChange(task.id, 'user', e.target.value);
                                                setUserSearchText(prev => ({ ...prev, [task.id]: e.target.value }));
                                            }}
                                            onFocus={() => setShowUserDropdown(task.id)}
                                            className="tt-input tt-dropdown-input"
                                            placeholder="Select user"
                                            readOnly
                                        />
                                        {showUserDropdown === task.id && (
                                            <div className="tt-dropdown">
                                                {getFilteredUsers(task.user).map((user, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="tt-dropdown-item"
                                                        onClick={() => {
                                                            handleFieldChange(task.id, 'user', user);
                                                            setShowUserDropdown(null);
                                                        }}
                                                    >
                                                        {user}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="tt-dropdown-wrapper" ref={showTaskDropdown === task.id ? dropdownRef : null}>
                                        <input
                                            type="text"
                                            value={task.taskName}
                                            onChange={(e) => {
                                                handleFieldChange(task.id, 'taskName', e.target.value);
                                                setTaskSearchText(prev => ({ ...prev, [task.id]: e.target.value }));
                                            }}
                                            onFocus={() => setShowTaskDropdown(task.id)}
                                            className="tt-input tt-dropdown-input"
                                            placeholder="Select task"
                                            readOnly
                                        />
                                        {showTaskDropdown === task.id && (
                                            <div className="tt-dropdown">
                                                {getFilteredTaskNames(task.taskName).map((taskName, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="tt-dropdown-item"
                                                        onClick={() => {
                                                            handleFieldChange(task.id, 'taskName', taskName);
                                                            setShowTaskDropdown(null);
                                                        }}
                                                    >
                                                        {taskName}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <textarea
                                        value={task.taskUpdates}
                                        onChange={(e) => handleFieldChange(task.id, 'taskUpdates', e.target.value)}
                                        className="tt-textarea"
                                        rows="2"
                                        placeholder="Task description"
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <textarea
                                        value={task.updatesFromUser}
                                        onChange={(e) => handleFieldChange(task.id, 'updatesFromUser', e.target.value)}
                                        className="tt-textarea"
                                        rows="2"
                                        placeholder="User updates..."
                                        readOnly
                                    />
                                </td>
                                <td>
                                    <div className="tt-status-wrapper">
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={task.status}
                                            onChange={(e) => {
                                                const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                                handleFieldChange(task.id, 'status', value);
                                            }}
                                            className="tt-input tt-status-input"
                                            readOnly
                                        />
                                        <div className="tt-status-bar">
                                            <div 
                                                className="tt-status-fill" 
                                                style={{ 
                                                    width: `${task.status}%`,
                                                    backgroundColor: getStatusColor(task.status)
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>

            {/* Assign Task Popup */}
            {showAssignPopup && (
                <div className="tt-popup-overlay" onClick={handleCancelAssign}>
                    <div className="tt-popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="tt-popup-title">Assign Task</h3>
                        
                        <div className="tt-form-grid">
                            <div className="tt-form-group">
                                <label>Date From:</label>
                                <DatePicker
                                    selected={newTask.dateFrom ? new Date(newTask.dateFrom) : null}
                                    onChange={(date) => setNewTask(prev => ({ ...prev, dateFrom: date ? date.toISOString().split('T')[0] : '' }))}
                                    selectsStart
                                    startDate={newTask.dateFrom ? new Date(newTask.dateFrom) : null}
                                    endDate={newTask.dateTo ? new Date(newTask.dateTo) : null}
                                    placeholderText="Select start date"
                                    dateFormat="yyyy-MM-dd"
                                    className="tt-popup-input"
                                />
                            </div>

                            <div className="tt-form-group">
                                <label>Date To:</label>
                                <DatePicker
                                    selected={newTask.dateTo ? new Date(newTask.dateTo) : null}
                                    onChange={(date) => setNewTask(prev => ({ ...prev, dateTo: date ? date.toISOString().split('T')[0] : '' }))}
                                    selectsEnd
                                    startDate={newTask.dateFrom ? new Date(newTask.dateFrom) : null}
                                    endDate={newTask.dateTo ? new Date(newTask.dateTo) : null}
                                    minDate={newTask.dateFrom ? new Date(newTask.dateFrom) : null}
                                    placeholderText="Select end date"
                                    dateFormat="yyyy-MM-dd"
                                    className="tt-popup-input"
                                />
                            </div>

                            <div className="tt-form-group">
                                <label>User: <span className="tt-required">*</span></label>
                                <div className="tt-dropdown-wrapper" ref={assignUserDropdownRef}>
                                    <input
                                        type="text"
                                        value={newTask.user}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, user: e.target.value }))}
                                        onFocus={() => setShowAssignUserDropdown(true)}
                                        className="tt-popup-input"
                                        placeholder="Select or type user name"
                                    />
                                    {showAssignUserDropdown && (
                                        <div className="tt-dropdown">
                                            {getAssignFilteredUsers().map((user, idx) => (
                                                <div
                                                    key={idx}
                                                    className="tt-dropdown-item"
                                                    onClick={() => {
                                                        setNewTask(prev => ({ ...prev, user }));
                                                        setShowAssignUserDropdown(false);
                                                    }}
                                                >
                                                    {user}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="tt-form-group">
                                <label>Task Name: <span className="tt-required">*</span></label>
                                <div className="tt-dropdown-wrapper" ref={assignTaskDropdownRef}>
                                    <input
                                        type="text"
                                        value={newTask.taskName}
                                        onChange={(e) => setNewTask(prev => ({ ...prev, taskName: e.target.value }))}
                                        onFocus={() => setShowAssignTaskDropdown(true)}
                                        className="tt-popup-input"
                                        placeholder="Select or type task name"
                                    />
                                    {showAssignTaskDropdown && (
                                        <div className="tt-dropdown">
                                            {getAssignFilteredTaskNames().map((taskName, idx) => (
                                                <div
                                                    key={idx}
                                                    className="tt-dropdown-item"
                                                    onClick={() => {
                                                        setNewTask(prev => ({ ...prev, taskName }));
                                                        setShowAssignTaskDropdown(false);
                                                    }}
                                                >
                                                    {taskName}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="tt-form-group tt-full-width">
                                <label>Task Updates (Description):</label>
                                <textarea
                                    value={newTask.taskUpdates}
                                    onChange={(e) => setNewTask(prev => ({ ...prev, taskUpdates: e.target.value }))}
                                    className="tt-popup-textarea"
                                    rows="3"
                                    placeholder="Enter task description..."
                                />
                            </div>
                        </div>

                        <div className="tt-popup-buttons">
                            <button className="tt-btn-cancel" onClick={handleCancelAssign}>
                                Cancel
                            </button>
                            <button className="tt-btn-assign" onClick={handleAssignTask}>
                                Assign Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskTracker;
