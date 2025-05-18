import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const chevronDown = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)'; // centralized text color

const dropdownData: Record<string, string[]> = {
  'Browse Services': [
    'All Services',
    'Travel Clinic',
    'Private Treatments',
    'NHS Treatments',
    'Pharmacy First'
  ],
  'NHS Services': [
    'NHS Services',
    'NHS Repeat Prescriptions',
    'Delivery Service'
  ],
  'Weight Loss': [
    'Wegovy',
    'Mounjaro'
  ],
  'Travel Vaccinations': [
    'Cholera',
    'Diphtheria, Tetanus & Polio',
    'Rabies',
    'Hepatitis A',
    'Hepatitis B',
    'Japanese Encephalitis',
    'Tick-borne Encephalitis',
    'Meningitis ACWY and Meningitis B',
    'Typhoid',
    'Mumps, Measles, and Rubella (MMR)',
    'Yellow Fever Vaccination'
  ]
};

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  return (
    <div style={{ fontFamily: '"proxima-nova", "Inter", "Helvetica Neue", Arial, sans-serif' }}>
      {/* Top Header */}
      <div style={{ position: 'fixed', top: 0, width: '100%', background: 'white', zIndex: 999, borderBottom: '1px solid #ccc' }}>
        <div className="container d-flex justify-content-between align-items-center py-2">
          <img
            src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
            alt="Logo"
            style={{ height: 40, border: 'none', outline: 'none' }}
          />
          <div className="d-flex align-items-center">
            <a
              href="mailto:coleshillpharmacy@nhs.com"
              className="me-4 text-decoration-none"
              style={{ color: MAIN_TEXT_COLOR }}
            >
              📧 coleshillpharmacy@nhs.com
            </a>
            <a
              href="tel:01634404142"
              className="text-decoration-none"
              style={{ color: MAIN_TEXT_COLOR }}
            >
              📞 01634 404142
            </a>
          </div>
        </div>

        {/* Second Nav Bar */}
        <div className="bg-light border-top" style={{ height: '50px' }}>
          <div className="container d-flex justify-content-between align-items-center h-100">
            <div className="d-flex align-items-center flex-nowrap overflow-auto">
              {['Browse Services', 'NHS Services', 'Weight Loss', 'Travel Vaccinations'].map(label => (
                <button
                  key={label}
                  onClick={() => toggleMenu(label)}
                  className="btn btn-link text-decoration-none d-flex align-items-center me-1 p-0"
                  style={{
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: MAIN_TEXT_COLOR
                  }}
                >
                  {label}
                  <img
                    src={chevronDown}
                    alt="chevron"
                    style={{
                      width: 22,
                      height: 22,
                      marginLeft: 6,
                      transition: 'transform 0.3s ease',
                      transform: activeMenu === label ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
              ))}
              <span
                className="me-1"
                style={{
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  color: MAIN_TEXT_COLOR
                }}
              >
                Blog
              </span>
              <span
                className="me-1"
                style={{
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  marginLeft: '40px',
                  color: MAIN_TEXT_COLOR
                }}
              >
                Contact
              </span>
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: 'rgb(80, 248, 228)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                padding: '4px 10px',
                marginLeft: '60px',
                whiteSpace: 'nowrap'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Side Panel */}
      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            top: 100,
            left: 0,
            width: '270px',
            background: '#fff',
            borderRight: '1px solid #ccc',
            zIndex: 998,
            paddingTop: '1rem',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <ul className="list-unstyled ps-3 pe-3">
            {dropdownData[activeMenu].map((item, index) => (
              <li
                key={index}
                className="py-2 border-bottom d-flex justify-content-between align-items-center"
                style={{ color: MAIN_TEXT_COLOR, cursor: 'pointer' }}
                onClick={() => {
                  if (item === 'All Services') {
                    navigate('/services');
                    setActiveMenu(null); // close dropdown
                  }
                  // Add more redirects if needed for other items
                }}
              >
                {item}
                <img
                  src={chevronDown}
                  alt="arrow"
                  style={{
                    width: 22,
                    height: 22,
                    marginLeft: 6,
                    transform: 'rotate(-90deg)'
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
