import React, { useState } from "react";

export default function SingleCustomerForm() {
  const [customer, setCustomer] = useState({
    name: "",
    gst: "",
    category: "",
    salesperson: "",
    type: "",
    contactPerson: "",
    number: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customer.name || !customer.category || !customer.salesperson || !customer.type) {
      alert("⚠️ Please fill all mandatory fields: Name, Category, Sales Person, and Type.");
      return;
    }
    // Map to storage shape used by ManageCustomer
    const record = {
      "Customer Name": customer.name,
      GST: customer.gst,
      Category: customer.category,
      "Sales Person": customer.salesperson,
      Type: customer.type,
      "Contact Person Name": customer.contactPerson,
      Number: customer.number,
      Email: customer.email,
      "Office Address": customer.address,
      hasError: false,
    };

    try {
      const existing = JSON.parse(localStorage.getItem("customers") || "[]");
      const next = [record, ...existing];
      localStorage.setItem("customers", JSON.stringify(next));
      console.log("Updated customers:", customer);

      alert("Customer added successfully and saved to localStorage!");
    } catch (err) {
      console.error("Failed to save customer to localStorage", err);
      alert("Could not save to localStorage. Check console for details.");
    }

    setCustomer({
      name: "",
      gst: "",
      category: "",
      salesperson: "",
      type: "",
      contactPerson: "",
      number: "",
      email: "",
      address: "",
    });
  };

  const categories = [
    "Aerospace Industry (Supply for aviation usage)",
    "Agricultural Machinery (Includes makes of Tractors, any equipment used in agri industry, irrigation systems)",
    "Auto - spares (Supply to automobile spares market)",
    "Auto Related (Automobile ancillary units,auto transmission, auto engine makers, tyres)",
    "Automobile OEM - 2W (Makers of two and three wheelers)",
    "Automobile OEM - cars (Makers of Cars, SUV)",
    "Automobile OEM - Trucks (Makers of trucks, LCV)",
    "Cement Industry (Cement Industry OEM and makers of Cement)",
    "Chemical Industry (All types of chemical industry)",
    "Compressors (makers of compressors)",
    "Construction Machinery (Includes makers of road building equipment, earth moving equipment, crushers)",
    "Conveyors (Makers of conveyours)",
    "Cooling towers (makers of cooling tower)",
    "Electric Motors (All types of electric motors except Traction motors)",
    "Elevators (Makers of escalators and elevators)",
    "Fertilizer Industry (supply to fertilizer industry)",
    "Fluid Technology",
    "Food Processing (all types of food processing industry, fish net makers, cashew, tea processing units, Sugar industry)",
    "Generators (makers of generators)",
    "Home Appliances (Washing machine, refrigerators, microwave, mixers, fans for home use)",
    "Industrial Fans (All types of industrial usage fans)",
    "Industrial Gearbox (makers of all types of Industrial gearbox)",
    "Machine Tools (Makers of machine tools and applications)",
    "Marine Industry (Includes ship building industry, Ports)",
    "Medical Systems (Scanners, xray machines and any other machine for medical industry)",
    "Mining industry (Includes coal, iron ore and all types of mines)",
    "OEM (makers of all types of Equipment not covered in other types)",
    "Office equip & computers (Photo copiers, printers, computers)",
    "Oil & Gas (includes refineries, gas exploration projects)",
    "Others (Any other type of industry)",
    "Packaging Machinery",
    "Power Plants (thermal, hydro, nuclear and solar - except Wind energy)",
    "Power Tools (Hand held power tool makers)",
    "Printing Machines (Makers of printing Machines, users of printing machines)",
    "Plup and Paper Industry (Makers of Paper)",
    "Pumps (All types of pump makers)",
    "Railway (sales to Indian Railway, Metro, Railway OEMs like BHEL, DLW, CLW etc.)",
    "Steel Manufacturer (Steel Industry OEMs, Makers of steel, aluminum)",
    "Textile Machinery (Makers of Textile machines and Textile mills, spinning units)",
    "Trading purpose (Inter Distributor trade and sales to bearing market)",
    "Wind Energy (All applications in a Wind turbine)",
    "Pharmaceuticals (Pharma companies)",
  ];

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit} >
        <h2>Add Single Customer</h2>

        <div className="form-columns">
          <div className="input-group">
            <label>
              Customer Name<span className="required">*</span>
            </label>
            <div className="input-box">
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter Customer Name"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label>GST</label>
            <div className="input-box">
              <input
                type="text"
                name="gst"
                value={customer.gst}
                onChange={handleChange}
                placeholder="Enter GST Number"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label>
              Category<span className="required">*</span>
            </label>
            <div className="input-box">
              <select
                name="category"
                value={customer.category}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {index + 1}. {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>
              Sales Person<span className="required">*</span>
            </label>
            <div className="input-box">
              <input
                type="text"
                name="salesperson"
                value={customer.salesperson}
                onChange={handleChange}
                placeholder="Enter Sales Person Name"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label>
              Type<span className="required">*</span>
            </label>
            <div className="input-box">
              <select
                name="type"
                value={customer.type}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                <option value="Trade">Trade</option>
                <option value="Consumer">Consumer</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Contact Person Name</label>
            <div className="input-box">
              <input
                type="text"
                name="contactPerson"
                value={customer.contactPerson}
                onChange={handleChange}
                placeholder="Enter Contact Person Name"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Contact Number</label>
            <div className="input-box">
              <input
                type="tel"
                name="number"
                value={customer.number}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email</label>
            <div className="input-box">
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="Enter Email Address"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="input-group full-width">
            <label>Office Address</label>
            <div className="input-box">
              <textarea
                name="address"
                value={customer.address}
                onChange={handleChange}
                placeholder="Enter Office Address"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <button type="submit">Add Customer</button>
      </form>
    </div>

  );
}
