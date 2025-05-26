
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderDesktop.css';

const chevronDown =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)'; // #1C2B39

// Top‐level menus
const dropdownData: Record<string, string[]> = {
  'Browse Services': [
    'All Services',
    'Travel Clinic',
    'Private Treatments',
    'NHS Treatments',
    'Pharmacy First',
  ],
  'NHS Services': ['NHS Services', 'NHS Repeat Prescriptions', 'Delivery Service'],
  'Weight Loss': ['Wegovy', 'Mounjaro'],
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
    'Yellow Fever Vaccination',
  ],
};

// Second‐level for “Browse Services”
const browseSubMenuData: Record<string, string[]> = {
  'Private Treatments': [
    'Microsuction Earwax Removal',
    'Weight Loss Clinic',
    'Private Flu Jab',
    'Period Delay',
    'Altitude Sickness',
    'Vitamin B12 Injection',
    'Hair Loss',
    'Chickenpox Vaccine',
    'Erectile Dysfunction',
  ],
  'NHS Treatments': [
    'Blood Pressure Check',
    'Emergency Contraception',
    'Flu Vaccination',
    'COVID-19 Vaccination',
  ],
  'Pharmacy First': [
    'Sinusitis',
    'Sore Throat',
    'Earache',
    'Infected Insect Bite',
    'Impetigo',
    'Shingles',
    'Uncomplicated UTI (Women)',
  ],
};

