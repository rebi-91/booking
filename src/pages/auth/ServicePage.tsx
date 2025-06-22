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
//   { id: 19, title: 'Ear wax removal',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/123156/AHHct1yZUR.webp',    duration: '20 mins', category: 'Private Service', description: 'Safe microsuction for clear, comfortable ears.' },
//   { id: 20, title: 'Earache',                         img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/91567/H_SCOcxLz4.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treatment and advice for painful ear infections.' },
//   { id: 21, title: 'Erectile dysfunction',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/925070/h4R8QTz0jv.webp',    duration: '20 mins', category: 'Private Service', description: 'Discreet assessment and prescription service.' },
//   { id: 22, title: 'Sinusitis',                       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/555059/WpuyFRToNN.webp',    duration: '10 mins', category: 'Pharmacy First',   description: 'Fast relief from sinus pressure and pain.' },

//   { id: 23, title: 'Diphtheria, tetanus and polio (1 dose)',     img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//polio.webp', duration: '20 mins', category: 'Private Service', description: 'Single‐dose protection against diphtheria, tetanus & polio.' },
//   { id: 24, title: 'Hepatitis A (2 doses)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-a.webp', duration: '20 mins', category: 'Private Service', description: 'Complete two‐dose course to prevent Hep A infection.' },
//   { id: 25, title: 'Hepatitis B (3 doses)',                      img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-b.webp', duration: '20 mins', category: 'Private Service', description: 'Full three‐dose immunisation for Hep B protection.' },
//   { id: 26, title: 'Typhoid (1 dose or orally)',                 img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//thypoid.webp', duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
//   { id: 27, title: 'Rabies (3 doses)',                           img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//rabies.webp', duration: '20 mins', category: 'Private Service', description: 'Post‐exposure or pre‐travel three‐dose course.' },
//   { id: 28, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)',      img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//umra.png', duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
//   { id: 29, title: 'Cholera (2 doses – special cases)',          img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//cholera.webp', duration: '20 mins', category: 'Private Service', description: 'Two‐dose oral vaccine for cholera prevention.' },
//   { id: 30, title: 'Japanese Encephalitis',                      img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//japanese.webp', duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito‐borne Japanese encephalitis.' },
//   { id: 31, title: 'Chicken pox',                                img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp', duration: '20 mins', category: 'Private Service', description: 'Private varicella vaccine for susceptible adults.' },
//   { id: 32, title: 'Meningitis B',                               img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//meningitis%20b.webp', duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
//   { id: 33, title: 'Shingles (Zostavax)',                        img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//shingles.jpeg', duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
//   { id: 34, title: 'Anti-malarials',                             img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//malariaa.jpeg', duration: '20 mins', category: 'Private Service', description: 'Prescription for 3–4 day anti‐malarial regimen.' },

// ];

// const COMING_SOON = new Set(['Hair loss', 'Vitamin B12 Injection']);

// const tabs = [
//   { key: 'ALL', label: 'All Treatments' },
//   { key: 'NHS', label: 'NHS Services' },
//   { key: 'PHARMACY', label: 'Pharmacy First' },
//   { key: 'PRIVATE', label: 'Private Treatments' },
//   { key: 'TRAVEL', label: 'Travel Vaccinations' },
// ];

// const HEADER_HEIGHT = 64;

