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
  {
    id: 1,
    title: 'Altitude sickness',
    img: 'https://yourlocal-pharmacy.co.uk/wp-content/uploads/2024/09/hiker-summit-mountain-overlooking.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Prevents nausea, dizziness and headaches at altitude.',
  },
  {
    id: 2,
    title: 'Sore throat',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/507276/Iug3MtaspO.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Soothes irritation and helps you swallow comfortably.',
  },
  {
    id: 3,
    title: 'Travel Consultation',
    img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Expert advice on vaccinations and prophylaxis.',
  },
  {
    id: 4,
    title: 'Travel vaccine',
    img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/810793/M8XAcWPBe6.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Comprehensive vaccine service for your trip.',
  },
  {
    id: 5,
    title: 'Uncomplicated UTI (Women)',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/963546/K6YOS9cMH3.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Treatment without GP appointment for quick relief.',
  },
  {
    id: 6,
    title: 'Vitamin B12 Injection',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/219742/pu-_f9Dh4vv.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Injectable boost for energy, mood and vitality.',
  },
  {
    id: 7,
    title: 'Impetigo',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/373143/s9tYLb2pEs.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Rapid management of bacterial skin infection.',
  },
  {
    id: 8,
    title: 'Infected insect bite',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/120232/wfvV667Tx4.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Treats infection, reduces swelling and pain.',
  },
  {
    id: 90,
    title: 'Period Delay',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Safe hormonal delay for special occasions.',
  },
  {
    id: 89,
    title: 'Period Pain',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Treatment options for period pain, where suitable.',
  },
  {
    id: 10,
    title: 'Private flu jab',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/281723/8K3Uhf06mK.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Quick, private flu vaccination in-store.',
  },
  {
    id: 44,
    title: 'Shingles',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/314321/sewm1HLfSk.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Pharmacy First support and treatment for shingles.',
  },
  {
    id: 12,
    title: 'Weight Loss Clinic',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Clinical support for sustainable weight loss.',
  },
  {
    id: 13,
    title: 'Oral Contraception',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/pic.png',
    duration: '10 mins',
    category: 'NHS Service',
    description: 'Fast, confidential contraception service.',
  },
  {
    id: 14,
    title: 'Flu Vaccination',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp',
    duration: '5 mins',
    category: 'NHS Service',
    description: 'Free NHS flu jab to keep you protected.',
  },
  {
    id: 15,
    title: 'Blood pressure check',
    img: 'https://www.thebestofhealth.co.uk/wp-content/uploads/Blood-Pressure-check-doctors.jpg',
    duration: '10 mins',
    category: 'NHS Service',
    description: 'Quick assessment to detect hypertension.',
  },
  {
    id: 16,
    title: 'COVID-19 Vaccination',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp',
    duration: '5 mins',
    category: 'NHS Service',
    description: 'Free COVID-19 booster for eligible patients.',
  },
  // {
  //   id: 17,
  //   title: 'Yellow fever',
  //   img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
  //   duration: '20 mins',
  //   category: 'Private Service',
  //   description: 'Coming Soon',
  // },
  {
    id: 18,
    title: 'Ear wax removal',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Safe microsuction for clear, comfortable ears.',
  },
  {
    id: 19,
    title: 'Earache',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Treatment and advice for painful ear infections.',
  },
  {
    id: 20,
    title: 'Erectile dysfunction',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/ed.jpeg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Discreet assessment and prescription service.',
  },
  {
    id: 21,
    title: 'Sinusitis',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp',
    duration: '10 mins',
    category: 'Pharmacy First',
    description: 'Fast relief from sinus pressure and pain.',
  },
  {
    id: 22,
    title: 'Acid Reflux',
    img: 'https://www.london-ent.co.uk/wp-content/uploads/2025/05/reflux.png',
    duration: '20 mins',
    category: 'Private Service',
    description:
      'Personalised prescription to relieve heartburn, indigestion and acid regurgitation.',
  },
  {
    id: 23,
    title: 'Pain Relief',
    img: 'https://www.omnigel.com/blogs/wp-content/uploads/2023/12/Blog11.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description:
      'Our prescribing pharmacist may provide a short course of Naproxen 500 mg for effective pain management, where clinically appropriate.',
  },
  {
    id: 24,
    title: 'Male Pattern Baldness (Androgenic Alopecia)',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//baldness.jpeg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Targeted treatment for androgenic alopecia.',
  },
  {
    id: 25,
    title: 'Female Hirsutism in Women',
    img: 'https://cdn.shopify.com/s/files/1/2193/0943/files/Untitled_design_16_480x480.jpg?v=1628785572',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Topical therapy to reduce excessive facial hair.',
  },
  {
    id: 26,
    title: 'Jet Lag',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//jet%20lag.jpeg',
    duration: '20 mins',
    category: 'Private Service',
    description:
      'Combat disturbed sleep patterns and fatigue when traveling across time zones.',
  },
  {
    id: 9,
    title: 'Traveller’s Diarrhoea',
    img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Azithromycin to treat traveller’s diarrhoea.',
  },
  {
    id: 28,
    title: 'Oral Thrush',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS83i2TenZ7l3X4oiiNF-grg0hwcgLGROywRA&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Get oral solution or gel to treat oral thrush.',
  },
  {
    id: 29,
    title: 'Hay Fever',
    img: 'https://www.allergyuk.org/wp-content/uploads/2022/03/Hay-Fever-Homepage-Banner.png',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Fexofenadine or Dymista for Hay Fever.',
  },
  {
    id: 30,
    title: 'Diphtheria, Tetanus and Polio',
    img: 'https://hounslowclinic.co.uk/wp-content/uploads/2023/02/DTP.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Single-dose protection against diphtheria, tetanus & polio.',
  },
  {
    id: 31,
    title: 'Hepatitis A (2 doses)',
    img: 'https://www.cdc.gov/hepatitis-a/media/images/2024/04/hepatitis-a-vaccination-thumbnail.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Complete two-dose course to prevent Hep A infection.',
  },
  {
    id: 32,
    title: 'Hepatitis B (3 doses)',
    img: 'https://everestpharmacy.ca/wp-content/uploads/2023/04/unrecognizable-woman-getting-vac.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Full three-dose immunisation for Hep B protection.',
  },
  {
    id: 33,
    title: 'Typhoid (1 dose or orally)',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmmkiMn_sezFuURSr2qHHNuubFMs6QYYq6zg&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Choice of injectable or oral typhoid vaccination.',
  },
  {
    id: 34,
    title: 'Rabies (3 doses)',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqcfM5AWDvTRzPCNRIBr4OqK03DvAzbAjB5w&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Post-exposure or pre-travel three-dose course.',
  },
  {
    id: 35,
    title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpuLSpRW3XG6ujJwb_8_ID_7YKZTjKtvWYKA&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Required vaccine for Hajj & Umrah pilgrims.',
  },
  {
    id: 36,
    title: 'Cholera',
    img: 'https://beaconpharmacy.co.uk/wp-content/uploads/2025/06/whooping-cough-vaccine-great-barr.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Two-dose oral vaccine for cholera prevention.',
  },
  {
    id: 37,
    title: 'Japanese Encephalitis',
    img: 'https://milesclinic.co.uk/wp-content/uploads/2024/04/vaccination.jpeg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Protects against mosquito-borne Japanese encephalitis.',
  },
  {
    id: 38,
    title: 'Chicken pox',
    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Private immunisation against chickenpox.',
  },
  {
    id: 39,
    title: 'Meningitis B',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPJhskq8HxRHnyQOx-CNmqNwrhnMXSJk0IYw&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Protective dose against meningococcal B infection.',
  },
  {
    id: 40,
    title: 'Shingles vaccination (Zostavax)',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZNi6aW0RWIvKjQNyFlWbmIkJi8GnuIDMZzw&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Live vaccine for shingles prevention in adults.',
  },
  {
    id: 41,
    title: 'Anti-malarials',
    img: 'https://fieldspharmacy.uk/wp-content/uploads/2023/09/antimalarials-2.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description:
      'Travel consultation and prescription of the most effective anti-malarial regimen for your destination.',
  },
  {
    id: 42,
    title: 'HPV',
    img: 'https://www.pulsetoday.co.uk/wp-content/uploads/2022/02/one-dose-hpv-vaccine.jpg',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Vaccination against Human Papillomavirus (HPV).',
  },
  {
    id: 43,
    title: 'Dengue Fever',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhonnFjOhZsNNdyLmKbvDgGQYVRIWHVJauaw&s',
    duration: '20 mins',
    category: 'Private Service',
    description: 'Vaccination against Dengue Fever.',
  },
];

