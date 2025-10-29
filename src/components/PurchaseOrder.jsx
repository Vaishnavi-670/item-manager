import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PurchaseOrder.css';

const PurchaseOrder = () => {
    const [poRecords, setPoRecords] = useState([
        { poDate: '2025-10-25', poExpiryDate: '2025-11-25', salesPerson: 'Rajesh Kumar', customerName: 'Industrial Motors Ltd', gst: 'GST123456', poNo: 'PO-2025', item: '6205 Deep Groove Ball Bearing', qty: 50, pricePerPc: 450, invoicedQty: 30, pendingQty: 20 },
        { poDate: '2025-10-26', poExpiryDate: '2025-11-26', salesPerson: 'Vikram Singh', customerName: 'Precision Engineering', gst: 'GST234567', poNo: 'PO-2026', item: '6206 ZZ Ball Bearing', qty: 100, pricePerPc: 380, invoicedQty: 50, pendingQty: 50 },
        { poDate: '2025-10-27', poExpiryDate: '2025-11-27', salesPerson: 'Arjun Kapoor', customerName: 'Auto Parts Co', gst: 'GST345678', poNo: 'PO-2027', item: '6208 2RS Sealed Bearing', qty: 75, pricePerPc: 520, invoicedQty: 40, pendingQty: 35 },
        { poDate: '2025-10-28', poExpiryDate: '2025-11-28', salesPerson: 'Sneha Reddy', customerName: 'Heavy Machinery Works', gst: 'GST456789', poNo: 'PO-2028', item: '22205 Spherical Roller Bearing', qty: 30, pricePerPc: 1850, invoicedQty: 15, pendingQty: 15 },
        { poDate: '2025-10-23', poExpiryDate: '2025-11-23', salesPerson: 'Vikram Singh', customerName: 'Precision Engineering', gst: 'GST567890', poNo: 'PO-2023', item: '6305 Deep Groove Ball Bearing', qty: 60, pricePerPc: 680, invoicedQty: 60, pendingQty: 0 },
        { poDate: '2025-10-24', poExpiryDate: '2025-11-24', salesPerson: 'Ananya Iyer', customerName: 'Steel Mill Industries', gst: 'GST678901', poNo: 'PO-2024', item: '32208 Tapered Roller Bearing', qty: 40, pricePerPc: 1250, invoicedQty: 20, pendingQty: 20 },
        { poDate: '2025-10-22', poExpiryDate: '2025-11-22', salesPerson: 'Karthik Menon', customerName: 'Conveyor Systems Ltd', gst: 'GST789012', poNo: 'PO-2022', item: '6204 RS Ball Bearing', qty: 120, pricePerPc: 320, invoicedQty: 80, pendingQty: 40 },
        { poDate: '2025-10-21', poExpiryDate: '2025-11-21', salesPerson: 'Divya Nair', customerName: 'Marine Equipment Co', gst: 'GST890123', poNo: 'PO-2021', item: 'NU 208 Cylindrical Roller Bearing', qty: 25, pricePerPc: 2100, invoicedQty: 10, pendingQty: 15 },
        { poDate: '2025-10-20', poExpiryDate: '2025-11-20', salesPerson: 'Rohit Sharma', customerName: 'Textile Machinery', gst: 'GST901234', poNo: 'PO-2020', item: '51205 Thrust Ball Bearing', qty: 80, pricePerPc: 890, invoicedQty: 50, pendingQty: 30 },
        { poDate: '2025-10-19', poExpiryDate: '2025-11-19', salesPerson: 'Vikram Singh', customerName: 'Industrial Motors Ltd', gst: 'GST012345', poNo: 'PO-2019', item: '6207 2RS Ball Bearing', qty: 90, pricePerPc: 470, invoicedQty: 70, pendingQty: 20 },
        { poDate: '2025-10-18', poExpiryDate: '2025-11-18', salesPerson: 'Arjun Kapoor', customerName: 'Power Generation Co', gst: 'GST112233', poNo: 'PO-2018', item: '22210 E Spherical Roller Bearing', qty: 20, pricePerPc: 3500, invoicedQty: 5, pendingQty: 15 },
        { poDate: '2025-10-17', poExpiryDate: '2025-11-17', salesPerson: 'Pooja Reddy', customerName: 'Power Generation Co', gst: 'GST223344', poNo: 'PO-2017', item: '6310 Deep Groove Ball Bearing', qty: 45, pricePerPc: 1100, invoicedQty: 45, pendingQty: 0 },
        { poDate: '2025-10-16', poExpiryDate: '2025-11-16', salesPerson: 'Sanjay Gupta', customerName: 'Textile Machinery', gst: 'GST334455', poNo: 'PO-2016', item: '30205 Tapered Roller Bearing', qty: 65, pricePerPc: 750, invoicedQty: 30, pendingQty: 35 },
        { poDate: '2025-10-15', poExpiryDate: '2025-11-15', salesPerson: 'Neha Agarwal', customerName: 'Paper Mill Industries', gst: 'GST445566', poNo: 'PO-2015', item: 'UCF 205 Pillow Block Bearing', qty: 35, pricePerPc: 1650, invoicedQty: 20, pendingQty: 15 },
        { poDate: '2025-10-14', poExpiryDate: '2025-11-14', salesPerson: 'Ravi Kumar', customerName: 'Cement Plant', gst: 'GST556677', poNo: 'PO-2014', item: '6209 ZZ Ball Bearing', qty: 110, pricePerPc: 590, invoicedQty: 100, pendingQty: 10 },
        { poDate: '2025-10-13', poExpiryDate: '2025-11-13', salesPerson: 'Kavya Rao', customerName: 'Electric Motor Works', gst: 'GST667788', poNo: 'PO-2013', item: '6203 2RS Ball Bearing', qty: 150, pricePerPc: 280, invoicedQty: 110, pendingQty: 40 },
        { poDate: '2025-10-12', poExpiryDate: '2025-11-12', salesPerson: 'Rajesh Kumar', customerName: 'Industrial Motors Ltd', gst: 'GST123456', poNo: 'PO-2012', item: '6304 Deep Groove Ball Bearing', qty: 70, pricePerPc: 620, invoicedQty: 40, pendingQty: 30 },
        { poDate: '2025-10-11', poExpiryDate: '2025-11-11', salesPerson: 'Sneha Reddy', customerName: 'Heavy Machinery Works', gst: 'GST456789', poNo: 'PO-2011', item: '22206 Spherical Roller Bearing', qty: 45, pricePerPc: 2100, invoicedQty: 25, pendingQty: 20 },
        { poDate: '2025-10-10', poExpiryDate: '2025-11-10', salesPerson: 'Ananya Iyer', customerName: 'Precision Engineering', gst: 'GST234567', poNo: 'PO-2010', item: '6210 ZZ Ball Bearing', qty: 85, pricePerPc: 720, invoicedQty: 60, pendingQty: 25 },
        { poDate: '2025-10-09', poExpiryDate: '2025-11-09', salesPerson: 'Karthik Menon', customerName: 'Auto Parts Co', gst: 'GST345678', poNo: 'PO-2009', item: '6209 2RS Sealed Bearing', qty: 95, pricePerPc: 580, invoicedQty: 70, pendingQty: 25 },
        { poDate: '2025-10-08', poExpiryDate: '2025-11-08', salesPerson: 'Divya Nair', customerName: 'Marine Equipment Co', gst: 'GST890123', poNo: 'PO-2008', item: 'NU 210 Cylindrical Roller Bearing', qty: 40, pricePerPc: 2450, invoicedQty: 20, pendingQty: 20 },
        { poDate: '2025-10-07', poExpiryDate: '2025-11-07', salesPerson: 'Pooja Reddy', customerName: 'Power Generation Co', gst: 'GST223344', poNo: 'PO-2007', item: '6312 Deep Groove Ball Bearing', qty: 55, pricePerPc: 1350, invoicedQty: 30, pendingQty: 25 },
        { poDate: '2025-10-06', poExpiryDate: '2025-11-06', salesPerson: 'Rohit Sharma', customerName: 'Textile Machinery', gst: 'GST901234', poNo: 'PO-2006', item: '51206 Thrust Ball Bearing', qty: 65, pricePerPc: 950, invoicedQty: 45, pendingQty: 20 }
    ]);

    const [filteredData, setFilteredData] = useState(poRecords);
    const [filters, setFilters] = useState({});
    const [activeColumn, setActiveColumn] = useState(null);
    const [searchText, setSearchText] = useState({});
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [showPopup, setShowPopup] = useState(false);
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [customerSearchText, setCustomerSearchText] = useState('');
    const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
    const [showQuotationTable, setShowQuotationTable] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showPOFormPopup, setShowPOFormPopup] = useState(false);
    const [poFormData, setPOFormData] = useState({
        poDate: '',
        poExpiryDate: '',
        poNumber: '',
        gst: ''
    });
    const dropdownRef = useRef(null);
    const customerDropdownRef = useRef(null);

    // Quotation data for the table (built dynamically from Enquiry + this page)
    const [quotationData, setQuotationData] = useState([]);

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
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
                setShowCustomerDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter logic
    useEffect(() => {
        let data = [...poRecords];

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
    }, [filters, dateRange, poRecords]);

    // Handle checkbox select and Select All
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
            setFilters((prev) => ({ ...prev, [column]: [] }));
        } else {
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
        return [...new Set(poRecords.map((item) => String(item[key])))];
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

    // Get unique customers from both Purchase Orders and Enquiries
    const getUniqueCustomers = () => {
        const fromPO = poRecords.map(item => item.customerName);
        const fromEnq = getStoredEnquiries()
            .map(e => e.customerName || e.customer)
            .filter(Boolean);
        return [...new Set([...fromPO, ...fromEnq])].sort();
    };

    // Filter customers based on search
    const getFilteredCustomers = () => {
        const allCustomers = getUniqueCustomers();
        if (!customerSearchText) return allCustomers;
        return allCustomers.filter(customer =>
            customer.toLowerCase().includes(customerSearchText.toLowerCase())
        );
    };

    // ---- Build Quotation Table Data (Enquiry + This Page) ----
    const ENQUIRY_KEYS = ['enquiry_data', 'enquiries', 'enquiryData', 'enquiry_list'];

    const getStoredEnquiries = () => {
        for (const key of ENQUIRY_KEYS) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) continue;
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            } catch (_) {
                // ignore bad JSON
            }
        }
        return [];
    };

    const toAmount = (qty, rate, discount) => {
        const q = Number(qty) || 0;
        const r = Number(rate) || 0;
        const d = Number(discount) || 0;
        const gross = q * r;
        return Math.round(gross - (gross * d) / 100);
    };

    const mapEnquiriesToRows = (list, customer) => {
        const cust = (customer || '').toLowerCase();
        return list
            .filter((e) => (e.customerName || e.customer || '').toLowerCase() === cust)
            .map((e, idx) => {
                const date = e.date || e.enquiryDate || e.createdAt || '';
                const itemName = e.item || e.itemName || e.product || '-';
                const brand = e.brand || e.make || '-';
                const qty = e.qty ?? e.quantity ?? 0;
                const rate = e.rate ?? e.price ?? 0;
                const discount = e.discount ?? 0;
                const amount = e.amount ?? toAmount(qty, rate, discount);
                // Prefer the combined code from EnquiryData like QT-xxxx / PI-xxxx / ENQ-xxxx
                const typeCode = e.qtPiEnq || e.type || 'ENQ';
                return {
                    id: `ENQ-${idx + 1}`,
                    date,
                    qtType: typeCode,
                    itemName,
                    brand,
                    qty,
                    rate,
                    discount,
                    amount,
                };
            });
    };

    const mapPOItemsToRows = (items, customer) => {
        const cust = (customer || '').toLowerCase();
        return items
            .filter((it) => (it.customerName || '').toLowerCase() === cust)
            .map((it, idx) => {
                const qty = it.qty ?? 0;
                const rate = it.pricePerPc ?? 0;
                const discount = 0;
                const amount = toAmount(qty, rate, discount);
                return {
                    id: `PI-${idx + 1}`,
                    date: it.poDate || '',
                    qtType: `PI-${it.poNo || ''}`,
                    itemName: it.item || '-',
                    brand: it.brand || '-',
                    qty,
                    rate,
                    discount,
                    amount,
                };
            });
    };

    const buildQuotationDataForCustomer = (customer) => {
        if (!customer) {
            setQuotationData([]);
            return;
        }
        const enquiries = getStoredEnquiries();
        const fromEnq = mapEnquiriesToRows(enquiries, customer);
        const fromPO = mapPOItemsToRows(poRecords, customer);
        // ensure unique numeric ids for selection logic
        const combined = [...fromEnq, ...fromPO].map((row, i) => ({
            ...row,
            id: i + 1,
        }));
        setQuotationData(combined);
    };

    // Handle customer selection
    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setShowCustomerDropdown(false);
        setCustomerSearchText('');
    };

    // Handle opening the popup (reset all fields)
    const handleOpenPopup = () => {
        setShowPopup(true);
        setShowCustomerDropdown(false);
        setSelectedCustomer('');
        setCustomerSearchText('');
        setShowPurchaseOptions(false);
        setShowQuotationTable(false);
        setQuotationData([]);
        setSelectedItems([]);
    };

    // Handle popup close
    const handleClosePopup = () => {
        setShowPopup(false);
        setShowCustomerDropdown(false);
        setSelectedCustomer('');
        setCustomerSearchText('');
        setShowPurchaseOptions(false);
        setShowQuotationTable(false);
        setQuotationData([]);
        setSelectedItems([]);
    };

    // Handle proceed button click
    const handleProceed = () => {
        if (selectedCustomer) {
            setShowPurchaseOptions(true);
            setShowCustomerDropdown(false);
        }
    };

    // Handle purchase option selection
    const handlePurchaseOptionSelect = (option) => {
        if (option === 'quotation') {
            // Build data from Enquiry storage + current page items for this customer
            buildQuotationDataForCustomer(selectedCustomer);
            setShowQuotationTable(true);
            setShowPurchaseOptions(false);
            setShowPopup(false);
        } else if (option === 'without-quotation') {
            // Add your "New Purchase Order Without Quotation" logic here
        }
    };

    // Handle checkbox selection in quotation table
    const handleItemSelect = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    // Handle select all items
    const handleSelectAllItems = () => {
        if (selectedItems.length === quotationData.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(quotationData.map(item => item.id));
        }
    };

    // Close quotation table
    const handleCloseQuotationTable = () => {
        setShowQuotationTable(false);
        setSelectedItems([]);
    };

    // Create PO from selected items
    const handleCreatePOFromQuotation = () => {
        const selectedQuotations = quotationData.filter(item => selectedItems.includes(item.id));
        if (selectedQuotations.length > 0) {
            // Get GST from dummy data for the selected customer
            const customerGST = poRecords.find(item => item.customerName === selectedCustomer)?.gst || '';
            setPOFormData(prev => ({
                ...prev,
                gst: customerGST
            }));
            setShowPOFormPopup(true);
            setShowQuotationTable(false);
        }
    };

    // Handle PO form input changes
    const handlePOFormChange = (field, value) => {
        setPOFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Close PO form popup
    const handleClosePOForm = () => {
        setShowPOFormPopup(false);
        setPOFormData({
            poDate: '',
            poExpiryDate: '',
            poNumber: '',
            gst: ''
        });
    };

    // Submit PO form
    const handleSubmitPO = () => {
        const selectedQuotations = quotationData.filter(item => selectedItems.includes(item.id));
        
        if (selectedQuotations.length === 0) {
            alert('Please select at least one item');
            return;
        }

        if (!poFormData.poNumber || !poFormData.poDate || !poFormData.poExpiryDate) {
            alert('Please fill in all required fields (PO Number, PO Date, PO Expiry Date)');
            return;
        }

        // Get sales person from localStorage or use a default
        const currentUser = localStorage.getItem('userName') || 'Sales Person';

        // Create new PO records from selected quotation items
        const newPoRecords = selectedQuotations.map((item) => ({
            poDate: poFormData.poDate,
            poExpiryDate: poFormData.poExpiryDate,
            salesPerson: currentUser,
            customerName: selectedCustomer,
            gst: poFormData.gst,
            poNo: poFormData.poNumber,
            item: item.itemName,
            qty: item.qty,
            pricePerPc: item.rate,
            invoicedQty: 0,  // Initially 0
            pendingQty: item.qty  // Initially equals qty
        }));

        // Add new records to the table
        setPoRecords(prev => [...newPoRecords, ...prev]);

        console.log('PO Data:', poFormData);
        console.log('Selected Items:', selectedQuotations);
        console.log('New PO Records:', newPoRecords);
        
        handleClosePOForm();
        setSelectedItems([]);
        setQuotationData([]);
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

            <div className='PO-buttons'>
                <button className='PO-edit-button'>Edit</button>
                <button className='PO-delete-button'>Delete</button>
                <button className='PO-add-button' onClick={handleOpenPopup}>Add New P.O.</button>
            </div>

            {/* Add New PO Popup */}
            {showPopup && (
                <div className="po-popup-overlay" onClick={handleClosePopup}>
                    <div className="po-popup-container" onClick={(e) => e.stopPropagation()}>
                        <div className="po-popup-header">
                            <h3>Add New Purchase Order</h3>
                            <button className="po-popup-close" onClick={handleClosePopup}>×</button>
                        </div>
                        <div className="po-popup-body">
                            <div className='po-customer-selection-wrapper'>
                                <label className='po-customer-label'>Select Customer:</label>
                                <div className='po-customer-input-row'>
                                    <div className='po-customer-input-container' ref={customerDropdownRef}>
                                        <input
                                            type="text"
                                            placeholder="Click to select customer..."
                                            className="po-customer-input"
                                            value={selectedCustomer}
                                            onClick={() => setShowCustomerDropdown(true)}
                                            onChange={(e) => {
                                                setSelectedCustomer(e.target.value);
                                                setCustomerSearchText(e.target.value);
                                                setShowCustomerDropdown(true);
                                            }}
                                        />
                                        {showCustomerDropdown && (
                                            <div className="po-customer-dropdown">
                                                <input
                                                    type="text"
                                                    placeholder="Search customer..."
                                                    className="po-customer-search"
                                                    value={customerSearchText}
                                                    onChange={(e) => setCustomerSearchText(e.target.value)}
                                                    autoFocus
                                                />
                                                <div className="po-customer-options">
                                                    {getFilteredCustomers().map((customer, index) => (
                                                        <div
                                                            key={index}
                                                            className="po-customer-option"
                                                            onClick={() => handleCustomerSelect(customer)}
                                                        >
                                                            {customer}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className='po-proceed-button'
                                        disabled={!selectedCustomer}
                                        onClick={handleProceed}
                                    >
                                        Proceed
                                    </button>
                                </div>
                                {showPurchaseOptions && (
                                    <div className='po-purchase-options'>
                                        <h4 className='po-options-title'>Choose Purchase Type:</h4>
                                        <div className='po-options-container'>
                                            <div
                                                className='po-option-card'
                                                onClick={() => handlePurchaseOptionSelect('quotation')}
                                            >
                                                <div className='po-option-icon'>📄</div>
                                                <h5 className='po-option-title'>From Given Quotation</h5>

                                            </div>
                                            <div
                                                className='po-option-card'
                                                onClick={() => handlePurchaseOptionSelect('without-quotation')}
                                            >
                                                <div className='po-option-icon'>📝</div>
                                                <h5 className='po-option-title'>New Purchase Order Without Quotation</h5>

                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quotation Table Popup */}
            {showQuotationTable && (
                <div className="po-quotation-overlay" onClick={handleCloseQuotationTable}>
                    <div className="po-quotation-container" onClick={(e) => e.stopPropagation()}>
                        <div className="po-quotation-header">
                            <h3>Quotations for {selectedCustomer}</h3>
                            <button className="po-quotation-close" onClick={handleCloseQuotationTable}>×</button>
                        </div>
                        <div className="po-quotation-body">
                            <table className="po-quotation-table">
                                <thead>
                                    <tr>

                                        <th>Date</th>
                                        <th>QT/PI/Enq</th>
                                        <th>Item Name</th>
                                        <th>Brand</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Discount (%)</th>
                                        <th>Amount</th>
                                        <th>
                                            Select
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {quotationData.length === 0 && (
                                        <tr>
                                            <td colSpan={9} style={{ textAlign: 'center', padding: '16px', color: '#666' }}>
                                                No items found for the selected customer.
                                            </td>
                                        </tr>
                                    )}
                                    {quotationData.map((item) => (
                                        <tr key={item.id} className={selectedItems.includes(item.id) ? 'selected-row' : ''}>

                                            <td>{item.date}</td>
                                            <td>{item.qtType}</td>
                                            <td>{item.itemName}</td>
                                            <td>{item.brand}</td>
                                            <td>{item.qty}</td>
                                            <td>₹{item.rate}</td>
                                            <td>{item.discount}%</td>
                                            <td>₹{item.amount.toLocaleString()}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => handleItemSelect(item.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="po-quotation-footer">
                            <button className="po-cancel-btn" onClick={handleCloseQuotationTable}>Cancel</button>
                            <button
                                className="po-create-po-btn"
                                disabled={selectedItems.length === 0}
                                onClick={handleCreatePOFromQuotation}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PO Form Popup */}
            {showPOFormPopup && (
                <div className="po-popup-overlay" onClick={handleClosePOForm}>
                    <div className="po-form-popup-container" onClick={(e) => e.stopPropagation()}>
                        <div className="po-popup-header">
                            <h3>Add Purchase Order</h3>
                            <button className="po-popup-close" onClick={handleClosePOForm}>×</button>
                        </div>
                        <div className="po-popup-body">
                            {/* Customer and GST Info */}
                            <div className="po-customer-gst-info">
                                <div className="po-customer-name">
                                    {/* <span className="po-customer-label">Customer:</span> */}
                                    <span className="po-customer-value">{selectedCustomer}</span>
                                </div>
                                <div className="po-gst-display">
                                    <span className="po-gst-label">GST:</span>
                                    <span className="po-gst-value">{poFormData.gst || 'N/A'}</span>
                                </div>
                            </div>

                            {/* PO Form Fields */}
                            <div className="po-form-fields">
                                <div className="po-form-row">
                                    <div className="po-form-group">
                                        <label>PO Number</label>
                                        <input
                                            type="text"
                                            value={poFormData.poNumber}
                                            onChange={(e) => handlePOFormChange('poNumber', e.target.value)}
                                            placeholder="Enter PO Number"
                                            className="po-form-input"
                                        />
                                    </div>
                                </div>
                                <div className="po-form-row">
                                    <div className="po-form-group">
                                        <label>PO Date</label>
                                        <input
                                            type="date"
                                            value={poFormData.poDate}
                                            onChange={(e) => handlePOFormChange('poDate', e.target.value)}
                                            className="po-form-input"
                                        />
                                    </div>
                                    <div className="po-form-group">
                                        <label>PO Expiry Date</label>
                                        <input
                                            type="date"
                                            value={poFormData.poExpiryDate}
                                            onChange={(e) => handlePOFormChange('poExpiryDate', e.target.value)}
                                            className="po-form-input"
                                        />
                                    </div>
                                </div>

                            </div>

                            {/* Selected Items Table */}
                            <div className="po-form-table-section">
                                <h4 className="po-form-table-title">Selected Items</h4>
                                <table className="po-form-table">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Brand</th>
                                            <th>Qty</th>
                                            <th>Price per Pc</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotationData
                                            .filter(item => selectedItems.includes(item.id))
                                            .map((item) => (
                                                <tr key={item.id}>
                                                    <td>{item.itemName}</td>
                                                    <td>{item.brand}</td>
                                                    <td>{item.qty}</td>
                                                    <td>₹{item.rate}</td>
                                                    <td>₹{item.amount.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="po-quotation-footer">
                            <button className="po-cancel-btn" onClick={handleClosePOForm}>Cancel</button>
                            <button className="po-create-po-btn" onClick={handleSubmitPO}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PurchaseOrder;
