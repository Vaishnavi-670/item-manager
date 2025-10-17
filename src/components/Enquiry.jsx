import React, { useState, useEffect, useRef } from 'react'
import './Enquiry.css'

/* ================================
   Dummy Data for 3 Tables
================================ */
const stockSummaryData = [
    {
        item: "2311SKC3 Bearing",
        brand: "NTN",
        total: 150,
        del: 45,
        mum: 30,
        com: 25,
        hyd: 20,
        ahm: 30,
        readyDel: 20,
        readyMum: 15,
    },
    {
        item: "6205ZZ Bearing",
        brand: "JAF",
        total: 200,
        del: 60,
        mum: 40,
        com: 35,
        hyd: 30,
        ahm: 35,
        readyDel: 25,
        readyMum: 20,
    },
    {
        item: "NU2207 Roller",
        brand: "EZO",
        total: 180,
        del: 50,
        mum: 35,
        com: 25,
        hyd: 35,
        ahm: 35,
        readyDel: 22,
        readyMum: 18,
    },
];

const priceAvailabilityData = [
    {
        item: "2311SKC3 Bearing",
        brand: "NTN",
        mrp: 3582.15,
        delhi: 3400,
        ahm: 3450,
        mumbai: 3500,
        hyd: 3480,
        com: 3460,
    },
    {
        item: "6205ZZ Bearing",
        brand: "JAF",
        mrp: 2850.75,
        delhi: 2750,
        ahm: 2780,
        mumbai: 2800,
        hyd: 2765,
        com: 2770,
    },
    {
        item: "NU2207 Roller",
        brand: "EZO",
        mrp: 4120.5,
        delhi: 4000,
        ahm: 3980,
        mumbai: 4050,
        hyd: 4020,
        com: 3995,
    },
];

const locationStockData = [
    { itemName: "2311SKC3 Bearing", location: "Delhi", stock: 45 },
    { itemName: "2311SKC3 Bearing", location: "Mumbai", stock: 30 },
    { itemName: "6205ZZ Bearing", location: "Ahmedabad", stock: 35 },
    { itemName: "6205ZZ Bearing", location: "Hyderabad", stock: 30 },
    { itemName: "NU2207 Roller", location: "Coimbatore", stock: 25 },
    { itemName: "NU2207 Roller", location: "Delhi", stock: 50 },
];