// slugify for routes
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [browseSelection, setBrowseSelection] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMenu = (menu: string) => {
    setBrowseSelection(null);
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  return (
    <header
      className="fixed-top bg-white mt-0"
      style={{
        fontFamily: 'Work Sans, Arial, sans-serif',
        fontWeight: 500,
        fontSize: '1rem',
        zIndex: 999,
      }}
    >
      {/* ===== Fixed top bar ===== */}
      <div className="_top-bar-wrapper__Y25dN container d-flex justify-content-between align-items-center">
        <img
          src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
          alt="Logo"
          style={{ height: 40 }}
        />
        <div className="d-flex align-items-center">
          <a
            href="mailto:coleshillpharmacy@nhs.com"
            className="me-4 text-decoration-none"
            style={{ color: MAIN_TEXT_COLOR }}
          >
            📧 coleshillpharmacy@nhs.com
          </a>
          <button
  className="mobile-call-btn"
  onClick={() => window.location.href = 'tel:01634404142'}
  aria-label="Call us"
>
  📞
</button>
        </div>
      </div>

      {/* ===== Nav bar ===== */}
      <div className="bg-light border-top border-bottom" style={{ height: '55px' }}>
        <div
          className="container-fluid px-0 d-flex justify-content-between align-items-center h-100"
          style={{
            fontFamily: 'Work Sans, Arial, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
          }}
        >
          {/* ← container-fluid + px-0 removes all left padding */}
          <div
            className="d-flex align-items-center flex-nowrap overflow-auto ps-5"
            style={{ fontSize: '1rem' }}
          >
            {[
              'Browse Services',
              'NHS Services',
              'Weight Loss',
              'Travel Vaccinations',
            ].map(label => (
              <button
                key={label}
                onClick={() => toggleMenu(label)}
                className="d-flex align-items-center me-1 p-3"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  marginLeft: -40,
                  marginRight: 0,
                  fontWeight: 500,
                  color: MAIN_TEXT_COLOR,
                  cursor: 'pointer',
                }}
              >
                {label}
                <img
                  src={chevronDown}
                  alt=""
                  style={{
                    width: 20,
                    marginLeft: 9,
                    transform: activeMenu === label ? 'rotate(180deg)' : undefined,
                    transition: 'transform 0.3s',
                  }}
                />
              </button>
            ))}

            <span
              className="me-3"
              style={{
                fontSize: '1rem',
                cursor: 'pointer',
                color: MAIN_TEXT_COLOR,
                padding: '8px 12px',
              }}
            >
              Blog
            </span>
            <span
              className="me-3"
              style={{
                fontSize: '1rem',
                cursor: 'pointer',
                color: MAIN_TEXT_COLOR,
                padding: '8px 28px',
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
              fontSize: '1rem',
              marginRight: 200,
              padding: '8px 18px',
            }}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* ===== Dropdown Overlay ===== */}
      {activeMenu && (
        <>
          {/* backdrop */}
          <div
            onClick={() => {
              setActiveMenu(null);
              setBrowseSelection(null);
            }}
            style={{
              position: 'fixed',
              top: 'calc(3.9rem + 55px)', // account for top-bar padding + nav height
              left: 0,
              width: '100%',
              height: `calc(100vh - ${2.5 /*rem*/ * 16}px - 75px)`,
              background: 'rgba(0,0,0,0.3)',
              zIndex: 997,
            }}
          />

          {/* panel */}
          <div
            style={{
              position: 'fixed',
              marginTop: 21,
              top: 'calc(2.5rem + 55px)',
              left: 0,
              width: '100%',
              height: `calc(100vh - ${2.5 /*rem*/ * 16}px - 55px)`,
              background: '#fff',
              zIndex: 998,
              overflowY: 'auto',
              padding: '2rem',
            }}
          >
            {activeMenu === 'Browse Services' ? (
              <div style={{ display: 'flex', marginTop: -20 }}>
                {/* First level */}
                <ul className="list-unstyled ps-0 me-4" style={{ minWidth: 200 }}>
                  {dropdownData['Browse Services'].map((item, idx) => (
                    <li
                      key={idx}
                      className="py-3 px-5 d-flex justify-content-between align-items-center"
                      style={{
                        color: MAIN_TEXT_COLOR,
                        cursor: 'pointer',
                        opacity:
                          browseSelection && browseSelection !== item ? 0.5 : 1,
                        fontWeight:
                          browseSelection === item ? 700 : 500,
                      }}
                      onClick={() => {
                        if (item === 'All Services') {
                          navigate('/services');
                          setActiveMenu(null);
                        } else if (item === 'Travel Clinic') {
                          navigate('/travel-clinic');
                          setActiveMenu(null);
                        } else {
                          setBrowseSelection(item);
                        }
                      }}
                    >
                      {item}
                      <img
                        src={chevronDown}
                        alt=""
                        style={{ width: 20, marginLeft: 240, marginRight: -30, transform: 'rotate(-90deg)' }}
                      />
                    </li>
                  ))}
                </ul>

                {/* Second level */}
                {browseSelection && (
                  <ul
                    className="list-unstyled ps-0 border-start border-end"
                    style={{ flex: 1, paddingLeft: '1rem' }}
                  >
                    {browseSubMenuData[browseSelection].map((sub, idx) => (
                      <li
                        key={idx}
                        className="py-3 px-4 d-flex justify-content-between align-items-center"
                        style={{ color: MAIN_TEXT_COLOR, cursor: 'pointer' }}
                        onClick={() => {
                          const slug = slugify(sub);
                          const path =
                            browseSelection === 'Pharmacy First'
                              ? `/pharmacy-first/${slug}`
                              : `/${slug}`;
                          navigate(path);
                          setActiveMenu(null);
                          setBrowseSelection(null);
                        }}
                      >
                        {sub}
                        <img
                          src={chevronDown}
                          alt=""
                          style={{ width: 20, transform: 'rotate(-90deg)' }}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // fallback for other top-level menus
              <ul className="list-unstyled ps-0">
                {dropdownData[activeMenu!].map((item, idx) => (
                  <li
                    key={idx}
                    className="py-3 px-4 border-bottom d-flex justify-content-between align-items-center"
                    style={{ color: MAIN_TEXT_COLOR, cursor: 'pointer' }}
                    onClick={() => {
                      navigate(`/${slugify(item)}`);
                      setActiveMenu(null);
                    }}
                  >
                    {item}
                    <img
                      src={chevronDown}
                      alt=""
                      style={{ width: 20, transform: 'rotate(-90deg)' }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
