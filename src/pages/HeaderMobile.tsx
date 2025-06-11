// src/components/Header.tsx
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
  'NHS Services': ['NHS Services', 'NHS Repeat Prescriptions', 'Delivery Service'],
  'Weight Loss': ['Wegovy', 'Mounjaro'],
  'Travel Vaccinations': [
    'Cholera',
    'Diphtheria, Tetanus & Polio',
    'Rabies',
    'Hepatitis A',
    'Hepatitis B',
    'Japanese Encephalitis',
    'Tick‐borne Encephalitis',
    'Meningitis ACWY and Meningitis B',
    'Typhoid',
    'Mumps, Measles, and Rubella (MMR)',
    'Yellow Fever Vaccination',
  ],
};

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
    'Oral Contraception',
    'Flu Vaccination',
    'COVID‐19 Vaccination',
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

// Explicit mapping from label → desired URL path
const ROUTE_MAP: Record<string, string> = {
  'All Services': '/services',
  'Travel Clinic': '/book/4',
  'Private Treatments': '/private-treatments',
  'NHS Treatments': '/nhs-treatments',
  'Pharmacy First': '/pharmacy-first',
  'Microsuction Earwax Removal': '/microsuction-earwax-removal',
  'Weight Loss Clinic': '/weight-loss-injections',
  'Private Flu Jab': '/book/11',
  'Period Delay': '/book/10',
  'Altitude Sickness': '/book/1',
  'Vitamin B12 Injection': '/book/6',
  'Hair Loss': '/book/7',
  'Chickenpox Vaccine': '/book/18',
  'Erectile Dysfunction': '/book/21',
  'Blood Pressure Check': '/book/16',
  'Oral Contraception': '/book/14',
  'Flu Vaccination': '/book/15',
  'COVID‐19 Vaccination': '/book/17',
  'Cholera': '/book/11',
    'Diphtheria, Tetanus & Polio': '/book/11',
    'Rabies': '/book/11',
    'Hepatitis A': '/book/11',
    'Hepatitis B': '/book/11',
    'Japanese Encephalitis': '/book/11',
    'Tick‐borne Encephalitis': '/book/11',
    'Meningitis ACWY and Meningitis B': '/book/11',
    'Typhoid': '/book/11',
    'Mumps, Measles, and Rubella (MMR)': '/book/11',
    'Yellow Fever Vaccination': '/book/11',
  // Pharmacy First items can also be overridden here if needed
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [level1, setLevel1] = useState<string | null>(null);
  const [level2, setLevel2] = useState<string | null>(null);

  const navigate = useNavigate();

  const closeAll = () => {
    setMobileOpen(false);
    setLevel1(null);
    setLevel2(null);
  };

  const goTo = (label: string, prefix?: string) => {
    const basePath = ROUTE_MAP[label] ?? `/${slugify(label)}`;
    const path = prefix ? `${prefix}${basePath}` : basePath;
    navigate(path);
    closeAll();
  };

  return (
    <header>
      <div className="mobile-header d-flex d-md-none align-items-center">
        <Link to="/" onClick={closeAll}>
          <img
            src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
            alt="Coleshill Pharmacy Logo"
            className="mobile-logo"
          />
        </Link>
        <a href="tel:01634404142" className="call-icon" aria-label="Call us">
          <img src={ICON_PHONE} alt="Call Icon" />
        </a>
        <div className="flex-fill" />
        <button
          className="hamburger-btn"
          onClick={() => (mobileOpen ? closeAll() : setMobileOpen(true))}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <img src={ICON_CLOSE} alt="Close menu" className="icon-close" />
          ) : (
            <img src={ICON_HAMBURGER} alt="Open menu" className="icon-hamburger" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer d-md-none">
          {/* Level 2 submenu */}
          {level2 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel2(null)}>
                <img src={ICON_BACK} alt="Back" className="back-icon" />
                {level2}
              </div>
              {browseSubMenuData[level2].map(sub => (
                <div
                  key={sub}
                  className="mobile-item"
                  onClick={() => goTo(sub, level2 === 'Pharmacy First' ? '/pharmacy-first' : '')}
                >
                  <span>{sub}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </div>
              ))}
            </div>
          )}

          {/* Level 1 submenu */}
          {level1 && !level2 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel1(null)}>
                <img src={ICON_BACK} alt="Back" className="back-icon" />
                {level1}
              </div>
              {dropdownData[level1].map(opt => (
                <div
                  key={opt}
                  className="mobile-item"
                  onClick={() => {
                    if (level1 === 'Browse Services' && browseSubMenuData[opt]) {
                      setLevel2(opt);
                    } else {
                      goTo(opt);
                    }
                  }}
                >
                  <span>{opt}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </div>
              ))}
            </div>
          )}

          {/* Top‐level menu */}
          {!level1 && !level2 && (
            <ul className="mobile-list">
              <li
                className="mobile-item"
                onClick={() => {
                  goTo('Book Appointment');
                }}
              >
                <span>Book Appointment</span>
                <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
              </li>
              {Object.keys(dropdownData).map(menu => (
                <li
                  key={menu}
                  className="mobile-item"
                  onClick={() => setLevel1(menu)}
                >
                  <span>{menu}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </li>
              ))}
              {/* <li
                className="mobile-item"
                onClick={() => {
                  goTo('Blog');
                }}
              >
                <span>Blog</span>
                <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
              </li> */}
              <li
                className="mobile-item"
                onClick={() => {
                  goTo('Contact');
                }}
              >
                <span>Contact</span>
                <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
              </li>
            </ul>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import './Header.css';

// const ICON_HAMBURGER = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//menu-2.png';
// const ICON_CLOSE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//close-2.png';
// const ICON_PHONE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//phone.png';
// const ICON_CHEVRON = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';
// const ICON_BACK = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//back-arrow.png';

// const dropdownData: Record<string, string[]> = {
//   'Browse Services': [
//     'All Services',
//     'Travel Clinic',
//     'Private Treatments',
//     'NHS Treatments',
//     'Pharmacy First',
//   ],
//   'NHS Services': ['NHS Services', 'NHS Repeat Prescriptions', 'Delivery Service'],
//   'Weight Loss': ['Wegovy', 'Mounjaro'],
//   'Travel Vaccinations': [
//     'Cholera',
//     'Diphtheria, Tetanus & Polio',
//     'Rabies',
//     'Hepatitis A',
//     'Hepatitis B',
//     'Japanese Encephalitis',
//     'Tick‐borne Encephalitis',
//     'Meningitis ACWY and Meningitis B',
//     'Typhoid',
//     'Mumps, Measles, and Rubella (MMR)',
//     'Yellow Fever Vaccination',
//   ],
// };

// const browseSubMenuData: Record<string, string[]> = {
//   'Private Treatments': [
//     'Microsuction Earwax Removal',
//     'Weight Loss Clinic',
//     'Private Flu Jab',
//     'Period Delay',
//     'Altitude Sickness',
//     'Vitamin B12 Injection',
//     'Hair Loss',
//     'Chickenpox Vaccine',
//     'Erectile Dysfunction',
//   ],
//   'NHS Treatments': [
//     'Blood Pressure Check',
//     'Oral Contraception',
//     'Flu Vaccination',
//     'COVID‐19 Vaccination',
//   ],
//   'Pharmacy First': [
//     'Sinusitis',
//     'Sore Throat',
//     'Earache',
//     'Infected Insect Bite',
//     'Impetigo',
//     'Shingles',
//     'Uncomplicated UTI (Women)',
//   ],
// };

// const slugify = (s: string) =>
//   s
//     .toLowerCase()
//     .replace(/[()]/g, '')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');

// const Header: React.FC = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [level1, setLevel1] = useState<string | null>(null);
//   const [level2, setLevel2] = useState<string | null>(null);

//   const navigate = useNavigate();

//   const closeAll = () => {
//     setMobileOpen(false);
//     setLevel1(null);
//     setLevel2(null);
//   };

//   return (
//     <header>
//       <div className="mobile-header d-flex d-md-none align-items-center">
//       <Link to="/" onClick={closeAll}>
//           <img
//             src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
//             alt="Coleshill Pharmacy Logo"
//            className="mobile-logo"
//           />
//         </Link>
//         <a href="tel:01634404142" className="call-icon" aria-label="Call us">
//           <img src={ICON_PHONE} alt="Call Icon" />
//         </a>
//         <div className="flex-fill" />
//         <button
//           className="hamburger-btn"
//           onClick={() => (mobileOpen ? closeAll() : setMobileOpen(true))}
//           aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//         >
//           {mobileOpen ? (
//             <img src={ICON_CLOSE} alt="Close menu" className="icon-close" />
//           ) : (
//             <img src={ICON_HAMBURGER} alt="Open menu" className="icon-hamburger" />
//           )}
//         </button>
//       </div>

//       {mobileOpen && (
//         <div className="mobile-drawer d-md-none">
//           {level2 && (
//             <div className="mobile-list">
//               <div className="mobile-back" onClick={() => setLevel2(null)}>
//                 <img src={ICON_BACK} alt="Back" className="back-icon" />
//                 {level2}
//               </div>
//               {browseSubMenuData[level2].map((sub) => (
//                 <div
//                   key={sub}
//                   className="mobile-item"
//                   onClick={() => {
//                     const path =
//                       level2 === 'Pharmacy First'
//                         ? `/pharmacy-first/${slugify(sub)}`
//                         : `/${slugify(sub)}`;
//                     navigate(path);
//                     closeAll();
//                   }}
//                 >
//                   <span>{sub}</span>
//                   <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//                 </div>
//               ))}
//             </div>
//           )}

//           {level1 && !level2 && (
//             <div className="mobile-list">
//               <div className="mobile-back" onClick={() => setLevel1(null)}>
//                 <img src={ICON_BACK} alt="Back" className="back-icon" />
//                 {level1}
//               </div>
//               {dropdownData[level1].map((opt) => (
//                 <div
//                   key={opt}
//                   className="mobile-item"
//                   onClick={() => {
//                     if (level1 === 'Browse Services' && browseSubMenuData[opt]) {
//                       setLevel2(opt);
//                     } else {
//                       const path = opt === 'All Services' ? '/services' : `/${slugify(opt)}`;
//                       navigate(path);
//                       closeAll();
//                     }
//                   }}
//                 >
//                   <span>{opt}</span>
//                   <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//                 </div>
//               ))}
//             </div>
//           )}

//           {!level1 && !level2 && (
//             <ul className="mobile-list">
//               <li className="mobile-item" onClick={() => navigate('/book')}>
//                 <span>Book Appointment</span>
//                 <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//               </li>
//               {Object.keys(dropdownData).map((menu) => (
//                 <li key={menu} className="mobile-item" onClick={() => setLevel1(menu)}>
//                   <span>{menu}</span>
//                   <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//                 </li>
//               ))}
//               <li className="mobile-item" onClick={() => { closeAll(); navigate('/blog'); }}>
//                 <span>Blog</span>
//                 <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//               </li>
//               <li className="mobile-item" onClick={() => { closeAll(); navigate('/contact'); }}>
//                 <span>Contact</span>
//                 <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
//               </li>
//             </ul>
//           )}
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Header.css';

// const chevronDown =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

// const dropdownData: Record<string, string[]> = {
//   'Browse Services': [
//     'All Services',
//     'Travel Clinic',
//     'Private Treatments',
//     'NHS Treatments',
//     'Pharmacy First',
//   ],
//   'NHS Services': ['NHS Services', 'NHS Repeat Prescriptions', 'Delivery Service'],
//   'Weight Loss': ['Wegovy', 'Mounjaro'],
//   'Travel Vaccinations': [
//     'Cholera',
//     'Diphtheria, Tetanus & Polio',
//     'Rabies',
//     'Hepatitis A',
//     'Hepatitis B',
//     'Japanese Encephalitis',
//     'Tick-borne Encephalitis',
//     'Meningitis ACWY and Meningitis B',
//     'Typhoid',
//     'Mumps, Measles, and Rubella (MMR)',
//     'Yellow Fever Vaccination',
//   ],
// };

// const browseSubMenuData: Record<string, string[]> = {
//   'Private Treatments': [
//     'Microsuction Earwax Removal',
//     'Weight Loss Clinic',
//     'Private Flu Jab',
//     'Period Delay',
//     'Altitude Sickness',
//     'Vitamin B12 Injection',
//     'Hair Loss',
//     'Chickenpox Vaccine',
//     'Erectile Dysfunction',
//   ],
//   'NHS Treatments': [
//     'Blood Pressure Check',
//     'Oral Contraception',
//     'Flu Vaccination',
//     'COVID-19 Vaccination',
//   ],
//   'Pharmacy First': [
//     'Sinusitis',
//     'Sore Throat',
//     'Earache',
//     'Infected Insect Bite',
//     'Impetigo',
//     'Shingles',
//     'Uncomplicated UTI (Women)',
//   ],
// };

// const slugify = (s: string) =>
//   s
//     .toLowerCase()
//     .replace(/[()]/g, '')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');

// const Header: React.FC = () => {
//   const [open, setOpen] = useState(false);
//   const [level1, setLevel1] = useState<string|null>(null);
//   const [level2, setLevel2] = useState<string|null>(null);
//   const nav = useNavigate();

//   const closeAll = () => {
//     setOpen(false);
//     setLevel1(null);
//     setLevel2(null);
//   };

//   return (
//     <header>
//       {/* ===== MOBILE HEADER ===== */}
//       <div className="d-flex d-md-none mobile-header align-items-center">
//         {/* Logo far left */}
//         <img
//           src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
//           alt="Logo"
//           className="mobile-logo ms-3"
//         />

//         {/* Phone icon centered */}
//         <a href="tel:01634404142" className="call-icon mx-auto" aria-label="Call us">
//           📞
//         </a>

//         {/* Hamburger far right */}
//         <button
//           className="hamburger me-3"
//           onClick={() => {
//             if (open) closeAll();
//             else setOpen(true);
//           }}
//           aria-label={open ? 'Close menu' : 'Open menu'}
//         >
//           {open ? <span className="close-x">&times;</span> : <span className="burger-icon" />}
//         </button>
//       </div>

//       {/* ===== MOBILE DRAWER ===== */}
//       {open && (
//         <div className="mobile-drawer d-md-none">
//           {/* Level 1 */}
//           {!level1 && !level2 && (
//             <ul className="mobile-list panel">
//               {Object.keys(dropdownData).map(menu => (
//                 <li key={menu} onClick={() => setLevel1(menu)}>
//                   {menu}
//                   <img src={chevronDown} className="chevron-90" alt="" />
//                 </li>
//               ))}
//               <li onClick={closeAll}>
//                 Blog
//                 <img src={chevronDown} className="chevron-90" alt="" />
//               </li>
//               <li onClick={closeAll}>
//                 Contact
//                 <img src={chevronDown} className="chevron-90" alt="" />
//               </li>
//             </ul>
//           )}

//           {/* Level 2 */}
//           {level1 && !level2 && (
//             <div className="mobile-list panel">
//               <div className="mobile-back" onClick={() => setLevel1(null)}>
//                 &lt; {level1}
//               </div>
//               {dropdownData[level1].map(opt => (
//                 <div
//                   key={opt}
//                   className="mobile-item"
//                   onClick={() => {
//                     if (level1 === 'Browse Services' && browseSubMenuData[opt]) {
//                       setLevel2(opt);
//                     } else {
//                       const path =
//                         opt === 'All Services' ? '/services' : `/${slugify(opt)}`;
//                       nav(path);
//                       closeAll();
//                     }
//                   }}
//                 >
//                   {opt}
//                   {(level1 === 'Browse Services' && browseSubMenuData[opt]) && (
//                     <img src={chevronDown} className="chevron-90" alt="" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Level 3 */}
//           {level2 && (
//             <div className="mobile-list panel">
//               <div className="mobile-back" onClick={() => setLevel2(null)}>
//                 &lt; {level2}
//               </div>
//               {browseSubMenuData[level2].map(sub => (
//                 <div
//                   key={sub}
//                   className="mobile-item"
//                   onClick={() => {
//                     const path =
//                       level2 === 'Pharmacy First'
//                         ? `/pharmacy-first/${slugify(sub)}`
//                         : `/${slugify(sub)}`;
//                     nav(path);
//                     closeAll();
//                   }}
//                 >
//                   {sub}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ===== DESKTOP NAVBAR ===== */}
//       <nav className="navbar navbar-expand-md bg-white d-none d-md-flex">
//         <div className="container">
//           <a className="navbar-brand" href="/">
//             <img
//               src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
//               alt="Logo"
//               height={40}
//             />
//           </a>

      

//           {/* Links + dropdowns */}
//           <ul className="navbar-nav me-auto">
//             {Object.keys(dropdownData).map(menu=>(
//               <li key={menu} className="nav-item dropdown">
//                 <a
//                   className="nav-link dropdown-toggle"
//                   href="#"
//                   id={menu}
//                   role="button"
//                   data-bs-toggle="dropdown"
//                   aria-expanded="false"
//                 >
//                   {menu}
//                 </a>

//                 <ul className="dropdown-menu" aria-labelledby={menu}>
//                   {dropdownData[menu].map(item=>(
//                     <li key={item}>
//                       {menu==='Browse Services' && browseSubMenuData[item]
//                         ? (
//                           <div className="dropdown-submenu">
//                             <a className="dropdown-item dropdown-toggle" href="#">
//                               {item}
//                             </a>
//                             <ul className="dropdown-menu">
//                               {browseSubMenuData[item].map(sub=>(
//                                 <li key={sub}>
//                                   <a
//                                     className="dropdown-item"
//                                     href={`/${slugify(sub)}`}
//                                   >
//                                     {sub}
//                                   </a>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         )
//                         : (
//                           <a className="dropdown-item" href={`/${slugify(item)}`}>
//                             {item}
//                           </a>
//                         )
//                       }
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}

//             <li className="nav-item"><a className="nav-link" href="/blog">Blog</a></li>
//             <li className="nav-item"><a className="nav-link" href="/contact">Contact</a></li>
//           </ul>

//           {/* Phone & Book Now */}
//           <a href="tel:01634404142" className="btn btn-outline-primary me-3">
//             📞 01634 404142
//           </a>
//           <a href="/book" className="btn btn-success">Book Now</a>
//         </div>
//       </nav>
//     </header>
// );}

// export default Header;
