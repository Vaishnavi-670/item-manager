import React, { useState, useEffect, useRef } from 'react'
import './Enquiry.css'

// Constants
const NUMERIC_FIELDS = new Set(['qty', 'rate', 'del', 'mum', 'com', 'hyd', 'ahm', 'readyDel', 'readyMum', 'mrp', 'stock', 'discount'])

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

// Helper functions
const calculateAmount = (qty, rate) => +((parseFloat(qty) || 0) * (parseFloat(rate) || 0)).toFixed(2)

const parseNumericValue = (val) => {
    const num = val === '' ? 0 : parseFloat(val)
    return Number.isNaN(num) ? 0 : num
}

const ensureArray = (arr) => Array.isArray(arr) ? arr : []

const Enquiry = () => {
    const [meta, setMeta] = useState({ enqNo: '', date: new Date().toISOString().slice(0, 10), customer: '', contact: '' })
    const [search, setSearch] = useState({ customer: '', item: '', qty: '' })
    const [filteredTop, setFilteredTop] = useState(undefined)
    const [filteredPrice, setFilteredPrice] = useState(undefined)
    const [filteredStock, setFilteredStock] = useState(undefined)
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState({ visible: false, row: null, field: null })
    const searchAppliedRef = useRef(false)
    const ignoreNextClickRef = useRef(false)
    const actionClickRef = useRef(false)

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
        type: 'Enquiry',
    }

    const [items, setItems] = useState(() => [])
    const [draftItems, setDraftItems] = useState([])
    const nextSr = useRef(1)
    const [leftSearch, setLeftSearch] = useState('')
    const [addRow, setAddRow] = useState({ type: 'Enquiry', branch: '', customer: '', itemName: '', brand: '', qty: 0, rate: 0, discount: 0 })

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

    const setItemField = (idx, field, val) => {
        setDraftItems(prev => {
            const copy = ensureArray(prev).map(it => (it ? { ...it } : it))
            while (copy.length <= idx) copy.push(undefined)
            
            const base = copy[idx] || items[idx] || { ...dummyRow, srNo: idx + 1 }
            const newItem = { ...base }
            
            newItem[field] = NUMERIC_FIELDS.has(field) ? parseNumericValue(val) : val
            newItem.amount = calculateAmount(newItem.qty, newItem.rate)
            
            copy[idx] = newItem
            return copy
        })
    }

    const commitRow = (idx) => {
        setItems(prev => {
            const next = ensureArray(prev).map(it => ({ ...it }))
            while (next.length <= idx) next.push({ ...dummyRow, srNo: next.length + 1 })
            
            const src = draftItems[idx] || next[idx] || { ...dummyRow, srNo: idx + 1 }
            const newItem = { ...src }
            
            // Ensure all numeric fields are numbers
            NUMERIC_FIELDS.forEach(f => {
                if (newItem[f] !== undefined) {
                    newItem[f] = newItem[f] === '' ? 0 : Number(newItem[f]) || 0
                }
            })
            
            newItem.amount = calculateAmount(newItem.qty, newItem.rate)
            newItem.srNo = newItem.srNo || (idx + 1)
            next[idx] = newItem
            return next
        })
        
        setDraftItems(prev => {
            const copy = ensureArray(prev).slice()
            if (copy.length > idx) copy[idx] = undefined
            return copy
        })
    }

    const discardRow = (idx) => {
        setDraftItems(prev => {
            const copy = ensureArray(prev).slice()
            if (copy.length > idx) copy[idx] = undefined
            return copy
        })
    }

    const discardAt = (idx) => {
        const { row, field } = focusedField
        
        if (!field || row !== idx) {
            return discardRow(idx)
        }
        
        setDraftItems(prev => {
            const copy = ensureArray(prev).map(it => (it ? { ...it } : it))
            if (!copy[idx]) return copy
            
            const original = items[idx] || { ...dummyRow, srNo: items[idx]?.srNo || (idx + 1) }
            copy[idx][field] = original[field]
            
            if (field === 'qty' || field === 'rate') {
                copy[idx].amount = calculateAmount(copy[idx].qty, copy[idx].rate)
            }
            return copy
        })
    }

    const getSuggestionPool = (type = 'item') => {
        const pool = new Set()
        
        if (type === 'item') {
            [
                ...items.map(it => it.itemName),
                ...stockSummaryData.map(it => it.item),
                ...priceAvailabilityData.map(it => it.item),
                ...locationStockData.map(it => it.itemName)
            ].filter(Boolean).forEach(item => pool.add(item))
        } else if (type === 'customer') {
            items.forEach(it => { if (it.customer) pool.add(it.customer) })
            if (meta?.customer) pool.add(meta.customer)
            
            try {
                const customers = JSON.parse(localStorage.getItem('customers') || '[]')
                customers.forEach(c => {
                    const name = c?.['Customer Name'] || c?.name || c?.customerName || c?.fullName || c?.customer
                    if (name) pool.add(name)
                })
            } catch (err) { }
        }
        return Array.from(pool)
    }

    const getSalesSuggestionPool = (type = 'q') => {
        const pool = new Set()
        
        if (type === 'q') {
            salesData.forEach(s => {
                if (s.item) pool.add(s.item)
                if (s.brand) pool.add(s.brand)
            })
        } else if (type === 'customer') {
            salesData.forEach(s => { if (s.customerName) pool.add(s.customerName) })
            
            try {
                const customers = JSON.parse(localStorage.getItem('customers') || '[]')
                customers.forEach(c => {
                    const name = c?.['Customer Name'] || c?.name || c?.customerName || c?.fullName || c?.customer
                    if (name) pool.add(name)
                })
            } catch (err) { }
        }
        return Array.from(pool)
    }

    const showFilteredSuggestions = (pool, query, row, field) => {
        const q = (query || '').toString().trim().toLowerCase()
        const filtered = q ? pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8) : pool.slice(0, 8)
        setSuggestions(filtered)
        setShowSuggestions({ visible: true, row, field, id: `${row}-${field}` })
    }

    const onSalesQueryChange = (val) => {
        setSalesFilter(s => ({ ...s, q: val }))
        showFilteredSuggestions(getSalesSuggestionPool('q'), val, 'sales', 'q')
    }

    const onSalesCustomerChange = (val) => {
        setSalesFilter(s => ({ ...s, customer: val }))
        showFilteredSuggestions(getSalesSuggestionPool('customer'), val, 'sales', 'customer')
    }
    

    const chooseSalesSuggestion = (field, val) => {
        if (field === 'q') setSalesFilter(s => ({ ...s, q: val }))
        else if (field === 'customer') setSalesFilter(s => ({ ...s, customer: val }))
        setShowSuggestions({ visible: false, row: null, field: null })
    }

    function getCustomerPool() {
        return Array.from(
            new Set([
                ...salesData.map(s => s.customerName),
                ...(meta.customer ? [meta.customer] : [])
            ])
        );
    }
    function getItemPool() {
        return Array.from(
            new Set([
                ...stockSummaryData.map(it => it.item),
                ...priceAvailabilityData.map(it => it.item),
                ...locationStockData.map(it => it.itemName),
                ...salesData.map(s => s.item)
            ])
        );
    }

    function onAddRowInputChange(field, value) {
        setAddRow(r => ({ ...r, [field]: value }));

        let pool = [];
        if (field === "customer") pool = getCustomerPool();
        else if (field === "itemName") pool = getItemPool();

        const filtered = pool.filter(
            (x) => x && x.toLowerCase().includes((value || '').toLowerCase())
        ).slice(0, 8);
        setSuggestions(filtered);
        setShowSuggestions({ visible: true, row: "add", field });
    }

    const onSearchCustomerInputChange = (val) => {
        setSearch(s => ({ ...s, customer: val }))
        showFilteredSuggestions(getSuggestionPool('customer'), val, 'search', 'customer')
    }

    const onSearchItemInputChange = (val) => {
        setSearch(s => ({ ...s, item: val }))
        showFilteredSuggestions(getSuggestionPool('item'), val, 'search', 'item')
    }

    const chooseSuggestion = (row, val, field = 'item') => {
        if (field === 'item') {
            if (row === 'search') {
                setSearch(s => ({ ...s, item: val }))
            } else {
                setItemField(row, 'itemName', val)
            }
        } else if (field === 'customer') {
            if (row === 'search') {
                setSearch(s => ({ ...s, customer: val }))
            } else {
                setItemField(row, 'customer', val)
            }
        }
        setShowSuggestions({ visible: false, row: null, field: null })
    }

    const handleSearch = () => {
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
        searchAppliedRef.current = true
        ignoreNextClickRef.current = true
    }

    useEffect(() => {
        const onKey = (e) => {
            if (!searchAppliedRef.current) return
            setFilteredTop(undefined)
            setFilteredPrice(undefined)
            setFilteredStock(undefined)
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

    // consider a left-table row "empty" if nothing meaningful is filled
    const isLeftRowEmpty = (row) => {
        if (!row) return true
        const strEmpty = (v) => !v || (typeof v === 'string' && v.trim() === '')
        const numZero = (v) => Number(v || 0) === 0
        const hasText = !strEmpty(row.customer) || !strEmpty(row.itemName) || !strEmpty(row.brand) || !strEmpty(row.branch)
        const hasNumbers = !numZero(row.qty) || !numZero(row.rate) || !numZero(row.discount)
        // ignore type and amount for emptiness; 'Enquiry' default shouldn't make it non-empty
        return !(hasText || hasNumbers)
    }

    // Helper to update addRow state
    const setAddField = (field, val) => {
        setAddRow(prev => {
            const next = { ...prev }
            const numericFields = new Set(['qty', 'rate', 'discount'])
            if (numericFields.has(field)) {
                const num = val === '' ? 0 : parseFloat(val)
                next[field] = Number.isNaN(num) ? 0 : num
            } else {
                next[field] = val
            }
            return next
        })
    }

    // Helper to add new row from addRow state
    const addNewRow = () => {
        // Basic validation
        if (!addRow.customer || !addRow.itemName) {
            alert('Please fill customer and item name')
            return
        }
        const newItem = {
            ...addRow,
            srNo: nextSr.current++,
            amount: +((Number(addRow.qty) || 0) * (Number(addRow.rate) || 0)).toFixed(2)
        }
        setItems(prev => [...prev, newItem])
        setAddRow({ type: 'Enquiry', branch: '', customer: '', itemName: '', brand: '', qty: 0, rate: 0, discount: 0 })
    }

    // focused row state for left table — index of the row currently focused, or null
    const [focusedLeftRow, setFocusedLeftRow] = useState(null)
    const [focusedField, setFocusedField] = useState({ row: null, field: null })

    // sales table filters (inline controls)
    const [salesFilter, setSalesFilter] = useState({ q: '', customer: '' })

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
                    <div className="table-scroll">
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
                                    <th className="actions-col"></th>
                                </tr>
                            </thead>

                            <tbody>
                                {Array.from({ length: items.length }).map((_, visRowIdx) => {
                                    // Get all non-empty items
                                    const nonEmptyItems = leftSearch
                                        ? items.filter(it => (it.customer || '').toString().toLowerCase().includes((leftSearch || '').toLowerCase()))
                                        : items.filter((it, i) => !isLeftRowEmpty(draftItems[i] ?? it ?? null));

                                    // Get the item for this visible row
                                    const itemData = nonEmptyItems[visRowIdx];
                                    const origIdx = itemData ? items.indexOf(itemData) : -1;
                                    const row = origIdx >= 0 ? (draftItems[origIdx] ?? items[origIdx] ?? null) : null;
                                    const isEmpty = !row || isLeftRowEmpty(row);

                                    return (
                                        <tr
                                            key={row ? (row.srNo || origIdx) : `empty-${visRowIdx}`}
                                            className={`${focusedLeftRow === visRowIdx ? 'row-focused' : ''} ${isEmpty ? 'row-empty' : ''}`.trim()}
                                            onFocus={() => !isEmpty && setFocusedLeftRow(visRowIdx)}
                                            onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null); setTimeout(() => setFocusedField({ row: null, field: null }), 200) }}
                                            tabIndex={isEmpty ? -1 : -1}
                                        >
                                            <td>
                                                {!isEmpty ? (
                                                    <select
                                                        value={row ? (row.type || 'Enquiry') : 'Enquiry'}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'type', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'type' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    >
                                                        <option>Enquiry</option>
                                                        <option>Order</option>
                                                    </select>
                                                ) : null}
                                            </td>
                                            <td>
                                                {!isEmpty ? (
                                                    <input
                                                        value={row ? (row.branch || '') : ''}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'branch', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'branch' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    />
                                                ) : null}
                                            </td>
                                            <td style={{ position: 'relative' }}>
                                                {!isEmpty ? (
                                                    <>
                                                        <input
                                                            value={row ? (row.customer || '') : ''}
                                                            onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'customer', e.target.value)}
                                                            onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'customer' }); setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: origIdx, field: 'customer', id: `${origIdx}-customer` }) }}
                                                            onBlur={() => setTimeout(() => { setShowSuggestions({ visible: false, row: null, field: null, id: null }); if (!actionClickRef.current) setFocusedLeftRow(null) }, 150)}
                                                        />
                                                        {showSuggestions.visible && showSuggestions.row === origIdx && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                                            <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                                                {suggestions.map((s, i) => (
                                                                    <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(origIdx, s, 'customer')}>{s}</div>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                    </>
                                                ) : null}
                                            </td>
                                            <td style={{ position: 'relative' }}>
                                                {!isEmpty ? (
                                                    <>
                                                        <input
                                                            value={row ? row.itemName : ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value
                                                                origIdx >= 0 && setItemField(origIdx, 'itemName', val)
                                                                const pool = getSuggestionPool('item')
                                                                const q = (val || '').toString().trim().toLowerCase()
                                                                const list = q ? pool.filter(p => p.toLowerCase().includes(q)).slice(0, 8) : pool.slice(0, 8)
                                                                setSuggestions(list)
                                                                setShowSuggestions({ visible: true, row: origIdx, field: 'item' })
                                                            }}
                                                            onFocus={() => {
                                                                setFocusedLeftRow(visRowIdx)
                                                                setFocusedField({ row: origIdx, field: 'itemName' })
                                                                setSuggestions(getSuggestionPool('item').slice(0, 8))
                                                                setShowSuggestions({ visible: true, row: origIdx, field: 'item' })
                                                            }}
                                                            onBlur={() => setTimeout(() => { setShowSuggestions({ visible: false, row: null, field: null }); if (!actionClickRef.current) setFocusedLeftRow(null) }, 200)}
                                                        />
                                                        {showSuggestions.visible && showSuggestions.row === origIdx && showSuggestions.field === 'item' && suggestions && suggestions.length ? (
                                                            <div className="suggestions-list" style={{ position: 'absolute', zIndex: 40 }}>
                                                                {suggestions.map((s, i) => (
                                                                    <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion(origIdx, s)}>{s}</div>
                                                                ))}
                                                            </div>
                                                        ) : null}
                                                    </>
                                                ) : null}
                                            </td>
                                            <td>
                                                {!isEmpty ? (
                                                    <input
                                                        value={row ? row.brand : ''}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'brand', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'brand' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    />
                                                ) : null}
                                            </td>
                                            <td>
                                                {!isEmpty ? (
                                                    <input
                                                        type="number"
                                                        value={row ? row.qty : ''}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'qty', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'qty' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    />
                                                ) : null}
                                            </td>
                                            <td>
                                                {!isEmpty ? (
                                                    <input
                                                        type="number"
                                                        value={row ? row.rate : ''}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'rate', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'rate' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    />
                                                ) : null}
                                            </td>
                                            <td>
                                                {!isEmpty ? (
                                                    <input
                                                        type="number"
                                                        value={row ? (row.discount || 0) : ''}
                                                        onChange={(e) => origIdx >= 0 && setItemField(origIdx, 'discount', e.target.value)}
                                                        onFocus={() => { setFocusedLeftRow(visRowIdx); setFocusedField({ row: origIdx, field: 'discount' }) }}
                                                        onBlur={() => { if (!actionClickRef.current) setFocusedLeftRow(null) }}
                                                    />
                                                ) : null}
                                            </td>
                                            <td>{!isEmpty && row ? `₹${(row.amount || 0).toFixed(2)}` : ''}</td>
                                            <td className="row-action-cell">
                                                {!isEmpty && focusedLeftRow === visRowIdx ? (
                                                    <div className="action-box">
                                                        <button
                                                            type="button"
                                                            className={`row-check btn-mark`}
                                                            onMouseDown={(e) => { e.preventDefault(); actionClickRef.current = true; commitRow(origIdx); setFocusedField({ row: null, field: null }); setFocusedLeftRow(null); setTimeout(() => { actionClickRef.current = false }, 0) }}
                                                            aria-label={`Mark row ${visRowIdx}`}
                                                        >✓</button>
                                                        <button
                                                            type="button"
                                                            className={`row-check btn-unmark`}
                                                            onMouseDown={(e) => { e.preventDefault(); actionClickRef.current = true; discardAt(origIdx); setFocusedField({ row: null, field: null }); setFocusedLeftRow(null); setTimeout(() => { actionClickRef.current = false }, 0) }}
                                                            aria-label={`Unmark row ${visRowIdx}`}
                                                        >❌</button>
                                                    </div>
                                                ) : null}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Fixed Add Row - stays at bottom with high z-index */}
                    <div className="fixed-add-row">
                        <table className="enquiry-table add-row-table">
                            <tbody>
                                <tr>
                                    <td>
                                        <select
                                            value={addRow.type}
                                            onChange={(e) => setAddField("type", e.target.value)}
                                        >
                                            <option>Enquiry</option>
                                            <option>Order</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Branch"
                                            value={addRow.branch}
                                            onChange={(e) => setAddField("branch", e.target.value)}
                                        />
                                    </td>
                                    

                                    <td style={{ position: "relative" }}>
                                        <input
                                            placeholder="Customer"
                                            value={addRow.customer}
                                            onChange={(e) => onAddRowInputChange("customer", e.target.value)}
                                            onFocus={() => {
                                                const pool = getCustomerPool();
                                                setSuggestions(pool.slice(0, 8));
                                                setShowSuggestions({ visible: true, row: "add", field: "customer" });
                                            }}
                                            onBlur={() =>
                                                setTimeout(() =>
                                                    setShowSuggestions({ visible: false, row: null, field: null }),
                                                    200
                                                )
                                            }
                                        />
                                        {showSuggestions.visible &&
                                            showSuggestions.row === "add" &&
                                            showSuggestions.field === "customer" &&
                                            suggestions.length > 0 && (
                                                <div className="suggestions-list" style={{ position: "absolute", zIndex: 40 }}>
                                                    {suggestions.map((s, i) => (
                                                        <div
                                                            key={i}
                                                            className="suggestion-item"
                                                            onMouseDown={() => chooseSuggestion("add", s, "customer")}
                                                        >
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </td>

                                    <td style={{ position: "relative" }}>
                                        <input
                                            placeholder="Item Name"
                                            value={addRow.itemName}
                                            onChange={(e) => onAddRowInputChange("itemName", e.target.value)}
                                            onFocus={() => {
                                                const pool = getItemPool();
                                                setSuggestions(pool.slice(0, 8));
                                                setShowSuggestions({ visible: true, row: "add", field: "itemName" });
                                            }}
                                            onBlur={() =>
                                                setTimeout(() =>
                                                    setShowSuggestions({ visible: false, row: null, field: null }),
                                                    200
                                                )
                                            }
                                        />
                                        {showSuggestions.visible &&
                                            showSuggestions.row === "add" &&
                                            showSuggestions.field === "itemName" &&
                                            suggestions.length > 0 && (
                                                <div className="suggestions-list" style={{ position: "absolute", zIndex: 40 }}>
                                                    {suggestions.map((s, i) => (
                                                        <div
                                                            key={i}
                                                            className="suggestion-item"
                                                            onMouseDown={() => chooseSuggestion("add", s, "itemName")}
                                                        >
                                                            {s}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                    </td>

                                    <td>
                                        <input
                                            placeholder="Brand"
                                            value={addRow.brand}
                                            onChange={(e) => setAddField("brand", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Qty"
                                            type="number"
                                            value={addRow.qty || ""}
                                            onChange={(e) => setAddField("qty", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Rate"
                                            type="number"
                                            value={addRow.rate || ""}
                                            onChange={(e) => setAddField("rate", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            placeholder="Disc"
                                            type="number"
                                            value={addRow.discount || ""}
                                            onChange={(e) => setAddField("discount", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        ₹
                                        {(
                                            +(
                                                (Number(addRow.qty) || 0) * (Number(addRow.rate) || 0)
                                            ).toFixed(2)
                                        ).toFixed(2)}
                                    </td>
                                    <td className="row-action-cell">
                                        <button className="primary add-btn" onClick={addNewRow}>
                                            Add
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right-panel card">
                    <div className="right-header">
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Customer name" value={search.customer} onChange={e => onSearchCustomerInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('customer').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'customer', id: `search-customer` }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 200)} />
                            {showSuggestions.visible && showSuggestions.row === 'search' && showSuggestions.field === 'customer' && suggestions && suggestions.length ? (
                                <div className="suggestions-list" style={{ position: 'absolute', zIndex: 10000 }}>
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="suggestion-item" onMouseDown={() => chooseSuggestion('search', s, 'customer')}>{s}</div>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input className="right-search" placeholder="Item name" value={search.item} onChange={e => onSearchItemInputChange(e.target.value)} onFocus={() => { setSuggestions(getSuggestionPool('item').slice(0, 8)); setShowSuggestions({ visible: true, row: 'search', field: 'item', id: `search-item` }) }} onBlur={() => setTimeout(() => setShowSuggestions({ visible: false, row: null, field: null, id: null }), 200)} />
                            {showSuggestions.visible && showSuggestions.row === 'search' && showSuggestions.field === 'item' && suggestions && suggestions.length ? (
                                <div className="suggestions-list" style={{ position: 'absolute', zIndex: 10000 }}>
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
                <h2>💰Sales Table</h2>
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