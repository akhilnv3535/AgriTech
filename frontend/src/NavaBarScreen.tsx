import React, { useState } from 'react';
import { Menu, X, ChevronDown, Leaf, Phone, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    {
      name: 'Products',
      href: '#products',
      dropdown: [
        'Precision Agriculture',
        'IoT Sensors',
        'Farm Management Software',
        'Crop Analytics',
        'Irrigation Systems',
        'Weather Forecasting'
      ]
    },
    {
      name: 'Services',
      href: '#services',
      dropdown: [
        'Consulting & Advisory',
        'Installation & Setup',
        'Training & Support',
        'Data Analysis',
        'Custom Development'
      ]
    },
    {
      name: 'Technology',
      href: '#technology',
      dropdown: [
        'AI/ML Applications',
        'Drone Technology',
        'Satellite Imagery',
        'Smart Equipment',
        'Data Analytics'
      ]
    },
    {
      name: 'Industries',
      href: '#industries',
      dropdown: [
        'Crop Farming',
        'Livestock Management',
        'Greenhouse Operations',
        'Organic Farming',
        'Large-scale Agriculture'
      ]
    },
    {
      name: 'Resources',
      href: '#resources',
      dropdown: [
        'Blog & News',
        'Case Studies',
        'White Papers',
        'Research Reports',
        'Webinars',
        'Documentation'
      ]
    },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const styles = {
    navbar: {
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    topBar: {
      backgroundColor: '#16a34a',
      color: 'white',
      padding: '8px 16px',
      fontSize: '14px'
    },
    topBarContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    contactInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    mainNav: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginLeft: '8px'
    },
    desktopNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    navItem: {
      position: 'relative',
      display: 'inline-block'
    },
    navButton: {
      color: '#374151',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },
    dropdown: {
      position: 'absolute',
      left: 0,
      top: '100%',
      marginTop: '8px',
      width: '240px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      opacity: 0,
      visibility: 'hidden',
      transition: 'all 0.2s',
      zIndex: 50
    },
    dropdownVisible: {
      opacity: 1,
      visibility: 'visible'
    },
    dropdownItem: {
      padding: '12px 16px',
      color: '#374151',
      textDecoration: 'none',
      display: 'block',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    mobileMenuButton: {
      display: 'none',
      color: '#374151',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '8px'
    },
    mobileMenu: {
      display: 'none',
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '16px'
    },
    mobileMenuVisible: {
      display: 'block'
    },
    mobileNavItem: {
      padding: '12px 0',
      borderBottom: '1px solid #f3f4f6'
    },
    mobileNavButton: {
      width: '100%',
      textAlign: 'left',
      color: '#374151',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    mobileDropdown: {
      paddingLeft: '16px',
      paddingTop: '8px'
    },
    mobileDropdownItem: {
      padding: '8px 0',
      color: '#6b7280',
      textDecoration: 'none',
      display: 'block',
      fontSize: '14px'
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Top bar with contact info */}
      <div style={styles.topBar}>
        <div style={styles.topBarContainer}>
          <div style={styles.contactInfo}>
            <div style={styles.contactItem}>
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div style={styles.contactItem}>
              <Mail size={16} />
              <span>info@agritech.com</span>
            </div>
          </div>
          <div>
            Transforming Agriculture with Technology
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div style={styles.mainNav}>
        <div style={styles.navContainer}>
          {/* Logo */}
          <div style={styles.logo}>
            <Leaf size={32} color="#16a34a" />
            <span style={styles.logoText}>AgriTech</span>
          </div>

          {/* Desktop Navigation */}
          <div style={{...styles.desktopNav, display: 'flex'}}>
            {navItems.map((item) => (
              <div 
                key={item.name} 
                style={styles.navItem}
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => item.dropdown && setActiveDropdown(null)}
              >
                <button
                  style={styles.navButton}
                  onClick={() => item.dropdown && toggleDropdown(item.name)}
                  onMouseEnter={(e) => e.target.style.color = '#16a34a'}
                  onMouseLeave={(e) => e.target.style.color = '#374151'}
                >
                  {item.name}
                  {item.dropdown && (
                    <ChevronDown size={16} style={{marginLeft: '4px'}} />
                  )}
                </button>
                
                {/* Dropdown menu */}
                {item.dropdown && (
                  <div style={{
                    ...styles.dropdown,
                    ...(activeDropdown === item.name ? styles.dropdownVisible : {})
                  }}>
                    <div style={{padding: '8px 0'}}>
                      {item.dropdown.map((subItem) => (
                        <a
                          key={subItem}
                          href={`#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                          style={styles.dropdownItem}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            style={{
              ...styles.mobileMenuButton,
              display: 'block'
            }}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div style={{
          ...styles.mobileMenu,
          ...(isMenuOpen ? styles.mobileMenuVisible : {})
        }}>
          {navItems.map((item) => (
            <div key={item.name} style={styles.mobileNavItem}>
              <button
                style={styles.mobileNavButton}
                onClick={() => item.dropdown && toggleDropdown(item.name)}
              >
                {item.name}
                {item.dropdown && (
                  <ChevronDown 
                    size={16} 
                    style={{
                      transform: activeDropdown === item.name ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  />
                )}
              </button>
              
              {/* Mobile dropdown */}
              {item.dropdown && activeDropdown === item.name && (
                <div style={styles.mobileDropdown}>
                  {item.dropdown.map((subItem) => (
                    <a
                      key={subItem}
                      href={`#${subItem.toLowerCase().replace(/\s+/g, '-')}`}
                      style={styles.mobileDropdownItem}
                    >
                      {subItem}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;