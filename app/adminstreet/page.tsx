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
  Smartphone,
  Boxes,
  Truck,
  ArrowDownCircle,
  ArrowUpCircle,
  PackageCheck,
  Archive
} from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  flatNo?: string;
  address?: string;
  landmark?: string;
  city: string;
  district?: string;
  state?: string;
  pincode?: string;
  packageName: string;
  price: number;
  currency: string;
  status: 'Completed' | 'Pending' | 'Processing' | 'Cancelled';
  paymentMethod: string;
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt?: string;
  notes: string;
  affiliateRef?: string;
}

interface InventoryItemType {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unitCost: number;
  totalIn?: number;
  totalOut?: number;
  createdAt: string;
  updatedAt: string;
}

interface InventoryLogType {
  id: number;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
  notes?: string;
  createdAt: string;
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

type NavSection = 'overview' | 'traffic' | 'orders' | 'inventory' | 'database' | 'affiliates' | 'content';

export default function AdminPage() {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  // Database Security State
  const [isDbUnlocked, setIsDbUnlocked] = useState<boolean>(false);
  const [dbPinInput, setDbPinInput] = useState<string>('');
  const [dbPinError, setDbPinError] = useState<string>('');

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Inventory & Stock Tracking State (Product In & Out)
  const [inventoryItems, setInventoryItems] = useState<InventoryItemType[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLogType[]>([]);
  const [inventorySummary, setInventorySummary] = useState<{
    totalCurrentStock: number;
    totalProductsIn: number;
    totalProductsOut: number;
    lowStockCount: number;
    itemCount: number;
  }>({
    totalCurrentStock: 0,
    totalProductsIn: 0,
    totalProductsOut: 0,
    lowStockCount: 0,
    itemCount: 0
  });
  const [inventoryLoading, setInventoryLoading] = useState<boolean>(false);
  const [inventoryTab, setInventoryTab] = useState<'products' | 'ledger'>('products');
  const [inventoryViewMode, setInventoryViewMode] = useState<'table' | 'cards'>('table');
  const [stockLogFilter, setStockLogFilter] = useState<'ALL' | 'IN' | 'OUT'>('ALL');
  const [stockLogSearch, setStockLogSearch] = useState<string>('');
  const [stockLogItemFilter, setStockLogItemFilter] = useState<string>('ALL');

  // Stock Modals State
  const [showStockInModal, setShowStockInModal] = useState<boolean>(false);
  const [showStockOutModal, setShowStockOutModal] = useState<boolean>(false);
  const [showAddItemModal, setShowAddItemModal] = useState<boolean>(false);
  const [selectedStockItem, setSelectedStockItem] = useState<InventoryItemType | null>(null);

  // Stock Form States
  const [stockActionForm, setStockActionForm] = useState({
    itemId: '',
    quantity: 10,
    reason: 'Supplier Restock Delivery',
    referenceId: '',
    performedBy: 'Admin',
    notes: ''
  });

  const [newItemForm, setNewItemForm] = useState({
    name: '',
    sku: '',
    category: 'Smart Money Kit',
    currentStock: 50,
    minThreshold: 15,
    unitCost: 499
  });

  // Visitor Traffic & Duration Analytics State
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState<boolean>(false);
  const [analyticsPreset, setAnalyticsPreset] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [analyticsCustomDate, setAnalyticsCustomDate] = useState<string>('');
  const [autoRefreshTraffic, setAutoRefreshTraffic] = useState<boolean>(true);
  const [trafficSearchTerm, setTrafficSearchTerm] = useState<string>('');
  const [affiliateSearchTerm, setAffiliateSearchTerm] = useState<string>('');

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
      siteName: "KidsGenLab",
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
      supportNumber: "918300297197",
      defaultMessage: "Hi KidsGenLab! I am interested in ordering the Smart Money kit for my child. Please help!",
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
      messageTemplate: `🎉 *Congratulations {customer_name}!* 🚀\n\nYour order for *{package_name}* (*#{order_id}*) is *CONFIRMED & PAID*!\n\n💰 *Amount Paid:* ₹{amount}\n📦 *Status:* Being packed for priority shipping\n🚚 *Delivery:* 3–5 business days across India\n\nNeed any assistance? Reply to this message or contact support at +{support_number}.\n\nThank you for choosing *KidsGenLab* to empower your child's financial intelligence! 🌟`
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
      fetchInventory();
    } else {
      setPinError('Incorrect Security PIN. Access Denied.');
    }
  };

