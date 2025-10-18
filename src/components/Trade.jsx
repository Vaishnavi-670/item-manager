import React, { useState } from 'react'
import './Enquiry.css'
import './Trade.css'


const TradeOrderProcess = [
    { tradeType: 'Order', branch: 'Main', customerName: 'John Doe', itemName: 'Widget', brand: 'Acme', qty: 10, rate: 125.5, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'John Doe', itemName: 'Thingamajig', brand: 'Acme', qty: 10, rate: 125.5, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Jane Smith', itemName: 'Gadget', brand: 'Beta', qty: 5, rate: 320.0, discount: 10 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Alice Johnson', itemName: 'Widget', brand: 'Gamma', qty: 2, rate: 450.0, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Alice Johnson', itemName: 'Thingamajig', brand: 'Gamma', qty: 2, rate: 450.0, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Bob Brown', itemName: 'Doohickey', brand: 'Delta', qty: 8, rate: 75.0, discount: 5 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Charlie Davis', itemName: 'Contraption', brand: 'Epsilon', qty: 3, rate: 210.0, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Charlie Davis', itemName: 'Thingamajig', brand: 'Epsilon', qty: 3, rate: 210.0, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Charlie Davis', itemName: 'Gadget', brand: 'Epsilon', qty: 3, rate: 210.0, discount: 0 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Diana Evans', itemName: 'Apparatus', brand: 'Zeta', qty: 7, rate: 99.99, discount: 7 },
    { tradeType: 'Order', branch: 'Main', customerName: 'Frank Green', itemName: 'Device', brand: 'Eta', qty: 4, rate: 180.0, discount: 0 },
]
const locationAvailability = {
    'Widget': [{ loc: 'LOC-A', avail: 12 }, { loc: 'LOC-B', avail: 4 }, { loc: 'LOC-C', avail: 4 }],
    'Thingamajig': [{ loc: 'LOC-C', avail: 6 }, { loc: 'LOC-D', avail: 2 }, { loc: 'LOC-E', avail: 1 }],
    'Gadget': [{ loc: 'LOC-E', avail: 10 }, { loc: 'LOC-F', avail: 1 }, { loc: 'LOC-g', avail: 5 }],
    'Doohickey': [{ loc: 'LOC-G', avail: 20 }, { loc: 'LOC-H', avail: 5 }],
    'Contraption': [{ loc: 'LOC-H', avail: 3 }, { loc: 'LOC-i', avail: 4 }],
    'Apparatus': [{ loc: 'LOC-I', avail: 9 }],
    'Device': [{ loc: 'LOC-J', avail: 5 }, { loc: 'LOC-K', avail: 2 }],
}
const Trade = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedRows, setSelectedRows] = useState(new Set())
    const [showModal, setShowModal] = useState(false)
    const [modalSelections, setModalSelections] = useState({})

    const toggleRowSelection = (index, customerName) => {
        setSelectedRows(prev => {
            const copy = new Set(prev)
            const already = copy.has(index)
            // If trying to select a different customer's row while a customer is locked, ignore
            if (!already && selectedCustomer && selectedCustomer !== customerName) {
                return prev
            }
            if (already) {
                copy.delete(index)
            } else {
                copy.add(index)
            }
            // If we've cleared all selections, reset selectedCustomer
            if (copy.size === 0) {
                setSelectedCustomer(null)
            } else {
                // if selecting the first row, set the customer lock
                if (!selectedCustomer) setSelectedCustomer(customerName)
            }
            return copy
        })
    }

    const isRowSelectable = (customerName) => {
        return !selectedCustomer || selectedCustomer === customerName
    }

    const selectedIndices = Array.from(selectedRows)
    const selectedItems = selectedIndices.map(i => ({ ...TradeOrderProcess[i], _srcIndex: i }))

    return (
        <div className="card trade-card trade-page">
            <h3 className='trade-heading' >Trade Order Process</h3>
            <div className="trade-container">
                <table className="trade-table ">
                    <thead>
                        <tr id='row-heading'>
                            <th>Trade Type</th>
                            <th>Branch</th>
                            <th>Customer Name</th>
                            <th>Item Name</th>
                            <th>Brand</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Discount</th>
                            <th>Amount</th>
                            <th className="select-header">Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TradeOrderProcess.map((row, index) => {
                            const rate = Number(row.rate || 0)
                            const discount = Number(row.discount || 0)
                            const qty = Number(row.qty || 0)
                            const amount = (qty * rate - discount)
                            const checked = selectedRows.has(index)
                            const selectable = isRowSelectable(row.customerName)
                            return (
                                <tr key={index}>
                                    <td>{row.tradeType}</td>
                                    <td>{row.branch}</td>
                                    <td>{row.customerName}</td>
                                    <td>{row.itemName}</td>
                                    <td>{row.brand}</td>
                                    <td>{qty}</td>
                                    <td>{rate.toFixed(2)}</td>
                                    <td>{discount}</td>
                                    <td>{amount.toFixed(2)}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            aria-label={`Select row ${index + 1}`}
                                            checked={checked}
                                            onChange={() => toggleRowSelection(index, row.customerName)}
                                            disabled={!selectable}
                                        />
                                        <span className="checkbox-indicator" aria-hidden="true"></span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="button-contain">
                    <button className="gen-btn" onClick={() => {
                        if (selectedCustomer && selectedRows.size > 0) {
                            // reset modal selections so each selected item shows empty Location and Loc Qty by default
                            setModalSelections({})
                            setShowModal(true)
                        }
                    }}>Generate Packing Invoice</button>
                </div>
                {showModal && (
                    <div className="modal-overlay" role="dialog" aria-modal="true">
                        <div className="modal">
                            <div className="modal-header">
                                <h4 id='modal-header-title'>Packing Invoice - {selectedCustomer}</h4>
                                <button className="close" onClick={() => setShowModal(false)}>×</button>
                            </div>
                            <div className="modal-body">
                                <table className="trade-table">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Brand</th>
                                            <th>Qty</th>
                                            <th>Loc</th>
                                            <th>Loc Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedItems.map((r, idx) => {
                                            const srcIndex = r._srcIndex
                                            const availList = locationAvailability[r.itemName] || []
                                            // options: prefer locations with avail >= required qty
                                            const suitable = availList.filter(a => a.avail >= (r.qty || 0))
                                            const other = availList.filter(a => a.avail < (r.qty || 0))
                                            const options = suitable.concat(other)
                                            // start with no selection by default
                                            const selectedLoc = (modalSelections[srcIndex] && modalSelections[srcIndex].loc) || ''
                                            const selectedAvail = options.find(o => o.loc === selectedLoc)?.avail
                                            const selectedQty = (modalSelections[srcIndex] && modalSelections[srcIndex].qty) ?? ''
                                            return (
                                                <tr key={idx}>
                                                    <td>{r.itemName}</td>
                                                    <td>{r.brand}</td>
                                                    <td>{r.qty}</td>
                                                    <td>
                                                        <select
                                                            key={srcIndex}
                                                            value={selectedLoc}
                                                            onChange={(e) => {
                                                                const loc = e.target.value
                                                                const avail = options.find(o => o.loc === loc)?.avail ?? 0
                                                                // default Loc Qty to the smaller of location availability and required qty
                                                                const autoQty = Math.min(avail, (r.qty || 0))
                                                                setModalSelections(prev => ({ ...prev, [srcIndex]: { loc, qty: autoQty } }))
                                                            }}
                                                        >
                                                            <option value="" disabled>Select location</option>
                                                            {options.map(o => (
                                                                <option key={o.loc} value={o.loc}>
                                                                    {o.loc} (AVL: {o.avail})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td>{selectedQty !== '' ? selectedQty : ''}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {/* <div className="modal-footer">
                                <button className="gen-btn" onClick={() => setShowModal(false)}>Close</button>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Trade