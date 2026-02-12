import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const getFirstName = () => {
    if (currentUser?.fullName) {
      return currentUser.fullName.split(" ")[0];
    }
    return currentUser?.email?.split("@")[0] || "User";
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
      alert("Failed to log out. Please try again.");
    }
  }, [logout, navigate]);

  const navigationItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: "Home",
      path: "/"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: "Dashboard",
      path: "/dashboard",
      active: true
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      label: "Leaderboard",
      path: "/leaderboard"
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      label: "Blog",
      path: "/blog"
    },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--dashboard-bg-primary)] transition-colors duration-300">
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen transition-all duration-300 z-50 ${sidebarOpen ? "w-72" : "w-0 lg:w-20"
          } overflow-hidden bg-[var(--dashboard-bg-elevated)] border-r border-[var(--dashboard-border-subtle)] backdrop-blur-2xl shadow-2xl`}
      >
        <div className="flex flex-col h-full p-5">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90" style={{ textDecoration: 'none' }}>
                <img
                  src="/crypto-logo.png"
                  alt="CryptoHub"
                  className="h-10 w-10 rounded-full object-cover border-2 border-[rgba(0,217,255,0.3)] shadow-lg transition-all duration-300 hover:scale-110"
                />
                <h1 className="text-xl font-extrabold text-[#00d9ff] hover:text-[#00f3ff] transition-colors duration-200" style={{ margin: 0 }}>
                  CryptoHub
                </h1>
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2.5 rounded-lg transition-all duration-200 hover:bg-[var(--dashboard-border-hover)] text-[var(--dashboard-text-secondary)]"
            >
              <span className="text-lg">
                {sidebarOpen ? "◀" : "▶"}
              </span>
            </button>
          </div>

          {sidebarOpen && (
            <div className="mb-6 p-4 rounded-xl border transition-all duration-200 bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-medium)] hover:border-[var(--dashboard-border-hover)]">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00d9ff] to-[#00a8cc] flex items-center justify-center text-2xl font-bold shadow-lg ring-4 ring-[rgba(0,217,255,0.12)] text-[#0a0a1a]">
                  {getFirstName().charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate text-base text-[var(--dashboard-text-primary)]">
                    {getFirstName()}
                  </p>
                  <p className="text-xs truncate text-[var(--dashboard-text-muted)]">
                    {currentUser?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1.5">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium ${item.active
                  ? "bg-[var(--dashboard-accent-cyan-dim)] text-[var(--dashboard-accent-cyan)] border border-[var(--dashboard-border-active)]"
                  : "text-[var(--dashboard-text-secondary)] hover:bg-[var(--dashboard-border-subtle)] hover:text-[var(--dashboard-accent-cyan)]"
                  } ${!sidebarOpen && "justify-center"}`}
              >
                <span className={sidebarOpen ? "" : ""}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {sidebarOpen && (
            <div className={`mt-auto space-y-3`}>
              {/* Theme Toggle Section */}
              <div className="p-3 rounded-xl border bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-subtle)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--dashboard-text-secondary)]">
                    Theme
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 bg-[var(--dashboard-bg-elevated)] hover:bg-[var(--dashboard-border-subtle)] text-[var(--dashboard-text-primary)] border border-[var(--dashboard-border-medium)]"
                >
                  <span className="text-lg">{isDark ? "🌙" : "☀️"}</span>
                  <span className="flex-1 text-left font-medium">{isDark ? "Dark" : "Light"}</span>
                  <span className="text-sm opacity-70">Toggle</span>
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium border ${isDark
                  ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-600/30 hover:border-red-500/50'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Collapsed State Logout Icon */}
          {!sidebarOpen && (
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-200 border ${isDark
                ? 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border-red-600/30 hover:border-red-500/50'
                : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          )}
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 overflow-auto">
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden mb-6 p-3 rounded-xl transition-all duration-200 bg-[var(--dashboard-bg-elevated)] hover:bg-[var(--dashboard-border-subtle)] border border-[var(--dashboard-border-medium)]"
          >
            <span className="text-2xl text-[var(--dashboard-text-primary)]">☰</span>
          </button>

          <div className="mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight">
              <span className="bg-gradient-to-r from-[#00d9ff] to-[#00a8cc] bg-clip-text text-transparent">
                {greeting}, {getFirstName()}!
              </span>
              <svg className="inline-block ml-3 w-12 h-12 text-[#00d9ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </h1>
            <p className="text-lg text-[var(--dashboard-text-secondary)]">
              Welcome back to your crypto dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-2 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-[var(--dashboard-bg-card)] border-[var(--dashboard-border-subtle)] shadow-[var(--dashboard-shadow-md)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--dashboard-accent-cyan-dim)] border border-[var(--dashboard-accent-cyan-hover)] flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-[var(--dashboard-accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--dashboard-text-primary)]">
                  Portfolio Overview
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border transition-all duration-200 hover:scale-105 bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-subtle)]">
                  <p className="text-sm mb-2 text-[var(--dashboard-text-muted)]">Total Value</p>
                  <p className="text-3xl font-bold text-[var(--dashboard-text-primary)]">$0.00</p>
                </div>
                <div className="p-5 rounded-xl border transition-all duration-200 hover:scale-105 bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-subtle)]">
                  <p className="text-sm mb-2 text-[var(--dashboard-text-muted)]">Assets</p>
                  <p className="text-3xl font-bold text-[var(--dashboard-text-primary)]">0</p>
                </div>
                <div className="p-5 rounded-xl border transition-all duration-200 hover:scale-105 bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-subtle)]">
                  <p className="text-sm mb-2 text-[var(--dashboard-text-muted)]">24h Profit</p>
                  <p className="text-3xl font-bold text-green-400">+0.00%</p>
                </div>
                <div className="p-5 rounded-xl border transition-all duration-200 hover:scale-105 bg-[var(--dashboard-bg-secondary)] border-[var(--dashboard-border-subtle)]">
                  <p className="text-sm mb-2 text-[var(--dashboard-text-muted)]">Watchlist</p>
                  <p className="text-3xl font-bold text-[var(--dashboard-text-primary)]">0</p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-1 rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-[var(--dashboard-bg-card)] border-[var(--dashboard-border-subtle)] shadow-[var(--dashboard-shadow-md)]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[var(--dashboard-accent-cyan-dim)] border border-[var(--dashboard-accent-cyan-hover)] flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-[var(--dashboard-accent-cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[var(--dashboard-text-primary)]">
                  Account
                </h2>
              </div>
              <div className="space-y-4">
                <div className="pb-4 border-b border-[var(--dashboard-border-medium)]">
                  <p className="text-sm mb-1 text-[var(--dashboard-text-muted)]">Email</p>
                  <p className="font-semibold truncate text-[var(--dashboard-text-secondary)]">
                    {currentUser?.email}
                  </p>
                </div>
                <div className="pb-4 border-b border-[var(--dashboard-border-medium)]">
                  <p className="text-sm mb-1 text-[var(--dashboard-text-muted)]">Status</p>
                  <span className="inline-flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1.5 rounded-lg text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Active
                  </span>
                </div>
                <div className="pb-4 border-b border-[var(--dashboard-border-medium)]">
                  <p className="text-sm mb-1 text-[var(--dashboard-text-muted)]">Member Since</p>
                  <p className="font-semibold text-[var(--dashboard-text-secondary)]">
                    {currentUser?.metadata?.creationTime
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : "N/A"}
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/change-password')}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 font-medium border bg-[var(--dashboard-accent-cyan-dim)] hover:bg-[var(--dashboard-accent-cyan-hover)] text-[var(--dashboard-accent-cyan)] border-[var(--dashboard-border-hover)] hover:border-[var(--dashboard-border-active)]"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <span>Change Password</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
