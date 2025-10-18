import React, { useState } from 'react'
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
    const [savedAllocations, setSavedAllocations] = useState({})
    const [lastInvoiceNumber, setLastInvoiceNumber] = useState(null)
    const [savedInvoiceByRow, setSavedInvoiceByRow] = useState({})

    const toggleRowSelection = (index, customerName) => {
        setSelectedRows(prev => {
            const copy = new Set(prev)
            const already = copy.has(index)
            if (!already && selectedCustomer && selectedCustomer !== customerName) {
                return prev
            }
            if (already) {
                copy.delete(index)
            } else {
                copy.add(index)
            }
            if (copy.size === 0) {
                setSelectedCustomer(null)
            } else {
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

    const getAllocations = (srcIndex) => {
        const rec = modalSelections[srcIndex]
        if (!rec || !Array.isArray(rec.allocations) || rec.allocations.length === 0) return [{ loc: '', qty: '' }]
        return rec.allocations
    }

    const addAllocationAfter = (srcIndex, allocIdx) => {
        setModalSelections(prev => {
            const old = prev[srcIndex] || { allocations: [{ loc: '', qty: '' }] }
            const arr = (old.allocations || []).slice()
            arr.splice(allocIdx + 1, 0, { loc: '', qty: '' })
            return { ...prev, [srcIndex]: { allocations: arr } }
        })
    }

    const removeAllocation = (srcIndex, allocIdx) => {
        setModalSelections(prev => {
            const old = prev[srcIndex] || { allocations: [{ loc: '', qty: '' }] }
            const arr = (old.allocations || []).slice()
            if (arr.length <= 1) return prev
            arr.splice(allocIdx, 1)
            return { ...prev, [srcIndex]: { allocations: arr } }
        })
    }

    const updateAllocationLoc = (srcIndex, allocIdx, loc, options, reqQty) => {
        setModalSelections(prev => {
            const old = prev[srcIndex] || { allocations: [{ loc: '', qty: '' }] }
            const arr = (old.allocations || []).slice()
            const avail = options.find(o => o.loc === loc)?.avail ?? 0
            const allocatedExcl = arr.reduce((s, a, i) => i === allocIdx ? s : s + (Number(a.qty) || 0), 0)
            const autoQty = Math.min(avail, Math.max(0, reqQty - allocatedExcl))
            arr[allocIdx] = { ...(arr[allocIdx] || {}), loc, qty: autoQty }
            return { ...prev, [srcIndex]: { allocations: arr } }
        })
    }

    const updateAllocationQty = (srcIndex, allocIdx, qty) => {
        setModalSelections(prev => {
            const old = prev[srcIndex] || { allocations: [{ loc: '', qty: '' }] }
            const arr = (old.allocations || []).slice()
            arr[allocIdx] = { ...(arr[allocIdx] || {}), qty }
            return { ...prev, [srcIndex]: { allocations: arr } }
        })
    }

    // Generate packing invoice number: ddmmyyyyHHMMSS-first3(customer)
    const generatePackingInvoiceNumber = (customerName) => {
        const now = new Date()
        const dd = String(now.getDate()).padStart(2, '0')
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        const yyyy = now.getFullYear()
        const hh = String(now.getHours()).padStart(2, '0')
        const min = String(now.getMinutes()).padStart(2, '0')
        const ss = String(now.getSeconds()).padStart(2, '0')
        const namePart = customerName ? customerName.trim().substring(0, 3).toLowerCase() : 'unk'
        const invoiceNo = `${dd}${mm}${yyyy}${hh}${min}${ss}-${namePart}`
        return invoiceNo
    }

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
                                        {savedInvoiceByRow[index]
                                            ? <span style={{ color: '#0b4ea2', fontWeight: 600 }}>{savedInvoiceByRow[index]}</span>
                                            : (
                                                <>
                                                    <input
                                                        type="checkbox"
                                                        aria-label={`Select row ${index + 1}`}
                                                        checked={checked}
                                                        onChange={() => toggleRowSelection(index, row.customerName)}
                                                        disabled={!selectable}
                                                    />
                                                    <span className="checkbox-indicator" aria-hidden="true"></span>
                                                </>
                                            )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                <div className="button-contain">
                    <button className="gen-btn" onClick={() => {
                        if (selectedCustomer && selectedRows.size > 0) {
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
                                            const suitable = availList.filter(a => a.avail >= (r.qty || 0))
                                            const other = availList.filter(a => a.avail < (r.qty || 0))
                                            const options = suitable.concat(other)
                                            const allocations = getAllocations(srcIndex)
                                            return (
                                                <tr key={idx}>
                                                    <td>{r.itemName}</td>
                                                    <td>{r.brand}</td>
                                                    <td>{r.qty}</td>
                                                    <td>
                                                        <div className="alloc-inline-list">
                                                            {allocations.map((a, ai) => {
                                                                const usedLocsExclCurrent = allocations
                                                                    .map((x, i) => i === ai ? null : x.loc)
                                                                    .filter(Boolean)
                                                                const optionsForThis = options.filter(o => !usedLocsExclCurrent.includes(o.loc) || o.loc === a.loc)
                                                                return (
                                                                    <div className="alloc-inline-item" key={ai}>
                                                                        <select
                                                                            value={a.loc || ''}
                                                                            onChange={(e) => updateAllocationLoc(srcIndex, ai, e.target.value, options, r.qty)}
                                                                        >
                                                                            <option value="" disabled>Select location</option>
                                                                            {optionsForThis.map(o => (
                                                                                <option key={o.loc} value={o.loc}>{o.loc} (AVL: {o.avail})</option>
                                                                            ))}
                                                                        </select>
                                                                        <button className="inline-add" onClick={() => addAllocationAfter(srcIndex, ai)}>+</button>
                                                                        {allocations.length > 1 && (
                                                                            <button className="inline-remove" onClick={() => removeAllocation(srcIndex, ai)}>-</button>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="alloc-inline-list">
                                                            {allocations.map((a, ai) => (
                                                                <div className="alloc-inline-item" key={ai}>
                                                                    <input
                                                                        type="number"
                                                                        className="loc-qty-input"
                                                                        min="0"
                                                                        value={a.qty === '' ? '' : a.qty}
                                                                        onChange={(e) => updateAllocationQty(srcIndex, ai, e.target.value)}
                                                                        placeholder="Loc Qty"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button className="gen-btn" onClick={() => {
                                    if (!selectedCustomer) {
                                        window.alert('Please select a customer before saving the packing invoice.')
                                        return
                                    }
                                    const inv = generatePackingInvoiceNumber(selectedCustomer || '')
                                    console.log('Generated invoice:', inv)
                                    setSavedAllocations(prev => ({ ...prev, [inv]: modalSelections }))
                                    setLastInvoiceNumber(inv)

                                    setSavedInvoiceByRow(prev => {
                                        const next = { ...prev }
                                        selectedIndices.forEach(i => { next[i] = inv })
                                        return next
                                    })
                                    setSelectedRows(prev => {
                                        const copy = new Set(prev)
                                        selectedIndices.forEach(i => copy.delete(i))
                                        if (copy.size === 0) setSelectedCustomer(null)
                                        return copy
                                    })

                                    setModalSelections({})
                                    setShowModal(false)
                                }}>Save</button>
                                <button className="gen-btn" onClick={() => {
                                    setModalSelections({})
                                    setShowModal(false)
                                }} style={{ marginLeft: 8, background: '#6b7280' }}>x</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Trade