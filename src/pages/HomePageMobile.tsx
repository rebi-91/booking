// // src/pages/auth/HomePage.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './HomePage.css';

// const MAIN_TEXT_COLOR = 'rgb(52, 78, 102)';
// const ACCENT_COLOR    = '#00D364';
// const ACC_COLOR       = 'rgb(42, 157, 239)';
// const chevronDown     =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

// // ===== 1) Centralised route definitions =====
// const NAV_LINKS: Record<string,string> = {
//   'All Services':        '/services',
//   'Travel Clinic':       '/book/3',
//   'Private Treatments':  '/services?tab=PRIVATE',
//   'NHS Treatments':      '/services?tab=NHS',
//   'Pharmacy First':      '/services?tab=PHARMACY',
// };

// const HERO_CARD_LINKS: Record<string,string> = {
//   'Weight loss service': '/book/13',
//   'Travel Clinic':       '/book/3',
//   'Ear wax removal':     '/book/19',
// };

// const POPULAR_SERVICES = [
//   {
//     title: 'Weight loss management',
//     link:  '/book/13',
//     sub:   'Achieve your weight goals.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75',
//   },
//   {
//     title: 'Erectile dysfunction',
//     link:  '/book/21',
//     sub:   'Effective solutions tailored to your needs.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
//   },
//   {
//     title: 'Oral Contraception',
//     link:  '/book/14',
//     sub:   'Fast, confidential help when you need it.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
//   },
//   {
//     title: 'Flu vaccination',
//     link:  '/book/15',
//     sub:   'Stay protected this season with a quick flu jab.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75',
//   },
//   {
//     title: 'Hair Loss',
//     link:  '/book/7',
//     sub:   'Support for healthier, fuller hair.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75',
//   },
//   {
//     title: 'Vitamin B12 Injection',
//     link:  '/book/6',
//     sub:   'Restore energy and improve vitality.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
//   },
// ];

// const VACCINATIONS = [
//   {
//     title: 'Chickenpox',
//     link:  '/book/31',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75',
//   },
//   {
//     title: 'Hepatitis A',
//     link:  '/book/23',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75',
//   },
//   {
//     title: 'Typhoid',
//     link:  '/book/24',
//     img:   'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a',
//   },
//   {
//     title: 'Yellow Fever',
//     link:  '/book/25',
//     img:   'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
//   },
// ];

// const PHARMACY_FIRST = [
//   {
//     title: 'Sinusitis',
//     link:  '/book/22',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
//   },
//   {
//     title: 'Sore throat',
//     link:  '/book/2',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
//   },
//   {
//     title: 'Earache',
//     link:  '/book/20',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
//   },
//   {
//     title: 'Infected insect bite',
//     link:  '/book/9',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
//   },
//   {
//     title: 'Impetigo',
//     link:  '/book/8',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
//   },
//   {
//     title: 'Shingles',
//     link:  '/book/12',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
//   },
//   {
//     title: 'Uncomplicated UTI (women)',
//     link:  '/book/5',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
//   },
// ];

// const HomePage: React.FC = () => {
//   const [selection, setSelection] = useState<string>('');
//   const navigate = useNavigate();

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const pick = e.target.value;
//     setSelection(pick);
//     if (NAV_LINKS[pick]) {
//       navigate(NAV_LINKS[pick]);
//     }
//   };

//   return (
//     <>
//       <Header />

//       <main className="pt-header">

//         {/* Hero Section */}
//         <section className="container py-5 hero-section">
//           <div className="row align-items-center">
//             {/* Left Column */}
//             <div className="col-md-6">
//               <h1 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2.5rem' }}>
//                 Trusted <span style={{ color: ACCENT_COLOR }}>Pharmacy</span><br/>
//                 Care in <span style={{ color: ACC_COLOR }}>Coleshill</span>
//               </h1>
//               <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
//                 Explore our wide range of treatments or consult with our medical professionals.
//               </p>

//               <div className="mb-3">
//                 <select
//                   value={selection}
//                   onChange={handleSelect}
//                   className="form-select w-100"
//                 >
//                   <option value="">Select a service</option>
//                   {Object.keys(NAV_LINKS).map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <button
//                   className="btn btn-start w-100"
//                   onClick={() => navigate('/services')}
//                 >
//                   Get Started Now
//                 </button>
//               </div>

//               <div className="d-flex align-items-center">
//                 <img
//                   src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
//                   alt="Google"
//                   className="google-logo"
//                 />
//                 <span style={{ color: MAIN_TEXT_COLOR, marginLeft: 8 }}>
//                   ★★★★★ 4.9/5.0
//                 </span>
//               </div>
//             </div>

//             {/* Right Column (desktop only) */}
//             <div className="col-md-6 d-none d-md-flex hero-cards gap-3">
//               <div
//                 className="card stacked-card"
//                 style={{ width: 260, cursor: 'pointer' }}
//                 onClick={() => navigate(HERO_CARD_LINKS['Weight loss service'])}
//               >
//                 <div className="overflow-hidden" style={{ height: 220 }}>
//                   <img
//                     src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
//                     alt="Weight loss service"
//                     className="card-img"
//                   />
//                 </div>
//                 <div className="card-body d-flex justify-content-between align-items-center px-3">
//                   <small>Weight loss service</small>
//                   <img src={chevronDown} className="chevron-90" alt="" />
//                 </div>
//                 <div className="card-footer text-center">
//                   <button
//                     className="btn weight-select-btn"
//                     onClick={() => navigate(HERO_CARD_LINKS['Weight loss service'])}
//                   >
//                     Select
//                   </button>
//                 </div>
//               </div>