// IDs configuration
// Private treatments only. Pharmacy First and NHS services are excluded from this tab.
const PRIVATE_IDS = [
  1, 3, 4, 6, 10, 12, 18, 20, 22, 23, 24, 25, 26, 9, 28, 29, 90, 89,
];

// Vaccination / travel vaccine services.
// These appear under Travel Vaccinations and show as "Vaccination" under All Treatments.
const VACCINE_IDS = [
  17, // Yellow fever
  30, // Diphtheria, Tetanus and Polio
  31, // Hepatitis A
  32, // Hepatitis B
  33, // Typhoid
  34, // Rabies
  35, // Meningitis ACWY
  36, // Cholera
  37, // Japanese Encephalitis
  38, // Chicken pox
  39, // Meningitis B
  40, // Shingles vaccination
  42, // HPV
  43, // Dengue Fever
];

const SEASONAL_IDS: number[] = [];
const COMING_SOON_IDS = [17]; // Yellow fever

const tabs = [
  { key: 'ALL', label: 'All Treatments' },
  { key: 'NHS', label: 'NHS Services' },
  { key: 'PHARMACY', label: 'Pharmacy First' },
  { key: 'PRIVATE', label: 'Private Treatments' },
  { key: 'TRAVEL', label: 'Travel Vaccinations' },
];

