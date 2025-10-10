import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function MultipleItemsForm() {
  const [items, setItems] = useState([]);

  // Download Excel template
  const handleDownloadTemplate = () => {
    const data = [
      {
        "Item Name": "Example Item",
        "Item Type": "Example Type",
        "Brand": "Example Brand",
        "Description": "Example Description",
        "MRP": 100,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    XLSX.writeFile(workbook, "Items_Template.xlsx");
  };

  // Upload and validate
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
      });

      const validatedItems = worksheet.map((item, index) => {
        const rowNum = index + 2; // Excel header is row 1
        const newItem = { ...item, _errors: [] };

        if (!item["Item Name"] || item["Item Name"].toString().trim() === "") {
          newItem._errors.push("Item Name missing");
        }
        if (!item["Brand"] || item["Brand"].toString().trim() === "") {
          newItem._errors.push("Brand missing");
        }
        if (
          item["MRP"] === "" ||
          isNaN(item["MRP"]) ||
          Number(item["MRP"]) <= 0
        ) {
          newItem._errors.push("MRP must be a positive number");
        }

        return newItem;
      });

      setItems(validatedItems);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = items.some((item) => item._errors && item._errors.length > 0);
    if (hasErrors) {
      alert("Please fix errors before submitting.");
      return;
    }

    if (items.length === 0) {
      alert("Please upload a valid Excel file first.");
      return;
    }

    console.log("Multiple Items Added:", items);
    alert("Multiple items added successfully!");
    setItems([]);
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Add Multiple Items</h2>

        {/* Download Template Button */}
        <div className="download-section">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={{ marginBottom: "15px" }}
          >
            Download Excel Template
          </button>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <p>Upload Filled Excel File (.xlsx or .xls)</p>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>

        {/* Preview Table */}
        {items.length > 0 && (
          <>
            <h4>Preview:</h4>
            <table border="1" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>MRP</th>
                  <th>Errors</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item["Item Name"] || "-"}</td>
                    <td>{item["Item Type"] || "-"}</td>
                    <td>{item["Brand"] || "-"}</td>
                    <td>{item["Description"] || "-"}</td>
                    <td>{item["MRP"] || "-"}</td>
                    <td style={{ color: "red" }}>
                      {item._errors && item._errors.length > 0
                        ? item._errors.join(", ")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="submit" style={{ marginTop: "15px" }}>
              Add All Items
            </button>
          </>
        )}
      </form>
    </div>
  );
}
