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
    const [highlightedDuplicateId, setHighlightedDuplicateId] = useState(null);
    const [shiftErrorMsg, setShiftErrorMsg] = useState("");

    // Fetch data from localStorage (from SingleItemForm and MultipleItemUpload)
    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('items') || '[]');

        // Get existing item metadata (location/quantity info)
        const storedItemMeta = JSON.parse(localStorage.getItem('itemMeta') || '{}');

        // Combine base items with their location/quantity data, but do NOT auto-update location/qty for duplicate name+brand
        // Only the first occurrence (by id) gets the meta, others get their own default
        const seen = new Set();
        const itemsWithMeta = storedItems.map(item => {
            const key = `${item.itemName}_${item.brand}`;
            let meta = undefined;
            if (!seen.has(key)) {
                meta = storedItemMeta[key];
                seen.add(key);
            }
            return {
                id: item.id,
                itemName: item.itemName,
                brand: item.brand,
                quantity: meta?.quantity ?? item.quantity ?? 0,
                location: meta?.location ?? item.location ?? 'Not Set'
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

    // Clear selection and highlight when switching tabs
    useEffect(() => {
        setSelectedItem(null);
        setHighlightedDuplicateId(null);
    }, [selectedTab]);

    // Compute unique brands and locations
    const uniqueBrands = [...new Set(items.map(item => item.brand))];
    const uniqueLocations = [...new Set(items.map(item => item.location))];

    // Filter items based on search and filters
    const filteredItems = items.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBrand = selectedBrand ? item.brand.toLowerCase().includes(selectedBrand.toLowerCase()) : true;
        const matchesLocation = selectedLocation ? item.location.toLowerCase().includes(selectedLocation.toLowerCase()) : true;
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

    // Handle item deletion
    const [deleteModal, setDeleteModal] = useState({ show: false, itemId: null, itemName: '' });

    const handleDeleteItem = (itemId) => {
        const item = items.find(i => i.id === itemId);
        setDeleteModal({ show: true, itemId: itemId, itemName: item?.itemName || 'this item' });
    };

    const confirmDelete = () => {
        const itemId = deleteModal.itemId;
        // Remove from localStorage items
        const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
        const updatedStoredItems = storedItems.filter(item => item.id !== itemId);
        localStorage.setItem('items', JSON.stringify(updatedStoredItems));

        // Remove from local state
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);

        // Clear selected item if it was the one being deleted
        if (selectedItem && selectedItem.id === itemId) {
            setSelectedItem(null);
        }

        setDeleteModal({ show: false, itemId: null, itemName: '' });
    };

    const cancelDelete = () => {
        setDeleteModal({ show: false, itemId: null, itemName: '' });
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
            setSelectedItem(null); // Clear the form
            e.target.reset(); // Clear form fields
        }
    };

    const [addLocationMsg, setAddLocationMsg] = useState("");
    const handleAddNewLocationSubmit = (e) => {
        e.preventDefault();
        setAddLocationMsg("");
        if (selectedItem) {
            const newLocation = e.target.newLocation.value;
            const newQuantity = parseInt(e.target.editQuantity.value);
            // If selected entry has no location, update it
            if (!selectedItem.location || selectedItem.location === '' || selectedItem.location === 'Not Set') {
                const updatedItems = items.map(item =>
                    item.id === selectedItem.id ? { ...item, location: newLocation, quantity: newQuantity } : item
                );
                localStorage.setItem('items', JSON.stringify(updatedItems));
                setItems(updatedItems);
                setSelectedItem(null);
                e.target.reset();
                return;
            }
            // Check for duplicate (same name+brand+location)
            const duplicate = items.find(
                (item) =>
                    item.itemName.trim().toLowerCase() === selectedItem.itemName.trim().toLowerCase() &&
                    item.brand.trim().toLowerCase() === selectedItem.brand.trim().toLowerCase() &&
                    (item.location?.trim().toLowerCase() || '') === newLocation.trim().toLowerCase()
            );
            if (duplicate) {
                setAddLocationMsg("Entry with this item name, brand, and location already exists.");
                setHighlightedDuplicateId(duplicate.id);
                return;
            }
            // If selected entry has a location and new location is different, add a new entry
            const storedItems = JSON.parse(localStorage.getItem('items') || '[]');
            const newItem = {
                id: Date.now(),
                itemName: selectedItem.itemName,
                brand: selectedItem.brand,
                location: newLocation,
                quantity: newQuantity
            };
            storedItems.push(newItem);
            localStorage.setItem('items', JSON.stringify(storedItems));
            setItems([...items, newItem]);
            setSelectedItem(null); // Clear the form
            e.target.reset(); // Clear form fields
        }
    };

    const handleItemShiftSubmit = (e) => {
        e.preventDefault();
        setShiftErrorMsg("");
        if (selectedItem) {
            const shiftQty = parseInt(e.target.newQuantity.value);
            const newLocation = e.target.newLocationShift.value;
            if (isNaN(shiftQty) || shiftQty <= 0) {
                setShiftErrorMsg("Enter a valid quantity to shift.");
                return;
            }
            if (shiftQty > selectedItem.quantity) {
                setShiftErrorMsg("Cannot shift more than available quantity.");
                return;
            }

            // Subtract quantity from old location
            let updatedItems = items.map(item =>
                item.id === selectedItem.id ? { ...item, quantity: item.quantity - shiftQty } : item
            );

            // Check if entry for new location exists (same name+brand+location)
            const existing = updatedItems.find(
                (item) =>
                    item.itemName.trim().toLowerCase() === selectedItem.itemName.trim().toLowerCase() &&
                    item.brand.trim().toLowerCase() === selectedItem.brand.trim().toLowerCase() &&
                    (item.location?.trim().toLowerCase() || '') === newLocation.trim().toLowerCase()
            );
            if (existing) {
                // Add quantity to existing entry
                updatedItems = updatedItems.map(item =>
                    item.id === existing.id ? { ...item, quantity: item.quantity + shiftQty } : item
                );
            } else {
                // Create new entry for new location
                const newItem = {
                    id: Date.now(),
                    itemName: selectedItem.itemName,
                    brand: selectedItem.brand,
                    location: newLocation,
                    quantity: shiftQty
                };
                updatedItems = [...updatedItems, newItem];
            }
            // Remove any items with 0 quantity
            updatedItems = updatedItems.filter(item => item.quantity > 0);
            setItems(updatedItems);
            localStorage.setItem('items', JSON.stringify(updatedItems));
            setSelectedItem(null); // Clear the form
            e.target.reset(); // Clear form fields
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
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search brand..."
                                    value={selectedBrand}
                                    onChange={(e) => setSelectedBrand(e.target.value)}
                                />
                            </div>
                            <div className="search-field">
                                <label>Filter by Location</label>
                                <input
                                    type="text"
                                    className="search-input"
                                    placeholder="Search location..."
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                />
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item) => {
                                const key = `${(item.itemName || '').toLowerCase()}|${(item.brand || '').toLowerCase()}`;
                                const totalStock = totalByItemKey[key] ?? (Number(item.quantity) || 0);
                                const isHighlighted = highlightedDuplicateId === item.id;
                                const isSelected = selectedItem && selectedItem.id === item.id && !isHighlighted;
                                const handleRowClick = () => {
                                    if (isHighlighted) {
                                        setHighlightedDuplicateId(null);
                                    }
                                    setAddLocationMsg("");
                                    handleSelectItem(item);
                                };
                                let rowStyle = {};
                                let cellStyle = { cursor: 'pointer', fontWeight: isHighlighted || isSelected ? 'bold' : undefined };
                                if (isHighlighted) {
                                    rowStyle = { background: '#ffd6d6', transition: 'background 0.3s' };
                                    cellStyle = { ...cellStyle, color: 'red' };
                                } else if (isSelected) {
                                    rowStyle = { background: '#44bb44ff', transition: 'background 0.3s' };
                                }
                                return (
                                    <tr key={item.id} style={rowStyle}>
                                        <td onClick={handleRowClick} style={cellStyle}>{item.itemName}</td>
                                        <td onClick={handleRowClick} style={cellStyle}>{item.brand}</td>
                                        <td onClick={handleRowClick} style={cellStyle}>{item.quantity}</td>
                                        <td onClick={handleRowClick} style={cellStyle}>{item.location}</td>
                                        <td onClick={handleRowClick} style={cellStyle}>{totalStock}</td>
                                        <td>
                                            <button
                                                className="delete-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteItem(item.id);
                                                }}
                                            >
                                                ❌
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '16px' }}>
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
                                        <input type="number" name="editQuantity" key={selectedItem?.id || 'empty'} defaultValue={selectedItem?.quantity || ''} required />
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
                                        <label>Edit Quantity</label>
                                        <input type="number" name="editQuantity" key={selectedItem?.id || 'empty'} defaultValue={selectedItem?.quantity || ''} required />
                                    </div>
                                    <div>
                                        <label>New Location</label>
                                        <input type="text" name="newLocation" key={selectedItem?.id || 'empty'} required />
                                    </div>
                                    <button type="submit">Update Location</button>
                                </form>
                                {addLocationMsg && (
                                    <div style={{ color: 'red', marginTop: 8, fontWeight: 'bold' }}>{addLocationMsg}</div>
                                )}
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
                                        <input type="number" name="newQuantity" key={selectedItem?.id || 'empty'} required />
                                    </div>
                                    <div>
                                        <label>New Location</label>
                                        <input type="text" name="newLocationShift" key={selectedItem?.id ? `${selectedItem.id}-location` : 'empty-location'} required />
                                    </div>
                                    <button type="submit">Shift Item</button>
                                    {shiftErrorMsg && <div style={{ color: 'red', marginTop: 8, fontWeight: 'bold' }}>{shiftErrorMsg}</div>}
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete "{deleteModal.itemName}"?</p>
                        <div className="modal-buttons">
                            <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
                            <button className="confirm-btn" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemLocatorPage;