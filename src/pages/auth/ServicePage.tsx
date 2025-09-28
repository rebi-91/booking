import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../Header';

// ToggleSwitch component
const ToggleSwitch: React.FC<{
  isOn: boolean;
  onToggle: () => void;
}> = ({ isOn, onToggle }) => {
  const width = 40;
  const height = 20;
  const thumb = 16;
  const pad = 2;
  return (
    <button
      onClick={onToggle}
      aria-pressed={isOn}
      style={{
        border: 'none',
        background: 'transparent',
        padding: 0,
        cursor: 'pointer',
        position: 'relative',
        width,
        height,
        borderRadius: height / 2,
        backgroundColor: isOn ? '#007bff' : '#ccc',
        transition: 'background-color 0.2s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: pad,
          left: isOn ? width - thumb - pad : pad,
          width: thumb,
          height: thumb,
          borderRadius: '50%',
          backgroundColor: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  );
};

interface Service {
  id: number;
  title: string;
  img: string;
  duration: string;
  category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
  description: string;
}

export const allServices: Service[] = [
  { id: 1, title: 'Altitude sickness', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/133875/KhhXvoL3hS.webp', duration: '20 mins', category: 'Private Service', description: 'Prevents nausea, dizziness and headaches at altitude.' },
  { id: 2, title: 'Sore throat', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/507276/Iug3MtaspO.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Soothes irritation and helps you swallow comfortably.' },
  { id: 3, title: 'Travel Consultation', img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp', duration: '20 mins', category: 'Private Service', description: 'Expert advice on vaccinations and prophylaxis.' },
  { id: 4, title: 'Travel vaccine', img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/810793/M8XAcWPBe6.webp', duration: '20 mins', category: 'Private Service', description: 'Comprehensive vaccine service for your trip.' },
  { id: 5, title: 'Uncomplicated UTI (Women)', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/963546/K6YOS9cMH3.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treatment without GP appointment for quick relief.' },
  { id: 6, title: 'Vitamin B12 Injection', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/219742/pu-_f9Dh4vv.webp', duration: '20 mins', category: 'Private Service', description: 'Injectable boost for energy, mood and vitality.' },
  { id: 7, title: 'Impetigo', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/373143/s9tYLb2pEs.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Rapid management of bacterial skin infection.' },
  { id: 8, title: 'Infected insect bite', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/120232/wfvV667Tx4.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treats infection, reduces swelling and pain.' },
  { id: 90, title: 'Period Delay', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp', duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
  { id: 89, title: 'Period Pain', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp', duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
  { id: 10, title: 'Private flu jab', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/281723/8K3Uhf06mK.webp', duration: '20 mins', category: 'Private Service', description: 'Quick, private flu vaccination in-store.' },
  { id: 44, title: 'Shingles', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/314321/sewm1HLfSk.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Immediate access to shingles vaccination.' },
  { id: 12, title: 'Weight Loss Clinic', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg', duration: '20 mins', category: 'Private Service', description: 'Clinical support for sustainable weight loss.' },
  { id: 13, title: 'Oral Contraception', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/pic.png', duration: '10 mins', category: 'NHS Service', description: 'Fast, confidential contraception service.' },
  { id: 14, title: 'Flu Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp', duration: '5 mins', category: 'NHS Service', description: 'Free NHS flu jab to keep you protected.' },
  { id: 15, title: 'Blood pressure check', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/865410/rcaOjteI-1.webp', duration: '10 mins', category: 'NHS Service', description: 'Quick assessment to detect hypertension.' },
  { id: 16, title: 'COVID-19 Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp', duration: '5 mins', category: 'NHS Service', description: 'Free COVID-19 booster for eligible patients.' },
  { id: 17, title: 'Yellow fever', img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg', duration: '20 mins', category: 'Private Service', description: 'Coming Soon' },
  { id: 18, title: 'Ear wax removal', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp', duration: '20 mins', category: 'Private Service', description: 'Safe microsuction for clear, comfortable ears.' },
  { id: 19, title: 'Earache', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treatment and advice for painful ear infections.' },
  { id: 20, title: 'Erectile dysfunction', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/ed.jpeg', duration: '20 mins', category: 'Private Service', description: 'Discreet assessment and prescription service.' },
  { id: 21, title: 'Sinusitis', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Fast relief from sinus pressure and pain.' },
  { id: 22, title: 'Acid Reflux', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//acid%20reflux.jpeg', duration: '20 mins', category: 'Private Service', description: 'Personalised prescription to relieve heartburn, indigestion and acid regurgitation.' },
  { id: 23, title: 'Pain Relief', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//acid%20reflux.jpeg', duration: '20 mins', category: 'Private Service', description: 'Our prescribing pharmacist may provide a short course of Naproxen 500 mg for effective pain management, where clinically appropriate.' },
  { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//baldness.jpeg', duration: '20 mins', category: 'Private Service', description: 'Targeted treatment for androgenic alopecia.' },
  { id: 25, title: 'Female Hirsutism in Women', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//vaniqa.jpeg', duration: '20 mins', category: 'Private Service', description: 'Topical therapy to reduce excessive facial hair.' },
  { id: 26, title: 'Jet Lag', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//jet%20lag.jpeg', duration: '20 mins', category: 'Private Service', description: 'Combat disturbed sleep patterns and fatigue when traveling across time zones.' },
  { id: 9, title: 'Traveller’s Diarrhoea', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Azithromycin to treat traveller’s diarrhoea.' },
  { id: 28, title: 'Oral Thrush', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Get oral solution or gel to treat oral thrush' },
  { id: 29, title: 'Hay Fever', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Fexofenadine or Dymista for Hay Fever' },
  { id: 30, title: 'Diphtheria, Tetanus and Polio', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//polio.webp', duration: '20 mins', category: 'Private Service', description: 'Single-dose protection against diphtheria, tetanus & polio.' },
  { id: 31, title: 'Hepatitis A (2 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-a.webp', duration: '20 mins', category: 'Private Service', description: 'Complete two-dose course to prevent Hep A infection.' },
  { id: 32, title: 'Hepatitis B (3 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-b.webp', duration: '20 mins', category: 'Private Service', description: 'Full three-dose immunisation for Hep B protection.' },
  { id: 33, title: 'Typhoid (1 dose or orally)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//thypoid.webp', duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
  { id: 34, title: 'Rabies (3 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//rabies.webp', duration: '20 mins', category: 'Private Service', description: 'Post-exposure or pre-travel three-dose course.' },
  { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//umra.png', duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
  { id: 36, title: 'Cholera', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//cholera.webp', duration: '20 mins', category: 'Private Service', description: 'Two-dose oral vaccine for cholera prevention.' },
  { id: 37, title: 'Japanese Encephalitis', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//japanese.webp', duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito-borne Japanese encephalitis.' },
  { id: 38, title: 'Chicken pox', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp', duration: '20 mins', category: 'Private Service', description: 'Private immunisation against chickenpox.' },
  { id: 39, title: 'Meningitis B', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//meningitis%20b.webp', duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
  { id: 40, title: 'Shingles vaccination (Zostavax)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//shingles.jpeg', duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
  { id: 41, title: 'Anti-malarials', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//malarials.jpeg', duration: '20 mins', category: 'Private Service', description: 'Travel consultation and prescription of the most effective anti-malarial regimen for your destination.' },
  { id: 42, title: 'HPV', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Human Papillomavirus (HPV)' },
  { id: 43, title: 'Dengue Fever', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Dengue Fever' },
];

// IDs configuration
const PRIVATE_IDS    = [1,3,4,6,7,8,10,12,18,20,22,23,24,25,26,9,28,29,90,89];
const VACCINE_IDS    = [17, 30,31,32,33,34,35,36,37,38,39,40];
const SEASONAL_IDS   = [];  // COVID-19
const COMING_SOON_IDS= [17];  // Yellow fever

const tabs = [
  { key: 'ALL',      label: 'All Treatments' },
  { key: 'NHS',      label: 'NHS Services' },
  { key: 'PHARMACY', label: 'Pharmacy First' },
  { key: 'PRIVATE',  label: 'Private Treatments' },
  { key: 'TRAVEL',   label: 'Travel Vaccinations' },
];

const HEADER_HEIGHT = 64;

const styles: Record<string, CSSProperties> = {
  pageWrapper:      { paddingTop: HEADER_HEIGHT, backgroundColor: '#fff' },
  container:        { maxWidth: 720, margin: '0 auto', padding: '0 0.5rem' },
  breadcrumb:       { padding: '0.5rem 0 0.5rem 1rem', backgroundColor: '#fff' },
  pagePath:         { display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', color: '#000' },
  sep:              { margin: '0 0.5rem', color: '#999' },
  pageTitle:        { fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: '#0d1b3e' },
  pageSubtitle:     { fontSize: '1.1rem', color: '#677294', marginBottom: '1.5rem', maxWidth: '600px' },
  tabs:             { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', scrollMarginTop: HEADER_HEIGHT + 'px' },
  tabBtn:           {
    position: 'relative',
    padding: '1.5rem 2rem',
    border: 'none',
    borderRadius: '2rem',
    backgroundColor: '#f2f2f2',
    color: '#0d1b3e',
    cursor: 'pointer',
    transition: 'background-color 0.2s,color 0.2s',
    minWidth: 120,
    width: '90%'
  },
  popup:            {
    position: 'fixed',
    top: HEADER_HEIGHT + 16,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '90%',
    maxWidth: 360,
    maxHeight: '70vh',
    overflowY: 'auto',
    background: 'hsl(209, 64%, 80%)',
    borderRadius: 12,
    padding: '0.5rem 0',
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  popupItem:        {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    color: '#0d1b3e',
  },
  servicesSection:  { backgroundColor: '#edf1f7', padding: '2rem 0' },
  row:              { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
  col:              { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
  card:             {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 3px 2px rgba(0, 0, 0, 0.2)',
  },
  imgWrapper:       { position: 'relative', overflow: 'hidden' },
  img:              { width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.3s ease' },
  badgeDuration:    { position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' },
  cardBody:         { padding: 16 },
  categoryBadge:    { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '0.4rem', marginBottom: 8, display: 'inline-block' },
  cardTitle:        { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' },
  cardText:         { fontSize: '1rem', color: '#677294' },
};

const chevronStyle: CSSProperties = {
  background: '#1C2B39',
  border: 'none',
  borderRadius: '50%',
  fontSize: '26px',
  color: '#829fe7',
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.1s ease, background 0.2s ease',
};

const ServicePage: React.FC = () => {
  const [ searchParams ] = useSearchParams();
  const navigate = useNavigate();
  const paramTab = (searchParams.get('tab') || 'ALL').toUpperCase();
  const [ activeTab, setActiveTab ] = useState<string>(paramTab);
  const [ popupOpenFor, setPopupOpenFor ] = useState<string | null>(null);
  const [ selectedPopupId, setSelectedPopupId ] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [switchOnFor, setSwitchOnFor] = useState<string | null>(null);
  const [pressedChevron, setPressedChevron] = useState<'prev'|'next'|null>(null);

  useEffect(() => { setActiveTab(paramTab); }, [paramTab]);
  useEffect(() => { tabsRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeTab]);

  const isSeasonal   = (id: number) => SEASONAL_IDS.includes(id);
  const isComingSoon = (id: number) => COMING_SOON_IDS.includes(id);

  const filtered = allServices
    .filter(s => {
      switch (activeTab) {
        case 'ALL':     return true;
        case 'NHS':     return s.category === 'NHS Service';
        case 'PHARMACY':return s.category === 'Pharmacy First';
        case 'PRIVATE': return PRIVATE_IDS.includes(s.id);
        case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
        default:        return false;
      }
    })
    .sort((a,b) => a.title.localeCompare(b.title));

  const popupServices = popupOpenFor
    ? allServices
        .filter(s => {
          switch (popupOpenFor) {
            case 'ALL':     return true;
            case 'NHS':     return s.category === 'NHS Service';
            case 'PHARMACY':return s.category === 'Pharmacy First';
            case 'PRIVATE': return PRIVATE_IDS.includes(s.id);
            case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
            default:        return false;
          }
        })
        .sort((a,b) => a.title.localeCompare(b.title))
    : [];

  return (
    <>
      <Header />
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <nav style={styles.breadcrumb}>
            <Link to="/">Home</Link>
            <span style={styles.sep}>›</span>
            <span style={{ fontWeight: 500 }}>Services</span>
          </nav>
          <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
          <p style={styles.pageSubtitle}>
            Choose your treatment, book online, then visit us in-store for expert care.
          </p>

          {/* Tabs */}
          <div
            ref={tabsRef}
            style={{ ...styles.tabs, width: '98%', margin: '1rem auto', gap: 0 }}
          >
            {tabs.map(t => {
              const isOn = switchOnFor === t.key;
              return (
                <div
                  key={t.key}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 50,
                    margin: '0.1rem 0 0.7rem 0.3rem',
                    display: 'inline-block',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ position: 'absolute', top: 15, right: 20, zIndex: 10 }}>
                    <ToggleSwitch
                      isOn={isOn}
                      onToggle={() => {
                        setSwitchOnFor(prev => (prev === t.key ? null : t.key));
                        setTimeout(() => {
                          setPopupOpenFor(prev => (prev === t.key ? null : t.key));
                          setSelectedPopupId(null);
                          setActiveTab(t.key);
                        }, 500);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab(t.key);
                      if (popupOpenFor && popupOpenFor !== t.key) setPopupOpenFor(null);
                    }}
                    style={{
                      ...styles.tabBtn,
                      width: '100%',
                      height: '100%',
                      paddingTop: '0.5rem',
                      paddingBottom: '0.5rem',
                      marginBottom: '-0.5rem',
                      position: 'relative',
                      zIndex: 1,
                      ...(activeTab === t.key
                        ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
                        : {}),
                    }}
                  >
                    {t.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popup */}
        {popupOpenFor && (
          <div style={styles.popup}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.6rem 1rem', borderBottom: '1px solid #ccc',
              background: '#0b2d66', color: '#acc0e3',
              position: 'sticky', top: 0, zIndex: 2,
            }}>
              <button
                onClick={() => {
                  const idx = tabs.findIndex(x => x.key === popupOpenFor);
                  const prev = tabs[(idx-1+tabs.length)%tabs.length].key;
                  setPopupOpenFor(prev); setActiveTab(prev);
                }}
                onMouseDown={() => setPressedChevron('prev')}
                onMouseUp={()   => setPressedChevron(null)}
                onMouseLeave={()=> setPressedChevron(null)}
                style={{
                  ...chevronStyle,
                  transform: pressedChevron==='prev' ? 'scale(1.2)' : 'scale(1)',
                }}
              >‹</button>
              <span>{tabs.find(x => x.key===popupOpenFor)!.label}</span>
              <button
                onClick={() => {
                  const idx = tabs.findIndex(x => x.key === popupOpenFor);
                  const next = tabs[(idx+1)%tabs.length].key;
                  setPopupOpenFor(next); setActiveTab(next);
                }}
                onMouseDown={() => setPressedChevron('next')}
                onMouseUp={()   => setPressedChevron(null)}
                onMouseLeave={()=> setPressedChevron(null)}
                style={{
                  ...chevronStyle,
                  transform: pressedChevron==='next' ? 'scale(1.2)' : 'scale(1)',
                }}
              >›</button>
            </div>
            <ul style={{ listStyle:'none', margin:0, padding:0 }}>
              {popupServices.map(s => {
                const seasonal = isSeasonal(s.id);
                const soon     = isComingSoon(s.id);
                const disabled = seasonal || soon;
                return (
                  <li
                    key={s.id}
                    onClick={() => {
                      if (disabled) return;
                      setSelectedPopupId(s.id);
                      setTimeout(() => navigate(`/book/${s.id}`), 600);
                    }}
                    style={{
                      ...styles.popupItem,
                      opacity: disabled ? 0.6 : 1,
                      cursor: disabled ? 'default' : 'pointer',
                      pointerEvents: disabled ? 'none' : 'auto',
                      background: selectedPopupId===s.id ? '#829fe7' : 'transparent',
                      position: 'relative',
                    }}
                  >
                    <span>{s.title}</span>
                    {(seasonal||soon) && (
                      <span style={{
                        position: 'absolute', right:10, top:'50%',
                        transform:'translateY(-50%)',
                        background: soon? '#ffc107':'#1ee0c5',
                        color:   soon? '#000'   :'#0d1b3e',
                        padding:'2px 6px',
                        borderRadius:'0.5rem',
                        fontSize:'0.7rem',
                        fontWeight:600,
                      }}>
                        {soon? 'Coming soon':'Seasonal'}
                      </span>
                    )}
                    <span style={{
                      display:'inline-block',
                      width:16, height:16,
                      borderRadius:'50%',
                      border:'2px solid #0d1b3e',
                      background: selectedPopupId===s.id ? '#007bff':'transparent',
                    }}/>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Services grid */}
        <section style={styles.servicesSection}>
          <div style={styles.container}>
            <div style={styles.row}>
              {filtered.map(s => {
                const seasonal = isSeasonal(s.id);
                const soon     = isComingSoon(s.id);
                const disabled = seasonal || soon;
                const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
                  disabled ? (
                    <div style={{ pointerEvents:'none', opacity:0.6, position:'relative' }}>
                      {children}
                    </div>
                  ) : (
                    <Link to={s.id === 13 ? '/oral-contraceptives' : `/book/${s.id}`} style={styles.card}>
  {children}
</Link>
                  );

                return (
                  <div key={s.id} style={styles.col}>
                    <Wrapper>
                      <div style={styles.imgWrapper}>
                        <img
                          src={s.img}
                          alt={s.title}
                          style={styles.img}
                          onMouseEnter={e => !disabled && (e.currentTarget.style.transform='scale(1.06)')}
                          onMouseLeave={e => !disabled && (e.currentTarget.style.transform='scale(1)')}
                        />
                        <span style={styles.badgeDuration}>⏱{s.duration}</span>
                        {(seasonal||soon) && (
                          <div style={{
                            position:'absolute', top:0,left:0,right:0,bottom:0,
                            background:'rgba(255,255,255,0.7)',
                            display:'flex',alignItems:'center',justifyContent:'center',
                            fontSize:'1.25rem',fontWeight:600,color:'#333',
                          }}>
                            {soon ? 'Coming soon' : 'Seasonal'}
                          </div>
                        )}
                      </div>
                      <div style={styles.cardBody}>
                        {(() => {
                          const isVaccine = VACCINE_IDS.includes(s.id);
                          const badgeText = isVaccine ? 'Vaccination' : s.category;
                          const bgColor   = isVaccine
                                            ? '#ffc107'
                                            : s.category==='Private Service' ? '#0d6efd'
                                            : s.category==='NHS Service'     ? '#0dcaf0'
                                            :                                   '#198754';
                          const fgColor   = isVaccine || s.category==='NHS Service' ? '#000' : '#fff';
                          return (
                            <span style={{
                              ...styles.categoryBadge,
                              backgroundColor: bgColor,
                              color: fgColor,
                            }}>
                              {badgeText}
                            </span>
                          );
                        })()}
                        <h5 style={styles.cardTitle}>{s.title}</h5>
                        <p style={styles.cardText}>{s.description}</p>
                      </div>
                    </Wrapper>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePage;


// import React, { useState, useEffect, useRef, CSSProperties } from 'react';
// import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// import Header from '../Header';


// // 1) Insert this ToggleSwitch component under your imports:

// const ToggleSwitch: React.FC<{
//   isOn: boolean;
//   onToggle: () => void;
// }> = ({ isOn, onToggle }) => {
//   const width = 40;
//   const height = 20;
//   const thumb = 16;
//   const pad = 2;
//   return (
//     <button
//       onClick={onToggle}
//       aria-pressed={isOn}
//       style={{
//         border: 'none',
//         background: 'transparent',
//         padding: 0,
//         cursor: 'pointer',
//         position: 'relative',
//         width,
//         height,
//         borderRadius: height / 2,
//         backgroundColor: isOn ? '#007bff' : '#ccc',
//         transition: 'background-color 0.2s',
//       }}
//     >
//       <div
//         style={{
//           position: 'absolute',
//           top: pad,
//           left: isOn ? width - thumb - pad : pad,
//           width: thumb,
//           height: thumb,
//           borderRadius: '50%',
//           backgroundColor: '#fff',
//           transition: 'left 0.2s',
//         }}
//       />
//     </button>
//   );
// };


// interface Service {
//   id: number;
//   title: string;
//   img: string;
//   duration: string;
//   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
//   description: string;
// }


// export const allServices: Service[] = [
//   { id: 1, title: 'Altitude sickness', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/133875/KhhXvoL3hS.webp', duration: '20 mins', category: 'Private Service', description: 'Prevents nausea, dizziness and headaches at altitude.' },
//   { id: 2, title: 'Sore throat', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/507276/Iug3MtaspO.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Soothes irritation and helps you swallow comfortably.' },
//   { id: 3, title: 'Travel Consultation', img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp', duration: '20 mins', category: 'Private Service', description: 'Expert advice on vaccinations and prophylaxis.' },
//   { id: 4, title: 'Travel vaccine', img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/810793/M8XAcWPBe6.webp', duration: '20 mins', category: 'Private Service', description: 'Comprehensive vaccine service for your trip.' },
//   { id: 5, title: 'Uncomplicated UTI (Women)', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/963546/K6YOS9cMH3.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treatment without GP appointment for quick relief.' },
//   { id: 6, title: 'Vitamin B12 Injection', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/219742/pu-_f9Dh4vv.webp', duration: '20 mins', category: 'Private Service', description: 'Injectable boost for energy, mood and vitality.' },
//   { id: 7, title: 'Impetigo', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/373143/s9tYLb2pEs.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Rapid management of bacterial skin infection.' },
//   { id: 8, title: 'Infected insect bite', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/120232/wfvV667Tx4.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treats infection, reduces swelling and pain.' },
//   { id: 90, title: 'Period Delay', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp', duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
//   { id: 89, title: 'Period Pain', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp', duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
//   { id: 10, title: 'Private flu jab', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/281723/8K3Uhf06mK.webp', duration: '20 mins', category: 'Private Service', description: 'Quick, private flu vaccination in-store.' },
//   { id: 44, title: 'Shingles', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/314321/sewm1HLfSk.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Immediate access to shingles vaccination.' },
//   { id: 12, title: 'Weight Loss Management', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/904592/c10d6P2jks.webp', duration: '20 mins', category: 'Private Service', description: 'Clinical support for sustainable weight loss.' },
//   { id: 13, title: 'Oral Contraception', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/769543/KbbzRigIaf.webp', duration: '10 mins', category: 'NHS Service', description: 'Fast, confidential contraception service.' },
//   { id: 14, title: 'Flu Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp', duration: '10 mins', category: 'NHS Service', description: 'Free NHS flu jab to keep you protected.' },
//   { id: 15, title: 'Blood pressure check', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/865410/rcaOjteI-1.webp', duration: '10 mins', category: 'NHS Service', description: 'Quick assessment to detect hypertension.' },
//   { id: 16, title: 'COVID-19 Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp', duration: '10 mins', category: 'NHS Service', description: 'Free COVID-19 booster for eligible patients.' },
//   { id: 17, title: 'Yellow fever', img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg', duration: '20 mins', category: 'Private Service', description: 'Coming Soon' },
//   { id: 18, title: 'Ear wax removal', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp', duration: '20 mins', category: 'Private Service', description: 'Safe microsuction for clear, comfortable ears.' },
//   { id: 19, title: 'Earache', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treatment and advice for painful ear infections.' },
//   { id: 20, title: 'Erectile dysfunction', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/925070/h4R8QTz0jv.webp', duration: '20 mins', category: 'Private Service', description: 'Discreet assessment and prescription service.' },
//   { id: 21, title: 'Sinusitis', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Fast relief from sinus pressure and pain.' },
//   { id: 22, title: 'Acid Reflux', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//acid%20reflux.jpeg', duration: '20 mins', category: 'Private Service', description: 'Personalised prescription to relieve heartburn, indigestion and acid regurgitation.' },
//   { id: 23, title: 'Pain Relief', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//acid%20reflux.jpeg', duration: '20 mins', category: 'Private Service', description: 'Our prescribing pharmacist may provide a short course of Naproxen 500 mg for effective pain management, where clinically appropriate.' },
//   { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//baldness.jpeg', duration: '20 mins', category: 'Private Service', description: 'Targeted treatment for androgenic alopecia.' },
//   { id: 25, title: 'Female Hirsutism in Women', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//vaniqa.jpeg', duration: '20 mins', category: 'Private Service', description: 'Topical therapy to reduce excessive facial hair.' },
//   { id: 26, title: 'Jet Lag', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//jet%20lag.jpeg', duration: '20 mins', category: 'Private Service', description: 'Combat disturbed sleep patterns and fatigue when traveling across time zones.' },
//   { id: 9, title: 'Traveller’s Diarrhoea', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Azithromycin to treat traveller’s diarrhoea.' },
//   { id: 28, title: 'Oral Thrush', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Get oral solution or gel to treat oral thrush' },
//   { id: 29, title: 'Hay Fever', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Fexofenadine or Dymista for Hay Fever' },
//   { id: 30, title: 'Diphtheria, Tetanus and Polio', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//polio.webp', duration: '20 mins', category: 'Private Service', description: 'Single-dose protection against diphtheria, tetanus & polio.' },
//   { id: 31, title: 'Hepatitis A (2 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-a.webp', duration: '20 mins', category: 'Private Service', description: 'Complete two-dose course to prevent Hep A infection.' },
//   { id: 32, title: 'Hepatitis B (3 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-b.webp', duration: '20 mins', category: 'Private Service', description: 'Full three-dose immunisation for Hep B protection.' },
//   { id: 33, title: 'Typhoid (1 dose or orally)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//thypoid.webp', duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
//   { id: 34, title: 'Rabies (3 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//rabies.webp', duration: '20 mins', category: 'Private Service', description: 'Post-exposure or pre-travel three-dose course.' },
//   { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//umra.png', duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
//   { id: 36, title: 'Cholera', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//cholera.webp', duration: '20 mins', category: 'Private Service', description: 'Two-dose oral vaccine for cholera prevention.' },
//   { id: 37, title: 'Japanese Encephalitis', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//japanese.webp', duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito-borne Japanese encephalitis.' },
//   { id: 38, title: 'Chicken pox', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp', duration: '20 mins', category: 'Private Service', description: 'Private immunisation against chickenpox.' },
//   { id: 39, title: 'Meningitis B', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//meningitis%20b.webp', duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
//   { id: 40, title: 'Shingles vaccination (Zostavax)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//shingles.jpeg', duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
//   { id: 41, title: 'Anti-malarials', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//malarials.jpeg', duration: '20 mins', category: 'Private Service', description: 'Travel consultation and prescription of the most effective anti-malarial regimen for your destination.' },
//   { id: 42, title: 'HPV', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Human Papillomavirus (HPV)' },
//   { id: 43, title: 'Dengue Fever', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Dengue Fever' },
// ];

// const VACCINE_IDS = [
//   30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40
// ];

// const PRIVATE_IDS = [
//   1, 3, 4, 6, 7, 8, 10, 12, 18, 20,
//   22, 23, 24, 25, 26, 9, 28, 29, 90, 89
// ];




// const COMING_SOON = new Set(['Yellow fever']);
// const POPUP_COMING_SOON = new Set([ 'Yellow fever']);

// const tabs = [
//   { key: 'ALL',      label: 'All Treatments' },
//   { key: 'NHS',      label: 'NHS Services' },
//   { key: 'PHARMACY', label: 'Pharmacy First' },
//   { key: 'PRIVATE',  label: 'Private Treatments' },
//   { key: 'TRAVEL',   label: 'Travel Vaccinations' },
// ];

// const HEADER_HEIGHT = 64;

// const styles: Record<string, CSSProperties> = {
//   pageWrapper:      { paddingTop: HEADER_HEIGHT, backgroundColor: '#fff' },
//   container:        { maxWidth: 720, margin: '0 auto', padding: '0 0.5rem' },
//   breadcrumb:       { padding: '0.5rem 0 0.5rem 1rem', backgroundColor: '#fff' },
//   pagePath:         { display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', color: '#000' },
//   sep:              { margin: '0 0.5rem', color: '#999' },
//   pageTitle:        { fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: '#0d1b3e' },
//   pageSubtitle:     { fontSize: '1.1rem', color: '#677294', marginBottom: '1.5rem', maxWidth: '600px' },
//   tabs:             { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', scrollMarginTop: HEADER_HEIGHT + 'px' },
//   tabBtn:           {
//     position: 'relative',
//     padding: '1.5rem 2rem',  // extra right padding for switch
//     border: 'none',
//     borderRadius: '2rem',
//     backgroundColor: '#f2f2f2',
//     color: '#0d1b3e',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s,color 0.2s',
//     minWidth: 120,
//     width: '90%'
//   },
  
//   popup:            {
//     position: 'fixed',
//     top: HEADER_HEIGHT + 16,
//     left: '50%',
   
//     transform: 'translateX(-50%)',
//     width: '90%',
//     maxWidth: 360,
//     maxHeight: '70vh',
//     overflowY: 'auto',
//     background: 'hsl(209, 64%, 80%)',
//     borderRadius: 12,
//     padding: '0.5rem 0',
//     zIndex: 1000,
//     boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//   },
//   popupItem:        {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: '0.75rem 1rem',
//     cursor: 'pointer',
//     color: '#0d1b3e',
//   },
//   servicesSection:  { backgroundColor: '#edf1f7', padding: '2rem 0' },
//   row:              { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
//   col:              { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
//   card: { 
//           display: 'flex',
//           flexDirection: 'column',
//           backgroundColor: '#fff',
//           borderRadius: '0.75rem',
//         overflow: 'hidden',
//           textDecoration: 'none',
//          transition: 'transform 0.2s, box-shadow 0.2s',
//         /* subtle box shadow around each card */
//         boxShadow: '0 3px 2px rgba(0, 0, 0, 0.2)',
//         },  imgWrapper:       { position: 'relative', overflow: 'hidden' },
//   img:              { width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.3s ease' },
//   badgeDuration:    { position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' },
//   cardBody:         { padding: 16 },
//   categoryBadge:    { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '0.4rem', marginBottom: 8, display: 'inline-block' },
//   cardTitle:        { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' },
//   cardText:         { fontSize: '1rem', color: '#677294' },
// };



// const chevronStyle: CSSProperties = {
//   background: '#1C2B39',
//   border: 'none',
//   borderRadius: '50%',
//   fontSize: '26px',
//   color: '#829fe7',
//   width: 32,
//   height: 32,
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
//   cursor: 'pointer',
//   transition: 'transform 0.1s ease, background 0.2s ease',
// };

// const ServicePage: React.FC = () => {
//   const [ searchParams ] = useSearchParams();
//   const navigate = useNavigate();

//   const paramTab = (searchParams.get('tab') || 'ALL').toUpperCase();
//   const [ activeTab, setActiveTab ] = useState<string>(paramTab);
//   const [ popupOpenFor, setPopupOpenFor ] = useState<string | null>(null);
//   const [ selectedPopupId, setSelectedPopupId ] = useState<number | null>(null);
//   const tabsRef = useRef<HTMLDivElement>(null);
//   const [switchOnFor, setSwitchOnFor] = useState<string | null>(null);

//   const [pressedChevron, setPressedChevron] = useState< 'prev' | 'next' | null >(null);



//   useEffect(() => {
//     setActiveTab(paramTab);
//   }, [paramTab]);

//   useEffect(() => {
//     tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [activeTab]);

//   const filtered = allServices
//     .filter(s => {
//       switch (activeTab) {
//         case 'ALL':     return true;
//         case 'NHS':     return s.category === 'NHS Service';
//         case 'PHARMACY':return s.category === 'Pharmacy First';
//         case 'PRIVATE':  return PRIVATE_IDS.includes(s.id);
//         case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
//     default:        return false;
//       }
//     })
//     .sort((a, b) => a.title.localeCompare(b.title));

//   const popupServices = popupOpenFor
//     ? allServices
//         .filter(s => {
//           switch (popupOpenFor) {
//             case 'ALL':     return true;
//             case 'NHS':     return s.category === 'NHS Service';
//             case 'PHARMACY':return s.category === 'Pharmacy First';
//             case 'PRIVATE':  return PRIVATE_IDS.includes(s.id);
//             case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
//             default:        return false;
//           }
//         })
//         .sort((a, b) => a.title.localeCompare(b.title))
//     : [];

//     const isDisabled = (s: Service) => s.id === 16;

//   return (
//     <>
//       <Header />

//       <div style={styles.pageWrapper}>
//         <div style={styles.container}>
//           <div style={styles.breadcrumb}>
//             <nav style={styles.pagePath}>
//               <Link to="/">Home</Link>
//               <span style={styles.sep}>›</span>
//               <span style={{ fontWeight: 500 }}>Services</span>
//             </nav>
//           </div>
//           <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
//           <p style={styles.pageSubtitle}>
//             Choose your treatment, book online, then visit us in-store for expert care.
//           </p>

//        {/* Tabs with swipe-buttons */}
//        {/* Tabs with swipe-buttons */}
//        <div
//   ref={tabsRef}
//   style={{
//     ...styles.tabs,
//     width: '98%',
//     margin: '1rem auto',
//     gap: 0,   
//   }}
// >
//   {tabs.map(t => {
//     // visual state of the switch is driven by switchOnFor
//     const isOn = switchOnFor === t.key;

//     return (
//       <div
//         key={t.key}
//         style={{
//           position: 'relative',      // for absolute positioning of the switch
//           width: '100%',              // tab spans full container
//           height: '50px',             // give the button some height
//           margin: '0.1rem 0 0.7rem 0.3rem', // spacing
//           display: 'inline-block',    // wrap into multiple lines if needed
//           textAlign: 'center',        // center the button’s label
//         }}
//       >
//         {/* Floating swipe toggle above the tab */}
//         <div
//           style={{
//             position: 'absolute',
//             top: 15,                  // float it above the button
//             right: 20,                // nudge left/right as desired
//             zIndex: 10,               // keep it on top
//           }}
//         >
//          <ToggleSwitch
//   isOn={isOn}
//   onToggle={() => {
//     // flip visual immediately
//     setSwitchOnFor(prev => (prev === t.key ? null : t.key));

//     // then after 2 s, open/close the popup
//     setTimeout(() => {
//       setPopupOpenFor(prev => (prev === t.key ? null : t.key));
//       setSelectedPopupId(null);
//       setActiveTab(t.key);
//     }, 500);
//   }}
// />

//         </div>

//         {/* The tab button itself */}
//         <button
//           onClick={() => {
//             setActiveTab(t.key);
//             // immediately close popup if it’s open on another tab
//             if (popupOpenFor && popupOpenFor !== t.key) {
//               setPopupOpenFor(null);
//             }
//           }}
//           style={{
//             ...styles.tabBtn,
//             width: '100%',           // fill its parent
//             height: '100%',          // match the 50px height set above
//             paddingTop: '0.5rem',    // so text doesn’t overlap the switch
//             paddingBottom: '0.5rem',
//             marginBottom: '-0.5rem', // pull it up under the floating switch
//             position: 'relative',
//             zIndex: 1,               // sit under the switch
//             ...(activeTab === t.key
//               ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
//               : {}),
//           }}
//         >
//           {t.label}
//         </button>
//       </div>
//     );
//   })}
// </div>


// </div>


//   {/* Popup list */}
//   {popupOpenFor && (
//   <div style={styles.popup}>
//     {/* Popup header */}
  
// <div style={{
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'space-between',
//   padding: '0.6rem 1rem',
//   borderBottom: '1px solid #ccc',
//   fontWeight: 600,
//   fontSize: '18px',
//   background: '#0b2d66',
//   color: '#acc0e3',
//   position: 'sticky',
//   top: 0,
//   zIndex: 2,
// }}>
//   {/* Prev chevron */}
//   <button
//     onClick={() => {
//       const idx = tabs.findIndex(x => x.key === popupOpenFor);
//       const prev = tabs[(idx - 1 + tabs.length) % tabs.length].key;
//       setPopupOpenFor(prev);
//       setActiveTab(prev);
//     }}
//     onMouseDown={() => setPressedChevron('prev')}
//     onMouseUp={() => setPressedChevron(null)}
//     onMouseLeave={() => setPressedChevron(null)}
//     style={{
//       ...chevronStyle,
//       transform: pressedChevron === 'prev' ? 'scale(1.2)' : 'scale(1)',
//     }}
//   >
//     ‹
//   </button>

//   <span>{tabs.find(x => x.key === popupOpenFor)!.label}</span>

//   {/* Next chevron */}
//   <button
//     onClick={() => {
//       const idx = tabs.findIndex(x => x.key === popupOpenFor);
//       const next = tabs[(idx + 1) % tabs.length].key;
//       setPopupOpenFor(next);
//       setActiveTab(next);
//     }}
//     onMouseDown={() => setPressedChevron('next')}
//     onMouseUp={() => setPressedChevron(null)}
//     onMouseLeave={() => setPressedChevron(null)}
//     style={{
//       ...chevronStyle,
//       transform: pressedChevron === 'next' ? 'scale(1.2)' : 'scale(1)',
//     }}
//   >
//     ›
//   </button>
// </div>


//     {/* Popup list */}
// <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
//   {popupServices.map(s => {
//     const isSoonPopup = POPUP_COMING_SOON.has(s.title);
//     const selected = selectedPopupId === s.id;
//     return (
//       <li
//         key={s.id}
//         onClick={() => {
//           if (isSoonPopup) return;
//           setSelectedPopupId(s.id);
//           setTimeout(() => navigate(`/book/${s.id}`), 600);
//         }}
//         style={{
//           ...styles.popupItem,
//           background: selected ? '#829fe7' : 'transparent',
//           cursor: isSoonPopup ? 'default' : 'pointer',
//           position: 'relative',            // to position the badge
//           pointerEvents: isSoonPopup ? 'none' : 'auto',
//           opacity: isSoonPopup ? 0.6 : 1,
//         }}
//       >
//         <span>{s.title}</span>
//         {isSoonPopup && (
//           <span style={{
//             position: 'absolute',
//             right: 10,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             background: '#ffc107',
//             color: '#000',
//             padding: '2px 6px',
//             borderRadius: '0.5rem',
//             fontSize: '0.7rem',
//             fontWeight: 600,
//           }}>
//             Coming soon
//           </span>
//         )}
//         <span style={{
//           display: 'inline-block',
//           width: 16,
//           height: 16,
//           borderRadius: '50%',
//           border: '2px solid #0d1b3e',
//           background: selected ? '#007bff' : 'transparent',
//         }} />
//       </li>
//     );
//   })}
// </ul>

//   </div>
// )}

//         {/* Services grid */}
//         <section style={styles.servicesSection}>
//           <div style={styles.container}>
//             <div style={styles.row}>
//               {filtered.map(s => {
//                 const isSoon = COMING_SOON.has(s.title);
//                 const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
//                   isSoon ? (
//                     <div style={{ pointerEvents: 'none', cursor: 'default', position: 'relative' }}>
//                       {children}
//                     </div>
//                   ) : (
//                     <Link to={`/book/${s.id}`} className="service-card" style={styles.card}>
//                       {children}
//                     </Link>
//                   );

//                 return (
//                   <div key={s.id} style={styles.col}>
//                     <Wrapper>
//                       <div style={styles.imgWrapper}>
//                         <img
//                           src={s.img}
//                           alt={s.title}
//                           style={styles.img}
//                           onMouseEnter={e => !isSoon && (e.currentTarget.style.transform = 'scale(1.06)')}
//                           onMouseLeave={e => !isSoon && (e.currentTarget.style.transform = 'scale(1)')}
//                         />
//                         <span style={styles.badgeDuration}>⏱{s.duration}</span>
//                         {isSoon && (
//                           <div style={{
//                             position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
//                             background: 'rgba(255,255,255,0.7)',
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                             fontSize: '1.25rem', fontWeight: 600, color: '#333',
//                           }}>
//                             Coming Soon
//                           </div>
//                         )}
//                       </div>
//                       <div style={styles.cardBody}>
//                       {(() => {
//   // IDs 30–40 we want to mark as “Vaccination”
//   const isVaccine = s.id >= 30 && s.id <= 40;
//   const badgeText = isVaccine ? 'Vaccination' : s.category;
//   const bgColor   = isVaccine ? '#ffc107'
//                    : s.category === 'Private Service' ? '#0d6efd'
//                    : s.category === 'NHS Service'     ? '#0dcaf0'
//                    :                                   '#198754';
//   const fgColor   = isVaccine ? '#000'
//                    : s.category === 'NHS Service'     ? '#000'
//                    :                                   '#fff';

//   return (
//     <span style={{
//       ...styles.categoryBadge,
//       backgroundColor: bgColor,
//       color: fgColor,
//     }}>
//       {badgeText}
//     </span>
//   );
// })()}

//                         <h5 style={styles.cardTitle}>{s.title}</h5>
//                         <p style={styles.cardText}>{s.description}</p>
//                       </div>
//                     </Wrapper>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default ServicePage;




// import React, { useState, useEffect, useRef, CSSProperties } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Header';

// interface Service {
//   id: number;
//   title: string;
//   img: string;
//   duration: string;
//   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
//   description: string;
// }

// const allServices: Service[] = [
//   { id: 1,  title: 'Altitude sickness',               img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/133875/KhhXvoL3hS.webp', duration: '20 mins', category: 'Private Service', description: 'Prevents nausea, dizziness and headaches at altitude.' },
//   { id: 2,  title: 'Sore throat',                     img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/507276/Iug3MtaspO.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Soothes irritation and helps you swallow comfortably.' },
//   { id: 3,  title: 'Travel Consultation',             img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp',         duration: '20 mins', category: 'Private Service', description: 'Expert advice on vaccinations and prophylaxis.' },
//   { id: 4,  title: 'Travel vaccine',                  img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/810793/M8XAcWPBe6.webp',         duration: '20 mins', category: 'Private Service', description: 'Comprehensive vaccine service for your trip .' },
//   { id: 5,  title: 'Uncomplicated UTI (Women)',       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/963546/K6YOS9cMH3.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treatment without GP appointment for quick relief.' },
//   { id: 6,  title: 'Vitamin B12 Injection',           img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/219742/pu-_f9Dh4vv.webp',     duration: '20 mins', category: 'Private Service', description: 'Injectable boost for energy, mood and vitality.' },
//   { id: 7,  title: 'Hair loss',                       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/660941/A94GbKY5xM.webp',     duration: '20 mins', category: 'Private Service', description: 'Personalised treatment plans for fuller hair.' },
//   { id: 8,  title: 'Impetigo',                        img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/373143/s9tYLb2pEs.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Rapid management of bacterial skin infection.' },
//   { id: 9,  title: 'Infected insect bite',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/120232/wfvV667Tx4.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treats infection, reduces swelling and pain.' },
//   { id: 10, title: 'Period delay',                    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp',     duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
//   { id: 11, title: 'Private flu jab',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/281723/8K3Uhf06mK.webp',     duration: '20 mins', category: 'Private Service', description: 'Quick, private flu vaccination in‐store.' },
//   { id: 12, title: 'Shingles',                        img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/314321/sewm1HLfSk.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Immediate access to shingles vaccination.' },
//   { id: 13, title: 'Weight loss clinic',              img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/904592/c10d6P2jks.webp',     duration: '20 mins', category: 'Private Service', description: 'Clinical support for sustainable weight loss.' },
//   { id: 14, title: 'Oral Contraception',              img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/769543/KbbzRigIaf.webp',     duration: '10 mins', category: 'NHS Service',      description: 'Fast, confidential contraception service.' },
//   { id: 15, title: 'Flu Vaccination',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp',     duration: '10 mins', category: 'NHS Service',      description: 'Free NHS flu jab to keep you protected.' },
//   { id: 16, title: 'Blood pressure check',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/865410/rcaOjteI-1.webp',    duration: '10 mins', category: 'NHS Service',      description: 'Quick assessment to detect hypertension.' },
//   { id: 17, title: 'COVID-19 Vaccination',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp',    duration: '10 mins', category: 'NHS Service',      description: 'Free COVID‐19 booster for eligible patients.' },
//   { id: 18, title: 'Chicken pox',              img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp',    duration: '20 mins', category: 'Private Service', description: 'Private immunisation against chickenpox.' },
//   { id: 19, title: 'Ear wax removal',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp',    duration: '20 mins', category: 'Private Service', description: 'Safe microsuction for clear, comfortable ears.' },
//   { id: 20, title: 'Earache',                         img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treatment and advice for painful ear infections.' },
//   { id: 21, title: 'Erectile dysfunction',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/925070/h4R8QTz0jv.webp',    duration: '20 mins', category: 'Private Service', description: 'Discreet assessment and prescription service.' },
//   { id: 22, title: 'Sinusitis',                       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp',    duration: '10 mins', category: 'Pharmacy First',   description: 'Fast relief from sinus pressure and pain.' },

//   { id: 23, title: 'Diphtheria, tetanus and polio (1 dose)',     img: '…', duration: '20 mins', category: 'Private Service', description: 'Single‐dose protection against diphtheria, tetanus & polio.' },
//   { id: 24, title: 'Hepatitis A (2 doses - day 0 & 6–12 months)', img: '…', duration: '20 mins', category: 'Private Service', description: 'Complete two‐dose course to prevent Hep A infection.' },
//   { id: 25, title: 'Hepatitis B (3 doses)',                      img: '…', duration: '20 mins', category: 'Private Service', description: 'Full three‐dose immunisation for Hep B protection.' },
//   { id: 26, title: 'Typhoid (1 dose or orally)',                 img: '…', duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
//   { id: 27, title: 'Rabies (3 doses)',                           img: '…', duration: '20 mins', category: 'Private Service', description: 'Post‐exposure or pre‐travel three‐dose course.' },
//   { id: 28, title: 'Meningitis (1 dose – for Hajj/Umrah)',      img: '…', duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
//   { id: 29, title: 'Cholera (2 doses – special cases)',          img: '…', duration: '20 mins', category: 'Private Service', description: 'Two‐dose oral vaccine for cholera prevention.' },
//   { id: 30, title: 'Japanese Encephalitis',                      img: '…', duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito‐borne Japanese encephalitis.' },
//   { id: 31, title: 'Chicken pox',                                img: '…', duration: '20 mins', category: 'Private Service', description: 'Private varicella vaccine for susceptible adults.' },
//   { id: 32, title: 'Meningitis B',                               img: '…', duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
//   { id: 33, title: 'Shingles (Zostavax)',                        img: '…', duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
//   { id: 34, title: 'Anti-malarials',                             img: '…', duration: '20 mins', category: 'Private Service', description: 'Prescription for 3–4 day anti‐malarial regimen.' },

// ];

// const tabs = [
//   { key: 'ALL', label: 'All Treatments' },
//   { key: 'NHS', label: 'NHS Services' },
//   { key: 'PHARMACY', label: 'Pharmacy First' },
//   { key: 'PRIVATE', label: 'Private Treatments' },
//   { key: 'TRAVEL',    label: 'Travel Vaccinations' }, 
// ];

// const HEADER_HEIGHT = 64; // adjust to your actual <Header> height in px

// const styles: Record<string, CSSProperties> = {
//   pageWrapper: {
//     paddingTop: HEADER_HEIGHT,
//     backgroundColor: '#ffffff',
//   },
//   container: {
//     maxWidth: 720,
//     margin: '0 auto',
//     padding: '0 0.5rem',
//   },
//   breadcrumb: {
//     padding: '0.5rem 0 0.5rem 1rem',
//     backgroundColor: '#ffffff',
//   },
//   pagePath: {
//     display: 'inline-flex',
//     alignItems: 'center',
//     fontSize: '0.9rem',
//     color: '#000000',
//   },
//   sep: {
//     margin: '0 0.5rem',
//     color: '#999999',
//   },
//   pageTitle: {
//     fontSize: '2.5rem',
//     fontWeight: 800,
//     margin: '1rem 0',
//     color: '#0d1b3e',
//   },
//   pageSubtitle: {
//     fontSize: '1.1rem',
//     color: '#677294',
//     marginBottom: '1.5rem',
//     maxWidth: '600px',
//   },
//   tabs: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     gap: '0.75rem',
//     justifyContent: 'center',
//     marginBottom: '2rem',
//     scrollMarginTop: HEADER_HEIGHT + 'px',
//   },
//   tabBtn: {
//     padding: '0.6rem 1.2rem',
//     border: 'none',
//     borderRadius: '2rem',
//     backgroundColor: '#f2f2f2',
//     color: '#0d1b3e',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s, color 0.2s',
//   },
//   servicesSection: {
//     backgroundColor: '#edf1f7',
//     padding: '2rem 0',
//   },
//   row: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     margin: '0 -0.5rem',
//   },
//   col: {
//     padding: '0 0.5rem',
//     marginBottom: '1rem',
//     flex: '1 0 300px',
//   },
//   card: {
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#ffffff',
//     borderRadius: '0.75rem',
//     overflow: 'hidden',
//     textDecoration: 'none',
//     transition: 'transform 0.2s',
//   },
//   imgWrapper: {
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   img: {
//     width: '100%',
//     height: 220,
//     objectFit: 'cover',
//     transition: 'transform 0.3s ease',
//   },
//   badgeDuration: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     background: 'rgba(0,0,0,0.6)',
//     color: '#ffffff',
//     padding: '2px 6px',
//     borderRadius: 4,
//     fontSize: '0.75rem',
//   },
//   cardBody: {
//     padding: 16,
//   },
//   categoryBadge: {
//     fontSize: '0.75rem',
//     padding: '4px 8px',
//     borderRadius: '0.4rem',
//     marginBottom: 8,
//     display: 'inline-block',
//   },
//   cardTitle: {
//     fontSize: '1.25rem',
//     margin: '8px 0',
//     color: '#0d1b3e',
//   },
//   cardText: {
//     fontSize: '1rem',
//     color: '#677294',
//   },
// };

// const ServicePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('ALL');
//   const tabsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [activeTab]);

//   const filtered = allServices
//   .filter((s) => {
//     if (activeTab === 'ALL') return true;
//     if (activeTab === 'NHS') return s.category === 'NHS Service';
//     if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
//     if (activeTab === 'PRIVATE') 
//       return s.category === 'Private Service' && s.id < 23;
//     if (activeTab === 'TRAVEL') 
//       return s.category === 'Private Service' && s.id >= 23 && s.id <= 34;
//     return true;
//   })
//   .sort((a, b) => a.title.localeCompare(b.title));


//   return (
//     <>
//       <Header />

//       <div style={styles.pageWrapper}>
//         <div style={styles.container}>
//           <div style={styles.breadcrumb}>
//             <nav style={styles.pagePath}>
//               <Link to="/">Home</Link>
//               <span style={styles.sep}>›</span>
//               <span style={{ fontWeight: 500 }}>Services</span>
//             </nav>
//           </div>

//           <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
//           <p style={styles.pageSubtitle}>
//             Choose your treatment, book online, then visit us in-store for expert care.
//           </p>

//           <div ref={tabsRef} style={styles.tabs}>
//             {tabs.map((t) => (
//               <button
//                 key={t.key}
//                 onClick={() => setActiveTab(t.key)}
//                 style={{
//                   ...styles.tabBtn,
//                   ...(activeTab === t.key
//                     ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
//                     : {}),
//                 }}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <section style={styles.servicesSection}>
//           <div style={styles.container}>
//             <div style={styles.row}>
//               {filtered.map((s) => (
//                 <div key={s.id} style={styles.col}>
//                   <Link
//                     to={`/book/${s.id}`}
//                     style={styles.card}
//                     onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
//                     onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
//                   >
//                     <div style={styles.imgWrapper}>
//                       <img
//                         src={s.img}
//                         alt={s.title}
//                         style={styles.img}
//                         onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
//                         onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//                         onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
//                         onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//                       />
//                       <span style={styles.badgeDuration}>⏱{s.duration}</span>
//                     </div>
//                     <div style={styles.cardBody}>
//                       <span
//                         style={{
//                           ...styles.categoryBadge,
//                           backgroundColor:
//                             s.category === 'Private Service'
//                               ? '#0d6efd'
//                               : s.category === 'NHS Service'
//                               ? '#0dcaf0'
//                               : '#198754',
//                           color: s.category === 'NHS Service' ? '#000000' : '#ffffff',
//                         }}
//                       >
//                         {s.category}
//                       </span>
//                       <h5 style={styles.cardTitle}>{s.title}</h5>
//                       <p style={styles.cardText}>{s.description}</p>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default ServicePage;

// // src/pages/auth/ServicePage.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Header';

// interface Service {
//   id: number;
//   title: string;
//   img: string;
//   duration: string;
//   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
//   description: string;
// }

// const allServices: Service[] = [
//   {
//     id: 1,
//     title: 'Altitude sickness',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Prevents symptoms like nausea, dizziness and headaches',
//   },
//   {
//     id: 2,
//     title: 'Sore throat',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'Feel better and swallow easily',
//   },
//   {
//     id: 3,
//     title: 'Travel Consultation',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.',
//   },
//   {
//     id: 4,
//     title: 'Travel vaccine',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Peace of mind for a healthy journey',
//   },
//   {
//     id: 5,
//     title: 'Uncomplicated UTI (Women)',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'No need to book a GP appointment',
//   },
//   {
//     id: 6,
//     title: 'Vitamin B12 Injection',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'NHS Service',
//     description: 'Boosts your energy and fights tiredness',
//   },
//   {
//     id: 7,
//     title: 'Hair loss',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Tailored solutions designed to meet your needs',
//   },
//   {
//     id: 8,
//     title: 'Impetigo',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'Quick relief from itching and sore skin',
//   },
//   {
//     id: 9,
//     title: 'Infected insect bite',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'No need for a GP visit',
//   },
//   {
//     id: 10,
//     title: 'Period delay',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Safe and easy to use treatment',
//   },
//   {
//     id: 11,
//     title: 'Private flu jab',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Convenient option with no long waiting times',
//   },
//   {
//     id: 12,
//     title: 'Shingles',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'Quick access to care through the Pharmacy First scheme',
//   },
//   {
//     id: 13,
//     title: 'Weight loss clinic',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Clinically proven weight loss of up to 22%*',
//   },
//   {
//     id: 14,
//     title: 'Oral Contraception',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'NHS Service',
//     description: 'Easy to access at your local pharmacy',
//   },
//   {
//     id: 15,
//     title: 'Flu vaccination',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'NHS Service',
//     description: 'Reduces your risk of being hospitalised from flu.',
//   },
//   {
//     id: 16,
//     title: 'Blood pressure check',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'NHS Service',
//     description: 'Detects high blood pressure before it causes problems',
//   },
//   {
//     id: 17,
//     title: 'COVID-19 Vaccination',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'NHS Service',
//     description: 'Free for adults 65 and over on the NHS',
//   },
//   {
//     id: 18,
//     title: 'Chickenpox vaccine',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Quick and easy vaccine at Coleshill Pharmacy',
//   },
//   {
//     id: 19,
//     title: 'Ear wax removal',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: '+10 years of experience performing microsuction procedures',
//   },
//   {
//     id: 20,
//     title: 'Earache',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'Easy treatments for quick recovery',
//   },
//   {
//     id: 21,
//     title: 'Erectile dysfunction',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Private Service',
//     description: 'Improves your ability to achieve and maintain an erection',
//   },
//   {
//     id: 22,
//     title: 'Sinusitis',
//     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75',
//     duration: '20 mins',
//     category: 'Pharmacy First',
//     description: 'Say goodbye to sinus pain',
//   },
// ];

// const tabs = [
//   { key: 'ALL',      label: 'All Treatments'     },
//   { key: 'PRIVATE',  label: 'Private Treatments' },
//   { key: 'NHS',      label: 'NHS Services'       },
//   { key: 'PHARMACY', label: 'Pharmacy First'     },
// ];


// const headerHeight = 64; // match your Header’s real height in px

// const styles = {
//   pageWrapper: {
//     paddingTop: headerHeight,   // pushes content right below header
//     backgroundColor: '#ffffff',
//   } as React.CSSProperties,
//   container: { maxWidth: 720, margin: '0 auto', padding: '0 0.5rem' } as React.CSSProperties,
//   breadcrumb: { padding: '0.5rem 0 0.5rem 1rem', backgroundColor: '#fff' } as React.CSSProperties,
//   pagePath: { display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', color: '#000' } as React.CSSProperties,
//   sep: { margin: '0 0.5rem', color: '#999' } as React.CSSProperties,
//   pageTitle: { fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: '#0d1b3e' } as React.CSSProperties,
//   pageSubtitle: { fontSize: '1.1rem', color: '#677294', marginBottom: '1.5rem' } as React.CSSProperties,
//   tabs: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem' } as React.CSSProperties,
//   tabBtn: {
//     padding: '0.6rem 1.2rem',
//     border: 'none',
//     borderRadius: '2rem',
//     backgroundColor: '#f2f2f2',
//     color: '#0d1b3e',
//     cursor: 'pointer',
//     transition: '0.2s',
//   } as React.CSSProperties,
//   servicesSection: { backgroundColor: '#edf1f7', padding: '2rem 0' } as React.CSSProperties,
//   row: { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' } as React.CSSProperties,
//   col: { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' } as React.CSSProperties,
//   card: {
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     borderRadius: '0.75rem',
//     overflow: 'hidden',
//     textDecoration: 'none',
//     transition: 'transform 0.2s',
//   } as React.CSSProperties,
//   imgWrapper: { position: 'relative', overflow: 'hidden' } as React.CSSProperties,
//   img: { width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.3s' } as React.CSSProperties,
//   badgeDuration: {
//     position: 'absolute',
//     bottom: 8,
//     left: 8,
//     background: 'rgba(0,0,0,0.6)',
//     color: '#fff',
//     padding: '2px 6px',
//     borderRadius: 4,
//     fontSize: '0.75rem',
//   } as React.CSSProperties,
//   cardBody: { padding: 16 } as React.CSSProperties,
//   categoryBadge: { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '0.4rem', marginBottom: 8 } as React.CSSProperties,
//   cardTitle: { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' } as React.CSSProperties,
//   cardText: { fontSize: '1rem', color: '#677294' } as React.CSSProperties,
// };

// const ServicePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('ALL');
//   const mainRef = useRef<HTMLDivElement>(null);

//   // scroll up whenever the tab changes
//   useEffect(() => {
//     mainRef.current?.scrollIntoView({ block: 'start' });
//   }, [activeTab]);

//   const filtered = allServices
//     .filter(s => {
//       if (activeTab === 'ALL') return true;
//       if (activeTab === 'PRIVATE') return s.category === 'Private Service';
//       if (activeTab === 'NHS') return s.category === 'NHS Service';
//       if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
//       return true;
//     })
//     .sort((a, b) => a.title.localeCompare(b.title));

//   return (
//     <>
//       <Header/>
//       <div ref={mainRef} style={styles.pageWrapper}>
//         <div style={styles.container}>
//           <div style={styles.breadcrumb}>
//             <nav style={styles.pagePath}>
//               <Link to="/">Home</Link>
//               <span style={styles.sep}>›</span>
//               <span style={{ fontWeight: 500 }}>Services</span>
//             </nav>
//           </div>
//           <h1 style={styles.pageTitle}>All Treatments & Services</h1>
//           <p style={styles.pageSubtitle}>
//             Choose your treatment, book online, then visit us in-store for expert care.
//           </p>
//           <div style={styles.tabs}>
//             {tabs.map(t => (
//               <button
//                 key={t.key}
//                 onClick={() => setActiveTab(t.key)}
//                 style={{
//                   ...styles.tabBtn,
//                   ...(activeTab === t.key && {
//                     backgroundColor: '#0d1b3e',
//                     color: '#1ee0c5',
//                   }),
//                 }}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <section style={styles.servicesSection}>
//           <div style={styles.container}>
//             <div style={styles.row}>
//               {filtered.map(s => (
//                 <div key={s.id} style={styles.col}>
//                   <Link
//                     to={`/book/${s.id}`}
//                     style={styles.card}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
//                   >
//                     <div style={styles.imgWrapper}>
//                       <img
//                         src={s.img}
//                         alt={s.title}
//                         style={styles.img}
//                         onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                         onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                       />
//                       <span style={styles.badgeDuration}>⏱{s.duration}</span>
//                     </div>
//                     <div style={styles.cardBody}>
//                       <span
//                         style={{
//                           ...styles.categoryBadge,
//                           backgroundColor:
//                             s.category === 'Private Service'
//                               ? '#0d6efd'
//                               : s.category === 'NHS Service'
//                               ? '#0dcaf0'
//                               : '#198754',
//                           color: s.category === 'NHS Service' ? '#000' : '#fff',
//                         }}
//                       >
//                         {s.category}
//                       </span>
//                       <h5 style={styles.cardTitle}>{s.title}</h5>
//                       <p style={styles.cardText}>{s.description}</p>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default ServicePage;




// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import Header from '../Header';
// // import './ServicePage.css';

// // interface Service {
// //   id: number;
// //   title: string;
// //   img: string;
// //   duration: string;
// //   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
// //   description: string;
// // }

// // const allServices: Service[] = [
// //   {
// //     id: 1,
// //     title: 'Altitude sickness',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Prevents symptoms like nausea, dizziness and headaches',
// //   },
// //   {
// //     id: 2,
// //     title: 'Sore throat',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'Feel better and swallow easily',
// //   },
// //   {
// //     id: 3,
// //     title: 'Travel Consultation',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.',
// //   },
// //   {
// //     id: 4,
// //     title: 'Travel vaccine',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Peace of mind for a healthy journey',
// //   },
// //   {
// //     id: 5,
// //     title: 'Uncomplicated UTI (Women)',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'No need to book a GP appointment',
// //   },
// //   {
// //     id: 6,
// //     title: 'Vitamin B12 Injection',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'NHS Service',
// //     description: 'Boosts your energy and fights tiredness',
// //   },
// //   {
// //     id: 7,
// //     title: 'Hair loss',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Tailored solutions designed to meet your needs',
// //   },
// //   {
// //     id: 8,
// //     title: 'Impetigo',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'Quick relief from itching and sore skin',
// //   },
// //   {
// //     id: 9,
// //     title: 'Infected insect bite',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'No need for a GP visit',
// //   },
// //   {
// //     id: 10,
// //     title: 'Period delay',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Safe and easy to use treatment',
// //   },
// //   {
// //     id: 11,
// //     title: 'Private flu jab',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Convenient option with no long waiting times',
// //   },
// //   {
// //     id: 12,
// //     title: 'Shingles',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'Quick access to care through the Pharmacy First scheme',
// //   },
// //   {
// //     id: 13,
// //     title: 'Weight loss clinic',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Clinically proven weight loss of up to 22%*',
// //   },
// //   {
// //     id: 14,
// //     title: 'Oral Contraception',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'NHS Service',
// //     description: 'Easy to access at your local pharmacy',
// //   },
// //   {
// //     id: 15,
// //     title: 'Flu vaccination',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'NHS Service',
// //     description: 'Reduces your risk of being hospitalised from flu.',
// //   },
// //   {
// //     id: 16,
// //     title: 'Blood pressure check',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'NHS Service',
// //     description: 'Detects high blood pressure before it causes problems',
// //   },
// //   {
// //     id: 17,
// //     title: 'COVID-19 Vaccination',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'NHS Service',
// //     description: 'Free for adults 65 and over on the NHS',
// //   },
// //   {
// //     id: 18,
// //     title: 'Chickenpox vaccine',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Quick and easy vaccine at Coleshill Pharmacy',
// //   },
// //   {
// //     id: 19,
// //     title: 'Ear wax removal',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: '+10 years of experience performing microsuction procedures',
// //   },
// //   {
// //     id: 20,
// //     title: 'Earache',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'Easy treatments for quick recovery',
// //   },
// //   {
// //     id: 21,
// //     title: 'Erectile dysfunction',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Private Service',
// //     description: 'Improves your ability to achieve and maintain an erection',
// //   },
// //   {
// //     id: 22,
// //     title: 'Sinusitis',
// //     img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75',
// //     duration: '20 mins',
// //     category: 'Pharmacy First',
// //     description: 'Say goodbye to sinus pain',
// //   },
// // ];

// // const tabs = [
// //   { key: 'ALL', label: 'All' },
// //   { key: 'PRIVATE', label: 'Private Treatments' },
// //   { key: 'NHS', label: 'NHS Services' },
// //   { key: 'PHARMACY', label: 'Pharmacy First' },
// // ];

// // const ServicePage: React.FC = () => {
// //   const [activeTab, setActiveTab] = useState<string>('ALL');

// //   const filtered = allServices
// //     .filter((s) => {
// //       if (activeTab === 'ALL') return true;
// //       if (activeTab === 'PRIVATE') return s.category === 'Private Service';
// //       if (activeTab === 'NHS') return s.category === 'NHS Service';
// //       if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
// //       return true;
// //     })
// //     .sort((a, b) => a.title.localeCompare(b.title));

// //   return (
// //     <>
// //       <Header />

// //       <div style={{ paddingTop: 30, backgroundColor: '#ffffff' }}>
// //         <div className="container pb-2">
// //           {/* Breadcrumb / Page Path */}
// //           <nav className="page-path">
// //             <Link to="/">Home</Link>
// //             <span className="sep">›</span>
// //             <span className="current">Services</span>
// //           </nav>

// //           {/* Title & Subtitle */}
// //           <h1 className="page-title">All treatments and services</h1>
// //           <p className="page-subtitle">
// //             To get started, choose your treatment, book an appointment and come visit us in store.
// //           </p>

// //           {/* Tabs */}
// //           <div className="tabs">
// //             {tabs.map((tab) => (
// //               <button
// //                 key={tab.key}
// //                 className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
// //                 onClick={() => setActiveTab(tab.key)}
// //               >
// //                 {tab.label.toUpperCase()}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Services Section */}
// //       <section className="services-section py-4">
// //       <div className="container-fluid px-4">
// //           <div className="row gx-2 gy-4 justify-content-center">
// //             {filtered.map((service) => (
// //               <div key={service.id} className="col-sm-12 col-md-6 col-lg-4">
// //                 {/* Link to /book/:id */}
// //                 <Link to={`/book/${service.id}`} className="text-decoration-none">
// //                   <div className="card h-100 shadow-sm border-0 service-card custom-card-width">
// //                     <div className="position-relative overflow-hidden">
// //                       <img
// //                         src={service.img}
// //                         className="card-img-top zoom-hover"
// //                         alt={service.title}
// //                         style={{ height: '220px', objectFit: 'cover' }}
// //                       />
// //                       <span className="duration-badge">⏱ {service.duration}</span>
// //                     </div>
// //                     <div className="card-body">
// //                       <span
// //                         className={`badge mb-2 ${
// //                           service.category === 'Private Service'
// //                             ? 'bg-primary'
// //                             : service.category === 'NHS Service'
// //                             ? 'bg-info text-dark'
// //                             : 'bg-success'
// //                         }`}
// //                       >
// //                         {service.category}
// //                       </span>
// //                       <h5 className="card-title mb-1 text-dark">{service.title}</h5>
// //                       <p className="card-text text-muted">{service.description}</p>
// //                     </div>
// //                   </div>
// //                 </Link>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // };

// // export default ServicePage;

// // import React, { useState } from 'react';
// // import { Link } from 'react-router-dom';
// // import Header from '../Header';
// // import './ServicePage.css';

// // interface Service {
// //   id: number;
// //   title: string;
// //   img: string;
// //   duration: string;
// //   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
// //   description: string;
// // }

// // const allServices: Service[] = [
// //     {
// //       id: 1,
// //       title: 'Altitude sickness',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Prevents symptoms like nausea, dizziness and headaches',
// //     },
// //     {
// //       id: 2,
// //       title: 'Sore throat',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'Feel better and swallow easily',
// //     },
// //     {
// //       id: 3,
// //       title: 'Travel Consultation',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.',
// //     },
// //     {
// //       id: 4,
// //       title: 'Travel vaccine',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Peace of mind for a healthy journey',
// //     },
// //     {
// //       id: 5,
// //       title: 'Uncomplicated UTI (Women)',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'No need to book a GP appointment',
// //     },
// //     {
// //       id: 6,
// //       title: 'Vitamin B12 Injection',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'NHS Service',
// //       description: 'Boosts your energy and fights tiredness',
// //     },
// //     {
// //       id: 7,
// //       title: 'Hair loss',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Tailored solutions designed to meet your needs',
// //     },
// //     {
// //       id: 8,
// //       title: 'Impetigo',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'Quick relief from itching and sore skin',
// //     },
// //     {
// //       id: 9,
// //       title: 'Infected insect bite',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'No need for a GP visit',
// //     },
// //     {
// //       id: 10,
// //       title: 'Period delay',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Safe and easy to use treatment',
// //     },
// //     {
// //       id: 11,
// //       title: 'Private flu jab',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Convenient option with no long waiting times',
// //     },
// //     {
// //       id: 12,
// //       title: 'Shingles',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'Quick access to care through the Pharmacy First scheme',
// //     },
// //     {
// //       id: 13,
// //       title: 'Weight loss clinic',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Clinically proven weight loss of up to 22%*',
// //     },
// //     {
// //       id: 14,
// //       title: 'Oral Contraception',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'NHS Service',
// //       description: 'Easy to access at your local pharmacy',
// //     },
// //     {
// //       id: 15,
// //       title: 'Flu vaccination',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'NHS Service',
// //       description: 'Reduces your risk of being hospitalised from flu.',
// //     },
// //     {
// //       id: 16,
// //       title: 'Blood pressure check',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'NHS Service',
// //       description: 'Detects high blood pressure before it causes problems',
// //     },
// //     {
// //       id: 17,
// //       title: 'COVID-19 Vaccination',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'NHS Service',
// //       description: 'Free for adults 65 and over on the NHS',
// //     },
// //     {
// //       id: 18,
// //       title: 'Chickenpox vaccine',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Quick and easy vaccine at Coleshill Pharmacy',
// //     },
// //     {
// //       id: 19,
// //       title: 'Ear wax removal',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: '+10 years of experience performing microsuction procedures',
// //     },
// //     {
// //       id: 20,
// //       title: 'Earache',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'Easy treatments for quick recovery',
// //     },
// //     {
// //       id: 21,
// //       title: 'Erectile dysfunction',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Private Service',
// //       description: 'Improves your ability to achieve and maintain an erection',
// //     },
// //     {
// //       id: 22,
// //       title: 'Sinusitis',
// //       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75',
// //       duration: '20 mins',
// //       category: 'Pharmacy First',
// //       description: 'Say goodbye to sinus pain',
// //     },
// //   ];

// //   const tabs = [
// //     { key: 'ALL', label: 'All' },
// //     { key: 'PRIVATE', label: 'Private Treatments' },
// //     { key: 'NHS', label: 'NHS Services' },
// //     { key: 'PHARMACY', label: 'Pharmacy First' },
// //   ];
  
// //   const ServicePage: React.FC = () => {
// //     const [activeTab, setActiveTab] = useState<string>('ALL');
  
// //     const filtered = allServices
// //       .filter((s) => {
// //         if (activeTab === 'ALL') return true;
// //         if (activeTab === 'PRIVATE') return s.category === 'Private Service';
// //         if (activeTab === 'NHS') return s.category === 'NHS Service';
// //         if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
// //         return true;
// //       })
// //       .sort((a, b) => a.title.localeCompare(b.title));
  
// //     return (
// //       <>
// //         <Header />
  
// //         <div style={{ paddingTop: 110, backgroundColor: '#ffffff' }}>
// //           <div className="container pb-2  ">
// //             {/* Custom breadcrumb / path */}
// //             <nav className="page-path">
// //               <Link to="/">Home</Link>
// //               <span className="sep">›</span>
// //               <span className="current">Services</span>
// //             </nav>
  
// //             {/* Page title & subtitle */}
// //             <h1  className="page-title">All treatments and services</h1>
// //             <p className="page-subtitle">
// //               To get started, choose your treatment, book an appointment and come visit us in store.
// //             </p>
  
// //             {/* Tabs */}
// //             <div className="tabs">
// //               {tabs.map((tab) => (
// //                 <button
// //                   key={tab.key}
// //                   className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
// //                   onClick={() => setActiveTab(tab.key)}
// //                 >
// //                   {tab.label.toUpperCase()}
// //                 </button>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
  
// //         {/* Services Section */}
// //         <section className="services-section py-3">
// //           <div className="container">
// //             <div className="row">
// //               {filtered.map((service) => (
// //                 <div key={service.id} className="col-md-6 col-lg-4 mb-4" style={{ paddingTop: '30px' }}>
// //                   <div className="card h-100 shadow-sm border-0 service-card custom-card-width">
// //                     <div className="position-relative overflow-hidden">
// //                       <img
// //                         src={service.img}
// //                         className="card-img-top zoom-hover"
// //                         alt={service.title}
// //                         style={{ height: '220px', objectFit: 'cover' }}
// //                       />
// //                       <span
// //                         className="position-absolute"
// //                         style={{
// //                           bottom: '0.5rem',
// //                           left: '0.5rem',
// //                           background: 'rgba(0, 0, 0, 0)',
// //                           color: '#fff',
// //                           padding: '0.25rem 0.5rem',
// //                           borderRadius: 4,
// //                           fontSize: '0.8rem',
// //                         }}
// //                       >
// //                         ⏱ {service.duration}
// //                       </span>
// //                     </div>
// //                     <div className="card-body">
// //                       <span
// //                         className={`badge mb-3 ${
// //                           service.category === 'Private Service'
// //                             ? 'bg-primary'
// //                             : service.category === 'NHS Service'
// //                             ? 'bg-info text-dark'
// //                             : 'bg-success'
// //                         }`}
// //                       >
// //                         {service.category}
// //                       </span>
// //                       <h5 className="card-title mb-2">{service.title}</h5>
// //                       <p className="card-text text-muted mb-2">{service.description}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
// //       </>
// //     );
// //   };
  
// //   export default ServicePage;