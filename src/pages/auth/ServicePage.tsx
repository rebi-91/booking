// // src/pages/auth/ServicePage.tsx
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
//     title: 'Emergency contraception',
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
//   { key: 'ALL', label: 'All Treatments' },
//   { key: 'PRIVATE', label: 'Private Treatments' },
//   { key: 'NHS', label: 'NHS Services' },
//   { key: 'PHARMACY', label: 'Pharmacy First' },
// ];

// // adjust to your actual <Header> height
// const HEADER_HEIGHT = 194;

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

//   // scroll the tabs container up under the header whenever we switch
//   useEffect(() => {
//     if (tabsRef.current) {
//       const top = tabsRef.current.getBoundingClientRect().top + window.pageYOffset;
//       window.scrollTo({
//         top: top - HEADER_HEIGHT,
//         behavior: 'smooth',
//       });
//     }
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
//       <Header />

//       <div style={styles.pageWrapper}>
//         <div style={styles.container}>
//           {/* Breadcrumb */}
//           <div style={styles.breadcrumb}>
//             <nav style={styles.pagePath}>
//               <Link to="/">Home</Link>
//               <span style={styles.sep}>›</span>
//               <span style={{ fontWeight: 500 }}>Services</span>
//             </nav>
//           </div>

//           {/* Title & Intro */}
//           <h1 style={styles.pageTitle}>All Treatments &amp; Services</h1>
//           <p style={styles.pageSubtitle}>
//             Choose your treatment, book online, then visit us in-store for expert care.
//           </p>

//           {/* Tabs */}
//           <div ref={tabsRef} style={styles.tabs}>
//             {tabs.map(t => (
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

//         {/* Services Grid */}
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
//                         onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
//                         onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                         onTouchStart={e => (e.currentTarget.style.transform = 'scale(1.06)')}
//                         onTouchEnd={e => (e.currentTarget.style.transform = 'scale(1)')}
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
// src/pages/auth/ServicePage.tsx
import React, { useState, useEffect, useRef, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
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
  { id: 1, title: 'Altitude sickness', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Prevents symptoms like nausea, dizziness and headaches' },
  { id: 2, title: 'Sore throat', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'Feel better and swallow easily' },
  { id: 3, title: 'Travel Consultation', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.' },
  { id: 4, title: 'Travel vaccine', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Peace of mind for a healthy journey' },
  { id: 5, title: 'Uncomplicated UTI (Women)', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'No need to book a GP appointment' },
  { id: 6, title: 'Vitamin B12 Injection', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75', duration: '20 mins', category: 'NHS Service', description: 'Boosts your energy and fights tiredness' },
  { id: 7, title: 'Hair loss', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Tailored solutions designed to meet your needs' },
  { id: 8, title: 'Impetigo', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'Quick relief from itching and sore skin' },
  { id: 9, title: 'Infected insect bite', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'No need for a GP visit' },
  { id: 10, title: 'Period delay', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Safe and easy to use treatment' },
  { id: 11, title: 'Private flu jab', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Convenient option with no long waiting times' },
  { id: 12, title: 'Shingles', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'Quick access to care through the Pharmacy First scheme' },
  { id: 13, title: 'Weight loss clinic', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Clinically proven weight loss of up to 22%*' },
  { id: 14, title: 'Emergency contraception', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75', duration: '20 mins', category: 'NHS Service', description: 'Easy to access at your local pharmacy' },
  { id: 15, title: 'Flu Vaccination', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75', duration: '20 mins', category: 'NHS Service', description: 'Reduces your risk of being hospitalised from flu.' },
  { id: 16, title: 'Blood pressure check', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75', duration: '20 mins', category: 'NHS Service', description: 'Detects high blood pressure before it causes problems' },
  { id: 17, title: 'COVID-19 Vaccination', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75', duration: '20 mins', category: 'NHS Service', description: 'Free for adults 65 and over on the NHS' },
  { id: 18, title: 'Chickenpox vaccine', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Quick and easy vaccine at Coleshill Pharmacy' },
  { id: 19, title: 'Ear wax removal', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: '+10 years of experience performing microsuction procedures' },
  { id: 20, title: 'Earache', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'Easy treatments for quick recovery' },
  { id: 21, title: 'Erectile dysfunction', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75', duration: '20 mins', category: 'Private Service', description: 'Improves your ability to achieve and maintain an erection' },
  { id: 22, title: 'Sinusitis', img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75', duration: '20 mins', category: 'Pharmacy First', description: 'Say goodbye to sinus pain' },
];

const tabs = [
  { key: 'ALL', label: 'All Treatments' },
  { key: 'PRIVATE', label: 'Private Treatments' },
  { key: 'NHS', label: 'NHS Services' },
  { key: 'PHARMACY', label: 'Pharmacy First' },
];

const HEADER_HEIGHT = 64; // adjust to your actual <Header> height in px

const styles: Record<string, CSSProperties> = {
  pageWrapper: {
    paddingTop: HEADER_HEIGHT,
    backgroundColor: '#ffffff',
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '0 0.5rem',
  },
  breadcrumb: {
    padding: '0.5rem 0 0.5rem 1rem',
    backgroundColor: '#ffffff',
  },
  pagePath: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#000000',
  },
  sep: {
    margin: '0 0.5rem',
    color: '#999999',
  },
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
    padding: '0.6rem 1.2rem',
    border: 'none',
    borderRadius: '2rem',
    backgroundColor: '#f2f2f2',
    color: '#0d1b3e',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
  },
  servicesSection: {
    backgroundColor: '#edf1f7',
    padding: '2rem 0',
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '0 -0.5rem',
  },
  col: {
    padding: '0 0.5rem',
    marginBottom: '1rem',
    flex: '1 0 300px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.2s',
  },
  imgWrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
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
    color: '#ffffff',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: '0.75rem',
  },
  cardBody: {
    padding: 16,
  },
  categoryBadge: {
    fontSize: '0.75rem',
    padding: '4px 8px',
    borderRadius: '0.4rem',
    marginBottom: 8,
    display: 'inline-block',
  },
  cardTitle: {
    fontSize: '1.25rem',
    margin: '8px 0',
    color: '#0d1b3e',
  },
  cardText: {
    fontSize: '1rem',
    color: '#677294',
  },
};

const ServicePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    tabsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab]);

  const filtered = allServices
    .filter((s) => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'PRIVATE') return s.category === 'Private Service';
      if (activeTab === 'NHS') return s.category === 'NHS Service';
      if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
      return true;
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
            {tabs.map((t) => (
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
              {filtered.map((s) => (
                <div key={s.id} style={styles.col}>
                  <Link
                    to={`/book/${s.id}`}
                    style={styles.card}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={styles.imgWrapper}>
                      <img
                        src={s.img}
                        alt={s.title}
                        style={styles.img}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                        onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      />
                      <span style={styles.badgeDuration}>⏱{s.duration}</span>
                    </div>
                    <div style={styles.cardBody}>
                      <span
                        style={{
                          ...styles.categoryBadge,
                          backgroundColor:
                            s.category === 'Private Service'
                              ? '#0d6efd'
                              : s.category === 'NHS Service'
                              ? '#0dcaf0'
                              : '#198754',
                          color: s.category === 'NHS Service' ? '#000000' : '#ffffff',
                        }}
                      >
                        {s.category}
                      </span>
                      <h5 style={styles.cardTitle}>{s.title}</h5>
                      <p style={styles.cardText}>{s.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServicePage;

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
//     title: 'Emergency contraception',
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
//     title: 'Emergency contraception',
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
//       title: 'Emergency contraception',
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