const Enquiry = () => {
    const [meta, setMeta] = useState({ enqNo: '', date: new Date().toISOString().slice(0, 10), customer: '', contact: '' })
    const [search, setSearch] = useState({ customer: '', item: '', qty: '' })
    const [filteredItems, setFilteredItems] = useState(undefined)
        const [filteredTop, setFilteredTop] = useState(undefined)
        const [filteredPrice, setFilteredPrice] = useState(undefined)
        const [filteredStock, setFilteredStock] = useState(undefined)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState({ visible: false, row: null, field: null })
    const [searchApplied, setSearchApplied] = useState(false)
    const searchAppliedRef = useRef(false)
    const ignoreNextClickRef = useRef(false)

    const dummyRow = {
        del: '',
        mum: '',
        com: '',
        hyd: '',
        ahm: '',
        readyDel: '',
        readyMum: '',
        mrp: 0,
        location: '',
        stock: 0,
        branch: 'main branch',
        customer: '',
        discount: 0,
    }

    const normalizeItems = (arr) => {
        if (!Array.isArray(arr)) return []
        return arr.map((it, idx) => {
            const qty = Number(it.qty || it.qty === 0 ? Number(it.qty) : 0)
            const rate = Number(it.rate || it.rate === 0 ? Number(it.rate) : 0)
            const amount = +((qty || 0) * (rate || 0)).toFixed(2)
            return {
                srNo: it.srNo || idx + 1,
                itemName: it.itemName || it.name || it.item || '',
                hsn: it.hsn || '',
                brand: it.brand || '',
                qty: qty,
                rate: rate,
                amount: amount,
                ...dummyRow,
                ...it
            }
        })
    }

    // start with no rows in the left table per user's request
    const [items, setItems] = useState(() => [])
    const nextSr = useRef(1)

    useEffect(() => {
        try {
            const rawCus = localStorage.getItem('customers')
            if (rawCus) {
                const parsedCus = JSON.parse(rawCus)
                if (Array.isArray(parsedCus) && parsedCus.length) {
                    const first = parsedCus[0]
                    const name = first.name || first.customerName || first.fullName || ''
                    if (name) setMeta(m => ({ ...m, customer: m.customer || name }))
                }
            }
        } catch (err) { }
    }, [])

    const updateItem = (idx, field, val) => {
        const copy = items.map(it => ({ ...it }))
        const numericFields = new Set(['qty', 'rate', 'del', 'mum', 'com', 'hyd', 'ahm', 'readyDel', 'readyMum', 'mrp', 'stock', 'discount'])
        if (numericFields.has(field)) {
            const num = val === '' ? 0 : parseFloat(val)
            copy[idx][field] = Number.isNaN(num) ? 0 : num
        } else {
            copy[idx][field] = val
        }
        copy[idx].amount = +((parseFloat(copy[idx].qty) || 0) * (parseFloat(copy[idx].rate) || 0)).toFixed(2)
        setItems(copy)
    }

    // item name suggestion helpers
    const getSuggestionPool = (type = 'item') => {
        const pool = new Set()
        if (type === 'item') {
            items.forEach(it => { if (it.itemName) pool.add(it.itemName) })
            stockSummaryData.forEach(it => { if (it.item) pool.add(it.item) })
            priceAvailabilityData.forEach(it => { if (it.item) pool.add(it.item) })
            locationStockData.forEach(it => { if (it.itemName) pool.add(it.itemName) })
        } else if (type === 'customer') {
            items.forEach(it => { if (it.customer) pool.add(it.customer) })
            if (meta && meta.customer) pool.add(meta.customer)
            try {
                const raw = localStorage.getItem('customers')
                if (raw) {
                    const parsed = JSON.parse(raw)
                    if (Array.isArray(parsed)) parsed.forEach(p => {
                        const name = (p && (p['Customer Name'] || p.name || p.customerName || p.fullName || p.customer || ''))
                        if (name) pool.add(name)
                    })
                }
            } catch (err) { }
        }
        return Array.from(pool)
    }

    const onItemInputChange = (idx, val) => {
        updateItem(idx, 'itemName', val)
        const pool = getSuggestionPool('item')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: idx, field: 'item' })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: idx, field: 'item' })
    }

    const onCustomerInputChange = (idx, val) => {
        updateItem(idx, 'customer', val)
        const pool = getSuggestionPool('customer')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: idx, field: 'customer' })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: idx, field: 'customer' })
    }

    const onSearchCustomerInputChange = (val) => {
        setSearch(s => ({ ...s, customer: val }))
        const pool = getSuggestionPool('customer')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'search', field: 'customer' })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'search', field: 'customer' })
    }

    const onSearchItemInputChange = (val) => {
        setSearch(s => ({ ...s, item: val }))
        const pool = getSuggestionPool('item')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'search', field: 'item' })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'search', field: 'item' })
    }

    const chooseSuggestion = (row, val, field = 'item') => {
        if (field === 'item') {
            if (row === 'search') {
                setSearch(s => ({ ...s, item: val }))
            } else {
                updateItem(row, 'itemName', val)
            }
        } else if (field === 'customer') {
            if (row === 'search') {
                setSearch(s => ({ ...s, customer: val }))
            } else {
                updateItem(row, 'customer', val)
            }
        }
        setShowSuggestions({ visible: false, row: null, field: null })
    }

    const performSearch = () => {
        const itm = (search.item || '').trim().toLowerCase()
        const filtered = items.filter(it => {
            // only apply item-name filtering here
            if (itm && !((it.itemName || '').toLowerCase().includes(itm))) return false
            return true
        })
        return filtered
    }

        const handleSearch = () => {
            // reuse existing items filter for left panel
            const left = performSearch()
            setFilteredItems(left)

            const itm = (search.item || '').trim().toLowerCase()

            // Top table (stockSummaryData) filter — only item name
            const topFiltered = stockSummaryData.filter(r => {
                if (itm && !((r.item || '').toLowerCase().includes(itm))) return false
                return true
            })

            // Price table filter — only item name
            const priceFiltered = priceAvailabilityData.filter(r => {
                if (itm && !((r.item || '').toLowerCase().includes(itm))) return false
                return true
            })

            // Stock table filter — only item name
            const stockFiltered = locationStockData.filter(r => {
                if (itm && !((r.itemName || '').toLowerCase().includes(itm))) return false
                return true
            })

            setFilteredTop(topFiltered)
            setFilteredPrice(priceFiltered)
            setFilteredStock(stockFiltered)

            // also set meta.customer if provided (convenience)
            if (search.customer) setMeta(m => ({ ...m, customer: search.customer }))

            // Merge right-side filtered results into left table rows so they appear on the left panel
            const merged = new Map()

            // helper to ensure a base row exists
            const ensure = (key) => {
                if (!merged.has(key)) {
                    merged.set(key, {
                        ...dummyRow,
                        srNo: nextSr.current++,
                        itemName: key,
                        brand: '',
                        qty: Number(search.qty) || 0,
                        customer: search.customer || '',
                        rate: 0,
                        amount: 0,
                    })
                }
                return merged.get(key)
            }

            topFiltered.forEach(r => {
                const key = (r.item || r.itemName || '').toString()
                if (!key) return
                const row = ensure(key)
                row.brand = r.brand || row.brand
                row.total = r.total || row.total
                row.del = r.del || row.del
                row.mum = r.mum || row.mum
                row.com = r.com || row.com
                row.hyd = r.hyd || row.hyd
                row.ahm = r.ahm || row.ahm
                row.readyDel = r.readyDel || row.readyDel
                row.readyMum = r.readyMum || row.readyMum
            })

            priceFiltered.forEach(r => {
                const key = (r.item || r.itemName || '').toString()
                if (!key) return
                const row = ensure(key)
                // copy price info
                row.mrp = r.mrp || row.mrp
                // prefer a city price as rate if available
                row.rate = row.rate || r.delhi || r.mumbai || r.ahm || r.hyd || r.com || r.mrp || row.rate
            })

            stockFiltered.forEach(r => {
                const key = (r.itemName || r.item || '').toString()
                if (!key) return
                const row = ensure(key)
                // set location-specific stock if available (overwrite with last found)
                row.location = r.location || row.location
                row.stock = Number(r.stock || row.stock || 0)
            })

            const mergedArr = Array.from(merged.values()).map((it, i) => {
                const qty = Number(it.qty || 0)
                const rate = Number(it.rate || 0)
                return ({
                    ...it,
                    srNo: i + 1,
                    qty,
                    rate,
                    amount: +((qty || 0) * (rate || 0)).toFixed(2)
                })
            })

            if (mergedArr.length) {
                // append merged results to existing items instead of replacing
                setItems(prev => {
                    const adjusted = mergedArr.map((it) => ({ ...it }))
                    return Array.isArray(prev) ? [...prev, ...adjusted] : adjusted
                })
            } else {
                // if nothing found in right-side datasets, but performSearch found left items, append them
                if ((left || []).length) {
                    setItems(prev => {
                        const adjusted = (left || []).map((it) => ({ ...it }))
                        return Array.isArray(prev) ? [...prev, ...adjusted] : adjusted
                    })
                }
            }

            // clear search inputs after sending data to left table
            setSearch({ customer: '', item: '', qty: '' })
            setSearchApplied(true)
            searchAppliedRef.current = true
            // ignore the next click (the button click) so listener doesn't clear immediately
            ignoreNextClickRef.current = true
        }

    // clear applied search filters when user starts typing again or clicks elsewhere
    useEffect(() => {
        const onKey = (e) => {
            if (!searchAppliedRef.current) return
            // don't clear when pressing Enter on the search input if that was the submit
            setFilteredTop(undefined)
            setFilteredPrice(undefined)
            setFilteredStock(undefined)
            setSearchApplied(false)
            searchAppliedRef.current = false
        }

        const onClick = (e) => {
            if (!searchAppliedRef.current) return
            if (ignoreNextClickRef.current) {
                ignoreNextClickRef.current = false
                return
            }
            setFilteredTop(undefined)
            setFilteredPrice(undefined)
            setFilteredStock(undefined)
            setSearchApplied(false)
            searchAppliedRef.current = false
        }

        window.addEventListener('keydown', onKey)
        window.addEventListener('click', onClick)
        return () => {
            window.removeEventListener('keydown', onKey)
            window.removeEventListener('click', onClick)
        }
    }, [])

    return (
        <div className="enquiry-root">
            <div className="enquiry-header">
                <h2>New Enquiry / Order</h2>
            </div>

            <div className="enquiry-grid">
                <div className="left-panel card">
                    <table className="enquiry-table">
                        <thead>
                            <tr>
                                <th>Enquiry Order</th>
                                <th>Branch</th>
                                <th>Customer Name</th>
                                <th>Item Name</th>
                                <th>Brand</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Discount</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody> {items.map((it, idx) =>
                        (<tr key={it.srNo || idx}>
                            <td>{it.srNo}</td>
                            <td>
                                <input value={it.branch || ''} onChange={(e) => updateItem(idx, 'branch', e.target.value)} /></td>
                            <td style={{ position: 'relative' }}>
                                <input value={it.customer || ''} onChange={(e) => onCustomerInputChange(idx, e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: idx, field: 'customer' }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null }), 150)} />
                                {showSuggestions.visible && showSuggestions.row === idx && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                    <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                        {suggestions.map((s, i) => (
                                            <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(idx, s, 'customer')}>{s}</div>
                                        ))}
                                    </div>
                                ) : null}
                            </td>
                            <td style={{ position: 'relative' }}>
                                <input value={it.itemName} onChange={(e) => onItemInputChange(idx, e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool().slice(0, 8)); setShowSuggestions({ visible: true, row: idx }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null }), 150)} />
                                {showSuggestions.visible && showSuggestions.row === idx && suggestions && suggestions.length ? (
                                    <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                        {suggestions.map((s, i) => (
                                            <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(idx, s)}>{s}</div>
                                        ))}
                                    </div>
                                ) : null}
                            </td>
                            <td>
                                <input value={it.brand} onChange={(e) => updateItem(idx, 'brand', e.target.value)} /></td>
                            <td>
                                <input type="number" value={it.qty} onChange={(e) => updateItem(idx, 'qty', e.target.value)} /></td>
                            <td>
                                <input type="number" value={it.rate} onChange={(e) => updateItem(idx, 'rate', e.target.value)} /></td>
                            <td>
                                <input type="number" value={it.discount || 0} onChange={(e) => updateItem(idx, 'discount', e.target.value)} /></td>
                            <td>₹{(it.amount || 0).toFixed(2)}</td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="right-panel card">
                    <div className="right-header">
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Customer name" value={search.customer} onChange={e => onSearchCustomerInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'customer' }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null }), 150)} />
                            {showSuggestions.visible && showSuggestions.row === 'search' && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion('search', s, 'customer')}>{s}</div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Item name" value={search.item} onChange={e => onSearchItemInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('item').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'item' }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null }), 150)} />
                            {showSuggestions.visible && showSuggestions.row === 'search' && showSuggestions.field === 'item' && suggestions && suggestions.length ? (
                                <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion('search', s, 'item')}>{s}</div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <input className="right-search" placeholder="Qty" value={search.qty} onChange={e => setSearch(s => ({ ...s, qty: e.target.value }))} />
                        <button className="primary" onClick={handleSearch}>Send</button>
                    </div>

                    <div className="nested-outer">
                        {/* === Top Table === */}
                        <div className="nested-top">

                            <div className="table-scroll">
                                <table className="enquiry-table">
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Brand</th>
                                            <th>Total</th>
                                            <th>DEL</th>
                                            <th>MUM</th>
                                            <th>COM</th>
                                            <th>HYD</th>
                                            <th>AHM</th>
                                            <th>Ready DEL</th>
                                            <th>Ready MUM</th>
                                        </tr>
                                    </thead>
                                                <tbody>
                                                    {(filteredTop || stockSummaryData).map((it, idx) => (
                                                        <tr key={`top-${idx}`}>
                                                            <td>{it.item}</td>
                                                            <td>{it.brand}</td>
                                                            <td>{it.total}</td>
                                                            <td>{it.del}</td>
                                                            <td>{it.mum}</td>
                                                            <td>{it.com}</td>
                                                            <td>{it.hyd}</td>
                                                            <td>{it.ahm}</td>
                                                            <td>{it.readyDel}</td>
                                                            <td>{it.readyMum}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                </table>
                            </div>
                        </div>

                        {/* === Bottom 2 Tables === */}
                        <div className="nested-bottom">
                            <div className="nested-col">
                                <div className="table-scroll">
                                    <table className="enquiry-table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Brand</th>
                                                <th>MRP</th>
                                                <th>Delhi</th>
                                                <th>AHM</th>
                                                <th>Mumbai</th>
                                                <th>HYD</th>
                                                <th>COM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filteredPrice || priceAvailabilityData).map((it, idx) => (
                                                <tr key={`b1-${idx}`}>
                                                    <td>{it.item}</td>
                                                    <td>{it.brand}</td>
                                                    <td>₹{it.mrp.toFixed(2)}</td>
                                                    <td>{it.delhi}</td>
                                                    <td>{it.ahm}</td>
                                                    <td>{it.mumbai}</td>
                                                    <td>{it.hyd}</td>
                                                    <td>{it.com}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="nested-col">
                                <div className="table-scroll">
                                    <table className="enquiry-table">
                                        <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Location</th>
                                                <th>Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(filteredStock || locationStockData).map((it, idx) => (
                                                <tr key={`b2-${idx}`}>
                                                    <td>{it.itemName}</td>
                                                    <td>{it.location}</td>
                                                    <td>{it.stock}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Enquiry
