import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TaskUpdate.css';

const TaskUpdate = () => {
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

    const [taskUpdate, setTaskUpdate] = useState({
        date: '',
        user: '',
        taskName: '',
        updatesFromUser: '',
        expiryDate: '',
        status: 0
    });
    const [statusEdited, setStatusEdited] = useState(false);

    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [availableTasks, setAvailableTasks] = useState([]);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const userDropdownRef = useRef(null);

    // Load tasks from localStorage
    useEffect(() => {
        const loadTasks = () => {
            const tasksData = localStorage.getItem('taskTrackerTasks');
            if (tasksData) {
                setAvailableTasks(JSON.parse(tasksData));
            }
        };
        loadTasks();
        
        // Listen for storage changes (when TaskTracker updates)
        window.addEventListener('storage', loadTasks);
        return () => window.removeEventListener('storage', loadTasks);
    }, []);

    // When user (and optionally task name) is selected, auto-populate task data
    useEffect(() => {
        if (taskUpdate.user) {
            const candidates = availableTasks.filter(t => t.user === taskUpdate.user);
            if (candidates.length === 0) return;

            // Prefer exact task name match if provided; otherwise choose the latest by id
            let chosen = null;
            if (taskUpdate.taskName) {
                chosen = candidates.find(t => t.taskName === taskUpdate.taskName) || null;
            }
            if (!chosen) {
                chosen = candidates.reduce((acc, t) => (acc == null || t.id > acc.id ? t : acc), null);
            }
            if (chosen) {
                setSelectedTaskId(chosen.id);
                setTaskUpdate(prev => ({
                    ...prev,
                    date: chosen.dateFrom || '',
                    taskName: chosen.taskName || '',
                    expiryDate: chosen.dateTo || '',
                    status: chosen.status || 0
                }));
                setStatusEdited(false);
            }
        }
    }, [taskUpdate.user, taskUpdate.taskName, availableTasks]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter users based on search
    const getFilteredUsers = () => {
        if (!taskUpdate.user) return userList;
        return userList.filter(user => 
            user.toLowerCase().includes(taskUpdate.user.toLowerCase())
        );
    };

    // Filter task names based on search
    const getFilteredTaskNames = () => {
        if (!taskUpdate.taskName) return taskNameList;
        return taskNameList.filter(taskName => 
            taskName.toLowerCase().includes(taskUpdate.taskName.toLowerCase())
        );
    };

    // Calculate status based on update
    const calculateStatus = (updateText) => {
        if (!updateText || updateText.trim() === '') return 0;
        
        // Simple logic: increase status based on update length and keywords
        let statusIncrease = 10; // Base increase
        
        const completionKeywords = ['completed', 'done', 'finished', 'ready', 'resolved', 'fixed'];
        const progressKeywords = ['working', 'progress', 'developing', 'implementing', 'testing'];
        
        const lowerUpdate = updateText.toLowerCase();
        
        if (completionKeywords.some(keyword => lowerUpdate.includes(keyword))) {
            statusIncrease = 90; // Near completion
        } else if (progressKeywords.some(keyword => lowerUpdate.includes(keyword))) {
            statusIncrease = 50; // Mid progress
        } else if (updateText.length > 100) {
            statusIncrease = 30; // Detailed update
        } else if (updateText.length > 50) {
            statusIncrease = 20; // Some update
        }
        
        return statusIncrease;
    };

    // Handle submit
    const handleSubmit = () => {
        if (!taskUpdate.user || !taskUpdate.updatesFromUser.trim()) {
            alert('Please select a user and provide an update');
            return;
        }

        let targetTaskId = selectedTaskId;
        if (!targetTaskId) {
            // Try to resolve by user + task name as a fallback
            const tasksData = localStorage.getItem('taskTrackerTasks');
            if (tasksData) {
                const tasks = JSON.parse(tasksData);
                const candidates = tasks.filter(t => t.user === taskUpdate.user);
                const match = taskUpdate.taskName
                    ? candidates.find(t => t.taskName === taskUpdate.taskName)
                    : candidates.reduce((acc, t) => (acc == null || t.id > acc.id ? t : acc), null);
                if (match) {
                    targetTaskId = match.id;
                } else {
                    alert('No task found for this user. Please assign a task first in Task Tracker.');
                    return;
                }
            } else {
                alert('No task found for this user. Please assign a task first in Task Tracker.');
                return;
            }
        }

        // Determine new status: respect manual edits; otherwise auto-calc
        const currentStatus = taskUpdate.status || 0;
        let newStatus = currentStatus;
        if (statusEdited) {
            newStatus = Math.min(100, Math.max(0, currentStatus));
        } else {
            const statusIncrease = calculateStatus(taskUpdate.updatesFromUser);
            newStatus = Math.min(100, currentStatus + statusIncrease);
        }

        // Update the task in localStorage; store updatesFromUser as a JSON array of { text, ts }
        const tasksData = localStorage.getItem('taskTrackerTasks');
        if (tasksData) {
            const tasks = JSON.parse(tasksData);
            const now = new Date();
            const ts = now.toISOString();

            const updatedTasks = tasks.map(task => {
                if (task.id === targetTaskId) {
                    // Normalize existing updates to array
                    let updatesArr = [];
                    try {
                        if (Array.isArray(task.updatesFromUser)) {
                            updatesArr = task.updatesFromUser;
                        } else if (typeof task.updatesFromUser === 'string' && task.updatesFromUser.trim() !== '') {
                            // previous simple string -> keep as single entry
                            updatesArr = [{ text: task.updatesFromUser, ts: null }];
                        }
                    } catch (e) {
                        updatesArr = [{ text: task.updatesFromUser || '', ts: null }];
                    }

                    // Append new update
                    updatesArr.push({ text: taskUpdate.updatesFromUser, ts });

                    return {
                        ...task,
                        updatesFromUser: updatesArr,
                        status: newStatus
                    };
                }
                return task;
            });

            localStorage.setItem('taskTrackerTasks', JSON.stringify(updatedTasks));
            // Notify TaskTracker within the same SPA/tab
            window.dispatchEvent(new Event('taskTrackerTasksUpdated'));
            // Keep local state in sync too
            setAvailableTasks(updatedTasks);
        }

        if (statusEdited) {
            alert(`Task update submitted successfully!\nStatus set to: ${newStatus}%`);
        } else {
            alert(`Task update submitted successfully!\nStatus updated: ${currentStatus}% → ${newStatus}%`);
        }
        
        // Reset form
        setTaskUpdate({
            date: '',
            user: '',
            taskName: '',
            updatesFromUser: '',
            expiryDate: '',
            status: 0
        });
        setStatusEdited(false);
        setSelectedTaskId(null);
    };

    return (
        <div className="tu-container">
            <div className="tu-panel">
                <h2 className="tu-title">Task Update</h2>
                
                <div className="tu-form">
                    {/* User Field - At Top */}
                    <div className="tu-form-group tu-user-field">
                        <label className="tu-label">
                            User <span className="tu-required">*</span>
                        </label>
                        <div className="tu-dropdown-wrapper" ref={userDropdownRef}>
                            <input
                                type="text"
                                value={taskUpdate.user}
                                onChange={(e) => setTaskUpdate(prev => ({ ...prev, user: e.target.value }))}
                                onFocus={() => setShowUserDropdown(true)}
                                className="tu-input"
                                placeholder="Select or type user name"
                            />
                            {showUserDropdown && (
                                <div className="tu-dropdown">
                                    {getFilteredUsers().map((user, idx) => (
                                        <div
                                            key={idx}
                                            className="tu-dropdown-item"
                                            onClick={() => {
                                                setTaskUpdate(prev => ({ ...prev, user }));
                                                setShowUserDropdown(false);
                                            }}
                                        >
                                            {user}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date Field - Auto-populated */}
                    <div className="tu-form-group">
                        <label className="tu-label">Date (From Task)</label>
                        <DatePicker
                            selected={taskUpdate.date ? new Date(taskUpdate.date) : null}
                            dateFormat="yyyy-MM-dd"
                            className="tu-input"
                            placeholderText="Auto-filled when user selected"
                            readOnly
                            disabled
                        />
                    </div>

                    {/* Task Name Field - Auto-populated */}
                    <div className="tu-form-group">
                        <label className="tu-label">Task Name (From Task)</label>
                        <input
                            type="text"
                            value={taskUpdate.taskName}
                            className="tu-input"
                            placeholder="Auto-filled when user selected"
                            readOnly
                        />
                    </div>

                    {/* Updates from User Field */}
                    <div className="tu-form-group tu-full-width">
                        <label className="tu-label">
                            Updates from User <span className="tu-required">*</span>
                        </label>
                        <textarea
                            value={taskUpdate.updatesFromUser}
                            onChange={(e) => setTaskUpdate(prev => ({ ...prev, updatesFromUser: e.target.value }))}
                            className="tu-textarea"
                            rows="6"
                            placeholder="Enter your task updates here... (Status will be automatically calculated based on your update)"
                        />
                    </div>

                    {/* Task Expiry Date Field - Auto-populated */}
                    <div className="tu-form-group">
                        <label className="tu-label">Task Expiry Date (From Task)</label>
                        <DatePicker
                            selected={taskUpdate.expiryDate ? new Date(taskUpdate.expiryDate) : null}
                            dateFormat="yyyy-MM-dd"
                            className="tu-input"
                            placeholderText="Auto-filled when user selected"
                            readOnly
                            disabled
                        />
                    </div>

                    {/* Current Status - Editable */}
                    <div className="tu-form-group">
                        <label className="tu-label">Current Status</label>
                        <div className="tu-status-display tu-status-editable">
                            <div className="tu-status-controls">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={taskUpdate.status}
                                    onChange={(e) => {
                                        const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                        setTaskUpdate(prev => ({ ...prev, status: v }));
                                        setStatusEdited(true);
                                    }}
                                    className="tu-status-slider"
                                />
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={taskUpdate.status}
                                    onChange={(e) => {
                                        const v = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                                        setTaskUpdate(prev => ({ ...prev, status: v }));
                                        setStatusEdited(true);
                                    }}
                                    className="tu-input tu-status-number"
                                />
                                <span className="tu-status-text">{taskUpdate.status}%</span>
                            </div>
                            <div className="tu-status-bar">
                                <div 
                                    className="tu-status-fill" 
                                    style={{ 
                                        width: `${taskUpdate.status}%`,
                                        backgroundColor: taskUpdate.status < 30 ? '#ef4444' : 
                                                       taskUpdate.status < 50 ? '#f97316' : 
                                                       taskUpdate.status < 80 ? '#3b82f6' : '#10b981'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="tu-button-container">
                        <button className="tu-submit-btn" onClick={handleSubmit}>
                            Add Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskUpdate;