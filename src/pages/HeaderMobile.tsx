// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Header.css';

// /**
//  * Constants for icon URLs
//  */
// const ICON_HAMBURGER = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//menu-2.png';
// const ICON_CLOSE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//close-2.png';
// const ICON_PHONE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//phone.png';
// const ICON_DOWN_CHEVRON = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

// // Top‐level dropdown menu data
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

// // Second‐level submenu under "Browse Services"
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
//     'Emergency Contraception',
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

// // Utility to create URL slugs
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

//   // Reset/close everything
//   const closeAll = () => {
//     setMobileOpen(false);
//     setLevel1(null);
//     setLevel2(null);
//   };

//   return (
//     <header>
//       {/* ================================= */}
//       {/* ===== MOBILE HEADER (XS‐SM) ===== */}
//       {/* ================================= */}
//       <div className="mobile-header d-flex d-md-none align-items-center">
//         {/* Logo — far-left */}
//         <img
//           src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
//           alt="Coleshill Pharmacy Logo"
//           className="mobile-logo"
//         />

//         {/* Phone icon — next to logo */}
//         <a href="tel:01634404142" className="call-icon" aria-label="Call us">
//           <img src={ICON_PHONE} alt="Call Icon" />
//         </a>

//         {/* Spacer div so that hamburger sits at far right */}
//         <div className="flex-fill" />

//         {/* Hamburger / Close button — far right */}
//         <button
//           className="hamburger-btn"
//           onClick={() => {
//             if (mobileOpen) {
//               closeAll();
//             } else {
//               setMobileOpen(true);
//             }
//           }}
//           aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//         >
//           {mobileOpen ? (
//             <img src={ICON_CLOSE} alt="Close menu" className="icon-close" />
//           ) : (
//             <img src={ICON_HAMBURGER} alt="Open menu" className="icon-hamburger" />
//           )}
//         </button>
//       </div>

//       {/* ================================= */}
//       {/* ===== MOBILE DRAWER (XS‐SM) ===== */}
//       {/* ================================= */}
//       {mobileOpen && (
//         <div className="mobile-drawer d-md-none">
//           {/* Level 1 menu (top‐level) */}
//           {!level1 && !level2 && (
//             <ul className="mobile-list">
//               {Object.keys(dropdownData).map((menu) => (
//                 <li key={menu} onClick={() => setLevel1(menu)}>
//                   {menu}
//                   <img src={ICON_DOWN_CHEVRON} className="chevron-90" alt="" />
//                 </li>
//               ))}
//               {/* <li onClick={closeAll}>
//                 Blog
//                 <img src={ICON_DOWN_CHEVRON} className="chevron-90" alt="" />
//               </li> */}
//               <li onClick={closeAll}>
//                 Contact
//                 <img src={ICON_DOWN_CHEVRON} className="chevron-90" alt="" />
//               </li>
//             </ul>
//           )}

//           {/* Level 2 (submenu for the chosen level1) */}
//           {level1 && !level2 && (
//             <div className="mobile-list">
//               <div className="mobile-back" onClick={() => setLevel1(null)}>
//                 &lt; {level1}
//               </div>
//               {dropdownData[level1].map((opt) => (
//                 <div
//                   key={opt}
//                   className="mobile-item"
//                   onClick={() => {
//                     // If under Browse Services and has submenu
//                     if (level1 === 'Browse Services' && browseSubMenuData[opt]) {
//                       setLevel2(opt);
//                     } else {
//                       // Navigate to the chosen route
//                       const path = opt === 'All Services' ? '/services' : `/${slugify(opt)}`;
//                       navigate(path);
//                       closeAll();
//                     }
//                   }}
//                 >
//                   {opt}
//                   {level1 === 'Browse Services' && browseSubMenuData[opt] && (
//                     <img src={ICON_DOWN_CHEVRON} className="chevron-90" alt="" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Level 3 (sub‐submenu under whichever Level 2 subsection) */}
//           {level2 && (
//             <div className="mobile-list">
//               <div className="mobile-back" onClick={() => setLevel2(null)}>
//                 &lt; {level2}
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
//                   {sub}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ================================= */}
//       {/* ===== DESKTOP NAVBAR (MD+) ===== */}
//       {/* ================================= */}
//       <nav className="navbar navbar-expand-md navbar-light bg-white d-none d-md-flex">
//         <div className="container">
//           {/* Logo on desktop */}
//           <a className="navbar-brand" href="/">
//             <img
//               src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
//               alt="Coleshill Pharmacy Logo"
//               className="desktop-logo"
//             />
//           </a>

