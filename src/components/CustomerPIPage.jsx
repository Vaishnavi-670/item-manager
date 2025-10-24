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
      ],
    },
  ];

  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);

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
                  <td>{cust.piNo}</td>
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
                  onClick={() => alert('Invoice created successfully for Packing Invoice!')}
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
    </div>
  );
};

export default CustomerPIPage;
