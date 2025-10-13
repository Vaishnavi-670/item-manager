import React, { useState } from "react";

export default function SingleItemForm() {
  const [item, setItem] = useState({
    name: "",
    type: "",
    brand: "",
    description: "",
    mrp: "",
  });
  

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.name || !item.brand) {
      alert("Please fill all mandatory fields (Item Name and Brand).");
      return;
    }
    console.log("Single Item Added:", item);
    alert("Item added successfully!");
    setItem({ name: "", type: "", brand: "", description: "", mrp: "" });
  };

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Add Single Item</h2>

        <div className="input-group">
          <label>
            Item Name<span className="required">*</span>
          </label>
          <div className="input-box">
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleChange}
              required
              placeholder="Enter Item Name"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Item Type</label>
          <div className="input-box">
            <input
              type="text"
              name="type"
              value={item.type}
              onChange={handleChange}
              placeholder="Enter Item Type"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="input-group">
          <label>
            Brand<span className="required">*</span>
          </label>
          <div className="input-box">
            <input
              type="text"
              name="brand"
              value={item.brand}
              onChange={handleChange}
              required
              placeholder="Enter Brand"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="input-group">
          <label>Description</label>
          <div className="input-box">
            <textarea
              name="description"
              value={item.description}
              onChange={handleChange}
              placeholder="Enter Description"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="input-group">
          <label>MRP (₹)</label>
          <div className="input-box">
            <input
              type="number"
              name="mrp"
              value={item.mrp}
              onChange={handleChange}
              placeholder="Enter MRP"
              autoComplete="off"
            />
          </div>
        </div>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}