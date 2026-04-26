import React from 'react';

const Shipping = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Shipping & Delivery Policy</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <p>Last Updated: April 2024</p>
        
        <h3>1. Processing Time</h3>
        <p>As our products are custom-made, please allow 3-5 business days for design and printing before shipping.</p>
        
        <h3>2. Delivery Timelines</h3>
        <ul>
          <li>Metro Cities: 3-5 business days after dispatch.</li>
          <li>Rest of India: 5-8 business days after dispatch.</li>
        </ul>
        
        <h3>3. Shipping Charges</h3>
        <p>Shipping charges are calculated at checkout. We currently offer free shipping on all orders over ₹1500.</p>
        
        <h3>4. Tracking</h3>
        <p>Once your order is shipped, you will receive a tracking link via WhatsApp/Email.</p>
      </div>
    </div>
  </div>
);

export default Shipping;
