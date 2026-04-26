import React from 'react';

const Refund = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Refund & Cancellation Policy</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <p>Last Updated: April 2024</p>
        
        <h3>1. Cancellations</h3>
        <p>Since every magazine is custom-made, orders can only be cancelled within 2 hours of placement. Once production has started, we cannot offer cancellations.</p>
        
        <h3>2. Refunds</h3>
        <p>We offer full refunds or free replacements only if:</p>
        <ul>
          <li>The product arrived damaged during shipping.</li>
          <li>There is a manufacturing defect or printing error.</li>
        </ul>
        
        <h3>3. Process</h3>
        <p>To request a refund, please email us with photos of the damaged product within 48 hours of delivery.</p>
      </div>
    </div>
  </div>
);

export default Refund;