const HEADER_HEIGHT = 64;

const styles: Record<string, CSSProperties> = {
  pageWrapper: { paddingTop: HEADER_HEIGHT, backgroundColor: '#fff' },
  container: { maxWidth: 720, margin: '0 auto', padding: '0 0.5rem' },
  breadcrumb: { padding: '0.5rem 0 0.5rem 1rem', backgroundColor: '#fff' },
  pagePath: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#000',
  },
  sep: { margin: '0 0.5rem', color: '#999' },
  pageTitle: {
    fontSize: '2.5rem',
    fontWeight: 800,
    margin: '1rem 0',
    color: '#0d1b3e',
  },
  pageSubtitle: {
    fontSize: '1.1rem',
    color: '#677294',
    marginBottom: '1.5rem',
    maxWidth: '600px',
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    scrollMarginTop: HEADER_HEIGHT + 'px',
  },
  tabBtn: {
    position: 'relative',
    padding: '1.5rem 2rem',
    border: 'none',
    borderRadius: '2rem',
    backgroundColor: '#f2f2f2',
    color: '#0d1b3e',
    cursor: 'pointer',
    transition: 'background-color 0.2s,color 0.2s',
    minWidth: 120,
    width: '90%',
  },
  popup: {
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
  popupItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    color: '#0d1b3e',
  },
  servicesSection: { backgroundColor: '#edf1f7', padding: '2rem 0' },
  row: { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
  col: { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 3px 2px rgba(0, 0, 0, 0.2)',
  },
  imgWrapper: { position: 'relative', overflow: 'hidden' },
  img: {
    width: '100%',
    height: 220,
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  badgeDuration: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.75rem',
  },
  cardBody: { padding: 16 },
  categoryBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '0.4rem',
    marginBottom: 8,
    display: 'inline-block',
  },
  cardTitle: { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' },
  cardText: { fontSize: '1rem', color: '#677294' },
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramTab = (searchParams.get('tab') || 'ALL').toUpperCase();

  const [activeTab, setActiveTab] = useState<string>(paramTab);
  const [popupOpenFor, setPopupOpenFor] = useState<string | null>(null);
  const [selectedPopupId, setSelectedPopupId] = useState<number | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [switchOnFor, setSwitchOnFor] = useState<string | null>(null);
  const [pressedChevron, setPressedChevron] = useState<'prev' | 'next' | null>(
    null
  );

  useEffect(() => {
    setActiveTab(paramTab);
  }, [paramTab]);

  useEffect(() => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab]);

  const isSeasonal = (id: number) => SEASONAL_IDS.includes(id);
  const isComingSoon = (id: number) => COMING_SOON_IDS.includes(id);
  const isVaccine = (id: number) => VACCINE_IDS.includes(id);

  const filterServiceByTab = (service: Service, tabKey: string): boolean => {
    const vaccine = isVaccine(service.id);

    switch (tabKey) {
      case 'ALL':
        return true;

      case 'NHS':
        return service.category === 'NHS Service';

      case 'PHARMACY':
        return service.category === 'Pharmacy First';

      case 'PRIVATE':
        return service.category === 'Private Service' && !vaccine;

      case 'TRAVEL':
        return vaccine;

      default:
        return false;
    }
  };

  const filtered = allServices
    .filter((service) => filterServiceByTab(service, activeTab))
    .sort((a, b) => a.title.localeCompare(b.title));

  const popupServices = popupOpenFor
    ? allServices
        .filter((service) => filterServiceByTab(service, popupOpenFor))
        .sort((a, b) => a.title.localeCompare(b.title))
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
            Choose your treatment, book online, then visit us in-store for
            expert care.
          </p>

          {/* Tabs */}
          <div
            ref={tabsRef}
            style={{
              ...styles.tabs,
              width: '98%',
              margin: '1rem auto',
              gap: 0,
            }}
          >
            {tabs.map((tab) => {
              const isOn = switchOnFor === tab.key;

              return (
                <div
                  key={tab.key}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 50,
                    margin: '0.1rem 0 0.7rem 0.3rem',
                    display: 'inline-block',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 15,
                      right: 20,
                      zIndex: 10,
                    }}
                  >
                    <ToggleSwitch
                      isOn={isOn}
                      onToggle={() => {
                        setSwitchOnFor((prev) =>
                          prev === tab.key ? null : tab.key
                        );

                        setTimeout(() => {
                          setPopupOpenFor((prev) =>
                            prev === tab.key ? null : tab.key
                          );
                          setSelectedPopupId(null);
                          setActiveTab(tab.key);
                        }, 500);
                      }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab(tab.key);

                      if (popupOpenFor && popupOpenFor !== tab.key) {
                        setPopupOpenFor(null);
                      }
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
                      ...(activeTab === tab.key
                        ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
                        : {}),
                    }}
                  >
                    {tab.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Popup */}
        {popupOpenFor && (
          <div style={styles.popup}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 1rem',
                borderBottom: '1px solid #ccc',
                background: '#0b2d66',
                color: '#acc0e3',
                position: 'sticky',
                top: 0,
                zIndex: 2,
              }}
            >
              <button
                onClick={() => {
                  const idx = tabs.findIndex((tab) => tab.key === popupOpenFor);
                  const prev = tabs[(idx - 1 + tabs.length) % tabs.length].key;

                  setPopupOpenFor(prev);
                  setActiveTab(prev);
                }}
                onMouseDown={() => setPressedChevron('prev')}
                onMouseUp={() => setPressedChevron(null)}
                onMouseLeave={() => setPressedChevron(null)}
                style={{
                  ...chevronStyle,
                  transform:
                    pressedChevron === 'prev' ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                ‹
              </button>

              <span>{tabs.find((tab) => tab.key === popupOpenFor)!.label}</span>

              <button
                onClick={() => {
                  const idx = tabs.findIndex((tab) => tab.key === popupOpenFor);
                  const next = tabs[(idx + 1) % tabs.length].key;

                  setPopupOpenFor(next);
                  setActiveTab(next);
                }}
                onMouseDown={() => setPressedChevron('next')}
                onMouseUp={() => setPressedChevron(null)}
                onMouseLeave={() => setPressedChevron(null)}
                style={{
                  ...chevronStyle,
                  transform:
                    pressedChevron === 'next' ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                ›
              </button>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {popupServices.map((service) => {
                const seasonal = isSeasonal(service.id);
                const soon = isComingSoon(service.id);
                const disabled = seasonal || soon;

                return (
                  <li
                    key={service.id}
                    onClick={() => {
                      if (disabled) return;

                      setSelectedPopupId(service.id);

                      setTimeout(() => navigate(`/book/${service.id}`), 600);
                    }}
                    style={{
                      ...styles.popupItem,
                      opacity: disabled ? 0.6 : 1,
                      cursor: disabled ? 'default' : 'pointer',
                      pointerEvents: disabled ? 'none' : 'auto',
                      background:
                        selectedPopupId === service.id
                          ? '#829fe7'
                          : 'transparent',
                      position: 'relative',
                    }}
                  >
                    <span>{service.title}</span>

                    {(seasonal || soon) && (
                      <span
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: soon ? '#ffc107' : '#1ee0c5',
                          color: soon ? '#000' : '#0d1b3e',
                          padding: '2px 6px',
                          borderRadius: '0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                        }}
                      >
                        {soon ? 'Coming soon' : 'Seasonal'}
                      </span>
                    )}

                    <span
                      style={{
                        display: 'inline-block',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        border: '2px solid #0d1b3e',
                        background:
                          selectedPopupId === service.id
                            ? '#007bff'
                            : 'transparent',
                      }}
                    />
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
              {filtered.map((service) => {
                const seasonal = isSeasonal(service.id);
                const soon = isComingSoon(service.id);
                const disabled = seasonal || soon;
                const vaccine = isVaccine(service.id);

                const Wrapper: React.FC<{ children: React.ReactNode }> = ({
                  children,
                }) =>
                  disabled ? (
                    <div
                      style={{
                        pointerEvents: 'none',
                        opacity: 0.6,
                        position: 'relative',
                      }}
                    >
                      {children}
                    </div>
                  ) : (
                    <Link
                      to={
                        service.id === 13
                          ? '/oral-contraceptives'
                          : `/book/${service.id}`
                      }
                      style={styles.card}
                    >
                      {children}
                    </Link>
                  );

                const badgeText = vaccine ? 'Vaccination' : service.category;
                const bgColor = vaccine
                  ? '#ffc107'
                  : service.category === 'Private Service'
                    ? '#0d6efd'
                    : service.category === 'NHS Service'
                      ? '#0dcaf0'
                      : '#198754';
                const fgColor =
                  vaccine || service.category === 'NHS Service'
                    ? '#000'
                    : '#fff';

                return (
                  <div key={service.id} style={styles.col}>
                    <Wrapper>
                      <div style={styles.imgWrapper}>
                        <img
                          src={service.img}
                          alt={service.title}
                          style={styles.img}
                          onMouseEnter={(e) => {
                            if (!disabled) {
                              e.currentTarget.style.transform = 'scale(1.06)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!disabled) {
                              e.currentTarget.style.transform = 'scale(1)';
                            }
                          }}
                        />

                        <span style={styles.badgeDuration}>
                          ⏱{service.duration}
                        </span>

                        {(seasonal || soon) && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: 'rgba(255,255,255,0.7)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.25rem',
                              fontWeight: 600,
                              color: '#333',
                            }}
                          >
                            {soon ? 'Coming soon' : 'Seasonal'}
                          </div>
                        )}
                      </div>

                      <div style={styles.cardBody}>
                        <span
                          style={{
                            ...styles.categoryBadge,
                            backgroundColor: bgColor,
                            color: fgColor,
                          }}
                        >
                          {badgeText}
                        </span>

                        <h5 style={styles.cardTitle}>{service.title}</h5>
                        <p style={styles.cardText}>{service.description}</p>
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

// // ToggleSwitch component
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
//   { id: 12, title: 'Weight Loss Clinic', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg', duration: '20 mins', category: 'Private Service', description: 'Clinical support for sustainable weight loss.' },
//   { id: 13, title: 'Oral Contraception', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/pic.png', duration: '10 mins', category: 'NHS Service', description: 'Fast, confidential contraception service.' },
//   { id: 14, title: 'Flu Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp', duration: '5 mins', category: 'NHS Service', description: 'Free NHS flu jab to keep you protected.' },
//   { id: 15, title: 'Blood pressure check', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/865410/rcaOjteI-1.webp', duration: '10 mins', category: 'NHS Service', description: 'Quick assessment to detect hypertension.' },
//   { id: 16, title: 'COVID-19 Vaccination', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp', duration: '5 mins', category: 'NHS Service', description: 'Free COVID-19 booster for eligible patients.' },
//   { id: 17, title: 'Yellow fever', img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg', duration: '20 mins', category: 'Private Service', description: 'Coming Soon' },
//   { id: 18, title: 'Ear wax removal', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp', duration: '20 mins', category: 'Private Service', description: 'Safe microsuction for clear, comfortable ears.' },
//   { id: 19, title: 'Earache', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Treatment and advice for painful ear infections.' },
//   { id: 20, title: 'Erectile dysfunction', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/ed.jpeg', duration: '20 mins', category: 'Private Service', description: 'Discreet assessment and prescription service.' },
//   { id: 21, title: 'Sinusitis', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp', duration: '10 mins', category: 'Pharmacy First', description: 'Fast relief from sinus pressure and pain.' },
//   { id: 22, title: 'Acid Reflux', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//acid%20reflux.jpeg', duration: '20 mins', category: 'Private Service', description: 'Personalised prescription to relieve heartburn, indigestion and acid regurgitation.' },
//   { id: 23, title: 'Pain Relief', img: 'https://www.omnigel.com/blogs/wp-content/uploads/2023/12/Blog11.jpg', duration: '20 mins', category: 'Private Service', description: 'Our prescribing pharmacist may provide a short course of Naproxen 500 mg for effective pain management, where clinically appropriate.' },
//   { id: 24, title: 'Male Pattern Baldness (Androgenic Alopecia)', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//baldness.jpeg', duration: '20 mins', category: 'Private Service', description: 'Targeted treatment for androgenic alopecia.' },
//   { id: 25, title: 'Female Hirsutism in Women', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//vaniqa.jpeg', duration: '20 mins', category: 'Private Service', description: 'Topical therapy to reduce excessive facial hair.' },
//   { id: 26, title: 'Jet Lag', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//jet%20lag.jpeg', duration: '20 mins', category: 'Private Service', description: 'Combat disturbed sleep patterns and fatigue when traveling across time zones.' },
//   { id: 9, title: 'Traveller’s Diarrhoea', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//travellers%20diarrhoea.jpeg', duration: '20 mins', category: 'Private Service', description: 'Azithromycin to treat traveller’s diarrhoea.' },
//   { id: 28, title: 'Oral Thrush', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS83i2TenZ7l3X4oiiNF-grg0hwcgLGROywRA&s', duration: '20 mins', category: 'Private Service', description: 'Get oral solution or gel to treat oral thrush' },
//   { id: 29, title: 'Hay Fever', img: 'https://www.allergyuk.org/wp-content/uploads/2022/03/Hay-Fever-Homepage-Banner.png', duration: '20 mins', category: 'Private Service', description: 'Fexofenadine or Dymista for Hay Fever' },
//   { id: 30, title: 'Diphtheria, Tetanus and Polio', img: 'https://hounslowclinic.co.uk/wp-content/uploads/2023/02/DTP.jpg', duration: '20 mins', category: 'Private Service', description: 'Single-dose protection against diphtheria, tetanus & polio.' },
//   { id: 31, title: 'Hepatitis A (2 doses)', img: 'https://www.cdc.gov/hepatitis-a/media/images/2024/04/hepatitis-a-vaccination-thumbnail.jpg', duration: '20 mins', category: 'Private Service', description: 'Complete two-dose course to prevent Hep A infection.' },
//   { id: 32, title: 'Hepatitis B (3 doses)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwrVY5APSsEYuFZxBfvdBgT0h-wobybqbkfg&s', duration: '20 mins', category: 'Private Service', description: 'Full three-dose immunisation for Hep B protection.' },
//   { id: 33, title: 'Typhoid (1 dose or orally)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmmkiMn_sezFuURSr2qHHNuubFMs6QYYq6zg&s', duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
//   { id: 34, title: 'Rabies (3 doses)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqcfM5AWDvTRzPCNRIBr4OqK03DvAzbAjB5w&s', duration: '20 mins', category: 'Private Service', description: 'Post-exposure or pre-travel three-dose course.' },
//   { id: 35, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpuLSpRW3XG6ujJwb_8_ID_7YKZTjKtvWYKA&s', duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
//   { id: 36, title: 'Cholera', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1qdq1Q8UKUwAn81ELPJRUJiy4fwmGVdglDw&s', duration: '20 mins', category: 'Private Service', description: 'Two-dose oral vaccine for cholera prevention.' },
//   { id: 37, title: 'Japanese Encephalitis', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPTnpCUxHJADk8ZinP7RoOlJpErH3m4PWvzA&s', duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito-borne Japanese encephalitis.' },
//   { id: 38, title: 'Chicken pox', img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp', duration: '20 mins', category: 'Private Service', description: 'Private immunisation against chickenpox.' },
//   { id: 39, title: 'Meningitis B', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPJhskq8HxRHnyQOx-CNmqNwrhnMXSJk0IYw&s', duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
//   { id: 40, title: 'Shingles vaccination (Zostavax)', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZNi6aW0RWIvKjQNyFlWbmIkJi8GnuIDMZzw&s', duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
//   { id: 41, title: 'Anti-malarials', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//malarials.jpeg', duration: '20 mins', category: 'Private Service', description: 'Travel consultation and prescription of the most effective anti-malarial regimen for your destination.' },
//   { id: 42, title: 'HPV', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Human Papillomavirus (HPV)' },
//   { id: 43, title: 'Dengue Fever', img: 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//hpv.jpeg', duration: '20 mins', category: 'Private Service', description: 'Vaccination against Dengue Fever' },
// ];

// // IDs configuration
// const PRIVATE_IDS    = [1,3,4,6,7,8,10,12,18,20,22,23,24,25,26,9,28,29,90,89];
// const VACCINE_IDS    = [17, 30,31,32,33,34,35,36,37,38,39,40];
// const SEASONAL_IDS   = [];  // COVID-19
// const COMING_SOON_IDS= [17];  // Yellow fever

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
//     padding: '1.5rem 2rem',
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
//     color: '#0d1b3e',
//   },
//   servicesSection:  { backgroundColor: '#edf1f7', padding: '2rem 0' },
//   row:              { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
//   col:              { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
//   card:             {
//     display: 'flex',
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     borderRadius: '0.75rem',
//     overflow: 'hidden',
//     textDecoration: 'none',
//     transition: 'transform 0.2s, box-shadow 0.2s',
//     boxShadow: '0 3px 2px rgba(0, 0, 0, 0.2)',
//   },
//   imgWrapper:       { position: 'relative', overflow: 'hidden' },
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
//   const [pressedChevron, setPressedChevron] = useState<'prev'|'next'|null>(null);

//   useEffect(() => { setActiveTab(paramTab); }, [paramTab]);
//   useEffect(() => { tabsRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeTab]);

//   const isSeasonal   = (id: number) => SEASONAL_IDS.includes(id);
//   const isComingSoon = (id: number) => COMING_SOON_IDS.includes(id);

//   const filtered = allServices
//     .filter(s => {
//       switch (activeTab) {
//         case 'ALL':     return true;
//         case 'NHS':     return s.category === 'NHS Service';
//         case 'PHARMACY':return s.category === 'Pharmacy First';
//         case 'PRIVATE': return PRIVATE_IDS.includes(s.id);
//         case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
//         default:        return false;
//       }
//     })
//     .sort((a,b) => a.title.localeCompare(b.title));

//   const popupServices = popupOpenFor
//     ? allServices
//         .filter(s => {
//           switch (popupOpenFor) {
//             case 'ALL':     return true;
//             case 'NHS':     return s.category === 'NHS Service';
//             case 'PHARMACY':return s.category === 'Pharmacy First';
//             case 'PRIVATE': return PRIVATE_IDS.includes(s.id);
//             case 'TRAVEL':  return VACCINE_IDS.includes(s.id);
//             default:        return false;
//           }
//         })
//         .sort((a,b) => a.title.localeCompare(b.title))
//     : [];

//   return (
//     <>
//       <Header />
//       <div style={styles.pageWrapper}>
//         <div style={styles.container}>
//           <nav style={styles.breadcrumb}>
//             <Link to="/">Home</Link>
//             <span style={styles.sep}>›</span>
//             <span style={{ fontWeight: 500 }}>Services</span>
//           </nav>
//           <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
//           <p style={styles.pageSubtitle}>
//             Choose your treatment, book online, then visit us in-store for expert care.
//           </p>

//           {/* Tabs */}
//           <div
//             ref={tabsRef}
//             style={{ ...styles.tabs, width: '98%', margin: '1rem auto', gap: 0 }}
//           >
//             {tabs.map(t => {
//               const isOn = switchOnFor === t.key;
//               return (
//                 <div
//                   key={t.key}
//                   style={{
//                     position: 'relative',
//                     width: '100%',
//                     height: 50,
//                     margin: '0.1rem 0 0.7rem 0.3rem',
//                     display: 'inline-block',
//                     textAlign: 'center',
//                   }}
//                 >
//                   <div style={{ position: 'absolute', top: 15, right: 20, zIndex: 10 }}>
//                     <ToggleSwitch
//                       isOn={isOn}
//                       onToggle={() => {
//                         setSwitchOnFor(prev => (prev === t.key ? null : t.key));
//                         setTimeout(() => {
//                           setPopupOpenFor(prev => (prev === t.key ? null : t.key));
//                           setSelectedPopupId(null);
//                           setActiveTab(t.key);
//                         }, 500);
//                       }}
//                     />
//                   </div>
//                   <button
//                     onClick={() => {
//                       setActiveTab(t.key);
//                       if (popupOpenFor && popupOpenFor !== t.key) setPopupOpenFor(null);
//                     }}
//                     style={{
//                       ...styles.tabBtn,
//                       width: '100%',
//                       height: '100%',
//                       paddingTop: '0.5rem',
//                       paddingBottom: '0.5rem',
//                       marginBottom: '-0.5rem',
//                       position: 'relative',
//                       zIndex: 1,
//                       ...(activeTab === t.key
//                         ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
//                         : {}),
//                     }}
//                   >
//                     {t.label}
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Popup */}
//         {popupOpenFor && (
//           <div style={styles.popup}>
//             <div style={{
//               display: 'flex', alignItems: 'center',
//               justifyContent: 'space-between',
//               padding: '0.6rem 1rem', borderBottom: '1px solid #ccc',
//               background: '#0b2d66', color: '#acc0e3',
//               position: 'sticky', top: 0, zIndex: 2,
//             }}>
//               <button
//                 onClick={() => {
//                   const idx = tabs.findIndex(x => x.key === popupOpenFor);
//                   const prev = tabs[(idx-1+tabs.length)%tabs.length].key;
//                   setPopupOpenFor(prev); setActiveTab(prev);
//                 }}
//                 onMouseDown={() => setPressedChevron('prev')}
//                 onMouseUp={()   => setPressedChevron(null)}
//                 onMouseLeave={()=> setPressedChevron(null)}
//                 style={{
//                   ...chevronStyle,
//                   transform: pressedChevron==='prev' ? 'scale(1.2)' : 'scale(1)',
//                 }}
//               >‹</button>
//               <span>{tabs.find(x => x.key===popupOpenFor)!.label}</span>
//               <button
//                 onClick={() => {
//                   const idx = tabs.findIndex(x => x.key === popupOpenFor);
//                   const next = tabs[(idx+1)%tabs.length].key;
//                   setPopupOpenFor(next); setActiveTab(next);
//                 }}
//                 onMouseDown={() => setPressedChevron('next')}
//                 onMouseUp={()   => setPressedChevron(null)}
//                 onMouseLeave={()=> setPressedChevron(null)}
//                 style={{
//                   ...chevronStyle,
//                   transform: pressedChevron==='next' ? 'scale(1.2)' : 'scale(1)',
//                 }}
//               >›</button>
//             </div>
//             <ul style={{ listStyle:'none', margin:0, padding:0 }}>
//               {popupServices.map(s => {
//                 const seasonal = isSeasonal(s.id);
//                 const soon     = isComingSoon(s.id);
//                 const disabled = seasonal || soon;
//                 return (
//                   <li
//                     key={s.id}
//                     onClick={() => {
//                       if (disabled) return;
//                       setSelectedPopupId(s.id);
//                       setTimeout(() => navigate(`/book/${s.id}`), 600);
//                     }}
//                     style={{
//                       ...styles.popupItem,
//                       opacity: disabled ? 0.6 : 1,
//                       cursor: disabled ? 'default' : 'pointer',
//                       pointerEvents: disabled ? 'none' : 'auto',
//                       background: selectedPopupId===s.id ? '#829fe7' : 'transparent',
//                       position: 'relative',
//                     }}
//                   >
//                     <span>{s.title}</span>
//                     {(seasonal||soon) && (
//                       <span style={{
//                         position: 'absolute', right:10, top:'50%',
//                         transform:'translateY(-50%)',
//                         background: soon? '#ffc107':'#1ee0c5',
//                         color:   soon? '#000'   :'#0d1b3e',
//                         padding:'2px 6px',
//                         borderRadius:'0.5rem',
//                         fontSize:'0.7rem',
//                         fontWeight:600,
//                       }}>
//                         {soon? 'Coming soon':'Seasonal'}
//                       </span>
//                     )}
//                     <span style={{
//                       display:'inline-block',
//                       width:16, height:16,
//                       borderRadius:'50%',
//                       border:'2px solid #0d1b3e',
//                       background: selectedPopupId===s.id ? '#007bff':'transparent',
//                     }}/>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}

//         {/* Services grid */}
//         <section style={styles.servicesSection}>
//           <div style={styles.container}>
//             <div style={styles.row}>
//               {filtered.map(s => {
//                 const seasonal = isSeasonal(s.id);
//                 const soon     = isComingSoon(s.id);
//                 const disabled = seasonal || soon;
//                 const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
//                   disabled ? (
//                     <div style={{ pointerEvents:'none', opacity:0.6, position:'relative' }}>
//                       {children}
//                     </div>
//                   ) : (
//                     <Link to={s.id === 13 ? '/oral-contraceptives' : `/book/${s.id}`} style={styles.card}>
//   {children}
// </Link>
//                   );

//                 return (
//                   <div key={s.id} style={styles.col}>
//                     <Wrapper>
//                       <div style={styles.imgWrapper}>
//                         <img
//                           src={s.img}
//                           alt={s.title}
//                           style={styles.img}
//                           onMouseEnter={e => !disabled && (e.currentTarget.style.transform='scale(1.06)')}
//                           onMouseLeave={e => !disabled && (e.currentTarget.style.transform='scale(1)')}
//                         />
//                         <span style={styles.badgeDuration}>⏱{s.duration}</span>
//                         {(seasonal||soon) && (
//                           <div style={{
//                             position:'absolute', top:0,left:0,right:0,bottom:0,
//                             background:'rgba(255,255,255,0.7)',
//                             display:'flex',alignItems:'center',justifyContent:'center',
//                             fontSize:'1.25rem',fontWeight:600,color:'#333',
//                           }}>
//                             {soon ? 'Coming soon' : 'Seasonal'}
//                           </div>
//                         )}
//                       </div>
//                       <div style={styles.cardBody}>
//                         {(() => {
//                           const isVaccine = VACCINE_IDS.includes(s.id);
//                           const badgeText = isVaccine ? 'Vaccination' : s.category;
//                           const bgColor   = isVaccine
//                                             ? '#ffc107'
//                                             : s.category==='Private Service' ? '#0d6efd'
//                                             : s.category==='NHS Service'     ? '#0dcaf0'
//                                             :                                   '#198754';
//                           const fgColor   = isVaccine || s.category==='NHS Service' ? '#000' : '#fff';
//                           return (
//                             <span style={{
//                               ...styles.categoryBadge,
//                               backgroundColor: bgColor,
//                               color: fgColor,
//                             }}>
//                               {badgeText}
//                             </span>
//                           );
//                         })()}
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

