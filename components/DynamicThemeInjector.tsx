"use client";

import { useEffect } from "react";

export default function DynamicThemeInjector() {
  useEffect(() => {
    async function applyDatabaseCss() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.theme) {
          const t = data.settings.theme;

          // 1. Inject CSS Variables into :root
          const root = document.documentElement;
          if (t.primaryColor) root.style.setProperty('--db-primary-color', t.primaryColor);
          if (t.accentColor) root.style.setProperty('--db-accent-color', t.accentColor);
          if (t.bannerBg) root.style.setProperty('--db-banner-bg', t.bannerBg);
          if (t.bannerTextColor) root.style.setProperty('--db-banner-text', t.bannerTextColor);
          if (t.buttonBg) root.style.setProperty('--db-button-bg', t.buttonBg);
          if (t.buttonTextColor) root.style.setProperty('--db-button-text', t.buttonTextColor);
          if (t.borderRadius) root.style.setProperty('--db-border-radius', t.borderRadius);

          // 2. Inject or Update Database Custom CSS tag
          let styleTag = document.getElementById('database-custom-css') as HTMLStyleElement;
          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'database-custom-css';
            document.head.appendChild(styleTag);
          }

          const baseVariables = `
            :root {
              --primary-teal: ${t.primaryColor || '#0d9488'};
              --primary-color: ${t.primaryColor || '#0d9488'};
              --accent-gold: ${t.accentColor || '#f59e0b'};
            }
          `;

          styleTag.textContent = `${baseVariables}\n${t.customCss || ''}`;
        }
      } catch (err) {
        // Silently continue if settings cannot be loaded
      }
    }

    applyDatabaseCss();
  }, []);

  return null;
}
