"use client";

import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState<"en" | "ta">("en");

  useEffect(() => {
    // Check if the cookie already exists on load
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1] === "ta") {
      setCurrentLang("ta");
    }

    // Add Google Translate script if not exists
    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,ta", autoDisplay: false },
          "google_translate_element"
        );
      };
    }
  }, []);

  const switchLanguage = (lang: "en" | "ta") => {
    setCurrentLang(lang);
    if (lang === "en") {
      // Clear cookie to revert to original
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + location.hostname + "; path=/;";
      window.location.reload();
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      document.cookie = `googtrans=/en/${lang}; domain=${location.hostname}; path=/`;
      window.location.reload();
    }
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }}></div>
      <div className="gt-container" style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.05)', padding: '2px 4px', borderRadius: '8px', border: '1px solid rgba(15, 23, 42, 0.1)' }}>
        <select
          value={currentLang}
          onChange={(e) => switchLanguage(e.target.value as "en" | "ta")}
          style={{
            background: 'transparent',
            color: '#0f172a',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            outline: 'none',
            appearance: 'auto',
            paddingRight: '4px'
          }}
        >
          <option value="en">EN</option>
          <option value="ta">TA</option>
        </select>
      </div>
      <style jsx global>{`
        /* Hide Google Translate Top Bar */
        .skiptranslate iframe,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        #goog-gt-tt {
          display: none !important;
        }
        body, html {
          top: 0px !important;
          margin-top: 0px !important;
        }
        @media (max-width: 900px) {
          .gt-container {
            padding: 2px !important;
            gap: 2px !important;
          }
          .gt-container button {
            padding: 4px 8px !important;
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </>
  );
}

// Ensure type exists on window
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
  }
}
