import React, { useState } from "react";
import "./CustomerPIPage.css";

const CustomerPIPage = () => {
    // Dummy customer data
    const customers = [
        {
            id: 1,
            name: "ABC Industries",
            piNo: "PI1001",
            date: "2025-10-24",
            gst: "22AAAAA0000A1Z5",
            contact: "9876543210",
            email: "contact@abcindustries.com",
            address: "123 Industrial Area, Mumbai, Maharashtra",
            items: [
                { sno: 1, name: "Ball Bearing", partNo: "BB101", qty: 10, rate: 500 },
                { sno: 2, name: "Roller Bearing", partNo: "RB202", qty: 5, rate: 750 },
                { sno: 3, name: "Needle Bearing", partNo: "NB303", qty: 15, rate: 450 },
            ],
        },
        {
            id: 2,
            name: "XYZ Traders",
            piNo: "PI1002",
            date: "2025-10-22",
            gst: "27BBBBB1111B2Z6",
            contact: "9876500000",
            email: "sales@xyztraders.com",
            address: "Plot 45, Market Yard, Pune, Maharashtra",
            items: [
                { sno: 1, name: "Shaft Sleeve", partNo: "SS303", qty: 3, rate: 1200 },
                { sno: 2, name: "Thrust Bearing", partNo: "TB404", qty: 8, rate: 400 },
                { sno: 3, name: "Bush Bearing", partNo: "BSH505", qty: 12, rate: 350 },
            ],
        },
        {
            id: 3,
            name: "Delta Engineering",
            piNo: "PI1003",
            date: "2025-10-20",
            gst: "24CCCCC2222C3Z7",
            contact: "9988776655",
            email: "info@deltaengg.in",
            address: "Near GIDC Estate, Ahmedabad, Gujarat",
            items: [
                { sno: 1, name: "Bearing Housing", partNo: "BH505", qty: 2, rate: 3000 },
                { sno: 2, name: "Oil Seal", partNo: "OS606", qty: 20, rate: 150 },
                { sno: 3, name: "Grease Fitting", partNo: "GF707", qty: 50, rate: 80 },
                { sno: 4, name: "Lock Washer", partNo: "LW808", qty: 100, rate: 25 },
            ],
        },
        {
            id: 4,
            name: "Precision Motors Ltd",
            piNo: "PI1004",
            date: "2025-10-18",
            gst: "29DDDDD3333D4Z8",
            contact: "9123456789",
            email: "purchase@precisionmotors.com",
            address: "Sector 21, Noida, Uttar Pradesh",
            items: [
                { sno: 1, name: "Deep Groove Bearing", partNo: "DGB909", qty: 25, rate: 600 },
                { sno: 2, name: "Angular Contact Bearing", partNo: "ACB010", qty: 10, rate: 950 },
                { sno: 3, name: "Cylindrical Bearing", partNo: "CB111", qty: 8, rate: 1100 },
            ],
        },
        {
            id: 5,
            name: "Sharma Auto Parts",
            piNo: "PI1005",
            date: "2025-10-15",
            gst: "27EEEEE4444E5Z9",
            contact: "9998887776",
            email: "sharma.auto@gmail.com",
            address: "Gandhi Road, Bangalore, Karnataka",
            items: [
                { sno: 1, name: "Wheel Bearing", partNo: "WB212", qty: 30, rate: 450 },
                { sno: 2, name: "Hub Assembly", partNo: "HA313", qty: 15, rate: 1800 },
            ],
        },
        {
            id: 6,
            name: "Global Manufacturing Co",
            piNo: "PI1006",
            date: "2025-10-12",
            gst: "36FFFFF5555F6Z0",
            contact: "8765432109",
            email: "sales@globalmfg.in",
            address: "Industrial Zone, Hyderabad, Telangana",
            items: [
                { sno: 1, name: "Tapered Roller Bearing", partNo: "TRB414", qty: 20, rate: 850 },
                { sno: 2, name: "Spherical Bearing", partNo: "SB515", qty: 12, rate: 1250 },
                { sno: 3, name: "Pillow Block", partNo: "PB616", qty: 8, rate: 2200 },
                { sno: 4, name: "Flange Unit", partNo: "FU717", qty: 6, rate: 2800 },
            ],
        },
        {
            id: 7,
            name: "TechMech Solutions",
            piNo: "PI1007",
            date: "2025-10-10",
            gst: "07GGGGG6666G7Z1",
            contact: "9012345678",
            email: "info@techmech.co.in",
            address: "Phase 2, Chandigarh",
            items: [
                { sno: 1, name: "Linear Bearing", partNo: "LB818", qty: 40, rate: 320 },
                { sno: 2, name: "Rod End Bearing", partNo: "RE919", qty: 25, rate: 280 },
                { sno: 3, name: "Cam Follower", partNo: "CF020", qty: 18, rate: 550 },
            ],
        },
        {
            id: 8,
            name: "Rapid Industries",
            piNo: "PI1008",
            date: "2025-10-08",
            gst: "19HHHHH7777H8Z2",
            contact: "9876012345",
            email: "contact@rapidind.com",
            address: "MIDC Area, Nashik, Maharashtra",
            items: [
                { sno: 1, name: "Miniature Bearing", partNo: "MB121", qty: 100, rate: 150 },
                { sno: 2, name: "Self Aligning Bearing", partNo: "SAB222", qty: 15, rate: 920 },
                { sno: 3, name: "Insert Bearing", partNo: "IB323", qty: 22, rate: 680 },
            ],
        },
    ];

    const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
    const [showModal, setShowModal] = useState(false);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [savedInvoices, setSavedInvoices] = useState({});

    const handleCreateInvoice = () => {
        setShowModal(true);
        setInvoiceNumber("");
    };

    const handleSaveInvoice = () => {
        if (invoiceNumber.trim()) {
            setSavedInvoices({
                ...savedInvoices,
                [selectedCustomer.piNo]: invoiceNumber.trim()
            });
            setShowModal(false);
            setInvoiceNumber("");
        } else {
            alert("Please enter an invoice number");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setInvoiceNumber("");
    };

    return (
        <div className="customer-pi-root">
            {/* Two Column Layout */}
            <div className="customer-pi-container">
                {/* Left Column - Customer List */}
                <div className="customer-pi-left">
                    <h2>Customer List</h2>
                    <table className="customer-pi-table">
                        <thead>
                            <tr>
                                <th>Customer Name</th>
                                <th>PI No</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((cust) => (
                                <tr
                                    key={cust.id}
                                    className={selectedCustomer.piNo === cust.piNo ? "active" : ""}
                                    onClick={() => setSelectedCustomer(cust)}
                                >
                                    <td>{cust.name}</td>
                                    <td>
                                        {cust.piNo}
                                        {savedInvoices[cust.piNo] && (
                                            <span className="green-tick"> ✓</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Right Column - PI Details */}
                <div className="customer-pi-right">
                    <h2>Packing Invoice</h2>

                    {selectedCustomer ? (
                        <div className="pi-details">
                            <div className="pi-header">
                                <h3>{selectedCustomer.name}</h3>
                                <p><strong>PI No:</strong> {selectedCustomer.piNo}</p>
                                <p><strong>Date:</strong> {selectedCustomer.date}</p>
                                <p><strong>GST No:</strong> {selectedCustomer.gst}</p>
                                <p><strong>Contact:</strong> {selectedCustomer.contact}</p>
                                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                                <p><strong>Address:</strong> {selectedCustomer.address}</p>
                            </div>

                            <table className="pi-items-table">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Item Name</th>
                                        <th>Part No</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCustomer.items.map((item) => (
                                        <tr key={item.sno}>
                                            <td>{item.sno}</td>
                                            <td>{item.name}</td>
                                            <td>{item.partNo}</td>
                                            <td>{item.qty}</td>
                                            <td>₹{item.rate}</td>
                                            <td>₹{(item.qty * item.rate).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="pi-total">
                                <p>
                                    <strong>Total: </strong>₹
                                    {selectedCustomer.items
                                        .reduce((acc, item) => acc + item.qty * item.rate, 0)
                                        .toFixed(2)}
                                </p>
                                <button
                                    className="pi-submit-btn"
                                    onClick={handleCreateInvoice}
                                >
                                    Create Invoice
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Select a customer to view details.</p>
                    )}
                </div>
            </div>

            {/* Modal Popup */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Enter Invoice Number</h3>
                        <input
                            type="text"
                            className="invoice-input"
                            placeholder="Enter Invoice Number"
                            value={invoiceNumber}
                            onChange={(e) => setInvoiceNumber(e.target.value)}
                            autoFocus
                        />
                        <div className="modal-buttons">
                            <button className="save-btn" onClick={handleSaveInvoice}>
                                Save
                            </button>
                            <button className="close-btn" onClick={handleCloseModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerPIPage;
