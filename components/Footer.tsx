"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, MessageCircle } from "lucide-react";

interface FooterProps {
  showTrustBadges?: boolean;
  showAllRights?: boolean;
}

export default function Footer({ showTrustBadges = true, showAllRights = false }: FooterProps) {

  return (
    <>
      <footer
        style={{
          backgroundColor: "#ffffff",
          color: "#475569",
          borderTop: "1px solid #e2e8f0",
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          position: "relative",
          zIndex: 20
        }}
      >
        {/* 3 Trust Details Section */}
        {showTrustBadges && (
          <div
            className="footer-trust-strip"
            style={{
              borderBottom: "1px solid #f1f5f9",
              background: "linear-gradient(180deg, #fafbfc 0%, #ffffff 100%)",
              padding: "20px 16px"
            }}
          >
            <div className="footer-trust-grid">
              {/* 1. 24/7 Support on WhatsApp */}
              <a
                href="https://wa.me/919876543210?text=Hi%20KidsGen%20Lab!%20I%20have%20a%20question%20about%20the%20financial%20learning%20kit."
                target="_blank"
                rel="noopener noreferrer"
                className="trust-badge-card"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="trust-badge-icon"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 3px 10px rgba(37, 211, 102, 0.35)"
                  }}
                >
                  {/* Authentic WhatsApp Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.662.062-1.745-.39a7.66 7.66 0 0 1-3.08-2.736c-.198-.266-.492-.705-.492-1.344 0-.638.334-.951.453-1.071.119-.12.26-.15.347-.15.086 0 .173.001.247.005.078.004.182-.03.284.216.104.252.355.867.387.931.031.065.052.141.01.224-.042.083-.063.136-.125.209-.062.073-.131.163-.187.219-.062.063-.127.132-.055.255.072.124.321.53 1.034 1.166.577.514 1.063.673 1.214.748.151.074.24.062.33-.041.09-.104.385-.45.488-.604.103-.155.207-.129.349-.077.142.052.898.423 1.053.5.155.078.258.117.296.181.038.065.038.375-.106.78z" />
                  </svg>
                </div>
                <div className="trust-badge-texts">
                  <div className="trust-badge-title" style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                    24/7 Support on WhatsApp
                  </div>
                  <div className="trust-badge-desc" style={{ fontSize: "0.80rem", color: "#64748b", marginTop: "2px" }}>
                    Quick resolution &amp; parent assistance
                  </div>
                </div>
              </a>

              {/* 2. Within 3 to 7 Days Delivery */}
              <div className="trust-badge-card">
                <div
                  className="trust-badge-icon"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 3px 10px rgba(2, 132, 199, 0.35)"
                  }}
                >
                  {/* Real Fast Delivery Truck Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
                    <path d="M14 8h4.5a2 2 0 0 1 1.6.8L23 13v5a1 1 0 0 1-1 1h-2" />
                    <circle cx="7" cy="18" r="2" fill="#0284c7" />
                    <circle cx="17" cy="18" r="2" fill="#0284c7" />
                    <path d="M2 9h4" />
                    <path d="M2 13h2" />
                  </svg>
                </div>
                <div className="trust-badge-texts">
                  <div className="trust-badge-title" style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                    Within 3 to 7 Days Delivery
                  </div>
                  <div className="trust-badge-desc" style={{ fontSize: "0.80rem", color: "#64748b", marginTop: "2px" }}>
                    Fast &amp; reliable pan-India shipping
                  </div>
                </div>
              </div>

              {/* 3. Safe & Secure Payments */}
              <div className="trust-badge-card">
                <div
                  className="trust-badge-icon"
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 3px 10px rgba(16, 185, 129, 0.35)"
                  }}
                >
                  {/* Real Verified Security Shield Icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div className="trust-badge-texts">
                  <div className="trust-badge-title" style={{ fontWeight: 800, fontSize: "0.95rem", color: "#0f172a" }}>
                    Safe &amp; Secure Payments
                  </div>
                  <div className="trust-badge-desc" style={{ fontSize: "0.80rem", color: "#64748b", marginTop: "2px" }}>
                    100% encrypted &amp; verified checkout
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Container */}
        <div
          className="footer-content-container"
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            padding: "20px 20px 24px"
          }}
        >
          <div
            className="footer-flex-row"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px"
            }}
          >


            {/* Imprinted Monochrome Social Media Icons */}
            <div
              className="footer-social-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "nowrap",
                margin: "4px 0"
              }}
            >
              {/* Instagram */}
              <a
                href="https://www.instagram.com/kidsgenlab"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow KidsGen Lab on Instagram"
                className="social-icon-btn"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  padding: "0",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                  flexShrink: 0,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                  e.currentTarget.style.borderColor = "#000000";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.stroke = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.stroke = "#0f172a";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0, transition: "stroke 0.15s ease" }}>
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/kidsgenlab"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Follow KidsGen Lab on Facebook"
                className="social-icon-btn"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  padding: "0",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                  flexShrink: 0,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                  e.currentTarget.style.borderColor = "#000000";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.fill = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.fill = "#0f172a";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a" style={{ display: "block", flexShrink: 0, transition: "fill 0.15s ease" }}>
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/kidsgenlab"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="Connect with KidsGen Lab on LinkedIn"
                className="social-icon-btn"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  border: "1.5px solid #cbd5e1",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#0f172a",
                  padding: "0",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                  flexShrink: 0,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#000000";
                  e.currentTarget.style.borderColor = "#000000";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.fill = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                  const svg = e.currentTarget.querySelector('svg');
                  if (svg) svg.style.fill = "#0f172a";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#0f172a" style={{ display: "block", flexShrink: 0, transition: "fill 0.15s ease" }}>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>

            {/* Legal Links */}
            <div
              className="footer-legal-links"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                fontSize: "0.85rem"
              }}
            >
              <Link
                href="/privacy"
                style={{
                  color: "#64748b",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.15s ease"
                }}
              >
                Privacy Policy
              </Link>
              <span style={{ color: "#cbd5e1" }}>•</span>
              <Link
                href="/privacy"
                style={{
                  color: "#64748b",
                  fontWeight: 600,
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  transition: "color 0.15s ease"
                }}
              >
                Terms &amp; Conditions
              </Link>
            </div>

            {/* Copyright */}
            <div
              className="footer-copyright"
              style={{
                fontSize: "0.82rem",
                color: "#94a3b8",
                fontWeight: 600
              }}
            >
              <span suppressHydrationWarning={true}>
                © {new Date().getFullYear()} KidsGen Lab{showAllRights ? ". All rights reserved." : "."}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
