"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  BookOpen,
  Sparkles,
  Gamepad2,
  Eye,
  ShieldCheck,
  AlertTriangle,
  ShoppingCart,
  Info,
  Leaf,
  Compass,
  ArrowLeft,
  HeartHandshake
} from 'lucide-react';
import Footer from '../../components/Footer';
import VisitorTracker from '../../components/VisitorTracker';
import { getActiveAffiliateRef } from '../../components/AffiliateTracker';

interface CoinParticle {
  id: number;
  offsetLeft: number;
  offsetY: number;
  emoji: string;
}

const triggers = [
  {
    category: "TARGETING THE FUTURE",
    theme: "Future / Loss Aversion",
    spark: {
      emoji: "💡",
      title: "Teach Small Mistakes",
      desc: "Let them make 50 mistakes today—like buying a toy that breaks—to learn valuable lessons before the stakes get high.",
      bg: "bg-emerald-50",
      badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      img: "/with_icon_2.jpg"
    },
    shock: {
      emoji: "⚡",
      title: "Prevent 50 Lakh Debts",
      desc: "If they don't learn from tiny failures, they face massive credit card debt, bad loans, and severe financial anxiety in early adulthood.",
      img: "/without_icon_4.jpg"
    }
  },
  {
    theme: "Future / Armor",
    spark: {
      emoji: "🛡️",
      title: "Financial Armor",
      desc: "Give children the defensive mental tools to spot spending traps, understand value, and resist aggressive media conditioning.",
      bg: "bg-cyan-50",
      badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-300",
      img: "/with_icon_4.jpg"
    },
    shock: {
      emoji: "⚡",
      title: "Market Exploitation",
      desc: "Large corporations spend billions designing ads specifically targeting children, turning them into lifetime impulsive spenders.",
      img: "/without_icon_2.jpg"
    }
  },
  {
    theme: "Daily Stress / Relief",
    spark: {
      emoji: "🤝",
      title: "End the 'No' Conflict",
      desc: "Establish clear, systemized rules (like the 4-Jar setup) so kids understand their financial limits without emotional disputes.",
      bg: "bg-amber-50",
      badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
      img: "/with_icon_1.jpg"
    },
    shock: {
      emoji: "⚡",
      title: "Stop Parent-Child Fights",
      desc: "Avoid constantly being the 'bad guy' who says no. Prevent constant begging, guilt-trips, and household friction.",
      img: "/without_icon_1.jpg"
    }
  },

  {
    theme: "Parental Pride / Empowerment",
    spark: {
      emoji: "🚀",
      title: "Raise the Confident Investor",
      desc: "Coach kids to save automatically, invest early, and understand compounding so they build financial freedom naturally.",
      bg: "bg-violet-50",
      badgeBg: "bg-violet-100 text-violet-800 border-violet-300",
      img: "/with_icon_3.jpg"
    },
    shock: {
      emoji: "⚡",
      title: "Avoid Easy Debt Traps",
      desc: "Prevent them from falling for 'Buy Now Pay Later' schemes, salary advance loops, and crippling consumer debt trap cycles.",
      img: "/without_icon_3.jpg"
    }
  }
];

const bookPages = [
  {
    image: '/spend_impulsively.jpg',
    title: 'Spend Impulsively',
    desc: 'Instant Happiness, Long Term Regret. Smart choices today, better future tomorrow.'
  },
  {
    image: '/avoid_budgeting.jpg',
    title: 'Avoid Budgeting',
    desc: 'No Plan, No Control, Only Stress. Budget today. Live better. Stress less.'
  },
  {
    image: '/fear_investing.jpg',
    title: 'Fear Investing',
    desc: 'Don’t let fear rob your future. Start small. Start today. Your future self will thank you.'
  }
];


