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
        newItem.hasError = false;

        if (!item["Item Name"] || item["Item Name"].toString().trim() === "") {
          newItem["Item Name"] = "";
          newItem.hasError = true;
        }

        if (!item["Brand"] || item["Brand"].toString().trim() === "") {
          newItem["Brand"] = "";
          newItem.hasError = true;
        }
        if (
          item["MRP"] === "" ||
          isNaN(item["MRP"]) ||
          Number(item["MRP"]) <= 0
        ) {
          newItem["MRP"] = "";
          newItem.hasError = true;
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
      newItems[index]["Item Name"] = "";
      newItems[index].hasError = true;
    }
    if (field === "Brand" && (!value || value.trim() === "")) {
      newItems[index]["Brand"] = "";
      newItems[index].hasError = true;
    }
    if (
      field === "MRP" &&
      (value === "" || isNaN(value) || Number(value) <= 0)
    ) {
      newItems[index]["MRP"] = "";
      newItems[index].hasError = true;
    } else {
      newItems[index].hasError = false;
    }

    setItems(newItems);
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const hasErrors = items.some((item) => item.hasError);

    if (hasErrors) {
      alert("⚠️ Please fix errors before submitting.");
      return;
    }

    if (items.length === 0) {
      alert("⚠️ Please upload a valid Excel file first.");
      return;
    }

    // Save to localStorage
    const existingItems = JSON.parse(localStorage.getItem('items') || '[]');
    const newItems = items.map((item, index) => ({
      id: Date.now() + index, // Simple ID generation
      itemName: item["Item Name"],
      brand: item["Brand"],
      type: item["Item Type"],
      description: item["Description"],
      mrp: item["MRP"]
    }));
    existingItems.push(...newItems);
    localStorage.setItem('items', JSON.stringify(existingItems));

    console.log("Multiple Items Added:", items);

    setSubmitMessage("✅ Multiple items added successfully!");

    setTimeout(() => {
      setSubmitMessage("");
      setItems([]);
      document.querySelector('input[type="file"]').value = "";
    }, 7000); // Show message for longer
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
                  <th>Row No.</th>
                  <th>Item Name</th>
                  <th>Item Type</th> 
                  <th>Brand</th>
                  <th>Description</th>
                  <th>MRP</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 2}</td>
                    {["Item Name", "Item Type", "Brand", "Description", "MRP"].map(
                      (field) => (
                        <td
                          key={field}
                          style={{
                            background:
                              (field === "Item Name" && !item["Item Name"]) ||
                              (field === "Brand" && !item["Brand"]) ||
                              (field === "MRP" &&
                                (!item["MRP"] || isNaN(item["MRP"])))
                                ? "#f8d7da"
                                : "white",
                            color:
                              (field === "Item Name" && !item["Item Name"]) ||
                              (field === "Brand" && !item["Brand"]) ||
                              (field === "MRP" &&
                                (!item["MRP"] || isNaN(item["MRP"])))
                                ? "#f8d7da"
                                : "black",
                          }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleCellChange(index, field, e.target.innerText)
                          }
                        >
                          {item[field] || ""}
                        </td>
                      )
                    )}
                    <td>
                      <button
                        type="button"
                        className="button-delete"
                        onClick={() => {
                          if (
                            window.confirm("Are you sure you want to delete this row?")
                          ) {
                            const newItems = [...items];
                            newItems.splice(index, 1);
                            setItems(newItems);
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

            <button type="submit" style={{ marginTop: "15px" }}>
              Add All Items
            </button>
          </>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div className="submit-message">
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
