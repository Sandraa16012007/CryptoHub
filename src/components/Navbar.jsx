import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLock, FiUser, FiLogOut, FiMail } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
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

  /* Scroll Effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
      if (!e.target.closest(".profile-menu-container")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const toggleMobileMenu = () =>
    setIsMobileMenuOpen((prev) => !prev);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownClick = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
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
    {
      label: "More",
      dropdown: [
        { to: "/contributors", label: "Contributors" },
        { to: "/contactus", label: "Contact Us" },
        { to: "/faq", label: "FAQ" },
      ],
    },
  ];

  const linksToRender = currentUser
    ? [...navLinks, { to: "/dashboard", label: "Dashboard" }]
    : navLinks;

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
                className="navbar-item dropdown-container"
              >
                {link.dropdown ? (
                  <>
                    <button
                      className="navbar-link"
                      onClick={() =>
                        handleDropdownClick(link.label)
                      }
                    >
                      {link.label}
                    </button>

                    {openDropdown === link.label && (
                      <ul className="dropdown-menu">
                        {link.dropdown.map((item) => (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              onClick={closeMobileMenu}
                            >
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
                    className={`navbar-link ${
                      location.pathname === link.to
                        ? "active"
                        : ""
                    }`}
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

          {currentUser ? (
            <div className="profile-menu-container">
              <button
                className="profile-btn"
                onClick={() =>
                  setIsProfileOpen(!isProfileOpen)
                }
              >
                <FiUser />
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-email">
                    <FiMail />
                    {currentUser.email}
                  </div>

                  {isEmailProvider() && (
                    <Link to="/change-password">
                      <FiLock /> Change Password
                    </Link>
                  )}

                  <button onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="navbar-btn login">
                Login
              </Link>
              <Link to="/signup" className="navbar-btn signup">
                Get Started
              </Link>
            </>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="navbar-toggle"
            onClick={toggleMobileMenu}
          >
            ☰
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
