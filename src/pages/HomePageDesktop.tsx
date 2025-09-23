import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './HomePageDesktop.css';

const chevronDown = 'https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy//chevron%20down.png';
const ACCENT = '#00D364';
const PRIMARY = '#0A1F44';
const TEXT = '#1C2B39';

const NAV_LINKS: Record<string,string> = {
  'All Services': '/services?tab=ALL',
  'Travel Clinic': '/services?tab=TRAVEL',
  'Private Treatments': '/services?tab=PRIVATE',
  'NHS Treatments': '/services?tab=NHS',
  'Pharmacy First': '/services?tab=PHARMACY',
};

const HERO_CARD_LINKS: Record<string,string> = {
  'Weight loss clinic': '/book/12',
  'Travel Clinic': '/book/3',
  'Ear Wax Removal': '/book/18',
};

const browseOptions = Object.keys(NAV_LINKS);

const popularServices = [
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

// const VACCINATIONS = [
//   {
//     title: 'Chickenpox',
//     link: '/book/31',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fchickenpox.webp&w=1080&q=75',
//   },
//   {
//     title: 'Hepatitis A',
//     link: '/book/24',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fvaccines%2Fhepatitis.webp&w=1080&q=75',
//   },
//   {
//     title: 'Typhoid',
//     link: '/book/26',
//     img:
//       'https://ysm-res.cloudinary.com/image/upload/ar_16:9,c_fill,dpr_3.0,f_auto,g_faces:auto,q_auto:eco,w_500/v1/yms/prod/d01914a4-5add-47e4-ba61-8681278f830a',
//   },
//   {
//     title: 'Yellow Fever',
//     link: '/book/4',
//     img:
//       'https://www.leamingtontravelclinic.co.uk/wp-content/uploads/2023/08/Yellow_fever2.jpg',
//   },
// ];

const pharmacyFirst = [
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

export default function HomePageDesktop() {
  const [sel, setSel] = useState('All Services');
  const [pfIndex, setPfIndex] = useState(0);
  const navigate = useNavigate();

  const onBrowse = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setSel(e.target.value);
    if (NAV_LINKS[e.target.value]) navigate(NAV_LINKS[e.target.value]);
  };

  return (
    <>
      <Header />
      <main className="desktop-page">
        <section className="hero-section">
          <div className="hero-text">
            <h1>
              Trusted <span style={{color:ACCENT}}>Pharmacy</span><br/>
              Care in Coleshill
            </h1>
            <p>Explore our wide range of treatments or consult with our medical professionals.</p>
            <div className="hero-controls">
              <select value={sel} onChange={onBrowse} className="browse-select">
                {browseOptions.map(o=>(
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <button
                className="btn-get-started"
                onClick={()=>navigate(NAV_LINKS[sel]||NAV_LINKS['All Services'])}
              >
                Get Started Now
              </button>
            </div>
            <div className="hero-rating">
              <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                   alt="Google logo"/>
              <span>★★★★★ 4.3/5.0</span>
            </div>
          </div>
           {/* …above */}
           
           <div className="hero-cards">
  {/* Big featured card on the left */}
  <div
    className="card featured-card"
    onClick={() => navigate(HERO_CARD_LINKS['Weight loss clinic'])}
  >
    <div className="card-image">
      <img
        src="https://gpcdcgwgkciyogknekwp.supabase.co/storage/v1/object/public/pharmacy/weightclinic.jpg"
        alt="Weight loss clinic"
      />
      <div className="card-overlay"></div>
    </div>
    <div className="card-footer">
      <h4>Weight loss clinic</h4>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  </div>

  {/* Two smaller cards stacked vertically on the right */}
  <div className="side-cards">
    {['Travel Clinic', 'Ear Wax Removal'].map((key) => {
      const imgUrl = key === 'Ear Wax Removal'
        ? 'https://clearclinics.co.uk/wp-content/uploads/2023/10/earwax-removal-1024x561.jpg'
        : 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Ftravel-clinic.webp&w=1200&q=75';
      return (
        <div
          key={key}
          className="card side-card"
          onClick={() => navigate(HERO_CARD_LINKS[key])}
        >
          <div className="card-image">
            <img src={imgUrl} alt={key} />
            <div className="card-overlay"></div>
          </div>
          <div className="card-footer">
            <h5>{key}</h5>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
      );
    })}
  </div>
</div>
        </section>

        <section className="popular-services">
          <header>
            <h2>Popular services</h2>
            <button className="btn-start-sm" onClick={()=>navigate('/services')}>
              See all services →
            </button>
          </header>
          <div className="grid-3">
            {popularServices.map(svc=>(
              <div
                key={svc.title}
                className="card svc-card"
                onClick={()=>navigate(svc.link)}
              >
                <div className="svc-img">
                  <img src={svc.img} alt={svc.title}/>
                </div>
                <div className="svc-body">
                  <h5>{svc.title}</h5>
                  <p>{svc.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="pharmacy-first">
          <header>
            <h2>Pharmacy First treatments</h2>
            <div className="pf-controls">
              <button
                onClick={()=>setPfIndex(i=>Math.max(0,i-1))}
                disabled={pfIndex===0}
              >←</button>
              <button
                onClick={()=>setPfIndex(i=>Math.min(pharmacyFirst.length-3,i+1))}
                disabled={pfIndex>=pharmacyFirst.length-3}
              >→</button>
            </div>
          </header>
          <div className="pf-track" style={{transform:`translateX(-${pfIndex*276}px)`}}>
            {pharmacyFirst.map(svc=>(
              <div key={svc.title} className="card pf-card" onClick={()=>navigate(svc.link)}>
                <div className="pf-img"><img src={svc.img} alt={svc.title}/></div>
                <div className="pf-body">
                  <h5>{svc.title}</h5>
                  <small>{svc.subtitle}</small>
                  <button className="btn-start-sm2">Get started</button>
                </div>
              </div>
            ))}
          </div>
        </section>

            
            <section className="popular-services">
          <header>
            <h2>Free NHS vaccination</h2>
            {/* <button className="btn-start-sm" onClick={()=>navigate('/services')}>
              See all services →
            </button> */}
          </header>
          <div className="grid-3">
            {covidvaccine.map(svc=>(
              <div
                key={svc.title}
                className="card svc-card"
                onClick={()=>navigate(svc.link)}
              >
                <div className="svc-img">
                  <img src={svc.img} alt={svc.title}/>
                </div>
                <div className="svc-body">
                  <h5>{svc.title}</h5>
                  <p>{svc.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="find-us">
          <h2 style={{fontWeight: 700 }}>Find us</h2>
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
}

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from './Header';
// import './HomePageDesktop.css';

// const chevronDown =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
// const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)'; // #1C2B39

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
//         <section className="container py-5">
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

//             <div className="col-md-6 hero-cards d-flex gap-3">
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
//                   <img src={chevronDown} alt="" className="chevron-90" />
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
//                     <img src={chevronDown} alt="" className="chevron-90" />
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
//                     <img src={chevronDown} alt="" className="chevron-90" />
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

//         {/* Popular Vaccinations */}
//         <section className="container py-5 popular-vaccinations">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '1.75rem', marginBottom: '1rem' }}>
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
//                     alt={vac.title}
//                     className="w-100 h-100"
//                     style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
//                     onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
//                     onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
//                   />
//                   <div className="vac-overlay">
//                     <h5 className="vac-title">{vac.title}</h5>
//                     <small>Book vaccine →</small>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* How it works */}
//         <section className="container py-5 how-it-works">
//           <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2rem' }}>
//             How it <span style={{ color: MAIN_TEXT_COLOR }}>works</span>
//           </h2>
//           <div className="row gy-4 mt-4">
//             {[
//               {
//                 icon:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F1.webp&w=256&q=75',
//                 title: 'Book an appointment',
//                 text:
//                   'Save yourself from waiting in the queue, book an appointment online or by phone.',
//               },
//               {
//                 icon:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F2.webp&w=256&q=75',
//                 title: 'Attend your consultation',
//                 text:
//                   'Our clinicians are highly proficient in providing principal care to patients.',
//               },
//               {
//                 icon:
//                   'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F3.webp&w=256&q=75',
//                 title: 'Receive treatment',
//                 text:
//                   'Collect your medications or treatments in-store or choose home delivery.',
//               },
//             ].map((step, i) => (
//               <div key={i} className="col-md-4">
//                 <div className="card h-100 p-4 shadow-sm border-0" style={{ borderRadius: '0.75rem' }}>
//                   <img src={step.icon} alt={step.title} style={{ width: 48, height: 48, marginBottom: '1rem' }} />
//                   <h5 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{step.title}</h5>
//                   <p style={{ color: MAIN_TEXT_COLOR, lineHeight: 1.4 }}>{step.text}</p>
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
