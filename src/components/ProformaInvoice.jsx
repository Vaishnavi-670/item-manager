import React, { useEffect, useState } from "react";
import "./ProformaInvoice.css";
import companyLogo from "../assets/bt logo.jpg";
import html2pdf from "html2pdf.js";


const ProformaInvoice = () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const initialData = {
        company: {
            name: "Bearing Traders India Pvt. Ltd.",
            address: "5225, Above ICICI Bank, Ajmeri Gate, New Delhi - 110006",
            logo: "",
            phone: "011-23215397",
            website: "www.btipl.in",
            email: "info@btipl.in",
            gst: "07AAACB4970D1ZY",
        },
        buyer: {
            name: "",
            address: "",
            gst: "",
            phone: "",
            email: "",
            contactPerson: "",
            salesPerson: "",
        },

        invoice: {
            number: "",
            date: today,
            refNo: "",
            preparedBy: "",
            freight: 0,
            insurance: 0,
            cd: "",
            cdMode: "%",
            deliveryStatus: "",
            paymentTerms: "",
            validity: "",
            amountInWords: "",
        },
        items: [
            {
                srNo: 1,
                cpn: "2311SKC3",
                partNo: "2311SKC3",
                hsn: "84821012",
                make: "NTN",
                delivery: "Ready",
                rate: 3582.15,
                qty: 1,
                discount: 0,
                netRate: 3582.15,
                amount: 3582.15,
            },
        ],
    };

    const [company, setCompany] = useState(initialData.company);
    const [buyer, setBuyer] = useState(initialData.buyer);
    const [invoice, setInvoice] = useState(initialData.invoice);
    const [customers, setCustomers] = useState([]);
    const [itemMasterList, setItemMasterList] = useState([]); // items saved elsewhere in the app
    const [itemNameSuggestions, setItemNameSuggestions] = useState([]);
    const [showItemNameSuggestionsIndex, setShowItemNameSuggestionsIndex] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [contactOptions, setContactOptions] = useState([]);
    const [selectedCustomerName, setSelectedCustomerName] = useState("");
    const [buyerLocked, setBuyerLocked] = useState(false);
    const [items, setItems] = useState(() => {
        const base = Array.isArray(initialData.items) ? [...initialData.items] : [];
        while (base.length < 5) {
            base.push({
                srNo: base.length + 1,
                cpn: "",
                partNo: "",
                hsn: "",
                make: "",
                delivery: "",
                rate: 0,
                qty: 0,
                discount: 0,
                netRate: 0,
                amount: 0,
            });
        }
        return base.map((it, idx) => ({ ...it, srNo: idx + 1 }));
    });
    const [rowsToAdd, setRowsToAdd] = useState(1);

    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem("customers") || "null");
            if (Array.isArray(saved) && saved.length) setCustomers(saved);
            // load global items (if present)
            const savedItems = JSON.parse(localStorage.getItem('items') || '[]');
            if (Array.isArray(savedItems) && savedItems.length) setItemMasterList(savedItems);
        } catch (e) {
            // ignore
        }
    }, []);

    // when user types in item name cell, show suggestions from itemMasterList
    const handleItemNameInput = (index, value) => {
        updateItem(index, 'partNo', value);
        if (!value || value.trim().length === 0) {
            setItemNameSuggestions([]);
            setShowItemNameSuggestionsIndex(null);
            return;
        }
        const q = value.trim().toLowerCase();
        const matches = itemMasterList
            .filter(it => ((it.itemName || it.name || '') + '').toLowerCase().includes(q))
            .slice(0, 8);
        setItemNameSuggestions(matches);
        setShowItemNameSuggestionsIndex(matches.length ? index : null);
    };

    const chooseItemName = (index, itm) => {
        if (!itm) return;
        // fill several fields where possible
        const newItems = items.map(it => ({ ...it }));
        newItems[index].partNo = itm.itemName || itm.name || '';
        if (itm.brand) newItems[index].make = itm.brand;
        if (itm.mrp) newItems[index].rate = parseFloat(itm.mrp) || newItems[index].rate;
        // recompute netRate/amount
        const rate = parseFloat(newItems[index].rate) || 0;
        const qty = parseFloat(newItems[index].qty) || 0;
        const discount = parseFloat(newItems[index].discount) || 0;
        newItems[index].netRate = +(rate * (1 - discount / 100)).toFixed(2);
        newItems[index].amount = +(newItems[index].netRate * qty).toFixed(2);
        setItems(newItems);
        setItemNameSuggestions([]);
        setShowItemNameSuggestionsIndex(null);
    };

    const onBuyerChange = (field, value) => setBuyer((p) => ({ ...p, [field]: value }));
    const onInvoiceChange = (field, value) => setInvoice((p) => ({ ...p, [field]: value }));

    const handleNameInput = (value) => {
        onBuyerChange("name", value);
        if (!value || value.trim().length === 0) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const q = value.trim().toLowerCase();
        const matches = customers
            .filter((c) => ((c["Customer Name"] || "") + "").toLowerCase().includes(q))
            .slice(0, 8);
        setSuggestions(matches);
        setShowSuggestions(matches.length > 0);
    };

    // When the user clicks a customer suggestion, prepare contact options for it
    const chooseCustomerName = (c) => {
        const custName = c["Customer Name"] || "";
        onBuyerChange("name", custName);
        const opts = customers
            .filter((cust) => ((cust["Customer Name"] || "") === custName))
            .map((cust) => ({ contact: (cust["Contact Person Name"] || cust["Contact Person"] || "").trim(), record: cust }))
            .filter((o) => o.contact);
        setContactOptions(opts);
        setSelectedCustomerName(custName);
        setShowSuggestions(false);
        setBuyerLocked(false);
    };

    // On choosing a contact person, fill buyer fields and lock them
    const chooseContactPerson = (contactName) => {
        if (!selectedCustomerName) return;
        const rec = customers.find((cust) => ((cust["Customer Name"] || "") === selectedCustomerName)
            && ((cust["Contact Person Name"] || cust["Contact Person"] || "") === contactName));
        if (!rec) return;
        const mapped = {
            name: rec["Customer Name"] || "",
            address: rec["Office Address"] || rec["Address"] || "",
            gst: rec["GST"] || "",
            phone: rec["Number"] || rec["Phone"] || "",
            email: rec["Email"] || "",
            contactPerson: rec["Contact Person Name"] || rec["Contact Person"] || "",
            salesPerson: rec["Sales Person"] || rec["salesperson"] || "",
        };
        setBuyer((p) => ({ ...p, ...mapped }));
        setContactOptions([]);
        setSelectedCustomerName("");
        setBuyerLocked(true);
    };

    const updateItem = (index, field, rawValue) => {
        const newItems = items.map((it) => ({ ...it }));
        let value = rawValue;
        if (field === "rate" || field === "qty" || field === "discount") {
            value = rawValue === "" ? 0 : parseFloat(rawValue);
            if (Number.isNaN(value)) value = 0;
        }
        newItems[index][field] = value;
        const rate = parseFloat(newItems[index].rate) || 0;
        const qty = parseFloat(newItems[index].qty) || 0;
        const discount = parseFloat(newItems[index].discount) || 0;
        const netRate = +(rate * (1 - discount / 100)).toFixed(2);
        const amount = +(netRate * qty).toFixed(2);
        newItems[index].netRate = netRate;
        newItems[index].amount = amount;
        newItems.forEach((it, i) => (it.srNo = i + 1));
        setItems(newItems);
    };

    const addRows = (n) => {
        const count = Math.max(0, parseInt(n || 0, 10));
        if (!count) return;
        const newItems = [...items];
        for (let i = 0; i < count; i++) {
            newItems.push({
                srNo: newItems.length + 1,
                cpn: "",
                partNo: "",
                hsn: "",
                make: "",
                delivery: "",
                rate: 0,
                qty: 0,
                discount: 0,
                netRate: 0,
                amount: 0,
            });
        }
        setItems(newItems);
    };

    // Upload handler: accepts CSV or XLSX and maps columns to invoice items
    const handleFileUpload = async (file) => {
        if (!file) return;
        const name = file.name.toLowerCase();
        const text = await file.text();

        // Helper to normalize header names to keys we expect
        const normalize = (s) => (s || "").toString().trim().toLowerCase();

        // Try using SheetJS if available (xlsx). Fallback to CSV parsing.
        try {
            let rows = [];
            if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
                // dynamic import so we don't force dependency unless used
                const xlsx = await import('xlsx');
                const wb = xlsx.read(await file.arrayBuffer());
                const firstSheet = wb.Sheets[wb.SheetNames[0]];
                rows = xlsx.utils.sheet_to_json(firstSheet, { defval: '' });
            } else {
                // parse CSV simple: first line headers, split by comma
                const lines = text.split(/\r?\n/).filter(Boolean);
                const headers = lines[0].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(h => h.replace(/^"|"$/g, '').trim());
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
                    const obj = {};
                    headers.forEach((h, idx) => obj[h] = cols[idx] || '');
                    rows.push(obj);
                }
            }

            if (!rows || !rows.length) return;

            // map rows to items expected shape
            const mapKey = (k) => normalize(k).replace(/\s+/g, '');
            const mapped = rows.map((r, i) => {
                const keys = Object.keys(r || {});
                const lookup = {};
                keys.forEach(k => lookup[mapKey(k)] = r[k]);

                const toNum = (v) => {
                    if (v === null || v === undefined || v === '') return 0;
                    const n = parseFloat((v + '').toString().replace(/[^0-9.-]+/g, ''));
                    return Number.isNaN(n) ? 0 : n;
                };

                // item code / product code
                const cpn = lookup['cpn'] || lookup['productcode'] || lookup['sku'] || lookup['code'] || '';
                // item name — accept many header variants including 'Item Name', 'Name', 'Item'
                const partNo = lookup['partno'] || lookup['part'] || lookup['partnumber'] || lookup['itemname'] || lookup['item'] || lookup['name'] || '';
                const hsn = lookup['hsn'] || lookup['hsncode'] || lookup['hsnno'];
                const make = lookup['make'] || lookup['brand'] || '';
                const delivery = lookup['delivery'] || lookup['deliverystatus'] || '';
                const rate = toNum(lookup['rate'] || lookup['price'] || lookup['amountperunit']);
                const qty = toNum(lookup['qty'] || lookup['quantity'] || lookup['q'] || lookup['pcs']);
                const discount = toNum(lookup['dis(%)'] || lookup['discount'] || lookup['dispercent'] || lookup['dis']);
                const netRate = +(rate * (1 - (discount || 0) / 100)).toFixed(2);
                const amount = +(netRate * qty).toFixed(2);

                return {
                    srNo: i + 1,
                    cpn: cpn || '',
                    partNo: partNo || '',
                    hsn: hsn || '',
                    make,
                    delivery,
                    rate: +(rate || 0),
                    qty: +(qty || 0),
                    discount: +(discount || 0),
                    netRate,
                    amount,
                };
            });

            // Replace items with mapped rows (or append if you prefer)
            setItems(mapped);
        } catch (err) {
            console.error('Failed to parse uploaded file. Make sure it is CSV or XLSX.', err);
            alert('Failed to parse uploaded file. If you want XLSX support, install the `xlsx` package: npm install xlsx');
        }
    };

    const subtotal = items.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
    const freight = parseFloat(invoice.freight) || 0;
    const insurance = parseFloat(invoice.insurance) || 0;
    const cdInput = invoice.cd === "" ? 0 : parseFloat(invoice.cd) || 0;
    const cdAmount = invoice.cdMode === "%" ? +(subtotal * cdInput / 100).toFixed(2) : +cdInput.toFixed(2);
    const taxable = +(Math.max(0, subtotal - cdAmount)).toFixed(2);
    const gst = +(taxable * 0.18).toFixed(2);
    const grand = +(taxable + freight + insurance + gst).toFixed(2);

    // Helper: convert number to words (Indian system) - supports up to crores
    const numberToWords = (num) => {
        if (isNaN(num)) return "";
        const n = Math.floor(num);
        const paise = Math.round((num - n) * 100);
        if (n === 0 && paise === 0) return "Zero Rupees";

        const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
        const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

        const numToWordsBelowThousand = (n) => {
            let str = "";
            if (n >= 100) {
                str += ones[Math.floor(n / 100)] + " Hundred";
                n = n % 100;
                if (n) str += " ";
            }
            if (n >= 20) {
                str += tens[Math.floor(n / 10)];
                if (n % 10) str += " " + ones[n % 10];
            } else if (n > 0) {
                str += ones[n];
            }
            return str;
        };

        const parts = [];
        const crore = Math.floor(n / 10000000);
        if (crore) {
            parts.push(numToWordsBelowThousand(crore) + " Crore");
        }
        const lakh = Math.floor((n % 10000000) / 100000);
        if (lakh) parts.push(numToWordsBelowThousand(lakh) + " Lakh");
        const thousand = Math.floor((n % 100000) / 1000);
        if (thousand) parts.push(numToWordsBelowThousand(thousand) + " Thousand");
        const remainder = n % 1000;
        if (remainder) parts.push(numToWordsBelowThousand(remainder));

        let words = parts.join(" ");
        if (!words) words = "Zero";
        words = words + " Rupees";
        if (paise) {
            const paiseWords = numToWordsBelowThousand(paise);
            words += " and " + paiseWords + " Paise";
        }
        words += " Only";
        return words;
    };

    // Auto-update amountInWords whenever grand changes
    useEffect(() => {
        const words = numberToWords(grand);
        setInvoice((p) => ({ ...p, amountInWords: words }));
    }, [grand]);

    const handleSendInvoice = () => {
        // Build payload containing all invoice data and computed totals
        try {
            const payload = {
                company,
                buyer,
                invoice: { ...invoice },
                items: items.map((it) => ({ ...it })),
                totals: {
                    subtotal: +subtotal.toFixed(2),
                    cdAmount: +cdAmount.toFixed(2),
                    taxable: +taxable.toFixed(2),
                    gst: +gst.toFixed(2),
                    freight: +freight.toFixed(2),
                    insurance: +insurance.toFixed(2),
                    grand: +grand.toFixed(2),
                },
                sentAt: new Date().toISOString(),
            };

            // Read existing saved proformas (if any)
            const key = "sentProformas";
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            existing.push(payload);
            localStorage.setItem(key, JSON.stringify(existing));

            console.log("Proforma saved to localStorage:", payload);
        } catch (err) {
            console.error("Failed to save proforma:", err);
        }
    }



