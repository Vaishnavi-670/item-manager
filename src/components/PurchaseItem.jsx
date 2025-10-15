import React from 'react'
import "./PurchaseItem.css"

const PurchaseItem = () => {
    return (
        <div className='purchaseWrap'>

            <div className="purchase-item">
                <h2>Purchase Item</h2>
                <form className='purchase-form'>
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
                   <div className='purchase-flex'>
                     <div className="form-group">
                        <label htmlFor="itemName">Item Name:</label>
                        <input type="text" id="itemName" name="itemName" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="brand">Brand:</label>
                        <input type="text" id="brand" name="brand" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Location:</label>
                        <input type="text" id="location" name="location" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price ₹:</label>
                        <input type="number" id="price" name="price" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="discount">Dis(%) :</label>
                        <input type="number" id="discount" name="discount" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="netPrice">Net Price:</label>
                        <input type="number" id="netPrice" name="netPrice" required />
                    </div>
                   </div>
                   <div className='purchase-flex'>
                       <button type="button" onClick={() => {}}>Add More Items</button>
                       <button type="button" onClick={() => {}}>Clear Form</button>
                       <button type="submit">Submit</button>
                   </div>
                </form>
            </div>
        </div>
    )
}

export default PurchaseItem;