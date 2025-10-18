import React, { useState } from "react";
import "./App.css";
import SingleItemForm from "./components/SingleItemForm";
import MultipleItemUpload from "./components/MultipleItemUpload";
import MultipleCustomerUpload from "./components/MultipleCustomerUpload";
import SingleCustomerForm from "./components/SingleCustomerform";
import ManageCustomer from "./components/ManageCustomer";
import ItemLocator from "./components/ItemLocator";
import PurchaseItem from "./components/PurchaseItem";
import ProformaInvoice from "./components/ProformaInvoice";
import Enquiry from "./components/Enquiry";
import Trade from "./components/Trade";

function App() {
  const [formType, setFormType] = useState("singleItem");

  return (
      <div className="container">
      <h2>Product & Customer Management</h2>

      <div className="form-toggle-buttons">
        <button
          className={`form-toggle-buttons small ${formType === "singleItem" ? "active" : ""}`}
          onClick={() => setFormType("singleItem")}
        >
          Add Single Item
        </button>

        <button
          className={`form-toggle-buttons small ${formType === "multipleItem" ? "active" : ""}`}
          onClick={() => setFormType("multipleItem")}
        >
          Add Multiple Items
        </button>

        <button
          className={`form-toggle-buttons small ${formType === "singleCustomer" ? "active" : ""}`}
          onClick={() => setFormType("singleCustomer")}
        >
         Single Customer
        </button>

        <button
          className={`form-toggle-buttons small ${formType === "multipleCustomer" ? "active" : ""}`}
          onClick={() => setFormType("multipleCustomer")}
        >
          Multiple Customers
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "manageCustomer" ? "active" : ""}`}
          onClick={() => setFormType("manageCustomer")}
        >
          Manage Customers
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "itemLocator" ? "active" : ""}`}
          onClick={() => setFormType("itemLocator")}
        >
          Item Locator
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "purchaseItem" ? "active" : ""}`}
          onClick={() => setFormType("purchaseItem")}
        >
          Purchase Item
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "proformaInvoice" ? "active" : ""}`}
          onClick={() => setFormType("proformaInvoice")}
        >
          Proforma Invoice
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "enquiry" ? "active" : ""}`}
          onClick={() => setFormType("enquiry")}
        >
          Enquiry
        </button>
        <button
          className={`form-toggle-buttons small ${formType === "Trade" ? "active" : ""}`}
          onClick={() => setFormType("Trade")}
        >
          Trade
        </button>
      </div>

      <div className="form-container">
        {formType === "singleItem" && <SingleItemForm />}
        {formType === "multipleItem" && <MultipleItemUpload />}
        {formType === "singleCustomer" && <SingleCustomerForm />}
        {formType === "multipleCustomer" && <MultipleCustomerUpload />}
        {formType === "manageCustomer" && <ManageCustomer />}
        {formType === "itemLocator" && <ItemLocator />}
        {formType === "purchaseItem" && <PurchaseItem />}
        {formType === "proformaInvoice" && <ProformaInvoice />}
        {formType === "enquiry" && <Enquiry />}
        {formType === "Trade" && <Trade />}
      </div>
      </div>
  );
}

export default App;
