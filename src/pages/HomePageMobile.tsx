
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
//   // … (seven items, full URLs as before) …
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

// const pfVisibleCount = 3;
// const cardWidth = 260;
// const cardGap = 16;
// const maxPfIndex = pharmacyFirstData.length - pfVisibleCount;

// const HomePage: React.FC = () => {
//   const [selection, setSelection] = useState<string>('');
//   const [pfIndex, setPfIndex] = useState<number>(0);
//   const navigate = useNavigate();

//   const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const val = e.target.value;
//     setSelection(val);
//     if (val === 'All Services') navigate('/services');
//     else if (val === 'Travel Clinic') navigate('/travel-clinic');
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
//               <div className="d-flex align-items-center mb-3">
//                 <select
//                   value={selection}
//                   onChange={handleSelect}
//                   className="form-select me-3"
//                   style={{ maxWidth: 200 }}
//                 >
//                   <option value="">Select a service</option>
//                   {browseServicesOptions.map(opt => (
//                     <option key={opt} value={opt}>{opt}</option>
//                   ))}
//                 </select>
//                 <button className="btn btn-start">Get Started Now</button>
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
//               <div className="card stacked-card" style={{ width: cardWidth, height: 220 * 2 + cardGap }}>
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
//                 title: 'Weight loss injections',
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
//                 title: 'Emergency contraception',
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
//             <div className="carousel-controls">
//               <button
//                 onClick={() => setPfIndex(i => Math.max(0, i - 1))}
//                 disabled={pfIndex === 0}
//                 className="carousel-prev"
//               >
//                 <img src={chevronDown} alt="Prev" style={{ transform: 'rotate(-90deg)' }} />
//               </button>
//               <button
//                 onClick={() => setPfIndex(i => Math.min(maxPfIndex, i + 1))}
//                 disabled={pfIndex === maxPfIndex}
//                 className="carousel-next"
//               >
//                 <img src={chevronDown} alt="Next" style={{ transform: 'rotate(90deg)' }} />
//               </button>
//             </div>
//           </div>
//           <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
//             Free NHS advice and treatments for common conditions.
//           </p>
//           <div
//             className="d-flex overflow-auto pharmacy-first-track"
//             style={{
//               gap: `${cardGap}px`,
//               transform: `translateX(-${pfIndex * (cardWidth + cardGap)}px)`,
//               transition: 'transform 0.3s ease',
//             }}
//           >
//             {pharmacyFirstData.map((svc, idx) => (
//               <div key={idx} className="card text-center flex-shrink-0" style={{ width: cardWidth, border: 'none', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
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
//                 style={{ border: 0, borderRadius: '0.5rem' }}
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
// HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './HomePage.css';

const chevronDown =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';

// Hero select options
const browseServicesOptions = [
  'All Services',
  'Travel Clinic',
  'Private Treatments',
  'NHS Treatments',
  'Pharmacy First',
];

// Pharmacy First carousel data
const pharmacyFirstData = [
  {
    title: 'Sinusitis',
    subtitle: 'Ages 12+',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsinusitis.webp&w=1200&q=75',
  },
  {
    title: 'Sore throat',
    subtitle: 'Ages 5+',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fsore-throat.webp&w=1200&q=75',
  },
  {
    title: 'Earache',
    subtitle: 'Ages 1 to 17',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fearache.webp&w=1200&q=75',
  },
  {
    title: 'Infected insect bite',
    subtitle: 'Ages 1+',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Finsect-bite.webp&w=1200&q=75',
  },
  {
    title: 'Impetigo',
    subtitle: 'Ages 1+',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fimpetigo.webp&w=1200&q=75',
  },
  {
    title: 'Shingles',
    subtitle: 'Ages 18+',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Fshingles.webp&w=1200&q=75',
  },
  {
    title: 'Uncomplicated UTI (women)',
    subtitle: 'Women aged 16–64',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fpharmacy-first%2Futi.webp&w=1200&q=75',
  },
];

