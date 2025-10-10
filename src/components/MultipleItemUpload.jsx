import React, { useState } from "react";
import * as XLSX from "xlsx";
// import "./app.css";

export default function MultipleItemsForm() {
  const [items, setItems] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

      const invalidRows = worksheet.filter(
        (item) => !item["Item Name"] || !item["Brand"]
      );

      if (invalidRows.length > 0) {
        alert(
          "Some rows are missing mandatory fields (Item Name or Brand)."
        );
        return;
      }

      setItems(worksheet);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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

        <div className="upload-section">
          <p>Upload Excel File (.xlsx or .xls)</p>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
        </div>

        {items.length > 0 && (
          <>
            <h4>Preview:</h4>
            <table>
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Item Type</th>
                  <th>Brand</th>
                  <th>Description</th>
                  <th>MRP</th>
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
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="submit">Add All Items</button>
          </>
        )}
      </form>
    </div>
  );
}
