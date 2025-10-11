import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function MultipleCustomersForm() {
  const [customers, setCustomers] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");

  const categories = [
    "Aerospace Industry", "Agricultural Machinery", "Auto - spares",
    "Auto Related", "Automobile OEM - 2W", "Automobile OEM - cars",
    "Automobile OEM - Trucks", "Cement Industry", "Chemical Industry",
    "Compressors", "Construction Machinery", "Conveyors", "Cooling towers",
    "Electric Motors", "Elevators", "Fertilizer Industry", "Fluid Technology",
    "Food Processing", "Generators", "Home Appliances", "Industrial Fans",
    "Industrial Gearbox", "Machine Tools", "Marine Industry", "Medical Systems",
    "Mining industry", "OEM", "Office equip & computers", "Oil & Gas", "Others",
    "Packaging Machinery", "Power Plants", "Power Tools", "Printing Machines",
    "Plup and Paper Industry", "Pumps", "Railway", "Steel Manufacturer",
    "Textile Machinery", "Trading purpose", "Wind Energy", "Pharmaceuticals"
  ];

  const types = ["Trade", "Consumer"];

  const fields = [
    "Customer Name", "GST", "Category", "Sales Person", "Type", "Contact Person Position", "Number", "Email", "Office Address"
  ];

  const handleDownloadTemplate = () => {
    const data = [
      {
        "Customer Name": "Example Customer",
        "GST": "",
        "Category": categories[0],
        "Sales Person": "John Doe",
        "Type": types[0],
        "Contact Person Position": "",
        "Number": "",
        "Email": "",
        "Office Address": ""
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "Customers_Template.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

      const validated = worksheet.map((c) => {
        const cust = { ...c, hasError: false };
        // Validation
        if (!c["Customer Name"]?.trim()) cust.hasError = true;
        if (!categories.includes(c["Category"])) cust.hasError = true;
        if (!c["Sales Person"]?.trim()) cust.hasError = true;
        if (!types.includes(c["Type"])) cust.hasError = true;
        return cust;
      });
      setCustomers(validated);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCellChange = (index, field, value) => {
    const updated = [...customers];
    updated[index][field] = value;

    // Revalidate
    if (
      (field === "Customer Name" && !value.trim()) ||
      (field === "Category" && !categories.includes(value)) ||
      (field === "Sales Person" && !value.trim()) ||
      (field === "Type" && !types.includes(value))
    ) {
      updated[index].hasError = true;
    } else {
      updated[index].hasError = false;
    }

    setCustomers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (customers.length === 0) {
      alert("⚠️ Upload a valid Excel file first!");
      return;
    }
    if (customers.some(c => c.hasError)) {
      alert("⚠️ Fix errors before submitting!");
      return;
    }
    console.log("Multiple Customers:", customers);
    setSubmitMessage("✅ Multiple customers added successfully!");
    setTimeout(() => {
      setCustomers([]);
      setSubmitMessage("");
      document.querySelector('input[type="file"]').value = "";
    }, 5000);
  };

  return (
    <div className="wrap">
      <div className="form-container">
        {/* ---------- FORM ---------- */}
        <form className="form-box" onSubmit={handleSubmit}>
          <h2>Add Multiple Customers</h2>

          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="download-btn"
          >
            Download Excel Template
          </button>

          <div className="upload-section">
            <p>Upload Filled Excel (.xlsx or .xls)</p>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </div>

          <button type="submit" className="submit-btn">
            Add All Customers
          </button>

          {submitMessage && (
            <div className="submit-message">{submitMessage}</div>
          )}
          <div className="row-info">
            📄 {customers.length} rows found in uploaded file.
          </div>
        </form>

       
      </div>
       {customers.length > 0 && (
          <div className="preview-container">
            <h4>Preview (Click to Edit)</h4>
            <table className="preview-table">
              <thead>
                <tr>
                  <th>Row No.</th>
                  {fields.map((f) => (
                    <th key={f}>{f}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c, i) => (
                  <tr key={i}>
                    <td>{i + 2}</td>
                    {fields.map((f) => (
                      <td
                        key={f}
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                          background: c.hasError ? "#f8d7da" : "white",
                        }}
                        onBlur={(e) => handleCellChange(i, f, e.target.innerText)}
                      >
                        {c[f] || ""}
                      </td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="button-delete"
                        onClick={() => {
                          const confirmDelete = window.confirm("Delete this row?");
                          if (confirmDelete) {
                            const arr = [...customers];
                            arr.splice(i, 1);
                            setCustomers(arr);
                          }
                        }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


          </div>
        )}
    </div>

  );
}
