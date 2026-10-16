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

const ALL_NAMES = [
  "Sowmiya", "Nivetha", "Subramani", "Varun", "Kesavan", "Janani", "Suba", "Wahab", "Asik", "Gopi", "Karan", "Ragavan",
  "Rajesh", "Priya", "Vikram", "Sunita", "Aarti", "Abhinav", "Aditi", "Aditya", "Ajay", "Akash", "Akhil", "Amir",
  "Amrita", "Anand", "Ananya", "Anil", "Anjali", "Ankit", "Anshul", "Anu", "Anubhav", "Aparna", "Arjun", "Asha", 
  "Ashish", "Ashok", "Avinash", "Balaji", "Bharat", "Bhavna", "Bhuvana", "Chetan", "Deepa", "Deepak", "Dev", "Dinesh",
  "Divya", "Ganesh", "Gaurav", "Gautam", "Geeta", "Gopal", "Hari", "Harish", "Harsha", "Hema", "Himanshu", "Isha", 
  "Ishaan", "Jatin", "Jaya", "Kalyan", "Kamal", "Kamini", "Karthik", "Kavita", "Kiran", "Kishore", "Krish",
  "Krishna", "Kunal", "Lakshmi", "Lalit", "Lata", "Lavanya", "Laxmi", "Madhav", "Madhu", "Mahesh", "Manish", 
  "Manjula", "Manoj", "Maya", "Meena", "Meera", "Milind", "Mohan", "Mohit", "Mona", "Mukesh", "Nalini", "Namrata", 
  "Nandini", "Narayan", "Naveen", "Navya", "Neha", "Nidhi", "Nikhil", "Nilam", "Nilesh", "Nitin", "Nitya", 
  "Pankaj", "Parth", "Pavitra"
];

const SECTIONS = [
  "Let's Play: Budget Buddy",
  "Let's Play: Future Fortune Builder",
  "Let's Play: Let's Trade",
  "Let's Play: Depreciation"
];

const GRADIENTS = [
  "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
  "linear-gradient(135deg, #10b981 0%, #047857 100%)",
  "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)"
];

const TIME_AGOS = ["Just now", "2 mins ago", "4 mins ago", "7 mins ago", "1 min ago", "3 mins ago"];

const MAX_POPUP_COUNT = 4;
const SHOWN_NAMES_KEY = "visitor_tracker_shown_names";

export default function VisitorTracker() {
  const [currentNotification, setCurrentNotification] = useState<ParentNotification | null>(null);
  const triggerCountRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isCancelled = false;
    
    // Retrieve previously shown names
    const getShownNames = (): string[] => {
      try {
        const stored = localStorage.getItem(SHOWN_NAMES_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    };
    
    // Get a unique name that hasn't been shown yet
    const getUniqueName = (): string => {
      const shownNames = getShownNames();
      const availableNames = ALL_NAMES.filter(name => !shownNames.includes(name));
      
      // If we exhausted all names, reset the list
      if (availableNames.length === 0) {
        localStorage.removeItem(SHOWN_NAMES_KEY);
        const name = ALL_NAMES[Math.floor(Math.random() * ALL_NAMES.length)];
        localStorage.setItem(SHOWN_NAMES_KEY, JSON.stringify([name]));
        return name;
      }
      
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      const chosenName = availableNames[randomIndex];
      
      // Save it to shown names
      localStorage.setItem(SHOWN_NAMES_KEY, JSON.stringify([...shownNames, chosenName]));
      return chosenName;
    };

    const scheduleNext = (delayMs: number) => {
      timeoutRef.current = setTimeout(() => {
        if (isCancelled) return;
        if (triggerCountRef.current >= MAX_POPUP_COUNT) return;

        triggerCountRef.current += 1;
        
        const randomName = getUniqueName();
        const randomSection = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
        const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
        const randomTimeAgo = TIME_AGOS[Math.floor(Math.random() * TIME_AGOS.length)];

        setCurrentNotification({
          id: `notif-${triggerCountRef.current}-${Date.now()}`,
          name: randomName,
          section: randomSection,
          timeAgo: randomTimeAgo,
          avatarColor: randomGradient
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
              <div className="visitor-tracker-name" style={{ fontWeight: 800, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentNotification.name}
              </div>

              <div className="visitor-tracker-meta" style={{ color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", flexWrap: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.2 }}>
                <span className="visitor-tracker-section" style={{ color: "#047857", fontWeight: 700, whiteSpace: "nowrap" }}>{currentNotification.section}</span>
                <span style={{ color: "#cbd5e1" }}>•</span>
                <span className="visitor-tracker-time" style={{ color: "#64748b", fontWeight: 500, whiteSpace: "nowrap" }}>{currentNotification.timeAgo}</span>
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
        .visitor-tracker-name {
          font-size: 0.88rem;
        }
        .visitor-tracker-meta {
          font-size: 0.78rem;
        }
        .visitor-tracker-section {
          font-size: inherit;
        }
        .visitor-tracker-time {
          font-size: 0.72rem;
        }

        @media (max-width: 767px) {
          .visitor-tracker-container {
            bottom: 24px !important;
            left: 50% !important;
            transform: translateX(-50%);
            width: 90vw !important;
            max-width: 320px !important;
          }
          .visitor-tracker-card {
            height: 46px !important;
            padding: 4px 12px 4px 6px !important;
            gap: 8px !important;
            border-radius: 12px !important; /* Proper border radius for mobile */
          }
          .visitor-tracker-dp {
            width: 32px !important;
            height: 32px !important;
            font-size: 0.9rem !important;
            border-radius: 8px !important;
          }
          .visitor-tracker-name {
            font-size: 0.8rem !important;
          }
          .visitor-tracker-meta {
            font-size: 0.65rem !important;
          }
          .visitor-tracker-time {
            font-size: 0.6rem !important;
          }
        }
      `}</style>
    </div>
  );
}
