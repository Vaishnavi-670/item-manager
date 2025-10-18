import React, { useState, useEffect, useRef } from 'react'
import './Enquiry.css'


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
const salesData = [
    { date: "2025-10-10", customerName: "Ravi Kumar", item: "2311SKC3 Bearing", brand: "NTN", qty: 10, price: 3400, total: 34000 },
    { date: "2025-10-11", customerName: "Sonal Agarwal", item: "6205ZZ Bearing", brand: "JAF", qty: 5, price: 2750, total: 13750 },
    { date: "2025-10-12", customerName: "Tech Motors", item: "NU2207 Roller", brand: "EZO", qty: 2, price: 4000, total: 8000 },
    { date: "2025-10-13", customerName: "PQR Industries", item: "2311SKC3 Bearing", brand: "NTN", qty: 3, price: 3400, total: 10200 },
    { date: "2025-10-14", customerName: "AK Traders", item: "6205ZZ Bearing", brand: "JAF", qty: 8, price: 2750, total: 22000 },
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
        type: 'Enquiry', // per-row type: Enquiry or Order
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
    const [leftSearch, setLeftSearch] = useState('')

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

    // ensure an item exists at index and set a field (creates row if missing)
    const setItemField = (idx, field, val) => {
        setItems(prev => {
            const copy = Array.isArray(prev) ? prev.map(it => ({ ...it })) : []
            const numericFields = new Set(['qty', 'rate', 'del', 'mum', 'com', 'hyd', 'ahm', 'readyDel', 'readyMum', 'mrp', 'stock', 'discount'])
            while (copy.length <= idx) {
                copy.push({ ...dummyRow, srNo: copy.length + 1 })
            }
            if (numericFields.has(field)) {
                const num = val === '' ? 0 : parseFloat(val)
                copy[idx][field] = Number.isNaN(num) ? 0 : num
            } else {
                copy[idx][field] = val
            }
            copy[idx].amount = +((parseFloat(copy[idx].qty) || 0) * (parseFloat(copy[idx].rate) || 0)).toFixed(2)
            return copy
        })
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

    // sales suggestions: pool of item names and brands from salesData
    const getSalesSuggestionPool = (type = 'q') => {
        const pool = new Set()
        if (type === 'q') {
            salesData.forEach(s => { if (s.item) pool.add(s.item); if (s.brand) pool.add(s.brand) })
        } else if (type === 'customer') {
            salesData.forEach(s => { if (s.customerName) pool.add(s.customerName) })
            // include customers from customer pool
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

    const onSalesQueryChange = (val) => {
        setSalesFilter(s => ({ ...s, q: val }))
        const pool = getSalesSuggestionPool('q')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'sales', field: 'q', id: `sales-q` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'sales', field: 'q', id: `sales-q` })
    }

    const onSalesCustomerChange = (val) => {
        setSalesFilter(s => ({ ...s, customer: val }))
        const pool = getSalesSuggestionPool('customer')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'sales', field: 'customer', id: `sales-customer` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'sales', field: 'customer', id: `sales-customer` })
    }

    const chooseSalesSuggestion = (field, val) => {
        if (field === 'q') setSalesFilter(s => ({ ...s, q: val }))
        else if (field === 'customer') setSalesFilter(s => ({ ...s, customer: val }))
        setShowSuggestions({ visible: false, row: null, field: null })
    }

    const onItemInputChange = (idx, val) => {
        updateItem(idx, 'itemName', val)
        const pool = getSuggestionPool('item')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: idx, field: 'item', id: `${idx}-item` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: idx, field: 'item', id: `${idx}-item` })
    }

    const onCustomerInputChange = (idx, val) => {
        updateItem(idx, 'customer', val)
        const pool = getSuggestionPool('customer')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: idx, field: 'customer', id: `${idx}-customer` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: idx, field: 'customer', id: `${idx}-customer` })
    }

    const onSearchCustomerInputChange = (val) => {
        setSearch(s => ({ ...s, customer: val }))
        const pool = getSuggestionPool('customer')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'search', field: 'customer', id: `search-customer` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'search', field: 'customer', id: `search-customer` })
    }

    const onSearchItemInputChange = (val) => {
        setSearch(s => ({ ...s, item: val }))
        const pool = getSuggestionPool('item')
        const q = (val || '').toString().trim().toLowerCase()
        if (!q) {
            setSuggestions(pool.slice(0, 8))
            setShowSuggestions({ visible: true, row: 'search', field: 'item', id: `search-item` })
            return
        }
        const filtered = pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row: 'search', field: 'item', id: `search-item` })
    }

    const chooseSuggestion = (row, val, field = 'item') => {
        if (field === 'item') {
            if (row === 'search') {
                setSearch(s => ({ ...s, item: val }))
            } else {
                // if row doesn't exist yet, create it
                if (!items[row]) setItemField(row, 'itemName', val)
                else updateItem(row, 'itemName', val)
            }
        } else if (field === 'customer') {
            if (row === 'search') {
                setSearch(s => ({ ...s, customer: val }))
            } else {
                if (!items[row]) setItemField(row, 'customer', val)
                else updateItem(row, 'customer', val)
            }
        }
        setShowSuggestions({ visible: false, row: null, field: null })
    }

    const performSearch = () => {
        const itm = (search.item || '').trim().toLowerCase()
        const filtered = items.filter(it => {
            if (itm && !((it.itemName || '').toLowerCase().includes(itm))) return false
            return true
        })
        return filtered
    }

    const handleSearch = () => {
        const left = performSearch()
        setFilteredItems(left)

        const itm = (search.item || '').trim().toLowerCase()

        const topFiltered = stockSummaryData.filter(r => {
            if (itm && !((r.item || '').toLowerCase().includes(itm))) return false
            return true
        })

        const priceFiltered = priceAvailabilityData.filter(r => {
            if (itm && !((r.item || '').toLowerCase().includes(itm))) return false
            return true
        })

        const stockFiltered = locationStockData.filter(r => {
            if (itm && !((r.itemName || '').toLowerCase().includes(itm))) return false
            return true
        })

        setFilteredTop(topFiltered)
        setFilteredPrice(priceFiltered)
        setFilteredStock(stockFiltered)

        if (search.customer) setMeta(m => ({ ...m, customer: search.customer }))

        const merged = new Map()

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
            row.mrp = r.mrp || row.mrp
            row.rate = row.rate || r.delhi || r.mumbai || r.ahm || r.hyd || r.com || r.mrp || row.rate
        })

        stockFiltered.forEach(r => {
            const key = (r.itemName || r.item || '').toString()
            if (!key) return
            const row = ensure(key)
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
            setItems(prev => {
                const adjusted = mergedArr.map((it) => ({ ...it }))
                return Array.isArray(prev) ? [...prev, ...adjusted] : adjusted
            })
        } else {
            if ((left || []).length) {
                setItems(prev => {
                    const adjusted = (left || []).map((it) => ({ ...it }))
                    return Array.isArray(prev) ? [...prev, ...adjusted] : adjusted
                })
            }
        }

        setSearch({ customer: '', item: '', qty: '' })
        setSearchApplied(true)
        searchAppliedRef.current = true
        ignoreNextClickRef.current = true
    }

    useEffect(() => {
        const onKey = (e) => {
            if (!searchAppliedRef.current) return
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

    const isObjectRowEmpty = (obj, keys) => {
        if (!obj) return true
        for (const k of keys) {
            const v = obj[k]
            if (v === undefined || v === null || v === '') continue
            if (typeof v === 'number') return false
            if (typeof v === 'string' && v.trim() !== '') return false
            if (v) return false
        }
        return true
    }

    // focused row state for left table — index of the row currently focused, or null
    const [focusedLeftRow, setFocusedLeftRow] = useState(null)
    // checked state for left rows (by visual index)
    const [checkedRows, setCheckedRows] = useState({})

    // sales table filters (inline controls)
    const [salesFilter, setSalesFilter] = useState({ q: '', customer: '' })

    const toggleChecked = (rowIdx) => {
        setCheckedRows(prev => ({ ...prev, [rowIdx]: !prev[rowIdx] }))
    }

    const setChecked = (rowIdx, value) => {
        setCheckedRows(prev => ({ ...prev, [rowIdx]: !!value }))
    }

    return (
        <div className="enquiry-root">
            <div className="enquiry-header">
                <h2>New Enquiry / Order</h2>
            </div>

            <div className="enquiry-grid">
                <div className="left-panel card">
                    <div className="left-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <h3 style={{ margin: 0, fontSize: 16 }}>Enquiry / Order</h3>
                        <input className="left-search" placeholder="Search customer" value={leftSearch} onChange={e => setLeftSearch(e.target.value)} />
                    </div>
                    <table className="enquiry-table">
                        <thead>
                            <tr>
                                <th>Enquiry/Order</th>
                                <th>Branch</th>
                                <th>Customer Name</th>
                                <th>Item Name</th>
                                <th>Brand</th>
                                <th>Qty</th>
                                <th>Rate</th>
                                <th>Discount</th>
                                <th>Amount</th>
                                <th style={{ width: 36 }}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {leftSearch ? (
                                (items.filter(it => (it.customer || '').toString().toLowerCase().includes((leftSearch || '').toLowerCase()))).map((it, rowIdx) => (
                                    <tr key={it.srNo || `f-${rowIdx}`} className={`${focusedLeftRow === rowIdx ? 'row-focused' : ''} ${checkedRows[rowIdx] ? 'row-checked' : ''}`.trim()} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} tabIndex={-1}>
                                        <td>
                                            <select value={it ? (it.type || 'Enquiry') : 'Enquiry'} onChange={(e) => it ? updateItem(items.indexOf(it), 'type', e.target.value) : null} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)}>
                                                <option>Enquiry</option>
                                                <option>Order</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input value={it ? (it.branch || '') : ''} onChange={(e) => updateItem(items.indexOf(it), 'branch', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                        <td style={{ position: 'relative' }}>
                                            <input value={it ? (it.customer || '') : ''} onChange={(e) => updateItem(items.indexOf(it), 'customer', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} />
                                        </td>
                                        <td style={{ position: 'relative' }}>
                                            <input value={it ? it.itemName : ''} onChange={(e) => updateItem(items.indexOf(it), 'itemName', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} />
                                        </td>
                                        <td>
                                            <input value={it ? it.brand : ''} onChange={(e) => updateItem(items.indexOf(it), 'brand', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                        <td>
                                            <input type="number" value={it ? it.qty : ''} onChange={(e) => updateItem(items.indexOf(it), 'qty', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                        <td>
                                            <input type="number" value={it ? it.rate : ''} onChange={(e) => updateItem(items.indexOf(it), 'rate', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                        <td>
                                            <input type="number" value={it ? (it.discount || 0) : ''} onChange={(e) => updateItem(items.indexOf(it), 'discount', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                        <td>₹{it ? (it.amount || 0).toFixed(2) : '0.00'}</td>
                                        <td className="row-action-cell">
                                            {(focusedLeftRow === rowIdx || checkedRows[rowIdx]) ? (
                                                <div className="action-box">
                                                    <button
                                                        type="button"
                                                        className={`row-check btn-mark`}
                                                        onMouseDown={(e) => { e.preventDefault(); setChecked(rowIdx, true) }}
                                                        aria-label={`Mark row ${rowIdx}`}
                                                    >✓</button>
                                                    <button
                                                        type="button"
                                                        className={`row-check btn-unmark ${checkedRows[rowIdx] ? 'active' : ''}`}
                                                        onMouseDown={(e) => { e.preventDefault(); setChecked(rowIdx, false) }}
                                                        aria-label={`Unmark row ${rowIdx}`}
                                                    >❌</button>
                                                </div>
                                            ) : (
                                                <span style={{ display: 'inline-block', width: 20, height: 20 }} />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                Array.from({ length: 7 }).map((_, rowIdx) => {
                                    const it = items[rowIdx] || null
                                    return (
                                        <tr key={it ? (it.srNo || rowIdx) : `tpl-${rowIdx}`} className={`${focusedLeftRow === rowIdx ? 'row-focused' : ''} ${checkedRows[rowIdx] ? 'row-checked' : ''}`.trim()} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} tabIndex={-1}>
                                            <td>
                                                <select value={it ? (it.type || 'Enquiry') : 'Enquiry'} onChange={(e) => setItemField(rowIdx, 'type', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)}>
                                                    <option>Enquiry</option>
                                                    <option>Order</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input value={it ? (it.branch || '') : ''} onChange={(e) => setItemField(rowIdx, 'branch', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                            <td style={{ position: 'relative' }}>
                                                <input value={it ? (it.customer || '') : ''} onChange={(e) => setItemField(rowIdx, 'customer', e.target.value)} onFocus={() => { setFocusedLeftRow(rowIdx); setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: rowIdx, field: 'customer', id: `${rowIdx}-customer` }) }} onBlur={() => setTimeout(() => { setShowSuggestions({ visible: false, row: null, field: null, id: null }); setFocusedLeftRow(null) }, 150)} />
                                                {showSuggestions.visible && showSuggestions.row === rowIdx && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                                    <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                                        {suggestions.map((s, i) => (
                                                            <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(rowIdx, s, 'customer')}>{s}</div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td style={{ position: 'relative' }}>
                                                <input
                                                    value={it ? it.itemName : ''}
                                                    onChange={(e) => setItemField(rowIdx, 'itemName', e.target.value)}
                                                    onFocus={() => {
                                                        setFocusedLeftRow(rowIdx)
                                                        setSuggestions(getSuggestionPool().slice(0, 8));
                                                        setShowSuggestions({ visible: true, row: rowIdx, field: 'item' })
                                                    }}
                                                    onBlur={() => setTimeout(() => { setShowSuggestions({ visible: false, row: null, field: null }); setFocusedLeftRow(null) }, 150)}
                                                />
                                                {showSuggestions.visible && showSuggestions.row === rowIdx && showSuggestions.field === 'item' && suggestions && suggestions.length ? (
                                                    <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                                        {suggestions.map((s, i) => (
                                                            <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(rowIdx, s)}>{s}</div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </td>
                                            <td>
                                                <input value={it ? it.brand : ''} onChange={(e) => setItemField(rowIdx, 'brand', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                            <td>
                                                <input type="number" value={it ? it.qty : ''} onChange={(e) => setItemField(rowIdx, 'qty', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                            <td>
                                                <input type="number" value={it ? it.rate : ''} onChange={(e) => setItemField(rowIdx, 'rate', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                            <td>
                                                <input type="number" value={it ? (it.discount || 0) : ''} onChange={(e) => setItemField(rowIdx, 'discount', e.target.value)} onFocus={() => setFocusedLeftRow(rowIdx)} onBlur={() => setFocusedLeftRow(null)} /></td>
                                            <td>₹{it ? (it.amount || 0).toFixed(2) : '0.00'}</td>
                                            <td className="row-action-cell">
                                                {(focusedLeftRow === rowIdx || checkedRows[rowIdx]) ? (
                                                    <div className="action-box">
                                                        <button
                                                            type="button"
                                                            className={`row-check btn-mark`}
                                                            onMouseDown={(e) => { e.preventDefault(); setChecked(rowIdx, true) }}
                                                            aria-label={`Mark row ${rowIdx}`}
                                                        >✓</button>
                                                        <button
                                                            type="button"
                                                            className={`row-check btn-unmark ${checkedRows[rowIdx] ? 'active' : ''}`}
                                                            onMouseDown={(e) => { e.preventDefault(); setChecked(rowIdx, false) }}
                                                            aria-label={`Unmark row ${rowIdx}`}
                                                        >❌</button>
                                                    </div>
                                                ) : (
                                                    <span style={{ display: 'inline-block', width: 20, height: 20 }} />
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="right-panel card">
                    <div className="right-header">
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Customer name" value={search.customer} onChange={e => onSearchCustomerInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'customer', id: `search-customer` }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 150)} />
                            {showSuggestions.visible && showSuggestions.row === 'search' && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion('search', s, 'customer')}>{s}</div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Item name" value={search.item} onChange={e => onSearchItemInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('item').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'item', id: `search-item` }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 150)} />
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
                                        {Array.from({ length: 3 }).map((_, i) => {
                                            const rows = filteredTop || stockSummaryData
                                            const it = rows[i] || {}
                                            const empty = isObjectRowEmpty(it, ['item', 'brand', 'total', 'del', 'mum', 'com', 'hyd', 'ahm', 'readyDel', 'readyMum'])
                                            return (
                                                <tr key={`top-${i}`} className={empty ? 'row-empty' : ''}>
                                                    <td>{it.item || ''}</td>
                                                    <td>{it.brand || ''}</td>
                                                    <td>{it.total || ''}</td>
                                                    <td>{it.del || ''}</td>
                                                    <td>{it.mum || ''}</td>
                                                    <td>{it.com || ''}</td>
                                                    <td>{it.hyd || ''}</td>
                                                    <td>{it.ahm || ''}</td>
                                                    <td>{it.readyDel || ''}</td>
                                                    <td>{it.readyMum || ''}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

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
                                            {Array.from({ length: 6 }).map((_, i) => {
                                                const rows = filteredPrice || priceAvailabilityData
                                                const it = rows[i] || {}
                                                const empty = isObjectRowEmpty(it, ['item', 'brand', 'mrp', 'delhi', 'ahm', 'mumbai', 'hyd', 'com'])
                                                return (
                                                    <tr key={`b1-${i}`} className={empty ? 'row-empty' : ''}>
                                                        <td>{it.item || ''}</td>
                                                        <td>{it.brand || ''}</td>
                                                        <td>{it.mrp !== undefined ? `₹${(it.mrp || 0).toFixed(2)}` : ''}</td>
                                                        <td>{it.delhi || ''}</td>
                                                        <td>{it.ahm || ''}</td>
                                                        <td>{it.mumbai || ''}</td>
                                                        <td>{it.hyd || ''}</td>
                                                        <td>{it.com || ''}</td>
                                                    </tr>
                                                )
                                            })}
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
                                            {Array.from({ length: 6 }).map((_, i) => {
                                                const rows = filteredStock || locationStockData
                                                const it = rows[i] || {}
                                                const empty = isObjectRowEmpty(it, ['itemName', 'location', 'stock'])
                                                return (
                                                    <tr key={`b2-${i}`} className={empty ? 'row-empty' : ''}>
                                                        <td>{it.itemName || ''}</td>
                                                        <td>{it.location || ''}</td>
                                                        <td>{it.stock !== undefined ? it.stock : ''}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
            <div className="sales-container">
                <h2>Sales Table</h2>
                <div className="sales-controls">
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Search sales (item / brand)"
                            value={salesFilter.q}
                            onChange={e => onSalesQueryChange(e.target.value)}
                            onFocus={() => { setSuggestions(getSalesSuggestionPool('q').slice(0, 8)); setShowSuggestions({ visible: true, row: 'sales', field: 'q', id: 'sales-q' }) }}
                            onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 150)}
                        />
                        {showSuggestions.visible && showSuggestions.row === 'sales' && showSuggestions.field === 'q' && suggestions && suggestions.length ? (
                            <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                {suggestions.map((s, i) => (
                                    <div key={i} className="suggestion-item" onMouseDown={() => chooseSalesSuggestion('q', s)}>{s}</div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Select Customer"
                            value={salesFilter.customer}
                            onChange={e => onSalesCustomerChange(e.target.value)}
                            onFocus={() => { setSuggestions(getSalesSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: 'sales', field: 'customer', id: 'sales-customer' }) }}
                            onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 150)}
                        />
                        {showSuggestions.visible && showSuggestions.row === 'sales' && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                            <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                {suggestions.map((s, i) => (
                                    <div key={i} className="suggestion-item" onMouseDown={() => chooseSalesSuggestion('customer', s)}>{s}</div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
                <table className="sales-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Item</th>
                            <th>Brand</th>
                            <th>Qty</th>
                            <th>Price (₹)</th>
                            <th>Total (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData
                            .filter(sale => {
                                const matchCustomer = salesFilter.customer ? sale.customerName === salesFilter.customer : true
                                const q = (salesFilter.q || '').trim().toLowerCase()
                                const matchQ = !q || (sale.item || '').toString().toLowerCase().includes(q) || (sale.brand || '').toString().toLowerCase().includes(q)
                                return matchCustomer && matchQ
                            })
                            .map((sale, index) => (
                                <tr key={index}>
                                    <td>{sale.date}</td>
                                    <td>{sale.customerName}</td>
                                    <td>{sale.item}</td>
                                    <td>{sale.brand}</td>
                                    <td>{sale.qty}</td>
                                    <td>{sale.price}</td>
                                    <td className="total">{sale.total}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Enquiry
