import React from 'react'
import './EnquiryData.css'

const EnquiryData = () => {
  // Static dummy data for display - Bearing Data
  const dummyItems = [
    { date: '2025-10-25', salesPerson: 'Rajesh Kumar', qtPiEnq: 'QT-2025', branch: 'Mumbai', customer: 'Industrial Motors Ltd', itemName: '6205 Deep Groove Ball Bearing', brand: 'SKF', qty: 50, rate: 450, discount: 50, amount: 22450 },
    { date: '2025-10-26', salesPerson: 'Priya Sharma', qtPiEnq: 'PI-2026', branch: 'Delhi', customer: 'Precision Engineering', itemName: '6206 ZZ Ball Bearing', brand: 'FAG', qty: 100, rate: 380, discount: 30, amount: 37970 },
    { date: '2025-10-27', salesPerson: 'Amit Patel', qtPiEnq: 'ENQ-2027', branch: 'Bangalore', customer: 'Auto Parts Co', itemName: '6208 2RS Sealed Bearing', brand: 'NTN', qty: 75, rate: 520, discount: 40, amount: 38960 },
    { date: '2025-10-28', salesPerson: 'Sneha Reddy', qtPiEnq: 'QT-2028', branch: 'Chennai', customer: 'Heavy Machinery Works', itemName: '22205 Spherical Roller Bearing', brand: 'Timken', qty: 30, rate: 1850, discount: 150, amount: 55350 },
    { date: '2025-10-23', salesPerson: 'Vikram Singh', qtPiEnq: 'QT-2023', branch: 'Pune', customer: 'Pump Solutions', itemName: '6305 Deep Groove Ball Bearing', brand: 'NSK', qty: 60, rate: 680, discount: 80, amount: 40720 },
    { date: '2025-10-24', salesPerson: 'Ananya Iyer', qtPiEnq: 'PI-2024', branch: 'Hyderabad', customer: 'Steel Mill Industries', itemName: '32208 Tapered Roller Bearing', brand: 'SKF', qty: 40, rate: 1250, discount: 100, amount: 49900 },
    { date: '2025-10-22', salesPerson: 'Karthik Menon', qtPiEnq: 'ENQ-2022', branch: 'Mumbai', customer: 'Conveyor Systems Ltd', itemName: '6204 RS Ball Bearing', brand: 'FAG', qty: 120, rate: 320, discount: 20, amount: 38380 },
    { date: '2025-10-21', salesPerson: 'Divya Nair', qtPiEnq: 'QT-2021', branch: 'Kolkata', customer: 'Marine Equipment Co', itemName: 'NU 208 Cylindrical Roller Bearing', brand: 'NTN', qty: 25, rate: 2100, discount: 200, amount: 52300 },
    { date: '2025-10-20', salesPerson: 'Rohit Sharma', qtPiEnq: 'PI-2020', branch: 'Delhi', customer: 'Textile Machinery', itemName: '51205 Thrust Ball Bearing', brand: 'Timken', qty: 80, rate: 890, discount: 90, amount: 71110 },
    { date: '2025-10-19', salesPerson: 'Meera Desai', qtPiEnq: 'ENQ-2019', branch: 'Ahmedabad', customer: 'Food Processing Plant', itemName: '6207 2RS Ball Bearing', brand: 'NSK', qty: 90, rate: 470, discount: 50, amount: 42250 },
    { date: '2025-10-18', salesPerson: 'Arjun Kapoor', qtPiEnq: 'QT-2018', branch: 'Jaipur', customer: 'Mining Equipment Ltd', itemName: '22210 E Spherical Roller Bearing', brand: 'SKF', qty: 20, rate: 3500, discount: 300, amount: 69700 },
    { date: '2025-10-17', salesPerson: 'Pooja Reddy', qtPiEnq: 'PI-2017', branch: 'Bangalore', customer: 'Power Generation Co', itemName: '6310 Deep Groove Ball Bearing', brand: 'FAG', qty: 45, rate: 1100, discount: 100, amount: 49400 },
    { date: '2025-10-16', salesPerson: 'Sanjay Gupta', qtPiEnq: 'ENQ-2016', branch: 'Chennai', customer: 'Agricultural Machinery', itemName: '30205 Tapered Roller Bearing', brand: 'NTN', qty: 65, rate: 750, discount: 60, amount: 48690 },
    { date: '2025-10-15', salesPerson: 'Neha Agarwal', qtPiEnq: 'QT-2015', branch: 'Pune', customer: 'Paper Mill Industries', itemName: 'UCF 205 Pillow Block Bearing', brand: 'Timken', qty: 35, rate: 1650, discount: 150, amount: 57600 },
    { date: '2025-10-14', salesPerson: 'Ravi Kumar', qtPiEnq: 'PI-2014', branch: 'Hyderabad', customer: 'Cement Plant', itemName: '6209 ZZ Ball Bearing', brand: 'NSK', qty: 110, rate: 590, discount: 50, amount: 64850 },
    { date: '2025-10-13', salesPerson: 'Kavya Rao', qtPiEnq: 'ENQ-2013', branch: 'Mumbai', customer: 'Electric Motor Works', itemName: '6203 2RS Ball Bearing', brand: 'SKF', qty: 150, rate: 280, discount: 30, amount: 41970 }
  ]

  return (
    <div>
      <div className="data-panel-wrapper data-card">
        <div className="data-panel-header">
          <h3 className='data-heading'>Enquiry</h3>
        </div>
        <div className="data-table-container">
          <table className="data-records-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Sales Person</th>
                <th>QT/PI/Enq</th>               
                <th>Branch</th>
                <th>Customer Name</th>
                <th>Item Name</th>
                <th>Brand</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Discount</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dummyItems.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input type="date" value={row.date} readOnly />
                  </td>
                  <td>
                    <input value={row.salesPerson} readOnly />
                  </td>
                  <td>
                    <input value={row.qtPiEnq} readOnly />
                  </td>
                  <td>
                    <input value={row.branch} readOnly />
                  </td>
                  <td>
                    <input value={row.customer} readOnly />
                  </td>
                  <td>
                    <input value={row.itemName} readOnly />
                  </td>
                  <td>
                    <input value={row.brand} readOnly />
                  </td>
                  <td>
                    <input type="number" value={row.qty} readOnly />
                  </td>
                  <td>
                    <input type="number" value={row.rate} readOnly />
                  </td>
                  <td>
                    <input type="number" value={row.discount} readOnly />
                  </td>
                  <td>₹{row.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  )
}

export default EnquiryData