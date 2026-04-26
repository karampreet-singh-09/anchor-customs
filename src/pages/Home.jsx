import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, Heart, Truck, CheckCircle, ArrowDown } from 'lucide-react';
import { TEMPLATES } from '../utils/data';

const Home = () => {
  const collectionRef = useRef(null);

  const scrollToCollection = () => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: <Camera size={24} />, title: 'Premium Edition', desc: 'Museum-quality printing on artisanal paper.' },
    { icon: <Heart size={24} />, title: 'Modern Heirlooms', desc: 'Personalized designs meant to last generations.' },
    { icon: <Truck size={24} />, title: 'Priority Fulfillment', desc: 'Secure doorstep delivery across India in 5-7 days.' },
    { icon: <CheckCircle size={24} />, title: 'Seamless Experience', desc: 'Your story, curated by our professional templates.' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="starred-bg" style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: 'var(--bg)',
        overflow: 'hidden',
        position: 'relative',
        padding: '4rem 0'
      }}>
        <div className="container hero-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          alignItems: 'center', 
          gap: '4rem',
          textAlign: 'center' 
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <span style={{ color: 'var(--accent)', fontWeight: '600', letterSpacing: '4px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Establish 2024</span>
            <h1 className="hero-title">Your Life, <br /> Curated as <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Art.</span></h1>
            <p className="hero-desc">
              Transform your digital moments into a professionally bound, luxury photo magazine. A timeless gift for those who matter most. 
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={scrollToCollection} className="btn btn-primary hero-btn">
                View Collection <ArrowDown size={18} />
              </button>
              <Link to="/contact" className="btn btn-outline hero-btn">The Craft</Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            <div className="hero-image-container" aria-label="Luxury Custom Photo Magazine Preview"></div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar - SEO & Conversion Booster */}
      <section style={{ backgroundColor: '#080c14', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '2rem',
            textAlign: 'center',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 'bold' }}>500+</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Happy Customers</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 'bold' }}>100% Secure</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Razorpay Protected</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 'bold' }}>Artisanal</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Quality Guaranteed</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent)', fontSize: '1.5rem', fontWeight: 'bold' }}>Worldwide</span>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7 }}>Tracked Shipping</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Collection Section */}
      <section ref={collectionRef} className="section-padding" style={{ backgroundColor: 'var(--bg-offset)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Magazines that tell your story</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Each design is a bespoke canvas for your most cherished moments.</p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {TEMPLATES.map((template, index) => (
              <motion.div 
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/template/${template.id}`} className="card gift-border" style={{ 
                  display: 'block',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  height: '100%'
                }}>
                  <div style={{ position: 'relative', height: '400px', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(197, 160, 89, 0.05)',
                      mixBlendMode: 'sepia',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}></div>
                    
                    <img 
                      src={template.image} 
                      alt={template.name} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover', 
                        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      className="template-img"
                    />
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>{template.category}</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', opacity: 0.8 }}>₹{template.price10}</span>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>{template.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0' }}>
                      {template.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section style={{ padding: '10rem 0', backgroundColor: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontStyle: 'italic', lineHeight: 1.4, marginBottom: '2rem' }}>
            "A photo is a secret about a secret. The more it tells you, the less you know."
          </motion.p>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--accent)', margin: '0 auto 2rem' }}></div>
          <span style={{ textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem', opacity: 0.7 }}>Anchor Customs Collective</span>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Impeccable Quality</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We don't just print magazines; we preserve legacies.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                style={{ 
                  textAlign: 'center', 
                  padding: '3rem 2rem', 
                  backgroundColor: 'var(--glass)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)' 
                }}
              >
                <div style={{ color: 'var(--accent)', marginBottom: '2rem' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '8rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="container">
          <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem' }}>Ready to Gift a Memory?</h2>
          <Link to="/gallery" className="btn btn-accent" style={{ padding: '1.5rem 4rem', fontSize: '1.2rem' }}>Start Customizing</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
