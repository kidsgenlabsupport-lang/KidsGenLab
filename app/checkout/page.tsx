"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle,
  Truck,
  Phone,
  User,
  MapPin,
  Home,
  Building2,
  Check,
  Package,
  AlertCircle,
  Shield,
  Sparkles,
  RotateCcw,
  Loader2
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
  const isPreselected = Boolean(
    packageParam && (packageParam === 'solo' || packageParam === 'sibling' || packageParam === 'family' || packageParam === 'starter')
  );

  const initialPkgKey: 'solo' | 'sibling' | 'family' =
    packageParam === 'starter' ? 'sibling' :
    (packageParam === 'solo' || packageParam === 'sibling' || packageParam === 'family') ? packageParam : 'sibling';

  const [selectedPackageId, setSelectedPackageId] = useState<'solo' | 'sibling' | 'family'>(initialPkgKey);
  const [packagesData, setPackagesData] = useState(defaultPackages);
  const [showPackagePicker, setShowPackagePicker] = useState<boolean>(!isPreselected);

  // Address fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  // Auto-fill & pincode detection state
  const [isAutoFilled, setIsAutoFilled] = useState<boolean>(false);
  const [pincodeLoading, setPincodeLoading] = useState<boolean>(false);
  const [pincodeDetectedInfo, setPincodeDetectedInfo] = useState<string>('');

  // Processing & State
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);
  const [formError, setFormError] = useState<string>('');

  // Save to localStorage helper
  const saveDetailsToStorage = (updatedFields?: Partial<{
    customerName: string;
    phone: string;
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
        setPincodeDetectedInfo(`${detectedDistrict || detectedCity}, ${detectedState}`);

        saveDetailsToStorage({
          city: city.trim() || detectedCity,
          district: district.trim() || detectedDistrict,
          state: state.trim() || detectedState,
          pincode: cleanPin
        });
      } else {
        setPincodeDetectedInfo('');
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
    } else {
      setPincodeDetectedInfo('');
    }
  };

  const handleClearSavedData = () => {
    setCustomerName('');
    setPhone('');
    setFlatNo('');
    setAddress('');
    setLandmark('');
    setCity('');
    setDistrict('');
    setState('');
    setPincode('');
    setPincodeDetectedInfo('');
    setIsAutoFilled(false);
    try {
      localStorage.removeItem('kidzmoney_user_address');
      localStorage.removeItem('kidsgenlab_customer_info');
    } catch (e) {}
  };

  // Restore details from URL params or localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    const qName = searchParams.get('name') || searchParams.get('customerName');
    const qPhone = searchParams.get('phone') || searchParams.get('tel') || searchParams.get('contact');
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
    const initPhone = (qPhone || savedData?.phone || savedData?.contact || '').replace(/\D/g, '').slice(0, 10);
    const initFlat = qFlat || savedData?.flatNo || savedData?.flat || '';
    const initAddress = qAddress || savedData?.address || savedData?.street || '';
    const initLandmark = qLandmark || savedData?.landmark || '';
    const initCity = qCity || savedData?.city || '';
    const initDistrict = qDistrict || savedData?.district || '';
    const initState = qState || savedData?.state || '';
    const initPin = (qPin || savedData?.pincode || savedData?.pin || '').replace(/\D/g, '').slice(0, 6);

    if (initName) setCustomerName(initName);
    if (initPhone) setPhone(initPhone);
    if (initFlat) setFlatNo(initFlat);
    if (initAddress) setAddress(initAddress);
    if (initLandmark) setLandmark(initLandmark);
    if (initCity) setCity(initCity);
    if (initDistrict) setDistrict(initDistrict);
    if (initState) setState(initState);
    if (initPin) setPincode(initPin);

    if (initName || initPhone || initPin || initAddress) {
      setIsAutoFilled(true);
    }

    if (initPin && initPin.length === 6 && (!initCity || !initState)) {
      fetchPincodeDetails(initPin);
    }
  }, []);

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

  const triggerConfetti = () => {
    if (typeof window !== 'undefined' && (window as any).confetti) {
      (window as any).confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 } });
    }
  };

  const handleWhatsAppDirectOrder = async () => {
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your Full Name to place your order via WhatsApp.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit Mobile Number.');
      return;
    }

    saveDetailsToStorage();

    const targetNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918300297197';
    const addressParts = [
      flatNo ? `Flat/House: ${flatNo}` : '',
      address ? `Street/Area: ${address}` : '',
      landmark ? `Landmark: ${landmark}` : '',
      city ? `City: ${city}` : '',
      district ? `District: ${district}` : '',
      state ? `State: ${state}` : '',
      pincode ? `Pincode: ${pincode}` : ''
    ].filter(Boolean);

    const formattedAddress = addressParts.join(', ');

    // Customer is directly diverted to WhatsApp, order will only be in DB if manually added later or if paid via Razorpay

    let msg = `NEW DIRECT ORDER VIA WHATSAPP\n`;
    msg += `--------------------------------------\n`;
    msg += `Selected Kit: ${activePackage.name}\n`;
    msg += `Offer Price: ₹${activePackage.price.toLocaleString('en-IN')}\n`;
    msg += `Customer Name: ${customerName.trim()}\n`;
    msg += `Phone Number: ${cleanPhone}\n`;
    if (formattedAddress) {
      msg += `Delivery Address: ${formattedAddress}\n`;
    }
    msg += `--------------------------------------\n`;
    msg += `Hi KidsGen Lab! I am placing this order for the ${activePackage.name} (₹${activePackage.price.toLocaleString('en-IN')}). Please confirm my order and share payment QR / tracking details!\n\n${window.location.origin}${activePackage.image}`;

    const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your Full Name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit Mobile Number.');
      return;
    }
    if (!flatNo.trim()) {
      setFormError('Please enter Flat, House no., or Building details.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter Area, Street or Sector.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter City / Town.');
      return;
    }
    if (!district.trim()) {
      setFormError('Please enter District.');
      return;
    }
    if (!state.trim()) {
      setFormError('Please enter State.');
      return;
    }
    const cleanPin = pincode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length < 6) {
      setFormError('Please enter a valid 6-digit Pincode.');
      return;
    }

    // Persist details for future ease
    saveDetailsToStorage();

    setIsProcessing(true);

    try {
      // 1. Create Order on Backend
      const createRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activePackage.price,
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

      const fullStreetAddress = landmark.trim()
        ? `${address.trim()}, Landmark: ${landmark.trim()}`
        : address.trim();

      // 2. Launch Razorpay
      const options = {
        key: createData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TWqcqybTpdjice',
        amount: createData.amount,
        currency: createData.currency || 'INR',
        name: 'Smart Kids Money Lab',
        description: `${activePackage.name} - Express Delivery`,
        order_id: createData.order_id,
        prefill: {
          name: customerName.trim(),
          contact: cleanPhone,
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
          color: '#000000'
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
                  customerName: customerName.trim(),
                  phone: cleanPhone,
                  email: '',
                  flatNo: flatNo.trim(),
                  address: fullStreetAddress,
                  city: city.trim(),
                  district: district.trim(),
                  state: state.trim(),
                  pincode: cleanPin,
                  packageName: activePackage.name,
                  price: activePackage.price,
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
                price: activePackage.price,
                customerName: customerName.trim(),
                phone: cleanPhone,
                city: city.trim(),
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
      <div className="checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} suppressHydrationWarning={true}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ShieldCheck style={{ width: '22px', height: '22px', color: '#ffffff' }} />
        </div>
      </div>
    );
  }

  // SUCCESS SCREEN
  if (paymentSuccessData) {
    return (
      <div className="checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }} suppressHydrationWarning={true}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ maxWidth: '440px', width: '100%', background: '#ffffff', borderRadius: '24px', border: '2px solid #000000', padding: '32px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
          suppressHydrationWarning={true}
        >
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#000000', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <CheckCircle style={{ width: '34px', height: '34px' }} />
          </div>

          <div>
            <span style={{ display: 'inline-block', background: '#f3f4f6', color: '#000000', border: '1px solid #000000', fontSize: '0.72rem', fontWeight: 900, padding: '4px 12px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Order Confirmed & Verified
            </span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#000000', marginTop: '10px' }}>
              Thank You, {paymentSuccessData.customerName}!
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#52525b', marginTop: '4px' }}>
              Your physical kit has been queued for immediate express dispatch.
            </p>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: '16px', padding: '16px', border: '1px solid #e5e7eb', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ color: '#52525b' }}>Selected Kit:</span>
              <strong style={{ color: '#000000', fontWeight: 900 }}>{paymentSuccessData.packageName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ color: '#52525b' }}>Total Paid:</span>
              <strong style={{ color: '#000000', fontWeight: 900, fontSize: '0.98rem' }}>₹{Number(paymentSuccessData.price).toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ color: '#52525b' }}>Payment ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#000000' }}>{paymentSuccessData.paymentId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#52525b' }}>Destination:</span>
              <span style={{ color: '#000000', fontWeight: 800 }}>{paymentSuccessData.city} (PIN: {paymentSuccessData.pincode})</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918300297197'}?text=${encodeURIComponent(
                `Hi KidsGen Lab! I just completed my order #${paymentSuccessData.paymentId || 'NEW'} for ${paymentSuccessData.packageName} (₹${paymentSuccessData.price}). Please send my delivery tracking and confirmation!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                background: '#25D366',
                color: '#ffffff',
                fontWeight: 900,
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.90rem',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
              }}
            >
              <span>💬 Open WhatsApp Confirmation & Tracking</span>
            </a>

            <Link
              href="/"
              style={{ display: 'block', width: '100%', padding: '13px', background: '#000000', color: '#ffffff', fontWeight: 900, borderRadius: '12px', textDecoration: 'none', fontSize: '0.90rem', textAlign: 'center' }}
            >
              ← Return to Storefront
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-page-root" suppressHydrationWarning={true}>
      
      {/* Top Clean Monochrome Header */}
      <header className="checkout-top-header" suppressHydrationWarning={true}>
        <div className="checkout-header-inner">
          <Link href="/" className="checkout-back-link">
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>Back to Store</span>
          </Link>

          <div className="checkout-secure-badge">
            <ShieldCheck style={{ width: '15px', height: '15px', color: '#000000' }} />
            <span>100% Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Form Center Column */}
      <main className="checkout-main-content" suppressHydrationWarning={true}>
        
        {/* 1. DELIVERING PACKAGE CARD (When pre-selected from website) */}
        {!showPackagePicker ? (
          <div className="delivering-item-card" suppressHydrationWarning={true}>
            <div className="delivering-card-header">
              <div className="delivering-label">
                <span className="delivering-pulse-dot" />
                <span>Delivering Package</span>
              </div>
              <button
                type="button"
                suppressHydrationWarning={true}
                onClick={() => setShowPackagePicker(true)}
                className="change-package-btn"
              >
                Change Kit ›
              </button>
            </div>

            <div className="delivering-card-body">
              {/* Thumbnail */}
              <div className="delivering-img-frame">
                <img
                  src={activePackage.image}
                  alt={activePackage.name}
                />
              </div>

              {/* Specs & Pricing */}
              <div className="delivering-details">
                <div className="delivering-title-row">
                  <h3 className="delivering-kit-title">{activePackage.name}</h3>
                  <span className="delivering-kit-price">₹{activePackage.price.toLocaleString('en-IN')}</span>
                </div>

                <p className="delivering-kit-desc">{activePackage.features}</p>

                <div className="delivering-tags-row">
                  <span className="tag-stock">✓ In Stock</span>
                  <span className="tag-free-delivery">FREE Express Delivery</span>
                  <span className="tag-mrp">₹{activePackage.originalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* PACKAGE SELECTOR (When arrived without preselection or clicked change) */
          <div className="package-picker-container" suppressHydrationWarning={true}>
            <div className="package-picker-header">
              <span className="package-picker-title">Select Your Mastery Kit</span>
              <span className="tag-free-delivery">Free All-India Delivery</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(Object.keys(packagesData) as Array<'solo' | 'sibling' | 'family'>).map((key) => {
                const pkg = packagesData[key];
                const isSelected = selectedPackageId === key;

                return (
                  <div
                    key={key}
                    onClick={() => setSelectedPackageId(key)}
                    className={`package-item-card ${isSelected ? 'active' : ''}`}
                  >
                    <div className="package-card-top">
                      <div className="package-card-left">
                        <div className="package-radio-circle">
                          {isSelected && <Check style={{ width: '13px', height: '13px', strokeWidth: 3 }} />}
                        </div>

                        <div className="package-thumb-small">
                          <img src={pkg.image} alt={pkg.name} />
                        </div>

                        <div className="package-info-block">
                          <div className="package-name-row">
                            <span className="package-name-text">{pkg.name}</span>
                            {pkg.badge && (
                              <span className="package-badge-mono">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="package-price-block">
                        <span className="package-price-mrp">₹{pkg.originalPrice}</span>
                        <span className="package-price-main">₹{pkg.price}</span>
                      </div>
                    </div>

                    <div className="package-tagline-text">{pkg.tagline}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. DELIVERY ADDRESS FORM */}
        <div className="checkout-form-card" suppressHydrationWarning={true}>
          
          <div className="form-header-box">
            <div className="form-header-icon">
              <MapPin style={{ width: '18px', height: '18px' }} />
            </div>
            <div className="form-header-text">
              <h2>Enter Delivery Address</h2>
              <p>Physical activity kit will be dispatched to this address</p>
            </div>
          </div>

          {/* AUTO-FILL HELPER NOTICE */}
          {isAutoFilled && (customerName || phone || pincode) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '14px',
                fontSize: '0.78rem',
                color: '#166534'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles style={{ width: '15px', height: '15px', color: '#16a34a', flexShrink: 0 }} />
                <span><strong>Autofill Active:</strong> Details restored from your saved profile / browser</span>
              </div>
              <button
                type="button"
                onClick={handleClearSavedData}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803d',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '2px 6px'
                }}
              >
                Clear
              </button>
            </div>
          )}

          {formError && (
            <div className="form-error-banner">
              <AlertCircle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
              <span>{formError}</span>
            </div>
          )}

          <form
            onSubmit={handlePaymentSubmit}
            id="checkoutAddressForm"
            name="checkoutAddressForm"
            autoComplete="off"
            method="post"
            action="#"
            suppressHydrationWarning={true}
          >
            
            {/* Country / Region */}
            <div className="form-input-group">
              <label className="form-field-label" htmlFor="customerCountry">Country / Region</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f3f4f6', border: '1.5px solid #d1d5db', borderRadius: '10px', padding: '11px 14px', fontSize: '0.84rem', fontWeight: 800, color: '#000000' }}>
                <span>🇮🇳 India (Free Express Delivery)</span>
                <Check style={{ width: '16px', height: '16px', color: '#000000', strokeWidth: 3 }} />
              </div>
              <input type="hidden" id="customerCountry" name="country-name" autoComplete="country-name" value="India" />
            </div>

            {/* Full Name */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerName">
                Full Name (First and Last name) <span className="req">*</span>
              </label>
              <div className="form-input-wrapper">
                <User className="input-icon" style={{ width: '18px', height: '18px' }} />
                <input
                  type="text"
                  id="customerName"
                  name="name"
                  autoComplete="name"
                  autoCapitalize="words"
                  autoCorrect="off"
                  spellCheck={false}
                  required
                  suppressHydrationWarning={true}
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    saveDetailsToStorage({ customerName: e.target.value });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className="form-control-input"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerPhone">
                Mobile Number (for courier updates & call) <span className="req">*</span>
              </label>
              <div className="phone-input-combo">
                <span className="phone-country-code">+91</span>
                <input
                  type="tel"
                  id="customerPhone"
                  name="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  suppressHydrationWarning={true}
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setPhone(val);
                    saveDetailsToStorage({ phone: val });
                  }}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="phone-field-input"
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '2px' }}>
                Courier tracking link will be sent to WhatsApp upon dispatch.
              </span>
            </div>

            {/* Flat / House No. */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerFlatNo">
                Flat, House no., Building, Apartment <span className="req">*</span>
              </label>
              <div className="form-input-wrapper">
                <Home className="input-icon" style={{ width: '18px', height: '18px' }} />
                <input
                  type="text"
                  id="customerFlatNo"
                  name="address-line1"
                  autoComplete="address-line1"
                  required
                  suppressHydrationWarning={true}
                  value={flatNo}
                  onChange={(e) => {
                    setFlatNo(e.target.value);
                    saveDetailsToStorage({ flatNo: e.target.value });
                  }}
                  placeholder="e.g. Flat 402, Sunshine Heights, Door 12-B"
                  className="form-control-input"
                />
              </div>
            </div>

            {/* Area / Street / Sector */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerAddress">
                Area, Street, Sector, Village <span className="req">*</span>
              </label>
              <div className="form-input-wrapper">
                <Building2 className="input-icon" style={{ width: '18px', height: '18px' }} />
                <input
                  type="text"
                  id="customerAddress"
                  name="address-line2"
                  autoComplete="address-line2"
                  required
                  suppressHydrationWarning={true}
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    saveDetailsToStorage({ address: e.target.value });
                  }}
                  placeholder="e.g. MG Road, Sector 15, Near Metro Pillar 42"
                  className="form-control-input"
                />
              </div>
            </div>

            {/* Landmark (Optional) */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerLandmark">
                Landmark <span style={{ color: '#71717a', fontWeight: 500 }}>(Optional)</span>
              </label>
              <input
                type="text"
                id="customerLandmark"
                name="address-line3"
                autoComplete="address-line3"
                suppressHydrationWarning={true}
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                  saveDetailsToStorage({ landmark: e.target.value });
                }}
                placeholder="E.g. Near Apollo Hospital / Opposite City Park"
                className="form-control-input no-icon"
              />
            </div>

            {/* Pincode with Auto-Detect */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-field-label" htmlFor="customerPincode">
                  6-digit Pincode <span className="req">*</span>
                </label>
                {pincodeLoading && (
                  <span style={{ fontSize: '0.72rem', color: '#000000', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                    <Loader2 style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                    Detecting City/State...
                  </span>
                )}
                {!pincodeLoading && pincodeDetectedInfo && (
                  <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Check style={{ width: '12px', height: '12px' }} />
                    {pincodeDetectedInfo}
                  </span>
                )}
              </div>
              <input
                type="text"
                id="customerPincode"
                name="postal-code"
                autoComplete="postal-code"
                inputMode="numeric"
                required
                suppressHydrationWarning={true}
                value={pincode}
                onChange={handlePincodeChange}
                placeholder="e.g. 400001 (auto-fills city & state)"
                maxLength={6}
                className="form-control-input no-icon"
                style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
              />
            </div>

            {/* Town/City & District */}
            <div className="form-grid-2col" style={{ marginTop: '14px' }}>
              <div className="form-input-group">
                <label className="form-field-label" htmlFor="customerCity">
                  Town / City <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="customerCity"
                  name="address-level2"
                  autoComplete="address-level2"
                  required
                  suppressHydrationWarning={true}
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    saveDetailsToStorage({ city: e.target.value });
                  }}
                  placeholder="e.g. Mumbai"
                  className="form-control-input no-icon"
                />
              </div>

              <div className="form-input-group">
                <label className="form-field-label" htmlFor="customerDistrict">
                  District <span className="req">*</span>
                </label>
                <input
                  type="text"
                  id="customerDistrict"
                  name="address-level3"
                  autoComplete="address-level3"
                  required
                  suppressHydrationWarning={true}
                  value={district}
                  onChange={(e) => {
                    setDistrict(e.target.value);
                    saveDetailsToStorage({ district: e.target.value });
                  }}
                  placeholder="e.g. Thane"
                  className="form-control-input no-icon"
                />
              </div>
            </div>

            {/* State */}
            <div className="form-input-group" style={{ marginTop: '14px' }}>
              <label className="form-field-label" htmlFor="customerState">
                State <span className="req">*</span>
              </label>
              <input
                type="text"
                id="customerState"
                name="address-level1"
                autoComplete="address-level1"
                required
                suppressHydrationWarning={true}
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                  saveDetailsToStorage({ state: e.target.value });
                }}
                placeholder="e.g. Maharashtra"
                className="form-control-input no-icon"
              />
            </div>

            {/* PRIMARY HIGH-CONVERTING LUXURY PAY BUTTON */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                type="submit"
                disabled={isProcessing}
                suppressHydrationWarning={true}
                className="checkout-submit-btn"
              >
                {isProcessing ? (
                  <>
                    <span style={{ display: 'inline-block', width: '18px', height: '18px', border: '2px solid #000000', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Connecting Payment Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Use this address & Pay ₹{activePackage.price.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              {/* OR FAST ORDER ON WHATSAPP BUTTON */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>or fast checkout</span>
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </div>

              <button
                type="button"
                onClick={handleWhatsAppDirectOrder}
                suppressHydrationWarning={true}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '0.94rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(37, 211, 102, 0.35)',
                  transition: 'transform 0.15s ease, background 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1ebe57')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#25D366')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="#ffffff">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157.1zM223.9 436.8c-33.1 0-65.5-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span>Order via WhatsApp (Pay on Chat)</span>
              </button>

            </div>

          </form>

        </div>

        {/* 3 Trust Features (Monochrome) */}
        <div className="trust-features-grid" suppressHydrationWarning={true}>
          <div className="trust-feature-box">
            <Truck style={{ width: '20px', height: '20px', color: '#000000' }} />
            <span className="trust-feature-title">Express Courier</span>
            <span className="trust-feature-sub">3-5 Days Delivery</span>
          </div>

          <div className="trust-feature-box">
            <Shield style={{ width: '20px', height: '20px', color: '#000000' }} />
            <span className="trust-feature-title">100% Protected</span>
            <span className="trust-feature-sub">Guaranteed Dispatch</span>
          </div>

          <div className="trust-feature-box">
            <Lock style={{ width: '20px', height: '20px', color: '#000000' }} />
            <span className="trust-feature-title">Bank Encrypted</span>
            <span className="trust-feature-sub">256-Bit SSL Secure</span>
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
    <Suspense fallback={<div className="checkout-page-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
