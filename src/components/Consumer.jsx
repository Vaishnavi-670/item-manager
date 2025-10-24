import React from "react";
import "./Consumer.css";
import companyLogo from "../assets/bt logo.jpg";

const Consumer = () => {
  return (
    <div className="consumer-pi-root">
      <div className="consumer-pi-container">
        <div className="consumer-pi-heading">Packing Invoice</div>

        {/* Header Section */}
        <header className="consumer-pi-header">
          <div className="consumer-pi-header-inner">
            <div className="consumer-pi-logo-wrap">
              <img src={companyLogo} alt="Company logo" className="consumer-pi-logo" />
            </div>
            <div className="consumer-pi-company-info">
              <div className="consumer-pi-company-name">Bearing Traders India Pvt Ltd</div>
              <div className="consumer-pi-company-meta">
                <div className="consumer-pi-company-address">39, Shradhanand Marg</div>
                <div className="consumer-pi-company-contact">
                  Bank Name: HDFC BANK | Account No: 50200021565670
                </div>
                <div className="consumer-pi-company-gst">
                  IFSC Code: <strong>HDFC0000558</strong> | Date: 24/10/2025 10:44:51
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Invoice Details */}
        <section className="consumer-pi-details">
          <div className="consumer-pi-row consumer-pi-top-row">
            <div className="consumer-pi-col consumer-pi-left-col consumer-pi-card">
              <div className="consumer-pi-form-row consumer-pi-stacked">
                <label className="consumer-pi-label">Consignee</label>
                <input className="consumer-pi-input" placeholder="Enter Consignee Name" />
              </div>
              
            </div>

            {/* Invoice Section */}
            <div className="consumer-pi-col consumer-pi-right-col consumer-pi-card">
              {/* <h2>Invoice Details</h2> */}
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
            <div className="consumer-pi-col consumer-pi-card consumer-pi-col-3">
             
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
            <div className="consumer-pi-col consumer-pi-card consumer-pi-col-3">
              
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
            <div className="consumer-pi-col consumer-pi-card consumer-pi-col-3">
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
              <tr>
                <td>1</td>
                <td><input className="consumer-pi-input" placeholder="Enter Item Name" /></td>
                <td><input className="consumer-pi-input" placeholder="Part No" /></td>
                <td><input className="consumer-pi-input" placeholder="Qty" /></td>
                <td><input className="consumer-pi-input" placeholder="Location" /></td>
                <td><input className="consumer-pi-input" placeholder="Remark" /></td>
                <td><input className="consumer-pi-input" placeholder="Rate" /></td>
                <td><input className="consumer-pi-input" placeholder="Disc" /></td>
                <td><input className="consumer-pi-input" placeholder="Net Rate" /></td>
                <td><input className="consumer-pi-input" placeholder="Amount" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="consumer-pi-totals">
          <div className="consumer-pi-totals-left">
            <table className="consumer-pi-totals-table-left">
              <tbody>
                <tr><td>Insurance</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                <tr><td>Freight</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                <tr><td>IGST (18%)</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                <tr><td>SGST</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
                <tr><td>CGST</td><td><input className="consumer-pi-input consumer-pi-small-input" placeholder="0.00" /></td></tr>
              </tbody>
            </table>
          </div>

          <div className="consumer-pi-totals-right">
            <table className="consumer-pi-totals-table-right">
              <tbody>
                <tr><td>Total</td><td>₹0.00</td></tr>
                <tr><td>Grand Total</td><td>₹0.00</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <footer className="consumer-pi-footer">
          <p>This is a computer generated Packing List.</p>
          <p>Prepared By</p>
          <p>Assign To</p>
          <p>Verify By</p>
          <p>Packed By</p>
          <p>Approved By</p>
        </footer>

        {/* <div className="consumer-pi-action-buttons">
          <button id="consumer-pi-download-btn" type="button">Download PDF</button>
          <button id="consumer-pi-send-btn" type="button">Send</button>
        </div> */}
      </div>
    </div>
  );
};

export default Consumer;
