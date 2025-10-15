import React, { useState, useEffect, useRef } from 'react'
import "./PurchaseItem.css"

const emptyItem = { itemName: '', brand: '', location: '', quantity: '', price: '', discount: '', netPrice: '' };

const PurchaseItem = () => {
    const [items, setItems] = useState([{ ...emptyItem }]);
    const [addRowError, setAddRowError] = useState("");
    const [allItemData, setAllItemData] = useState([]); // All items from localStorage
    const [suggestions, setSuggestions] = useState([]); // Suggestions for each row (item)
    const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(-1); // For keyboard nav (item)
    const suggestionRefs = useRef([]);

    const [allCustomerData, setAllCustomerData] = useState([]); // All customers from localStorage
    const [customerSuggestions, setCustomerSuggestions] = useState([]); // Suggestions for customer name
    const [activeCustomerIdx, setActiveCustomerIdx] = useState(-1);

    // Fetch all items from localStorage on mount
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('items') || '[]');
        setAllItemData(stored);
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        setAllCustomerData(customers);
    }, []);

    // Check if all fields in an item are filled
    const isItemFilled = (item) => Object.values(item).every(val => val !== '');

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
        setAddRowError("");

        // Autocomplete for itemName
        if (name === 'itemName') {
            if (value.trim() === "") {
                setSuggestions([]);
                return;
            }
            // Filter suggestions from allItemData
            const filtered = allItemData.filter(item =>
                item.itemName && item.itemName.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setActiveSuggestionIdx(-1);
        }
    };

    // When a suggestion is clicked, fill itemName and brand
    const handleSuggestionClick = (rowIdx, suggestion) => {
        const newItems = [...items];
        newItems[rowIdx].itemName = suggestion.itemName;
        newItems[rowIdx].brand = suggestion.brand;
        setItems(newItems);
        setSuggestions([]);
    };

    // Keyboard navigation for suggestions
    const handleItemNameKeyDown = (e, rowIdx) => {
        if (!suggestions.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveSuggestionIdx(idx => Math.min(idx + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveSuggestionIdx(idx => Math.max(idx - 1, 0));
        } else if (e.key === 'Enter' && activeSuggestionIdx >= 0) {
            e.preventDefault();
            handleSuggestionClick(rowIdx, suggestions[activeSuggestionIdx]);
        }
    };

    const handleAddMore = () => {
        if (!isItemFilled(items[items.length - 1])) {
            setAddRowError("Please fill all fields in the current row before adding another.");
            return;
        }
        setItems([...items, { ...emptyItem }]);
        setAddRowError("");
    };

    const handleDeleteRow = (index) => {
        setItems(items.filter((_, idx) => idx !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = {
            customerName: form.customerName.value,
            invoiceNo: form.invoiceNo.value,
            date: form.date.value,
            items: items,
        };
        console.log('Form Data Submitted:', formData);
        form.reset(); // This clears all fields after submit
        setItems([{ itemName: '', brand: '', location: '', quantity: '', price: '', discount: '', netPrice: '' }]);
    }

    const handleClearForm = (e) => {
        e.preventDefault();
        const form = document.querySelector('.purchase-form');
        if (form) {
            form.reset();
        }
        setItems([{ itemName: '', brand: '', location: '', quantity: '', price: '', discount: '', netPrice: '' }]);
    };
    // Customer name autocomplete handlers
    const handleCustomerNameChange = (e) => {
        const value = e.target.value;
        // Show suggestions if input is not empty
        if (value.trim() === "") {
            setCustomerSuggestions([]);
            return;
        }
        const filtered = allCustomerData.filter(cust =>
            cust["Customer Name"] && cust["Customer Name"].toLowerCase().includes(value.toLowerCase())
        );
        setCustomerSuggestions(filtered);
        setActiveCustomerIdx(-1);
    };

    const handleCustomerSuggestionClick = (suggestion) => {
        // Set the value in the input
        const input = document.getElementById("customerName");
        if (input) input.value = suggestion["Customer Name"];
        setCustomerSuggestions([]);
    };

    const handleCustomerNameKeyDown = (e) => {
        if (!customerSuggestions.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveCustomerIdx(idx => Math.min(idx + 1, customerSuggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveCustomerIdx(idx => Math.max(idx - 1, 0));
        } else if (e.key === 'Enter' && activeCustomerIdx >= 0) {
            e.preventDefault();
            handleCustomerSuggestionClick(customerSuggestions[activeCustomerIdx]);
        }
    };

    return (
        <div className='purchaseWrap'>
            <div className="purchase-item">
                <h2>Purchase Item</h2>
                <form onSubmit={handleSubmit} className='purchase-form'>
                    <div className='purchase-flex'>
                        <div className="form-group" style={{ position: 'relative' }}>
                            <label htmlFor="customerName">Customer Name:</label>
                            <input
                                type="text"
                                id="customerName"
                                name="customerName"
                                required
                                autoComplete="off"
                                onChange={handleCustomerNameChange}
                                onKeyDown={handleCustomerNameKeyDown}
                            />
                            {/* Suggestions dropdown */}
                            {customerSuggestions.length > 0 && document.activeElement && document.activeElement.id === "customerName" && (
                                <ul className="autocomplete-suggestions" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    zIndex: 10,
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    borderTop: 'none',
                                    maxHeight: 150,
                                    overflowY: 'auto',
                                    listStyle: 'none',
                                    margin: 0,
                                    padding: 0
                                }}>
                                    {customerSuggestions.map((s, sidx) => (
                                        <li
                                            key={sidx}
                                            style={{
                                                padding: '6px 12px',
                                                background: sidx === activeCustomerIdx ? '#e6f0ff' : '#fff',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee'
                                            }}
                                            onMouseDown={() => handleCustomerSuggestionClick(s)}
                                        >
                                            {s["Customer Name"]}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="invoiceNo">Invoice No:</label>
                            <input type="text" id="invoiceNo" name="invoiceNo" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Date:</label>
                            <input type="date" id="date" name="date" required />
                        </div>
                    </div>
                    {items.map((item, idx) => (
                        <div className='purchase-flex' key={idx} style={{ alignItems: 'center', position: 'relative' }}>
                            <div className="form-group" style={{ position: 'relative' }}>
                                <label htmlFor={`itemName-${idx}`}>Item Name:</label>
                                <input
                                    type="text"
                                    id="itemName"
                                    name="itemName"
                                    value={item.itemName}
                                    autoComplete="off"
                                    onChange={e => handleItemChange(idx, e)}
                                    onKeyDown={e => handleItemNameKeyDown(e, idx)}
                                    required
                                />
                                {/* Suggestions dropdown */}
                                {suggestions.length > 0 && item.itemName && document.activeElement && document.activeElement.value === item.itemName && (
                                    <ul className="autocomplete-suggestions" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: 0,
                                        right: 0,
                                        zIndex: 10,
                                        background: '#fff',
                                        border: '1px solid #ccc',
                                        borderTop: 'none',
                                        maxHeight: 150,
                                        overflowY: 'auto',
                                        listStyle: 'none',
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        {suggestions.map((s, sidx) => (
                                            <li
                                                key={sidx}
                                                ref={el => suggestionRefs.current[sidx] = el}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: sidx === activeSuggestionIdx ? '#e6f0ff' : '#fff',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee'
                                                }}
                                                onMouseDown={() => handleSuggestionClick(idx, s)}
                                            >
                                                {s.itemName} <span style={{ color: '#888', fontSize: 12 }}>({s.brand})</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="form-group">
                                <label htmlFor={`brand-${idx}`}>Brand:</label>
                                <input type="text" id="brand" name="brand" value={item.brand} onChange={e => handleItemChange(idx, e)} required autoComplete="off" />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`location-${idx}`}>Location:</label>
                                <input type="text" id="location" name="location" value={item.location} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`quantity-${idx}`}>Quantity:</label>
                                <input type="number" id="quantity" name="quantity" value={item.quantity} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`price-${idx}`}>Price ₹:</label>
                                <input type="number" id="price" name="price" value={item.price} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`discount-${idx}`}>Dis(%) :</label>
                                <input type="number" id="discount" name="discount" value={item.discount} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`netPrice-${idx}`}>Net Price:</label>
                                <input type="number" id="netPrice" name="netPrice" value={item.netPrice} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            {idx > 0 && (
                                <button type="button" className="delete-row-btn" onClick={() => handleDeleteRow(idx)} title="Delete row">❌</button>
                            )}
                        </div>
                    ))}
                    <div className='purchase-flex' style={{ gap: 16 }}>
                        <button type="button" onClick={handleAddMore} className="purchase-action-btn">Add More Items </button>
                        <button type="button" onClick={handleClearForm} className="purchase-action-btn">Clear Form</button>
                        <button type="submit" className="purchase-action-btn">Submit</button>
                    </div>
                    {addRowError && (
                        <div style={{ color: 'red', marginTop: 8, fontWeight: 'bold' }}>{addRowError}</div>
                    )}
                </form>
            </div>
        </div>
    )
}

export default PurchaseItem;