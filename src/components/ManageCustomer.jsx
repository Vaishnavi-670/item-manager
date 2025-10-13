import { RelationshipType } from "exceljs";
import React, { useEffect, useMemo, useState } from "react";

const initialCustomers = [
  {
    "Customer Name": "Example Customer",
    GST: "12345",
    Category: "Automobile OEM - cars",
    "Sales Person": "John Doe",
    Type: "Trade",
    "Contact Person Position": "Manager",
    Number: "9876543210",
    Email: "customer@example.com",
    "Office Address": "123, Main Street",
    hasError: false,
  },
];

const fields = [
  "Customer Name",
  "GST",
  "Category",
  "Sales Person",
  "Type",
  "Contact Person Position",
  "Number",
  "Email",
  "Office Address",
];

export default function ManageCustomer() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    sales: "",
    category: "",
  });

  const handleEdit = (index) => {
    setForm(customers[index]);
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedCustomers = [...customers];
    updatedCustomers[editIndex] = form;
    setCustomers(updatedCustomers);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setEditIndex(null);
    setForm({});
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("customers") || "null");
      if (Array.isArray(saved) && saved.length) {
        setCustomers(saved);
        console.log("Fetched customers from localStorage:", saved);
      } else {
        setCustomers(initialCustomers);
        console.log("Using initial customers:", initialCustomers);
      }
    } catch {
      setCustomers(initialCustomers);
      console.log("Using initial customers:", initialCustomers);
    }
  }, []);

  // Unique values for filter dropdowns
  const uniqueTypes = useMemo(() => Array.from(new Set(customers.map(c => c.Type).filter(Boolean))), [customers]);
  const uniqueSales = useMemo(() => Array.from(new Set(customers.map(c => c["Sales Person"]).filter(Boolean))), [customers]);
  const uniqueCategories = useMemo(() => Array.from(new Set(customers.map(c => c.Category).filter(Boolean))), [customers]);

  // Filter logic
  const filtered = useMemo(() => {
  const query = search.trim().toLowerCase();
  return customers.filter((c) => {
    const name = (c["Customer Name"] || "").toLowerCase();
    const matchesSearch = !query || name.includes(query); // instantly matches even 1 character

    const matchesFilters =
      (!filters.name || name.includes(filters.name.toLowerCase())) &&
      (!filters.type || c.Type === filters.type) &&
      (!filters.sales || c["Sales Person"] === filters.sales) &&
      (!filters.category || c.Category === filters.category);

    return matchesSearch && matchesFilters;
  });
}, [customers, filters, search]);

  return (
    <div className="manage-customer" style={{ display: "flex", gap: 16 }}>
      <aside style={{ minWidth: 260, borderRight: "1px solid #eee", paddingRight: 16 }}>
        <h3>Filters</h3>
        <div className="input-group">
          <label>Name</label>
          <div className="input-box">
            <input
              type="text"
              value={filters.name}
              onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
              placeholder="Customer Name"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="input-group">
          <label>Type</label>
          <div className="input-box">
            <select
              value={filters.type}
              onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
            >
              <option value="">All</option>
              {uniqueTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Sales Person</label>
          <div className="input-box">
            <select
              value={filters.sales}
              onChange={e => setFilters(f => ({ ...f, sales: e.target.value }))}
            >
              <option value="">All</option>
              {uniqueSales.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Category</label>
          <div className="input-box">
            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">All</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="clear">
          <button type="button" onClick={() => setFilters({ name: "", type: "", sales: "", category: "" })}>
            Clear Filters
          </button>
        </div>
      </aside>

      <div style={{ flex: 1 }}>
        <h2>Manage Customers</h2>
        <div style={{ marginTop: 24 }}>
          <div className="input-group">
            <label>Search by Customer Name</label>
            <div className="input-box">
              <input
                type="text"
                placeholder="Search by customer name"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoComplete="off"
              />
            </div>
          </div>
        </div>
        {editIndex !== null && (
          <form onSubmit={handleUpdate} style={{ marginBottom: 20 }}>
            <h3>Edit Customer</h3>
            {fields.map((f) => (
              <div key={f} style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontWeight: "bold" ,}}>{f}</label>
                <input
                  type="text"
                  value={form[f] || ""}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  style={{ width: "100%", padding: "6px" ,border: "1px solid #aaaab2ff",marginTop: 8, borderRadius: 4,  transition : "border-color 0.3s ease", }}
                  autoComplete="off"
                />
              </div>
            ))}
            <button type="submit">Update</button>{" "}
            <button type="button" onClick={() => setEditIndex(null)}>
              Cancel
            </button>
          </form>
        )}

        <div className="actions">
          <table className="data-table" >
            <thead>
              <tr>
                <th>#</th>
                {fields.map((f) => (
                  <th key={f}>{f}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(filtered.length > 0
                ? filtered
                : [null]
              ).map((c, idx) => {
                if (!c) {
                  return (
                    <tr key="empty">
                      <td colSpan={fields.length + 2} className="no-data">
                        No customers Data found
                      </td>
                    </tr>
                  );
                }
                

                return (
                  <tr key={idx} style={{ background: c.hasError ? "#fff1f0" : undefined }}>
                    <td>{idx + 2}</td>
                    {fields.map((f) => (
                      <td key={f} className="keys" >
                        {c[f] || ""}
                      </td>
                    ))}
                    <td style={{ display: "flex", gap: 8, border: "none" }}>
                      <button type="button" onClick={() => handleEdit(idx)}>Edit</button>
                      <button
                        onClick={() => {
                          const all = customers.filter((x) => x !== c);
                          setCustomers(all);
                          localStorage.setItem("customers", JSON.stringify(all));
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
