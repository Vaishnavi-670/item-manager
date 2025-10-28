import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './EnquiryData.css';

const EnquiryData = () => {
    const dummyItems = [
        { date: '2025-10-25', salesPerson: 'Rajesh Kumar', qtPiEnq: 'QT-2025', branch: 'Mumbai', customer: 'Industrial Motors Ltd', itemName: '6205 Deep Groove Ball Bearing', brand: 'SKF', qty: 50, rate: 450, discount: 50, amount: 22450 },
        { date: '2025-10-26', salesPerson: 'Priya Sharma', qtPiEnq: 'PI-2026', branch: 'Delhi', customer: 'Precision Engineering', itemName: '6206 ZZ Ball Bearing', brand: 'FAG', qty: 100, rate: 380, discount: 30, amount: 37970 },
        { date: '2025-10-27', salesPerson: 'Amit Patel', qtPiEnq: 'ENQ-2027', branch: 'Bangalore', customer: 'Auto Parts Co', itemName: '6208 2RS Sealed Bearing', brand: 'NTN', qty: 75, rate: 520, discount: 40, amount: 38960 },
        { date: '2025-10-28', salesPerson: 'Sneha Reddy', qtPiEnq: 'QT-2028', branch: 'Chennai', customer: 'Heavy Machinery Works', itemName: '22205 Spherical Roller Bearing', brand: 'Timken', qty: 30, rate: 1850, discount: 150, amount: 55350 },
        { date: '2025-10-23', salesPerson: 'Vikram Singh', qtPiEnq: 'QT-2023', branch: 'Pune', customer: 'Pump Solutions', itemName: '6305 Deep Groove Ball Bearing', brand: 'NSK', qty: 60, rate: 680, discount: 80, amount: 40720 },
        { date: '2025-10-24', salesPerson: 'Ananya Iyer', qtPiEnq: 'PI-2024', branch: 'Hyderabad', customer: 'Steel Mill Industries', itemName: '32208 Tapered Roller Bearing', brand: 'SKF', qty: 40, rate: 1250, discount: 100, amount: 49900 },
        { date: '2025-10-22', salesPerson: 'Karthik Menon', qtPiEnq: 'ENQ-2022', branch: 'Mumbai', customer: 'Conveyor Systems Ltd', itemName: '6204 RS Ball Bearing', brand: 'FAG', qty: 120, rate: 320, discount: 20, amount: 38380 },
        { date: '2025-10-21', salesPerson: 'Divya Nair', qtPiEnq: 'QT-2021', branch: 'Kolkata', customer: 'Marine Equipment Co', itemName: 'NU 208 Cylindrical Roller Bearing', brand: 'NTN', qty: 25, rate: 2100, discount: 200, amount: 52300 },
        { date: '2025-10-20', salesPerson: 'Rohit Sharma', qtPiEnq: 'PI-2020', branch: 'Delhi', customer: 'Textile Machinery', itemName: '51205 Thrust Ball Bearing', brand: 'Timken', qty: 80, rate: 890, discount: 90, amount: 71110 },
        { date: '2025-10-19', salesPerson: 'Meera Desai', qtPiEnq: 'ENQ-2019', branch: 'Ahmedabad', customer: 'Food Processing Plant', itemName: '6207 2RS Ball Bearing', brand: 'NSK', qty: 90, rate: 470, discount: 50, amount: 42250 },
        { date: '2025-10-18', salesPerson: 'Arjun Kapoor', qtPiEnq: 'QT-2018', branch: 'Jaipur', customer: 'Mining Equipment Ltd', itemName: '22210 E Spherical Roller Bearing', brand: 'SKF', qty: 20, rate: 3500, discount: 300, amount: 69700 },
        { date: '2025-10-17', salesPerson: 'Pooja Reddy', qtPiEnq: 'PI-2017', branch: 'Bangalore', customer: 'Power Generation Co', itemName: '6310 Deep Groove Ball Bearing', brand: 'FAG', qty: 45, rate: 1100, discount: 100, amount: 49400 },
        { date: '2025-10-16', salesPerson: 'Sanjay Gupta', qtPiEnq: 'ENQ-2016', branch: 'Chennai', customer: 'Agricultural Machinery', itemName: '30205 Tapered Roller Bearing', brand: 'NTN', qty: 65, rate: 750, discount: 60, amount: 48690 },
        { date: '2025-10-15', salesPerson: 'Neha Agarwal', qtPiEnq: 'QT-2015', branch: 'Pune', customer: 'Paper Mill Industries', itemName: 'UCF 205 Pillow Block Bearing', brand: 'Timken', qty: 35, rate: 1650, discount: 150, amount: 57600 },
        { date: '2025-10-14', salesPerson: 'Ravi Kumar', qtPiEnq: 'PI-2014', branch: 'Hyderabad', customer: 'Cement Plant', itemName: '6209 ZZ Ball Bearing', brand: 'NSK', qty: 110, rate: 590, discount: 50, amount: 64850 },
        { date: '2025-10-13', salesPerson: 'Kavya Rao', qtPiEnq: 'ENQ-2013', branch: 'Mumbai', customer: 'Electric Motor Works', itemName: '6203 2RS Ball Bearing', brand: 'SKF', qty: 150, rate: 280, discount: 30, amount: 41970 }
    ]

    const [filteredData, setFilteredData] = useState(dummyItems);
    const [filters, setFilters] = useState({});
    const [activeColumn, setActiveColumn] = useState(null);
    const [searchText, setSearchText] = useState({});
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const dropdownRef = useRef(null);

    const columns = [
        { key: 'date', label: 'Date' },
        { key: 'salesPerson', label: 'Sales Person' },
        { key: 'qtPiEnq', label: 'QT/PI/Enq' },
        { key: 'branch', label: 'Branch' },
        { key: 'customer', label: 'Customer Name' },
        { key: 'itemName', label: 'Item Name' },
        { key: 'brand', label: 'Brand' },
        { key: 'qty', label: 'Qty' },
        { key: 'rate', label: 'Rate' },
        { key: 'discount', label: 'Discount' },
        { key: 'amount', label: 'Amount' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setActiveColumn(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter logic
    useEffect(() => {
        let data = [...dummyItems];

        // Apply column filters
        Object.entries(filters).forEach(([key, values]) => {
            if (values.length > 0) {
                data = data.filter((item) => values.includes(String(item[key])));
            }
        });

        // Apply date range filter
        if (dateRange.from || dateRange.to) {
            data = data.filter((item) => {
                const itemDate = new Date(item.date);
                itemDate.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison

                const fromDate = dateRange.from ? new Date(dateRange.from) : null;
                if (fromDate) fromDate.setHours(0, 0, 0, 0);

                const toDate = dateRange.to ? new Date(dateRange.to) : null;
                if (toDate) toDate.setHours(23, 59, 59, 999); // Set to end of day to include the entire end date

                if (fromDate && toDate) {
                    return itemDate >= fromDate && itemDate <= toDate;
                } else if (fromDate) {
                    return itemDate >= fromDate;
                } else if (toDate) {
                    return itemDate <= toDate;
                }
                return true;
            });
        }

        setFilteredData(data);
    }, [filters, dateRange]);

    // Handle checkbox select
    const handleFilterChange = (column, value) => {
        setFilters((prev) => {
            const prevValues = prev[column] || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter((v) => v !== value)
                : [...prevValues, value];
            return { ...prev, [column]: newValues };
        });
    };

    // Handle Select All
    const handleSelectAll = (column) => {
        const allValues = getUniqueValues(column);
        const currentValues = filters[column] || [];

        if (currentValues.length === allValues.length) {
            // If all are selected, deselect all
            setFilters((prev) => ({ ...prev, [column]: [] }));
        } else {
            // Select all
            setFilters((prev) => ({ ...prev, [column]: allValues }));
        }
    };

    // Check if all values are selected for a column
    const isAllSelected = (column) => {
        const allValues = getUniqueValues(column);
        const currentValues = filters[column] || [];
        return currentValues.length === allValues.length && allValues.length > 0;
    };

    // Get unique values for each column
    const getUniqueValues = (key) => {
        return [...new Set(dummyItems.map((item) => String(item[key])))];
    };

    // Get filtered values based on search text
    const getFilteredValues = (key) => {
        const allValues = getUniqueValues(key);
        const search = searchText[key] || '';

        if (!search) return allValues;

        return allValues.filter(val =>
            val.toLowerCase().includes(search.toLowerCase())
        );
    };

    // Handle search text change
    const handleSearchChange = (column, value) => {
        setSearchText(prev => ({
            ...prev,
            [column]: value
        }));
    };

    return (
        <div className="data-panel-wrapper data-card">
            <div className="data-panel-header">
                <h3 className="data-heading">Enquiry</h3>
                <div className="date-range-filter">
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
                            className="custom-datepicker"
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
                            className="custom-datepicker"
                        />
                    </label>
                    {(dateRange.from || dateRange.to) && (
                        <button
                            className="clear-date-btn"
                            onClick={() => setDateRange({ from: null, to: null })}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-records-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>
                                    <div className="th-filter-wrapper">
                                        {col.label}
                                        <button
                                            className="filter-btn"
                                            onClick={() => setActiveColumn(activeColumn === col.key ? null : col.key)}
                                        >
                                            ⏷
                                        </button>
                                        {activeColumn === col.key && (
                                            <div className="filter-dropdown" ref={dropdownRef}>
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="filter-search"
                                                    value={searchText[col.key] || ''}
                                                    onChange={(e) => handleSearchChange(col.key, e.target.value)}
                                                />
                                                <div className="filter-select-all">
                                                    <label className="filter-option select-all-option">
                                                        <input
                                                            type="checkbox"
                                                            checked={isAllSelected(col.key)}
                                                            onChange={() => handleSelectAll(col.key)}
                                                        />
                                                        <strong>Select All</strong>
                                                    </label>
                                                </div>
                                                <div className="filter-options">
                                                    {getFilteredValues(col.key).map((val) => (
                                                        <label key={val} className="filter-option">
                                                            <input
                                                                type="checkbox"
                                                                checked={filters[col.key]?.includes(val) || false}
                                                                onChange={() => handleFilterChange(col.key, val)}
                                                            />
                                                            {val}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((row, index) => (
                            <tr key={index}>
                                {columns.map((col) => (
                                    <td key={col.key}>{row[col.key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnquiryData;