// const styles: Record<string, CSSProperties> = {
//   pageWrapper: { paddingTop: HEADER_HEIGHT, backgroundColor: '#ffffff' },
//   container: { maxWidth: 720, margin: '0 auto', padding: '0 0.5rem' },
//   breadcrumb: { padding: '0.5rem 0 0.5rem 1rem', backgroundColor: '#ffffff' },
//   pagePath: { display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem', color: '#000' },
//   sep: { margin: '0 0.5rem', color: '#999' },
//   pageTitle: { fontSize: '2.5rem', fontWeight: 800, margin: '1rem 0', color: '#0d1b3e' },
//   pageSubtitle: { fontSize: '1.1rem', color: '#677294', marginBottom: '1.5rem', maxWidth: '600px' },
//   tabs: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginBottom: '2rem', scrollMarginTop: HEADER_HEIGHT + 'px' },
//   tabBtn: { padding: '0.6rem 1.2rem', border: 'none', borderRadius: '2rem', backgroundColor: '#f2f2f2', color: '#0d1b3e', cursor: 'pointer', transition: 'background-color 0.2s,color 0.2s' },
//   servicesSection: { backgroundColor: '#edf1f7', padding: '2rem 0' },
//   row: { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
//   col: { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
//   card: { display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '0.75rem', overflow: 'hidden', textDecoration: 'none', transition: 'transform 0.2s' },
//   imgWrapper: { position: 'relative', overflow: 'hidden' },
//   img: { width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.3s ease' },
//   badgeDuration: { position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' },
//   cardBody: { padding: 16 },
//   categoryBadge: { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '0.4rem', marginBottom: 8, display: 'inline-block' },
//   cardTitle: { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' },
//   cardText: { fontSize: '1rem', color: '#677294' },
// };

// const ServicePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('ALL');
//   const tabsRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [activeTab]);

//   const filtered = allServices
//     .filter(s => {
//       if (activeTab === 'ALL')     return true;
//       if (activeTab === 'NHS')     return s.category === 'NHS Service';
//       if (activeTab === 'PHARMACY')return s.category === 'Pharmacy First';
//       if (activeTab === 'PRIVATE') return s.category === 'Private Service' && s.id < 23;
//       if (activeTab === 'TRAVEL')  return s.category === 'Private Service' && s.id >= 23 && s.id <= 34;
//       return false;
//     })
//     .sort((a, b) => a.title.localeCompare(b.title));

//   return (
//     <>
//       <Header />
//       <div style={styles.pageWrapper}>
//         <div style={styles.container}>
//           <div style={styles.breadcrumb}>
//             <nav style={styles.pagePath}>
//               <Link to="/">Home</Link><span style={styles.sep}>›</span><span style={{fontWeight:500}}>Services</span>
//             </nav>
//           </div>
//           <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
//           <p style={styles.pageSubtitle}>Choose your treatment, book online, then visit us in-store for expert care.</p>
//           <div ref={tabsRef} style={styles.tabs}>
//             {tabs.map(t => (
//               <button
//                 key={t.key}
//                 onClick={() => setActiveTab(t.key)}
//                 style={{...styles.tabBtn, ...(activeTab===t.key?{backgroundColor:'#0d1b3e',color:'#1ee0c5'}:{})}}
//               >{t.label}</button>
//             ))}
//           </div>
//         </div>

//         <section style={styles.servicesSection}>
//           <div style={styles.container}>
//             <div style={styles.row}>
//               {filtered.map(s => {
//                 const isSoon = COMING_SOON.has(s.title);
//                 const Wrapper: React.FC<{children:any}> = ({children}) =>
//                   isSoon
//                     ? <div style={{pointerEvents:'none',cursor:'default',position:'relative'}}>{children}</div>
//                     : <Link to={`/book/${s.id}`} style={styles.card}>{children}</Link>;

//                 return (
//                   <div key={s.id} style={styles.col}>
//                     <Wrapper>
//                       <div style={styles.imgWrapper}>
//                         <img
//                           src={s.img}
//                           alt={s.title}
//                           style={styles.img}
//                           onMouseEnter={e=>!isSoon&&(e.currentTarget.style.transform='scale(1.06)')}
//                           onMouseLeave={e=>!isSoon&&(e.currentTarget.style.transform='scale(1)')}
//                         />
//                         <span style={styles.badgeDuration}>⏱{s.duration}</span>
//                         {isSoon && (
//                           <div style={{
//                             position:'absolute',top:0,left:0,right:0,bottom:0,
//                             background:'rgba(255,255,255,0.7)',
//                             display:'flex',alignItems:'center',justifyContent:'center',
//                             fontSize:'1.25rem',fontWeight:600,color:'#333',
//                           }}>
//                             Coming Soon
//                           </div>
//                         )}
//                       </div>
//                       <div style={styles.cardBody}>
//                         <span style={{
//                           ...styles.categoryBadge,
//                           backgroundColor: s.category==='Private Service'
//                             ? '#0d6efd'
//                             : s.category==='NHS Service'
//                               ? '#0dcaf0'
//                               : '#198754',
//                           color: s.category==='NHS Service' ? '#000' : '#fff',
//                         }}>{s.category}</span>
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
import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../Header';

