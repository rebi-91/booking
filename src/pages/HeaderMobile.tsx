

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const ICON_HAMBURGER =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//menu-2.png';
const ICON_CLOSE =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//close-2.png';
const ICON_PHONE =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//phone.png';
const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';
const ICON_BACK =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//back-arrow.png';

const dropdownData: Record<string, string[]> = {
  'Browse Services': [
    'All Services',
    'Travel Clinic',
    'Private Treatments',
    'NHS Treatments',
    'Pharmacy First',
  ],
  'Weight Loss': ['Wegovy', 'Mounjaro'],
  'Travel Vaccinations': [
    'Chicken pox',
    'Cholera (2 doses – special cases)',
    'Dengue Fever',
    'Diphtheria, Tetanus and Polio',
    'Hepatitis A (2 doses)',
    'Hepatitis B (3 doses)',
    'HPV',
    'Japanese Encephalitis',
    'Meningitis ACWY (1 dose – for Hajj/Umrah)',
    'Meningitis B',
    'Rabies (3 doses)',
    'Shingles (Zostavax)',
    'Typhoid (1 dose or orally)',
    'Yellow fever',
  ],
};

const browseSubMenuData: Record<string, string[]> = {
  'Private Treatments': [
    'Microsuction Earwax Removal',
    'Weight Loss Clinic',
    'Private Flu Jab',
    'Period Delay',
    'Period Pain',
    'Altitude sickness',
    'Vitamin B12 Injection',
    'Male Pattern Baldness (Androgenic Alopecia)',
    'Erectile dysfunction',
    'Traveller’s Diarrhoea',
    'Female Hirsutism in Women',
    'Jet Lag',
    'Oral Thrush',
    'Pain Relief (Naproxen)',
    'Hay Fever (Fexofenadine or Dymista)',
    'Uncomplicated UTI (Women)',
  ],
  'NHS Treatments': [
    'Blood Pressure Check',
    'Oral Contraception',
    'Flu Vaccination',
    'COVID-19 Vaccination',
  ],
  'Pharmacy First': [
    'Sinusitis',
    'Sore throat',
    'Earache',
    'Infected insect bite',
    'Impetigo',
    'Shingles',
    'Uncomplicated UTI (Women)',
  ],
};