const handleDownloadPdf = () => {
    const element = document.querySelector(".proforma-container");

    // Hide Add Rows section, Download button, and CD row if CD = 0
    const hiddenElements = document.querySelectorAll(".add-row-wrapper, #download-pdf-btn, .cd-row, #send-btn");
    hiddenElements.forEach(el => {
        if (el.classList.contains("cd-row")) {
            el.style.display = parseFloat(cdAmount) === 0 ? "none" : "";
        } else {
            el.style.display = "none";
        }
    });

    // Temporarily remove input borders for PDF export
    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach(el => {
        el.setAttribute("data-old-border", el.style.border || "");
        el.style.border = "none";
        el.style.outline = "none";
        el.style.background = "transparent";
    });

    const options = {
        margin: 0.5,
        filename: `Proforma_Invoice_${invoice.number || "BTIPL"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };

    html2pdf()
        .set(options)
        .from(element)
        .save()
        .then(() => {
            // Restore hidden elements
            hiddenElements.forEach(el => (el.style.display = ""));
            inputs.forEach(el => {
                el.style.border = el.getAttribute("data-old-border");
                el.removeAttribute("data-old-border");
                el.style.background = "";
            });
        });
};




    return (
        <div className="proforma-root">
            <div className="proforma-container">
                <div className="document-heading">Proforma Invoice</div>

                <header className="invoice-header">
                    <div className="invoice-header-inner">
                        <div className="logo-wrap">
                            <img src={companyLogo} alt="Company logo" className="company-logo" />
                        </div>
                        <div className="company-info">
                            <div className="company-name">{company.name}</div>
                            <div className="company-meta">
                                <div className="company-address">{company.address}</div>
                                <div className="company-contact">
                                    Phone: {company.phone} | Email: <span className="link">{company.email}</span>
                                </div>
                                <div className="company-gst">Website: {company.website} | GST No: <strong>{company.gst}</strong></div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* totals moved below the items table */}

                <section className="invoice-details">
                    <div className="row top-row">
                        <div className="col left-col card">
                            <h2>Buyer</h2>
                            <div className="form-row stacked">
                                <label className="input-label">Buyer</label>
                                <input
                                    className="form-input"
                                    id="buyer-name-input"
                                    value={buyer.name}
                                    onChange={(e) => handleNameInput(e.target.value)}
                                    readOnly={buyerLocked}
                                    onFocus={() => {
                                        if (suggestions.length) setShowSuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="suggestions-list">
                                        {suggestions.map((c, idx) => (
                                            <div key={idx} className="suggestion-item" onMouseDown={() => chooseCustomerName(c)}>
                                                <div className="s-name">{c["Customer Name"]}</div>
                                                <div className="s-meta">{(c["Office Address"] || c["Address"] || "")}
                                                    {c["Contact Person Name"] ? ` • ${c["Contact Person Name"]}` : ""}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {contactOptions && contactOptions.length > 0 && (
                                <div className="form-row">
                                    <label className="input-label">Contact Person</label>
                                    <select className="form-input" onChange={(e) => chooseContactPerson(e.target.value)}>
                                        <option value="">-- Select contact --</option>
                                        {contactOptions.map((o, i) => (
                                            <option key={i} value={o.contact}>{o.contact}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        <div className="col right-col card">
                            <h2>Invoice</h2>
                            <div className="form-row small">
                                <label>PI No:</label>
                                <input className="form-input small-input" value={invoice.number} onChange={(e) => onInvoiceChange("number", e.target.value)} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row small">
                                <label>Date:</label>
                                <input type="date" max={new Date().toISOString().slice(0, 10)} className="form-input small-input" value={invoice.date} onChange={(e) => onInvoiceChange("date", e.target.value)} disabled={!buyerLocked} />
                            </div>
                        </div>
                    </div>

                    <div className="row bottom-row">
                        <div className="col col-3 card">
                            <h3 style={{ marginTop: 0 }}>Contact</h3>
                            <div className="form-row">
                                <label className="input-label">Address</label>
                                <textarea className="form-input address-textarea" value={buyer.address} onChange={(e) => onBuyerChange("address", e.target.value)} readOnly={buyerLocked} disabled={!buyerLocked} />
                            </div>

                            <div className="form-row">
                                <label className="input-label">Contact Person Name</label>
                                <input className="form-input" id="contact-person-input" value={buyer.contactPerson} onChange={(e) => onBuyerChange("contactPerson", e.target.value)} readOnly={buyerLocked} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row">
                                <label className="input-label">Email</label>
                                <input className="form-input" value={buyer.email} onChange={(e) => onBuyerChange("email", e.target.value)} readOnly={buyerLocked} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row">
                                <label className="input-label">State</label>
                                <input className="form-input" value={buyer.state || ""} onChange={(e) => onBuyerChange("state", e.target.value)} readOnly={buyerLocked} disabled={!buyerLocked} />
                            </div>
                        </div>

                        <div className="col col-3 card">
                            <h3 style={{ marginTop: 0 }}>Customer Ref</h3>
                            <div className="form-row">
                                <label className="input-label">Customer Ref No</label>
                                <input className="form-input" value={buyer.refNo || invoice.refNo} onChange={(e) => onBuyerChange("refNo", e.target.value)} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row">
                                <label className="input-label">Ref Date</label>
                                <input className="form-input" value={buyer.refDate || ""} onChange={(e) => onBuyerChange("refDate", e.target.value)} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row">
                                <label className="input-label">GST No</label>
                                <input className="form-input" value={buyer.gst} onChange={(e) => onBuyerChange("gst", e.target.value)} disabled={!buyerLocked} />
                            </div>
                            <div className="form-row">
                                <label className="input-label">Customer Phone</label>
                                <input className="form-input" value={buyer.phone} onChange={(e) => onBuyerChange("phone", e.target.value)} disabled={!buyerLocked} />
                            </div>
                        </div>

                        <div className="col col-3 card">
                            <h3 style={{ marginTop: 0 }}>Sales</h3>
                            <div className="form-row">
                                <label className="input-label">PI Prepared By</label>
                                <input className="form-input" value={invoice.preparedBy} onChange={(e) => onInvoiceChange("preparedBy", e.target.value)} disabled={!buyerLocked} />
                            </div>

                            <div className="form-row">
                                <label className="input-label">Sales Person</label>
                                <input className="form-input" value={buyer.salesPerson || ""} onChange={(e) => onBuyerChange("salesPerson", e.target.value)} disabled={!buyerLocked} />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="table-wrap">
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>CPN</th>
                                <th>Item Name</th>
                                <th>HSN Code</th>
                                <th>Make</th>
                                <th>Delivery</th>
                                <th>Rate</th>
                                <th>Qty</th>
                                <th>Dis(%)</th>
                                <th>Net Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.srNo}</td>
                                    <td>
                                        <input className="form-input" value={item.cpn} onChange={(e) => updateItem(idx, "cpn", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td style={{ position: 'relative' }}>
                                        <input className="form-input" value={item.partNo} onChange={(e) => handleItemNameInput(idx, e.target.value)} disabled={!buyerLocked} onFocus={() => { if (itemNameSuggestions.length) setShowItemNameSuggestionsIndex(idx); }} onBlur={() => setTimeout(() => setShowItemNameSuggestionsIndex(null), 150)} />
                                        {showItemNameSuggestionsIndex === idx && itemNameSuggestions.length > 0 && (
                                            <div className="item-suggestions-list">
                                                {itemNameSuggestions.map((it, i) => (
                                                    <div key={i} className="suggestion-item" onMouseDown={() => chooseItemName(idx, it)}>
                                                        <div className="s-name">{it.itemName || it.name}</div>
                                                        <div className="s-meta">{it.brand || ''} {it.mrp ? ` • ₹${it.mrp}` : ''}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.hsn} onChange={(e) => updateItem(idx, "hsn", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.make} onChange={(e) => updateItem(idx, "make", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.delivery} onChange={(e) => updateItem(idx, "delivery", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.rate} onChange={(e) => updateItem(idx, "rate", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.qty} onChange={(e) => updateItem(idx, "qty", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>
                                        <input className="form-input" value={item.discount} onChange={(e) => updateItem(idx, "discount", e.target.value)} disabled={!buyerLocked} />
                                    </td>
                                    <td>₹{(item.netRate || 0).toFixed(2)}</td>
                                    <td>₹{(item.amount || 0).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="add-row-wrapper" style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
                            <div className="add-row-controls">
                                <input className="add-row-input" id="add-row-input" type="number" min={1} value={rowsToAdd} onChange={(e) => setRowsToAdd(e.target.value)} disabled={!buyerLocked} />
                                <button className="add-row-btn" id="add-row-btn" type="button" onClick={() => { addRows(rowsToAdd); setRowsToAdd(1); }} disabled={!buyerLocked}>
                                    Add rows
                                </button>
                                <div className="upload-wrapper">
                                    <label className="upload-btn" htmlFor="upload-items">Upload items</label>
                                    <input id="upload-items" type="file" accept=".csv, .xlsx, .xls" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) handleFileUpload(f); e.target.value = null; }} />
                                </div>
                            </div>
                           
                    </div>
                </div>

                {/* Totals: moved here so it appears after the invoice items table */}
                <div className="total">
                    <div className="invoice-total-left">
                        <table className="totals-table left">
                            <tbody>
                                <tr>
                                    <td>Delivery Status</td>
                                    <td>
                                        <input
                                            className="form-input small-input"
                                            value={invoice.deliveryStatus || ""}
                                            onChange={(e) => onInvoiceChange("deliveryStatus", e.target.value)}
                                            disabled={!buyerLocked}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Payment Terms</td>
                                    <td>
                                        <input
                                            className="form-input small-input"
                                            value={invoice.paymentTerms || ""}
                                            onChange={(e) => onInvoiceChange("paymentTerms", e.target.value)}
                                            disabled={!buyerLocked}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Proforma Validity</td>
                                    <td>
                                        <input
                                            className="form-input small-input"
                                            value={invoice.validity || ""}
                                            onChange={(e) => onInvoiceChange("validity", e.target.value)}
                                            disabled={!buyerLocked}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Freight</td>
                                    <td>
                                        <input
                                            className="form-input small-input"
                                            type="text"
                                            value={invoice.freight || ""}
                                            onChange={(e) => onInvoiceChange("freight", e.target.value)}
                                            disabled={!buyerLocked}
                                        />
                                    </td>
                                </tr>
                                <tr className="cd-row">
                                    <td >Cash Discount (CD)</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <input
                                                className="form-input small-input"
                                                type="number"
                                                step="0.01"
                                                value={invoice.cd === "" ? "" : invoice.cd}
                                                onChange={(e) => onInvoiceChange("cd", e.target.value)}
                                                disabled={!buyerLocked}
                                            />
                                            <select className="form-input small-input" value={invoice.cdMode || "%"} onChange={(e) => onInvoiceChange("cdMode", e.target.value)} disabled={!buyerLocked}>
                                                <option value="%">%</option>
                                                <option value="₹">₹</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td> Freight Insurance</td>
                                    <td>
                                        <input
                                            className="form-input small-input"
                                            type="number"
                                            value={invoice.insurance || 0}
                                            onChange={(e) => onInvoiceChange("insurance", e.target.value)}
                                            disabled={!buyerLocked}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Amount (in words)</td>
                                    <td>
                                        <p className="amount-in-words">{invoice.amountInWords || ""}</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="invoice-total-right">
                        <table className="totals-table right">
                            <tbody>
                                <tr>
                                    <td>Total</td>
                                    <td>₹{subtotal.toFixed(2)}</td>
                                </tr>
                                <tr className="cd-row">
                                    <td>Cash Discount</td>
                                    <td>- ₹{cdAmount.toFixed(2)}</td>
                                </tr>

                                {/* {cdAmount > 0 && (
                                    <tr className="cd-row">
                                        <td>Cash Discount</td>
                                        <td>- ₹{cdAmount.toFixed(2)}</td>
                                    </tr>
                                )} */}

                                <tr>
                                    <td>Taxable Amount</td>
                                    <td>₹{taxable.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Insurance</td>
                                    <td>₹{insurance.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Freight</td>
                                    <td>₹{freight.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>GST (18%)</td>
                                    <td>₹{gst.toFixed(2)}</td>
                                </tr>

                                <tr className="grand">
                                    <td>Grand Total</td>
                                    <td>₹{grand.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>



                <footer className="invoice-footer">
                    <p>Head Office- 5225, Ajmeri Gate, New Delhi- 110006, Phone- 011-23215397</p>
                    <p>Branches : 80/82, Nagdevi Street, 2nd Floor,Mumbai- 400003, Phone: 022-23472817</p>
                    <p>Branches : Office No. 407, 4th Floor,323 Corporate Park,NR Girish Cold Drinks X Road, C G Road, Ahmedabad- 380009</p>
                    <p>Branches : 35/1, Sovereign terrace, R.R.Samy Lane,Ramnagar, Coimabtore- 641209, Phone- 9489894950</p>
                    <p>Branches : Shop No- 24, Ground Floor, Maitri Arcade, MG Road, Ramgopalpet, Secunderabad - 500003</p>
                    <p id="auth">Authorized Distributors – NTN, JAF, EZO</p>

                </footer>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button id="download-pdf-btn" type="button" onClick={handleDownloadPdf}>Download PDF</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button id="send-btn" type="button" onClick={handleSendInvoice}>Send</button>
                </div>

            </div>
        </div>
    );
};

export default ProformaInvoice;
