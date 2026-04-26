import React from 'react';

const Privacy = () => (
  <div className="section-padding">
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1>Privacy Policy</h1>
      <div style={{ lineHeight: '1.8', color: 'var(--text-muted)' }}>
        <p>Last Updated: April 2024</p>
        <p>At Anchor Customs, we prioritize the privacy of your personal photos and data.</p>
        
        <h3>1. Data Collection</h3>
        <p>We collect your name, email, phone number, and delivery address to process your orders. Your uploaded photos are stored securely and only used for printing your custom magazine.</p>
        
        <h3>2. Storage & Security</h3>
        <p>We use industry-standard encryption to protect your data. Photos are deleted from our active production servers 30 days after the order is delivered.</p>
        
        <h3>3. Third-Party Sharing</h3>
        <p>We do not sell or trade your personal information. We only share data with shipping partners and payment processors (like Razorpay) to complete your transaction.</p>
      </div>
    </div>
  </div>
);

export default Privacy;