const ROUTE_MAP: Record<string, string> = {
  // top-level
  'All Services': '/services',
  'Travel Clinic': '/book/3',
  'Private Treatments': '/private-treatments',
  'NHS Treatments': '/nhs-treatments',
  'Pharmacy First': '/pharmacy-first',
  'Weight loss clinic': '/weight-loss-clinic',
  // weight loss
  Wegovy: '/wegovy',
  Mounjaro: '/mounjaro',
  // core services
  'Altitude sickness': '/book/1',
  'Sore throat': '/book/2',
  'Travel Consultation': '/book/3',
  'Travel vaccine': '/book/4',
  'Uncomplicated UTI (Women)': '/book/5',
  'Vitamin B12 Injection': '/book/6',
  Impetigo: '/book/7',
  'Infected insect bite': '/book/8',
  'Period Delay': '/book/90',
  'Period Pain': '/book/89',
  'Private Flu Jab': '/book/10',
  Shingles: '/book/44',
  'Oral Contraception': '/oral-contraceptives',
  'Oral Thrush': '/book/28',
  'Hay Fever (Fexofenadine or Dymista)': '/book/29',
  'Flu Vaccination': '/book/14',
  'Blood Pressure Check': '/book/15',
  'COVID-19 Vaccination': '/book/16',
  'Private COVID-19 Vaccination': '/book/45x',
  'Yellow fever': '/book/17',
  'Ear wax removal': '/book/18',
  'Earache': '/book/19',
  'Erectile dysfunction': '/book/20',
  Sinusitis: '/book/21',
  'Acid Reflux': '/book/22',
  'Pain Relief (Naproxen)': '/book/23',
  'Male Pattern Baldness (Androgenic Alopecia)': '/book/24',
  'Female Hirsutism in Women': '/book/25',
  'Jet Lag': '/book/26',
  'Traveller’s Diarrhoea': '/book/9',
  // travel vaccinations
  'Chicken pox': '/book/38',
  'Cholera (2 doses – special cases)': '/book/36',
  'Dengue Fever': '/book/43',
  'Diphtheria, Tetanus and Polio': '/book/30',
  'Hepatitis A (2 doses)': '/book/31',
  'Hepatitis B (3 doses)': '/book/32',
  HPV: '/book/42',
  'Japanese Encephalitis': '/book/37',
  'Meningitis ACWY (1 dose – for Hajj/Umrah)': '/book/35',
  'Meningitis B': '/book/39',
  'Rabies (3 doses)': '/book/34',
  'Shingles (Zostavax)': '/book/40',
  'Typhoid (1 dose or orally)': '/book/33',
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const HeaderMobile: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [level1, setLevel1] = useState<string | null>(null);
  const [level2, setLevel2] = useState<string | null>(null);
  const navigate = useNavigate();

  const closeAll = () => {
    setMobileOpen(false);
    setLevel1(null);
    setLevel2(null);
  };

  const goTo = (label: string) => {
    const base = ROUTE_MAP[label] ?? `/${slugify(label)}`;
    navigate(base);
    closeAll();
  };

  return (
    <header className="mobile-header-container">
      <div className="mobile-header d-flex d-md-none align-items-center">
        <Link to="/" onClick={closeAll}>
          <img
            src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
            alt="Logo"
            className="mobile-logo"
          />
        </Link>
        <a href="tel:01675466014" className="call-icon">
          <img src={ICON_PHONE} alt="Call us" />
        </a>
        <div className="flex-fill" />
        <button
          className="hamburger-btn"
          onClick={() => (mobileOpen ? closeAll() : setMobileOpen(true))}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <img
            src={mobileOpen ? ICON_CLOSE : ICON_HAMBURGER}
            alt={mobileOpen ? 'Close' : 'Menu'}
          />
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer d-md-none">
          {level2 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel2(null)}>
                <img src={ICON_BACK} alt="Back" />
                <span>{level2}</span>
              </div>
              {browseSubMenuData[level2].map(item => {
                const isCovid =
                  level2 === 'NHS Treatments' && item === 'COVID-19 Vaccination';
                const isYellowFeverLS =
                  level2 === 'Travel Vaccinations' && item === 'Yellow fever';
                const disabled = isCovid || isYellowFeverLS;

                return (
                  <div
                    key={item}
                    className={`mobile-item${disabled ? ' disabled' : ''}`}
                    onClick={() => !disabled && goTo(item)}
                  >
                    <span>{item}</span>
                    {isCovid && <span className="tag seasonal">Seasonal</span>}
                    {isYellowFeverLS && (
                      <span className="tag coming-soon">Coming Soon</span>
                    )}
                    {!isCovid && !isYellowFeverLS && (
                      <img src={ICON_CHEVRON} alt=">" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!level2 && level1 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel1(null)}>
                <img src={ICON_BACK} alt="Back" />
                <span>{level1}</span>
              </div>
              {dropdownData[level1].map(opt => {
                const isFreeTag =
                  level1 === 'Browse Services' &&
                  (opt === 'NHS Treatments' || opt === 'Pharmacy First');
                const isYellowFever =
                  level1 === 'Travel Vaccinations' && opt === 'Yellow fever';
                const disabled = isYellowFever;

                return (
                  <div
                    key={opt}
                    className={`mobile-item${disabled ? ' disabled' : ''}`}
                    onClick={() => {
                      if (
                        level1 === 'Browse Services' &&
                        browseSubMenuData[opt]
                      ) {
                        setLevel2(opt);
                      } else if (!disabled) {
                        goTo(opt);
                      }
                    }}
                  >
                    <span>{opt}</span>
                    {/* {isFreeTag && <span className="tag free">Free</span>} */}
                    {isYellowFever && (
                      <span className="tag coming-soon">Coming Soon</span>
                    )}
                    {!isYellowFever && <img src={ICON_CHEVRON} alt=">" />}
                  </div>
                );
              })}
            </div>
          )}

          {!level1 && !level2 && (
            <ul className="mobile-list start-menu">
              {Object.keys(dropdownData).map(menu => (
                <li
                  key={menu}
                  className="mobile-item"
                  onClick={() => setLevel1(menu)}
                >
                  <span>{menu}</span>
                </li>
              ))}
              <li
                className="mobile-item"
                onClick={() => {
                  closeAll();
                  navigate('/book/18');
                }}
              >
                <span>Microsuction Ear Wax Removal</span>
              </li>
              <li
                className="mobile-item"
                onClick={() => {
                  closeAll();
                  navigate('/emergency-supply');
                }}
              >
                <span>Emergency Supply</span>
              </li>
              <li
                className="mobile-item"
                onClick={() => {
                  closeAll();
                  navigate('/');
                  setTimeout(() => {
                    document
                      .getElementById('find-us')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                }}
              >
                <span>Contact</span>
              </li>
              <li
                className="mobile-item2"
                onClick={() => {
                  closeAll();
                  navigate('/login');
                }}
              >
                <span>Login</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default HeaderMobile;
