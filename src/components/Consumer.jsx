import React from "react";
import "./Consumer.css";
import companyLogo from "../assets/bt logo.jpg";

const Consumer = () => {
    // Generate 7 default rows
    const defaultRows = Array.from({ length: 7 }, (_, index) => index + 1);
    
    return (
        <div className="consumer-pi-root">
            <div className="consumer-pi-container">
                <div className="consumer-pi-heading">Packing Invoice</div>

                {/* Header Section */}
                <header className="consumer-pi-header">
                    <img src={companyLogo} alt="Company logo" className="consumer-pi-logo" />
                    <div className="consumer-pi-company-info">
                        <div className="consumer-pi-company-name">Bearing Traders India Pvt Ltd</div>
                    </div>
                </header>

                {/* Invoice Details */}
                <section className="consumer-pi-details">
                    <div className="consumer-pi-row consumer-pi-top-row">
                        <div className="consumer-pi-card">
                            <div className="consumer-pi-form-row consumer-pi-stacked">
                                <label className="consumer-pi-label">Consignee</label>
                                <input className="consumer-pi-input" placeholder="Enter Consignee Name" />
                            </div>
                        </div>

                        {/* Invoice Section */}
                        <div className="consumer-pi-card">
                            <div className="consumer-pi-form-row consumer-pi-small">
                                <label>PI No:</label>
                                <input className="consumer-pi-input consumer-pi-small-input" placeholder="SI04140" />
                            </div>
                            <div className="consumer-pi-form-row consumer-pi-small">
                                <label>Date:</label>
                                <input type="text" className="consumer-pi-input consumer-pi-small-input" value="24/10/2025 10:44:51" readOnly />
                            </div>
                        </div>
                    </div>

                    <div className="consumer-pi-row consumer-pi-bottom-row">
                        {/* Contact Section */}
                        <div className="consumer-pi-card">
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">PO No</label>
                                <input className="consumer-pi-input" placeholder="Enter PO No" />
                            </div>
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">Destination</label>
                                <input className="consumer-pi-input" placeholder="Enter Destination" />
                            </div>
                        </div>

                        {/* Customer Ref */}
                        <div className="consumer-pi-card">
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">Payment Term</label>
                                <input className="consumer-pi-input" placeholder="Enter Payment Term" />
                            </div>
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">GST</label>
                                <input className="consumer-pi-input" placeholder="Enter GST" />
                            </div>
                        </div>

                        {/* Sales Section */}
                        <div className="consumer-pi-card">
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">Transport</label>
                                <input className="consumer-pi-input" placeholder="Enter Transport" />
                            </div>
                            <div className="consumer-pi-form-row">
                                <label className="consumer-pi-label">GST For E-Way</label>
                                <input className="consumer-pi-input" placeholder="Enter GST For E-Way" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Items Table */}
                <div className="consumer-pi-table-wrap">
                    <table className="consumer-pi-table">
                        <thead>
                            <tr>
                                <th>SL. No</th>
                                <th>Item Name</th>
                                <th>Our Part No</th>
                                <th>Qty</th>
                                <th>Location</th>
                                <th>Remark</th>
                                <th>Rate</th>
                                <th>Disc(%)</th>
                                <th>Net Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {defaultRows.map((rowNum) => (
                                <tr key={rowNum}>
                                    <td>{rowNum}</td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                    <td><input className="consumer-pi-input"  /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="consumer-pi-totals">
                    <div className="consumer-pi-totals-left">
                        <h4 className="consumer-pi-info-heading">Bank Details</h4>
                        <div className="consumer-pi-info-columns">
                            <div>
                                <div className="consumer-pi-info-item">
                                    <span className="consumer-pi-info-label">Account No:</span>
                                    <span className="consumer-pi-info-value">50200021565670</span>
                                </div>
                                <div className="consumer-pi-info-item">
                                    <span className="consumer-pi-info-label">IFSC Code:</span>
                                    <span className="consumer-pi-info-value">HDFC0000558</span>
                                </div>
                            </div>
                            <div>
                                <div className="consumer-pi-info-item">
                                    <span className="consumer-pi-info-label">Bank Name:</span>
                                    <span className="consumer-pi-info-value">HDFC BANK</span>
                                </div>
                                <div className="consumer-pi-info-item">
                                    <span className="consumer-pi-info-label">Bank Address:</span>
                                    <span className="consumer-pi-info-value">39, Shradhanand Marg</span>
                                </div>
                            </div>
                        </div>
                        <div className="consumer-pi-info-prepared">
                            <div className="consumer-pi-prepared-item">
                                <label>Prepared By</label>
                                <input type="text" placeholder="Enter name" />
                            </div>
                            <div className="consumer-pi-prepared-item">
                                <label>Assign To</label>
                                <input type="text" placeholder="Enter name" />
                            </div>
                            <div className="consumer-pi-prepared-item">
                                <label>Verify By</label>
                                <input type="text" placeholder="Enter name" />
                            </div>
                            <div className="consumer-pi-prepared-item">
                                <label>Packed By</label>
                                <input type="text" placeholder="Enter name" />
                            </div>
                            <div className="consumer-pi-prepared-item">
                                <label>Approved By</label>
                                <input type="text" placeholder="Enter name" />
                            </div>
                        </div>
                    </div>

                    <div className="consumer-pi-totals-right">
                        <table className="consumer-pi-totals-table-right">
                            <tbody>
                                <tr><td>Total</td><td>₹0.00</td></tr>
                                <tr><td>Insurance</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                                <tr><td>Freight</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                                <tr><td>IGST (18%)</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                                <tr><td>SGST</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                                <tr><td>CGST</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                                <tr><td>Grand Total</td><td>₹0.00</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <footer className="consumer-pi-footer">
                    <p>This is a computer generated Packing List.</p>
                </footer>
            </div>
        </div>
    );
};

export default Consumer;