interface Service {
  id: number;
  title: string;
  img: string;
  duration: string;
  category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
  description: string;
}

const allServices: Service[] = [
  { id: 1,  title: 'Altitude sickness',               img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/133875/KhhXvoL3hS.webp', duration: '20 mins', category: 'Private Service', description: 'Prevents nausea, dizziness and headaches at altitude.' },
  { id: 2,  title: 'Sore throat',                     img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/507276/Iug3MtaspO.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Soothes irritation and helps you swallow comfortably.' },
  { id: 3,  title: 'Travel Consultation',             img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp',         duration: '20 mins', category: 'Private Service', description: 'Expert advice on vaccinations and prophylaxis.' },
  { id: 4,  title: 'Travel vaccine',                  img: 'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/810793/M8XAcWPBe6.webp',         duration: '20 mins', category: 'Private Service', description: 'Comprehensive vaccine service for your trip.' },
  { id: 5,  title: 'Uncomplicated UTI (Women)',       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/963546/K6YOS9cMH3.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treatment without GP appointment for quick relief.' },
  { id: 6,  title: 'Vitamin B12 Injection',           img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/219742/pu-_f9Dh4vv.webp',     duration: '20 mins', category: 'Private Service', description: 'Injectable boost for energy, mood and vitality.' },
  { id: 7,  title: 'Hair loss',                       img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/660941/A94GbKY5xM.webp',     duration: '20 mins', category: 'Private Service', description: 'Personalised treatment plans for fuller hair.' },
  { id: 8,  title: 'Impetigo',                        img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/373143/s9tYLb2pEs.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Rapid management of bacterial skin infection.' },
  { id: 9,  title: 'Infected insect bite',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/120232/wfvV667Tx4.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Treats infection, reduces swelling and pain.' },
  { id: 10, title: 'Period delay',                    img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/698695/AIGRXrZUVU.webp',     duration: '20 mins', category: 'Private Service', description: 'Safe hormonal delay for special occasions.' },
  { id: 11, title: 'Private flu jab',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/281723/8K3Uhf06mK.webp',     duration: '20 mins', category: 'Private Service', description: 'Quick, private flu vaccination in-store.' },
  { id: 12, title: 'Shingles',                        img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/314321/sewm1HLfSk.webp',     duration: '10 mins', category: 'Pharmacy First',   description: 'Immediate access to shingles vaccination.' },
  { id: 13, title: 'Weight loss clinic',              img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/904592/c10d6P2jks.webp',     duration: '20 mins', category: 'Private Service', description: 'Clinical support for sustainable weight loss.' },
  { id: 14, title: 'Oral Contraception',              img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/769543/KbbzRigIaf.webp',     duration: '10 mins', category: 'NHS Service',      description: 'Fast, confidential contraception service.' },
  { id: 15, title: 'Flu Vaccination',                 img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp',     duration: '10 mins', category: 'NHS Service',      description: 'Free NHS flu jab to keep you protected.' },
  { id: 16, title: 'Blood pressure check',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/865410/rcaOjteI-1.webp',    duration: '10 mins', category: 'NHS Service',      description: 'Quick assessment to detect hypertension.' },
  { id: 17, title: 'COVID-19 Vaccination',            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp',    duration: '10 mins', category: 'NHS Service',      description: 'Free COVID-19 booster for eligible patients.' },
  // … Travel Vaccinations start at 23 …
  { id: 23, title: 'Diphtheria, tetanus and polio (1 dose)', img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//polio.webp', duration: '20 mins', category: 'Private Service', description: 'Single-dose protection against diphtheria, tetanus & polio.' },
  { id: 24, title: 'Hepatitis A (2 doses)',                  img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-a.webp', duration: '20 mins', category: 'Private Service', description: 'Complete two-dose course to prevent Hep A infection.' },
  { id: 25, title: 'Hepatitis B (3 doses)',                  img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//hepatitis-b.webp', duration: '20 mins', category: 'Private Service', description: 'Full three-dose immunisation for Hep B protection.' },
  { id: 26, title: 'Typhoid (1 dose or orally)',             img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//thypoid.webp',   duration: '20 mins', category: 'Private Service', description: 'Choice of injectable or oral typhoid vaccination.' },
  { id: 27, title: 'Rabies (3 doses)',                       img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//rabies.webp',   duration: '20 mins', category: 'Private Service', description: 'Post-exposure or pre-travel three-dose course.' },
  { id: 28, title: 'Meningitis ACWY (1 dose – for Hajj/Umrah)',img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//umra.png',      duration: '20 mins', category: 'Private Service', description: 'Required vaccine for Hajj & Umrah pilgrims.' },
  { id: 29, title: 'Cholera (2 doses – special cases)',        img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//cholera.webp', duration: '20 mins', category: 'Private Service', description: 'Two-dose oral vaccine for cholera prevention.' },
  { id: 30, title: 'Japanese Encephalitis',                  img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//japanese.webp',duration: '20 mins', category: 'Private Service', description: 'Protects against mosquito-borne Japanese encephalitis.' },
  { id: 31, title: 'Chicken pox',                            img: 'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/706101/svONNg1d06.webp', duration: '20 mins', category: 'Private Service', description: 'Private varicella vaccine for susceptible adults.' },
  { id: 32, title: 'Meningitis B',                           img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//meningitis%20b.webp',duration: '20 mins', category: 'Private Service', description: 'Protective dose against meningococcal B infection.' },
  { id: 33, title: 'Shingles (Zostavax)',                    img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//shingles.jpeg',duration: '20 mins', category: 'Private Service', description: 'Live vaccine for shingles prevention in adults.' },
  { id: 34, title: 'Anti-malarials',                         img: 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//malariaa.jpeg',duration: '20 mins', category: 'Private Service', description: 'Prescription for 3–4 day anti-malarial regimen.' },
];

const COMING_SOON = new Set(['Hair loss', 'Vitamin B12 Injection']);

const tabs = [
  { key: 'ALL',     label: 'All Treatments' },
  { key: 'NHS',     label: 'NHS Services' },
  { key: 'PHARMACY',label: 'Pharmacy First' },
  { key: 'PRIVATE', label: 'Private Treatments' },
  { key: 'TRAVEL',  label: 'Travel Vaccinations' },
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
  tabBtn:           { padding: '0.6rem 1.2rem', border: 'none', borderRadius: '2rem', backgroundColor: '#f2f2f2', color: '#0d1b3e', cursor: 'pointer', transition: 'background-color 0.2s,color 0.2s' },
  servicesSection:  { backgroundColor: '#edf1f7', padding: '2rem 0' },
  row:              { display: 'flex', flexWrap: 'wrap', margin: '0 -0.5rem' },
  col:              { padding: '0 0.5rem', marginBottom: '1rem', flex: '1 0 300px' },
  card:             { display: 'flex', flexDirection: 'column', backgroundColor: '#fff', borderRadius: '0.75rem', overflow: 'hidden', textDecoration: 'none', transition: 'transform 0.2s' },
  imgWrapper:       { position: 'relative', overflow: 'hidden' },
  img:              { width: '100%', height: 220, objectFit: 'cover', transition: 'transform 0.3s ease' },
  badgeDuration:    { position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' },
  cardBody:         { padding: 16 },
  categoryBadge:    { fontSize: '0.75rem', padding: '4px 8px', borderRadius: '0.4rem', marginBottom: 8, display: 'inline-block' },
  cardTitle:        { fontSize: '1.25rem', margin: '8px 0', color: '#0d1b3e' },
  cardText:         { fontSize: '1rem', color: '#677294' },
};

const ServicePage: React.FC = () => {
  const [ searchParams ] = useSearchParams();
  const paramTab = (searchParams.get('tab') || 'ALL').toUpperCase();
  const [ activeTab, setActiveTab ] = useState<string>(paramTab);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Sync activeTab when the URL query changes:
  useEffect(() => {
    setActiveTab(paramTab);
  }, [paramTab]);

  // Scroll tabs into view when it changes:
  useEffect(() => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab]);

  const filtered = allServices
    .filter(s => {
      switch (activeTab) {
        case 'ALL':     return true;
        case 'NHS':     return s.category === 'NHS Service';
        case 'PHARMACY':return s.category === 'Pharmacy First';
        case 'PRIVATE': return s.category === 'Private Service' && s.id < 23;
        case 'TRAVEL':  return s.category === 'Private Service' && s.id >= 23 && s.id <= 34;
        default:        return false;
      }
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <Header />
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.breadcrumb}>
            <nav style={styles.pagePath}>
              <Link to="/">Home</Link>
              <span style={styles.sep}>›</span>
              <span style={{ fontWeight: 500 }}>Services</span>
            </nav>
          </div>
          <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
          <p style={styles.pageSubtitle}>
            Choose your treatment, book online, then visit us in-store for expert care.
          </p>
          <div ref={tabsRef} style={styles.tabs}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  ...styles.tabBtn,
                  ...(activeTab === t.key
                    ? { backgroundColor: '#0d1b3e', color: '#1ee0c5' }
                    : {}),
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <section style={styles.servicesSection}>
          <div style={styles.container}>
            <div style={styles.row}>
              {filtered.map(s => {
                const isSoon = COMING_SOON.has(s.title);
                const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
                  isSoon ? (
                    <div style={{ pointerEvents: 'none', cursor: 'default', position: 'relative' }}>
                      {children}
                    </div>
                  ) : (
                    <Link to={`/book/${s.id}`} style={styles.card}>
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
                          onMouseEnter={e => !isSoon && (e.currentTarget.style.transform = 'scale(1.06)')}
                          onMouseLeave={e => !isSoon && (e.currentTarget.style.transform = 'scale(1)')}
                        />
                        <span style={styles.badgeDuration}>⏱{s.duration}</span>
                        {isSoon && (
                          <div style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(255,255,255,0.7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.25rem', fontWeight: 600, color: '#333',
                          }}>
                            Coming Soon
                          </div>
                        )}
                      </div>
                      <div style={styles.cardBody}>
                        <span style={{
                          ...styles.categoryBadge,
                          backgroundColor:
                            s.category === 'Private Service' ? '#0d6efd'
                            : s.category === 'NHS Service'   ? '#0dcaf0'
                            : '#198754',
                          color: s.category === 'NHS Service' ? '#000' : '#fff',
                        }}>
                          {s.category}
                        </span>
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




// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Header';
// import './ServicePage.css';

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
//   { key: 'ALL', label: 'All' },
//   { key: 'PRIVATE', label: 'Private Treatments' },
//   { key: 'NHS', label: 'NHS Services' },
//   { key: 'PHARMACY', label: 'Pharmacy First' },
// ];

// const ServicePage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>('ALL');

//   const filtered = allServices
//     .filter((s) => {
//       if (activeTab === 'ALL') return true;
//       if (activeTab === 'PRIVATE') return s.category === 'Private Service';
//       if (activeTab === 'NHS') return s.category === 'NHS Service';
//       if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
//       return true;
//     })
//     .sort((a, b) => a.title.localeCompare(b.title));

//   return (
//     <>
//       <Header />

//       <div style={{ paddingTop: 30, backgroundColor: '#ffffff' }}>
//         <div className="container pb-2">
//           {/* Breadcrumb / Page Path */}
//           <nav className="page-path">
//             <Link to="/">Home</Link>
//             <span className="sep">›</span>
//             <span className="current">Services</span>
//           </nav>

//           {/* Title & Subtitle */}
//           <h1 className="page-title">All treatments and services</h1>
//           <p className="page-subtitle">
//             To get started, choose your treatment, book an appointment and come visit us in store.
//           </p>

//           {/* Tabs */}
//           <div className="tabs">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
//                 onClick={() => setActiveTab(tab.key)}
//               >
//                 {tab.label.toUpperCase()}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Services Section */}
//       <section className="services-section py-4">
//       <div className="container-fluid px-4">
//           <div className="row gx-2 gy-4 justify-content-center">
//             {filtered.map((service) => (
//               <div key={service.id} className="col-sm-12 col-md-6 col-lg-4">
//                 {/* Link to /book/:id */}
//                 <Link to={`/book/${service.id}`} className="text-decoration-none">
//                   <div className="card h-100 shadow-sm border-0 service-card custom-card-width">
//                     <div className="position-relative overflow-hidden">
//                       <img
//                         src={service.img}
//                         className="card-img-top zoom-hover"
//                         alt={service.title}
//                         style={{ height: '220px', objectFit: 'cover' }}
//                       />
//                       <span className="duration-badge">⏱ {service.duration}</span>
//                     </div>
//                     <div className="card-body">
//                       <span
//                         className={`badge mb-2 ${
//                           service.category === 'Private Service'
//                             ? 'bg-primary'
//                             : service.category === 'NHS Service'
//                             ? 'bg-info text-dark'
//                             : 'bg-success'
//                         }`}
//                       >
//                         {service.category}
//                       </span>
//                       <h5 className="card-title mb-1 text-dark">{service.title}</h5>
//                       <p className="card-text text-muted">{service.description}</p>
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ServicePage;

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Header from '../Header';
// import './ServicePage.css';

// interface Service {
//   id: number;
//   title: string;
//   img: string;
//   duration: string;
//   category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
//   description: string;
// }

// const allServices: Service[] = [
//     {
//       id: 1,
//       title: 'Altitude sickness',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Prevents symptoms like nausea, dizziness and headaches',
//     },
//     {
//       id: 2,
//       title: 'Sore throat',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'Feel better and swallow easily',
//     },
//     {
//       id: 3,
//       title: 'Travel Consultation',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.',
//     },
//     {
//       id: 4,
//       title: 'Travel vaccine',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Peace of mind for a healthy journey',
//     },
//     {
//       id: 5,
//       title: 'Uncomplicated UTI (Women)',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'No need to book a GP appointment',
//     },
//     {
//       id: 6,
//       title: 'Vitamin B12 Injection',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'NHS Service',
//       description: 'Boosts your energy and fights tiredness',
//     },
//     {
//       id: 7,
//       title: 'Hair loss',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Tailored solutions designed to meet your needs',
//     },
//     {
//       id: 8,
//       title: 'Impetigo',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'Quick relief from itching and sore skin',
//     },
//     {
//       id: 9,
//       title: 'Infected insect bite',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'No need for a GP visit',
//     },
//     {
//       id: 10,
//       title: 'Period delay',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Safe and easy to use treatment',
//     },
//     {
//       id: 11,
//       title: 'Private flu jab',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Convenient option with no long waiting times',
//     },
//     {
//       id: 12,
//       title: 'Shingles',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'Quick access to care through the Pharmacy First scheme',
//     },
//     {
//       id: 13,
//       title: 'Weight loss clinic',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Clinically proven weight loss of up to 22%*',
//     },
//     {
//       id: 14,
//       title: 'Oral Contraception',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'NHS Service',
//       description: 'Easy to access at your local pharmacy',
//     },
//     {
//       id: 15,
//       title: 'Flu vaccination',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'NHS Service',
//       description: 'Reduces your risk of being hospitalised from flu.',
//     },
//     {
//       id: 16,
//       title: 'Blood pressure check',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'NHS Service',
//       description: 'Detects high blood pressure before it causes problems',
//     },
//     {
//       id: 17,
//       title: 'COVID-19 Vaccination',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'NHS Service',
//       description: 'Free for adults 65 and over on the NHS',
//     },
//     {
//       id: 18,
//       title: 'Chickenpox vaccine',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Quick and easy vaccine at Coleshill Pharmacy',
//     },
//     {
//       id: 19,
//       title: 'Ear wax removal',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: '+10 years of experience performing microsuction procedures',
//     },
//     {
//       id: 20,
//       title: 'Earache',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'Easy treatments for quick recovery',
//     },
//     {
//       id: 21,
//       title: 'Erectile dysfunction',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Private Service',
//       description: 'Improves your ability to achieve and maintain an erection',
//     },
//     {
//       id: 22,
//       title: 'Sinusitis',
//       img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75',
//       duration: '20 mins',
//       category: 'Pharmacy First',
//       description: 'Say goodbye to sinus pain',
//     },
//   ];

//   const tabs = [
//     { key: 'ALL', label: 'All' },
//     { key: 'PRIVATE', label: 'Private Treatments' },
//     { key: 'NHS', label: 'NHS Services' },
//     { key: 'PHARMACY', label: 'Pharmacy First' },
//   ];
  
//   const ServicePage: React.FC = () => {
//     const [activeTab, setActiveTab] = useState<string>('ALL');
  
//     const filtered = allServices
//       .filter((s) => {
//         if (activeTab === 'ALL') return true;
//         if (activeTab === 'PRIVATE') return s.category === 'Private Service';
//         if (activeTab === 'NHS') return s.category === 'NHS Service';
//         if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
//         return true;
//       })
//       .sort((a, b) => a.title.localeCompare(b.title));
  
//     return (
//       <>
//         <Header />
  
//         <div style={{ paddingTop: 110, backgroundColor: '#ffffff' }}>
//           <div className="container pb-2  ">
//             {/* Custom breadcrumb / path */}
//             <nav className="page-path">
//               <Link to="/">Home</Link>
//               <span className="sep">›</span>
//               <span className="current">Services</span>
//             </nav>
  
//             {/* Page title & subtitle */}
//             <h1  className="page-title">All treatments and services</h1>
//             <p className="page-subtitle">
//               To get started, choose your treatment, book an appointment and come visit us in store.
//             </p>
  
//             {/* Tabs */}
//             <div className="tabs">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.key}
//                   className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
//                   onClick={() => setActiveTab(tab.key)}
//                 >
//                   {tab.label.toUpperCase()}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
  
//         {/* Services Section */}
//         <section className="services-section py-3">
//           <div className="container">
//             <div className="row">
//               {filtered.map((service) => (
//                 <div key={service.id} className="col-md-6 col-lg-4 mb-4" style={{ paddingTop: '30px' }}>
//                   <div className="card h-100 shadow-sm border-0 service-card custom-card-width">
//                     <div className="position-relative overflow-hidden">
//                       <img
//                         src={service.img}
//                         className="card-img-top zoom-hover"
//                         alt={service.title}
//                         style={{ height: '220px', objectFit: 'cover' }}
//                       />
//                       <span
//                         className="position-absolute"
//                         style={{
//                           bottom: '0.5rem',
//                           left: '0.5rem',
//                           background: 'rgba(0, 0, 0, 0)',
//                           color: '#fff',
//                           padding: '0.25rem 0.5rem',
//                           borderRadius: 4,
//                           fontSize: '0.8rem',
//                         }}
//                       >
//                         ⏱ {service.duration}
//                       </span>
//                     </div>
//                     <div className="card-body">
//                       <span
//                         className={`badge mb-3 ${
//                           service.category === 'Private Service'
//                             ? 'bg-primary'
//                             : service.category === 'NHS Service'
//                             ? 'bg-info text-dark'
//                             : 'bg-success'
//                         }`}
//                       >
//                         {service.category}
//                       </span>
//                       <h5 className="card-title mb-2">{service.title}</h5>
//                       <p className="card-text text-muted mb-2">{service.description}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </>
//     );
//   };
  
//   export default ServicePage;