//           {/* Bootstrap hamburger toggler for collapsed content on tablet */}
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#desktopNavContent"
//             aria-controls="desktopNavContent"
//             aria-expanded="false"
//             aria-label="Toggle navigation"
//           >
//             <span className="navbar-toggler-icon" />
//           </button>

//           <div className="collapse navbar-collapse" id="desktopNavContent">
//             <ul className="navbar-nav me-auto">
//               {Object.keys(dropdownData).map((menu) => (
//                 <li key={menu} className="nav-item dropdown">
//                   <a
//                     className="nav-link dropdown-toggle"
//                     href="#"
//                     id={`nav-${menu}`}
//                     role="button"
//                     data-bs-toggle="dropdown"
//                     aria-expanded="false"
//                   >
//                     {menu}
//                   </a>
//                   <ul className="dropdown-menu" aria-labelledby={`nav-${menu}`}>
//                     {dropdownData[menu].map((item) => (
//                       <li key={item}>
//                         {menu === 'Browse Services' && browseSubMenuData[item] ? (
//                           // Nested submenu
//                           <div className="dropdown-submenu">
//                             <a
//                               className="dropdown-item dropdown-toggle"
//                               href="#"
//                             >
//                               {item}
//                             </a>
//                             <ul className="dropdown-menu">
//                               {browseSubMenuData[item].map((sub) => (
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
//                         ) : (
//                           <a className="dropdown-item" href={`/${slugify(item)}`}>
//                             {item}
//                           </a>
//                         )}
//                       </li>
//                     ))}
//                   </ul>
//                 </li>
//               ))}

//               {/* Static links */}
//               <li className="nav-item">
//                 <a className="nav-link" href="/blog">
//                   Blog
//                 </a>
//               </li>
//               <li className="nav-item">
//                 <a className="nav-link" href="/contact">
//                   Contact
//                 </a>
//               </li>
//             </ul>

//             {/* Phone button + Book Now button on desktop */}
//             <div className="d-flex align-items-center">
//               <a href="tel:01634404142" className="btn btn-outline-primary me-3">
//                 <img src={ICON_PHONE} alt="Phone" className="desktop-phone-icon me-1" />
//                 01634 404142
//               </a>
//               <a href="/book" className="btn btn-success">
//                 Book Now
//               </a>
//             </div>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Header;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const ICON_HAMBURGER = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//menu-2.png';
const ICON_CLOSE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//close-2.png';
const ICON_PHONE = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//phone.png';
const ICON_CHEVRON = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';
const ICON_BACK = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//back-arrow.png';

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
    'Emergency Contraception',
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

  return (
    <header>
      <div className="mobile-header d-flex d-md-none align-items-center">
        <img
          src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
          alt="Coleshill Pharmacy Logo"
          className="mobile-logo"
        />
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
          {level2 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel2(null)}>
                <img src={ICON_BACK} alt="Back" className="back-icon" />
                {level2}
              </div>
              {browseSubMenuData[level2].map((sub) => (
                <div
                  key={sub}
                  className="mobile-item"
                  onClick={() => {
                    const path =
                      level2 === 'Pharmacy First'
                        ? `/pharmacy-first/${slugify(sub)}`
                        : `/${slugify(sub)}`;
                    navigate(path);
                    closeAll();
                  }}
                >
                  <span>{sub}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </div>
              ))}
            </div>
          )}

          {level1 && !level2 && (
            <div className="mobile-list">
              <div className="mobile-back" onClick={() => setLevel1(null)}>
                <img src={ICON_BACK} alt="Back" className="back-icon" />
                {level1}
              </div>
              {dropdownData[level1].map((opt) => (
                <div
                  key={opt}
                  className="mobile-item"
                  onClick={() => {
                    if (level1 === 'Browse Services' && browseSubMenuData[opt]) {
                      setLevel2(opt);
                    } else {
                      const path = opt === 'All Services' ? '/services' : `/${slugify(opt)}`;
                      navigate(path);
                      closeAll();
                    }
                  }}
                >
                  <span>{opt}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </div>
              ))}
            </div>
          )}

          {!level1 && !level2 && (
            <ul className="mobile-list">
              <li className="mobile-item" onClick={() => navigate('/book')}>
                <span>Book Appointment</span>
                <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
              </li>
              {Object.keys(dropdownData).map((menu) => (
                <li key={menu} className="mobile-item" onClick={() => setLevel1(menu)}>
                  <span>{menu}</span>
                  <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
                </li>
              ))}
              <li className="mobile-item" onClick={() => { closeAll(); navigate('/blog'); }}>
                <span>Blog</span>
                <img src={ICON_CHEVRON} alt=">" className="chevron-icon" />
              </li>
              <li className="mobile-item" onClick={() => { closeAll(); navigate('/contact'); }}>
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
//     'Emergency Contraception',
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
