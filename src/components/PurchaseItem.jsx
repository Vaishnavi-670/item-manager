import React, { useState } from 'react'
import "./PurchaseItem.css"

const emptyItem = { itemName: '', brand: '', location: '', quantity: '', price: '', discount: '', netPrice: '' };

const PurchaseItem = () => {
    const [items, setItems] = useState([{ ...emptyItem }]);
    const [addRowError, setAddRowError] = useState("");

    // Check if all fields in an item are filled
    const isItemFilled = (item) => Object.values(item).every(val => val !== '');

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index][name] = value;
        setItems(newItems);
        setAddRowError(""); // Clear error as soon as user starts typing
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
    return (
        <div className='purchaseWrap'>

            <div className="purchase-item">
                <h2>Purchase Item</h2>
                <form onSubmit={handleSubmit} className='purchase-form'>
                    <div className='purchase-flex'>
                        <div className="form-group">
                            <label htmlFor="customerName">Customer Name:</label>
                            <input type="text" id="customerName" name="customerName" required />
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
                        <div className='purchase-flex' key={idx} style={{ alignItems: 'center' }}>
                            <div className="form-group">
                                <label htmlFor={`itemName-${idx}`}>Item Name:</label>
                                <input type="text" id="itemName" name="itemName" value={item.itemName} onChange={e => handleItemChange(idx, e)} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor={`brand-${idx}`}>Brand:</label>
                                <input type="text" id="brand" name="brand" value={item.brand} onChange={e => handleItemChange(idx, e)} required />
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
                        <button type="button" onClick={handleAddMore} className="purchase-action-btn">Add More Items</button>
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