//               <div className="d-flex flex-column gap-3">
//                 {['Travel Clinic','Ear wax removal'].map(key => (
//                   <div
//                     key={key}
//                     className="card side-card"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => navigate(HERO_CARD_LINKS[key])}
//                   >
//                     <div className="overflow-hidden" style={{ height: 140 }}>
//                       <img
//                         src={`https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2F${key.toLowerCase().replace(/ /g,'-')}.webp&w=1200&q=75`}
//                         alt={key}
//                         className="card-img"
//                       />
//                     </div>
//                     <div className="card-body d-flex justify-content-between align-items-center px-3">
//                       <small>{key}</small>
//                       <img src={chevronDown} className="chevron-90" alt="" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular Services */}
//         <section className="container py-5 bg-light rounded popular-services">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 style={{ color: MAIN_TEXT_COLOR }}>Popular services</h2>
//           </div>
//           <div className="row g-4">
//             {POPULAR_SERVICES.map((svc, i) => (
//               <div key={i} className="col-sm-6 col-md-4">
//                 <div
//                   className="card h-100 shadow-sm border-0"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => navigate(svc.link)}
//                 >
//                   <div style={{ height: 140, overflow: 'hidden' }}>
//                     <img
//                       src={svc.img}
//                       alt={svc.title}
//                       className="w-100 h-100"
//                       style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                       onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                       onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                     />
//                   </div>
//                   <div className="card-body">
//                     <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
//                       {svc.title}
//                     </h5>
//                     <p className="text-muted small mb-0">{svc.sub}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Popular Vaccinations */}
//         <section className="container py-5">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '1.75rem', marginBottom: '1rem' }}>
//             Popular <span style={{ color: MAIN_TEXT_COLOR }}>Vaccinations</span>
//           </h2>
//           <div className="row g-4">
//             {VACCINATIONS.map((vac, i) => (
//               <div key={i} className="col-sm-6 col-md-3">
//                 <div
//                   className="position-relative rounded overflow-hidden shadow-sm"
//                   style={{ height: 280, cursor: 'pointer' }}
//                   onClick={() => navigate(vac.link)}
//                 >
//                   <img
//                     src={vac.img}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                     alt={vac.title}
//                   />
//                   <div
//                     style={{
//                       position: 'absolute',
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       padding: '1rem',
//                       background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
//                       color: '#fff',
//                     }}
//                   >
//                     <h5 style={{ margin: 0 }}>{vac.title}</h5>
//                     <small>Book vaccine →</small>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Pharmacy First Carousel */}
//         <section className="container-fluid px-4 pharmacy-first-carousel" style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
//               Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
//             </h2>
//           </div>
//           <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
//             Free NHS advice and treatments for common conditions.
//           </p>
//           <div className="d-flex overflow-auto pharmacy-first-track" style={{ gap: '16px' }}>
//             {PHARMACY_FIRST.map((svc, idx) => (
//               <div
//                 key={idx}
//                 className="card text-center flex-shrink-0"
//                 style={{ width: 260, border: 'none', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//               >
//                 <div style={{ height: 180, overflow: 'hidden' }}>
//                   <img
//                     src={svc.img}
//                     alt={svc.title}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                   />
//                 </div>
//                 <div className="card-body">
//                   <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
//                   <p className="small mb-2">Ages: see pharmacy first</p>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ width: '80%', margin: '0 auto', padding: '0.4rem 0' }}
//                     onClick={() => navigate(svc.link)}
//                   >
//                     Get started
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Find Us */}
//         <section className="container py-5 find-us">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6">
//               <p>Contact us for Travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
//               <p><strong>Phone:</strong> 01675 466014</p>
//               <p><strong>Email:</strong> coleshillpharmacy@nhs.com</p>
//               <p><strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46 3BJ</p>
//               <p>
//                 <strong>Hours:</strong><br/>
//                 Monday–Friday 8:30 am–6 pm<br/>
//                 Saturday 9 am–5:30 pm<br/>
//                 Sunday Closed
//               </p>
//             </div>
//             <div className="col-md-6">
//               <iframe
//                 title="Coleshill Pharmacy Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
//                 width="100%"
//                 height="300"
//                 style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
//                 allowFullScreen
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// };

// export default HomePage;
// src/pages/auth/HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './HomePage.css';

const MAIN_TEXT_COLOR = 'rgb(119, 128, 159)';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';
const MAINS_TEXT_COLOR = 'rgb(14, 75, 141)';
const MAIS_TEXT_COLOR = 'rgb(14, 75, 141)';
const ACCENT_COLOR = '#00D364';
const ACC_COLOR = 'rgb(42, 157, 239)';
const chevronDown =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

// Titles that should show a "Coming Soon" badge and be non-clickable
const COMING_SOON = new Set([
  'Yellow Fever',
]);

// Mapping dropdown selections to service-page URLs with the appropriate tab param
const NAV_LINKS: Record<string, string> = {
  'All Services': '/services?tab=ALL',
  'Travel Clinic': '/services?tab=TRAVEL',
  'Private Treatments': '/services?tab=PRIVATE',
  'NHS Treatments': '/services?tab=NHS',
  'Pharmacy First': '/services?tab=PHARMACY',
};

const HERO_CARD_LINKS: Record<string, string> = {
  'Weight loss clinic': '/book/13',
  'Travel Clinic': '/book/3',
  'Ear wax removal': '/book/19',
};

const covidvaccine = [
  {
    title: 'COVID vaccine',
    link: '/book/16',
    sub: 'Free COVID-19 booster for eligible patients (over 75).',
    img:
      'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/542160/8ruIf7vdRW.webp',
  },
  {
    title: 'Flu jab',
    link: '/book/14',
    sub: 'Free NHS flu jab to keep you protected.',
    img:
    'https://lead-services-agency.fra1.cdn.digitaloceanspaces.com/4/101404/2-EtcvQ5-J.webp',
  },
 
];

const POPULAR_SERVICES = [
  {
    title: 'Weight loss clinic',
    link: '/weight-loss-clinic',
    sub: 'Achieve your weight goals.',
    img:
      'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg',
  },
  {
    title: 'Ear Wax Removal',
    link: '/microsuction-earwax-removal',
    sub: 'Safe microsuction for clear, comfortable ears.',
    img:
    'https://clearclinics.co.uk/wp-content/uploads/2023/10/earwax-removal-1024x561.jpg',
  },
  {
    title: 'Travel Vaccinations',
    link: '/book/3',
    sub: 'Comprehensive vaccine service for your trip.',
    img:
    'https://clinic-digital.lon1.cdn.digitaloceanspaces.com/100/530057/yyrgMObVYh.webp',
  },
  {
    title: 'Vitamin B12 Injection',
    link: '/book/6',
    sub: 'Restore energy and improve vitality.',
    img:
    'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
  },
  {
    title: 'Oral Contraception',
    link: '/oral-contraceptives',
    sub: 'Fast, confidential help when you need it.',
    img:
    'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
  },
  {
    title: 'Erectile dysfunction',
    link: '/book/20',
    sub: 'Effective solutions tailored to your needs.',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
  },
];

const VACCINATIONS = [
  {
    title: 'Chickenpox',
    link: '/book/31',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75',
  },
  {
    title: 'Hepatitis A',
    link: '/book/24',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75',
  },
  {
    title: 'Typhoid',
    link: '/book/26',
    img:
      'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a',
  },
  {
    title: 'Yellow Fever',
    link: '/book/4',
    img:
      'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
  },
];

const PHARMACY_FIRST = [
  {
    title: 'Sinusitis',
    link: '/book/21',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
    subtitle: 'Ages 12+',
  },
  {
    title: 'Sore throat',
    link: '/book/2',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
    subtitle: 'Ages 5+',
  },
  {
    title: 'Earache',
    link: '/book/19',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
    subtitle: 'Ages 1–17',
  },
  {
    title: 'Infected insect bite',
    link: '/book/8',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
    subtitle: 'Ages 1+',
  },
  {
    title: 'Impetigo',
    link: '/book/7',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
    subtitle: 'Ages 1+',
  },
  {
    title: 'Shingles',
    link: '/book/44',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
    subtitle: 'Ages 18+',
  },
  {
    title: 'Uncomplicated UTI (women)',
    link: '/book/5',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
    subtitle: 'Women aged 16–64',
  },
];

