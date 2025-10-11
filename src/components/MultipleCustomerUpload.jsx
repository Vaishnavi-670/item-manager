// src/components/MultipleCustomersUpload.jsx
import React, { useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function MultipleCustomersUpload() {
  const [customers, setCustomers] = useState([]);
  const [submitMessage, setSubmitMessage] = useState("");

  const categoryOptions = [
    "Aerospace Industry (Supply for aviation usage)",
    "Agricultural Machinery (Includes makes of Tractors, any equipment used in agri industry, irrigation systems)",
    "Auto - spares (Supply to automobile spares market)",
    "Auto Related (Automobile ancillary units,auto transmission, auto engine makers, tyres)",
    "Automobile OEM - 2W (Makers of two and three wheelers)",
    "Automobile OEM - cars (Makers of Cars, SUV)",
    "Automobile OEM - Trucks (Makers of trucks, LCV)",
    "Cement Industry (Cement Industry OEM and makers of Cement)",
    "Chemical Industry ( All types of chemical industry)",
    "Compressors ( makers of compressors)",
    "Construction Machinery (Includes makers of road building equipment, earth moving equipment, crushers)",
    "Conveyors ( Makers of conveyours )",
    "Cooling towers (makers of cooling tower )",
    "Electric Motors ( All types of electric motors except Traction motors )",
    "Elevators (Makers of escalators and alavators ( but not conveyors ) )",
    "Fertilizer Industry (supply to fertilizer industry)",
    "Fluid Technology",
    "Food Processing ( all types of food processing industry, fish net makers, cashew, tea processing units, Sugar industry )",
    "Generators ( makers of generators )",
    "Home Appliances (Washing machine, refridgerators,microve, mixers,fans for use at home )",
    "Industrial Fans (All types of industrial usage fans)",
    "Industrial Gearbox (makers of all types of Industrial gearbox )",
    "Machine Tools (Makers of machine tools and machine tool application in any user )",
    "Marine Industry (Includes ship building industry, Ports )",
    "Medical Systems ( Scanners, xray machines and any other machine being used in medical industry )",
    "Mining industry (Includes coal,iron ore and all types of mines )",
    "OEM ( makers of all types of Equipment not covered in other types )",
    "Office equip & computers ( Photo copiers, printers, computers )",
    "Oil & Gas ( includes refineriers, gas exploration projects )",
    "Others (Any other type of industry)",
    "Packaging Machinery",
    "Power Plants (Makers of Power Equipment, all Power products - thermal, hydro, nuclear and solar -expect Wind energy )",
    "Power Tools ( Hand held power tool makers )",
    "Printing Machines (Makers of printing Machines, users of printing machines ( like newspapers ) )",
    "Plup and Paper Industry (Makers of Paper)",
    "Pumps (All types of pump makers)",
    "Railway ( sales to Indian Railay, Metro, Railway OEM's like BHEL Bhopal, DLW, CLW etc. )",
    "Steel Manufacturer ( Steel Industry OEM's, Makers of steel, aluminum )",
    "Textile Machinery ( Makers of Textile machines and Textile miles, spinning units )",
    "Trading purpose (Inter Distributor trade and sales to bearing market )",
    "Wind Energy (All applications in a Wind turbine )",
    "Pharmaceuticals ( Pharme companies)"
  ];

  const typeOptions = ["Trade", "Consumer"];

  // Download Excel Template
  const handleDownloadTemplate = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Customers");

    // Header
    sheet.addRow([
      "Customer Name",
      "GST",
      "Category",
      "Sales Person",
      "Type",
      "Contact Person Position",
      "Number",
      "Email",
      "Office Address"
    ]);

    // Example Row
    sheet.addRow([
      "Example Customer",
      "",
      categoryOptions[0],
      "John Doe",
      typeOptions[0],
      "",
      "",
      "",
      ""
    ]);

    // Add dropdowns for Category and Type
    for (let i = 2; i <= 101; i++) {
      sheet.getCell(`C${i}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [`"${categoryOptions.join(",")}"`],
        showErrorMessage: true,
        error: "Select a valid category"
      };
      sheet.getCell(`E${i}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [`"${typeOptions.join(",")}"`],
        showErrorMessage: true,
        error: "Select Trade/Consumer"
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Customers_Template.xlsx");
  };

  // Upload and validate Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = await ExcelJS.read(data, { type: "array" });
      const worksheet = workbook.getWorksheet(1);

      const rows = [];
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) return; // skip header
        const rowData = {
          "Customer Name": row.getCell(1).value || "",
          GST: row.getCell(2).value || "",
          Category: row.getCell(3).value || "",
          "Sales Person": row.getCell(4).value || "",
          Type: row.getCell(5).value || "",
          "Contact Person Position": row.getCell(6).value || "",
          Number: row.getCell(7).value || "",
          Email: row.getCell(8).value || "",
          "Office Address": row.getCell(9).value || "",
          hasError: false
        };

        // Validation
        if (!rowData["Customer Name"].trim()) rowData.hasError = true;
        if (!rowData.Category.trim() || !categoryOptions.includes(rowData.Category))
          rowData.hasError = true;
        if (!rowData["Sales Person"].trim()) rowData.hasError = true;
        if (!rowData.Type.trim() || !typeOptions.includes(rowData.Type)) rowData.hasError = true;

        rows.push(rowData);
      });

      setCustomers(rows);
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle editable table
  const handleCellChange = (index, field, value) => {
    const newCustomers = [...customers];
    newCustomers[index][field] = value;

    // Re-validate
    if (["Customer Name", "Category", "Sales Person", "Type"].includes(field)) {
      if (!value.trim()) newCustomers[index].hasError = true;
      else {
        if (
          (field === "Category" && !categoryOptions.includes(value)) ||
          (field === "Type" && !typeOptions.includes(value))
        ) {
          newCustomers[index].hasError = true;
        } else {
          newCustomers[index].hasError = false;
        }
      }
    }

    setCustomers(newCustomers);
  };

  // Submit all customers
  const handleSubmit = (e) => {
    e.preventDefault();
    if (customers.length === 0) {
      alert("Please upload a file first!");
      return;
    }
    if (customers.some((c) => c.hasError)) {
      alert("Fix errors before submitting!");
      return;
    }

    console.log("Customers Submitted:", customers);
    setSubmitMessage("✅ Multiple customers added successfully!");
    setTimeout(() => {
      setSubmitMessage("");
      setCustomers([]);
      document.querySelector('input[type="file"]').value = "";
    }, 7000);
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Add Multiple Customers</h2>

        <div style={{ marginBottom: "15px" }}>
          <button type="button" onClick={handleDownloadTemplate}>
            Download Excel Template
          </button>
        </div>

        <div className="upload-section">
          <p>Upload Filled Excel File (.xlsx only)</p>
          <input type="file" accept=".xlsx" onChange={handleFileUpload} />
        </div>

        {customers.length > 0 && (
          <>
            <h4>Preview (Click to Edit):</h4>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>GST</th>
                  <th>Category</th>
                  <th>Sales Person</th>
                  <th>Type</th>
                  <th>Contact Person Position</th>
                  <th>Number</th>
                  <th>Email</th>
                  <th>Office Address</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i} style={{ background: c.hasError ? "#f8d7da" : "white" }}>
                    <td>{i + 1}</td>
                    {[
                      "Customer Name",
                      "GST",
                      "Category",
                      "Sales Person",
                      "Type",
                      "Contact Person Position",
                      "Number",
                      "Email",
                      "Office Address"
                    ].map((field) => (
                      <td
                        key={field}
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleCellChange(i, field, e.target.innerText)}
                        style={{
                          background:
                            (["Customer Name", "Category", "Sales Person", "Type"].includes(field) &&
                              !c[field].trim()) ||
                            (field === "Category" && !categoryOptions.includes(c.Category)) ||
                            (field === "Type" && !typeOptions.includes(c.Type))
                              ? "#f8d7da"
                              : "white"
                        }}
                      >
                        {c[field]}
                      </td>
                    ))}
                    <td>
                      <button
                        type="button"
                        className="button-delete"
                        onClick={() => {
                          if (window.confirm("Delete this row?")) {
                            const newCustomers = [...customers];
                            newCustomers.splice(i, 1);
                            setCustomers(newCustomers);
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
              Add All Customers
            </button>
          </>
        )}

        {submitMessage && (
          <div className="submit-message">
            {submitMessage}
          </div>
        )}
      </form>
    </div>
  );
}