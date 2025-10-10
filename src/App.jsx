import React, { useState } from "react";
import "./App.css";
import SingleItemForm from "./components/SingleItemForm";
import MultipleItemUpload from "./components/MultipleItemUpload";

function App() {
  const [formType, setFormType] = useState("single");

  return (
    <div className="container">
      <h2>Product Management</h2>

      <div className="form-toggle-buttons">
        <button
          className={formType === "single" ? "active" : ""}
          onClick={() => setFormType("single")}
        >
          Add Single Item
        </button>
        <button
          className={formType === "multiple" ? "active" : ""}
          onClick={() => setFormType("multiple")}
        >
          Add Multiple Items
        </button>
      </div>

      <div className="form-container">
        {formType === "single" ? <SingleItemForm /> : <MultipleItemUpload />}
      </div>
    </div>
  );
}

export default App;