  const fetchInventory = async () => {
    setInventoryLoading(true);
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setInventoryItems(data.items || []);
        setInventoryLogs(data.logs || []);
        if (data.summary) {
          setInventorySummary(data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  };

  const handleRecordStockAction = async (type: 'IN' | 'OUT') => {
    if (!stockActionForm.itemId) {
      alert('Please select a product');
      return;
    }
    if (stockActionForm.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log',
          itemId: stockActionForm.itemId,
          type,
          quantity: Number(stockActionForm.quantity),
          reason: stockActionForm.reason,
          referenceId: stockActionForm.referenceId,
          performedBy: stockActionForm.performedBy || 'Admin',
          notes: stockActionForm.notes
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchInventory();
        setShowStockInModal(false);
        setShowStockOutModal(false);
        setStockActionForm({
          itemId: '',
          quantity: 10,
          reason: 'Supplier Restock Delivery',
          referenceId: '',
          performedBy: 'Admin',
          notes: ''
        });
      } else {
        alert(data.message || 'Failed to update stock');
      }
    } catch (err) {
      console.error('Stock action error:', err);
      alert('Network error while recording stock movement.');
    }
  };

  const handleSaveNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemForm.name.trim()) {
      alert('Product name is required');
      return;
    }

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'item',
          name: newItemForm.name.trim(),
          sku: newItemForm.sku.trim(),
          category: newItemForm.category.trim(),
          currentStock: Number(newItemForm.currentStock),
          minThreshold: Number(newItemForm.minThreshold),
          unitCost: Number(newItemForm.unitCost)
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchInventory();
        setShowAddItemModal(false);
        setNewItemForm({
          name: '',
          sku: '',
          category: 'Smart Money Kit',
          currentStock: 50,
          minThreshold: 15,
          unitCost: 499
        });
      } else {
        alert(data.message || 'Failed to save product');
      }
    } catch (err) {
      console.error('Save item error:', err);
      alert('Network error while saving product.');
    }
  };

  const handleDeleteInventoryItem = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove '${name}' and its stock tracking logs?`)) return;
    try {
      const res = await fetch(`/api/inventory?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchInventory();
      } else {
        alert(data.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('Delete item error:', err);
    }
  };

  const handleExportInventoryCSV = () => {
    if (inventoryLogs.length === 0) {
      alert('No inventory stock movement records found to export.');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Product Name', 'Item ID', 'Movement Type', 'Quantity', 'Reason / Event', 'Reference ID', 'Recorded By', 'Notes'];
    const rows = inventoryLogs.map(l => [
      l.id,
      `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      `"${(l.itemName || '').replace(/"/g, '""')}"`,
      `"${l.itemId}"`,
      l.type === 'IN' ? 'STOCK_IN (Received)' : 'STOCK_OUT (Dispatched)',
      l.quantity,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${(l.referenceId || '').replace(/"/g, '""')}"`,
      `"${(l.performedBy || 'Admin').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kidzmoney_inventory_in_out_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchAnalytics = async (preset = analyticsPreset, customDateStr = analyticsCustomDate) => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?preset=${preset}&date=${customDateStr}`);
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
    fetchAnalytics(analyticsPreset, analyticsCustomDate);
    fetchInventory();

    if (!autoRefreshTraffic) return;
    const interval = setInterval(() => {
      fetchAnalytics(analyticsPreset, analyticsCustomDate);
    }, 8000);
    return () => clearInterval(interval);
  }, [isAuthenticated, analyticsPreset, autoRefreshTraffic, analyticsCustomDate]);

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

          <h1 className="admin-pin-title">KidsGenLab Admin</h1>
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
    { id: 'traffic', label: 'Visitor Traffic & Duration', icon: Users, desc: 'Live visitors, time spent on website & traffic sources' },
    { id: 'orders', label: 'Orders & Deliveries', icon: Package, desc: 'Search buyers, status & CSV export' },
    { id: 'inventory', label: 'Stock Tracking (In / Out)', icon: Boxes, desc: 'Incoming restocks, outgoing shipments & stock ledger' },
    { id: 'database', label: 'Database & Records', icon: Layers, desc: 'Secure database tables' },
    { id: 'affiliates', label: 'Creator & Referral Links', icon: Share2, desc: '1-Click creator referral links' },
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
                <h2 style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff', lineHeight: 1.2 }}>KidsGenLab</h2>
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

                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('inventory')}>
                    <Boxes style={{ width: '24px', height: '24px', marginBottom: '10px', color: '#10b981' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Stock & Order Tracking (In / Out)</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>
                      {inventorySummary.totalCurrentStock} units on hand. Track {inventorySummary.totalProductsIn} incoming restocks & {inventorySummary.totalProductsOut} outgoing dispatches.
                    </p>
                  </div>

                  <div className="admin-card" style={{ cursor: 'pointer' }} onClick={() => setCurrentSection('affiliates')}>
                    <Share2 style={{ width: '24px', height: '24px', marginBottom: '10px' }} />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '4px' }}>Creator Referral Links</h3>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', lineHeight: 1.4 }}>Generate 1-click trackable campaign URLs for Instagram and YouTube influencer partners.</p>
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
                          { id: 'custom', label: 'Custom Date' },
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

                        <input
                          type="date"
                          value={analyticsCustomDate}
                          onChange={(e) => {
                            setAnalyticsCustomDate(e.target.value);
                            if (e.target.value) setAnalyticsPreset('custom');
                          }}
                          className="admin-input"
                          style={{ padding: '6px 12px', width: '140px', fontSize: '0.72rem' }}
                          title="Filter by specific date"
                        />

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
                      <div className="admin-table-container">
                        <table className="admin-table-root">
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

            {/* 3. INVENTORY & STOCK TRACKING (IN & OUT) */}
            {currentSection === 'inventory' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Top Control Header */}
                <div className="admin-card" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    
                    {/* Title & Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: '#10b98118', border: '1px solid #10b98140', padding: '10px', borderRadius: '12px', color: '#10b981', display: 'flex' }}>
                        <Boxes style={{ width: '24px', height: '24px' }} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
                            Stock & Inventory Control
                          </h2>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '20px', background: '#18181b', border: '1px solid #27272a', color: '#a1a1aa' }}>
                            {inventorySummary.itemCount} Kit Packages
                          </span>
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '3px', marginBottom: 0 }}>
                          Track product inflow (factory restocks) and outflow (customer order fulfillment).
                        </p>
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={fetchInventory}
                        className="admin-btn-secondary"
                        title="Refresh Stock Data"
                        style={{ padding: '9px 12px' }}
                      >
                        <RefreshCw className={inventoryLoading ? 'animate-spin' : ''} style={{ width: '15px', height: '15px' }} />
                      </button>

                      <button
                        onClick={() => {
                          const firstId = inventoryItems[0]?.id || '';
                          setStockActionForm({
                            itemId: firstId,
                            quantity: 25,
                            reason: 'Factory Restock Delivery',
                            referenceId: `PO-${Date.now().toString().slice(-4)}`,
                            performedBy: 'Admin',
                            notes: 'Incoming stock shipment received'
                          });
                          setShowStockInModal(true);
                        }}
                        className="admin-btn-primary"
                        style={{ background: '#10b981', borderColor: '#10b981', color: '#000000', fontWeight: 900, padding: '9px 16px' }}
                      >
                        <ArrowDownCircle style={{ width: '16px', height: '16px' }} />
                        <span>+ Receive Stock (IN)</span>
                      </button>

                      <button
                        onClick={() => {
                          const firstId = inventoryItems[0]?.id || '';
                          setStockActionForm({
                            itemId: firstId,
                            quantity: 1,
                            reason: 'Customer Order Dispatched',
                            referenceId: `DISP-${Date.now().toString().slice(-4)}`,
                            performedBy: 'Admin',
                            notes: 'Courier package dispatched'
                          });
                          setShowStockOutModal(true);
                        }}
                        className="admin-btn-secondary"
                        style={{ borderColor: '#f59e0b60', color: '#f59e0b', fontWeight: 800, padding: '9px 16px' }}
                      >
                        <ArrowUpCircle style={{ width: '16px', height: '16px' }} />
                        <span>- Dispatch Stock (OUT)</span>
                      </button>

                      <button
                        onClick={() => setShowAddItemModal(true)}
                        className="admin-btn-secondary"
                        style={{ padding: '9px 14px' }}
                      >
                        <Plus style={{ width: '15px', height: '15px' }} />
                        <span>New Product</span>
                      </button>

                      <button
                        onClick={handleExportInventoryCSV}
                        className="admin-btn-secondary"
                        title="Download CSV Ledger"
                        style={{ padding: '9px 12px' }}
                      >
                        <Download style={{ width: '15px', height: '15px' }} />
                      </button>
                    </div>

                  </div>

                  {/* Section View Tabs */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1f1f23', marginTop: '18px', paddingTop: '14px', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', background: '#09090b', padding: '4px', borderRadius: '10px', border: '1px solid #27272a' }}>
                      <button
                        onClick={() => setInventoryTab('products')}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: inventoryTab === 'products' ? '#ffffff' : 'transparent',
                          color: inventoryTab === 'products' ? '#000000' : '#a1a1aa',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Package style={{ width: '14px', height: '14px' }} />
                        <span>Products & Live Stock ({inventoryItems.length})</span>
                      </button>

                      <button
                        onClick={() => setInventoryTab('ledger')}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: inventoryTab === 'ledger' ? '#ffffff' : 'transparent',
                          color: inventoryTab === 'ledger' ? '#000000' : '#a1a1aa',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Activity style={{ width: '14px', height: '14px' }} />
                        <span>In / Out Activity Ledger ({inventoryLogs.length})</span>
                      </button>
                    </div>

                    {inventoryTab === 'products' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#71717a' }}>
                        <span>Layout:</span>
                        <div style={{ display: 'flex', background: '#09090b', borderRadius: '8px', border: '1px solid #27272a', padding: '2px' }}>
                          <button
                            onClick={() => setInventoryViewMode('table')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.70rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: inventoryViewMode === 'table' ? '#27272a' : 'transparent',
                              color: inventoryViewMode === 'table' ? '#ffffff' : '#71717a'
                            }}
                          >
                            Table View
                          </button>
                          <button
                            onClick={() => setInventoryViewMode('cards')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.70rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: inventoryViewMode === 'cards' ? '#27272a' : 'transparent',
                              color: inventoryViewMode === 'cards' ? '#ffffff' : '#71717a'
                            }}
                          >
                            Card View
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* KPI Metrics Summary Strip */}
                <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
                  
                  {/* On-Hand Inventory */}
                  <div className="admin-stat-card" style={{ borderColor: '#27272a', background: 'linear-gradient(180deg, #18181b 0%, #0d0d0d 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Units In Stock</span>
                      <PackageCheck style={{ width: '18px', height: '18px', color: '#38bdf8' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#ffffff' }}>
                      {inventorySummary.totalCurrentStock}
                      <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#a1a1aa', marginLeft: '6px' }}>units</span>
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#38bdf8', fontWeight: 700, marginTop: '5px' }}>
                      ● Ready for customer delivery
                    </div>
                  </div>

                  {/* Total Came IN */}
                  <div className="admin-stat-card" style={{ borderColor: '#064e3b', background: 'linear-gradient(180deg, #022c22 0%, #0d0d0d 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label" style={{ color: '#86efac' }}>Products Came IN</span>
                      <ArrowDownCircle style={{ width: '18px', height: '18px', color: '#10b981' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#10b981' }}>
                      +{inventorySummary.totalProductsIn}
                      <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#86efac', marginLeft: '6px' }}>received</span>
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#86efac', fontWeight: 700, marginTop: '5px' }}>
                      ● Total factory & restock inflow
                    </div>
                  </div>

                  {/* Total Went OUT */}
                  <div className="admin-stat-card" style={{ borderColor: '#7c2d12', background: 'linear-gradient(180deg, #451a03 0%, #0d0d0d 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label" style={{ color: '#fdba74' }}>Products Went OUT</span>
                      <ArrowUpCircle style={{ width: '18px', height: '18px', color: '#f97316' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: '#f97316' }}>
                      -{inventorySummary.totalProductsOut}
                      <span style={{ fontSize: '0.80rem', fontWeight: 600, color: '#fdba74', marginLeft: '6px' }}>dispatched</span>
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#fdba74', fontWeight: 700, marginTop: '5px' }}>
                      ● Orders fulfilled & shipped
                    </div>
                  </div>

                  {/* Stock Health */}
                  <div className="admin-stat-card" style={{ borderColor: inventorySummary.lowStockCount > 0 ? '#b45309' : '#27272a' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-stat-label">Inventory Health</span>
                      <ShieldCheck style={{ width: '18px', height: '18px', color: inventorySummary.lowStockCount > 0 ? '#f59e0b' : '#10b981' }} />
                    </div>
                    <div className="admin-stat-val" style={{ color: inventorySummary.lowStockCount > 0 ? '#f59e0b' : '#10b981', fontSize: '1.45rem' }}>
                      {inventorySummary.lowStockCount > 0 ? `${inventorySummary.lowStockCount} Low Item(s)` : 'Optimal'}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#71717a', fontWeight: 700, marginTop: '5px' }}>
                      {inventorySummary.lowStockCount > 0 ? 'Reorder needed to prevent stockouts' : 'All packages above safe reserve'}
                    </div>
                  </div>

                </div>

                {/* TAB 1: PRODUCTS & LIVE STOCK */}
                {inventoryTab === 'products' && (
                  <div className="admin-card" style={{ padding: '22px' }}>
                    <div className="admin-card-header" style={{ marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Product Catalog & On-Hand Balance</h3>
                        <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>
                          Use quick action buttons on each item to record products arriving or dispatched.
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddItemModal(true)}
                        className="admin-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                      >
                        <Plus style={{ width: '13px', height: '13px' }} />
                        <span>Add Kit</span>
                      </button>
                    </div>

                    {inventoryItems.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px 0', color: '#71717a', fontSize: '0.85rem' }}>
                        No inventory products found. Click &quot;Add Kit&quot; to configure your products.
                      </div>
                    ) : inventoryViewMode === 'table' ? (
                      /* HIGH-DENSITY PROFESSIONAL TABLE VIEW */
                      <div className="admin-table-container">
                        <table className="admin-table-root">
                          <thead>
                            <tr>
                              <th>Product Name & SKU</th>
                              <th>Category</th>
                              <th>Current Stock</th>
                              <th>Status</th>
                              <th>Came IN (Total)</th>
                              <th>Went OUT (Total)</th>
                              <th>Alert Threshold</th>
                              <th style={{ textAlign: 'right' }}>Quick Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryItems.map((item) => {
                              const isLow = item.currentStock <= item.minThreshold;
                              const isOut = item.currentStock === 0;

                              return (
                                <tr key={item.id}>
                                  <td>
                                    <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.85rem' }}>
                                      {item.name}
                                    </div>
                                    <div style={{ fontSize: '0.70rem', color: '#71717a', fontFamily: 'monospace' }}>
                                      {item.sku || item.id}
                                    </div>
                                  </td>

                                  <td>
                                    <span style={{ fontSize: '0.72rem', background: '#18181b', padding: '3px 8px', borderRadius: '6px', color: '#d4d4d8', border: '1px solid #27272a' }}>
                                      {item.category}
                                    </span>
                                  </td>

                                  <td>
                                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#ffffff' }}>
                                      {item.currentStock}
                                    </span>
                                    <span style={{ fontSize: '0.72rem', color: '#71717a', marginLeft: '4px' }}>units</span>
                                  </td>

                                  <td>
                                    <span
                                      style={{
                                        fontSize: '0.70rem',
                                        fontWeight: 800,
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        background: isOut ? '#7f1d1d' : isLow ? '#78350f' : '#064e3b',
                                        color: isOut ? '#fca5a5' : isLow ? '#fde68a' : '#a7f3d0'
                                      }}
                                    >
                                      {isOut ? 'Out of Stock' : isLow ? 'Low Reserve' : 'Healthy Stock'}
                                    </span>
                                  </td>

                                  <td>
                                    <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#10b981' }}>
                                      +{item.totalIn || 0}
                                    </span>
                                  </td>

                                  <td>
                                    <span style={{ fontSize: '0.80rem', fontWeight: 800, color: '#f97316' }}>
                                      -{item.totalOut || 0}
                                    </span>
                                  </td>

                                  <td style={{ fontSize: '0.76rem', color: '#71717a' }}>
                                    {item.minThreshold} units
                                  </td>

                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      <button
                                        onClick={() => {
                                          setStockActionForm({
                                            itemId: item.id,
                                            quantity: 25,
                                            reason: 'Supplier Restock Delivery',
                                            referenceId: `PO-${Date.now().toString().slice(-4)}`,
                                            performedBy: 'Admin',
                                            notes: `Restock batch for ${item.name}`
                                          });
                                          setShowStockInModal(true);
                                        }}
                                        className="admin-btn-secondary"
                                        style={{ padding: '6px 10px', fontSize: '0.72rem', borderColor: '#10b98140', color: '#34d399' }}
                                        title="Record new stock coming in"
                                      >
                                        <ArrowDownCircle style={{ width: '13px', height: '13px' }} />
                                        <span>+ In</span>
                                      </button>

                                      <button
                                        onClick={() => {
                                          setStockActionForm({
                                            itemId: item.id,
                                            quantity: 1,
                                            reason: 'Customer Order Dispatched',
                                            referenceId: `DISP-${Date.now().toString().slice(-4)}`,
                                            performedBy: 'Admin',
                                            notes: `Fulfillment dispatch for ${item.name}`
                                          });
                                          setShowStockOutModal(true);
                                        }}
                                        className="admin-btn-secondary"
                                        style={{ padding: '6px 10px', fontSize: '0.72rem', borderColor: '#f59e0b40', color: '#fbbf24' }}
                                        title="Record units dispatched"
                                      >
                                        <ArrowUpCircle style={{ width: '13px', height: '13px' }} />
                                        <span>- Out</span>
                                      </button>

                                      <button
                                        onClick={() => handleDeleteInventoryItem(item.id, item.name)}
                                        className="admin-btn-secondary"
                                        style={{ padding: '6px 8px', color: '#52525b' }}
                                        title="Delete product"
                                      >
                                        <Trash2 style={{ width: '13px', height: '13px' }} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* CARDS GRID VIEW */
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {inventoryItems.map((item) => {
                          const isLow = item.currentStock <= item.minThreshold;
                          const isOut = item.currentStock === 0;
                          const healthPct = Math.min(100, Math.round((item.currentStock / Math.max(item.minThreshold * 3, 50)) * 100));

                          return (
                            <div
                              key={item.id}
                              style={{
                                background: '#121215',
                                border: `1px solid ${isOut ? '#ef444450' : isLow ? '#f59e0b50' : '#27272a'}`,
                                borderRadius: '14px',
                                padding: '18px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                  <span style={{ fontSize: '0.66rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#a1a1aa', fontWeight: 800 }}>
                                    {item.category} • {item.sku || item.id}
                                  </span>
                                  <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#ffffff', marginTop: '2px' }}>
                                    {item.name}
                                  </h4>
                                </div>

                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    background: isOut ? '#7f1d1d' : isLow ? '#78350f' : '#064e3b',
                                    color: isOut ? '#fca5a5' : isLow ? '#fde68a' : '#a7f3d0'
                                  }}
                                >
                                  {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Healthy Stock'}
                                </span>
                              </div>

                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>
                                    {item.currentStock}
                                    <span style={{ fontSize: '0.78rem', color: '#a1a1aa', fontWeight: 600, marginLeft: '6px' }}>units left</span>
                                  </span>
                                  <span style={{ fontSize: '0.70rem', color: '#71717a' }}>
                                    Min Safe: {item.minThreshold}
                                  </span>
                                </div>

                                <div style={{ height: '6px', background: '#27272a', borderRadius: '4px', overflow: 'hidden' }}>
                                  <div
                                    style={{
                                      height: '100%',
                                      width: `${healthPct}%`,
                                      background: isOut ? '#ef4444' : isLow ? '#f59e0b' : '#10b981',
                                      borderRadius: '4px',
                                      transition: 'width 0.4s ease'
                                    }}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#09090b', padding: '8px 12px', borderRadius: '8px', fontSize: '0.72rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                                  <ArrowDownCircle style={{ width: '13px', height: '13px' }} />
                                  <span>Came IN: +{item.totalIn || 0}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f97316', fontWeight: 700 }}>
                                  <ArrowUpCircle style={{ width: '13px', height: '13px' }} />
                                  <span>Went OUT: -{item.totalOut || 0}</span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                                <button
                                  onClick={() => {
                                    setStockActionForm({
                                      itemId: item.id,
                                      quantity: 25,
                                      reason: 'Supplier Restock Delivery',
                                      referenceId: `PO-${Date.now().toString().slice(-4)}`,
                                      performedBy: 'Admin',
                                      notes: `Restock for ${item.name}`
                                    });
                                    setShowStockInModal(true);
                                  }}
                                  className="admin-btn-secondary"
                                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.74rem', justifyContent: 'center', borderColor: '#10b98150', color: '#34d399' }}
                                >
                                  <ArrowDownCircle style={{ width: '13px', height: '13px' }} />
                                  <span>+ Stock IN</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setStockActionForm({
                                      itemId: item.id,
                                      quantity: 1,
                                      reason: 'Customer Order Dispatched',
                                      referenceId: `DISP-${Date.now().toString().slice(-4)}`,
                                      performedBy: 'Admin',
                                      notes: `Fulfillment for ${item.name}`
                                    });
                                    setShowStockOutModal(true);
                                  }}
                                  className="admin-btn-secondary"
                                  style={{ flex: 1, padding: '7px 10px', fontSize: '0.74rem', justifyContent: 'center', borderColor: '#f59e0b50', color: '#fbbf24' }}
                                >
                                  <ArrowUpCircle style={{ width: '13px', height: '13px' }} />
                                  <span>- Stock OUT</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteInventoryItem(item.id, item.name)}
                                  className="admin-btn-secondary"
                                  title="Delete item"
                                  style={{ padding: '7px 8px', color: '#71717a' }}
                                >
                                  <Trash2 style={{ width: '13px', height: '13px' }} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: IN / OUT ACTIVITY LEDGER */}
                {inventoryTab === 'ledger' && (
                  <div className="admin-card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Product Flow & Fulfillment Ledger</h3>
                        <p style={{ fontSize: '0.74rem', color: '#71717a', marginTop: '2px' }}>
                          Transparent audit log of all incoming stock batches and outgoing customer shipments.
                        </p>
                      </div>

                      {/* Filter Bar */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
                        {/* Flow Segment Buttons */}
                        <div style={{ display: 'flex', background: '#09090b', padding: '3px', borderRadius: '8px', border: '1px solid #27272a' }}>
                          <button
                            onClick={() => setStockLogFilter('ALL')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              background: stockLogFilter === 'ALL' ? '#ffffff' : 'transparent',
                              color: stockLogFilter === 'ALL' ? '#000000' : '#a1a1aa'
                            }}
                          >
                            All Logs
                          </button>
                          <button
                            onClick={() => setStockLogFilter('IN')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              background: stockLogFilter === 'IN' ? '#10b981' : 'transparent',
                              color: stockLogFilter === 'IN' ? '#000000' : '#a1a1aa'
                            }}
                          >
                            📥 Came IN (Restocks)
                          </button>
                          <button
                            onClick={() => setStockLogFilter('OUT')}
                            style={{
                              padding: '5px 12px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              background: stockLogFilter === 'OUT' ? '#f97316' : 'transparent',
                              color: stockLogFilter === 'OUT' ? '#ffffff' : '#a1a1aa'
                            }}
                          >
                            📤 Went OUT (Shipments)
                          </button>
                        </div>

                        {/* Product Filter */}
                        <select
                          value={stockLogItemFilter}
                          onChange={(e) => setStockLogItemFilter(e.target.value)}
                          className="admin-input-control"
                          style={{ width: 'auto', padding: '6px 12px', fontSize: '0.74rem' }}
                        >
                          <option value="ALL">All Product Kits</option>
                          {inventoryItems.map(it => (
                            <option key={it.id} value={it.id}>{it.name}</option>
                          ))}
                        </select>

                        {/* Search Bar */}
                        <div style={{ position: 'relative' }}>
                          <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                          <input
                            type="text"
                            value={stockLogSearch}
                            onChange={(e) => setStockLogSearch(e.target.value)}
                            placeholder="Search ref #, reason..."
                            className="admin-input-control"
                            style={{ width: '200px', padding: '6px 10px 6px 30px', fontSize: '0.74rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Table */}
                    {(() => {
                      const filtered = inventoryLogs.filter((l) => {
                        if (stockLogFilter !== 'ALL' && l.type !== stockLogFilter) return false;
                        if (stockLogItemFilter !== 'ALL' && l.itemId !== stockLogItemFilter) return false;
                        if (stockLogSearch.trim()) {
                          const q = stockLogSearch.toLowerCase();
                          const match =
                            (l.itemName || '').toLowerCase().includes(q) ||
                            (l.reason || '').toLowerCase().includes(q) ||
                            (l.referenceId || '').toLowerCase().includes(q) ||
                            (l.performedBy || '').toLowerCase().includes(q) ||
                            (l.notes || '').toLowerCase().includes(q);
                          if (!match) return false;
                        }
                        return true;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '50px 0', color: '#71717a', fontSize: '0.82rem' }}>
                            No stock movement logs match your current search/filter.
                          </div>
                        );
                      }

                      return (
                        <div className="admin-table-container">
                          <table className="admin-table-root">
                            <thead>
                              <tr>
                                <th>Timestamp</th>
                                <th>Product Kit</th>
                                <th>Direction</th>
                                <th>Quantity Change</th>
                                <th>Reason / Movement Event</th>
                                <th>Reference (Order / PO)</th>
                                <th>Logged By</th>
                                <th>Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((log) => {
                                const isIn = log.type === 'IN';
                                return (
                                  <tr key={log.id}>
                                    <td style={{ fontSize: '0.74rem', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                                      {new Date(log.createdAt).toLocaleString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </td>
                                    <td>
                                      <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.82rem' }}>
                                        {log.itemName}
                                      </div>
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '3px 8px',
                                          borderRadius: '6px',
                                          fontSize: '0.70rem',
                                          fontWeight: 800,
                                          background: isIn ? '#064e3b' : '#7c2d12',
                                          color: isIn ? '#86efac' : '#fdba74'
                                        }}
                                      >
                                        {isIn ? <ArrowDownCircle style={{ width: '12px', height: '12px' }} /> : <ArrowUpCircle style={{ width: '12px', height: '12px' }} />}
                                        <span>{isIn ? 'Stock Arrived (IN)' : 'Dispatched (OUT)'}</span>
                                      </span>
                                    </td>
                                    <td>
                                      <span
                                        style={{
                                          fontSize: '0.90rem',
                                          fontWeight: 900,
                                          color: isIn ? '#10b981' : '#f97316'
                                        }}
                                      >
                                        {isIn ? `+${log.quantity}` : `-${log.quantity}`}
                                      </span>
                                    </td>
                                    <td>
                                      <span style={{ fontSize: '0.78rem', color: '#e4e4e7', fontWeight: 600 }}>
                                        {log.reason}
                                      </span>
                                    </td>
                                    <td>
                                      {log.referenceId ? (
                                        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', background: '#1c1c20', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8', border: '1px solid #27272a' }}>
                                          {log.referenceId}
                                        </span>
                                      ) : (
                                        <span style={{ color: '#52525b', fontSize: '0.70rem' }}>—</span>
                                      )}
                                    </td>
                                    <td style={{ fontSize: '0.74rem', color: '#a1a1aa' }}>
                                      {log.performedBy || 'Admin'}
                                    </td>
                                    <td style={{ fontSize: '0.74rem', color: '#71717a', maxWidth: '220px' }}>
                                      {log.notes || '—'}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* MODAL 1: SIMPLE PROFESSIONAL STOCK IN (ARRIVED) */}
                <AnimatePresence>
                  {showStockInModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="admin-modal-overlay"
                      onClick={() => setShowStockInModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="admin-modal-box"
                        style={{ maxWidth: '480px', padding: '24px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="admin-modal-header" style={{ paddingBottom: '14px', borderBottom: '1px solid #27272a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#10b98120', padding: '8px', borderRadius: '10px', color: '#10b981', display: 'flex' }}>
                              <ArrowDownCircle style={{ width: '22px', height: '22px' }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Record Stock Arrived (IN)</h3>
                              <p style={{ fontSize: '0.72rem', color: '#71717a', margin: '2px 0 0 0' }}>Add new inventory units received from factory or suppliers.</p>
                            </div>
                          </div>
                          <button onClick={() => setShowStockInModal(false)} className="admin-modal-close-btn">
                            <X style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRecordStockAction('IN');
                          }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}
                        >
                          <div>
                            <label className="admin-label">1. Select Product Kit *</label>
                            <select
                              value={stockActionForm.itemId}
                              onChange={(e) => setStockActionForm({ ...stockActionForm, itemId: e.target.value })}
                              className="admin-input-control"
                              required
                              style={{ marginTop: '4px' }}
                            >
                              <option value="">-- Choose Product --</option>
                              {inventoryItems.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.name} (Current: {it.currentStock} units)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="admin-label">2. Units Received *</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <input
                                type="number"
                                min="1"
                                value={stockActionForm.quantity}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="admin-input-control"
                                style={{ flex: 1 }}
                                required
                              />
                            </div>
                            {/* Preset Quick Chips */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                              {[10, 25, 50, 100].map(qty => (
                                <button
                                  type="button"
                                  key={qty}
                                  onClick={() => setStockActionForm({ ...stockActionForm, quantity: qty })}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #27272a',
                                    background: stockActionForm.quantity === qty ? '#10b981' : '#18181b',
                                    color: stockActionForm.quantity === qty ? '#000000' : '#a1a1aa',
                                    fontSize: '0.70rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  +{qty}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label className="admin-label">Batch / PO Reference</label>
                              <input
                                type="text"
                                placeholder="e.g. PO-9802 or BATCH-OCT"
                                value={stockActionForm.referenceId}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, referenceId: e.target.value })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>

                            <div>
                              <label className="admin-label">Source / Supplier</label>
                              <input
                                type="text"
                                value={stockActionForm.reason}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, reason: e.target.value })}
                                placeholder="e.g. Factory Delivery"
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                                required
                              />
                            </div>
                          </div>

                          <div>
                            <label className="admin-label">Notes (Optional)</label>
                            <input
                              type="text"
                              placeholder="Invoice number or quality check notes"
                              value={stockActionForm.notes}
                              onChange={(e) => setStockActionForm({ ...stockActionForm, notes: e.target.value })}
                              className="admin-input-control"
                              style={{ marginTop: '4px' }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #1f1f23' }}>
                            <button type="button" onClick={() => setShowStockInModal(false)} className="admin-btn-secondary">
                              Cancel
                            </button>
                            <button type="submit" className="admin-btn-primary" style={{ background: '#10b981', borderColor: '#10b981', color: '#000000', fontWeight: 900 }}>
                              Confirm & Add to Stock
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* MODAL 2: SIMPLE PROFESSIONAL STOCK OUT (DISPATCHED) */}
                <AnimatePresence>
                  {showStockOutModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="admin-modal-overlay"
                      onClick={() => setShowStockOutModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="admin-modal-box"
                        style={{ maxWidth: '480px', padding: '24px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="admin-modal-header" style={{ paddingBottom: '14px', borderBottom: '1px solid #27272a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#f59e0b20', padding: '8px', borderRadius: '10px', color: '#f59e0b', display: 'flex' }}>
                              <ArrowUpCircle style={{ width: '22px', height: '22px' }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Record Stock Out (Dispatched)</h3>
                              <p style={{ fontSize: '0.72rem', color: '#71717a', margin: '2px 0 0 0' }}>Deduct units for customer shipments, samples, or replacements.</p>
                            </div>
                          </div>
                          <button onClick={() => setShowStockOutModal(false)} className="admin-modal-close-btn">
                            <X style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleRecordStockAction('OUT');
                          }}
                          style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}
                        >
                          <div>
                            <label className="admin-label">1. Select Product Kit *</label>
                            <select
                              value={stockActionForm.itemId}
                              onChange={(e) => setStockActionForm({ ...stockActionForm, itemId: e.target.value })}
                              className="admin-input-control"
                              required
                              style={{ marginTop: '4px' }}
                            >
                              <option value="">-- Choose Product --</option>
                              {inventoryItems.map((it) => (
                                <option key={it.id} value={it.id}>
                                  {it.name} (Current: {it.currentStock} units)
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="admin-label">2. Units Dispatched *</label>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                              <input
                                type="number"
                                min="1"
                                value={stockActionForm.quantity}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="admin-input-control"
                                style={{ flex: 1 }}
                                required
                              />
                            </div>
                            {/* Preset Quick Chips */}
                            <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                              {[1, 2, 5, 10].map(qty => (
                                <button
                                  type="button"
                                  key={qty}
                                  onClick={() => setStockActionForm({ ...stockActionForm, quantity: qty })}
                                  style={{
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #27272a',
                                    background: stockActionForm.quantity === qty ? '#f97316' : '#18181b',
                                    color: stockActionForm.quantity === qty ? '#ffffff' : '#a1a1aa',
                                    fontSize: '0.70rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {qty} unit{qty > 1 ? 's' : ''}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="admin-label">3. Reason / Purpose</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px', marginBottom: '8px' }}>
                              {['Customer Order Dispatched', 'Sample / Influencer Pack', 'Damaged / Defect', 'Inventory Correction'].map((r) => (
                                <button
                                  type="button"
                                  key={r}
                                  onClick={() => setStockActionForm({ ...stockActionForm, reason: r })}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid #27272a',
                                    background: stockActionForm.reason === r ? '#27272a' : '#121215',
                                    color: stockActionForm.reason === r ? '#ffffff' : '#71717a',
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                            <input
                              type="text"
                              value={stockActionForm.reason}
                              onChange={(e) => setStockActionForm({ ...stockActionForm, reason: e.target.value })}
                              className="admin-input-control"
                              required
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label className="admin-label">Order # / Tracking AWB</label>
                              <input
                                type="text"
                                placeholder="e.g. ORD-1002"
                                value={stockActionForm.referenceId}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, referenceId: e.target.value })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>

                            <div>
                              <label className="admin-label">Courier / Notes</label>
                              <input
                                type="text"
                                placeholder="e.g. Delhivery / BlueDart"
                                value={stockActionForm.notes}
                                onChange={(e) => setStockActionForm({ ...stockActionForm, notes: e.target.value })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #1f1f23' }}>
                            <button type="button" onClick={() => setShowStockOutModal(false)} className="admin-btn-secondary">
                              Cancel
                            </button>
                            <button type="submit" className="admin-btn-primary" style={{ background: '#f59e0b', borderColor: '#f59e0b', color: '#000000', fontWeight: 900 }}>
                              Confirm Stock Deduction
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* MODAL 3: ADD NEW PRODUCT ITEM */}
                <AnimatePresence>
                  {showAddItemModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="admin-modal-overlay"
                      onClick={() => setShowAddItemModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.95, y: 15 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 15 }}
                        className="admin-modal-box"
                        style={{ maxWidth: '480px', padding: '24px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="admin-modal-header" style={{ paddingBottom: '14px', borderBottom: '1px solid #27272a' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: '#3b82f620', padding: '8px', borderRadius: '10px', color: '#60a5fa', display: 'flex' }}>
                              <Plus style={{ width: '22px', height: '22px' }} />
                            </div>
                            <div>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>Add Product Package</h3>
                              <p style={{ fontSize: '0.72rem', color: '#71717a', margin: '2px 0 0 0' }}>Register a new kit to track incoming batches and stock.</p>
                            </div>
                          </div>
                          <button onClick={() => setShowAddItemModal(false)} className="admin-modal-close-btn">
                            <X style={{ width: '18px', height: '18px' }} />
                          </button>
                        </div>

                        <form onSubmit={handleSaveNewItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                          <div>
                            <label className="admin-label">Product Kit Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. Smart Money Financial Kit Deluxe"
                              value={newItemForm.name}
                              onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                              className="admin-input-control"
                              style={{ marginTop: '4px' }}
                              required
                            />
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                              <label className="admin-label">SKU / Code</label>
                              <input
                                type="text"
                                placeholder="e.g. KGL-DLX-04"
                                value={newItemForm.sku}
                                onChange={(e) => setNewItemForm({ ...newItemForm, sku: e.target.value })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>

                            <div>
                              <label className="admin-label">Category</label>
                              <input
                                type="text"
                                placeholder="Smart Money Kit"
                                value={newItemForm.category}
                                onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div>
                              <label className="admin-label">Opening Stock</label>
                              <input
                                type="number"
                                min="0"
                                value={newItemForm.currentStock}
                                onChange={(e) => setNewItemForm({ ...newItemForm, currentStock: parseInt(e.target.value) || 0 })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>

                            <div>
                              <label className="admin-label">Low Stock Alert</label>
                              <input
                                type="number"
                                min="1"
                                value={newItemForm.minThreshold}
                                onChange={(e) => setNewItemForm({ ...newItemForm, minThreshold: parseInt(e.target.value) || 10 })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>

                            <div>
                              <label className="admin-label">Unit Cost (₹)</label>
                              <input
                                type="number"
                                min="0"
                                value={newItemForm.unitCost}
                                onChange={(e) => setNewItemForm({ ...newItemForm, unitCost: parseFloat(e.target.value) || 0 })}
                                className="admin-input-control"
                                style={{ marginTop: '4px' }}
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #1f1f23' }}>
                            <button type="button" onClick={() => setShowAddItemModal(false)} className="admin-btn-secondary">
                              Cancel
                            </button>
                            <button type="submit" className="admin-btn-primary">
                              Save & Track
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            )}

            {/* 4. DATABASE RECORDS */}
            {currentSection === 'database' && (
              <div className="admin-card" style={{ padding: '24px' }}>
                <div className="admin-card-header" style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900 }}>Database & Raw Data Inspector</h3>
                  <p style={{ fontSize: '0.8rem', color: '#71717a' }}>View all internal system records and raw order data directly in a table format.</p>
                </div>

                {!isDbUnlocked ? (
                  <div style={{ background: '#09090b', padding: '30px', borderRadius: '12px', border: '1px solid #27272a', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
                    <ShieldCheck style={{ width: '48px', height: '48px', color: '#f59e0b', margin: '0 auto 16px' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Security Check Required</h4>
                    <p style={{ fontSize: '0.74rem', color: '#71717a', marginBottom: '20px' }}>Enter the secondary database Master PIN to view raw backend records.</p>
                    
                    <input
                      type="password"
                      value={dbPinInput}
                      onChange={(e) => {
                        setDbPinInput(e.target.value);
                        setDbPinError('');
                      }}
                      placeholder="Enter Database PIN..."
                      style={{
                        width: '100%', padding: '12px', background: '#000000', border: '1px solid #27272a',
                        borderRadius: '8px', color: '#ffffff', fontSize: '1rem', textAlign: 'center',
                        letterSpacing: '4px', fontFamily: 'monospace', marginBottom: '16px'
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (dbPinInput === '8888') {
                            setIsDbUnlocked(true);
                            setDbPinError('');
                          } else {
                            setDbPinError('Incorrect Database PIN. Access denied.');
                          }
                        }
                      }}
                    />

                    {dbPinError && <div style={{ color: '#ef4444', fontSize: '0.74rem', fontWeight: 700, marginBottom: '16px' }}>{dbPinError}</div>}

                    <button
                      onClick={() => {
                        if (dbPinInput === '8888') {
                          setIsDbUnlocked(true);
                          setDbPinError('');
                        } else {
                          setDbPinError('Incorrect Database PIN. Access denied.');
                        }
                      }}
                      className="admin-btn-primary"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      <Lock style={{ width: '14px', height: '14px' }} />
                      <span>Unlock Database</span>
                    </button>
                    <p style={{ fontSize: '0.65rem', color: '#71717a', marginTop: '12px' }}>Default PIN is 8888</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10b981' }}>● Connection Established - Live SQLite Records</h4>
                      <button onClick={() => setIsDbUnlocked(false)} className="admin-btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }}>
                        <Lock style={{ width: '12px', height: '12px' }} /> Lock Access
                      </button>
                    </div>

                    <div style={{ overflowX: 'auto', background: '#09090b', borderRadius: '10px', border: '1px solid #27272a' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ background: '#18181b', borderBottom: '1px solid #27272a' }}>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>DB ID</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Name</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Email</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Phone</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Flat/House No</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Address</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Landmark</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>City</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>District</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>State</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Pincode</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Package</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Amount</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Pay Method</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Pay ID</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Status</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Affiliate Ref</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#a1a1aa', whiteSpace: 'nowrap' }}>Created At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((ord, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #27272a' }}>
                              <td style={{ padding: '12px', fontFamily: 'monospace', color: '#71717a', whiteSpace: 'nowrap' }}>{ord.id}</td>
                              <td style={{ padding: '12px', color: '#ffffff', whiteSpace: 'nowrap' }}>{ord.customerName}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.email || '-'}</td>
                              <td style={{ padding: '12px', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{ord.phone}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.flatNo || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.address || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.landmark || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.city || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.district || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.state || '-'}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.pincode || '-'}</td>
                              <td style={{ padding: '12px', color: '#e4e4e7', whiteSpace: 'nowrap' }}>{ord.packageName}</td>
                              <td style={{ padding: '12px', color: '#34d399', fontWeight: 800, whiteSpace: 'nowrap' }}>{ord.currency}{ord.price}</td>
                              <td style={{ padding: '12px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.paymentMethod || '-'}</td>
                              <td style={{ padding: '12px', fontFamily: 'monospace', color: '#a1a1aa', whiteSpace: 'nowrap' }}>{ord.paymentId || '-'}</td>
                              <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                                <span style={{ padding: '2px 6px', background: '#18181b', borderRadius: '4px', fontSize: '0.65rem' }}>{ord.status}</span>
                              </td>
                              <td style={{ padding: '12px', color: '#a855f7', whiteSpace: 'nowrap' }}>{ord.affiliateRef || '-'}</td>
                              <td style={{ padding: '12px', color: '#71717a', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{new Date(ord.createdAt).toLocaleString()}</td>
                            </tr>
                          ))}
                          {orders.length === 0 && (
                            <tr>
                              <td colSpan={18} style={{ padding: '24px', textAlign: 'center', color: '#71717a' }}>No records found in database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
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

                      <div style={{ position: 'relative', width: '240px' }}>
                        <Search style={{ width: '13px', height: '13px', position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717a' }} />
                        <input
                          type="text"
                          value={affiliateSearchTerm}
                          onChange={(e) => setAffiliateSearchTerm(e.target.value)}
                          placeholder="Search referral name..."
                          className="admin-input-control"
                          style={{ paddingLeft: '30px', padding: '6px 10px 6px 30px', fontSize: '0.74rem' }}
                        />
                      </div>
                    </div>

                    {(() => {
                      const filteredAffiliates = affiliateStats.filter(a => a.tag.toLowerCase().includes(affiliateSearchTerm.toLowerCase()));
                      
                      if (filteredAffiliates.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#71717a', fontSize: '0.80rem' }}>
                            <Share2 style={{ width: '28px', height: '28px', margin: '0 auto 8px', color: '#3f3f46' }} />
                            <p>No affiliate sales found.</p>
                            <span style={{ fontSize: '0.72rem', color: '#52525b' }}>Share creator links above to track sales automatically.</span>
                          </div>
                        );
                      }
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {filteredAffiliates.map((item, idx) => (
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
                                  Est. Commission (₹100/order): ₹{(item.completedCount * 100).toLocaleString('en-IN')}
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
                    );
                  })()}
                  </div>
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
