"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  MessageSquare,
  Share2,
  Tag,
  ShieldCheck,
  Lock,
  Search,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Save,
  Filter,
  Check,
  Copy,
  Key,
  ExternalLink,
  Eye,
  EyeOff,
  Menu,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileText,
  DollarSign,
  ArrowUpRight,
  Shield,
  Activity,
  Zap,
  Layers,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  Palette,
  Code,
  Paintbrush,
  Users,
  Globe,
  Radio,
  Monitor,
  Smartphone
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  state?: string;
  address?: string;
  packageName: string;
  price: number;
  currency: string;
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled';
  paymentMethod: string;
  createdAt: string;
  notes: string;
  affiliateRef?: string;
}

interface AnalyticsData {
  liveCount: number;
  totalSessions: number;
  totalUniqueVisitors: number;
  avgDurationSec: number;
  avgDurationFormatted: string;
  totalPageViews: number;
  deviceCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  referrerCounts: Record<string, number>;
  durationTiers: {
    quickBounce: number;
    shortBrowse: number;
    engaged: number;
    deepRead: number;
    superFan: number;
  };
  recentSessions: Array<{
    id: number;
    sessionId: string;
    visitorId: string;
    deviceType: string;
    browser: string;
    os: string;
    referrer: string;
    affiliateRef?: string;
    landingPage: string;
    currentPage: string;
    pageViews: number;
    durationSeconds: number;
    durationFormatted: string;
    firstSeen: string;
    lastHeartbeat: string;
    isLive: boolean;
    isRecent: boolean;
    status: string;
  }>;
}