const HomePage: React.FC = () => {
  const [selection, setSelection] = useState<string>('All Services');
  const navigate = useNavigate();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pick = e.target.value;
    setSelection(pick);
    if (NAV_LINKS[pick]) {
      navigate(NAV_LINKS[pick]);
    }
  };

  return (
    <>
      <Header />

      <main className="pt-header">
        {/* Hero Section */}
        <section className="container py-5 hero-section">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1
                style={{
                  color: MAIS_TEXT_COLOR,
                  fontWeight: 700,
                  fontSize: '2.5rem',
                }}
              >
                Trusted <span style={{ color: ACCENT_COLOR }}>Pharmacy</span>
                <br />
                Care in <span style={{ color: ACC_COLOR }}>Coleshill</span>
              </h1>
              <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
                Explore our wide range of treatments or consult with our
                medical professionals.
              </p>

              <div className="mb-3">
                <select
                  value={selection}
                  onChange={handleSelect}
                  className="form-select w-100"
                >
                  {Object.keys(NAV_LINKS).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <button
                  className="btn btn-start w-100"
                  onClick={() => {
                    const dest =
                      NAV_LINKS[selection] || NAV_LINKS['All Services'];
                    navigate(dest);
                  }}
                >
                  Get Started Now
                </button>
              </div>

              <a
                href="https://www.google.com/search?client=safari&rls=en&q=coleshill+pharmacy"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-link p-0 d-flex align-items-center"
                style={{ textDecoration: 'none' }}
              >
                <img
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                  alt="Google"
                  className="google-logo"
                />
                <span style={{ color: MAIS_TEXT_COLOR, marginLeft: 8 }}>
                  ★★★★★ 4.3/5.0
                </span>
              </a>
            </div>

            <div className="col-md-6 d-none d-md-flex hero-cards gap-3">
              <div
                className="card stacked-card"
                style={{ width: 260, cursor: 'pointer' }}
                onClick={() =>
                  navigate(HERO_CARD_LINKS['Weight loss clinic'])
                }
              >
                <div className="overflow-hidden" style={{ height: 220 }}>
                  <img
                    src="https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg"
                    alt="Weight loss clinic"
                    className="card-img"
                  />
                </div>
                <div className="card-body d-flex justify-content-between align-items-center px-3">
                  <small>Weight loss clinic</small>
                  <img src={chevronDown} className="chevron-90" alt="" />
                </div>
                <div className="card-footer text-center">
                  <button
                    className="btn weight-select-btn"
                    onClick={() =>
                      navigate(HERO_CARD_LINKS['Weight loss clinic'])
                    }
                  >
                    Select
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column gap-3">
                {['Travel Clinic', 'Ear wax removal'].map((key) => {
                  const isSoon = COMING_SOON.has(key);
                  return (
                    <div
                      key={key}
                      className="card side-card"
                      style={{
                        cursor: isSoon ? 'default' : 'pointer',
                      }}
                      onClick={() => {
                        if (!isSoon) navigate(HERO_CARD_LINKS[key]);
                      }}
                    >
                      <div className="overflow-hidden" style={{ height: 140 }}>
                        <img
                          src={`https://clearclinics.co.uk/wp-content/uploads/2023/10/earwax-removal-1024x561.jpg`}
                          alt={key}
                          className="card-img"
                        />
                      </div>
                      <div className="card-body d-flex justify-content-between align-items-center px-3">
                        <small>{key}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services */}
        <section className="container py-5 bg-light rounded popular-services">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2
              style={{
                color: MAINS_TEXT_COLOR,
                fontWeight: 500,
                fontSize: '1.5rem',
              }}
            >
              Free NHS vaccination
            </h2>
          </div>
          <div className="row g-4">
            {covidvaccine.map((svc) => {
              const isSoon = COMING_SOON.has(svc.title);
              return (
                <div key={svc.title} className="col-sm-6 col-md-4">
                  <div
                    className={`card h-100 shadow-sm border-0 ${
                      isSoon ? 'coming-soon' : ''
                    }`}
                    style={{
                      cursor: isSoon ? 'default' : 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (!isSoon) navigate(svc.link);
                    }}
                  >
                    <div style={{ height: 140, overflow: 'hidden' }}>
                      <img
                        src={svc.img}
                        alt={svc.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={(e) => {
                          if (!isSoon) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSoon) e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    {isSoon && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(227, 233, 233, 0.67)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          color: 'rgba(6, 133, 133, 0.67)',
                          fontSize: '1.25rem',
                          borderRadius: '0.25rem',
                        }}
                      >
                        Coming Soon
                      </div>
                    )}

                    <div className="card-body">
                      <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
                        {svc.title}
                      </h5>
                      <p className="text-muted small mb-0">{svc.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        <section className="container py-5 bg-light rounded popular-services">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2
              style={{
                color: MAINS_TEXT_COLOR,
                fontWeight: 500,
                fontSize: '1.5rem',
              }}
            >
              Popular services
            </h2>
          </div>
          <div className="row g-4">
            {POPULAR_SERVICES.map((svc) => {
              const isSoon = COMING_SOON.has(svc.title);
              return (
                <div key={svc.title} className="col-sm-6 col-md-4">
                  <div
                    className={`card h-100 shadow-sm border-0 ${
                      isSoon ? 'coming-soon' : ''
                    }`}
                    style={{
                      cursor: isSoon ? 'default' : 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => {
                      if (!isSoon) navigate(svc.link);
                    }}
                  >
                    <div style={{ height: 140, overflow: 'hidden' }}>
                      <img
                        src={svc.img}
                        alt={svc.title}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                        onMouseEnter={(e) => {
                          if (!isSoon) e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSoon) e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    {isSoon && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'rgba(227, 233, 233, 0.67)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 600,
                          color: 'rgba(6, 133, 133, 0.67)',
                          fontSize: '1.25rem',
                          borderRadius: '0.25rem',
                        }}
                      >
                        Coming Soon
                      </div>
                    )}

                    <div className="card-body">
                      <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
                        {svc.title}
                      </h5>
                      <p className="text-muted small mb-0">{svc.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Popular Vaccinations */}
        {/* <section className="container py-5">
          <h2
            style={{
              color: MAIN_TEXT_COLOR,
              fontWeight: 700,
              fontSize: '1.75rem',
              marginBottom: '1rem',
            }}
          >
            Popular <span style={{ color: MAIN_TEXT_COLOR }}>Vaccinations</span>
          </h2>
          <div className="row g-4">
            {VACCINATIONS.map((vac) => {
              const isSoon = COMING_SOON.has(vac.title);
              return (
                <div key={vac.title} className="col-sm-6 col-md-3">
                  <div
                    className="position-relative rounded overflow-hidden shadow-sm"
                    style={{
                      height: 280,
                      cursor: isSoon ? 'default' : 'pointer',
                    }}
                    onClick={() => {
                      if (!isSoon) navigate(vac.link);
                    }}
                  >
                    <img
                      src={vac.img}
                      className="w-100 h-100"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                      }}
                      onMouseEnter={(e) =>
                        !isSoon && (e.currentTarget.style.transform = 'scale(1.05)')
                      }
                      onMouseLeave={(e) =>
                        !isSoon && (e.currentTarget.style.transform = 'scale(1)')
                      }
                      alt={vac.title}
                    />

                    {isSoon && (
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
                          borderRadius: '0.25rem',
                        }}
                      >
                        Coming Soon
                      </div>
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '1rem',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                        color: '#fff',
                      }}
                    >
                      <h5 style={{ margin: 0 }}>{vac.title}</h5>
                      <small>Book vaccine →</small>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section> */}

        {/* Pharmacy First Carousel */}
        <section
          className="container-fluid px-4 pharmacy-first-carousel"
          style={{ background: '#0F1637', color: '#fff', padding: '3rem 0' }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
              Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
            </h2>
          </div>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            Free NHS advice and treatments for common conditions.
          </p>
          <div
            className="d-flex overflow-auto pharmacy-first-track"
            style={{ gap: '16px' }}
          >
            {PHARMACY_FIRST.map((svc, idx) => (
              <div
                key={idx}
                className="card text-center flex-shrink-0"
                style={{
                  width: 250,
                  height: 390,
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ height: 220, overflow: 'hidden' }}>
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.2)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                  />
                </div>
                <div className="card-body">
                  <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
                  <p className="small mb-2">{svc.subtitle}</p>
                  <button
                    className="getstartedbtn"
                    style={{ width: '88%', paddingBottom: '1rem'}}
                    onClick={() => navigate(svc.link)}
                  >
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Find Us */}
        <section id="find-us" className="container py-5 find-us">
          <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>
                Contact us for travel vaccination, ear wax removal and a wide
                range of NHS or private services we offer.
              </p>
              <p>
                <strong>Phone:</strong> 01675 466014
              </p>
              <p>
                <strong>Email:</strong> coleshillpharmacy@gmail.com
              </p>
              <p>
                <strong>Address:</strong> 114–116 High St, Coleshill, Birmingham
                B46 3BJ
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Monday–Friday 8:30 am–6 pm
                <br />
                Saturday 9 am–5:30 pm
                <br />
                Sunday Closed
              </p>
            </div>
            <div className="col-md-6">
              <iframe
                title="Coleshill Pharmacy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;


// // src/pages/auth/HomePage.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './HomePage.css';

// const MAIN_TEXT_COLOR = 'rgb(52, 78, 102)';
// const ACCENT_COLOR    = '#00D364';
// const ACC_COLOR    = 'rgb(42, 157, 239)';
// const chevronDown     =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

// // ===== 1) Centralised route definitions =====
// const NAV_LINKS: Record<string,string> = {
//   'All Services':        '/services',
//   'Travel Clinic':       '/book/3',
//   'Private Treatments':  '/services?tab=PRIVATE',
//   'NHS Treatments':      '/services?tab=NHS',
//   'Pharmacy First':      '/services?tab=PHARMACY',
// };

// const HERO_CARD_LINKS: Record<string,string> = {
//   'Weight loss service': '/book/13',
//   'Travel Clinic':       '/book/3',
//   'Ear wax removal':     '/book/19',
// };

// const POPULAR_SERVICES = [
//   {
//     title: 'Weight loss management',
//     link:  '/book/13',
//     sub:   'Achieve your weight goals.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75',
//   },
//   {
//     title: 'Erectile dysfunction',
//     link:  '/book/21',
//     sub:   'Effective solutions tailored to your needs.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
//   },
//   {
//     title: 'Oral Contraception',
//     link:  '/book/14',
//     sub:   'Fast, confidential help when you need it.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
//   },
//   {
//     title: 'Flu vaccination',
//     link:  '/book/15',
//     sub:   'Stay protected this season with a quick flu jab.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75',
//   },
//   {
//     title: 'Hair Loss',
//     link:  '/book/7',
//     sub:   'Support for healthier, fuller hair.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75',
//   },
//   {
//     title: 'Vitamin B12 Injection',
//     link:  '/book/6',
//     sub:   'Restore energy and improve vitality.',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
//   },
// ];

// const VACCINATIONS = [
//   {
//     title: 'Chickenpox',
//     link:  '/book/31',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75',
//   },
//   {
//     title: 'Hepatitis A',
//     link:  '/book/23',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75',
//   },
//   {
//     title: 'Typhoid',
//     link:  '/book/24',
//     img:   'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a',
//   },
//   {
//     title: 'Yellow Fever',
//     link:  '/book/25',
//     img:   'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
//   },
// ];

// const PHARMACY_FIRST = [
//   {
//     title: 'Sinusitis',
//     link:  '/book/26',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
//   },
//   {
//     title: 'Sore throat',
//     link:  '/book/27',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
//   },
//   {
//     title: 'Earache',
//     link:  '/book/28',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
//   },
//   {
//     title: 'Infected insect bite',
//     link:  '/book/29',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
//   },
//   {
//     title: 'Impetigo',
//     link:  '/book/30',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
//   },
//   {
//     title: 'Shingles',
//     link:  '/book/31',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
//   },
//   {
//     title: 'Uncomplicated UTI (women)',
//     link:  '/book/32',
//     img:   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
//   },
// ];

// const HomePage: React.FC = () => {
//   const [selection, setSelection] = useState<string>('');
//   const navigate = useNavigate();

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const pick = e.target.value;
//     setSelection(pick);
//     if (NAV_LINKS[pick]) {
//       navigate(NAV_LINKS[pick]);
//     }
//   };

//   // simple slugify fallback
//   const slugify = (str: string) =>
//     str.toLowerCase().replace(/[()]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

//   return (
//     <>
//       <Header />

//       <main className="pt-header">

//         {/* Hero Section */}
//         <section className="container py-5 hero-section">
//           <div className="row align-items-center">
//             {/* Left Column */}
//             <div className="col-md-6 pt-header">
//               <h1 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2.5rem' }}>
//                 Trusted <span style={{ color: ACCENT_COLOR }}>Pharmacy</span><br/>
//                 Care in <span style={{ color: ACC_COLOR }}>Coleshill</span>
//               </h1>
//               <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
//                 Explore our wide range of treatments or consult with our medical professionals.
//               </p>

//               <div className="mb-3">
//                 <select
//                   value={selection}
//                   onChange={handleSelect}
//                   className="form-select w-100"
//                 >
//                   <option value="">Select a service</option>
//                   {Object.keys(NAV_LINKS).map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <button
//                   className="btn btn-start w-100"
//                   onClick={() => navigate('/services')}
//                 >
//                   Get Started Now
//                 </button>
//               </div>

//               <div className="d-flex align-items-center">
//                 <img
//                   src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
//                   alt="Google"
//                   className="google-logo"
//                 />
//                 <span style={{ color: MAIN_TEXT_COLOR, marginLeft: 8 }}>
//                   ★★★★★ 4.9/5.0
//                 </span>
//               </div>
//             </div>

//             {/* Right Column (desktop only) */}
//             <div className="col-md-6 d-none d-md-flex hero-cards gap-3">
//               <div
//                 className="card stacked-card"
//                 style={{ width: 260, cursor: 'pointer' }}
//                 onClick={() => navigate(HERO_CARD_LINKS['Weight loss service'])}
//               >
//                 <div className="overflow-hidden" style={{ height: 220 }}>
//                   <img
//                     src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
//                     alt="Weight loss service"
//                     className="card-img"
//                   />
//                 </div>
//                 <div className="card-body d-flex justify-content-between align-items-center px-3">
//                   <small>Weight loss service</small>
//                   <img src={chevronDown} className="chevron-90" alt="" />
//                 </div>
//                 <div className="card-footer text-center">
//                   <button
//                     className="btn weight-select-btn"
//                     onClick={() => navigate(HERO_CARD_LINKS['Weight loss service'])}
//                   >
//                     Select
//                   </button>
//                 </div>
//               </div>

//               <div className="d-flex flex-column gap-3">
//                 {['Travel Clinic','Ear wax removal'].map(key => (
//                   <div
//                     key={key}
//                     className="card side-card"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => navigate(HERO_CARD_LINKS[key])}
//                   >
//                     <div className="overflow-hidden" style={{ height: 140 }}>
//                       <img
//                         src={`https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2F${slugify(key)}.webp&w=1200&q=75`}
//                         alt={key}
//                         className="card-img"
//                       />
//                     </div>
//                     <div className="card-body d-flex justify-content-between align-items-center px-3">
//                       <small>{key}</small>
//                       <img src={chevronDown} className="chevron-90" alt="" />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular Services */}
//         <section className="container py-5 bg-light rounded popular-services">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 style={{ color: MAIN_TEXT_COLOR }}>Popular services</h2>
//           </div>
//           <div className="row g-4">
//             {POPULAR_SERVICES.map((svc, i) => (
//               <div key={i} className="col-sm-6 col-md-4">
//                 <div
//                   className="card h-100 shadow-sm border-0"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => navigate(svc.link)}
//                 >
//                   <div style={{ height: 140, overflow: 'hidden' }}>
//                     <img
//                       src={svc.img}
//                       alt={svc.title}
//                       className="w-100 h-100"
//                       style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                       onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                       onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                     />
//                   </div>
//                   <div className="card-body">
//                     <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
//                       {svc.title}
//                     </h5>
//                     <p className="text-muted small mb-0">{svc.sub}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Popular Vaccinations */}
//         <section className="container py-5">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '1.75rem', marginBottom: '1rem' }}>
//             Popular <span style={{ color: MAIN_TEXT_COLOR }}>Vaccinations</span>
//           </h2>
//           <div className="row g-4">
//             {VACCINATIONS.map((vac, i) => (
//               <div key={i} className="col-sm-6 col-md-3">
//                 <div
//                   className="position-relative rounded overflow-hidden shadow-sm"
//                   style={{ height: 280, cursor: 'pointer' }}
//                   onClick={() => navigate(vac.link)}
//                 >
//                   <img
//                     src={vac.img}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                     alt={vac.title}
//                   />
//                   <div
//                     style={{
//                       position: 'absolute',
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       padding: '1rem',
//                       background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
//                       color: '#fff',
//                     }}
//                   >
//                     <h5 style={{ margin: 0 }}>{vac.title}</h5>
//                     <small>Book vaccine →</small>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Pharmacy First Carousel */}
//         <section className="container-fluid px-4 pharmacy-first-carousel" style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
//               Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
//             </h2>
//           </div>
//           <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
//             Free NHS advice and treatments for common conditions.
//           </p>
//           <div className="d-flex overflow-auto pharmacy-first-track" style={{ gap: '16px' }}>
//             {PHARMACY_FIRST.map((svc, idx) => (
//               <div
//                 key={idx}
//                 className="card text-center flex-shrink-0"
//                 style={{ width: 260, border: 'none', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
//               >
//                 <div style={{ height: 180, overflow: 'hidden' }}>
//                   <img
//                     src={svc.img}
//                     alt={svc.title}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                   />
//                 </div>
//                 <div className="card-body">
//                   <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
//                   <p className="small mb-2">Ages: see pharmacy first</p>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ width: '80%', margin: '0 auto', padding: '0.4rem 0' }}
//                     onClick={() => navigate(`/pharmacy-first/${svc.slug}`)}
//                   >
//                     Get started
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Find Us */}
//         <section className="container py-5 find-us">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6">
//               <p>Contact us for Travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
//               <p><strong>Phone:</strong> 01675 466014</p>
//               <p><strong>Email:</strong> coleshillpharmacy@nhs.com</p>
//               <p><strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46 3BJ</p>
//               <p>
//                 <strong>Hours:</strong><br/>
//                 Monday–Friday 8:30 am–6 pm<br/>
//                 Saturday 9 am–5:30 pm<br/>
//                 Sunday Closed
//               </p>
//             </div>
//             <div className="col-md-6">
//               <iframe
//                 title="Coleshill Pharmacy Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
//                 width="100%"
//                 height="300"
//                 style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
//                 allowFullScreen
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </section>

//       </main>
//     </>
//   );
// };

// export default HomePage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './HomePage.css';

// const chevronDown =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
// const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';

// // Hero select options
// const browseServicesOptions = [
//   'All Services',
//   'Travel Clinic',
//   'Private Treatments',
//   'NHS Treatments',
//   'Pharmacy First',
// ];

// // Pharmacy First carousel data
// const pharmacyFirstData = [
//   {
//     title: 'Sinusitis',
//     subtitle: 'Ages 12+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
//   },
//   {
//     title: 'Sore throat',
//     subtitle: 'Ages 5+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
//   },
//   {
//     title: 'Earache',
//     subtitle: 'Ages 1 to 17',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
//   },
//   {
//     title: 'Infected insect bite',
//     subtitle: 'Ages 1+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
//   },
//   {
//     title: 'Impetigo',
//     subtitle: 'Ages 1+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
//   },
//   {
//     title: 'Shingles',
//     subtitle: 'Ages 18+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
//   },
//   {
//     title: 'Uncomplicated UTI (women)',
//     subtitle: 'Women aged 16–64',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
//   },
// ];

// const HomePage: React.FC = () => {
//   const [selection, setSelection] = useState<string>('');
//   const navigate = useNavigate();

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const val = e.target.value;
//     setSelection(val);
//     if (val === 'All Services') navigate('/services');
//     else if (val === 'Travel Clinic') navigate('/travel-clinic');
//     else if (val === 'Private Treatments') navigate('/private-treatments');
//     else if (val === 'NHS Treatments') navigate('/nhs-treatments');
//     else if (val === 'Pharmacy First') navigate('/pharmacy-first');
//   };

//   // Slugify for general use
//   const slugify = (str: string) =>
//     str
//       .toLowerCase()
//       .replace(/[()]/g, '')
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');

//   return (
//     <>
//       <Header />

//       <main className="pt-header">
//         {/* Hero */}
//         <section className="container py-5 hero-section">
//           <div className="row align-items-center">
//             <div className="col-md-6 hero-text">
//               <h1
//                 style={{
//                   color: MAIN_TEXT_COLOR,
//                   fontWeight: 700,
//                   fontSize: '2.5rem',
//                 }}
//               >
//                 Trusted <span style={{ color: '#00D364' }}>Pharmacy</span>
//                 <br />
//                 Care In Coleshill
//               </h1>
//               <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
//                 Explore our wide range of treatments or consult with our medical professionals.
//               </p>
//               <div className="mb-3">
//                 <select
//                   value={selection}
//                   onChange={handleSelect}
//                   className="form-select w-100"
//                 >
//                   <option value="">Select a service</option>
//                   {browseServicesOptions.map((opt) => (
//                     <option key={opt} value={opt}>
//                       {opt}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-3">
//                 <button className="btn btn-start w-100">Get Started Now</button>
//               </div>
//               <div className="d-flex align-items-center">
//                 <img
//                   src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
//                   alt="Google"
//                   className="google-logo"
//                 />
//                 <span style={{ color: MAIN_TEXT_COLOR }}>★★★★★ 4.9/5.0</span>
//               </div>
//             </div>

//             {/* Hero cards only on desktop */}
//             <div className="col-md-6 hero-cards d-none d-md-flex gap-3">
//               {/* Desktop: clicking this stacked card goes to '/weight-loss-clinic' */}
//               <div
//                 className="card stacked-card"
//                 style={{ width: 260, height: 220 * 2 + 16, cursor: 'pointer' }}
//                 onClick={() => navigate('/weight-loss-clinic')}
//               >
//                 <div className="overflow-hidden flex-grow-1">
//                   <img
//                     src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
//                     alt="Weight loss service"
//                     className="card-img"
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => navigate('/weight-loss-clinic')}
//                   />
//                 </div>
//                 <div className="card-body d-flex justify-content-between align-items-center px-3">
//                   <small style={{ fontWeight: 500 }}>Weight loss service</small>
//                   <img src={chevronDown} className="chevron-90" alt="" />
//                 </div>
//                 {/* New "Select" button below description */}
//                 <div className="card-footer text-center">
//                   <button
//                     className="btn weight-select-btn"
//                     onClick={() => navigate('/weight-loss-clinic')}
//                   >
//                     Select
//                   </button>
//                 </div>
//               </div>

//               <div className="d-flex flex-column gap-3">
//                 <div className="card side-card">
//                   <div className="overflow-hidden" style={{ height: 140 }}>
//                     <img
//                       src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Ftravel-clinic.webp&w=1200&q=75"
//                       alt="Travel Clinic"
//                       className="card-img"
//                     />
//                   </div>
//                   <div className="card-body d-flex justify-content-between align-items-center px-3">
//                     <small style={{ fontWeight: 500 }}>Travel Clinic</small>
//                     <img src={chevronDown} className="chevron-90" alt="" />
//                   </div>
//                 </div>
//                 <div className="card side-card">
//                   <div className="overflow-hidden" style={{ height: 140 }}>
//                     <img
//                       src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fearwax-removal.webp&w=1200&q=75"
//                       alt="Ear wax removal"
//                       className="card-img"
//                     />
//                   </div>
//                   <div className="card-body d-flex justify-content-between align-items-center px-3">
//                     <small style={{ fontWeight: 500 }}>Ear wax removal</small>
//                     <img src={chevronDown} className="chevron-90" alt="" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular services */}
//         <section className="container py-5 bg-light rounded popular-services">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 style={{ color: MAIN_TEXT_COLOR }}>Popular services</h2>
            
//           </div>
//           <div className="row g-4">
//             {[
//               {
//                 title: 'Weight loss management',
//                 sub: 'Achieve your weight goals.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75',
//               },
//               {
//                 title: 'Erectile dysfunction',
//                 sub: 'Effective solutions tailored to your needs.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
//               },
//               {
//                 title: 'Oral Contraception',
//                 sub: 'Fast, confidential help when you need it.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
//               },
//               {
//                 title: 'Flu vaccination',
//                 sub: 'Stay protected this season with a quick flu jab.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75',
//               },
//               {
//                 title: 'Hair Loss',
//                 sub: 'Support for healthier, fuller hair.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75',
//               },
//               {
//                 title: 'Vitamin B12 Injection',
//                 sub: 'Restore energy and improve vitality.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
//               },
//             ].map((svc, i) => (
//               <div key={i} className="col-sm-6 col-md-4">
//                 <div
//                   className="card h-100 shadow-sm border-0"
//                   style={{ cursor: 'pointer' }}
//                   onClick={() => navigate(`/${slugify(svc.title)}`)}
//                 >
//                   <div style={{ height: 140, overflow: 'hidden' }}>
//                     <img
//                       src={svc.img}
//                       alt={svc.title}
//                       className="w-100 h-100"
//                       style={{
//                         objectFit: 'cover',
//                         transition: 'transform 0.3s',
//                       }}
//                       onMouseEnter={(e) =>
//                         (e.currentTarget.style.transform = 'scale(1.05)')
//                       }
//                       onMouseLeave={(e) =>
//                         (e.currentTarget.style.transform = 'scale(1)')
//                       }
//                     />
//                   </div>
//                   <div className="card-body">
//                     <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
//                       {svc.title}
//                     </h5>
//                     <p className="text-muted small mb-0">{svc.sub}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Popular Vaccinations */}
//         <section className="container py-5">
//           <h2
//             style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '1rem',
//             }}
//           >
//             Popular <span style={{ color: MAIN_TEXT_COLOR }}>Vaccinations</span>
//           </h2>
//           <div className="row g-4">
//             {[
//               {
//                 title: 'Chickenpox',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75',
//               },
//               {
//                 title: 'Hepatitis A',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75',
//               },
//               {
//                 title: 'Typhoid',
//                 img:
//                   'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a',
//               },
//               {
//                 title: 'Yellow Fever',
//                 img:
//                   'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
//               },
//             ].map((vac, i) => (
//               <div key={i} className="col-sm-6 col-md-3">
//                 <div
//                   className="position-relative rounded overflow-hidden shadow-sm"
//                   style={{ height: 280, cursor: 'pointer' }}
//                   onClick={() => navigate(`/vaccinations/${slugify(vac.title)}`)}
//                 >
//                   <img
//                     src={vac.img}
//                     className="w-100 h-100"
//                     style={{
//                       objectFit: 'cover',
//                       transition: 'transform 0.3s',
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.transform = 'scale(1.05)')
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.transform = 'scale(1)')
//                     }
//                     alt={vac.title}
//                   />
//                   <div
//                     style={{
//                       position: 'absolute',
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       padding: '1rem',
//                       background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
//                       color: '#fff',
//                     }}
//                   >
//                     <h5 style={{ margin: 0 }}>{vac.title}</h5>
//                     <small>Book vaccine →</small>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Pharmacy First Carousel */}
//         <section
//           className="container-fluid px-4 pharmacy-first-carousel"
//           style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}
//         >
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
//               Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
//             </h2>
//           </div>
//           <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
//             Free NHS advice and treatments for common conditions.
//           </p>
//           <div
//             className="d-flex overflow-auto pharmacy-first-track"
//             style={{ gap: '16px' }}
//           >
//             {pharmacyFirstData.map((svc, idx) => (
//               <div
//                 key={idx}
//                 className="card text-center flex-shrink-0"
//                 style={{
//                   width: 260,
//                   border: 'none',
//                   borderRadius: '0.75rem',
//                   boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                 }}
//               >
//                 <div style={{ height: 180, overflow: 'hidden' }}>
//                   <img
//                     src={svc.img}
//                     alt={svc.title}
//                     className="w-100 h-100"
//                     style={{
//                       objectFit: 'cover',
//                       transition: 'transform 0.3s',
//                     }}
//                     onMouseEnter={(e) =>
//                       (e.currentTarget.style.transform = 'scale(1.05)')
//                     }
//                     onMouseLeave={(e) =>
//                       (e.currentTarget.style.transform = 'scale(1)')
//                     }
//                   />
//                 </div>
//                 <div className="card-body">
//                   <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
//                   <p className="small mb-2">{svc.subtitle}</p>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ width: '80%', margin: '0 auto', padding: '0.4rem 0' }}
//                     onClick={() =>
//                       navigate(
//                         `/pharmacy-first/${svc.title.toLowerCase().replace(/ /g, '-')}`
//                       )
//                     }
//                   >
//                     Get started
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Find us */}
//         <section className="container py-5 find-us">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6">
//               <p>
//                 Contact us for Travel vaccination, ear wax removal and a wide range
//                 of NHS or private services we offer.
//               </p>
//               <p>
//                 <strong>Phone:</strong> 01675 466014
//               </p>
//               <p>
//                 <strong>Email:</strong> coleshillpharmacy@nhs.com
//               </p>
//               <p>
//                 <strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46
//                 3BJ
//               </p>
//               <p>
//                 <strong>Hours:</strong>
//                 <br />
//                 Monday–Friday 8:30 am–6 pm
//                 <br />
//                 Saturday 9 am–5:30 pm
//                 <br />
//                 Sunday Closed
//               </p>
//             </div>
//             <div className="col-md-6">
//               <iframe
//                 title="Coleshill Pharmacy Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
//                 width="100%"
//                 height="300"
//                 style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
//                 allowFullScreen
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default HomePage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './HomePage.css';

// const chevronDown =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
// const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';

// // Hero select options
// const browseServicesOptions = [
//   'All Services',
//   'Travel Clinic',
//   'Private Treatments',
//   'NHS Treatments',
//   'Pharmacy First',
// ];

// // Pharmacy First carousel data
// const pharmacyFirstData = [
//   {
//     title: 'Sinusitis',
//     subtitle: 'Ages 12+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
//   },
//   {
//     title: 'Sore throat',
//     subtitle: 'Ages 5+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
//   },
//   {
//     title: 'Earache',
//     subtitle: 'Ages 1 to 17',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
//   },
//   {
//     title: 'Infected insect bite',
//     subtitle: 'Ages 1+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
//   },
//   {
//     title: 'Impetigo',
//     subtitle: 'Ages 1+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
//   },
//   {
//     title: 'Shingles',
//     subtitle: 'Ages 18+',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
//   },
//   {
//     title: 'Uncomplicated UTI (women)',
//     subtitle: 'Women aged 16–64',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
//   },
// ];

// const HomePage: React.FC = () => {
//   const [selection, setSelection] = useState<string>('');
//   const navigate = useNavigate();

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const val = e.target.value;
//     setSelection(val);
//     if (val === 'All Services') navigate('/services');
//     else if (val === 'Travel Clinic') navigate('/travel-clinic');
//     else if (val === 'Private Treatments') navigate('/private-treatments');
//     else if (val === 'NHS Treatments') navigate('/nhs-treatments');
//     else if (val === 'Pharmacy First') navigate('/pharmacy-first');
//   };

//   const slugify = (str: string) =>
//     str
//       .toLowerCase()
//       .replace(/[()]/g, '')
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');

//   return (
//     <>
//       <Header />

//       <main className="pt-header">
//         {/* Hero */}
//         <section className="container py-5 hero-section">
//           <div className="row align-items-center">
//             <div className="col-md-6 hero-text">
//               <h1 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2.5rem' }}>
//                 Trusted <span style={{ color: '#00D364' }}>Pharmacy</span><br />
//                 Care In Coleshill
//               </h1>
//               <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
//                 Explore our wide range of treatments or consult with our medical professionals.
//               </p>
//               <div className="mb-3">
//                 <select
//                   value={selection}
//                   onChange={handleSelect}
//                   className="form-select w-100"
//                 >
//                   <option value="">Select a service</option>
//                   {browseServicesOptions.map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-3">
//                 <button className="btn btn-start w-100">Get Started Now</button>
//               </div>
//               <div className="d-flex align-items-center">
//                 <img
//                   src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
//                   alt="Google"
//                   className="google-logo"
//                 />
//                 <span style={{ color: MAIN_TEXT_COLOR }}>★★★★★ 4.9/5.0</span>
//               </div>
//             </div>

//             {/* Hero cards only on desktop */}
//             <div className="col-md-6 hero-cards d-none d-md-flex gap-3">
//               <div className="card stacked-card" style={{ width: 260, height: 220 * 2 + 16 }}>
//                 <div className="overflow-hidden flex-grow-1">
//                   <img
//                     src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
//                     alt="Weight loss service"
//                     className="card-img"
//                   />
//                 </div>
//                 <div className="card-body d-flex justify-content-between align-items-center px-3">
//                   <small style={{ fontWeight: 500 }}>Weight loss service</small>
//                   <img src={chevronDown} className="chevron-90" alt="" />
//                 </div>
//               </div>
//               <div className="d-flex flex-column gap-3">
//                 <div className="card side-card">
//                   <div className="overflow-hidden" style={{ height: 140 }}>
//                     <img
//                       src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Ftravel-clinic.webp&w=1200&q=75"
//                       alt="Travel Clinic"
//                       className="card-img"
//                     />
//                   </div>
//                   <div className="card-body d-flex justify-content-between align-items-center px-3">
//                     <small style={{ fontWeight: 500 }}>Travel Clinic</small>
//                     <img src={chevronDown} className="chevron-90" alt="" />
//                   </div>
//                 </div>
//                 <div className="card side-card">
//                   <div className="overflow-hidden" style={{ height: 140 }}>
//                     <img
//                       src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fearwax-removal.webp&w=1200&q=75"
//                       alt="Ear wax removal"
//                       className="card-img"
//                     />
//                   </div>
//                   <div className="card-body d-flex justify-content-between align-items-center px-3">
//                     <small style={{ fontWeight: 500 }}>Ear wax removal</small>
//                     <img src={chevronDown} className="chevron-90" alt="" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Popular services */}
//         <section className="container py-5 bg-light rounded popular-services">
//           <div className="d-flex justify-content-between align-items-center mb-4">
//             <h2 style={{ color: MAIN_TEXT_COLOR }}>Popular services</h2>
//             <button className="btn btn-link text-decoration-none" style={{ color: MAIN_TEXT_COLOR }}>
//               See all services
//             </button>
//           </div>
//           <div className="row g-4">
//             {[
//               {
//                 title: 'Weight loss management',
//                 sub: 'Achieve your weight goals.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75',
//               },
//               {
//                 title: 'Erectile dysfunction',
//                 sub: 'Effective solutions tailored to your needs.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
//               },
//               {
//                 title: 'Oral Contraception',
//                 sub: 'Fast, confidential help when you need it.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
//               },
//               {
//                 title: 'Flu vaccination',
//                 sub: 'Stay protected this season with a quick flu jab.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75',
//               },
//               {
//                 title: 'Hair Loss',
//                 sub: 'Support for healthier, fuller hair.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75',
//               },
//               {
//                 title: 'Vitamin B12 Injection',
//                 sub: 'Restore energy and improve vitality.',
//                 img:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
//               },
//             ].map((svc, i) => (
//               <div key={i} className="col-sm-6 col-md-4">
//                 <div className="card h-100 shadow-sm border-0">
//                   <div style={{ height: 140, overflow: 'hidden' }}>
//                     <img
//                       src={svc.img}
//                       alt={svc.title}
//                       className="w-100 h-100"
//                       style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                       onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                       onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                     />
//                   </div>
//                   <div className="card-body">
//                     <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
//                       {svc.title}
//                     </h5>
//                     <p className="text-muted small mb-0">{svc.sub}</p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="container py-5">
//           <h2
//              style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '1rem',
//             }}
//           >
//             Popular <span style={{ color: MAIN_TEXT_COLOR }}>Vaccinations</span>
//           </h2>
//           <div className="row g-4">
//             {[
//               { title: 'Chickenpox', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75' },
//               { title: 'Hepatitis A', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75' },
//               { title: 'Typhoid', img: 'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a' },
//               { title: 'Yellow Fever', img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg' },
//             ].map((vac, i) => (
//               <div key={i} className="col-sm-6 col-md-3">
//                 <div
//                   className="position-relative rounded overflow-hidden shadow-sm"
//                   style={{ height: 280, cursor: 'pointer' }}
//                   onClick={() => navigate(`/vaccinations/${slugify(vac.title)}`)}
//                 >
//                   <img
//                     src={vac.img}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={	e => (e.currentTarget.style.transform = 'scale(1)')}
//                     alt={vac.title}
//                   />
//                   <div
//                     style={{
//                       position: 'absolute',
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       padding: '1rem',
//                       background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
//                       color: '#fff',
//                     }}
//                   >
//                     <h5 style={{ margin: 0 }}>{vac.title}</h5>
//                     <small>Book vaccine →</small>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//          </section>

//         {/* Pharmacy First Carousel */}
//         <section className="container-fluid px-4 pharmacy-first-carousel" style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}>
//           <div className="d-flex justify-content-between align-items-center mb-3">
//             <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
//               Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
//             </h2>
//             {/* Removed chevron buttons entirely */}
//           </div>
//           <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
//             Free NHS advice and treatments for common conditions.
//           </p>
//           <div className="d-flex overflow-auto pharmacy-first-track" style={{ gap: '16px' }}>
//             {pharmacyFirstData.map((svc, idx) => (
//               <div key={idx} className="card text-center flex-shrink-0" style={{ width: 260, border: 'none', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
//                 <div style={{ height: 180, overflow: 'hidden' }}>
//                   <img
//                     src={svc.img}
//                     alt={svc.title}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                   />
//                 </div>
//                 <div className="card-body">
//                   <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
//                   <p className="small mb-2">{svc.subtitle}</p>
//                   <button
//                     className="btn btn-primary btn-sm"
//                     style={{ width: '80%', margin: '0 auto', padding: '0.4rem 0' }}
//                     onClick={() => navigate(`/pharmacy-first/${svc.title.toLowerCase().replace(/ /g, '-')}`)}
//                   >
//                     Get started
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Find us */}
//         <section className="container py-5 find-us">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6">
//               <p>Contact us for Travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
//               <p><strong>Phone:</strong> 01675 466014</p>
//               <p><strong>Email:</strong> coleshillpharmacy@nhs.com</p>
//               <p><strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46 3BJ</p>
//               <p>
//                 <strong>Hours:</strong><br />
//                 Monday–Friday 8:30 am–6 pm<br />
//                 Saturday 9 am–5:30 pm<br />
//                 Sunday Closed
//               </p>
//             </div>
//             <div className="col-md-6">
//               <iframe
//                 title="Coleshill Pharmacy Location"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
//                 width="100%"
//                 height="300"
//                 style={{ border: 0, borderRadius: '0.5rem', marginBottom: '30px' }}
//                 allowFullScreen
//                 loading="lazy"
//               />
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default HomePage;
