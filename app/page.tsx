"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Home() {
  // --- 1. Slider Gallery State ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentSlide(index);

  // --- 2. FAQ / Accordion State ---
  const [activeAccordion, setActiveAccordion] = useState<string | null>("overview");

  const toggleAccordion = (id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id));
  };

  // --- 3. Magic Jars State ---
  const [jarAmount, setJarAmount] = useState<string>("");
  const [jarSplits, setJarSplits] = useState({ spend: 0, save: 0, give: 0 });
  const [isJarAnimated, setIsJarAnimated] = useState(false);

  const calculateJarSplits = () => {
    const amount = parseFloat(jarAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount!");
      return;
    }
    setJarSplits({
      spend: Math.round(amount * 0.5),
      save: Math.round(amount * 0.4),
      give: Math.round(amount * 0.1),
    });
    setIsJarAnimated(false);
    setTimeout(() => setIsJarAnimated(true), 10);
  };

  // --- 4. Depreciation State ---
  const [depYear, setDepYear] = useState(0);
  const [depValue, setDepValue] = useState(5000);
  const [depMessage, setDepMessage] = useState("Brand new! No value lost yet.");
  const maxDepYears = 15;
  const initialDepValue = 5000;

  const handleDepreciate = () => {
    if (depYear < maxDepYears) {
      const nextYear = depYear + 1;
      const rate = 0.15;
      const lost = depValue * rate;
      const newValue = depValue - lost;
      
      setDepYear(nextYear);
      setDepValue(newValue);
      
      if (nextYear >= maxDepYears) {
        setDepMessage(`After ${maxDepYears} years, it's barely worth anything! That's depreciation.`);
      } else {
        setDepMessage(`Lost ₹${Math.round(lost).toLocaleString()} in value this year! 📉`);
      }
    }
  };

  const resetDepreciation = () => {
    setDepYear(0);
    setDepValue(initialDepValue);
    setDepMessage("Brand new! No value lost yet.");
  };

  // --- 5. Wealth Builder State ---
  const [monthlyInv, setMonthlyInv] = useState("1000");
  const [invYears, setInvYears] = useState("10");
  const [invResults, setInvResults] = useState<{ fd: number; gold: number; index: number; total: number } | null>(null);

  const calculateSIP = (p: number, r: number, y: number) => {
    if (r === 0) return p * y * 12;
    const i = r / 12 / 100;
    const n = y * 12;
    return Math.round(p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
  };

  const handleWealthCalc = () => {
    const p = parseFloat(monthlyInv);
    const y = parseFloat(invYears);
    if (isNaN(p) || isNaN(y) || p <= 0 || y <= 0) return;
    const total = p * y * 12;
    const fd = calculateSIP(p, 7, y);
    const gold = calculateSIP(p, 9, y);
    const index = calculateSIP(p, 12, y);
    setInvResults({ fd, gold, index, total });
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="top-banner">
        <span>PRODUCT OF SIYA 🎁</span>
        <span className="currency-selector">India | INR ₹ </span>
      </div>

      {/* Main Navigation Header */}
      <header className="main-header" id="mainHeader">
        <div className="container header-container">
          <a href="#" className="logo">
            <img src="https://placehold.co/200x50/2d8b94/fad129?text=Learn+What+Matters&font=Montserrat" alt="Learn What Matters Logo" />
          </a>

          <nav className="desktop-nav">
            <a href="#">Home</a>
            <a href="#" className="active">Young hustlers</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
          </nav>

          <div className="header-icons">
            <button aria-label="Search" className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
            <button aria-label="User Account" className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            <button aria-label="Cart" className="icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Product Layout Section */}
      <main className="product-layout container" id="overview">
        {/* Interactive Slider Gallery */}
        <div className="product-gallery slider-gallery">
          <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            <img src="/product1.png" alt="Kidpreneur Complete Bundle Box Set" className="slider-slide" />
            <img src="/product2.png" alt="Money Management Jars - Spend, Save, Give" className="slider-slide" />
            <img src="/product3.png" alt="Kidpreneur Success Concept" className="slider-slide" />
          </div>

          <button className="slider-btn prev-btn" onClick={prevSlide} aria-label="Previous image">❮</button>
          <button className="slider-btn next-btn" onClick={nextSlide} aria-label="Next image">❯</button>

          <div className="slider-dots">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`dot ${currentSlide === i ? "active" : ""}`} onClick={() => goToSlide(i)}></span>
            ))}
          </div>
        </div>

        {/* Sticky Right Details Area */}
        <div className="product-details">
          <div className="trust-badge">TRUSTED BY 100+ PARENTS ACROSS INDIA IN</div>

          <h1 className="product-title">SIYA – The Kidpreneur Mastery Program (4 Levels | Ages 7–14)</h1>

          <div className="quote-box">
            <p>“Teach your child money, leadership & problem-solving — before school ever does.”</p>
          </div>

          <div className="price-section">
            <span className="old-price">Rs. 2,998.00</span>
            <span className="current-price">Rs. 1,799.00</span>
            <span className="sale-badge">SALE</span>
          </div>

          <div className="reviews-summary">
            <div className="stars">★★★★★</div>
            <span className="review-count">686 reviews</span>
          </div>

          <div className="variant-selector">
            <div className="variant-options">
              <div className="variant-card selected" style={{ cursor: "default", pointerEvents: "none" }}>
                <div className="variant-info">
                  <span className="variant-title" style={{ fontSize: "1.1rem", marginBottom: "4px" }}>Complete 4-Level Kidpreneur Bundle</span>
                  <span className="variant-desc">Includes everything you need to start the journey (Ages 7-14).</span>
                </div>
              </div>
            </div>
          </div>

          <button className="add-to-cart-btn btn-primary pulse">
            Add to cart
          </button>

          <div className="product-features-grid">
            <div className="feature-box">
              <div className="feature-icon bg-pink">🧠</div>
              <span className="feature-text">Builds real-world thinking</span>
            </div>
            <div className="feature-box">
              <div className="feature-icon bg-gray">💼</div>
              <span className="feature-text">Entrepreneurship & money skills</span>
            </div>
            <div className="feature-box">
              <div className="feature-icon bg-yellow">🤝</div>
              <span className="feature-text">7 DAY MONEYBACK GUARANTEE</span>
            </div>
          </div>

          <div className="trust-stats-pill">
            <span className="pill-item">✅ 40,000+ Parents</span>
            <span className="pill-item">⭐ 4.9/5 Rating</span>
            <span className="pill-item">🏫 Used in Schools</span>
          </div>

          <div className="shop-confidence-box">
            <p className="confidence-title">SHOP WITH CONFIDENCE</p>
            <p className="available-title">Officially Available On</p>
            <div className="market-buttons">
              <a href="#" className="market-btn">
                <img src="https://placehold.co/80x30/fff/333?text=Flipkart" alt="Flipkart" />
                <div className="market-rating">★★★★★ 4.5</div>
              </a>
              <a href="#" className="market-btn">
                <img src="https://placehold.co/80x30/fff/333?text=Amazon" alt="Amazon" />
                <div className="market-rating">★★★★★ 4.5</div>
              </a>
            </div>
            <div className="confidence-badges">
              <span><span className="badge-icon-green">✔</span> Verified Seller</span>
              <span><span className="badge-icon-green">✔</span> Easy Returns</span>
              <span><span className="badge-icon-green">✔</span> Trusted Brand</span>
            </div>
          </div>

          {/* Accordions for details */}
          <div className="product-accordions">
            <div className={`accordion-item ${activeAccordion === "overview" ? "active" : ""}`}>
              <button className="accordion-header" onClick={() => toggleAccordion("overview")}>
                <span className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg></span>
                Overview
                <span className="accordion-arrow"></span>
              </button>
              <div className="accordion-content" style={{ maxHeight: activeAccordion === "overview" ? "500px" : "0" }}>
                <p>Young Hustlers™ is a 4-Level Kids’ Entrepreneurship Workbook Bundle designed for ages 6–12. It makes learning fun, practical, and future-ready by covering:</p>
                <ul>
                  <li>💡 Money basics & smart decision-making</li>
                  <li>🚀 Creativity, problem-solving & innovation</li>
                  <li>🌟 Confidence, leadership & teamwork</li>
                </ul>
                <p>Each workbook is interactive, illustrated, and activity-based—so kids don’t just read, they do.</p>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === "shipping" ? "active" : ""}`}>
              <button className="accordion-header" onClick={() => toggleAccordion("shipping")}>
                <span className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg></span>
                Shipping and delivery
                <span className="accordion-arrow"></span>
              </button>
              <div className="accordion-content" style={{ maxHeight: activeAccordion === "shipping" ? "500px" : "0" }}>
                <ul>
                  <li>🚚 Ships within 24 hours from our warehouse</li>
                  <li>📦 Fast delivery via RapidShyp (2–6 days across India)</li>
                  <li>💳 COD (Cash on Delivery) + UPI + Cards accepted</li>
                  <li>🔄 Easy returns & 30-day money-back guarantee</li>
                </ul>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === "who" ? "active" : ""}`}>
              <button className="accordion-header" onClick={() => toggleAccordion("who")}>
                <span className="accordion-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg></span>
                Who is this for?
                <span className="accordion-arrow"></span>
              </button>
              <div className="accordion-content" style={{ maxHeight: activeAccordion === "who" ? "500px" : "0" }}>
                <p>❌ <strong>Tired of rote learning?</strong></p>
                <p>This bundle is for parents who want to give their child something schools don’t: Practical money & business skills, creativity, and leadership power.</p>
              </div>
            </div>
          </div>

          <div className="trust-icons-strip">
            <div className="trust-icon-box">
              <span className="secure-icon"></span>
              <span>Guaranteed safe & secure checkout</span>
            </div>
          </div>
        </div>
      </main>

      {/* Marquee Banner */}
      <div className="scrolling-marquee">
        <div className="marquee-content">
          <span>🚚 Fast delivery + helpful support</span> <span>✦</span>
          <span>✅ 40,000+ parents gifted Young Hustlers</span> <span>✦</span>
          <span>⭐ 4.9/5 rating by parents</span> <span>✦</span>
          <span>🏫 Used in 10+ schools & hostels</span> <span>✦</span>
          <span>💭 Kids actually enjoy money & business!</span> <span>✦</span>
          <span>🚚 Fast delivery + helpful support</span> <span>✦</span>
          <span>✅ 40,000+ parents gifted Young Hustlers</span> <span>✦</span>
          <span>⭐ 4.9/5 rating by parents</span> <span>✦</span>
        </div>
      </div>

      {/* Future Ready Skills Section */}
      <section className="future-skills container">
        <div className="future-skills-grid">
          <div className="future-image">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600" alt="Child learning" />
          </div>
          <div className="future-content">
            <h2>Future-Ready Skills — Learn Money & Business the Fun Way</h2>
            <p>Give your child a playful path to real-world skills. With Indian ₹ examples, mini-projects, and simple prompts, Young Hustlers™ builds money smarts, confidence, and leadership—all in kid-friendly pages parents can trust.</p>

            <div className="skills-tags">
              <span className="skill-tag">👨‍👩‍👧‍👦 Parent-approved</span>
              <span className="skill-tag">💰 Real-world money skills</span>
              <span className="skill-tag">🎯 Learn by doing</span>
            </div>
          </div>
        </div>
      </section>

      {/* Magic Jars Section */}
      <section className="magic-jars-section container">
        <div className="jars-header">
          <h3>The Three Magic Jars</h3>
          <p>Teach your child how to manage money: 50% Spend, 40% Save, 10% Give</p>
          <div className="money-input-wrapper">
            <input type="number" value={jarAmount} onChange={(e) => setJarAmount(e.target.value)} placeholder="Enter Amount (₹)" min="0" />
            <button onClick={calculateJarSplits} className="btn-primary">Calculate Split</button>
          </div>
        </div>

        <div className="jars-container">
          <div className="jar-item" id="jarSpend">
            <div className="jar-glass">
              <div className="jar-fill" style={{ height: isJarAnimated ? "50%" : "0%", backgroundColor: "var(--accent-yellow)", transition: "height 0.5s ease" }}></div>
              <div className="jar-label">SPEND</div>
            </div>
            <div className="jar-amount">₹{jarSplits.spend.toLocaleString()}</div>
            <div className="jar-percentage">50%</div>
          </div>

          <div className="jar-item" id="jarSave">
            <div className="jar-glass">
              <div className="jar-fill" style={{ height: isJarAnimated ? "40%" : "0%", backgroundColor: "var(--primary-teal)", transition: "height 0.5s ease" }}></div>
              <div className="jar-label">SAVE</div>
            </div>
            <div className="jar-amount">₹{jarSplits.save.toLocaleString()}</div>
            <div className="jar-percentage">40%</div>
          </div>

          <div className="jar-item" id="jarGive">
            <div className="jar-glass">
              <div className="jar-fill" style={{ height: isJarAnimated ? "10%" : "0%", backgroundColor: "#3b82f6", transition: "height 0.5s ease" }}></div>
              <div className="jar-label">GIVE</div>
            </div>
            <div className="jar-amount">₹{jarSplits.give.toLocaleString()}</div>
            <div className="jar-percentage">10%</div>
          </div>
        </div>
      </section>

      {/* Inflation Calculator Section */}
      <section className="inflation-section container">
        <div className="depreciation-card">
          <div className="chat-bubble">What is the "Inflation Monster"? 👾</div>
          <div className="chat-bubble">It makes things more expensive every year!</div>
          <div className="chat-bubble highlight">To beat it, you can't just save... you must INVEST! 📈</div>

          <div className="interactive-area calculator-area">
            <h3>The Wealth Builder Calculator</h3>
            <p style={{ marginBottom: "24px", color: "var(--text-muted)", fontWeight: 500 }}>See how different investments battle inflation over time.</p>

            <div className="input-group-row">
              <div className="input-box">
                <label>Monthly Investment (₹)</label>
                <input type="number" value={monthlyInv} onChange={(e) => setMonthlyInv(e.target.value)} min="100" step="100" />
              </div>
              <div className="input-box">
                <label>For How Many Years?</label>
                <input type="number" value={invYears} onChange={(e) => setInvYears(e.target.value)} min="1" max="50" />
              </div>
            </div>

            <button onClick={handleWealthCalc} className="btn-primary" style={{ marginTop: "24px", width: "auto", padding: "16px 40px" }}>Calculate Returns 🚀</button>

            {invResults && (
              <div className="investment-results">
                <p className="total-invested">You put in: <strong>₹{invResults.total.toLocaleString()}</strong> over {invYears} years</p>

                <div className="bar-chart">
                  <div className="bar-row">
                    <div className="bar-label">Fixed Deposit <span className="premium-pct">7% p.a.</span></div>
                    <div className="bar-track">
                      <div className="bar-fill fd-fill" style={{ width: `${(invResults.fd / invResults.index) * 100}%`, transition: "width 0.5s ease" }}></div>
                    </div>
                    <div className="bar-value">₹{invResults.fd.toLocaleString()}</div>
                  </div>

                  <div className="bar-row">
                    <div className="bar-label">Digital Gold <span className="premium-pct">9% p.a.</span></div>
                    <div className="bar-track">
                      <div className="bar-fill gold-fill" style={{ width: `${(invResults.gold / invResults.index) * 100}%`, transition: "width 0.5s ease" }}></div>
                    </div>
                    <div className="bar-value">₹{invResults.gold.toLocaleString()}</div>
                  </div>

                  <div className="bar-row">
                    <div className="bar-label">Index Fund <span className="premium-pct">12% p.a.</span></div>
                    <div className="bar-track">
                      <div className="bar-fill index-fill" style={{ width: "100%", transition: "width 0.5s ease" }}></div>
                    </div>
                    <div className="bar-value">₹{invResults.index.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Depreciation Section */}
      <section className="depreciation-section container">
        <div className="depreciation-card">
          <div className="chat-bubble">Imagine you buy a super cool, brand-new bicycle! 🚲</div>
          <div className="chat-bubble">It costs a lot of rupees.</div>
          <div className="chat-bubble">Will it still cost the same years later? 🤔</div>

          <div className="interactive-area">
            <div className="road-container">
              <div className="bike-wrapper" style={{ left: `${10 + (depYear / maxDepYears) * (90 - 10)}%`, transition: "left 0.5s ease" }}>
                <span className="bike-emoji">🚲</span>
                <div className="price-tag">₹{Math.round(depValue).toLocaleString()}</div>
              </div>
            </div>
            <div className="controls">
              {depYear < maxDepYears && (
                <button onClick={handleDepreciate} className="btn-primary action-btn">Fast Forward 1 Year ⏭️</button>
              )}
              {depYear > 0 && (
                <button onClick={resetDepreciation} className="btn-secondary text-btn">Start Over</button>
              )}
            </div>
            <div className="current-status">
              <h3>Year {depYear}</h3>
              <p>Value: <strong>₹{Math.round(depValue).toLocaleString()}</strong></p>
              <p className="depreciation-message" style={{ color: depYear === 0 ? "var(--text-muted)" : "var(--sale-red)" }}>{depMessage}</p>
            </div>
          </div>

          <div className="chat-bubble highlight">
            Probably not! Things lose value when they get old or used.<br />
            <strong>That's called depreciation. 📉</strong>
          </div>

          <div className="examples-box">
            <h3>Examples of Depreciation</h3>
            <p>Cars, phones, and toys lose value over time. A new video game is pricey, but a year later, a used one costs less.</p>
          </div>
        </div>
      </section>

      {/* Trading Overhaul: Trading Fun! */}
      <section className="trade-fun-section container" id="trade">
        <div className="trade-card-new">
          <h2 className="trade-title-new">Trading Fun!</h2>
          <div className="trade-description-new">
            If you have something you don't need? But your friend has something you want? You can trade!
          </div>

          <div className="swap-container" style={{ gap: '180px' }}>
            <div className="child-avatar">👦</div>
            <div className="trade-item car-item" style={{ fontSize: '3.5rem' }}>🚙</div>
            <div className="trade-item ball-item" style={{ fontSize: '3.5rem' }}>🎾</div>
            <div className="child-avatar">👧</div>
          </div>

          <p className="trade-description-new">
            Trading means swapping things - like, "I'll give you my red ball for your blue car!"
          </p>

          <div className="badge-no-money">No money needed!</div>
        </div>
      </section>

      {/* Fair Trades Section */}
      <section className="fair-trade-section container">
        <div className="trade-card-new" style={{ backgroundColor: 'white', borderColor: '#e2e8f0', color: 'var(--text-main)' }}>
          <h2 className="trade-title-new">Fair Trades</h2>
          <div className="trade-description-new yellow">
            For a trade to be good, it needs to be fair! Both people should feel happy with what they get.
          </div>

          <div className="scale-visual-container">
            <div className="scale-beam-wrapper">
              <div className="scale-beam-bar"></div>
              
              <div className="scale-hanger left-hanger">
                <div className="scale-tray-new">
                  <span className="tray-item-new">🎾</span>
                </div>
              </div>
              
              <div className="scale-hanger right-hanger">
                <div className="scale-tray-new">
                  <span className="tray-item-new">🚙</span>
                </div>
              </div>
            </div>
            
            <div className="scale-base-pillar"></div>
            <div className="scale-base-foot"></div>
          </div>

          <p className="trade-subtext">
            In our web app, you can try the Great Toy Swap and even use our Fair Trade Negotiator to get tips on making a fair deal!
          </p>
        </div>
      </section>

      <section className="vision-section container">
        <div className="vision-container">
            <span className="vision-label">Our Vision</span>
            <h2 className="vision-title">To parents who want their children to have <span>choices — not pressure.</span></h2>
        </div>
      </section>

      <section className="struggle-section">
          <div className="container">
              <div className="struggle-header">
                  <h2>The Invisible Struggle</h2>
                  <p>What many parents miss until it's too late: the heavy burden of financial unawareness and insecurity that children inherit.</p>
              </div>
              <div className="struggle-grid">
                  <div className="struggle-card">
                      <span className="struggle-card-icon">🧬</span>
                      <h3>Financial DNA</h3>
                      <p>Children don't fail financially. They copy silently. Your spending, budgeting, debt, and risk habits become their financial blueprint.</p>
                  </div>
                  <div className="struggle-card">
                      <span className="struggle-card-icon">⛓️</span>
                      <h3>The EMI Trap</h3>
                      <p>EMI → Stress → Job Trap → No Risk → No Growth. Without debt awareness early on, children fall into cycles that limit their life choices.</p>
                  </div>
                  <div className="struggle-card">
                      <span className="struggle-card-icon">⚡</span>
                      <h3>The 22-Year Shock</h3>
                      <p>No financial education until 22, then suddenly: Rent, Bills, Loans, Taxes. This sudden responsibility creates deep anxiety and fear.</p>
                  </div>
              </div>
          </div>
      </section>

      <section className="income-advantage container">
          <div className="section-title text-center">Multiple Income Advantage</div>
          <p className="section-subtitle text-center">Teach children early that security and growth come from diversification</p>
          <div className="income-grid">
              <div className="income-card"><div className="income-icon">💼</div><h4>Primary Job</h4></div>
              <div className="income-card"><div className="income-icon">🚀</div><h4>Side Business</h4></div>
              <div className="income-card"><div className="income-icon">📈</div><h4>Investment Income</h4></div>
              <div className="income-card"><div className="income-icon">🏠</div><h4>Rental Income</h4></div>
          </div>
          <div className="income-footer-note">Security + Growth = Choices</div>
      </section>

      <section className="four-levels bg-cream container">
          <h2 className="section-title text-center">4 Levels to Mastery</h2>
          <p className="section-subtitle text-center">A carefully designed journey that grows with your child</p>
          <div className="levels-grid">
              <div className="level-card level-green">
                  <h3>Money Basics & Ideas</h3>
                  <p>Introduction to money concepts and creative thinking</p>
                  <div className="level-tags"><span>Counting money</span><span>Saving basics</span><span>First ideas</span></div>
                  <div className="level-arrow">➔</div>
              </div>
              <div className="level-card level-blue">
                  <h3>Problem Solving</h3>
                  <p>Developing critical thinking and finding solutions</p>
                  <div className="level-tags"><span>Logic puzzles</span><span>Decision making</span><span>Planning</span></div>
                  <div className="level-arrow">➔</div>
              </div>
              <div className="level-card level-purple">
                  <h3>Business Thinking</h3>
                  <p>Understanding how businesses work and create value</p>
                  <div className="level-tags"><span>Business basics</span><span>Customer needs</span><span>Value creation</span></div>
                  <div className="level-arrow">➔</div>
              </div>
              <div className="level-card level-yellow">
                  <h3>Leadership & Execution</h3>
                  <p>Leading teams and turning ideas into action</p>
                  <div className="level-tags"><span>Team leadership</span><span>Project execution</span><span>Goal setting</span></div>
              </div>
          </div>
          <div className="journey-complete">Complete journey: <strong>Young learners</strong> • <span className="text-green">Future-ready skills</span></div>
      </section>

      <section className="reviews container text-center" style={{padding: "80px 24px"}}>
          <h2 className="section-title">Customer Reviews</h2>
          <div className="stars" style={{fontSize: "2rem", marginBottom: "8px"}}>★★★★★</div>
          <p className="section-subtitle">4.9/5 based on 686 reviews</p>
          <div className="reviews-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", textAlign: "left"}}>
              <div className="review-card" style={{padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", background: "white"}}>
                  <div className="stars">★★★★★</div>
                  <h4 style={{margin: "12px 0"}}>Sanjay, Lucknow</h4>
                  <p style={{color: "var(--text-muted)", fontSize: "0.95rem"}}>"I was skeptical at first, but seeing my daughter explain profit and loss was amazing! She loves doing the activities."</p>
              </div>
              {/* ... other reviews ... */}
          </div>
      </section>

      <section className="faq-section container" style={{maxWidth: "800px", padding: "0 24px 80px 24px"}}>
          <h2 className="section-title text-center">Frequently Asked Questions</h2>
          <div className="product-accordions" style={{marginTop: "32px", borderTop: "1px solid var(--border-color)"}}>
              {[
                { q: "My child is not business-minded. Will this help?", a: "Absolutely! The goal isn't just to build businesses, but to build critical life skills like problem-solving, smart financial decisions, and leadership which help in every career." },
                { q: "Is this better than coding classes?", a: "Both are valuable, but financial literacy and entrepreneurial thinking are foundational. A child who learns to think like an innovator will use coding (or any skill) much more powerfully." },
                { q: "Will my child actually use it or get bored?", a: "The workbooks are designed specifically to be anti-boring! They are packed with illustrations, Indian ₹ examples, puzzles, and mini-activities that feel like games." },
                { q: "Is this aligned with Indian education?", a: "Yes, all examples, currency references (₹), and contexts are localized for India to make learning relatable." }
              ].map((faq, i) => (
                <div key={i} className={`accordion-item ${activeAccordion === `faq-${i}` ? "active" : ""}`}>
                  <button className="accordion-header" onClick={() => toggleAccordion(`faq-${i}`)}>
                    {faq.q}
                    <span className="accordion-arrow"></span>
                  </button>
                  <div className="accordion-content" style={{ maxHeight: activeAccordion === `faq-${i}` ? "200px" : "0" }}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
          </div>
      </section>

      <footer style={{background: "var(--primary-teal)", color: "white", padding: "64px 24px", textAlign: "center"}}>
          <h2 style={{marginBottom: "24px", fontWeight: 800, fontSize: "2rem"}}>Ready to start their kidpreneur journey?</h2>
          <a href="#overview" style={{display: "inline-block", background: "var(--accent-yellow)", color: "var(--text-main)", fontWeight: 800, padding: "18px 40px", borderRadius: "8px", textDecoration: "none", fontSize: "1.25rem", boxShadow: "0 4px 15px rgba(250, 209, 41, 0.4)"}}>Get the Bundle Today</a>
          <p style={{marginTop: "64px", color: "rgba(255,255,255,0.6)", fontSize: "0.9rem"}}>© {new Date().getFullYear()} SIYA. All rights reserved.</p>
      </footer>

      <div className="mobile-sticky-footer">
          <a href="#overview" className="btn-primary pulse" style={{display: "block", textAlign: "center", textDecoration: "none", padding: "16px"}}>Buy Now - Rs. 1,799</a>
      </div>

      <a href="#" className="floating-whatsapp" aria-label="Need help?">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
      </a>
      <div className="whatsapp-label">Need help with your child's kit?</div>
    </>
  );
}