type NavSection = 'overview' | 'traffic' | 'orders' | 'payment' | 'whatsapp' | 'affiliates' | 'pricing' | 'theme' | 'content';

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Visitor Traffic & Duration Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [analyticsPreset, setAnalyticsPreset] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [autoRefreshTraffic, setAutoRefreshTraffic] = useState<boolean>(true);
  const [trafficSearchTerm, setTrafficSearchTerm] = useState<string>('');

  // Orders State & Date Filters
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [datePreset, setDatePreset] = useState<'all' | 'today' | 'yesterday' | '7days' | '30days' | 'custom'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Settings State
  const [settings, setSettings] = useState<any>({
    general: {
      siteName: "KidsGen Lab",
      supportEmail: "support@kidsgenlab.com",
      announcementEnabled: true,
      announcementText: "🎉 SALE IS LIVE: Save up to 60% on all Smart Kids Kits today!"
    },
    payment: {
      gateway: "razorpay",
      isLiveMode: false,
      razorpayKeyId: "",
      razorpayKeySecret: "",
      currency: "INR",
      autoCapture: true
    },
    whatsapp: {
      supportNumber: "919876543210",
      defaultMessage: "Hi KidsGen Lab! I am interested in ordering the Smart Money kit for my child. Please help!",
      autoNotificationEnabled: true,
      provider: "meta",
      meta: {
        phoneNumberId: "",
        accessToken: "",
        businessAccountId: "",
        templateName: "order_confirmation"
      },
      twilio: {
        accountSid: "",
        authToken: "",
        fromNumber: ""
      },
      customWebhook: {
        url: "",
        apiKey: ""
      },
      messageTemplate: `🎉 *Congratulations {customer_name}!* 🚀\n\nYour order for *{package_name}* (*#{order_id}*) is *CONFIRMED & PAID*!\n\n💰 *Amount Paid:* ₹{amount}\n📦 *Status:* Being packed for priority shipping\n🚚 *Delivery:* 3–5 business days across India\n\nNeed any assistance? Reply to this message or contact support at +{support_number}.\n\nThank you for choosing *KidsGen Lab* to empower your child's financial intelligence! 🌟`
    },
    pricing: {
      solo: { name: "Starter Saver Kit", price: 1199, originalPrice: 1999, tagline: "The Irresistible Sweet Spot (Save 40%!)" },
      starter: { name: "Little Achiever Kit", price: 1499, originalPrice: 3999, tagline: "Most Popular for ages 7-12" },
      family: { name: "Family Champions Bundle", price: 2999, originalPrice: 5999, tagline: "Complete All-In-One Legacy Edition" }
    },
    theme: {
      primaryColor: "#0d9488",
      accentColor: "#f59e0b",
      headerBg: "#ffffff",
      bannerBg: "#000000",
      bannerTextColor: "#ffffff",
      buttonBg: "#000000",
      buttonTextColor: "#ffffff",
      borderRadius: "16px",
      customCss: "/* Custom Database CSS rules */\n.checkout-submit-btn {\n  /* Custom styles stored in DB */\n}\n"
    }
  });
  const [settingsLoading, setSettingsLoading] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string>('');
  const [showSecret, setShowSecret] = useState<boolean>(false);
  const [showWaToken, setShowWaToken] = useState<boolean>(false);

  // WhatsApp Test State
  const [testPhone, setTestPhone] = useState<string>('');
  const [testSending, setTestSending] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string>('');

  // Affiliate Link Generator State
  const [creatorTag, setCreatorTag] = useState<string>('pooja_mom');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // New Manual Order Form State
  const [newOrder, setNewOrder] = useState({
    customerName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    address: '',
    packageName: 'Starter Saver Kit',
    price: 1199,
    paymentMethod: 'UPI / Razorpay',
    status: 'Completed' as const,
    notes: 'Direct WhatsApp / Admin booking',
    affiliateRef: ''
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '9803') {
      setIsAuthenticated(true);
      setPinError('');
      fetchOrders();
      fetchSettings();
      fetchAnalytics();
    } else {
      setPinError('Incorrect Security PIN. Access Denied.');
    }
  };

  const fetchAnalytics = async (preset = analyticsPreset) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?preset=${preset}`);
      const data = await res.json();
      if (data && typeof data === 'object') {
        setAnalyticsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAnalytics(analyticsPreset);

    if (!autoRefreshTraffic) return;
    const interval = setInterval(() => {
      fetchAnalytics(analyticsPreset);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, analyticsPreset, autoRefreshTraffic]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoading(true);
    try {
      const res = await fetch('/api/settings?pin=9803');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSettingsLoading(true);
    setSaveToast('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: '9803', settings })
      });
      const data = await res.json();
      if (data.success) {
        setSaveToast('✓ Settings updated and applied live to the website!');
        setTimeout(() => setSaveToast(''), 4000);
      } else {
        alert(data.message || 'Error saving settings');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to connect to server.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleCopyAffiliate = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSendTestWhatsApp = async () => {
    if (!testPhone) {
      alert('Please enter a phone number with country code (e.g. 919876543210)');
      return;
    }
    setTestSending(true);
    setTestResult('');
    try {
      const res = await fetch('/api/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone, customerName: 'Champion Parent' })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.simulated ? '✓ Message verified & simulated! (Save Meta/Twilio credentials below to send live)' : '✓ WhatsApp message dispatched successfully to ' + testPhone);
      } else {
        setTestResult('✕ Error: ' + (data.message || 'Failed to dispatch'));
      }
    } catch (err: any) {
      setTestResult('✕ Network error sending test WhatsApp');
    } finally {
      setTestSending(false);
    }
  };

  const formatOrderDateTime = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: Order['status']) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
          if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status: newStatus });
          }
        }
      }
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchOrders();
        setNewOrder({
          customerName: '',
          email: '',
          phone: '',
          city: '',
          state: '',
          address: '',
          packageName: 'Starter Saver Kit',
          price: 1199,
          paymentMethod: 'UPI / Razorpay',
          status: 'Completed',
          notes: 'Direct WhatsApp / Admin booking',
          affiliateRef: ''
        });
      }
    } catch (err) {
      console.error('Create order error:', err);
    }
  };

  const filteredOrders = useMemo(() => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const yestDate = new Date();
    yestDate.setDate(yestDate.getDate() - 1);
    const yesterdayStr = `${yestDate.getFullYear()}-${String(yestDate.getMonth() + 1).padStart(2, '0')}-${String(yestDate.getDate()).padStart(2, '0')}`;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    return orders.filter(order => {
      const q = searchTerm.toLowerCase();
      const matchText =
        order.customerName?.toLowerCase().includes(q) ||
        order.email?.toLowerCase().includes(q) ||
        order.phone?.includes(searchTerm) ||
        order.id?.toLowerCase().includes(q) ||
        order.city?.toLowerCase().includes(q) ||
        (order.affiliateRef && order.affiliateRef.toLowerCase().includes(q));
      
      const matchStatus = statusFilter === 'All' || order.status === statusFilter;

      let matchDate = true;
      if (order.createdAt) {
        const orderDateObj = new Date(order.createdAt);
        const orderDateStr = `${orderDateObj.getFullYear()}-${String(orderDateObj.getMonth() + 1).padStart(2, '0')}-${String(orderDateObj.getDate()).padStart(2, '0')}`;

        if (datePreset === 'today') {
          matchDate = orderDateStr === todayStr;
        } else if (datePreset === 'yesterday') {
          matchDate = orderDateStr === yesterdayStr;
        } else if (datePreset === '7days') {
          matchDate = orderDateObj >= sevenDaysAgo;
        } else if (datePreset === '30days') {
          matchDate = orderDateObj >= thirtyDaysAgo;
        } else if (datePreset === 'custom' && selectedDate) {
          matchDate = orderDateStr === selectedDate;
        }
      }

      return matchText && matchStatus && matchDate;
    });
  }, [orders, searchTerm, statusFilter, datePreset, selectedDate]);

  const handleExportCSV = () => {
    const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'City', 'State', 'Address', 'Package', 'Price (INR)', 'Status', 'Payment Method', 'Date', 'Notes', 'Affiliate'];
    const rows = filteredOrders.map(o => [
      o.id,
      `"${o.customerName}"`,
      o.email,
      `'${o.phone}`,
      `"${o.city}"`,
      `"${o.state || ''}"`,
      `"${(o.address || '').replace(/"/g, '""')}"`,
      `"${o.packageName}"`,
      o.price,
      o.status,
      o.paymentMethod,
      o.createdAt,
      `"${(o.notes || '').replace(/"/g, '""')}"`,
      o.affiliateRef || 'Direct'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `kidzmoney_orders_${selectedDate || datePreset || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => o.status === 'Completed' ? sum + Number(o.price || 0) : sum, 0);
    const completed = orders.filter(o => o.status === 'Completed').length;
    const pending = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;
    return { revenue: totalRev, completed, pending, total: orders.length };
  }, [orders]);

  const generatedAffiliateUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?ref=${creatorTag || 'influencer'}`
    : `https://yourdomain.com/?ref=${creatorTag || 'influencer'}`;

  const affiliateStats = useMemo(() => {
    const map: Record<string, { count: number; completedCount: number; revenue: number; orders: Order[] }> = {};
    orders.forEach(o => {
      if (o.affiliateRef) {
        const ref = o.affiliateRef.trim().toLowerCase();
        if (!map[ref]) {
          map[ref] = { count: 0, completedCount: 0, revenue: 0, orders: [] };
        }
        map[ref].count += 1;
        map[ref].orders.push(o);
        if (o.status === 'Completed') {
          map[ref].completedCount += 1;
          map[ref].revenue += Number(o.price || 0);
        }
      }
    });
    return Object.entries(map).map(([tag, data]) => ({ tag, ...data }));
  }, [orders]);

  // Hydration guard
  if (!isMounted) {
    return (
      <div className="admin-pin-wrapper" suppressHydrationWarning={true}>
        <div className="admin-pin-icon-box">
          <ShieldCheck style={{ width: '28px', height: '28px' }} />
        </div>
      </div>
    );
  }

  // 1. PIN LOCK LOGIN VIEW (Monochrome Luxury Black & White)
  if (!isAuthenticated) {
    return (
      <div className="admin-pin-wrapper" suppressHydrationWarning={true}>
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="admin-pin-card"
          suppressHydrationWarning={true}
        >
          <div className="admin-pin-icon-box">
            <ShieldCheck style={{ width: '32px', height: '32px', strokeWidth: 2.5 }} />
          </div>

          <h1 className="admin-pin-title">KidsGen Lab Admin</h1>
          <p className="admin-pin-sub">Store Operations & Realtime Controls</p>

          <form onSubmit={handlePinSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} suppressHydrationWarning={true}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="admin-label">Master Security PIN</span>
                <span style={{ fontSize: '0.70rem', color: '#71717a' }}>Authorized Personnel Only</span>
              </div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                maxLength={10}
                className="admin-pin-input"
                autoComplete="off"
                autoFocus
                suppressHydrationWarning={true}
              />
              {pinError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffffff', fontSize: '0.75rem', fontWeight: 800, marginTop: '8px', background: '#18181b', padding: '6px 10px', borderRadius: '8px', border: '1px solid #3f3f46' }}>
                  <AlertCircle style={{ width: '14px', height: '14px' }} />
                  <span>{pinError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              suppressHydrationWarning={true}
              className="admin-btn-primary"
              style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: '0.90rem' }}
            >
              <span>Unlock Admin Panel</span>
              <ArrowUpRight style={{ width: '16px', height: '16px' }} />
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #1f1f23' }}>
            <Link
              href="/"
              style={{ color: '#a1a1aa', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft style={{ width: '14px', height: '14px' }} />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Sales metrics & fast shortcuts' },
    { id: 'traffic', label: 'Visitor Traffic & Duration', icon: Users, desc: 'Live visitors, time spent on website & traffic sources', badge: analyticsData?.liveCount ? `${analyticsData.liveCount} Live` : undefined },
    { id: 'orders', label: 'Orders & Deliveries', icon: Package, desc: 'Search buyers, status & CSV export', badge: orders.length },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard, desc: 'Razorpay Live/Test mode & API keys' },
    { id: 'whatsapp', label: 'WhatsApp & Support', icon: MessageSquare, desc: 'Customer support number & greeting' },
    { id: 'affiliates', label: 'Creator & Referral Links', icon: Share2, desc: '1-Click creator referral links' },
    { id: 'pricing', label: 'Prices & Promo Banner', icon: Tag, desc: 'Update kit pricing & sale announcement' },
    { id: 'theme', label: 'Custom CSS & Theme', icon: Palette, desc: 'Customize website colors & inject custom CSS stored in DB' },
    { id: 'content', label: 'Store Content & Info', icon: FileText, desc: 'Brand name, support email & identity' },
  ];

  return (
    <div className="admin-page-root" suppressHydrationWarning={true}>
      
      <div className="admin-layout-container">

        {/* SIDEBAR NAVIGATION */}
        <aside className={`admin-sidebar-aside ${sidebarOpen ? 'open' : ''}`}>
          
          {/* Header */}
          <div className="admin-sidebar-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="admin-brand-logo-pill">K</div>
              <div>
                <h2 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>KidsGen Lab</h2>
                <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Admin Console</span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex' }}
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="admin-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id as NavSection);
                    setSidebarOpen(false);
                  }}
                  className={`admin-nav-button ${isActive ? 'active' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Icon className="admin-nav-icon" style={{ width: '16px', height: '16px' }} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="admin-nav-badge">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="admin-sidebar-footer">
            <Link
              href="/"
              target="_blank"
              className="admin-btn-secondary"
              style={{ width: '100%', justifyContent: 'center', boxSizing: 'border-box' }}
            >
              <span>View Storefront</span>
              <ExternalLink style={{ width: '13px', height: '13px' }} />
            </Link>

            <button
              onClick={() => setIsAuthenticated(false)}
              style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '0.74rem', fontWeight: 800, cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Lock style={{ width: '13px', height: '13px' }} />
              <span>Lock Panel</span>
            </button>
          </div>

        </aside>

        {/* MAIN BODY AREA */}
        <div className="admin-main-wrapper">
          
          {/* Top Header */}
          <header className="admin-top-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                className="admin-btn-secondary"
                style={{ padding: '6px 10px' }}
              >
                <Menu style={{ width: '16px', height: '16px' }} />
              </button>

              <div>
                <h1 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', textTransform: 'capitalize' }}>
                  {navItems.find(i => i.id === currentSection)?.label}
                </h1>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentSection !== 'overview' && currentSection !== 'orders' && (
                <button
                  onClick={() => handleSaveSettings()}
                  disabled={settingsLoading}
                  className="admin-btn-primary"
                >
                  <Save style={{ width: '14px', height: '14px' }} />
                  <span>{settingsLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              )}

              <Link
                href="/"
                target="_blank"
                className="admin-btn-secondary"
              >
                <span>Live Store</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </Link>
            </div>
          </header>

          {/* Dynamic Body Content */}
          <main className="admin-body-container">
            
            {/* Save Toast Notification */}
            {saveToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '12px 16px', background: '#18181b', border: '1.5px solid #ffffff', color: '#ffffff', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>{saveToast}</span>
                </div>
                <button onClick={() => setSaveToast('')} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 900 }}>✕</button>
              </motion.div>
            )}

            {/* 1. OVERVIEW SECTION */}
            {currentSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Stats Grid */}
                <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                  {/* Live On Site */}
                  <div className="admin-stat-card" style={{ borderColor: '#15803d', background: 'linear-gradient(180deg, #052e16 0%, #09090b 100%)', cursor: 'pointer' }} onClick={() => setCurrentSection('traffic')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label" style={{ color: '#86efac' }}>Live Active Now</span>
                      <Radio style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#ffffff' }}>{analyticsData?.liveCount || 0}</div>
                    <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700, marginTop: '4px', display: 'block' }}>● Real-time store visitors</span>
                  </div>

                  {/* Avg Duration */}
                  <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('traffic')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Avg Time on Site</span>
                      <Clock style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#38bdf8' }}>{analyticsData?.avgDurationFormatted || '0s'}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Avg active browsing</span>
                  </div>

                  {/* Total Revenue */}
                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Total Revenue</span>
                      <DollarSign style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                    </div>
                    <div className="admin-stat-val">₹{stats.revenue.toLocaleString('en-IN')}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Real-time earnings</span>
                  </div>

                  {/* Total Orders */}
                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Total Orders</span>
                      <Package style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                    </div>
                    <div className="admin-stat-val">{stats.total}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Total buyers</span>
                  </div>

                  {/* Unique Visitors */}
                  <div className="admin-stat-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('traffic')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Unique Visitors</span>
                      <Users style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                    </div>
                    <div className="admin-stat-val">{analyticsData?.totalUniqueVisitors || 0}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Total unique members</span>
                  </div>

                  {/* Completed */}
                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Completed</span>
                      <CheckCircle style={{ width: '16px', height: '16px', color: '#34d399' }} />
                    </div>
                    <div className="admin-stat-val">{stats.completed}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Verified paid online</span>
                  </div>
                </div>

                {/* Fast Action Shortcuts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('traffic')}>
                    <Users style={{ width: '24px', height: '24px', marginBottom: '10px', color: '#38bdf8' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Visitor Traffic & Duration</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>Watch live members on your store, inspect time spent per visitor, device hardware, and traffic streams.</p>
                  </div>

                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('orders')}>
                    <Package style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Orders & Delivery Manager</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>Search buyers, inspect shipping addresses, update fulfillment status, and export CSVs.</p>
                  </div>

                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('affiliates')}>
                    <Share2 style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Creator Referral Links</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>Generate 1-click trackable campaign URLs for Instagram and YouTube influencer partners.</p>
                  </div>

                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('pricing')}>
                    <Tag style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Pricing & Announcement</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>Control Starter, Achiever & Family bundle live prices and marquee banner text.</p>
                  </div>
                </div>

                {/* Recent Orders Stream */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Recent Orders Stream</h3>
                    <button
                      onClick={() => setCurrentSection('orders')}
                      className="admin-btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                    >
                      View All
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0', color: '#71717a', fontSize: '0.80rem' }}>
                      No customer orders recorded yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {orders.slice(0, 5).map((ord) => (
                        <div
                          key={ord.id}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: '#09090b', borderRadius: '10px', border: '1px solid #1f1f23' }}
                        >
                          <div>
                            <div style={{ fontWeight: 900, fontSize: '0.85rem' }}>{ord.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: '#71717a' }}>{ord.packageName} • {ord.city}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 900, fontSize: '0.90rem' }}>₹{Number(ord.price).toLocaleString('en-IN')}</div>
                            <span className={ord.status === 'Completed' ? 'admin-badge-completed' : 'admin-badge-pending'}>
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* VISITOR TRAFFIC & SESSION DURATION SECTION */}
            {currentSection === 'traffic' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Header & Controls Bar */}
                <div className="admin-card" style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>Website Traffic & Visitor Duration</h2>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#052e16', color: '#4ade80', border: '1px solid #15803d', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }}></span>
                          {analyticsData?.liveCount || 0} Online Now
                        </span>
                      </div>
                      <p style={{ fontSize: '0.76rem', color: '#a1a1aa', marginTop: '4px' }}>
                        Real-time tracking of visitor traffic, how much time each user spends exploring the website, device types, and referral sources.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                      {/* Preset Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#09090b', padding: '4px', borderRadius: '10px', border: '1px solid #27272a' }}>
                        {[
                          { id: 'all', label: 'All Time' },
                          { id: 'today', label: 'Today' },
                          { id: '7days', label: 'Last 7 Days' },
                          { id: '30days', label: 'Last 30 Days' },
                        ].map(p => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => setAnalyticsPreset(p.id as any)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer',
                              background: analyticsPreset === p.id ? '#ffffff' : 'transparent',
                              color: analyticsPreset === p.id ? '#000000' : '#a1a1aa',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Auto Refresh Toggle */}
                      <button
                        type="button"
                        onClick={() => setAutoRefreshTraffic(!autoRefreshTraffic)}
                        className="admin-btn-secondary"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.72rem',
                          borderColor: autoRefreshTraffic ? '#22c55e' : '#27272a',
                          color: autoRefreshTraffic ? '#4ade80' : '#a1a1aa'
                        }}
                        title="Auto-refresh every 8 seconds"
                      >
                        <Radio style={{ width: '13px', height: '13px' }} />
                        <span>{autoRefreshTraffic ? 'Live Auto-Sync: ON' : 'Live Auto-Sync: OFF'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => fetchAnalytics(analyticsPreset)}
                        className="admin-btn-secondary"
                        style={{ padding: '6px 10px' }}
                        title="Refresh Now"
                      >
                        <RefreshCw className={analyticsLoading ? 'animate-spin' : ''} style={{ width: '14px', height: '14px' }} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metric Overview Cards */}
                <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                  <div className="admin-stat-card" style={{ borderColor: '#15803d', background: 'linear-gradient(180deg, #052e16 0%, #09090b 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label" style={{ color: '#86efac' }}>Live Online Now</span>
                      <Radio style={{ width: '16px', height: '16px', color: '#22c55e' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#ffffff' }}>{analyticsData?.liveCount || 0}</div>
                    <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: 700, marginTop: '4px', display: 'block' }}>Active in last 2 mins</span>
                  </div>

                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Avg Duration on Site</span>
                      <Clock style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
                    </div>
                    <div className="admin-stat-val">{analyticsData?.avgDurationFormatted || '0s'}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Average active browsing time</span>
                  </div>

                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Unique Visitors</span>
                      <Users style={{ width: '16px', height: '16px', color: '#a855f7' }} />
                    </div>
                    <div className="admin-stat-val">{analyticsData?.totalUniqueVisitors || 0}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Distinct devices & visitors</span>
                  </div>

                  <div className="admin-stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Total Page Views</span>
                      <Eye style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                    </div>
                    <div className="admin-stat-val">{analyticsData?.totalPageViews || 0}</div>
                    <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 700, marginTop: '4px', display: 'block' }}>Storefront & checkout views</span>
                  </div>
                </div>

                {/* Duration Distribution & Device/Referrer Insights Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  
                  {/* 1. Time Spent on Site Distribution */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Visitor Duration Breakdown</h3>
                        <p style={{ fontSize: '0.72rem', color: '#71717a' }}>How long visitors spend exploring before purchasing or leaving</p>
                      </div>
                      <Clock style={{ width: '16px', height: '16px', color: '#71717a' }} />
                    </div>

                    {(() => {
                      const tiers = analyticsData?.durationTiers || { quickBounce: 0, shortBrowse: 0, engaged: 0, deepRead: 0, superFan: 0 };
                      const total = (analyticsData?.totalSessions || 1);
                      const list = [
                        { label: '⚡ Quick Glance (< 30s)', count: tiers.quickBounce, color: '#71717a', desc: 'Landed and bounced' },
                        { label: '🔍 Short Browse (30s – 2 min)', count: tiers.shortBrowse, color: '#38bdf8', desc: 'Read headlines & product benefits' },
                        { label: '📖 Engaged Reader (2 – 5 min)', count: tiers.engaged, color: '#818cf8', desc: 'Explored curriculum & packages' },
                        { label: '🎯 High-Intent Buyer (5 – 15 min)', count: tiers.deepRead, color: '#34d399', desc: 'Compared pricing & checked out' },
                        { label: '⭐ Deep Explorer (> 15 min)', count: tiers.superFan, color: '#f59e0b', desc: 'Highly engaged audience' }
                      ];

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {list.map((item, idx) => {
                            const pct = Math.round((item.count / total) * 100) || 0;
                            return (
                              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                                  <span style={{ fontWeight: 800, color: '#ffffff' }}>{item.label}</span>
                                  <span style={{ color: '#a1a1aa', fontWeight: 700 }}>{item.count} sessions ({pct}%)</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: '#1f1f23', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div style={{ width: `${Math.min(100, Math.max(pct > 0 ? 3 : 0, pct))}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 0.4s ease' }}></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* 2. Device Types & Traffic Referrers */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Device Types & Sources</h3>
                        <p style={{ fontSize: '0.72rem', color: '#71717a' }}>Visitor hardware and referral channels</p>
                      </div>
                      <Globe style={{ width: '16px', height: '16px', color: '#71717a' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Device Split */}
                      <div>
                        <span style={{ fontSize: '0.70rem', color: '#71717a', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Device Breakdown:</span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          <div style={{ background: '#09090b', padding: '10px', borderRadius: '10px', border: '1px solid #1f1f23', textAlign: 'center' }}>
                            <Smartphone style={{ width: '16px', height: '16px', margin: '0 auto 4px', color: '#38bdf8' }} />
                            <div style={{ fontSize: '0.70rem', color: '#71717a' }}>Mobile</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{analyticsData?.deviceCounts?.Mobile || 0}</div>
                          </div>
                          <div style={{ background: '#09090b', padding: '10px', borderRadius: '10px', border: '1px solid #1f1f23', textAlign: 'center' }}>
                            <Monitor style={{ width: '16px', height: '16px', margin: '0 auto 4px', color: '#818cf8' }} />
                            <div style={{ fontSize: '0.70rem', color: '#71717a' }}>Desktop</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{analyticsData?.deviceCounts?.Desktop || 0}</div>
                          </div>
                          <div style={{ background: '#09090b', padding: '10px', borderRadius: '10px', border: '1px solid #1f1f23', textAlign: 'center' }}>
                            <Globe style={{ width: '16px', height: '16px', margin: '0 auto 4px', color: '#34d399' }} />
                            <div style={{ fontSize: '0.70rem', color: '#71717a' }}>Tablet / Other</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#ffffff' }}>{analyticsData?.deviceCounts?.Tablet || 0}</div>
                          </div>
                        </div>
                      </div>

                      {/* Top Referrers */}
                      <div>
                        <span style={{ fontSize: '0.70rem', color: '#71717a', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Top Referral Sources:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {Object.entries(analyticsData?.referrerCounts || {}).length === 0 ? (
                            <div style={{ fontSize: '0.74rem', color: '#71717a' }}>No referral data captured yet.</div>
                          ) : (
                            Object.entries(analyticsData?.referrerCounts || {}).slice(0, 5).map(([ref, count], i) => (
                              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', padding: '6px 10px', borderRadius: '8px', border: '1px solid #1e1e22', fontSize: '0.72rem' }}>
                                <span style={{ color: ref.startsWith('Affiliate') ? '#38bdf8' : '#ffffff', fontWeight: 700 }}>{ref}</span>
                                <span style={{ color: '#a1a1aa', fontWeight: 800 }}>{count} visits</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Visitor Sessions Stream */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Live Visitor Activity Stream & Session Logs</h3>
                      <p style={{ fontSize: '0.72rem', color: '#71717a' }}>Real-time feed of active visitors, current pages, and time spent</p>
                    </div>
                    
                    <div style={{ position: 'relative', width: '240px' }}>
                      <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                      <input
                        type="text"
                        value={trafficSearchTerm}
                        onChange={(e) => setTrafficSearchTerm(e.target.value)}
                        placeholder="Search visitor, page, referral..."
                        className="admin-input-control"
                        style={{ paddingLeft: '30px', padding: '6px 10px 6px 30px', fontSize: '0.74rem' }}
                      />
                    </div>
                  </div>

                  {(() => {
                    const sessions = (analyticsData?.recentSessions || []).filter(s => {
                      if (!trafficSearchTerm) return true;
                      const q = trafficSearchTerm.toLowerCase();
                      return (
                        s.visitorId?.toLowerCase().includes(q) ||
                        s.deviceType?.toLowerCase().includes(q) ||
                        s.browser?.toLowerCase().includes(q) ||
                        s.os?.toLowerCase().includes(q) ||
                        s.referrer?.toLowerCase().includes(q) ||
                        s.affiliateRef?.toLowerCase().includes(q) ||
                        s.landingPage?.toLowerCase().includes(q) ||
                        s.currentPage?.toLowerCase().includes(q)
                      );
                    });

                    if (sessions.length === 0) {
                      return (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#71717a', fontSize: '0.80rem' }}>
                          <Users style={{ width: '32px', height: '32px', margin: '0 auto 10px', color: '#3f3f46' }} />
                          <p>No visitor sessions recorded yet.</p>
                          <span style={{ fontSize: '0.72rem', color: '#52525b' }}>Open your website in another browser tab to see your live session appear here immediately!</span>
                        </div>
                      );
                    }

                    return (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Visitor / Device</th>
                              <th>Status</th>
                              <th>Duration on Site</th>
                              <th>Current & Landing Page</th>
                              <th>Traffic Source</th>
                              <th>Pages</th>
                              <th>Last Active</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sessions.map((s) => (
                              <tr key={s.sessionId || s.id}>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#18181b', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      {s.deviceType === 'Mobile' ? <Smartphone style={{ width: '14px', height: '14px', color: '#38bdf8' }} /> : <Monitor style={{ width: '14px', height: '14px', color: '#818cf8' }} />}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#ffffff' }}>
                                        {s.deviceType} • {s.browser} ({s.os})
                                      </div>
                                      <div style={{ fontSize: '0.66rem', color: '#71717a', fontFamily: 'monospace' }}>
                                        ID: {s.visitorId.slice(0, 14)}...
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  {s.isLive ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#052e16', color: '#4ade80', border: '1px solid #15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}></span>
                                      Online Now
                                    </span>
                                  ) : s.isRecent ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#422006', color: '#fde047', border: '1px solid #854d0e', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800 }}>
                                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#eab308' }}></span>
                                      Active recently
                                    </span>
                                  ) : (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#18181b', color: '#71717a', border: '1px solid #27272a', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 700 }}>
                                      Ended
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div style={{ fontWeight: 900, fontSize: '0.86rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                                    ⏱️ {s.durationFormatted}
                                  </div>
                                  <span style={{ fontSize: '0.66rem', color: '#71717a' }}>{s.durationSeconds}s total</span>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.74rem', color: '#ffffff', fontWeight: 700 }}>
                                    {s.currentPage || '/'}
                                  </div>
                                  <div style={{ fontSize: '0.66rem', color: '#71717a' }}>
                                    Landed: {s.landingPage || '/'}
                                  </div>
                                </td>
                                <td>
                                  {s.affiliateRef ? (
                                    <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: '0.72rem', fontFamily: 'monospace' }}>
                                      @{s.affiliateRef}
                                    </span>
                                  ) : (
                                    <span style={{ color: '#a1a1aa', fontSize: '0.72rem' }}>
                                      {s.referrer || 'Direct'}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <span style={{ background: '#18181b', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', border: '1px solid #27272a' }}>
                                    {s.pageViews} view{s.pageViews > 1 ? 's' : ''}
                                  </span>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.70rem', color: '#a1a1aa' }}>
                                    {formatOrderDateTime(s.lastHeartbeat)}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

              </div>
            )}

            {/* 2. ORDERS SECTION */}
            {currentSection === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Search, Status & Date Filter Bar */}
                <div className="admin-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 300px' }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ width: '15px', height: '15px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search buyer name, phone, city, affiliate..."
                          className="admin-input-control"
                          style={{ paddingLeft: '36px' }}
                        />
                      </div>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="admin-input-control"
                        style={{ width: 'auto', padding: '10px 12px' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Completed">Completed</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={fetchOrders} className="admin-btn-secondary" title="Refresh Orders">
                        <RefreshCw className={ordersLoading ? 'animate-spin' : ''} style={{ width: '14px', height: '14px' }} />
                      </button>
                      <button onClick={handleExportCSV} className="admin-btn-secondary" title="Export Filtered Orders to CSV">
                        <Download style={{ width: '14px', height: '14px' }} />
                        <span>Export CSV</span>
                      </button>
                      <button onClick={() => setShowAddModal(true)} className="admin-btn-primary">
                        <Plus style={{ width: '14px', height: '14px' }} />
                        <span>New Order</span>
                      </button>
                    </div>
                  </div>

                  {/* Date Filter & Date Picker Row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', paddingTop: '12px', borderTop: '1px solid #1f1f23' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 800, textTransform: 'uppercase', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar style={{ width: '13px', height: '13px' }} /> Pick Date:
                      </span>
                      {[
                        { id: 'all', label: 'All Dates' },
                        { id: 'today', label: 'Today' },
                        { id: 'yesterday', label: 'Yesterday' },
                        { id: '7days', label: 'Last 7 Days' },
                        { id: '30days', label: 'Last 30 Days' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setDatePreset(p.id as any);
                            setSelectedDate('');
                          }}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            border: '1px solid',
                            cursor: 'pointer',
                            background: datePreset === p.id && !selectedDate ? '#ffffff' : '#09090b',
                            color: datePreset === p.id && !selectedDate ? '#000000' : '#a1a1aa',
                            borderColor: datePreset === p.id && !selectedDate ? '#ffffff' : '#27272a',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    {/* Specific Date Picker Input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.74rem', color: '#a1a1aa', fontWeight: 700 }}>Select Specific Day:</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setDatePreset('custom');
                        }}
                        className="admin-input-control"
                        style={{ padding: '6px 10px', fontSize: '0.76rem', width: 'auto', colorScheme: 'dark' }}
                      />
                      {(datePreset !== 'all' || selectedDate) && (
                        <button
                          onClick={() => {
                            setDatePreset('all');
                            setSelectedDate('');
                          }}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: '4px 6px' }}
                          title="Reset Date Filter"
                        >
                          ✕ Reset Date
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="admin-table-container">
                  <table className="admin-table-root">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Kit / Package</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Affiliate / Source</th>
                        <th>Date & Time</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                            <RefreshCw className="animate-spin" style={{ width: '20px', height: '20px', margin: '0 auto 8px' }} />
                            <span>Loading customer orders...</span>
                          </td>
                        </tr>
                      ) : paginatedOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: '#71717a' }}>
                            No orders found matching your search or date filter.
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((ord) => (
                          <tr key={ord.id}>
                            <td style={{ fontFamily: 'monospace', fontWeight: 800, color: '#ffffff' }}>#{ord.id}</td>
                            <td>
                              <div style={{ fontWeight: 800, color: '#ffffff' }}>{ord.customerName}</div>
                              <div style={{ fontSize: '0.70rem', color: '#71717a' }}>{ord.phone} • {ord.city}</div>
                            </td>
                            <td style={{ color: '#d4d4d8' }}>{ord.packageName}</td>
                            <td style={{ fontWeight: 900, color: '#ffffff' }}>₹{Number(ord.price).toLocaleString('en-IN')}</td>
                            <td>
                              <span className={
                                ord.status === 'Completed' ? 'admin-badge-completed' :
                                ord.status === 'Pending' ? 'admin-badge-pending' :
                                ord.status === 'Processing' ? 'admin-badge-processing' : 'admin-badge-cancelled'
                              }>
                                {ord.status}
                              </span>
                            </td>
                            <td>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: ord.affiliateRef ? '#1e293b' : '#18181b',
                                color: ord.affiliateRef ? '#38bdf8' : '#71717a',
                                border: ord.affiliateRef ? '1px solid #0284c7' : '1px solid #27272a'
                              }}>
                                {ord.affiliateRef ? `@${ord.affiliateRef}` : 'Direct'}
                              </span>
                            </td>
                            <td style={{ color: '#d4d4d8', fontSize: '0.74rem', whiteSpace: 'nowrap' }}>
                              {formatOrderDateTime(ord.createdAt)}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="admin-btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#71717a', padding: '4px 8px' }}>
                  <span>Showing <strong>{paginatedOrders.length}</strong> of <strong>{filteredOrders.length}</strong> orders</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => p - 1)}
                      className="admin-btn-secondary"
                      style={{ padding: '6px' }}
                    >
                      <ChevronLeft style={{ width: '14px', height: '14px' }} />
                    </button>
                    <span style={{ color: '#ffffff', fontWeight: 800 }}>{currentPage} / {totalPages}</span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(p => p + 1)}
                      className="admin-btn-secondary"
                      style={{ padding: '6px' }}
                    >
                      <ChevronRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 3. PAYMENT GATEWAY SECTION */}
            {currentSection === 'payment' && (
              <div className="admin-card" style={{ maxWidth: '640px' }}>
                <div className="admin-card-header">
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Razorpay Gateway Settings</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>Configure API keys for UPI, Cards, NetBanking payment processing.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Mode Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#09090b', borderRadius: '12px', border: '1px solid #27272a' }}>
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', display: 'block' }}>Operating Mode</span>
                      <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{settings.payment?.isLiveMode ? '● LIVE MODE ACTIVE' : '○ TEST SANDBOX MODE'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSettings({
                        ...settings,
                        payment: { ...settings.payment, isLiveMode: !settings.payment?.isLiveMode }
                      })}
                      className={settings.payment?.isLiveMode ? 'admin-btn-primary' : 'admin-btn-secondary'}
                      style={{ fontSize: '0.74rem' }}
                    >
                      {settings.payment?.isLiveMode ? 'Switch to Test Mode' : 'Switch to Live Mode'}
                    </button>
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Razorpay Key ID</label>
                    <input
                      type="text"
                      value={settings.payment?.razorpayKeyId || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        payment: { ...settings.payment, razorpayKeyId: e.target.value }
                      })}
                      placeholder="rzp_live_... or rzp_test_..."
                      className="admin-input-control"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Razorpay Key Secret</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showSecret ? "text" : "password"}
                        value={settings.payment?.razorpayKeySecret || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          payment: { ...settings.payment, razorpayKeySecret: e.target.value }
                        })}
                        placeholder="Paste Key Secret..."
                        className="admin-input-control"
                        style={{ fontFamily: 'monospace', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
                      >
                        {showSecret ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsLoading}
                    className="admin-btn-primary"
                    style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '8px' }}
                  >
                    {settingsLoading ? 'Saving...' : 'Save Payment Configuration'}
                  </button>

                </div>
              </div>
            )}

            {/* 4. WHATSAPP & SUPPORT SECTION */}
            {currentSection === 'whatsapp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* 1. AUTOMATED WHATSAPP ORDER NOTIFICATION BOT */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Automated WhatsApp Order Confirmation Bot</h3>
                        <span style={{ fontSize: '0.68rem', padding: '2px 8px', borderRadius: '6px', background: settings.whatsapp?.autoNotificationEnabled !== false ? '#052e16' : '#27272a', color: settings.whatsapp?.autoNotificationEnabled !== false ? '#4ade80' : '#a1a1aa', fontWeight: 800, border: '1px solid #15803d' }}>
                          {settings.whatsapp?.autoNotificationEnabled !== false ? '● Bot Active' : '○ Disabled'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>
                        Automatically dispatch a personalized congratulations & order confirmation message to the buyer's WhatsApp number immediately when online payment is completed.
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Bot Master Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#ffffff' }}>Auto-Send WhatsApp upon Payment</div>
                        <div style={{ fontSize: '0.70rem', color: '#71717a' }}>Dispatches message immediately when Razorpay verifies payment</div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={settings.whatsapp?.autoNotificationEnabled !== false}
                          onChange={(e) => setSettings({
                            ...settings,
                            whatsapp: { ...settings.whatsapp, autoNotificationEnabled: e.target.checked }
                          })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: settings.whatsapp?.autoNotificationEnabled !== false ? '#22c55e' : '#27272a',
                          borderRadius: '24px', transition: '0.2s',
                        }}>
                          <span style={{
                            position: 'absolute', content: '""', height: '18px', width: '18px', left: '3px', bottom: '3px',
                            backgroundColor: '#ffffff', borderRadius: '50%', transition: '0.2s',
                            transform: settings.whatsapp?.autoNotificationEnabled !== false ? 'translateX(20px)' : 'translateX(0)'
                          }} />
                        </span>
                      </label>
                    </div>

                    {/* Provider Selector */}
                    <div>
                      <label className="admin-label">WhatsApp Gateway Provider</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', marginTop: '6px' }}>
                        {[
                          { id: 'meta', title: 'Meta Cloud API (Official)', subtitle: 'Free 1,000 conversations/mo' },
                          { id: 'twilio', title: 'Twilio WhatsApp API', subtitle: 'Global carrier gateway' },
                          { id: 'custom_webhook', title: 'Custom Webhook / Aisensy', subtitle: 'Wati, Interakt, Fast2SMS' },
                        ].map((prov) => (
                          <button
                            key={prov.id}
                            type="button"
                            onClick={() => setSettings({
                              ...settings,
                              whatsapp: { ...settings.whatsapp, provider: prov.id }
                            })}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '10px',
                              textAlign: 'left',
                              cursor: 'pointer',
                              border: '1px solid',
                              background: (settings.whatsapp?.provider || 'meta') === prov.id ? '#ffffff' : '#09090b',
                              color: (settings.whatsapp?.provider || 'meta') === prov.id ? '#000000' : '#ffffff',
                              borderColor: (settings.whatsapp?.provider || 'meta') === prov.id ? '#ffffff' : '#27272a'
                            }}
                          >
                            <div style={{ fontWeight: 800, fontSize: '0.80rem' }}>{prov.title}</div>
                            <div style={{ fontSize: '0.68rem', color: (settings.whatsapp?.provider || 'meta') === prov.id ? '#3f3f46' : '#71717a' }}>{prov.subtitle}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Meta Cloud API Fields */}
                    {(settings.whatsapp?.provider || 'meta') === 'meta' && (
                      <div style={{ padding: '14px', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>Meta WhatsApp Business Cloud API Credentials</div>
                        
                        <div className="admin-input-group">
                          <label className="admin-label">Phone Number ID</label>
                          <input
                            type="text"
                            value={settings.whatsapp?.meta?.phoneNumberId || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                meta: { ...(settings.whatsapp?.meta || {}), phoneNumberId: e.target.value }
                              }
                            })}
                            placeholder="e.g. 104829104819201"
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">Permanent System Access Token</label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type={showWaToken ? "text" : "password"}
                              value={settings.whatsapp?.meta?.accessToken || ''}
                              onChange={(e) => setSettings({
                                ...settings,
                                whatsapp: {
                                  ...settings.whatsapp,
                                  meta: { ...(settings.whatsapp?.meta || {}), accessToken: e.target.value }
                                }
                              })}
                              placeholder="EAAG..."
                              className="admin-input-control"
                              style={{ fontFamily: 'monospace', paddingRight: '40px' }}
                            />
                            <button
                              type="button"
                              onClick={() => setShowWaToken(!showWaToken)}
                              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
                            >
                              {showWaToken ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                            </button>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.70rem', color: '#71717a', lineHeight: 1.4 }}>
                          💡 <em>Tip: Get these from your Meta Developer Portal (developers.facebook.com → WhatsApp → API Setup). The first 1,000 customer service conversations every month are 100% free!</em>
                        </p>
                      </div>
                    )}

                    {/* Twilio Fields */}
                    {settings.whatsapp?.provider === 'twilio' && (
                      <div style={{ padding: '14px', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>Twilio WhatsApp Gateway</div>
                        
                        <div className="admin-input-group">
                          <label className="admin-label">Account SID</label>
                          <input
                            type="text"
                            value={settings.whatsapp?.twilio?.accountSid || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                twilio: { ...(settings.whatsapp?.twilio || {}), accountSid: e.target.value }
                              }
                            })}
                            placeholder="AC..."
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">Auth Token</label>
                          <input
                            type="password"
                            value={settings.whatsapp?.twilio?.authToken || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                twilio: { ...(settings.whatsapp?.twilio || {}), authToken: e.target.value }
                              }
                            })}
                            placeholder="Auth Token..."
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">From WhatsApp Number</label>
                          <input
                            type="text"
                            value={settings.whatsapp?.twilio?.fromNumber || 'whatsapp:+14155238886'}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                twilio: { ...(settings.whatsapp?.twilio || {}), fromNumber: e.target.value }
                              }
                            })}
                            placeholder="whatsapp:+14155238886"
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Custom Webhook Fields */}
                    {settings.whatsapp?.provider === 'custom_webhook' && (
                      <div style={{ padding: '14px', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 800 }}>Custom Webhook / Aisensy / Wati Integration</div>
                        
                        <div className="admin-input-group">
                          <label className="admin-label">Webhook URL</label>
                          <input
                            type="text"
                            value={settings.whatsapp?.customWebhook?.url || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                customWebhook: { ...(settings.whatsapp?.customWebhook || {}), url: e.target.value }
                              }
                            })}
                            placeholder="https://backend.aisensy.com/campaign/t1/api/v2..."
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>

                        <div className="admin-input-group">
                          <label className="admin-label">API Bearer Key (Optional)</label>
                          <input
                            type="password"
                            value={settings.whatsapp?.customWebhook?.apiKey || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              whatsapp: {
                                ...settings.whatsapp,
                                customWebhook: { ...(settings.whatsapp?.customWebhook || {}), apiKey: e.target.value }
                              }
                            })}
                            placeholder="Bearer token..."
                            className="admin-input-control"
                            style={{ fontFamily: 'monospace' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Customizable Congratulations Message Template */}
                    <div className="admin-input-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label className="admin-label" style={{ margin: 0 }}>Congratulations Message Template</label>
                        <span style={{ fontSize: '0.70rem', color: '#71717a' }}>Supports dynamic placeholders</span>
                      </div>
                      
                      {/* Dynamic Variable Chips */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {[
                          { tag: '{customer_name}', label: 'Buyer Name' },
                          { tag: '{order_id}', label: 'Order ID' },
                          { tag: '{package_name}', label: 'Package' },
                          { tag: '{amount}', label: 'Amount Paid' },
                          { tag: '{support_number}', label: 'Support Phone' },
                        ].map((v) => (
                          <button
                            key={v.tag}
                            type="button"
                            onClick={() => {
                              const current = settings.whatsapp?.messageTemplate || '';
                              setSettings({
                                ...settings,
                                whatsapp: { ...settings.whatsapp, messageTemplate: `${current} ${v.tag}` }
                              });
                            }}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.68rem',
                              fontFamily: 'monospace',
                              background: '#18181b',
                              color: '#38bdf8',
                              border: '1px solid #27272a',
                              cursor: 'pointer'
                            }}
                          >
                            +{v.tag}
                          </button>
                        ))}
                      </div>

                      <textarea
                        rows={7}
                        value={settings.whatsapp?.messageTemplate || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          whatsapp: { ...settings.whatsapp, messageTemplate: e.target.value }
                        })}
                        className="admin-input-control"
                        style={{ fontFamily: 'monospace', fontSize: '0.76rem', lineHeight: 1.4, resize: 'vertical' }}
                      />
                    </div>

                    {/* Message Preview in WhatsApp Chat Bubble */}
                    <div>
                      <span className="admin-label">Live WhatsApp Chat Bubble Preview</span>
                      <div style={{ background: '#0b141a', padding: '16px', borderRadius: '12px', border: '1px solid #1f2c34', marginTop: '6px' }}>
                        <div style={{ maxWidth: '380px', background: '#005c4b', color: '#e9edef', padding: '12px 14px', borderRadius: '10px 10px 0px 10px', fontSize: '0.76rem', whiteSpace: 'pre-line', lineHeight: 1.4, boxShadow: '0 2px 4px rgba(0,0,0,0.3)', marginLeft: 'auto' }}>
                          {(settings.whatsapp?.messageTemplate || '')
                            .replace(/{customer_name}/g, 'Rahul Sharma')
                            .replace(/{order_id}/g, 'ORD-1082')
                            .replace(/{package_name}/g, 'Starter Saver Kit')
                            .replace(/{amount}/g, '1199')
                            .replace(/{support_number}/g, settings.whatsapp?.supportNumber || '919876543210')}
                          <div style={{ textAlign: 'right', fontSize: '0.62rem', color: '#8696a0', marginTop: '6px' }}>
                            Just now • ✓✓
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Test WhatsApp Message Widget */}
                    <div style={{ padding: '14px', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span className="admin-label" style={{ margin: 0 }}>🧪 Test WhatsApp Bot Dispatch</span>
                      <p style={{ fontSize: '0.70rem', color: '#71717a' }}>Send a live test order confirmation message to your own phone number:</p>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={testPhone}
                          onChange={(e) => setTestPhone(e.target.value)}
                          placeholder="e.g. 919876543210"
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                        <button
                          type="button"
                          onClick={handleSendTestWhatsApp}
                          disabled={testSending}
                          className="admin-btn-primary"
                          style={{ padding: '8px 16px', flexShrink: 0 }}
                        >
                          {testSending ? 'Sending...' : 'Send Test WhatsApp'}
                        </button>
                      </div>

                      {testResult && (
                        <div style={{ fontSize: '0.72rem', fontWeight: 800, padding: '8px 10px', borderRadius: '8px', background: testResult.startsWith('✓') ? '#052e16' : '#27272a', color: testResult.startsWith('✓') ? '#4ade80' : '#f87171', border: '1px solid #15803d' }}>
                          {testResult}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* 2. CUSTOMER SUPPORT & CHAT INQUIRY SETTINGS */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Storefront WhatsApp Customer Support Button</h3>
                      <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>Configure the floating customer WhatsApp button and initial inquiry greeting.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    <div className="admin-input-group">
                      <label className="admin-label">Support WhatsApp Number (with Country Code)</label>
                      <input
                        type="text"
                        value={settings.whatsapp?.supportNumber || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          whatsapp: { ...settings.whatsapp, supportNumber: e.target.value }
                        })}
                        placeholder="e.g. 919876543210"
                        className="admin-input-control"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">Default Pre-filled Inquiry Message</label>
                      <textarea
                        rows={3}
                        value={settings.whatsapp?.defaultMessage || ''}
                        onChange={(e) => setSettings({
                          ...settings,
                          whatsapp: { ...settings.whatsapp, defaultMessage: e.target.value }
                        })}
                        className="admin-input-control"
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <button
                      onClick={handleSaveSettings}
                      disabled={settingsLoading}
                      className="admin-btn-primary"
                      style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                    >
                      {settingsLoading ? 'Saving...' : 'Save WhatsApp & Bot Settings'}
                    </button>

                  </div>
                </div>

              </div>
            )}

            {/* 5. AFFILIATE & CREATOR REFERRAL MARKETING */}
            {currentSection === 'affiliates' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {/* 1-Click Link Generator */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>1-Click Creator Referral Link Generator</h3>
                        <p style={{ fontSize: '0.72rem', color: '#71717a' }}>Create website referral links for Instagram / YouTube influencers and partners</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="admin-input-group">
                        <label className="admin-label">Influencer / Creator Handle</label>
                        <input
                          type="text"
                          value={creatorTag}
                          onChange={(e) => setCreatorTag(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                          placeholder="e.g. pooja_mom, rahul_parenting"
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>

                      {/* Quick Tag Suggestions */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.70rem', color: '#71717a' }}>Quick Tags:</span>
                        {['pooja_mom', 'rahul_kids', 'insta_reels', 'youtube_review', 'mom_blogger'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setCreatorTag(tag)}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.70rem',
                              fontFamily: 'monospace',
                              background: creatorTag === tag ? '#ffffff' : '#09090b',
                              color: creatorTag === tag ? '#000000' : '#a1a1aa',
                              border: '1px solid #27272a',
                              cursor: 'pointer'
                            }}
                          >
                            @{tag}
                          </button>
                        ))}
                      </div>

                      <div style={{ padding: '14px', background: '#09090b', borderRadius: '12px', border: '1px solid #27272a' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <span className="admin-label" style={{ margin: 0 }}>Website Storefront Tracking Link</span>
                          <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>✓ Opens Homepage & Tracks Sale</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <code style={{ fontSize: '0.75rem', color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{generatedAffiliateUrl}</code>
                          <button
                            onClick={() => handleCopyAffiliate(generatedAffiliateUrl)}
                            className="admin-btn-primary"
                            style={{ padding: '6px 12px', fontSize: '0.72rem', flexShrink: 0 }}
                          >
                            {copiedLink ? <Check style={{ width: '13px', height: '13px' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                            <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                          </button>
                        </div>
                        <p style={{ fontSize: '0.70rem', color: '#71717a', marginTop: '8px', lineHeight: 1.4 }}>
                          When a visitor opens this link, explores the storefront, and taps <strong>"Buy Now"</strong> or <strong>"Secure the Future Now"</strong> to complete payment, the verified sale is credited automatically.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Affiliate Sales by Creator Summary */}
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <div>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Creator Sales Performance</h3>
                        <p style={{ fontSize: '0.72rem', color: '#71717a' }}>Real-time orders generated per affiliate referral tag</p>
                      </div>
                    </div>

                    {affiliateStats.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '36px 16px', color: '#71717a', fontSize: '0.80rem' }}>
                        <Share2 style={{ width: '28px', height: '28px', margin: '0 auto 8px', color: '#3f3f46' }} />
                        <p>No affiliate sales captured yet.</p>
                        <span style={{ fontSize: '0.72rem', color: '#52525b' }}>Share creator links above to track sales automatically.</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {affiliateStats.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: '#09090b',
                              borderRadius: '12px',
                              border: '1px solid #27272a',
                              padding: '12px 14px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}
                          >
                            {/* Header row */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1f1f23', paddingBottom: '8px' }}>
                              <div>
                                <div style={{ fontWeight: 900, fontSize: '0.90rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                                  @{item.tag}
                                </div>
                                <div style={{ fontSize: '0.70rem', color: '#a1a1aa', marginTop: '2px' }}>
                                  {item.count} total order{item.count > 1 ? 's' : ''} • {item.completedCount} verified online payments
                                </div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#ffffff' }}>
                                  ₹{item.revenue.toLocaleString('en-IN')}
                                </div>
                                <div style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800 }}>
                                  Est. Commission (15%): ₹{Math.round(item.revenue * 0.15).toLocaleString('en-IN')}
                                </div>
                              </div>
                            </div>

                            {/* Detailed buyer orders under this affiliate */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ fontSize: '0.68rem', color: '#71717a', fontWeight: 800, textTransform: 'uppercase' }}>
                                Buyers from @{item.tag}:
                              </span>
                              {item.orders.map((ord) => (
                                <div
                                  key={ord.id}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: '#121215',
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    border: '1px solid #1e1e22',
                                    fontSize: '0.74rem'
                                  }}
                                >
                                  <div>
                                    <div style={{ fontWeight: 800, color: '#ffffff' }}>
                                      {ord.customerName} <span style={{ color: '#71717a', fontWeight: 500 }}>({ord.city || 'Online'})</span>
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: '#71717a' }}>
                                      #{ord.id} • {ord.packageName}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 800, color: '#ffffff' }}>
                                      ₹{Number(ord.price).toLocaleString('en-IN')}
                                    </div>
                                    <span className="admin-badge-completed" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                                      ✓ Paid Online
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 6. PRICES & PROMO BANNER */}
            {currentSection === 'pricing' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Announcement Bar */}
                <div className="admin-card">
                  <div className="admin-card-header">
                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 900 }}>Top Marquee Banner</h3>
                      <p style={{ fontSize: '0.72rem', color: '#71717a' }}>Announcement banner text displayed on storefront</p>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={settings.general?.announcementText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      general: { ...settings.general, announcementText: e.target.value }
                    })}
                    className="admin-input-control"
                  />
                </div>

                {/* Pricing Bundles Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  
                  {/* Starter Saver */}
                  <div className="admin-card">
                    <span className="admin-label" style={{ marginBottom: '4px', display: 'block' }}>Package 1</span>
                    <h4 style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: '12px' }}>Starter Saver Kit</h4>

                    <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.solo?.price || 1199}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, solo: { ...settings.pricing?.solo, price: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                        style={{ fontWeight: 900, fontSize: '1.1rem' }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">MRP Strike Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.solo?.originalPrice || 1999}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, solo: { ...settings.pricing?.solo, originalPrice: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                      />
                    </div>
                  </div>

                  {/* Little Achiever */}
                  <div className="admin-card">
                    <span className="admin-label" style={{ marginBottom: '4px', display: 'block' }}>Package 2 (Popular)</span>
                    <h4 style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: '12px' }}>Little Achiever Kit</h4>

                    <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.starter?.price || 1499}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, starter: { ...settings.pricing?.starter, price: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                        style={{ fontWeight: 900, fontSize: '1.1rem' }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">MRP Strike Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.starter?.originalPrice || 3999}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, starter: { ...settings.pricing?.starter, originalPrice: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                      />
                    </div>
                  </div>

                  {/* Family Bundle */}
                  <div className="admin-card">
                    <span className="admin-label" style={{ marginBottom: '4px', display: 'block' }}>Package 3 (VIP)</span>
                    <h4 style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: '12px' }}>Family Champions</h4>

                    <div className="admin-input-group" style={{ marginBottom: '10px' }}>
                      <label className="admin-label">Selling Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.family?.price || 2999}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, family: { ...settings.pricing?.family, price: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                        style={{ fontWeight: 900, fontSize: '1.1rem' }}
                      />
                    </div>

                    <div className="admin-input-group">
                      <label className="admin-label">MRP Strike Price (₹)</label>
                      <input
                        type="number"
                        value={settings.pricing?.family?.originalPrice || 5999}
                        onChange={(e) => setSettings({
                          ...settings,
                          pricing: { ...settings.pricing, family: { ...settings.pricing?.family, originalPrice: Number(e.target.value) } }
                        })}
                        className="admin-input-control"
                      />
                    </div>
                  </div>

                </div>

                <button
                  onClick={handleSaveSettings}
                  disabled={settingsLoading}
                  className="admin-btn-primary"
                  style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                >
                  {settingsLoading ? 'Saving...' : 'Publish Live Prices'}
                </button>

              </div>
            )}

            {/* 7. CUSTOM CSS & THEME STYLING (STORED IN DATABASE) */}
            {currentSection === 'theme' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Header Banner */}
                <div className="admin-card">
                  <div className="admin-card-header" style={{ marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Palette style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                        <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Custom CSS & Theme Styles</h3>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>
                        All colors and CSS rules are stored persistently in your SQLite database (<code>settings</code> table) and applied site-wide in real time.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={settingsLoading}
                      className="admin-btn-primary"
                      style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                    >
                      {settingsLoading ? 'Saving...' : '💾 Save CSS to DB'}
                    </button>
                  </div>

                  {/* 1-Click Theme Presets */}
                  <div style={{ background: '#09090b', padding: '12px 14px', borderRadius: '12px', border: '1px solid #27272a', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                      ⚡ 1-Click Theme Presets:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            primaryColor: '#0d9488',
                            accentColor: '#f59e0b',
                            bannerBg: '#000000',
                            bannerTextColor: '#ffffff',
                            buttonBg: '#000000',
                            buttonTextColor: '#ffffff',
                            borderRadius: '16px'
                          }
                        })}
                        style={{ background: '#18181b', color: '#2dd4bf', border: '1px solid #27272a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0d9488' }}></span>
                        Teal & Gold (Default)
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            primaryColor: '#059669',
                            accentColor: '#fbbf24',
                            bannerBg: '#064e3b',
                            bannerTextColor: '#ffffff',
                            buttonBg: '#059669',
                            buttonTextColor: '#ffffff',
                            borderRadius: '16px'
                          }
                        })}
                        style={{ background: '#18181b', color: '#34d399', border: '1px solid #27272a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#059669' }}></span>
                        Royal Emerald
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            primaryColor: '#0284c7',
                            accentColor: '#38bdf8',
                            bannerBg: '#0f172a',
                            bannerTextColor: '#38bdf8',
                            buttonBg: '#0284c7',
                            buttonTextColor: '#ffffff',
                            borderRadius: '14px'
                          }
                        })}
                        style={{ background: '#18181b', color: '#38bdf8', border: '1px solid #27272a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }}></span>
                        Sapphire Cyber
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettings({
                          ...settings,
                          theme: {
                            ...settings.theme,
                            primaryColor: '#000000',
                            accentColor: '#52525b',
                            bannerBg: '#000000',
                            bannerTextColor: '#ffffff',
                            buttonBg: '#000000',
                            buttonTextColor: '#ffffff',
                            borderRadius: '12px'
                          }
                        })}
                        style={{ background: '#18181b', color: '#e4e4e7', border: '1px solid #27272a', padding: '6px 12px', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#000000', border: '1px solid #52525b' }}></span>
                        Luxury Monochrome
                      </button>
                    </div>
                  </div>

                  {/* Visual Color Controls Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                    
                    {/* Primary Color */}
                    <div className="admin-input-group">
                      <label className="admin-label">Primary Brand Color</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={settings.theme?.primaryColor || '#0d9488'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, primaryColor: e.target.value }
                          })}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #27272a', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={settings.theme?.primaryColor || '#0d9488'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, primaryColor: e.target.value }
                          })}
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                    {/* Accent Color */}
                    <div className="admin-input-group">
                      <label className="admin-label">Accent / Highlight Color</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={settings.theme?.accentColor || '#f59e0b'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, accentColor: e.target.value }
                          })}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #27272a', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={settings.theme?.accentColor || '#f59e0b'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, accentColor: e.target.value }
                          })}
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                    {/* Announcement Banner BG */}
                    <div className="admin-input-group">
                      <label className="admin-label">Announcement Banner BG</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={settings.theme?.bannerBg || '#000000'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, bannerBg: e.target.value }
                          })}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #27272a', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={settings.theme?.bannerBg || '#000000'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, bannerBg: e.target.value }
                          })}
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                    {/* Pay Button BG */}
                    <div className="admin-input-group">
                      <label className="admin-label">Main Pay Button Color</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                          type="color"
                          value={settings.theme?.buttonBg || '#000000'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, buttonBg: e.target.value }
                          })}
                          style={{ width: '38px', height: '38px', borderRadius: '8px', border: '1px solid #27272a', background: 'transparent', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={settings.theme?.buttonBg || '#000000'}
                          onChange={(e) => setSettings({
                            ...settings,
                            theme: { ...settings.theme, buttonBg: e.target.value }
                          })}
                          className="admin-input-control"
                          style={{ fontFamily: 'monospace' }}
                        />
                      </div>
                    </div>

                  </div>

                  {/* Custom CSS Code Editor Section */}
                  <div style={{ borderTop: '1px solid #27272a', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Code style={{ width: '16px', height: '16px', color: '#a1a1aa' }} />
                        <label className="admin-label" style={{ margin: 0 }}>Custom CSS Code (Stored in DB)</label>
                      </div>
                      <span style={{ fontSize: '0.70rem', color: '#71717a' }}>
                        Write any valid CSS rules to customize buttons, cards, or text
                      </span>
                    </div>

                    {/* Quick Snippet Inserts */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n/* Custom Glowing Pay Button */\n.checkout-submit-btn {\n  box-shadow: 0 10px 25px rgba(13, 148, 136, 0.4) !important;\n  border-radius: 14px !important;\n}\n`;
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, customCss: (settings.theme?.customCss || '') + snippet }
                          });
                        }}
                        style={{ background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa', borderRadius: '6px', padding: '3px 8px', fontSize: '0.68rem', cursor: 'pointer' }}
                      >
                        + Glowing Pay Button
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n/* Glassmorphism Checkout Card */\n.checkout-form-card {\n  backdrop-filter: blur(12px) !important;\n  border: 2px solid #000000 !important;\n  box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;\n}\n`;
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, customCss: (settings.theme?.customCss || '') + snippet }
                          });
                        }}
                        style={{ background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa', borderRadius: '6px', padding: '3px 8px', fontSize: '0.68rem', cursor: 'pointer' }}
                      >
                        + Glassmorphism Card
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const snippet = `\n/* Smooth Rounded Corners */\n.delivering-item-card, .checkout-form-card, .package-item-card {\n  border-radius: 20px !important;\n}\n`;
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, customCss: (settings.theme?.customCss || '') + snippet }
                          });
                        }}
                        style={{ background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa', borderRadius: '6px', padding: '3px 8px', fontSize: '0.68rem', cursor: 'pointer' }}
                      >
                        + Extra Rounded Corners
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSettings({
                            ...settings,
                            theme: { ...settings.theme, customCss: '' }
                          });
                        }}
                        style={{ background: '#18181b', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '3px 8px', fontSize: '0.68rem', cursor: 'pointer', marginLeft: 'auto' }}
                      >
                        Clear CSS
                      </button>
                    </div>

                    <textarea
                      rows={10}
                      value={settings.theme?.customCss || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        theme: { ...settings.theme, customCss: e.target.value }
                      })}
                      placeholder="/* Write your custom CSS here. It will be stored in SQLite database and applied live across the entire website */"
                      className="admin-input-control"
                      style={{
                        fontFamily: 'Consolas, Monaco, monospace',
                        fontSize: '0.80rem',
                        lineHeight: 1.5,
                        background: '#09090b',
                        color: '#38bdf8',
                        border: '1px solid #27272a',
                        padding: '12px',
                        whiteSpace: 'pre',
                        tabSize: 2
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsLoading}
                    className="admin-btn-primary"
                    style={{ width: '100%', padding: '14px', justifyContent: 'center', marginTop: '16px' }}
                  >
                    {settingsLoading ? 'Saving to Database...' : '💾 Save & Apply CSS to Database'}
                  </button>

                </div>

              </div>
            )}

            {/* 8. STORE CONTENT & INFO */}
            {currentSection === 'content' && (
              <div className="admin-card" style={{ maxWidth: '640px' }}>
                <div className="admin-card-header">
                  <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Store Information</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="admin-input-group">
                    <label className="admin-label">Store Brand Name</label>
                    <input
                      type="text"
                      value={settings.general?.siteName || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, siteName: e.target.value }
                      })}
                      className="admin-input-control"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label className="admin-label">Customer Support Email</label>
                    <input
                      type="email"
                      value={settings.general?.supportEmail || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        general: { ...settings.general, supportEmail: e.target.value }
                      })}
                      className="admin-input-control"
                    />
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsLoading}
                    className="admin-btn-primary"
                    style={{ width: '100%', padding: '14px', justifyContent: 'center' }}
                  >
                    {settingsLoading ? 'Saving...' : 'Save Metadata'}
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* ORDER DETAILS MODAL */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="admin-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="admin-modal-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #27272a', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Order #{selectedOrder.id}</h3>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.80rem' }}>
                <div style={{ background: '#09090b', padding: '12px', borderRadius: '10px', border: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a' }}>Customer:</span>
                    <strong style={{ color: '#ffffff' }}>{selectedOrder.customerName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a' }}>Phone:</span>
                    <span style={{ fontFamily: 'monospace' }}>{selectedOrder.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a' }}>City / Location:</span>
                    <span>{selectedOrder.city} {selectedOrder.state ? `(${selectedOrder.state})` : ''}</span>
                  </div>
                  {selectedOrder.address && (
                    <div style={{ borderTop: '1px solid #1f1f23', paddingTop: '6px', color: '#a1a1aa' }}>
                      <strong>Address:</strong> {selectedOrder.address}
                    </div>
                  )}
                </div>

                <div style={{ background: '#09090b', padding: '12px', borderRadius: '10px', border: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a' }}>Package:</span>
                    <strong>{selectedOrder.packageName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#71717a' }}>Amount Paid:</span>
                    <strong style={{ fontSize: '0.95rem' }}>₹{Number(selectedOrder.price).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f1f23', paddingTop: '6px' }}>
                    <span style={{ color: '#71717a', fontWeight: 800 }}>Delivery Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                      className="admin-input-control"
                      style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem' }}
                    >
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE MANUAL ORDER MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="admin-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="admin-modal-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #27272a', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 900 }}>Record Manual Order</h3>
                <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  required
                  placeholder="Customer Full Name"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  className="admin-input-control"
                />
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={newOrder.phone}
                  onChange={(e) => setNewOrder({ ...newOrder, phone: e.target.value })}
                  className="admin-input-control"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={newOrder.city}
                  onChange={(e) => setNewOrder({ ...newOrder, city: e.target.value })}
                  className="admin-input-control"
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <select
                    value={newOrder.packageName}
                    onChange={(e) => setNewOrder({ ...newOrder, packageName: e.target.value })}
                    className="admin-input-control"
                  >
                    <option value="Starter Saver Kit">Starter Saver (₹1,199)</option>
                    <option value="Little Achiever Kit">Little Achiever (₹1,499)</option>
                    <option value="Family Champions Bundle">Family Champions (₹2,999)</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={newOrder.price}
                    onChange={(e) => setNewOrder({ ...newOrder, price: Number(e.target.value) })}
                    className="admin-input-control"
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Affiliate Ref (e.g. pooja_mom)"
                    value={newOrder.affiliateRef}
                    onChange={(e) => setNewOrder({ ...newOrder, affiliateRef: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                    className="admin-input-control"
                    style={{ fontFamily: 'monospace' }}
                  />
                  <select
                    value={newOrder.paymentMethod}
                    onChange={(e) => setNewOrder({ ...newOrder, paymentMethod: e.target.value })}
                    className="admin-input-control"
                  >
                    <option value="Online Payment (Razorpay UPI)">Online Payment (Razorpay UPI)</option>
                    <option value="Online Payment (Card / NetBanking)">Online Payment (Cards / NetBanking)</option>
                    <option value="Direct UPI Transfer">Direct UPI Transfer</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="admin-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '6px', padding: '12px' }}
                >
                  Save Order
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