const HomePage: React.FC = () => {
  const [selection, setSelection] = useState<string>('');
  const navigate = useNavigate();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelection(val);
    if (val === 'All Services') navigate('/services');
    else if (val === 'Travel Clinic') navigate('/travel-clinic');
    else if (val === 'Private Treatments') navigate('/private-treatments');
    else if (val === 'NHS Treatments') navigate('/nhs-treatments');
    else if (val === 'Pharmacy First') navigate('/pharmacy-first');
  };

  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  return (
    <>
      <Header />

      <main className="pt-header">
        {/* Hero */}
        <section className="container py-5 hero-section">
          <div className="row align-items-center">
            <div className="col-md-6 hero-text">
              <h1 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2.5rem' }}>
                Trusted <span style={{ color: '#00D364' }}>Pharmacy</span><br />
                Care In Coleshill
              </h1>
              <p style={{ color: MAIN_TEXT_COLOR, margin: '1rem 0' }}>
                Explore our wide range of treatments or consult with our medical professionals.
              </p>
              <div className="mb-3">
                <select
                  value={selection}
                  onChange={handleSelect}
                  className="form-select w-100"
                >
                  <option value="">Select a service</option>
                  {browseServicesOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <button className="btn btn-start w-100">Get Started Now</button>
              </div>
              <div className="d-flex align-items-center">
                <img
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                  alt="Google"
                  className="google-logo"
                />
                <span style={{ color: MAIN_TEXT_COLOR }}>★★★★★ 4.9/5.0</span>
              </div>
            </div>

            {/* Hero cards only on desktop */}
            <div className="col-md-6 hero-cards d-none d-md-flex gap-3">
              <div className="card stacked-card" style={{ width: 260, height: 220 * 2 + 16 }}>
                <div className="overflow-hidden flex-grow-1">
                  <img
                    src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
                    alt="Weight loss service"
                    className="card-img"
                  />
                </div>
                <div className="card-body d-flex justify-content-between align-items-center px-3">
                  <small style={{ fontWeight: 500 }}>Weight loss service</small>
                  <img src={chevronDown} className="chevron-90" alt="" />
                </div>
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="card side-card">
                  <div className="overflow-hidden" style={{ height: 140 }}>
                    <img
                      src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Ftravel-clinic.webp&w=1200&q=75"
                      alt="Travel Clinic"
                      className="card-img"
                    />
                  </div>
                  <div className="card-body d-flex justify-content-between align-items-center px-3">
                    <small style={{ fontWeight: 500 }}>Travel Clinic</small>
                    <img src={chevronDown} className="chevron-90" alt="" />
                  </div>
                </div>
                <div className="card side-card">
                  <div className="overflow-hidden" style={{ height: 140 }}>
                    <img
                      src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fearwax-removal.webp&w=1200&q=75"
                      alt="Ear wax removal"
                      className="card-img"
                    />
                  </div>
                  <div className="card-body d-flex justify-content-between align-items-center px-3">
                    <small style={{ fontWeight: 500 }}>Ear wax removal</small>
                    <img src={chevronDown} className="chevron-90" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular services */}
        <section className="container py-5 bg-light rounded popular-services">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: MAIN_TEXT_COLOR }}>Popular services</h2>
            <button className="btn btn-link text-decoration-none" style={{ color: MAIN_TEXT_COLOR }}>
              See all services
            </button>
          </div>
          <div className="row g-4">
            {[
              {
                title: 'Weight loss injections',
                sub: 'Achieve your weight goals.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75',
              },
              {
                title: 'Erectile dysfunction',
                sub: 'Effective solutions tailored to your needs.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75',
              },
              {
                title: 'Emergency contraception',
                sub: 'Fast, confidential help when you need it.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75',
              },
              {
                title: 'Flu vaccination',
                sub: 'Stay protected this season with a quick flu jab.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75',
              },
              {
                title: 'Hair Loss',
                sub: 'Support for healthier, fuller hair.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75',
              },
              {
                title: 'Vitamin B12 Injection',
                sub: 'Restore energy and improve vitality.',
                img:
                  'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75',
              },
            ].map((svc, i) => (
              <div key={i} className="col-sm-6 col-md-4">
                <div className="card h-100 shadow-sm border-0">
                  <div style={{ height: 140, overflow: 'hidden' }}>
                    <img
                      src={svc.img}
                      alt={svc.title}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>
                      {svc.title}
                    </h5>
                    <p className="text-muted small mb-0">{svc.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="container py-5">
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
            {[
              { title: 'Chickenpox', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75' },
              { title: 'Hepatitis A', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75' },
              { title: 'Typhoid', img: 'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a' },
              { title: 'Yellow Fever', img: 'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg' },
            ].map((vac, i) => (
              <div key={i} className="col-sm-6 col-md-3">
                <div
                  className="position-relative rounded overflow-hidden shadow-sm"
                  style={{ height: 280, cursor: 'pointer' }}
                  onClick={() => navigate(`/vaccinations/${slugify(vac.title)}`)}
                >
                  <img
                    src={vac.img}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={	e => (e.currentTarget.style.transform = 'scale(1)')}
                    alt={vac.title}
                  />
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
            ))}
          </div>
         </section>

        {/* Pharmacy First Carousel */}
        <section className="container-fluid px-4 pharmacy-first-carousel" style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
              Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
            </h2>
            {/* Removed chevron buttons entirely */}
          </div>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            Free NHS advice and treatments for common conditions.
          </p>
          <div className="d-flex overflow-auto pharmacy-first-track" style={{ gap: '16px' }}>
            {pharmacyFirstData.map((svc, idx) => (
              <div key={idx} className="card text-center flex-shrink-0" style={{ width: 260, border: 'none', borderRadius: '0.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <img
                    src={svc.img}
                    alt={svc.title}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <div className="card-body">
                  <h5 style={{ fontWeight: 600 }}>{svc.title}</h5>
                  <p className="small mb-2">{svc.subtitle}</p>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ width: '80%', margin: '0 auto', padding: '0.4rem 0' }}
                    onClick={() => navigate(`/pharmacy-first/${svc.title.toLowerCase().replace(/ /g, '-')}`)}
                  >
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Find us */}
        <section className="container py-5 find-us">
          <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>Contact us for Travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
              <p><strong>Phone:</strong> 01675 466014</p>
              <p><strong>Email:</strong> coleshillpharmacy@nhs.com</p>
              <p><strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46 3BJ</p>
              <p>
                <strong>Hours:</strong><br />
                Monday–Friday 8:30 am–6 pm<br />
                Saturday 9 am–5:30 pm<br />
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
