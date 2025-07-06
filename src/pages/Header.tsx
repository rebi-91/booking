
// import React from 'react';
// import { useMediaQuery } from 'react-responsive';
// import HeaderDesktop from './HeaderDesktop';
// import HeaderMobile from './HeaderMobile';

// const Header: React.FC = () => {
//   const isDesktop = useMediaQuery({ minWidth: 768 });
//   return isDesktop ? <HeaderDesktop /> : <HeaderMobile />;
// };

// export default Header;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Head.css';

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
  const ICON_LOGO =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg';


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
      'Weight Loss Management',
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
    'All Services': '/services',
    'Travel Clinic': '/book/3',
    'Private Treatments': '/private-treatments',
    'NHS Treatments': '/nhs-treatments',
    'Pharmacy First': '/pharmacy-first',
    'Weight loss management': '/weight-loss-management',
    Wegovy: '/wegovy',
    Mounjaro: '/mounjaro',
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
    'Yellow fever': '/book/17',
    // more direct items:
    'Microsuction Earwax Removal': '/microsuction-earwax-removal',
    'Emergency Supply': '/emergency-supply',
    Contact: '/#find-us',
    Login: '/login',
    'Order your prescription': '/order-prescription',
  };
  

function slugify(s:string){
  return s
    .toLowerCase()
    .replace(/[()]/g,'')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}

export default function Header(){
  const [open,setOpen] = useState(false);
  const [lvl1,setLvl1] = useState<string|null>(null);
  const [lvl2,setLvl2] = useState<string|null>(null);
  const nav = useNavigate();

  const closeAll = ()=>{
    setOpen(false);
    setLvl1(null);
    setLvl2(null);
  };
  const goTo = (label:string)=>{
    closeAll();
    const to = ROUTE_MAP[label] ?? '/'+slugify(label);
    if(to.startsWith('#')) window.location.hash = to.slice(1);
    else nav(to);
  };

  return (
    <header className="header-bar d-flex align-items-center">
      <Link to="/" onClick={closeAll}>
        <img src={ICON_LOGO} alt="Logo" className="logo ms-2 header-logo"/>
      </Link>
      <a href="tel:01634404142" className="phone-link">
        <img src={ICON_PHONE} alt="Call us" className="phone-icon"/>
      </a>
      <div className="flex-grow-1"></div>
      <button
        className="btn p-0 menu-button"
        onClick={()=>setOpen(o=>!o)}
        aria-label={open?'Close menu':'Open menu'}
      >
        <img
          src={open?ICON_CLOSE:ICON_HAMBURGER}
          alt=""
          className="hamburger-icon"
        />
      </button>


      {open && (
        <div className="drawer">
          {/* level2 submenu */}
          {lvl2 && (
            <ul className="list-unstyled px-3">
              <li className="mb-2 back" onClick={()=>setLvl2(null)}>
                <img src={ICON_BACK} alt="Back" className="me-2"/> {lvl2}
              </li>
              {browseSubMenuData[lvl2].map(item=>{
                const disabled = (lvl2==='NHS Treatments' && item==='COVID-19 Vaccination')
                              || (lvl2==='Travel Vaccinations' && item==='Yellow fever');
                return (
                  <li
                    key={item}
                    className={`item ${disabled?'disabled':''}`}
                    onClick={()=>!disabled&&goTo(item)}
                  >
                    <span>{item}</span>
                    {!disabled && <img src={ICON_CHEVRON} alt=">" className="chevron"/>}
                  </li>
                );
              })}
            </ul>
          )}

          {/* level1 submenu */}
          {!lvl2 && lvl1 && (
            <ul className="list-unstyled px-3">
              <li className="mb-2 back" onClick={()=>setLvl1(null)}>
                <img src={ICON_BACK} alt="Back" className="me-2"/> {lvl1}
              </li>
              {dropdownData[lvl1].map(opt=>{
                const hasSub = !!browseSubMenuData[opt];
                const disabled = opt==='Yellow fever';
                return (
                  <li
                    key={opt}
                    className={`item ${disabled?'disabled':''}`}
                    onClick={()=>{
                      if(hasSub) setLvl2(opt);
                      else if(!disabled) goTo(opt);
                    }}
                  >
                    <span>{opt}</span>
                    {!disabled && <img src={ICON_CHEVRON} alt=">" className="chevron"/>}
                  </li>
                );
              })}
            </ul>
          )}

          {/* root menu */}
          {!lvl1 && !lvl2 && (
            <ul className="list-unstyled px-3">
              {Object.keys(dropdownData).map(menu=>(
                <li key={menu}
                    className="item root"
                    onClick={()=>setLvl1(menu)}
                >{menu}</li>
              ))}
              {['Microsuction Earwax Removal','Emergency Supply','Contact']
                .map(it=>(
                  <li key={it} className="item alt" onClick={()=>goTo(it)}>
                    {it}
                  </li>
                ))
              }
              {['Login']
                .map(it=>(
                  <li key={it} className="item alt1" onClick={()=>goTo(it)}>
                    {it}
                  </li>
                ))
              }
             
            </ul>
          )}
        </div>
      )}
    </header>
  );
}
