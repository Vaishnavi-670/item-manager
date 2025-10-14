import React, { useState, useEffect } from 'react';
import './ItemLocator.css'; 
const ItemLocatorPage = () => {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTab, setSelectedTab] = useState('viewOnly'); // Default tab
  const [selectedItem, setSelectedItem] = useState(null); // For selected item in table
  const [items, setItems] = useState([]); // Mock data source

  // Fetch data from localStorage (from SingleItemForm and MultipleItemUpload)
  useEffect(() => {
    // Get items from localStorage (saved by SingleItemForm and MultipleItemUpload)
    const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
    
    // Get existing item metadata (location/quantity info)
    const storedItemMeta = JSON.parse(localStorage.getItem('itemMeta') || '{}');
    
    // Combine base items with their location/quantity data
    const itemsWithMeta = storedItems.map(item => {
      const key = `${item.itemName}_${item.brand}`;
      const meta = storedItemMeta[key];
      
      return {
        id: item.id,
        itemName: item.itemName,
        brand: item.brand,
        quantity: meta?.quantity || 0,
        location: meta?.location || 'Not Set'
      };
    });
    
    // Fallback mock data if no items in localStorage
    if (itemsWithMeta.length === 0) {
      const mockData = [
        { id: 1, itemName: 'Laptop', brand: 'Dell', quantity: 5, location: 'Warehouse A' },
        { id: 2, itemName: 'Phone', brand: 'Apple', quantity: 10, location: 'Store B' },
        { id: 3, itemName: 'Tablet', brand: 'Samsung', quantity: 3, location: 'Warehouse C' },
      ];
      setItems(mockData);
    } else {
      setItems(itemsWithMeta);
    }
  }, []);

  // Compute unique brands and locations
  const uniqueBrands = [...new Set(items.map(item => item.brand))];
  const uniqueLocations = [...new Set(items.map(item => item.location))];

  // Filter items based on search and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand ? item.brand === selectedBrand : true;
    const matchesLocation = selectedLocation ? item.location === selectedLocation : true;
    return matchesSearch && matchesBrand && matchesLocation;
  });

  // Compute total stock by item key (sum all matching entries, not just filtered)
  const totalByItemKey = items.reduce((acc, item) => {
    const key = `${(item.itemName || '').toLowerCase()}|${(item.brand || '').toLowerCase()}`;
    if (!acc[key]) acc[key] = 0;
    acc[key] += Number(item.quantity) || 0;
    return acc;
  }, {});

  // Handle item selection from the table
  const handleSelectItem = (item) => {
    setSelectedItem(item); // Set the selected item for forms
  };

  // Handle form submissions - save to localStorage
  const handleManageQuantitySubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      const newQuantity = parseInt(e.target.editQuantity.value);
      const key = `${selectedItem.itemName}_${selectedItem.brand}`;
      // Update itemMeta in localStorage
      const storedItemMeta = JSON.parse(localStorage.getItem('itemMeta') || '{}');
      if (!storedItemMeta[key]) storedItemMeta[key] = {};
      storedItemMeta[key].quantity = newQuantity;
      localStorage.setItem('itemMeta', JSON.stringify(storedItemMeta));
      // Update local state
      const updatedItems = items.map(item => 
        item.id === selectedItem.id ? { ...item, quantity: newQuantity } : item
      );
      setItems(updatedItems);
      alert(`Quantity for ${selectedItem.itemName} updated to ${newQuantity}`);
      setSelectedItem(null); // Clear the form
    }
  };

  const handleAddNewLocationSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      const newLocation = e.target.newLocation.value;
      const key = `${selectedItem.itemName}_${selectedItem.brand}`;
      // Update itemMeta in localStorage
      const storedItemMeta = JSON.parse(localStorage.getItem('itemMeta') || '{}');
      if (!storedItemMeta[key]) storedItemMeta[key] = {};
      storedItemMeta[key].location = newLocation;
      localStorage.setItem('itemMeta', JSON.stringify(storedItemMeta));
      // Update local state
      const updatedItems = items.map(item => 
        item.id === selectedItem.id ? { ...item, location: newLocation } : item
      );
      setItems(updatedItems);
      alert(`Location for ${selectedItem.itemName} updated to ${newLocation}`);
      setSelectedItem(null); // Clear the form
    }
  };

  const handleItemShiftSubmit = (e) => {
    e.preventDefault();
    if (selectedItem) {
      const newQuantity = parseInt(e.target.newQuantity.value);
      const newLocation = e.target.newLocationShift.value;
      const key = `${selectedItem.itemName}_${selectedItem.brand}`;
      // Update itemMeta in localStorage
      const storedItemMeta = JSON.parse(localStorage.getItem('itemMeta') || '{}');
      if (!storedItemMeta[key]) storedItemMeta[key] = {};
      storedItemMeta[key].quantity = newQuantity;
      storedItemMeta[key].location = newLocation;
      localStorage.setItem('itemMeta', JSON.stringify(storedItemMeta));
      // Update local state
      const updatedItems = items.map(item => 
        item.id === selectedItem.id ? { ...item, quantity: newQuantity, location: newLocation } : item
      );
      setItems(updatedItems);
      alert(`Item ${selectedItem.itemName} shifted with quantity ${newQuantity} to ${newLocation}`);
      setSelectedItem(null); // Clear the form
    }
  };

  return (
    <div className="item-locator-page">
      <h1 className="text-center">Item Locator Page</h1>
      <div className="tab-buttons-row">
        <button
          className={selectedTab === 'viewOnly' ? 'active' : ''}
          onClick={() => setSelectedTab('viewOnly')}
        >
          View Only
        </button>
        <button
          className={selectedTab === 'manageQuantity' ? 'active' : ''}
          onClick={() => setSelectedTab('manageQuantity')}
        >
          Manage Quantity
        </button>
        <button
          className={selectedTab === 'addNewLocation' ? 'active' : ''}
          onClick={() => setSelectedTab('addNewLocation')}
        >
          Add New Location
        </button>
        <button
          className={selectedTab === 'itemShift' ? 'active' : ''}
          onClick={() => setSelectedTab('itemShift')}
        >
          Item Shift
        </button>
      </div>

      <div className={`item-locator-main-two-cols${selectedTab === 'viewOnly' ? ' view-only' : ''}`}> 
        <div className={`item-list-section${selectedTab === 'viewOnly' ? ' full-width' : ''}`}> 
          <div className="search-section">
            <div className="search-controls">
              <div className="search-field">
                <label>Search Item Name</label>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Enter item name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="search-field">
                <label>Filter by Brand</label>
                <select
                  className="search-input"
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                >
                  <option value="">All Brands</option>
                  {uniqueBrands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>
              <div className="search-field">
                <label>Filter by Location</label>
                <select
                  className="search-input"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              <button
                className="search-btn clear-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedBrand('');
                  setSelectedLocation('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Brand</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Total Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const key = `${(item.itemName || '').toLowerCase()}|${(item.brand || '').toLowerCase()}`;
                const totalStock = totalByItemKey[key] ?? (Number(item.quantity) || 0);
                return (
                  <tr key={item.id} onClick={() => handleSelectItem(item)} style={{ cursor: 'pointer' }}>
                    <td>{item.itemName}</td>
                    <td>{item.brand}</td>
                    <td>{item.quantity}</td>
                    <td>{item.location}</td>
                    <td>{totalStock}</td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
                    No Items Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {selectedTab !== 'viewOnly' && (
          <div className="form-section">
            {selectedTab === 'manageQuantity' && (
              <div>
                <h3>Manage Quantity</h3>
                <form onSubmit={handleManageQuantitySubmit}>
                  <div>
                    <label>Item Name</label>
                    <input type="text" value={selectedItem?.itemName || ''} readOnly />
                  </div>
                  <div>
                    <label>Brand</label>
                    <input type="text" value={selectedItem?.brand || ''} readOnly />
                  </div>
                  <div>
                    <label>Location</label>
                    <input type="text" value={selectedItem?.location || ''} readOnly />
                  </div>
                  <div>
                    <label>Edit Quantity</label>
                    <input type="number" name="editQuantity" defaultValue={selectedItem?.quantity || ''} required />
                  </div>
                  <button type="submit">Update Quantity</button>
                </form>
              </div>
            )}
            {selectedTab === 'addNewLocation' && (
              <div>
                <h3>Add New Location</h3>
                <form onSubmit={handleAddNewLocationSubmit}>
                  <div>
                    <label>Item Name</label>
                    <input type="text" value={selectedItem?.itemName || ''} readOnly />
                  </div>
                  <div>
                    <label>Brand</label>
                    <input type="text" value={selectedItem?.brand || ''} readOnly />
                  </div>
                  <div>
                    <label>Quantity</label>
                    <input type="text" value={selectedItem?.quantity || ''} readOnly />
                  </div>
                  <div>
                    <label>New Location</label>
                    <input type="text" name="newLocation" required />
                  </div>
                  <button type="submit">Update Location</button>
                </form>
              </div>
            )}
            {selectedTab === 'itemShift' && (
              <div>
                <h3>Item Shift</h3>
                <form onSubmit={handleItemShiftSubmit}>
                  <div className="form-row-inline">
                    <div>
                      <label>Item Name</label>
                      <input type="text" value={selectedItem?.itemName || ''} readOnly />
                    </div>
                    <div>
                      <label>Brand</label>
                      <input type="text" value={selectedItem?.brand || ''} readOnly />
                    </div>
                  </div>
                  <div>
                    <label>Old Quantity</label>
                    <input type="text" value={selectedItem?.quantity || ''} readOnly />
                  </div>
                  <div>
                    <label>Old Location</label>
                    <input type="text" value={selectedItem?.location || ''} readOnly />
                  </div>
                  <div>
                    <label>New Quantity</label>
                    <input type="number" name="newQuantity" required />
                  </div>
                  <div>
                    <label>New Location</label>
                    <input type="text" name="newLocationShift" required />
                  </div>
                  <button type="submit">Shift Item</button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemLocatorPage;