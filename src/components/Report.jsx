import React, { useState, useEffect } from 'react';
import './Report.css';

const Report = () => {
    // Dummy data for various metrics
    const [reportData] = useState({
        taskStats: {
            total: 156,
            completed: 89,
            inProgress: 42,
            pending: 25
        },
        userPerformance: [
            { name: 'Rajesh Kumar', completed: 24, pending: 3, completion: 89 },
            { name: 'Priya Sharma', completed: 19, pending: 5, completion: 79 },
            { name: 'Amit Patel', completed: 15, pending: 4, completion: 79 },
            { name: 'Sneha Reddy', completed: 12, pending: 6, completion: 67 },
            { name: 'Vikram Singh', completed: 10, pending: 3, completion: 77 },
            { name: 'Anjali Verma', completed: 9, pending: 4, completion: 69 }
        ],
        monthlyProgress: [
            { month: 'Jan', completed: 45, pending: 12 },
            { month: 'Feb', completed: 52, pending: 10 },
            { month: 'Mar', completed: 48, pending: 15 },
            { month: 'Apr', completed: 61, pending: 8 },
            { month: 'May', completed: 58, pending: 11 },
            { month: 'Jun', completed: 67, pending: 9 }
        ],
        taskCategories: [
            { name: 'Bug Fixes', count: 32, percentage: 21 },
            { name: 'Feature Development', count: 48, percentage: 31 },
            { name: 'Documentation', count: 18, percentage: 12 },
            { name: 'Testing & QA', count: 28, percentage: 18 },
            { name: 'Code Review', count: 15, percentage: 10 },
            { name: 'Client Meeting', count: 15, percentage: 8 }
        ],
        priorityDistribution: [
            { priority: 'High', count: 42, color: '#ef4444' },
            { priority: 'Medium', count: 68, color: '#f59e0b' },
            { priority: 'Low', count: 46, color: '#10b981' }
        ]
    });

    const [selectedPeriod, setSelectedPeriod] = useState('6months');

    // Calculate completion rate
    const completionRate = Math.round((reportData.taskStats.completed / reportData.taskStats.total) * 100);

    // Get max value for bar chart scaling
    const maxMonthlyValue = Math.max(...reportData.monthlyProgress.map(m => m.completed + m.pending));

    return (
        <div className="report-wrapper">
            <div className="report-header">
                <h1 className="report-title">Dashboard & Analytics</h1>
                <div className="report-period-selector">
                    <button 
                        className={`period-btn ${selectedPeriod === '1month' ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod('1month')}
                    >
                        1 Month
                    </button>
                    <button 
                        className={`period-btn ${selectedPeriod === '3months' ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod('3months')}
                    >
                        3 Months
                    </button>
                    <button 
                        className={`period-btn ${selectedPeriod === '6months' ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod('6months')}
                    >
                        6 Months
                    </button>
                    <button 
                        className={`period-btn ${selectedPeriod === '1year' ? 'active' : ''}`}
                        onClick={() => setSelectedPeriod('1year')}
                    >
                        1 Year
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="summary-cards">
                <div className="summary-card card-total">
                    <div className="card-icon">📊</div>
                    <div className="card-content">
                        <h3>Total Tasks</h3>
                        <p className="card-value">{reportData.taskStats.total}</p>
                        <span className="card-label">All time</span>
                    </div>
                </div>
                <div className="summary-card card-completed">
                    <div className="card-icon">✅</div>
                    <div className="card-content">
                        <h3>Completed</h3>
                        <p className="card-value">{reportData.taskStats.completed}</p>
                        <span className="card-label">{completionRate}% completion rate</span>
                    </div>
                </div>
                <div className="summary-card card-progress">
                    <div className="card-icon">⏳</div>
                    <div className="card-content">
                        <h3>In Progress</h3>
                        <p className="card-value">{reportData.taskStats.inProgress}</p>
                        <span className="card-label">Active tasks</span>
                    </div>
                </div>
                <div className="summary-card card-pending">
                    <div className="card-icon">⏱️</div>
                    <div className="card-content">
                        <h3>Pending</h3>
                        <p className="card-value">{reportData.taskStats.pending}</p>
                        <span className="card-label">Awaiting start</span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Monthly Progress Bar Chart */}
                <div className="chart-container chart-full">
                    <h3 className="chart-title">Monthly Task Progress</h3>
                    <div className="bar-chart">
                        {reportData.monthlyProgress.map((month, idx) => (
                            <div key={idx} className="bar-group">
                                <div className="bar-stack">
                                    <div 
                                        className="bar-segment bar-completed"
                                        style={{ height: `${(month.completed / maxMonthlyValue) * 100}%` }}
                                        title={`Completed: ${month.completed}`}
                                    >
                                        <span className="bar-value">{month.completed}</span>
                                    </div>
                                    <div 
                                        className="bar-segment bar-pending"
                                        style={{ height: `${(month.pending / maxMonthlyValue) * 100}%` }}
                                        title={`Pending: ${month.pending}`}
                                    >
                                        <span className="bar-value">{month.pending}</span>
                                    </div>
                                </div>
                                <span className="bar-label">{month.month}</span>
                            </div>
                        ))}
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-color legend-completed"></span>
                            <span>Completed</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-color legend-pending"></span>
                            <span>Pending</span>
                        </div>
                    </div>
                </div>

                {/* Task Categories Pie Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Task Distribution by Category</h3>
                    <div className="pie-chart">
                        <svg viewBox="0 0 200 200" className="pie-svg">
                            {(() => {
                                let currentAngle = 0;
                                const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                                return reportData.taskCategories.map((category, idx) => {
                                    const angle = (category.percentage / 100) * 360;
                                    const startAngle = currentAngle;
                                    const endAngle = currentAngle + angle;
                                    currentAngle = endAngle;

                                    // Convert to radians
                                    const startRad = (startAngle - 90) * Math.PI / 180;
                                    const endRad = (endAngle - 90) * Math.PI / 180;

                                    // Calculate path
                                    const x1 = 100 + 80 * Math.cos(startRad);
                                    const y1 = 100 + 80 * Math.sin(startRad);
                                    const x2 = 100 + 80 * Math.cos(endRad);
                                    const y2 = 100 + 80 * Math.sin(endRad);

                                    const largeArc = angle > 180 ? 1 : 0;

                                    return (
                                        <path
                                            key={idx}
                                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                            fill={colors[idx]}
                                            className="pie-slice"
                                        />
                                    );
                                });
                            })()}
                        </svg>
                    </div>
                    <div className="chart-legend category-legend">
                        {reportData.taskCategories.map((category, idx) => {
                            const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                            return (
                                <div key={idx} className="legend-item">
                                    <span className="legend-color" style={{ backgroundColor: colors[idx] }}></span>
                                    <span>{category.name} ({category.percentage}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Priority Distribution Donut Chart */}
                <div className="chart-container">
                    <h3 className="chart-title">Priority Distribution</h3>
                    <div className="donut-chart">
                        <svg viewBox="0 0 200 200" className="donut-svg">
                            {(() => {
                                let currentAngle = 0;
                                const total = reportData.priorityDistribution.reduce((sum, p) => sum + p.count, 0);
                                return reportData.priorityDistribution.map((priority, idx) => {
                                    const percentage = (priority.count / total) * 100;
                                    const angle = (percentage / 100) * 360;
                                    const startAngle = currentAngle;
                                    const endAngle = currentAngle + angle;
                                    currentAngle = endAngle;

                                    const startRad = (startAngle - 90) * Math.PI / 180;
                                    const endRad = (endAngle - 90) * Math.PI / 180;

                                    const outerRadius = 80;
                                    const innerRadius = 50;

                                    const x1 = 100 + outerRadius * Math.cos(startRad);
                                    const y1 = 100 + outerRadius * Math.sin(startRad);
                                    const x2 = 100 + outerRadius * Math.cos(endRad);
                                    const y2 = 100 + outerRadius * Math.sin(endRad);
                                    const x3 = 100 + innerRadius * Math.cos(endRad);
                                    const y3 = 100 + innerRadius * Math.sin(endRad);
                                    const x4 = 100 + innerRadius * Math.cos(startRad);
                                    const y4 = 100 + innerRadius * Math.sin(startRad);

                                    const largeArc = angle > 180 ? 1 : 0;

                                    return (
                                        <path
                                            key={idx}
                                            d={`M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`}
                                            fill={priority.color}
                                            className="donut-slice"
                                        />
                                    );
                                });
                            })()}
                            <text x="100" y="95" textAnchor="middle" className="donut-center-text" fontSize="24" fontWeight="700" fill="#1e293b">
                                {reportData.priorityDistribution.reduce((sum, p) => sum + p.count, 0)}
                            </text>
                            <text x="100" y="110" textAnchor="middle" className="donut-center-label" fontSize="12" fill="#64748b">
                                Total Tasks
                            </text>
                        </svg>
                    </div>
                    <div className="chart-legend">
                        {reportData.priorityDistribution.map((priority, idx) => (
                            <div key={idx} className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: priority.color }}></span>
                                <span>{priority.priority}: {priority.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Performance Table/Chart */}
                <div className="chart-container chart-full">
                    <h3 className="chart-title">User Performance Overview</h3>
                    <div className="performance-table">
                        <table className="perf-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Completed</th>
                                    <th>Pending</th>
                                    <th>Completion Rate</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.userPerformance.map((user, idx) => (
                                    <tr key={idx}>
                                        <td className="user-name">{user.name}</td>
                                        <td className="completed-count">{user.completed}</td>
                                        <td className="pending-count">{user.pending}</td>
                                        <td className="completion-rate">{user.completion}%</td>
                                        <td className="progress-bar-cell">
                                            <div className="progress-bar-wrapper">
                                                <div 
                                                    className="progress-bar-fill"
                                                    style={{ 
                                                        width: `${user.completion}%`,
                                                        backgroundColor: user.completion >= 80 ? '#10b981' : user.completion >= 60 ? '#3b82f6' : '#f59e0b'
                                                    }}
                                                ></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Completion Rate Gauge */}
            <div className="gauge-section">
                <div className="chart-container gauge-container">
                    <h3 className="chart-title">Overall Completion Rate</h3>
                    <div className="gauge-chart">
                        <svg viewBox="0 0 200 120" className="gauge-svg">
                            {/* Background arc */}
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="20"
                                strokeLinecap="round"
                            />
                            {/* Colored arc based on completion */}
                            <path
                                d="M 20 100 A 80 80 0 0 1 180 100"
                                fill="none"
                                stroke={completionRate >= 80 ? '#10b981' : completionRate >= 60 ? '#3b82f6' : '#f59e0b'}
                                strokeWidth="20"
                                strokeLinecap="round"
                                strokeDasharray={`${(completionRate / 100) * 251.2} 251.2`}
                                className="gauge-fill"
                            />
                            <text x="100" y="85" textAnchor="middle" fontSize="32" fontWeight="700" fill="#1e293b">
                                {completionRate}%
                            </text>
                            <text x="100" y="105" textAnchor="middle" fontSize="12" fill="#64748b">
                                Completion Rate
                            </text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
