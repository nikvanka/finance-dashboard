import { useState, useMemo, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ── Mock Data ──────────────────────────────────────────────────────────────────
const CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Health", "Entertainment", "Utilities", "Salary", "Freelance", "Investment"];
const CATEGORY_COLORS = {
  "Food & Dining": "#e07b54",
  "Transport": "#5b8dee",
  "Shopping": "#a855f7",
  "Health": "#22c55e",
  "Entertainment": "#f59e0b",
  "Utilities": "#64748b",
  "Salary": "#0ea5e9",
  "Freelance": "#14b8a6",
  "Investment": "#f43f5e",
};

const INITIAL_TRANSACTIONS = [
  { id: 1, date: "2026-03-01", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 2, date: "2026-03-02", description: "Swiggy Order", amount: 450, category: "Food & Dining", type: "expense" },
  { id: 3, date: "2026-03-03", description: "Ola Cab", amount: 280, category: "Transport", type: "expense" },
  { id: 4, date: "2026-03-04", description: "Amazon Shopping", amount: 3200, category: "Shopping", type: "expense" },
  { id: 5, date: "2026-03-05", description: "Apollo Pharmacy", amount: 650, category: "Health", type: "expense" },
  { id: 6, date: "2026-03-06", description: "Netflix Subscription", amount: 499, category: "Entertainment", type: "expense" },
  { id: 7, date: "2026-03-07", description: "BESCOM Electricity", amount: 1200, category: "Utilities", type: "expense" },
  { id: 8, date: "2026-03-08", description: "Freelance Project", amount: 25000, category: "Freelance", type: "income" },
  { id: 9, date: "2026-03-10", description: "Zomato Delivery", amount: 380, category: "Food & Dining", type: "expense" },
  { id: 10, date: "2026-03-12", description: "Metro Card Recharge", amount: 500, category: "Transport", type: "expense" },
  { id: 11, date: "2026-03-13", description: "Myntra Purchase", amount: 2800, category: "Shopping", type: "expense" },
  { id: 12, date: "2026-03-14", description: "Gym Membership", amount: 2000, category: "Health", type: "expense" },
  { id: 13, date: "2026-03-15", description: "Movie Tickets (PVR)", amount: 900, category: "Entertainment", type: "expense" },
  { id: 14, date: "2026-03-16", description: "Airtel Postpaid", amount: 699, category: "Utilities", type: "expense" },
  { id: 15, date: "2026-03-17", description: "Mutual Fund SIP", amount: 10000, category: "Investment", type: "expense" },
  { id: 16, date: "2026-03-18", description: "Zepto Groceries", amount: 1100, category: "Food & Dining", type: "expense" },
  { id: 17, date: "2026-03-20", description: "Petrol – Bike", amount: 700, category: "Transport", type: "expense" },
  { id: 18, date: "2026-03-22", description: "Salary Bonus", amount: 15000, category: "Salary", type: "income" },
  { id: 19, date: "2026-03-24", description: "Decathlon Purchase", amount: 4500, category: "Shopping", type: "expense" },
  { id: 20, date: "2026-03-25", description: "Doctor Visit", amount: 800, category: "Health", type: "expense" },
  { id: 21, date: "2026-03-27", description: "Spotify Premium", amount: 119, category: "Entertainment", type: "expense" },
  { id: 22, date: "2026-03-28", description: "Water Bill", amount: 350, category: "Utilities", type: "expense" },
  { id: 23, date: "2026-03-30", description: "Dividend Income", amount: 3200, category: "Investment", type: "income" },
  { id: 24, date: "2026-02-01", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 25, date: "2026-02-05", description: "Food Expenses", amount: 3200, category: "Food & Dining", type: "expense" },
  { id: 26, date: "2026-02-10", description: "Transport Costs", amount: 1800, category: "Transport", type: "expense" },
  { id: 27, date: "2026-02-15", description: "Online Shopping", amount: 5600, category: "Shopping", type: "expense" },
  { id: 28, date: "2026-02-18", description: "Medical Expenses", amount: 2200, category: "Health", type: "expense" },
  { id: 29, date: "2026-02-20", description: "Entertainment", amount: 1800, category: "Entertainment", type: "expense" },
  { id: 30, date: "2026-02-25", description: "Utility Bills", amount: 2500, category: "Utilities", type: "expense" },
  { id: 31, date: "2026-01-01", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: 32, date: "2026-01-08", description: "Freelance Work", amount: 18000, category: "Freelance", type: "income" },
  { id: 33, date: "2026-01-10", description: "Food & Dining", amount: 4100, category: "Food & Dining", type: "expense" },
  { id: 34, date: "2026-01-15", description: "Shopping Spree", amount: 7200, category: "Shopping", type: "expense" },
  { id: 35, date: "2026-01-20", description: "Health & Fitness", amount: 3000, category: "Health", type: "expense" },
  { id: 36, date: "2026-01-28", description: "SIP Investment", amount: 10000, category: "Investment", type: "expense" },
];

const MONTHLY_TREND = [
  { month: "Oct", income: 92000, expenses: 38000, balance: 54000 },
  { month: "Nov", income: 88000, expenses: 42000, balance: 46000 },
  { month: "Dec", income: 105000, expenses: 56000, balance: 49000 },
  { month: "Jan", income: 103000, expenses: 44300, balance: 58700 },
  { month: "Feb", income: 85000, expenses: 17100, balance: 67900 },
  { month: "Mar", income: 128200, expenses: 29927, balance: 98273 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${n}`;

// ── Components ─────────────────────────────────────────────────────────────────
function Badge({ type }) {
  const styles = {
    income: { background: "#dcfce7", color: "#15803d", label: "Income" },
    expense: { background: "#fee2e2", color: "#dc2626", label: "Expense" },
  };
  const s = styles[type];
  return (
    <span style={{ background: s.background, color: s.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, letterSpacing: 0.3 }}>
      {s.label}
    </span>
  );
}

function CategoryBadge({ cat }) {
  const color = CATEGORY_COLORS[cat] || "#64748b";
  return (
    <span style={{ background: color + "20", color: color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20 }}>
      {cat}
    </span>
  );
}

function SummaryCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f1f5f9",
      borderRadius: 16,
      padding: "20px 24px",
      borderTop: `3px solid ${accent}`,
      minWidth: 0,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b", letterSpacing: 0.3 }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── Modal for Add/Edit Transaction ─────────────────────────────────────────────
function TransactionModal({ tx, onSave, onClose }) {
  const [form, setForm] = useState(tx || { date: new Date().toISOString().split("T")[0], description: "", amount: "", category: "Food & Dining", type: "expense" });
  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: 420, maxWidth: "95vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{tx ? "Edit Transaction" : "New Transaction"}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#64748b" }}>×</button>
        </div>
        {[
          { label: "Date", key: "date", type: "date" },
          { label: "Description", key: "description", type: "text" },
          { label: "Amount (₹)", key: "amount", type: "number" },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>{f.label}</label>
            <input type={f.type} value={form[f.key]} onChange={e => update(f.key, e.target.value)}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Category</label>
          <select value={form.category} onChange={e => update("category", e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, outline: "none" }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "block", marginBottom: 4 }}>Type</label>
          <div style={{ display: "flex", gap: 8 }}>
            {["expense", "income"].map(t => (
              <button key={t} onClick={() => update("type", t)} style={{
                flex: 1, padding: "10px", border: `2px solid ${form.type === t ? (t === "income" ? "#22c55e" : "#ef4444") : "#e2e8f0"}`,
                borderRadius: 10, background: form.type === t ? (t === "income" ? "#dcfce7" : "#fee2e2") : "#fff",
                color: form.type === t ? (t === "income" ? "#15803d" : "#dc2626") : "#64748b",
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
              }}>{t === "income" ? "↑ Income" : "↓ Expense"}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
          <button onClick={() => onSave(form)} style={{ flex: 1, padding: "11px", border: "none", borderRadius: 10, background: "#6366f1", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [role, setRole] = useState("admin");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fin_track_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCat, setFilterCat] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [modal, setModal] = useState(null); // null | "new" | {tx object for edit}
  const [darkMode, setDarkMode] = useState(false);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [budget, setBudget] = useState(50000);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // ── Persist transactions to localStorage ──
  useEffect(() => {
    localStorage.setItem("fin_track_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // ── Persist budget to localStorage ──
  useEffect(() => {
    localStorage.setItem("fin_track_budget", budget.toString());
  }, [budget]);

  // ── Load budget from localStorage ──
  useEffect(() => {
    const saved = localStorage.getItem("fin_track_budget");
    if (saved) setBudget(Number(saved));
  }, []);

  const isAdmin = role === "admin";

  // Compute summaries
  const summaries = useMemo(() => {
    const mar = transactions.filter(t => t.date.startsWith("2026-03"));
    const income = mar.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = mar.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    return { balance: income - expenses, income, expenses };
  }, [transactions]);

  // Spending by category (March)
  const spendByCategory = useMemo(() => {
    const map = {};
    transactions.filter(t => t.type === "expense" && t.date.startsWith("2026-03")).forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Insights
  const insights = useMemo(() => {
    const topCat = spendByCategory[0];
    const feb = transactions.filter(t => t.type === "expense" && t.date.startsWith("2026-02")).reduce((s, t) => s + t.amount, 0);
    const mar = transactions.filter(t => t.type === "expense" && t.date.startsWith("2026-03")).reduce((s, t) => s + t.amount, 0);
    const savingsRate = ((summaries.income - summaries.expenses) / summaries.income * 100).toFixed(1);
    return { topCat, feb, mar, savingsRate };
  }, [transactions, spendByCategory, summaries]);

  // Filtered + sorted transactions
  const filteredTx = useMemo(() => {
    let list = transactions.filter(t => {
      const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      const matchCat = filterCat === "all" || t.category === filterCat;
      const matchDateStart = !dateStart || t.date >= dateStart;
      const matchDateEnd = !dateEnd || t.date <= dateEnd;
      return matchSearch && matchType && matchCat && matchDateStart && matchDateEnd;
    });
    list = [...list].sort((a, b) => {
      if (sortBy === "date-desc") return b.date.localeCompare(a.date);
      if (sortBy === "date-asc") return a.date.localeCompare(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });
    return list;
  }, [transactions, search, filterType, filterCat, sortBy, dateStart, dateEnd]);

  // ── Export Functions ──
  const exportToCSV = () => {
    const headers = ["Date", "Description", "Amount", "Category", "Type"];
    const rows = filteredTx.map(t => [t.date, t.description, t.amount, t.category, t.type]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportToJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      transactions: filteredTx,
      summary: summaries,
      budget: budget
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fin-track-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  // ── Budget Alert ──
  const currentMonthExpenses = transactions
    .filter(t => t.type === "expense" && t.date.startsWith("2026-03"))
    .reduce((sum, t) => sum + t.amount, 0);
  const budgetExceeded = currentMonthExpenses > budget;
  const budgetPercentage = (currentMonthExpenses / budget * 100).toFixed(1);

  const handleSave = (form) => {
    const amount = Number(form.amount);
    if (!form.description || !amount) return;
    if (form.id) {
      setTransactions(ts => ts.map(t => t.id === form.id ? { ...form, amount } : t));
    } else {
      setTransactions(ts => [...ts, { ...form, id: Date.now(), amount }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => setTransactions(ts => ts.filter(t => t.id !== id));

  const bg = darkMode ? "#0f172a" : "#f8fafc";
  const card = darkMode ? "#1e293b" : "#fff";
  const text = darkMode ? "#f1f5f9" : "#0f172a";
  const muted = darkMode ? "#94a3b8" : "#64748b";
  const border = darkMode ? "#334155" : "#f1f5f9";

  const navTabs = ["dashboard", "transactions", "insights"];

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: text, transition: "all 0.2s", display: "flex", flexDirection: "column" }}>
      {/* Sidebar + Main layout */}
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: card, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", padding: "24px 0", position: "sticky", top: 0, height: "100vh" }}>
          <div style={{ padding: "0 24px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>F</div>
              <span style={{ fontWeight: 800, fontSize: 17, letterSpacing: -0.5, color: text }}>FinTrack</span>
            </div>
          </div>

          {navTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "11px 24px", background: activeTab === tab ? "#eef2ff" : "transparent",
              border: "none", cursor: "pointer", width: "100%", textAlign: "left", fontWeight: activeTab === tab ? 700 : 500,
              fontSize: 14, color: activeTab === tab ? "#6366f1" : muted, borderRight: activeTab === tab ? "3px solid #6366f1" : "3px solid transparent",
              transition: "all 0.15s",
            }}>
              <span>{tab === "dashboard" ? "📊" : tab === "transactions" ? "📋" : "💡"}</span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Budget Tracker */}
            <div style={{ background: budgetExceeded ? "#fee2e2" : "rgba(34, 197, 94, 0.1)", borderRadius: 12, padding: 12, border: `1px solid ${budgetExceeded ? "#fecaca" : "#86efac"}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: budgetExceeded ? "#dc2626" : "#15803d", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>💰 Monthly Budget</div>
              <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} style={{
                width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${budgetExceeded ? "#fecaca" : "#86efac"}`,
                background: "transparent", color: text, fontSize: 13, fontWeight: 600, marginBottom: 6, outline: "none"
              }} />
              <div style={{ fontSize: 11, color: budgetExceeded ? "#dc2626" : "#15803d", fontWeight: 600 }}>
                {budgetExceeded ? `⚠️ Exceeded by ₹${fmt(currentMonthExpenses - budget)}` : `✓ ${budgetPercentage}% spent`}
              </div>
              <div style={{ width: "100%", height: 6, background: darkMode ? "#334155" : "#e2e8f0", borderRadius: 3, overflow: "hidden", marginTop: 6 }}>
                <div style={{ width: `${Math.min(budgetPercentage, 100)}%`, height: "100%", background: budgetExceeded ? "#dc2626" : "#22c55e", borderRadius: 3, transition: "width 0.3s" }}></div>
              </div>
            </div>

            {/* Role switcher */}
            <div style={{ background: darkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: muted, marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>Role</div>
              <select value={role} onChange={e => setRole(e.target.value)} style={{
                width: "100%", padding: "8px 10px", borderRadius: 8, border: `1px solid ${border}`,
                background: card, color: text, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                <option value="admin">Admin</option>
                <option value="viewer">Viewer</option>
              </select>
              <div style={{ marginTop: 6, fontSize: 11, color: role === "admin" ? "#6366f1" : "#f59e0b", fontWeight: 600 }}>
                {role === "admin" ? "✓ Full access" : "👁 View only"}
              </div>
            </div>

            {/* Dark mode toggle */}
            <button onClick={() => setDarkMode(d => !d)} style={{
              width: "100%", padding: "9px", borderRadius: 10, border: `1px solid ${border}`,
              background: "transparent", color: text, fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "28px 32px", overflowX: "auto" }}>
          {/* ── Dashboard Tab ── */}
          {activeTab === "dashboard" && (
            <div>
              {budgetExceeded && (
                <div style={{
                  background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 12, padding: "16px 20px",
                  marginBottom: 24, display: "flex", alignItems: "center", gap: 12
                }}>
                  <span style={{ fontSize: 20 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Budget Exceeded!</div>
                    <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>Your monthly spending has exceeded the budget by {fmt(currentMonthExpenses - budget)}</div>
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: text, letterSpacing: -0.5 }}>Dashboard</h1>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 14 }}>March 2026 Overview</p>
              </div>

              {/* Summary cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
                <SummaryCard label="Net Balance" value={fmtShort(summaries.balance)} sub="Mar 2026" accent="#6366f1" icon="💰" />
                <SummaryCard label="Total Income" value={fmtShort(summaries.income)} sub="This month" accent="#22c55e" icon="↑" />
                <SummaryCard label="Total Expenses" value={fmtShort(summaries.expenses)} sub="This month" accent="#ef4444" icon="↓" />
                <SummaryCard label="Savings Rate" value={`${insights.savingsRate}%`} sub="Income saved" accent="#f59e0b" icon="🎯" />
              </div>

              {/* Charts row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
                {/* Balance Trend */}
                <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: text }}>Balance Trend</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 12, color: muted }}>Last 6 months</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={MONTHLY_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: muted }} />
                      <YAxis tickFormatter={v => `₹${v / 1000}K`} tick={{ fontSize: 11, fill: muted }} />
                      <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 10, fontSize: 13 }} />
                      <Line type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: "#6366f1", r: 4 }} name="Balance" />
                      <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 2" dot={false} name="Income" />
                      <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 2" dot={false} name="Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Income vs Expenses Bar */}
                <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: text }}>Income vs Expenses</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 12, color: muted }}>Monthly comparison</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={MONTHLY_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: muted }} />
                      <YAxis tickFormatter={v => `₹${v / 1000}K`} tick={{ fontSize: 11, fill: muted }} />
                      <Tooltip formatter={(v, n) => [fmt(v), n]} contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 10, fontSize: 13 }} />
                      <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} name="Income" />
                      <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spending breakdown */}
              <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
                <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: text }}>Spending by Category</h3>
                <p style={{ margin: "0 0 16px", fontSize: 12, color: muted }}>March 2026</p>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <ResponsiveContainer width={220} height={220}>
                    <PieChart>
                      <Pie data={spendByCategory} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                        {spendByCategory.map((entry) => (
                          <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#94a3b8"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 10, fontSize: 13 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                    {spendByCategory.map(item => (
                      <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ width: 10, height: 10, borderRadius: 3, background: CATEGORY_COLORS[item.name], flexShrink: 0 }}></span>
                        <span style={{ fontSize: 13, color: text, flex: 1 }}>{item.name}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: muted }}>{fmt(item.value)}</span>
                        <div style={{ width: 80, height: 6, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{ width: `${(item.value / spendByCategory[0].value * 100).toFixed(0)}%`, height: "100%", background: CATEGORY_COLORS[item.name], borderRadius: 3 }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Transactions Tab ── */}
          {activeTab === "transactions" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: text, letterSpacing: -0.5 }}>Transactions</h1>
                  <p style={{ margin: "4px 0 0", color: muted, fontSize: 14 }}>{filteredTx.length} of {transactions.length} transactions</p>
                </div>
                {isAdmin && (
                  <button onClick={() => setModal("new")} style={{
                    padding: "10px 20px", background: "#6366f1", color: "#fff", border: "none",
                    borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>+ Add Transaction</button>
                )}
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <input placeholder="🔍 Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ flex: 1, minWidth: 200, padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 14, outline: "none" }} />
                <input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 13, cursor: "pointer" }} title="Start Date" />
                <input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 13, cursor: "pointer" }} title="End Date" />
                <select value={filterType} onChange={e => setFilterType(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 13, cursor: "pointer" }}>
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 13, cursor: "pointer" }}>
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, color: text, fontSize: 13, cursor: "pointer" }}>
                  <option value="date-desc">Date ↓</option>
                  <option value="date-asc">Date ↑</option>
                  <option value="amount-desc">Amount ↓</option>
                  <option value="amount-asc">Amount ↑</option>
                </select>
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowExportMenu(!showExportMenu)} style={{
                    padding: "10px 14px", background: "#10b981", color: "#fff", border: "none",
                    borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer"
                  }}>📥 Export</button>
                  {showExportMenu && (
                    <div style={{
                      position: "absolute", top: "100%", right: 0, background: card, border: `1px solid ${border}`,
                      borderRadius: 10, marginTop: 4, zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}>
                      <button onClick={exportToCSV} style={{
                        display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent",
                        border: "none", cursor: "pointer", fontSize: 13, color: text, fontWeight: 500, borderBottom: `1px solid ${border}`
                      }}>📊 CSV</button>
                      <button onClick={exportToJSON} style={{
                        display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "transparent",
                        border: "none", cursor: "pointer", fontSize: 13, color: text, fontWeight: 500
                      }}>📄 JSON</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              {filteredTx.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: muted }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>No transactions found</div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>Try adjusting your filters</div>
                </div>
              ) : (
                <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, overflow: "hidden" }}>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: darkMode ? "#0f172a" : "#f8fafc" }}>
                          {["Date", "Description", "Category", "Type", "Amount", ...(isAdmin ? ["Actions"] : [])].map(h => (
                            <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: muted, letterSpacing: 0.5, borderBottom: `1px solid ${border}` }}>{h.toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTx.map((t, i) => (
                          <tr key={t.id} style={{ borderBottom: `1px solid ${border}`, background: i % 2 === 0 ? "transparent" : (darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)") }}>
                            <td style={{ padding: "13px 16px", fontSize: 13, color: muted }}>{t.date}</td>
                            <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600, color: text }}>{t.description}</td>
                            <td style={{ padding: "13px 16px" }}><CategoryBadge cat={t.category} /></td>
                            <td style={{ padding: "13px 16px" }}><Badge type={t.type} /></td>
                            <td style={{ padding: "13px 16px", fontSize: 15, fontWeight: 700, color: t.type === "income" ? "#16a34a" : "#dc2626" }}>
                              {t.type === "income" ? "+" : "-"}{fmt(t.amount)}
                            </td>
                            {isAdmin && (
                              <td style={{ padding: "13px 16px" }}>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <button onClick={() => setModal(t)} style={{ padding: "5px 12px", borderRadius: 8, border: `1px solid ${border}`, background: "transparent", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                                  <button onClick={() => handleDelete(t.id)} style={{ padding: "5px 12px", borderRadius: 8, border: "1px solid #fecaca", background: "transparent", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Delete</button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Insights Tab ── */}
          {activeTab === "insights" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: text, letterSpacing: -0.5 }}>Insights</h1>
                <p style={{ margin: "4px 0 0", color: muted, fontSize: 14 }}>Spending patterns & analysis</p>
              </div>

              {/* Key Insight Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 28 }}>
                {[
                  {
                    icon: "🏆", label: "Top Spending Category", title: insights.topCat?.name || "-",
                    sub: `${fmt(insights.topCat?.value || 0)} spent in March`, accent: "#ef4444", bg: "#fef2f2"
                  },
                  {
                    icon: "📅", label: "Month-over-Month", title: insights.mar < insights.feb ? "↓ Down" : "↑ Up",
                    sub: `${insights.mar < insights.feb ? "Saved" : "Spent"} ${fmt(Math.abs(insights.mar - insights.feb))} vs Feb`, accent: insights.mar < insights.feb ? "#22c55e" : "#ef4444",
                    bg: insights.mar < insights.feb ? "#f0fdf4" : "#fef2f2"
                  },
                  {
                    icon: "💰", label: "Savings Rate", title: `${insights.savingsRate}%`,
                    sub: `You saved ${fmt(summaries.balance)} this month`, accent: "#6366f1", bg: "#eef2ff"
                  },
                  {
                    icon: "📊", label: "Avg Daily Expense", title: fmt(Math.round(summaries.expenses / 31)),
                    sub: "Per day in March", accent: "#f59e0b", bg: "#fffbeb"
                  },
                ].map((item, i) => (
                  <div key={i} style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 22, borderLeft: `4px solid ${item.accent}` }}>
                    <div style={{ fontSize: 24, marginBottom: 10 }}>{item.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: muted, letterSpacing: 0.3, marginBottom: 4 }}>{item.label.toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: item.accent, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: muted }}>{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Category breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: text }}>Category Breakdown</h3>
                  {spendByCategory.map((item, i) => {
                    const pct = ((item.value / summaries.expenses) * 100).toFixed(1);
                    return (
                      <div key={item.name} style={{ marginBottom: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 13, color: text, fontWeight: 500 }}>{item.name}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: muted }}>{pct}%</span>
                        </div>
                        <div style={{ height: 8, background: darkMode ? "#334155" : "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: CATEGORY_COLORS[item.name], borderRadius: 4, transition: "width 0.4s" }}></div>
                        </div>
                        <div style={{ fontSize: 11, color: muted, marginTop: 3 }}>{fmt(item.value)}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly comparison chart */}
                <div style={{ background: card, borderRadius: 16, border: `1px solid ${border}`, padding: 24 }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: text }}>Savings Trend</h3>
                  <p style={{ margin: "0 0 16px", fontSize: 12, color: muted }}>Monthly savings over 6 months</p>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={MONTHLY_TREND}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: muted }} />
                      <YAxis tickFormatter={v => `₹${v / 1000}K`} tick={{ fontSize: 11, fill: muted }} />
                      <Tooltip formatter={(v) => [fmt(v), "Savings"]} contentStyle={{ background: card, border: `1px solid ${border}`, borderRadius: 10, fontSize: 13 }} />
                      <Bar dataKey="balance" fill="#6366f1" radius={[6, 6, 0, 0]} name="Net Savings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {modal && (
        <TransactionModal
          tx={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "20px 24px",
        borderTop: `1px solid ${border}`,
        background: card,
        color: muted,
        fontSize: 13,
        fontWeight: 500,
        marginTop: "auto"
      }}>
        © 2026 made by Vanka Nikhil with ❤️
      </footer>
    </div>
  );
}
