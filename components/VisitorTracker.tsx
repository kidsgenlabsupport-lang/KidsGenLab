"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ParentNotification {
  id: string;
  name: string;
  section: string;
  timeAgo: string;
  avatarColor: string;
}

// Exactly 4 "Let's Play" interactive options for the 4 notification cycles
const LETS_PLAY_NOTIFICATIONS: { name: string; section: string; avatarColor: string; timeAgo: string }[] = [
  {
    name: "Rajesh Sharma",
    section: "Let's Play: Budget Buddy",
    avatarColor: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
    timeAgo: "Just now"
  },
  {
    name: "Priya Venkatesh",
    section: "Let's Play: Future Fortune Builder",
    avatarColor: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
    timeAgo: "2 mins ago"
  },
  {
    name: "Vikram Malhotra",
    section: "Let's Play: Let's Trade",
    avatarColor: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    timeAgo: "4 mins ago"
  },
  {
    name: "Sunita Rao",
    section: "Let's Play: Depreciation",
    avatarColor: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    timeAgo: "7 mins ago"
  }
];

const MAX_POPUP_COUNT = 4;

export default function VisitorTracker() {
  const [currentNotification, setCurrentNotification] = useState<ParentNotification | null>(null);
  const triggerCountRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const scheduleNext = (delayMs: number) => {
      timeoutRef.current = setTimeout(() => {
        if (isCancelled) return;
        if (triggerCountRef.current >= MAX_POPUP_COUNT) return;

        const index = triggerCountRef.current;
        const data = LETS_PLAY_NOTIFICATIONS[index];
        triggerCountRef.current += 1;

        setCurrentNotification({
          id: `notif-${index}-${Date.now()}`,
          name: data.name,
          section: data.section,
          timeAgo: data.timeAgo,
          avatarColor: data.avatarColor
        });

        // Visible for 4.5 seconds
        hideTimeoutRef.current = setTimeout(() => {
          if (isCancelled) return;
          setCurrentNotification(null);

          // If we haven't reached the 4-time limit, schedule the next one in 12-16 seconds
          if (triggerCountRef.current < MAX_POPUP_COUNT) {
            const nextDelay = 13000;
            scheduleNext(nextDelay);
          }
        }, 4500);
      }, delayMs);
    };

    // First trigger after 3.5 seconds
    scheduleNext(3500);

    return () => {
      isCancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div
      className="visitor-tracker-container"
      style={{
        position: "fixed",
        zIndex: 9995,
        pointerEvents: "none"
      }}
    >
      <AnimatePresence>
        {currentNotification && (
          <motion.div
            key={currentNotification.id}
            initial={{ x: -40, opacity: 0, scale: 0.94 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -30, opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
            className="visitor-tracker-card"
            style={{
              backgroundColor: "#ffffff",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 12px 32px -4px rgba(15, 23, 42, 0.18), 0 0 0 1.5px rgba(226, 232, 240, 0.95)",
              position: "relative",
              pointerEvents: "auto",
              fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
            }}
          >
            {/* DP: First Name Initial */}
            <div
              className="visitor-tracker-dp"
              style={{
                background: currentNotification.avatarColor,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                flexShrink: 0,
                boxShadow: "0 3px 8px rgba(0, 0, 0, 0.12)",
                textTransform: "uppercase"
              }}
            >
              {currentNotification.name.charAt(0)}
            </div>

            {/* Clean Info: Name • Section (Let's Play...) • Minutes Ago */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1px", flexGrow: 1, minWidth: 0 }}>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentNotification.name}
              </div>

              <div style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", flexWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>
                <span style={{ color: "#047857", fontWeight: 700, whiteSpace: "nowrap" }}>{currentNotification.section}</span>
                <span style={{ color: "#cbd5e1" }}>•</span>
                <span style={{ color: "#64748b", fontWeight: 500, fontSize: "0.72rem", whiteSpace: "nowrap" }}>{currentNotification.timeAgo}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .visitor-tracker-container {
          bottom: 24px;
          left: 24px;
          width: 360px;
          max-width: calc(100vw - 48px);
        }
        .visitor-tracker-card {
          width: 100%;
          height: 54px;
          padding: 6px 18px 6px 8px;
          border-radius: 9999px;
          gap: 12px;
          box-sizing: border-box;
        }
        .visitor-tracker-dp {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.15rem;
        }

        @media (max-width: 767px) {
          .visitor-tracker-container {
            bottom: 84px !important;
            left: 12px !important;
            right: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: calc(100vw - 24px) !important;
          }
          .visitor-tracker-card {
            height: 50px !important;
            padding: 5px 14px 5px 6px !important;
            gap: 10px !important;
            border-radius: 9999px !important;
          }
          .visitor-tracker-dp {
            width: 36px !important;
            height: 36px !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
}
