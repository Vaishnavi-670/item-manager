import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PurchaseOrder.css';

const PurchaseOrder = () => {
    const dummyItems = [
        { poDate: '2025-10-25', poExpiryDate: '2025-11-25', salesPerson: 'Rajesh Kumar', customerName: 'Industrial Motors Ltd', gst: 'GST123456', poNo: 'PO-2025', item: '6205 Deep Groove Ball Bearing', qty: 50, pricePerPc: 450, invoicedQty: 30, pendingQty: 20 },
        { poDate: '2025-10-26', poExpiryDate: '2025-11-26', salesPerson: 'Priya Sharma', customerName: 'Precision Engineering', gst: 'GST234567', poNo: 'PO-2026', item: '6206 ZZ Ball Bearing', qty: 100, pricePerPc: 380, invoicedQty: 50, pendingQty: 50 },
        { poDate: '2025-10-27', poExpiryDate: '2025-11-27', salesPerson: 'Amit Patel', customerName: 'Auto Parts Co', gst: 'GST345678', poNo: 'PO-2027', item: '6208 2RS Sealed Bearing', qty: 75, pricePerPc: 520, invoicedQty: 40, pendingQty: 35 },
        { poDate: '2025-10-28', poExpiryDate: '2025-11-28', salesPerson: 'Sneha Reddy', customerName: 'Heavy Machinery Works', gst: 'GST456789', poNo: 'PO-2028', item: '22205 Spherical Roller Bearing', qty: 30, pricePerPc: 1850, invoicedQty: 15, pendingQty: 15 },
        { poDate: '2025-10-23', poExpiryDate: '2025-11-23', salesPerson: 'Vikram Singh', customerName: 'Pump Solutions', gst: 'GST567890', poNo: 'PO-2023', item: '6305 Deep Groove Ball Bearing', qty: 60, pricePerPc: 680, invoicedQty: 60, pendingQty: 0 },
        { poDate: '2025-10-24', poExpiryDate: '2025-11-24', salesPerson: 'Ananya Iyer', customerName: 'Steel Mill Industries', gst: 'GST678901', poNo: 'PO-2024', item: '32208 Tapered Roller Bearing', qty: 40, pricePerPc: 1250, invoicedQty: 20, pendingQty: 20 },
        { poDate: '2025-10-22', poExpiryDate: '2025-11-22', salesPerson: 'Karthik Menon', customerName: 'Conveyor Systems Ltd', gst: 'GST789012', poNo: 'PO-2022', item: '6204 RS Ball Bearing', qty: 120, pricePerPc: 320, invoicedQty: 80, pendingQty: 40 },
        { poDate: '2025-10-21', poExpiryDate: '2025-11-21', salesPerson: 'Divya Nair', customerName: 'Marine Equipment Co', gst: 'GST890123', poNo: 'PO-2021', item: 'NU 208 Cylindrical Roller Bearing', qty: 25, pricePerPc: 2100, invoicedQty: 10, pendingQty: 15 },
        { poDate: '2025-10-20', poExpiryDate: '2025-11-20', salesPerson: 'Rohit Sharma', customerName: 'Textile Machinery', gst: 'GST901234', poNo: 'PO-2020', item: '51205 Thrust Ball Bearing', qty: 80, pricePerPc: 890, invoicedQty: 50, pendingQty: 30 },
        { poDate: '2025-10-19', poExpiryDate: '2025-11-19', salesPerson: 'Meera Desai', customerName: 'Food Processing Plant', gst: 'GST012345', poNo: 'PO-2019', item: '6207 2RS Ball Bearing', qty: 90, pricePerPc: 470, invoicedQty: 70, pendingQty: 20 },
        { poDate: '2025-10-18', poExpiryDate: '2025-11-18', salesPerson: 'Arjun Kapoor', customerName: 'Mining Equipment Ltd', gst: 'GST112233', poNo: 'PO-2018', item: '22210 E Spherical Roller Bearing', qty: 20, pricePerPc: 3500, invoicedQty: 5, pendingQty: 15 },
        { poDate: '2025-10-17', poExpiryDate: '2025-11-17', salesPerson: 'Pooja Reddy', customerName: 'Power Generation Co', gst: 'GST223344', poNo: 'PO-2017', item: '6310 Deep Groove Ball Bearing', qty: 45, pricePerPc: 1100, invoicedQty: 45, pendingQty: 0 },
        { poDate: '2025-10-16', poExpiryDate: '2025-11-16', salesPerson: 'Sanjay Gupta', customerName: 'Agricultural Machinery', gst: 'GST334455', poNo: 'PO-2016', item: '30205 Tapered Roller Bearing', qty: 65, pricePerPc: 750, invoicedQty: 30, pendingQty: 35 },
        { poDate: '2025-10-15', poExpiryDate: '2025-11-15', salesPerson: 'Neha Agarwal', customerName: 'Paper Mill Industries', gst: 'GST445566', poNo: 'PO-2015', item: 'UCF 205 Pillow Block Bearing', qty: 35, pricePerPc: 1650, invoicedQty: 20, pendingQty: 15 },
        { poDate: '2025-10-14', poExpiryDate: '2025-11-14', salesPerson: 'Ravi Kumar', customerName: 'Cement Plant', gst: 'GST556677', poNo: 'PO-2014', item: '6209 ZZ Ball Bearing', qty: 110, pricePerPc: 590, invoicedQty: 100, pendingQty: 10 },
        { poDate: '2025-10-13', poExpiryDate: '2025-11-13', salesPerson: 'Kavya Rao', customerName: 'Electric Motor Works', gst: 'GST667788', poNo: 'PO-2013', item: '6203 2RS Ball Bearing', qty: 150, pricePerPc: 280, invoicedQty: 110, pendingQty: 40 }
    ]

    const [filteredData, setFilteredData] = useState(dummyItems);
    const [filters, setFilters] = useState({});
    const [activeColumn, setActiveColumn] = useState(null);
    const [searchText, setSearchText] = useState({});
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const dropdownRef = useRef(null);

    const columns = [
        { key: 'poDate', label: 'PO Date' },
        { key: 'poExpiryDate', label: 'PO Expiry Date' },
        { key: 'salesPerson', label: 'Sales Person' },
        { key: 'customerName', label: 'Customer Name' },
        { key: 'gst', label: 'GST' },
        { key: 'poNo', label: 'PO No' },
        { key: 'item', label: 'Item' },
        { key: 'qty', label: 'Qty' },
        { key: 'pricePerPc', label: 'Price per Pc' },
        { key: 'invoicedQty', label: 'Invoiced Qty' },
        { key: 'pendingQty', label: 'Pending Qty' },
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
                const itemDate = new Date(item.poDate);
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
    }, [filters, dateRange, dummyItems]);

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
        <div className="po-panel-wrapper po-card">
            <div className="po-panel-header">
                <h3 className="po-heading">Purchase Order</h3>
                <div className="po-date-range-filter">
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
                            className="po-custom-datepicker"
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
                            className="po-custom-datepicker"
                        />
                    </label>
                    {(dateRange.from || dateRange.to) && (
                        <button
                            className="po-clear-date-btn"
                            onClick={() => setDateRange({ from: null, to: null })}
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="po-table-container">
                <table className="po-records-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key}>
                                    <div className="po-th-filter-wrapper">
                                        {col.label}
                                        <button
                                            className="po-filter-btn"
                                            onClick={() => setActiveColumn(activeColumn === col.key ? null : col.key)}
                                        >
                                            ⏷
                                        </button>
                                        {activeColumn === col.key && (
                                            <div className="po-filter-dropdown" ref={dropdownRef}>
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    className="po-filter-search"
                                                    value={searchText[col.key] || ''}
                                                    onChange={(e) => handleSearchChange(col.key, e.target.value)}
                                                />
                                                <div className="po-filter-select-all">
                                                    <label className="po-filter-option po-select-all-option">
                                                        <input
                                                            type="checkbox"
                                                            checked={isAllSelected(col.key)}
                                                            onChange={() => handleSelectAll(col.key)}
                                                        />
                                                        <strong>Select All</strong>
                                                    </label>
                                                </div>
                                                <div className="po-filter-options">
                                                    {getFilteredValues(col.key).map((val) => (
                                                        <label key={val} className="po-filter-option">
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

export default PurchaseOrder;
