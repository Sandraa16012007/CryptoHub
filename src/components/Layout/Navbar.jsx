import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiUser, FiLogOut, FiMail, FiBookmark } from "react-icons/fi";
import ThemeToggle from "../ThemeToggle";
import "./Navbar.css";

function Navbar() {
  const { currentUser, logout, isEmailProvider } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isDashboardPage = location.pathname === "/dashboard";

  /* -------------------- Effects -------------------- */

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openDropdown && !e.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
      if (isProfileOpen && !e.target.closest(".profile-menu-container")) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenDropdown(null);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [openDropdown, isProfileOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    setOpenDropdown(null);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownClick = (label) => {
    if (window.innerWidth <= 1024) {
      setOpenDropdown(openDropdown === label ? null : label);
    }
  };

  const handleMouseEnter = (label) => {
    if (window.innerWidth > 1024) {
      setOpenDropdown(label);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 1024) {
      setOpenDropdown(null);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  }, [logout, navigate]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/blog", label: "Insights" },
    { to: "/features", label: "Features" },
    { to: "/new-listings", label: "New Listings" },
    {
      label: "More",
      dropdown: [
        { to: "/about", label: "About" },
        { to: "/contributors", label: "Contributors" },
        { to: "/contactus", label: "Contact Us" },
        { to: "/faq", label: "FAQ" },
      ],
    },
  ];

  const authenticatedNavLinks = [
    ...navLinks,
    { to: "/dashboard", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const linksToRender = currentUser ? authenticatedNavLinks : navLinks;

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* LEFT - LOGO */}
        <Link to="/" className="navbar-logo">
          <img src="/crypto-logo.png" alt="CryptoHub" />
          <span>CryptoHub</span>
        </Link>

        {/* CENTER - LINKS */}
        {!isDashboardPage && (
          <ul className="navbar-menu">
            {linksToRender.map((link) => (
              <li
                key={link.label}
                className={`navbar-item ${link.dropdown ? "dropdown-container" : ""}`}
                onMouseEnter={() => handleMouseEnter(link.label)}
                onMouseLeave={handleMouseLeave}
              >
                {link.dropdown ? (
                  <>
                    <span
                      className={`navbar-link dropdown-trigger ${openDropdown === link.label ? "active" : ""}`}
                      onClick={() => handleDropdownClick(link.label)}
                      role="button"
                      tabIndex={0}
                    >
                      {link.label}
                    </span>
                    <ul
                      className={`dropdown-menu ${openDropdown === link.label ? "show" : ""}`}
                    >
                      {link.dropdown.map((item) => (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            className="dropdown-link"
                            onClick={closeMobileMenu}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}

        {/* RIGHT - ACTIONS */}
        <div className="navbar-actions">
          <ThemeToggle />

          <div className="desktop-auth">
            {currentUser ? (
              <div className="profile-menu-container">
                <button
                  className="profile-icon-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="User profile menu"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <FiUser />
                  )}
                </button>

                <div
                  className={`profile-dropdown ${isProfileOpen ? "show" : ""}`}
                >
                  <div className="profile-dropdown-header">
                    <FiMail className="profile-icon" />
                    <span className="profile-email">{currentUser.email}</span>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <div className="profile-dropdown-items">
                    {isEmailProvider() && (
                      <Link
                        to="/change-password"
                        className="profile-dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiLock />
                        <span>Change Password</span>
                      </Link>
                    )}
                    <Link
                      to="/saved-insights"
                      className="profile-dropdown-item"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiBookmark />
                      <span>Saved Insights</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="profile-dropdown-item logout-item"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="navbar-btn navbar-btn-login">
                  LOGIN
                </Link>
                <Link to="/signup" className="navbar-btn navbar-btn-signup">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            className={`navbar-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && !isDashboardPage && (
        <div className="mobile-menu">
          <ul className="mobile-menu-list">
            {linksToRender.map((link) => (
              <li key={link.label} className="mobile-menu-item">
                {link.dropdown ? (
                  <>
                    <button
                      className="navbar-link"
                      onClick={() => handleDropdownClick(link.label)}
                    >
                      {link.label}
                    </button>
                    {openDropdown === link.label && (
                      <ul className="dropdown-menu">
                        {link.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link to={item.to} onClick={closeMobileMenu}>
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
