import React, { useState } from "react";
import "./App.css";
import SingleItemForm from "./components/SingleItemForm";
import MultipleItemUpload from "./components/MultipleItemUpload";
import MultipleCustomerUpload from "./components/MultipleCustomerUpload";
import SingleCustomerForm from "./components/SingleCustomerform";
import ManageCustomer from "./components/ManageCustomer";

function App() {
  const [formType, setFormType] = useState("singleItem");

  return (
      <div className="container">
      <h2>Product & Customer Management</h2>

      <div className="form-toggle-buttons">
        <button
          className={formType === "singleItem" ? "active" : ""}
          onClick={() => setFormType("singleItem")}
        >
          Add Single Item
        </button>

        <button
          className={formType === "multipleItem" ? "active" : ""}
          onClick={() => setFormType("multipleItem")}
        >
          Add Multiple Items
        </button>

        <button
          className={formType === "singleCustomer" ? "active" : ""}
          onClick={() => setFormType("singleCustomer")}
        >
         Single Customer
        </button>

        <button
          className={formType === "multipleCustomer" ? "active" : ""}
          onClick={() => setFormType("multipleCustomer")}
        >
          Multiple Customers
        </button>
        <button
          className={formType === "manageCustomer" ? "active" : ""}
          onClick={() => setFormType("manageCustomer")}
        >
          Manage Customers
        </button>
      </div>

      <div className="form-container">
        {formType === "singleItem" && <SingleItemForm />}
        {formType === "multipleItem" && <MultipleItemUpload />}
        {formType === "singleCustomer" && <SingleCustomerForm />}
        {formType === "multipleCustomer" && <MultipleCustomerUpload />}
        {formType === "manageCustomer" && <ManageCustomer />}
      </div>
      </div>
  );
}

export default App;