export default function StoryPage() {



  // 3. Two Futures Crossroads State
  const [selectedPath, setSelectedPath] = useState<'saver' | 'no-guidance'>('saver');

  // Book pages index state for mobile response
  const [activeBookPage, setActiveBookPage] = useState<number>(0);

  // Automatic flip effect for mobile habits
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBookPage(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);


  // 6. Parent Quiz State
  const [quizAnswers, setQuizAnswers] = useState<[number | null, number | null, number | null]>([null, null, null]);
  const [quizResult, setQuizResult] = useState<{ show: boolean; title: string; desc: string }>({
    show: false,
    title: '',
    desc: ''
  });

  const selectQuiz = (qNum: number, choiceVal: number) => {
    const newAnswers = [...quizAnswers] as [number | null, number | null, number | null];
    newAnswers[qNum - 1] = choiceVal;
    setQuizAnswers(newAnswers);

    const completed = newAnswers.every(ans => ans !== null);
    if (completed) {
      const score = newAnswers.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0) ?? 0;
      if (score >= 2) {
        setQuizResult({
          show: true,
          title: "🌟 Great Foundation! (Wealth Mindset)",
          desc: "Your household is already modeling proactive money conversations. Our book will provide the complete 4-Jar sticker kit and debt stories to lock this in permanently!"
        });
      } else {
        setQuizResult({
          show: true,
          title: "💡 High Reprogramming Opportunity!",
          desc: "Your child is currently absorbing common silent cues like card taps or instant demands. Our book gives you easy 5-minute daily copycat games to rewrite their financial DNA!"
        });
      }
      triggerConfetti({ particleCount: 50, spread: 85 });
    }
  };

  // 8. Order Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [orderName, setOrderName] = useState<string>('');
  const [orderEmail, setOrderEmail] = useState<string>('');
  const [orderPhone, setOrderPhone] = useState<string>('');
  const [orderCity, setOrderCity] = useState<string>('');

  // 9. Selected Package State
  const [selectedPackage, setSelectedPackage] = useState<'solo' | 'sibling' | 'family'>('sibling');

  // Default Package details mapping
  const defaultStoryPackages = {
    solo: {
      name: 'Starter Saver Edition',
      price: 1199,
      originalPrice: 1999,
      tagline: 'Anchor Price (Great for 1 kid)',
      items: [
        '1x Full Physical Kit (3 Jars + 1 Book + 1 Medal + App)',
        'Digital eBook Edition & Exercise Guides',
        'Printable Jar Labels & Habit Tracker Chart',
        '1x Official Superpower Medal for Kids'
      ]
    },
    sibling: {
      name: 'Little Achiever Kit',
      price: 1499,
      originalPrice: 3999,
      tagline: 'The Irresistible Sweet Spot (Save 60%!)',
      items: [
        '2x Complete Kits (6 Jars + 2 Books + 2 Medals + 2 App Accounts)',
        'No Sharing Fights - Individual materials for both children',
        'Digital eBook Editions & Parents Mirroring Guides',
        '2x Official Superpower Medals for Kids'
      ]
    },
    family: {
      name: 'Family Champions Bundle',
      price: 2999,
      originalPrice: 5999,
      tagline: 'Luxury Decoy (Ultimate package)',
      items: [
        'Everything in Sibling Pack (2 Complete Kits)',
        'PLUS: Parent Guide and Letter',
        'Personalized allowance system & banking roadmap',
        'Premium Family Wealth Guide & templates'
      ]
    }
  };

  const [packages, setPackages] = useState(defaultStoryPackages);

  // Sync pricing from Admin API settings on mount & restore cached user details
  useEffect(() => {
    async function loadLiveSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.pricing) {
          const p = data.settings.pricing;
          setPackages({
            solo: {
              ...defaultStoryPackages.solo,
              name: p.solo?.name || defaultStoryPackages.solo.name,
              price: p.solo?.price || defaultStoryPackages.solo.price,
              originalPrice: p.solo?.originalPrice || defaultStoryPackages.solo.originalPrice,
              tagline: p.solo?.tagline || defaultStoryPackages.solo.tagline
            },
            sibling: {
              ...defaultStoryPackages.sibling,
              name: p.starter?.name || p.sibling?.name || defaultStoryPackages.sibling.name,
              price: p.starter?.price || p.sibling?.price || defaultStoryPackages.sibling.price,
              originalPrice: p.starter?.originalPrice || p.sibling?.originalPrice || defaultStoryPackages.sibling.originalPrice,
              tagline: p.starter?.tagline || p.sibling?.tagline || defaultStoryPackages.sibling.tagline
            },
            family: {
              ...defaultStoryPackages.family,
              name: p.family?.name || defaultStoryPackages.family.name,
              price: p.family?.price || defaultStoryPackages.family.price,
              originalPrice: p.family?.originalPrice || defaultStoryPackages.family.originalPrice,
              tagline: p.family?.tagline || defaultStoryPackages.family.tagline
            }
          });
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadLiveSettings();

    // Auto-restore customer info & affiliate ref from previous visits
    try {
      const savedRef = getActiveAffiliateRef();
      if (savedRef) setActiveAffiliateRef(savedRef);

      const saved = localStorage.getItem('kidzmoney_user_address') || localStorage.getItem('kidsgenlab_customer_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customerName || parsed.name) setOrderName(parsed.customerName || parsed.name);
        if (parsed.email) setOrderEmail(parsed.email);
        if (parsed.phone || parsed.contact) setOrderPhone(parsed.phone || parsed.contact);
        if (parsed.city) setOrderCity(parsed.city);
      }
    } catch (e) {}
  }, []);

  const [activeAffiliateRef, setActiveAffiliateRef] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName.trim() || !orderEmail.trim()) {
      alert('Please fill in your name and email address.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Step 1: Create Order on Backend
      const currentPkg = packages[selectedPackage];
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentPkg.price,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const createData = await createRes.json();

      if (!createData.success || !createData.order_id) {
        throw new Error(createData.message || 'Failed to initialize payment gateway');
      }

      // Step 2: Open Razorpay Standard Checkout Modal
      const options = {
        key: createData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TWqcqybTpdjice',
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'KidsGenLab',
        description: currentPkg.name,
        image: '/kidsgenlab_logo_transparent.png',
        order_id: createData.order_id,
        prefill: {
          name: orderName.trim(),
          email: orderEmail.trim(),
          contact: orderPhone.trim(),
          method: 'upi'
        },
        display: {
          blocks: {
            upi: {
              name: 'Pay using UPI (GPay, PhonePe, Paytm, QR)',
              instruments: [{ method: 'upi' }]
            },
            other: {
              name: 'Cards / NetBanking / Wallets',
              instruments: [{ method: 'card' }, { method: 'netbanking' }, { method: 'wallet' }]
            }
          },
          sequence: ['block.upi', 'block.other'],
          preferences: { show_default_blocks: true }
        },
        theme: {
          color: '#2d8b94',
        },
        handler: async function (response: any) {
          try {
            // Step 3: Verify Payment Signature on Backend
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  customerName: orderName.trim(),
                  email: orderEmail.trim(),
                  phone: orderPhone.trim(),
                  city: orderCity.trim() || 'Online Customer',
                  packageName: currentPkg.name,
                  price: currentPkg.price,
                }
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setIsModalOpen(false);
              triggerConfetti({ particleCount: 120, spread: 90 });
              alert(`🎉 Payment Successful! Payment ID: ${response.razorpay_payment_id}. Your kit is on the way!`);
              setOrderName('');
              setOrderEmail('');
              setOrderPhone('');
              setOrderCity('');
            } else {
              alert(`❌ Payment verification failed: ${verifyData.message || 'Please contact support.'}`);
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            alert(`Payment completed with ID ${response.razorpay_payment_id}, but automatic verification encountered an issue. Our team will verify it.`);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
          }
        }
      };

      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          console.error('Payment failed event:', response.error);
          alert(`⚠️ Payment Failed: ${response.error?.description || 'Transaction could not be completed.'}`);
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        throw new Error('Payment gateway is loading. Please try again in 3 seconds.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const triggerConfetti = (opts?: any) => {
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti(opts);
    }
  };

  return (
    <div style={{
      background: '#F8FAFC',
      color: '#1E392A',
      minHeight: '100vh',
      fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* Tailwind CSS & Canvas Confetti Scripts */}
      <Script id="tailwind-cdn" src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <Script
        id="confetti-cdn"
        src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"
        strategy="afterInteractive"
      />

      {/* Nature Decorations */}
      <div className="nature-decorations">
        {/* Clouds drifting */}
        <div className="cloud cloud-1">☁️</div>
        <div className="cloud cloud-2">☁️</div>
        <div className="cloud cloud-3">☁️</div>

        {/* Floating Leaves */}
        <div className="floating-leaf leaf-1"><Leaf size={24} color="#86EFAC" fill="#86EFAC" /></div>
        <div className="floating-leaf leaf-2"><Leaf size={20} color="#4ADE80" fill="#4ADE80" /></div>
        <div className="floating-leaf leaf-3"><Leaf size={28} color="#22C55E" fill="#22C55E" /></div>
        <div className="floating-leaf leaf-4"><Leaf size={22} color="#16A34A" fill="#16A34A" /></div>
      </div>

      {/* 3D Toy-style Adventure Header */}
      <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center relative z-20">
        {/* Playful wooden back signpost */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#D4A373',
              border: '4px solid #5C3D2E',
              boxShadow: '0 8px 0 #5C3D2E',
              padding: '10px 20px',
              borderRadius: '20px',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: '1rem',
              cursor: 'pointer',
              textShadow: '0 2px 2px rgba(0,0,0,0.2)'
            }}
          >
            <ArrowLeft strokeWidth={3} size={20} />
            <span>🏡 Return to Main Lab</span>
          </motion.div>
        </Link>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-8 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-4xl mx-auto space-y-6">

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#DCFCE7',
              border: '3px solid #15803D',
              color: '#166534',
              padding: '8px 24px',
              borderRadius: '30px',
              fontWeight: 900,
              fontSize: '0.9rem',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 0 #15803D'
            }}>
              MONEY HABITS ARE FORMED BY AGE 7 THROUGH BEHAVIORAL MIRRORING. BREAK THE CYCLE TODAY!
            </div>

            {/* 5 Money Problems Section Heading */}
            <div className="text-center max-w-3xl mx-auto space-y-3 mt-8">
              <span className="bg-rose-100 text-rose-800 font-display font-bold text-xs uppercase px-4 py-1.5 rounded-full tracking-wider border border-rose-300 inline-block shadow-sm">
                5 Money Problems Your Child Could Face
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 leading-tight">
                What Happens If You Don't Teach Them Today
              </h2>
            </div>

            {/* 5 Money Problems Infinite Marquee Slider */}
            <div className="w-full mt-6 overflow-hidden relative py-4 bg-slate-100/80 rounded-3xl border-4 border-slate-300 shadow-inner">
              {/* Subtle Fade Edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-slate-100 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-slate-100 to-transparent z-10 pointer-events-none"></div>

              <div className="marquee-track flex gap-4 sm:gap-6">
                {[
                  { img: '/money_problem_1.jpg', title: '1. Confusion About Money' },
                  { img: '/money_problem_2.jpg', title: '2. Risk of Debt Trap' },
                  { img: '/money_problem_3.jpg', title: '3. No Savings Habit' },
                  { img: '/money_problem_4.jpg', title: '4. Impulsive Spending' },
                  { img: '/money_problem_5.jpg', title: '5. Limited Future Opportunities' },

                  { img: '/money_problem_1.jpg', title: '1. Confusion About Money' },
                  { img: '/money_problem_2.jpg', title: '2. Risk of Debt Trap' },
                  { img: '/money_problem_3.jpg', title: '3. No Savings Habit' },
                  { img: '/money_problem_4.jpg', title: '4. Impulsive Spending' },
                  { img: '/money_problem_5.jpg', title: '5. Limited Future Opportunities' }
                ].map((card, idx) => (
                  <div
                    key={idx}
                    className="w-56 sm:w-68 flex-shrink-0 bg-white rounded-2xl overflow-hidden border-3 sm:border-4 border-slate-300 shadow-md transition-transform duration-300"
                  >
                    <img
                      src={card.img}
                      alt={card.title}
                      className="w-full h-auto object-contain block"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION 1: WHAT CHILDREN MISS & THE TRUTH */}
      <section id="what-kids-miss" className="py-16 bg-white relative border-b-4 border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900">
              What Children Miss Most
            </h2>
            <p className="text-base sm:text-lg text-slate-600">
              Children don’t fail financially. <b className="text-slate-900">They copy silently.</b> Before they reach adulthood, their money mindset is already formed by watching everyday decisions.
            </p>
          </div>

          {/* Hidden Reality Image Cards Grid - Desktop/Tablet Response */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                image: '/child_copying_parent.jpg',
                title: 'Child Copying Parent',
                desc: 'They watch you every day. They copy you in every way. You lead them today, they follow you tomorrow.'
              },
              {
                image: '/spend_impulsively.jpg',
                title: 'Spend Impulsively',
                desc: 'Instant Happiness, Long Term Regret. Smart choices today, better future tomorrow.'
              },
              {
                image: '/avoid_budgeting.jpg',
                title: 'Avoid Budgeting',
                desc: 'No Plan, No Control, Only Stress. Budget today. Live better. Stress less.'
              },
              {
                image: '/fear_investing.jpg',
                title: 'Fear Investing',
                desc: 'Don’t let fear rob your future. Start small. Start today. Your future self will thank you.'
              }
            ].map((card, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-3xl border-4 border-slate-300 hover:border-emerald-500 hover:shadow-xl transition-all text-center flex flex-col items-center space-y-3 group">
                <div className="w-full overflow-hidden rounded-2xl border-2 border-slate-200 shadow-sm bg-white">
                  <img src={card.image} alt={card.title} className="w-full h-auto object-contain group-hover:scale-102 transition-transform duration-300" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">{card.title}</h3>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Hidden Reality Image Cards - Mobile Response (Book Fold Style) */}
          <div className="block md:hidden mt-8 space-y-6">
            {/* Main Hero Card (Child Copying Parent) */}
            <div className="bg-slate-50 p-5 rounded-3xl border-4 border-slate-900 shadow-[0_6px_0_#1e293b] text-center flex flex-col items-center space-y-3">
              <div className="w-full overflow-hidden rounded-2xl border-2 border-slate-900 shadow-sm bg-white">
                <img src="/child_copying_parent.jpg" alt="Child Copying Parent" className="w-full h-auto object-contain" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 leading-snug">Child Copying Parent</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                They watch you every day. They copy you in every way. You lead them today, they follow you tomorrow.
              </p>
            </div>

            {/* Automatically Cycling Habit Cards - Mobile Response */}
            <div className="relative bg-slate-50 border-4 border-slate-900 rounded-[2rem] p-6 shadow-[0_6px_0_#1e293b] overflow-hidden">
              <div className="w-full space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-2">
                  <span className="text-[9px] font-display font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 uppercase tracking-wider">
                    🔄 AUTO-CYCLING HABITS
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 font-display">
                    Habit {activeBookPage + 1} of 3
                  </span>
                </div>

                {/* Animated Flip Page */}
                <div className="min-h-[260px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeBookPage}
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ backfaceVisibility: "hidden" }}
                      className="w-full flex flex-col items-center space-y-3"
                    >
                      <div className="w-full overflow-hidden rounded-2xl border-2 border-slate-900 shadow-sm bg-white">
                        <img
                          src={bookPages[activeBookPage].image}
                          alt={bookPages[activeBookPage].title}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="space-y-1 text-center">
                        <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                          {bookPages[activeBookPage].title}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                          {bookPages[activeBookPage].desc}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Manual Dots Indicator controls */}
                <div className="flex justify-center items-center gap-2.5 pt-3 border-t-2 border-dashed border-slate-300">
                  {[0, 1, 2].map(dotIdx => (
                    <button suppressHydrationWarning={true}
                      key={dotIdx}
                      onClick={() => setActiveBookPage(dotIdx)}
                      className={`w-3 h-3 rounded-full border-2 border-slate-900 transition-all ${activeBookPage === dotIdx ? "bg-amber-400 w-6" : "bg-white"
                        }`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* BIG TRUTH BANNER */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl border-4 border-emerald-800 text-center relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="max-w-3xl mx-auto space-y-3 relative z-10">
              <p className="text-amber-400 font-display font-bold uppercase tracking-widest text-xs sm:text-sm">THE UNFILTERED TRUTH</p>
              <h3 className="text-2xl sm:text-4xl font-display font-bold leading-tight">
                "Your daily behavior becomes their financial DNA."
              </h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Money habits are inherited — <b>not genetically, but behaviorally</b>. What we normalize at home defines their early adulthood choices.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: WITH VS WITHOUT MY KIDS KNOW MONEY */}
      <section id="two-futures" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900">

        <div className="text-center max-w-4xl mx-auto space-y-3 mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-5xl font-display font-bold text-slate-900 leading-tight">
            With vs Without My Kids Know Money
          </h2>
        </div>

        {/* Pathway Selector: Responsive for Mobile & Desktop */}
        <div className="flex justify-center items-center gap-4 max-w-xl mx-auto mb-10 px-2">
          <button
            suppressHydrationWarning={true}
            onClick={() => setSelectedPath('saver')}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backgroundColor: selectedPath === 'saver' ? '#10B981' : '#F1F5F9',
              color: selectedPath === 'saver' ? '#FFFFFF' : '#1E293B',
              border: selectedPath === 'saver' ? '3px solid #064E3B' : '3px solid #CBD5E1',
              boxShadow: selectedPath === 'saver' ? '0 6px 0 #064E3B, 0 10px 20px rgba(16, 185, 129, 0.3)' : '0 4px 0 #CBD5E1',
              transform: selectedPath === 'saver' ? 'translateY(-2px)' : 'none'
            }}
          >
            <span>🌲 WITH OUR PROGRAM</span>
          </button>
          <button
            suppressHydrationWarning={true}
            onClick={() => setSelectedPath('no-guidance')}
            style={{
              flex: 1,
              padding: '14px 20px',
              borderRadius: '20px',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backgroundColor: selectedPath === 'no-guidance' ? '#EF4444' : '#F1F5F9',
              color: selectedPath === 'no-guidance' ? '#FFFFFF' : '#1E293B',
              border: selectedPath === 'no-guidance' ? '3px solid #7F1D1D' : '3px solid #CBD5E1',
              boxShadow: selectedPath === 'no-guidance' ? '0 6px 0 #7F1D1D, 0 10px 20px rgba(239, 68, 68, 0.3)' : '0 4px 0 #CBD5E1',
              transform: selectedPath === 'no-guidance' ? 'translateY(-2px)' : 'none'
            }}
          >
            <span>🥀 WITHOUT GUIDANCE</span>
          </button>
        </div>

        {/* Pathway display panel */}
        <AnimatePresence mode="wait">
          {selectedPath === 'saver' ? (
            <motion.div
              key="saver"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 sm:border-8 border-teal-600 rounded-3xl sm:rounded-[2.5rem] shadow-[0_10px_0_#0d9488] sm:shadow-[0_16px_0_#0d9488] overflow-hidden"
            >
              <div className="bg-teal-600 text-white font-display font-bold text-base sm:text-2xl p-4 sm:p-5 text-center flex items-center justify-center gap-2">
                <span>🌲 With The Money-Smart System</span>
              </div>
              <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    image: "/with_box_1.jpg",
                    title: "1. Mindful Choices",
                    quote: '"My child evaluates wants vs. needs before asking."',
                    subtext: "Less friction, understanding limits."
                  },
                  {
                    image: "/with_box_2.jpg",
                    title: "2. Connected to Effort",
                    quote: '"My child understands value, effort, and earning."',
                    subtext: "Appreciating the real work behind every rupee."
                  },
                  {
                    image: "/with_box_3.jpg",
                    title: "3. Budgeting for Goals",
                    quote: '"My child allocates with clear purpose."',
                    subtext: "Patience and delayed gratification."
                  },
                  {
                    image: "/with_box_4.jpg",
                    title: "4. Confident Future",
                    quote: '"I have complete peace of mind about their future."',
                    subtext: "Real-world financial control, avoiding debt traps."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-teal-50 border-3 sm:border-4 border-teal-200 p-4 sm:p-5 rounded-2xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-all text-center group flex flex-col">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-teal-300 shadow-sm bg-white group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-display font-bold text-teal-950 text-sm sm:text-base leading-tight">{item.title}</h4>
                    <p className="text-teal-900 text-xs font-bold italic leading-relaxed bg-white p-2.5 rounded-xl border border-teal-200">{item.quote}</p>
                    <p className="text-teal-700 text-[11px] font-semibold mt-auto">{item.subtext}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="debt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border-4 sm:border-8 border-rose-600 rounded-3xl sm:rounded-[2.5rem] shadow-[0_10px_0_#e11d48] sm:shadow-[0_16px_0_#e11d48] overflow-hidden"
            >
              <div className="bg-rose-600 text-white font-display font-bold text-base sm:text-2xl p-4 sm:p-5 text-center flex items-center justify-center gap-2">
                <span>🥀 Without A Money Framework</span>
              </div>
              <div className="p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {[
                  {
                    image: "/without_box_1.jpg",
                    title: "1. Constant Demands & Anger",
                    quote: '"My child demands things and gets angry when I say NO."',
                    subtext: "Meltdowns, tantrums, guilt."
                  },
                  {
                    image: "/without_box_2.jpg",
                    title: "2. Money From Nowhere",
                    quote: '"My child thinks money comes from nowhere."',
                    subtext: "No concept of effort or budgeting."
                  },
                  {
                    image: "/without_box_3.jpg",
                    title: "3. Immediate Spending",
                    quote: '"My child spends everything immediately."',
                    subtext: "No saving, no patience, no planning."
                  },
                  {
                    image: "/without_box_4.jpg",
                    title: "4. Future Worry",
                    quote: '"I\'m scared my child will become financially irresponsible."',
                    subtext: "Fearing debt, poor decisions, and dependency."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-rose-50 border-3 sm:border-4 border-rose-200 p-4 sm:p-5 rounded-2xl space-y-3 sm:space-y-4 shadow-sm hover:shadow-md transition-all text-center group flex flex-col">
                    <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-rose-300 shadow-sm bg-white group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="font-display font-bold text-rose-950 text-sm sm:text-base leading-tight">{item.title}</h4>
                    <p className="text-rose-900 text-xs font-bold italic leading-relaxed bg-white p-2.5 rounded-xl border border-rose-200">{item.quote}</p>
                    <p className="text-rose-700 text-[11px] font-semibold mt-auto">{item.subtext}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* SHOCK & SPARK SECTION */}
      <section id="shock-spark-triggers" className="py-16 sm:py-24 bg-slate-50 relative border-b-4 border-slate-900 overflow-hidden">
        {/* Playful background blobs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-200/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute -bottom-10 right-10 w-[300px] h-[300px] bg-teal-200/10 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 leading-tight">
              Compare the Triggers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Every silent financial <b className="text-slate-900">Shock</b> (the black warning on the left) has an actionable, positive <b className="text-teal-600">Spark</b> (the white solution on the right) to guide children toward wisdom!
            </p>
          </div>

          {/* Table Container */}
          <div className="w-full overflow-x-auto rounded-[2rem] border-4 border-slate-900 shadow-[0_12px_0_#0f172a] bg-slate-900">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b-4 border-slate-900 bg-slate-950 text-white font-display font-bold">
                  <th className="p-4 sm:p-5 w-[50%] bg-[#0B0F19] text-rose-400 border-r-4 border-slate-900 text-sm sm:text-base tracking-wide">
                    ⚡ Reality Shock (Without Guidance)
                  </th>
                  <th className="p-4 sm:p-5 w-[50%] bg-[#064E3B] text-emerald-300 text-sm sm:text-base tracking-wide">
                    ✨ Spark Solution (With KidsGenLab)
                  </th>
                </tr>
              </thead>
              <tbody>
                {triggers.map((item, idx) => (
                  <tr key={idx} className="border-b-3 border-slate-800 last:border-b-0">
                    {/* Shock Column */}
                    <td className="p-4 sm:p-6 border-r-4 border-slate-900 bg-[#0F172A] space-y-2">
                      <h4 className="font-display font-bold text-sm sm:text-base text-rose-300 uppercase tracking-wide">
                        {item.shock.title}
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                        ⚠️ {item.shock.desc}
                      </p>
                    </td>

                    {/* Spark Column */}
                    <td className="p-4 sm:p-6 bg-[#FFFFFF] space-y-2">
                      <h4 className="font-display font-bold text-sm sm:text-base text-emerald-800 uppercase tracking-wide">
                        {item.spark.title}
                      </h4>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                        ⭐ {item.spark.desc}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: FINANCIAL DNA PARENT QUIZ */}
      <section id="dna-quiz" className="py-16 sm:py-24 bg-slate-50 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="flex flex-row items-center justify-between gap-4 md:gap-8 mb-12">
            {/* Father (Left) */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-44 md:h-44 shrink-0 overflow-hidden rounded-2xl md:rounded-[2rem]">
              <img
                src="/financial_dna_parents.jpg?v=1"
                alt="Father pointing"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'left center'
                }}
              />
            </div>

            {/* Title & Subtitle (Center) */}
            <div className="text-center flex-1 space-y-2 md:space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-slate-900 leading-tight">
                What Financial DNA Are You Passing Down?
              </h2>
              <p className="text-slate-600 text-[10px] sm:text-sm md:text-base max-w-md mx-auto">
                Answer 3 quick questions to evaluate your current money mirroring score.
              </p>
            </div>

            {/* Mother (Right) */}
            <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-44 md:h-44 shrink-0 overflow-hidden rounded-2xl md:rounded-[2rem]">
              <img
                src="/financial_dna_parents.jpg?v=1"
                alt="Mother pointing"
                className="w-full h-full object-cover"
                style={{
                  objectPosition: 'right center'
                }}
              />
            </div>
          </div>

          {/* Quiz Box */}
          <div className="mt-8 bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_40px_rgba(15,23,42,0.06),_0_1px_3px_rgba(0,0,0,0.02)]">

            <div className="space-y-6">

              {/* Question 1 */}
              <div className="space-y-3">
                <p className="font-display font-bold text-slate-900 text-base">1. How do you respond when your child begs for a toy while shopping?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(1, 0)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[0] === 0 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[0] === 0 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[0] === 0 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[0] === 0 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    A) Buy the toy to avoid a public tantrum and keep the peace.
                  </button>
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(1, 1)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[0] === 1 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[0] === 1 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[0] === 1 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[0] === 1 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    B) Say no and tell them to save up for it using their jars/allowance.
                  </button>
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <p className="font-display font-bold text-slate-900 text-base">2. How are family bills and budget choices discussed at home?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(2, 0)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[1] === 0 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[1] === 0 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[1] === 0 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[1] === 0 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    A) Money is a taboo topic; we never speak about bills near kids.
                  </button>
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(2, 1)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[1] === 1 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[1] === 1 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[1] === 1 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[1] === 1 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    B) We hold open, age-appropriate family discussions about value.
                  </button>
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <p className="font-display font-bold text-slate-900 text-base">3. Does your child see money as physical coins/notes or infinite card swipes?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(3, 0)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[2] === 0 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[2] === 0 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[2] === 0 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[2] === 0 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    A) Mostly phone taps and card swipes without physical context.
                  </button>
                  <button
                    suppressHydrationWarning={true}
                    onClick={() => selectQuiz(3, 1)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '16px',
                      textAlign: 'left',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: quizAnswers[2] === 1 ? '#0D9488' : '#F8FAFC',
                      color: quizAnswers[2] === 1 ? '#FFFFFF' : '#1E293B',
                      border: quizAnswers[2] === 1 ? '3px solid #0F766E' : '2px solid #E2E8F0',
                      boxShadow: quizAnswers[2] === 1 ? '0 4px 12px rgba(13, 148, 136, 0.3)' : 'none'
                    }}
                  >
                    B) They see cash, jar allocation, and clear value exchanges.
                  </button>
                </div>
              </div>

              {/* Quiz Result Output */}
              {quizResult.show && (
                <div id="quiz-result" className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-center space-y-3">
                  <h4 className="font-display font-bold text-xl text-emerald-950" id="quiz-title">{quizResult.title}</h4>
                  <p className="text-sm text-slate-700 font-medium" id="quiz-desc">{quizResult.desc}</p>
                  <a href="#get-book" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-sm px-6 py-3 rounded-xl shadow-lg transition-all">
                    Unlock Full Parent Blueprint in Book
                  </a>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>



      {/* ORDER & CTA SECTION */}
      <section id="get-book" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white leading-tight">
            Give Your Child the Gift of <br /><span className="text-emerald-400 font-extrabold">Financial Freedom</span>
          </h2>

          <p className="text-slate-300 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Every parent works hard so their children never struggle. But school never teaches how money works in the real world. Children learn how to treat money just by watching us at home.
          </p>

          {/* BOOK PACKAGE CARD */}
          <div className="bg-slate-900 border-4 border-emerald-500/50 p-6 sm:p-8 rounded-[2.5rem] shadow-card-3d max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left relative overflow-hidden">

            {/* Book Image Mockup */}
            <div className="md:col-span-5 flex items-center justify-center bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <img
                src={
                  selectedPackage === 'solo'
                    ? '/product1.png.jpeg'
                    : selectedPackage === 'sibling'
                    ? '/product2.png.jpeg'
                    : '/product3.png.jpeg'
                }
                alt={packages[selectedPackage].name}
                className="w-full max-h-72 object-contain rounded-xl shadow-lg transform hover:scale-105 transition-transform"
              />
            </div>

            {/* Book Info Column */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-6">

              <div className="space-y-4">
                {/* Package Cards Selector */}
                <div className="space-y-3">
                  {/* Option 1: Solo Explorer */}
                  <div
                    onClick={() => setSelectedPackage('solo')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${selectedPackage === 'solo'
                        ? 'border-emerald-400 bg-[#1E293B] shadow-md'
                        : 'border-slate-800 bg-[#0F172A] hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input suppressHydrationWarning={true}
                        type="radio"
                        checked={selectedPackage === 'solo'}
                        onChange={() => setSelectedPackage('solo')}
                        className="mt-1 accent-emerald-400 pointer-events-none"
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-white">Starter Saver Edition</h4>
                        <p className="text-slate-400 text-xs mt-0.5">book + stickers set</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 line-through block">1,999</span>
                      <span className="font-display font-bold text-base sm:text-lg text-emerald-400">1,199</span>
                    </div>
                  </div>

                  {/* Option 2: Sibling Power Pack */}
                  <div
                    onClick={() => setSelectedPackage('sibling')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 relative overflow-hidden ${selectedPackage === 'sibling'
                        ? 'border-amber-400 bg-[#1E293B] shadow-md'
                        : 'border-slate-800 bg-[#0F172A] hover:border-slate-700'
                      }`}
                  >
                    {/* Best Value Badge */}
                    <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 font-display font-bold text-[9px] px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wide">
                      Best Value
                    </div>

                    <div className="flex items-start gap-3">
                      <input suppressHydrationWarning={true}
                        type="radio"
                        checked={selectedPackage === 'sibling'}
                        onChange={() => setSelectedPackage('sibling')}
                        className="mt-1 accent-amber-400 pointer-events-none"
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-white">
                          Little Achiever Kit
                        </h4>
                        <p className="text-slate-400 text-xs mt-0.5">book + stickers set + pencil + keychain + certificate</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 line-through block">3,999</span>
                      <span className="font-display font-bold text-base sm:text-lg text-amber-400">1,499</span>
                    </div>
                  </div>

                  {/* Option 3: Family Mastery Bundle */}
                  <div
                    onClick={() => setSelectedPackage('family')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-4 ${selectedPackage === 'family'
                        ? 'border-emerald-400 bg-[#1E293B] shadow-md'
                        : 'border-slate-800 bg-[#0F172A] hover:border-slate-700'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <input suppressHydrationWarning={true}
                        type="radio"
                        checked={selectedPackage === 'family'}
                        onChange={() => setSelectedPackage('family')}
                        className="mt-1 accent-emerald-400 pointer-events-none"
                      />
                      <div>
                        <h4 className="font-display font-bold text-sm sm:text-base text-white">Family Champions Bundle</h4>
                        <p className="text-slate-400 text-xs mt-0.5">books + stickers set + pencil + keychain + certificate + parent guide and letter</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-500 line-through block">5,999</span>
                      <span className="font-display font-bold text-base sm:text-lg text-emerald-400">2,999</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & CTA Button */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    {packages[selectedPackage].originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="font-display font-bold text-3xl text-amber-400">
                    {packages[selectedPackage].price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {packages[selectedPackage].tagline}
                  </span>
                </div>

                <Link
                  href={`/checkout?package=${selectedPackage}${activeAffiliateRef ? `&ref=${encodeURIComponent(activeAffiliateRef)}` : ''}`}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-display font-bold px-8 py-4 rounded-2xl shadow-amber-3d text-base transition-all flex items-center justify-center gap-2 text-decoration-none"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Order Now & Start Journey</span>
                </Link>
              </div>

            </div>

          </div>

          <div className="mt-6 bg-[#DC2626] text-white rounded-2xl p-4 sm:p-5 max-w-3xl mx-auto text-center font-display shadow-lg border-2 border-red-700">
            <h4 className="text-sm sm:text-lg font-bold leading-snug">
              Don’t wait for the problems. Start building your child’s financial future today.
            </h4>
            <p className="text-xs sm:text-sm text-red-100 mt-1.5 font-medium">
              A small step now can save them from a lifetime of struggle.
            </p>
          </div>

        </div>
      </section>



      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      {/* ORDER MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] max-w-md w-full p-6 sm:p-8 space-y-5 text-slate-800 relative shadow-2xl border-8 border-slate-900"
            >
              <button suppressHydrationWarning={true} onClick={() => !isProcessingPayment && setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 text-xl font-bold">✕</button>

              <div className="text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="font-display font-bold text-2xl text-slate-900">Your Family Journey Begins!</h3>
                <p className="text-xs text-slate-600">Enter your details to receive the Family Wealth Kit immediately.</p>
              </div>

              <form onSubmit={handleOrderSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Parent Full Name *</label>
                  <input
                    type="text"
                    required
                    disabled={isProcessingPayment}
                    suppressHydrationWarning={true}
                    value={orderName}
                    onChange={e => setOrderName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled={isProcessingPayment}
                    suppressHydrationWarning={true}
                    value={orderEmail}
                    onChange={e => setOrderEmail(e.target.value)}
                    placeholder="priya@example.com"
                    className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      disabled={isProcessingPayment}
                      suppressHydrationWarning={true}
                      value={orderPhone}
                      onChange={e => setOrderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">City / Location</label>
                    <input
                      type="text"
                      disabled={isProcessingPayment}
                      suppressHydrationWarning={true}
                      value={orderCity}
                      onChange={e => setOrderCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full p-3 rounded-xl border-4 border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
                <button
                  suppressHydrationWarning={true}
                  type="submit"
                  disabled={isProcessingPayment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-display font-bold py-3.5 rounded-xl shadow-[0_6px_0_#15803D] text-sm border-4 border-emerald-800 mt-2 transition-transform active:translate-y-1 flex items-center justify-center gap-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <span>Proceed to Pay ({packages[selectedPackage].price.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer showTrustBadges={false} />
      <VisitorTracker />

      {/* Global CSS styles & Custom Utility Extensions */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        body {
          margin: 0;
          padding: 0;
        }

        .font-display {
          font-family: 'Fredoka', cursive, system-ui, sans-serif !important;
        }

        .font-body {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
        }

        .bg-brand-50 { background-color: #f0fdf4 !important; }
        .bg-brand-100 { background-color: #dcfce7 !important; }
        .bg-brand-500 { background-color: #22c55e !important; }
        .bg-brand-600 { background-color: #16a34a !important; }
        .bg-brand-700 { background-color: #15803d !important; }
        .border-brand-500 { border-color: #22c55e !important; }
        .border-brand-300 { border-color: #86efac !important; }
        .text-brand-900 { color: #14532d !important; }

        /* Full slate and emerald color utilities for robust visibility */
        .bg-slate-950 { background-color: #020617 !important; }
        .bg-slate-900 { background-color: #0f172a !important; }
        .bg-slate-800 { background-color: #1e293b !important; }
        .bg-slate-700 { background-color: #334155 !important; }
        .bg-slate-200 { background-color: #e2e8f0 !important; }
        .bg-slate-100 { background-color: #f1f5f9 !important; }
        .bg-slate-50 { background-color: #f8fafc !important; }

        .bg-emerald-950 { background-color: #022c22 !important; }
        .bg-emerald-900 { background-color: #064e3b !important; }
        .bg-emerald-800 { background-color: #065f46 !important; }
        .bg-emerald-700 { background-color: #047857 !important; }
        .bg-emerald-600 { background-color: #059669 !important; }
        .bg-emerald-500 { background-color: #10b981 !important; }
        .bg-emerald-100 { background-color: #d1fae5 !important; }
        .bg-emerald-50 { background-color: #ecfdf5 !important; }

        .text-slate-950 { color: #020617 !important; }
        .text-slate-900 { color: #0f172a !important; }
        .text-slate-800 { color: #1e293b !important; }
        .text-slate-700 { color: #334155 !important; }
        .text-slate-600, .text-slate-650 { color: #475569 !important; }
        .text-slate-500 { color: #64748b !important; }
        .text-slate-400 { color: #94a3b8 !important; }
        .text-slate-300 { color: #cbd5e1 !important; }
        .text-slate-200 { color: #e2e8f0 !important; }
        .text-slate-100 { color: #f1f5f9 !important; }

        .border-slate-950 { border-color: #020617 !important; }
        .border-slate-900 { border-color: #0f172a !important; }
        .border-slate-800 { border-color: #1e293b !important; }
        .border-slate-700 { border-color: #334155 !important; }
        .border-slate-300 { border-color: #cbd5e1 !important; }
        .border-slate-200 { border-color: #e2e8f0 !important; }
        .border-slate-100 { border-color: #f1f5f9 !important; }

        .shadow-card-3d {
          box-shadow: 0 12px 0 0 rgba(21, 128, 61, 0.2), 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
        }
        .shadow-green-3d {
          box-shadow: 0 8px 0 0 #15803d !important;
        }
        .shadow-amber-3d {
          box-shadow: 0 8px 0 0 #d97706 !important;
        }

        /* Hardware Accelerated Marquee */
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 25s linear infinite;
          will-change: transform;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(calc(-100% / 3), 0, 0);
          }
        }

        /* Floating Coins Animation */
        .floating-coin-particle {
          animation: floatUp 1.2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          z-index: 100;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-160px) translateX(var(--x-offset)) rotate(var(--rot));
            opacity: 0;
          }
        }

        /* Spinning Compass */
        .spinning-compass {
          animation: spinAnimation 8s linear infinite;
          will-change: transform;
        }
        @keyframes spinAnimation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Clouds drifting styling */
        .cloud {
          position: absolute;
          font-size: 3.5rem;
          color: rgba(255, 255, 255, 0.7);
          pointer-events: none;
          z-index: 1;
          user-select: none;
          will-change: transform;
        }
        .cloud-1 {
          top: 120px;
          left: 5%;
          animation: driftRight 45s linear infinite;
        }
        .cloud-2 {
          top: 250px;
          right: 5%;
          animation: driftLeft 55s linear infinite;
        }
        .cloud-3 {
          top: 500px;
          left: 15%;
          animation: driftRight 65s linear infinite;
        }

        @keyframes driftRight {
          0% { transform: translate3d(-100px, 0, 0); }
          100% { transform: translate3d(calc(100vw + 100px), 0, 0); }
        }
        @keyframes driftLeft {
          0% { transform: translate3d(100px, 0, 0); }
          100% { transform: translate3d(calc(-100vw - 100px), 0, 0); }
        }

        /* Floating Leaves */
        .floating-leaf {
          position: absolute;
          pointer-events: none;
          z-index: 2;
          user-select: none;
          will-change: transform;
        }
        .leaf-1 {
          top: 150px;
          left: 8%;
          animation: swayAndFall 12s linear infinite;
        }
        .leaf-2 {
          top: 400px;
          right: 12%;
          animation: swayAndFall 15s linear infinite;
        }
        .leaf-3 {
          top: 750px;
          left: 18%;
          animation: swayAndFall 18s linear infinite;
        }
        .leaf-4 {
          top: 980px;
          right: 5%;
          animation: swayAndFall 14s linear infinite;
        }

        @keyframes swayAndFall {
          0% {
            transform: translate3d(0, -50px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translate3d(120px, 500px, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
