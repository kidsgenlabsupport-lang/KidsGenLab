"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle,
  Truck,
  MapPin,
  AlertCircle,
  Shield,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  Loader2,
  X
} from 'lucide-react';
import { getActiveAffiliateRef } from '../../components/AffiliateTracker';

interface PackageInfo {
  id: 'solo' | 'sibling' | 'family';
  name: string;
  price: number;
  originalPrice: number;
  tagline: string;
  badge?: string;
  image: string;
  features: string;
}

const defaultPackages: Record<'solo' | 'sibling' | 'family', PackageInfo> = {
  solo: {
    id: 'solo',
    name: 'Starter Saver Kit',
    price: 1199,
    originalPrice: 1999,
    tagline: 'Ideal for 1 Child • Physical Book + 7 Stickers',
    badge: 'Standard',
    image: '/kidsgenlab25.jpeg',
    features: 'Physical Activity Book + 7 Superpower Stickers Set'
  },
  sibling: {
    id: 'sibling',
    name: 'Little Achiever Kit',
    price: 1499,
    originalPrice: 3999,
    tagline: 'Ages 7-12 • Book + Stickers + Medal + Certificate',
    badge: 'Most Popular',
    image: '/kidsgenlab26.jpeg',
    features: 'Complete Book + Superpower Stickers + Medal + Certificate'
  },
  family: {
    id: 'family',
    name: 'Family Champions Bundle',
    price: 2999,
    originalPrice: 5999,
    tagline: 'VIP Family Kit + Parent Master Blueprint',
    badge: 'VIP Bundle',
    image: '/kidsgenlab27.jpeg',
    features: 'Full Family Kit + Parent Master Guide & Wealth Blueprint'
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Pre-selection check
  const packageParam = searchParams.get('package') || searchParams.get('kit');
  const initialPkgKey: 'solo' | 'sibling' | 'family' =
    packageParam === 'starter' ? 'sibling' :
    (packageParam === 'solo' || packageParam === 'sibling' || packageParam === 'family') ? packageParam : 'sibling';

  const [selectedPackageId, setSelectedPackageId] = useState<'solo' | 'sibling' | 'family'>(initialPkgKey);
  const [packagesData, setPackagesData] = useState(defaultPackages);

  // Address fields - empty by default so browser autofill suggestions trigger naturally
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // UI state toggles: if user has a previously confirmed saved address on this device
  const [hasSavedAddress, setHasSavedAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);

  // Pincode detection state
  const [pincodeLoading, setPincodeLoading] = useState<boolean>(false);

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);
  const [formError, setFormError] = useState<string>('');

  // Save to localStorage helper
  const saveDetailsToStorage = (updatedFields?: Partial<{
    customerName: string;
    phone: string;
    email: string;
    flatNo: string;
    address: string;
    landmark: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  }>) => {
    try {
      const dataToSave = {
        customerName: updatedFields?.customerName !== undefined ? updatedFields.customerName : customerName,
        phone: updatedFields?.phone !== undefined ? updatedFields.phone : phone,
        email: updatedFields?.email !== undefined ? updatedFields.email : email,
        flatNo: updatedFields?.flatNo !== undefined ? updatedFields.flatNo : flatNo,
        address: updatedFields?.address !== undefined ? updatedFields.address : address,
        landmark: updatedFields?.landmark !== undefined ? updatedFields.landmark : landmark,
        city: updatedFields?.city !== undefined ? updatedFields.city : city,
        district: updatedFields?.district !== undefined ? updatedFields.district : district,
        state: updatedFields?.state !== undefined ? updatedFields.state : state,
        pincode: updatedFields?.pincode !== undefined ? updatedFields.pincode : pincode
      };
      localStorage.setItem('kidzmoney_user_address', JSON.stringify(dataToSave));
      localStorage.setItem('kidsgenlab_customer_info', JSON.stringify(dataToSave));
    } catch (e) {
      // Ignore storage errors
    }
  };

  // Indian Pincode automatic Postal API lookup
  const fetchPincodeDetails = async (pin: string) => {
    const cleanPin = pin.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) return;

    setPincodeLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      const data = await res.json();
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const po = data[0].PostOffice[0];
        const detectedCity = po.District || po.Block || po.Division || po.Name || '';
        const detectedDistrict = po.District || detectedCity;
        const detectedState = po.State || '';

        setCity((prev) => (prev.trim() ? prev : detectedCity));
        setDistrict((prev) => (prev.trim() ? prev : detectedDistrict));
        setState((prev) => (prev.trim() ? prev : detectedState));

        saveDetailsToStorage({
          city: city.trim() || detectedCity,
          district: district.trim() || detectedDistrict,
          state: state.trim() || detectedState,
          pincode: cleanPin
        });
      }
    } catch (err) {
      console.warn('Pincode auto-lookup warning:', err);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanPin = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPincode(cleanPin);
    saveDetailsToStorage({ pincode: cleanPin });

    if (cleanPin.length === 6) {
      fetchPincodeDetails(cleanPin);
    }
  };

  // Restore details from URL params or localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    const qName = searchParams.get('name') || searchParams.get('customerName');
    const qPhone = searchParams.get('phone') || searchParams.get('tel') || searchParams.get('contact');
    const qEmail = searchParams.get('email');
    const qFlat = searchParams.get('flatNo') || searchParams.get('flat') || searchParams.get('house');
    const qAddress = searchParams.get('address') || searchParams.get('street');
    const qLandmark = searchParams.get('landmark');
    const qCity = searchParams.get('city');
    const qDistrict = searchParams.get('district');
    const qState = searchParams.get('state');
    const qPin = searchParams.get('pincode') || searchParams.get('pin');

    let savedData: any = null;
    try {
      const saved = localStorage.getItem('kidzmoney_user_address') || localStorage.getItem('kidsgenlab_customer_info');
      if (saved) {
        savedData = JSON.parse(saved);
      }
    } catch (e) {}

    const initName = qName || savedData?.customerName || savedData?.name || '';
    const initPhone = (qPhone || savedData?.phone || savedData?.contact || '')?.replace(/\D/g, '').slice(-10);
    const initEmail = qEmail || savedData?.email || '';
    const initFlat = qFlat || savedData?.flatNo || savedData?.flat || '';
    const initAddress = qAddress || savedData?.address || savedData?.street || '';
    const initLandmark = qLandmark || savedData?.landmark || '';
    const initCity = qCity || savedData?.city || '';
    const initDistrict = qDistrict || savedData?.district || '';
    const initState = qState || savedData?.state || '';
    const initPin = (qPin || savedData?.pincode || savedData?.pin || '')?.replace(/\D/g, '').slice(0, 6);

    if (initName) setCustomerName(initName);
    if (initPhone) setPhone(initPhone);
    if (initEmail) setEmail(initEmail);
    if (initFlat) setFlatNo(initFlat);
    if (initAddress) setAddress(initAddress);
    if (initLandmark) setLandmark(initLandmark);
    if (initCity) setCity(initCity);
    if (initDistrict) setDistrict(initDistrict);
    if (initState) setState(initState);
    if (initPin) setPincode(initPin);

    // If there is an existing saved profile, show saved card; otherwise show the autofill-ready form directly
    if (initName && initPhone && (initAddress || initPin)) {
      setHasSavedAddress(true);
      setIsEditingAddress(false);
    } else {
      setHasSavedAddress(false);
      setIsEditingAddress(true);
    }
  }, []);

  // Browser Autofill Sync: Listen for native DOM input/change events fired by Chrome/Safari/Edge autofill
  useEffect(() => {
    const syncAutofillFromDom = () => {
      const formEl = document.getElementById('checkout-shipping-form');
      if (!formEl) return;

      const getVal = (id: string) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        return el ? el.value.trim() : '';
      };

      const n = getVal('checkout-name');
      const p = getVal('checkout-phone').replace(/\D/g, '').slice(-10);
      const em = getVal('checkout-email');
      const f = getVal('checkout-flat');
      const a = getVal('checkout-street');
      const l = getVal('checkout-landmark');
      const pin = getVal('checkout-pincode').replace(/\D/g, '').slice(0, 6);
      const c = getVal('checkout-city');
      const s = getVal('checkout-state');

      if (n) setCustomerName(n);
      if (p) setPhone(p);
      if (em) setEmail(em);
      if (f) setFlatNo(f);
      if (a) setAddress(a);
      if (l) setLandmark(l);
      if (pin) {
        setPincode(pin);
        if (pin.length === 6) fetchPincodeDetails(pin);
      }
      if (c) setCity(c);
      if (s) setState(s);
    };

    const formEl = document.getElementById('checkout-shipping-form');
    if (formEl) {
      formEl.addEventListener('input', syncAutofillFromDom);
      formEl.addEventListener('change', syncAutofillFromDom);
      return () => {
        formEl.removeEventListener('input', syncAutofillFromDom);
        formEl.removeEventListener('change', syncAutofillFromDom);
      };
    }
  }, [hasSavedAddress, isEditingAddress]);

  // Fetch Live Prices from Admin Settings
  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success && data.settings?.pricing) {
          const p = data.settings.pricing;
          setPackagesData({
            solo: {
              ...defaultPackages.solo,
              name: p.solo?.name || defaultPackages.solo.name,
              price: p.solo?.price || defaultPackages.solo.price,
              originalPrice: p.solo?.originalPrice || defaultPackages.solo.originalPrice,
              tagline: p.solo?.tagline || defaultPackages.solo.tagline
            },
            sibling: {
              ...defaultPackages.sibling,
              name: p.starter?.name || p.sibling?.name || defaultPackages.sibling.name,
              price: p.starter?.price || p.sibling?.price || defaultPackages.sibling.price,
              originalPrice: p.starter?.originalPrice || p.sibling?.originalPrice || defaultPackages.sibling.originalPrice,
              tagline: p.starter?.tagline || p.sibling?.tagline || defaultPackages.sibling.tagline
            },
            family: {
              ...defaultPackages.family,
              name: p.family?.name || defaultPackages.family.name,
              price: p.family?.price || defaultPackages.family.price,
              originalPrice: p.family?.originalPrice || defaultPackages.family.originalPrice,
              tagline: p.family?.tagline || defaultPackages.family.tagline
            }
          });
        }
      } catch (err) {
        // Fallback silently
      }
    }
    loadSettings();
  }, []);

  const activePackage = packagesData[selectedPackageId] || packagesData.sibling;
  const totalSaved = Math.max(0, activePackage.originalPrice - activePackage.price);
  const finalPrice = activePackage.price;

  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
    }
  };

  // Online Razorpay Payment
  const handlePaymentSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError('');

    // Failsafe read directly from DOM to ensure autofilled inputs are captured even if synthetic events lagged
    const getDomVal = (id: string, fallback: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      return el && el.value.trim() ? el.value.trim() : fallback.trim();
    };

    const finalName = getDomVal('checkout-name', customerName);
    const rawPhone = getDomVal('checkout-phone', phone);
    const cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);
    const finalEmail = getDomVal('checkout-email', email);
    const finalFlat = getDomVal('checkout-flat', flatNo);
    const finalAddress = getDomVal('checkout-street', address);
    const finalLandmark = getDomVal('checkout-landmark', landmark);
    const rawPin = getDomVal('checkout-pincode', pincode);
    const cleanPin = rawPin.replace(/\D/g, '').slice(0, 6);
    const finalCity = getDomVal('checkout-city', city);
    const finalState = getDomVal('checkout-state', state);

    // Sync to React state
    if (finalName) setCustomerName(finalName);
    if (cleanPhone) setPhone(cleanPhone);
    if (finalEmail) setEmail(finalEmail);
    if (finalFlat) setFlatNo(finalFlat);
    if (finalAddress) setAddress(finalAddress);
    if (finalLandmark) setLandmark(finalLandmark);
    if (cleanPin) setPincode(cleanPin);
    if (finalCity) setCity(finalCity);
    if (finalState) setState(finalState);

    if (!finalName) {
      setFormError('Please enter your Full Name.');
      setIsEditingAddress(true);
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit Mobile Number.');
      setIsEditingAddress(true);
      return;
    }
    if (!finalFlat) {
      setFormError('Please enter Flat, House no., or Door details.');
      setIsEditingAddress(true);
      return;
    }
    if (!finalAddress) {
      setFormError('Please enter Street, Area or Colony.');
      setIsEditingAddress(true);
      return;
    }
    if (!finalCity) {
      setFormError('Please enter Town / City.');
      setIsEditingAddress(true);
      return;
    }
    if (!cleanPin || cleanPin.length < 6) {
      setFormError('Please enter a valid 6-digit Pincode.');
      setIsEditingAddress(true);
      return;
    }

    saveDetailsToStorage({
      customerName: finalName,
      phone: cleanPhone,
      email: finalEmail,
      flatNo: finalFlat,
      address: finalAddress,
      landmark: finalLandmark,
      city: finalCity,
      state: finalState,
      pincode: cleanPin
    });

    setHasSavedAddress(true);
    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPrice,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const createData = await createRes.json();

      if (!createRes.ok || !createData || !createData.success || !createData.order_id) {
        let errorMsg = 'Unable to connect to payment gateway.';
        if (createData && typeof createData.message === 'string') {
          errorMsg = createData.message;
        } else if (createData && createData.error && typeof createData.error.description === 'string') {
          errorMsg = createData.error.description;
        }
        setFormError(errorMsg);
        setIsProcessing(false);
        return;
      }

      const fullStreetAddress = `${finalFlat}, ${finalAddress}${finalLandmark ? `, Landmark: ${finalLandmark}` : ''}`;

      // 2. Launch Razorpay
      const options = {
        key: createData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TWqcqybTpdjice',
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'KidsGenLab',
        description: `${activePackage.name} - Express Delivery`,
        order_id: createData.order_id,
        prefill: {
          name: finalName,
          contact: cleanPhone,
          email: finalEmail || undefined,
          method: 'upi'
        },
        display: {
          blocks: {
            upi: {
              name: 'Fast UPI Payment (GPay, PhonePe, Paytm, QR)',
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
          color: '#111827'
        },
        handler: async function (response: any) {
          try {
            // 3. Verify Payment & Save in DB
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  customerName: finalName,
                  phone: cleanPhone,
                  email: finalEmail,
                  flatNo: finalFlat,
                  address: fullStreetAddress,
                  city: finalCity,
                  district: district.trim() || finalCity,
                  state: finalState,
                  pincode: cleanPin,
                  packageName: activePackage.name,
                  price: finalPrice,
                  affiliateRef: getActiveAffiliateRef() || ''
                }
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setPaymentSuccessData({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                packageName: activePackage.name,
                price: finalPrice,
                customerName: finalName,
                phone: cleanPhone,
                city: finalCity,
                pincode: cleanPin
              });
              triggerConfetti();
            } else {
              alert(`Payment completed (ID: ${response.razorpay_payment_id}). Order confirmed!`);
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert(`Payment completed (ID: ${response.razorpay_payment_id}). Order confirmed!`);
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      let Razorpay = typeof window !== 'undefined' ? (window as any).Razorpay : null;
      if (!Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = resolve;
          script.onerror = resolve;
          document.body.appendChild(script);
        });
        Razorpay = (window as any).Razorpay;
      }

      if (Razorpay) {
        const rzp = new Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          alert(`⚠️ Payment Failed: ${resp.error?.description || 'Transaction declined.'}`);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
        setFormError('Unable to load payment gateway. Please check your internet connection.');
        setIsProcessing(false);
        return;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setFormError(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Hydration protection
  if (!isMounted) {
    return (
      <div className="fast-checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} suppressHydrationWarning={true}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (paymentSuccessData) {
    return (
      <div className="fast-checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }} suppressHydrationWarning={true}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: '440px', width: '100%', background: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', padding: '32px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
          suppressHydrationWarning={true}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <CheckCircle style={{ width: '34px', height: '34px' }} />
          </div>

          <div>
            <span style={{ display: 'inline-block', background: '#e6f9ed', color: '#059669', fontSize: '0.74rem', fontWeight: 800, padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase' }}>
              Order Confirmed & Verified
            </span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#111827', marginTop: '10px' }}>
              Thank You, {paymentSuccessData.customerName}!
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '4px' }}>
              Your physical activity kit has been queued for immediate express dispatch.
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Selected Kit:</span>
              <strong style={{ color: '#111827', fontWeight: 800 }}>{paymentSuccessData.packageName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Total Paid:</span>
              <strong style={{ color: '#059669', fontWeight: 900, fontSize: '0.98rem' }}>₹{Number(paymentSuccessData.price).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ color: '#64748b' }}>Payment ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#111827' }}>{paymentSuccessData.paymentId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Destination:</span>
              <span style={{ color: '#111827', fontWeight: 700 }}>{paymentSuccessData.city} (PIN: {paymentSuccessData.pincode})</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <Link
              href="/"
              style={{ display: 'block', width: '100%', padding: '14px', background: '#111827', color: '#ffffff', fontWeight: 900, borderRadius: '12px', textDecoration: 'none', fontSize: '0.90rem', textAlign: 'center' }}
            >
              ← Return to Storefront
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fast-checkout-page-root" suppressHydrationWarning={true}>
      
      {/* 1. TOP HEADER (Brand & 100% Secured Payment) */}
      <header className="fast-checkout-top-nav">
        <Link href="/" className="fast-brand-title">
          <ArrowLeft style={{ width: '18px', height: '18px', strokeWidth: 2.5 }} />
          <span>KIDSGENLAB</span>
        </Link>

        <div className="fast-secured-badge">
          <span>100% Secured Payment</span>
          <Lock style={{ width: '14px', height: '14px', color: '#64748b' }} />
        </div>
      </header>

      {/* 2. TOP BANNER */}
      <div className="fast-prepaid-announcement">
        100% Verified Secure Checkout • Express Dispatch
      </div>

      <main className="fast-checkout-container" suppressHydrationWarning={true}>
        
        {/* Error banner if any */}
        {formError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '10px 14px', color: '#b91c1c', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span>{formError}</span>
          </div>
        )}

        {/* SECTION: DELIVERY DETAILS */}
        <div className="fast-section-header">DELIVERY DETAILS</div>

        {/* CARD 1: ORDER SUMMARY */}
        <div className="fast-card" style={{ padding: '14px 16px' }}>
          <div
            onClick={() => setIsOrderSummaryOpen(!isOrderSummaryOpen)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart style={{ width: '18px', height: '18px', color: '#334155' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>Order Summary</span>
                {totalSaved > 0 && (
                  <span className="fast-savings-pill">
                    ₹{totalSaved.toLocaleString('en-IN')} saved so far
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>1 item</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.80rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{activePackage.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '1.02rem', fontWeight: 900, color: '#0f172a' }}>
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
              {isOrderSummaryOpen ? (
                <ChevronUp style={{ width: '18px', height: '18px', color: '#64748b' }} />
              ) : (
                <ChevronDown style={{ width: '18px', height: '18px', color: '#64748b' }} />
              )}
            </div>
          </div>

          {/* Expandable Package Selector / Breakdown */}
          {isOrderSummaryOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}
            >
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Your Package:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(Object.keys(packagesData) as Array<'solo' | 'sibling' | 'family'>).map((key) => {
                  const pkg = packagesData[key];
                  const isSelected = selectedPackageId === key;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPackageId(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #111827' : '1px solid #e2e8f0',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: isSelected ? '5px solid #111827' : '2px solid #cbd5e1', background: '#ffffff' }} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0f172a' }}>
                            {pkg.name} {pkg.badge && <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#111827', color: '#ffffff', padding: '1px 6px', borderRadius: '4px', marginLeft: '4px' }}>{pkg.badge}</span>}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{pkg.tagline}</div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.74rem', color: '#94a3b8', textDecoration: 'line-through', marginRight: '4px' }}>₹{pkg.originalPrice}</span>
                        <strong style={{ fontSize: '0.90rem', color: '#0f172a' }}>₹{pkg.price}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div style={{ marginTop: '12px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Kit MRP:</span>
                  <span>₹{activePackage.originalPrice}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 700 }}>
                  <span>Package Savings:</span>
                  <span>-₹{totalSaved}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Delivery Charges:</span>
                  <span style={{ color: '#059669', fontWeight: 800 }}>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '0.86rem', color: '#0f172a', paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}>
                  <span>Net Payable:</span>
                  <span>₹{finalPrice}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* CARD 2: DELIVERY DETAILS & INSTANT AUTOFILL ADDRESS FORM */}
        <div className="fast-card" style={{ position: 'relative' }}>
          {hasSavedAddress && !isEditingAddress ? (
            /* Saved Address Summary View */
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <MapPin style={{ width: '15px', height: '15px', color: '#16a34a' }} />
                  <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Deliver To {customerName || 'Your Name'}
                  </h3>
                </div>

                <div style={{ marginTop: '5px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                  <div>{flatNo ? `${flatNo}, ` : ''}{address}{landmark ? `, Near ${landmark}` : ''}</div>
                  <div>{city ? `${city}, ` : ''}{state ? `${state}, ` : ''}{pincode}</div>
                </div>

                <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span>+91 {phone}</span>
                  {email && (
                    <>
                      <span>|</span>
                      <span>{email}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right side: [ Change ] button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="fast-btn-change"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            /* Active Address Input Form with Standard Browser Autofill Heuristics */
            <form
              id="checkout-shipping-form"
              name="shipping-address-form"
              method="post"
              action="#"
              autoComplete="on"
              onSubmit={(e) => {
                e.preventDefault();
                handlePaymentSubmit();
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#16a34a' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                    {hasSavedAddress ? 'Edit Delivery Address' : 'Enter Delivery Details'}
                  </span>
                </div>
                {hasSavedAddress && (
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Browser Autofill Helper Banner */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '7px 10px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.74rem',
                color: '#15803d',
                fontWeight: 600
              }}>
                <span style={{ fontSize: '0.85rem' }}>⚡</span>
                <span><strong>Browser Autofill Enabled:</strong> Tap any field to auto-fill your saved address from Google or your browser.</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Full Name */}
                <div>
                  <label htmlFor="checkout-name" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                    Full Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="checkout-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    autoCapitalize="words"
                    spellCheck={false}
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      saveDetailsToStorage({ customerName: e.target.value });
                    }}
                    placeholder="Enter full name"
                    style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                {/* Mobile & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label htmlFor="checkout-phone" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                      Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex' }}>
                      <span style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', padding: '9px 8px', borderRadius: '8px 0 0 8px', fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>+91</span>
                      <input
                        id="checkout-phone"
                        name="tel"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(-10);
                          setPhone(v);
                          saveDetailsToStorage({ phone: v });
                        }}
                        placeholder="10-digit number"
                        style={{ width: '100%', padding: '9px 10px', borderRadius: '0 8px 8px 0', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-email" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                      Email (Optional)
                    </label>
                    <input
                      id="checkout-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        saveDetailsToStorage({ email: e.target.value });
                      }}
                      placeholder="name@email.com"
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                {/* Flat / House No */}
                <div>
                  <label htmlFor="checkout-flat" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                    Flat / House No. / Building <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="checkout-flat"
                    name="address-line1"
                    type="text"
                    autoComplete="address-line1"
                    value={flatNo}
                    onChange={(e) => {
                      setFlatNo(e.target.value);
                      saveDetailsToStorage({ flatNo: e.target.value });
                    }}
                    placeholder="e.g. 14A, 2nd Floor, Sai Apartments"
                    style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                {/* Street / Area */}
                <div>
                  <label htmlFor="checkout-street" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                    Area / Street / Sector <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="checkout-street"
                    name="address-line2"
                    type="text"
                    autoComplete="address-line2"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      saveDetailsToStorage({ address: e.target.value });
                    }}
                    placeholder="e.g. Adhilakshmi Nagar, Mathulampett"
                    style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                {/* Landmark */}
                <div>
                  <label htmlFor="checkout-landmark" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                    Landmark (Optional)
                  </label>
                  <input
                    id="checkout-landmark"
                    name="address-level3"
                    type="text"
                    autoComplete="address-level3"
                    value={landmark}
                    onChange={(e) => {
                      setLandmark(e.target.value);
                      saveDetailsToStorage({ landmark: e.target.value });
                    }}
                    placeholder="e.g. Near Mariyamman Kovil"
                    style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                {/* 6-Digit Pincode + City */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <label htmlFor="checkout-pincode" style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>
                        Pincode <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      {pincodeLoading && <span style={{ fontSize: '0.65rem', color: '#16a34a', fontWeight: 700 }}>Checking...</span>}
                    </div>
                    <input
                      id="checkout-pincode"
                      name="postal-code"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      value={pincode}
                      onChange={handlePincodeChange}
                      placeholder="6-digit PIN"
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', letterSpacing: '0.04em' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-city" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                      City / Town <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      id="checkout-city"
                      name="address-level2"
                      type="text"
                      autoComplete="address-level2"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        saveDetailsToStorage({ city: e.target.value });
                      }}
                      placeholder="e.g. Kumbakonam"
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                    />
                  </div>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="checkout-state" style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                    State <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    id="checkout-state"
                    name="address-level1"
                    type="text"
                    autoComplete="address-level1"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      saveDetailsToStorage({ state: e.target.value });
                    }}
                    placeholder="e.g. Tamil Nadu"
                    style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                {/* Hidden Country Input for Browser Autofill Heuristics Engine */}
                <input
                  id="checkout-country"
                  name="country"
                  type="hidden"
                  autoComplete="country-name"
                  value="India"
                />

                {/* Save button if user toggled from existing saved address */}
                {hasSavedAddress && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!customerName.trim() || !phone.trim() || !flatNo.trim() || !address.trim() || !pincode.trim()) {
                        alert('Please fill the required address details.');
                        return;
                      }
                      saveDetailsToStorage();
                      setIsEditingAddress(false);
                    }}
                    style={{
                      marginTop: '4px',
                      padding: '11px',
                      borderRadius: '8px',
                      background: '#111827',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm & Save Address ✓
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* CARD 3: SHIPPING CHARGE */}
        <div className="fast-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>
            Shipping Charge
          </span>
          <span className="shipping-free-badge">
            Free
          </span>
        </div>

        {/* SECTION: PAYMENT OPTIONS */}
        <div className="fast-section-header">PAYMENT OPTIONS</div>

        {/* ACTION BUTTON */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          {/* Yellow High-Converting Pay Now Button */}
          <button
            type="button"
            onClick={() => handlePaymentSubmit()}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              background: '#FFD814',
              color: '#0F172A',
              fontWeight: 900,
              fontSize: '1.04rem',
              border: '1px solid #FCD200',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(255, 216, 20, 0.45)',
              transition: 'all 0.15s ease'
            }}
          >
            {isProcessing ? (
              <>
                <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite', color: '#0F172A' }} />
                <span>Connecting Payment Gateway...</span>
              </>
            ) : (
              <>
                <Lock style={{ width: '17px', height: '17px', color: '#0F172A', strokeWidth: 2.5 }} />
                <span>Pay Now • ₹{finalPrice.toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Trust Feature Boxes (Fully Visible on Scroll) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '16px', marginBottom: '24px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 6px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <Truck style={{ width: '20px', height: '20px', color: '#111827', margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Express Courier</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>3-5 Days Delivery</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 6px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <Shield style={{ width: '20px', height: '20px', color: '#111827', margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>100% Protected</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>Guaranteed Dispatch</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 6px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
            <Lock style={{ width: '20px', height: '20px', color: '#111827', margin: '0 auto 6px' }} />
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Bank Encrypted</div>
            <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '2px' }}>256-Bit SSL Secure</div>
          </div>
        </div>

      </main>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" strategy="afterInteractive" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="fast-checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
