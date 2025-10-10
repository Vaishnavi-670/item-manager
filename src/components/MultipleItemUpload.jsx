import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function MultipleItemsForm() {
  const [items, setItems] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");

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

      const validatedItems = worksheet.map((item) => {
        const newItem = { ...item };

        if (!item["Item Name"] || item["Item Name"].toString().trim() === "") {
          newItem["Item Name"] = "Item Name missing";
        }
        if (!item["Brand"] || item["Brand"].toString().trim() === "") {
          newItem["Brand"] = "Brand missing";
        }
        if (
          item["MRP"] === "" ||
          isNaN(item["MRP"]) ||
          Number(item["MRP"]) <= 0
        ) {
          newItem["MRP"] = "MRP missing or invalid";
        }

        return newItem;
      });

      setItems(validatedItems);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle table cell edits
  const handleCellChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "Item Name" && (!value || value.trim() === "")) {
      newItems[index][field] = "Item Name missing";
    }
    if (field === "Brand" && (!value || value.trim() === "")) {
      newItems[index][field] = "Brand missing";
    }
    if (
      field === "MRP" &&
      (value === "" || isNaN(value) || Number(value) <= 0)
    ) {
      newItems[index][field] = "MRP missing or invalid";
    }

    setItems(newItems);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = items.some(
      (item) =>
        item["Item Name"] === "Item Name missing" ||
        item["Brand"] === "Brand missing" ||
        item["MRP"] === "MRP missing or invalid"
    );

    if (hasErrors) {
      setSubmitMessage("⚠️ Please fix errors before submitting.");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    if (items.length === 0) {
      setSubmitMessage("⚠️ Please upload a valid Excel file first.");
      setTimeout(() => setSubmitMessage(""), 3000);
      return;
    }

    console.log("Multiple Items Added:", items);

    setSubmitMessage("✅ Multiple items added successfully!");

    setTimeout(() => {
      setSubmitMessage("");
      setItems([]); // clear table
      document.querySelector('input[type="file"]').value = ""; // reset file input
    }, 10000); // reset after 10 seconds
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

        {/* Editable Preview Table */}
        {items.length > 0 && (
          <>
            <h4>Preview (Click to Edit):</h4>
            <table border="1" style={{ borderCollapse: "collapse" }}>
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
                    {["Item Name", "Item Type", "Brand", "Description", "MRP"].map(
                      (field) => (
                        <td
                          key={field}
                          style={{
                            color:
                              item[field] &&
                              item[field].toString().includes("missing")
                                ? "red"
                                : "black",
                          }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleCellChange(index, field, e.target.innerText)
                          }
                        >
                          {item[field] || "-"}
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="submit" style={{ marginTop: "15px" }}>
              Add All Items
            </button>
          </>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#d4edda",
              color: "#155724",
              fontWeight: "bold",
              borderRadius: "5px",
              animation: "fadeInOut 3s ease-in-out",
            }}
          >
            {submitMessage}
          </div>
        )}

        {/* Animation Styles */}
        <style>{`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
        `}</style>
      </form>
    </div>
  );
}
