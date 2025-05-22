

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const chevronDown =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';

const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';

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
    'Tick-borne Encephalitis',
    'Meningitis ACWY and Meningitis B',
    'Typhoid',
    'Mumps, Measles, and Rubella (MMR)',
    'Yellow Fever Vaccination',
  ],
};

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

const pfVisibleCount = 3; // still showing 3 at a time
const cardWidth = 260;    // px
const cardGap = 16;       // px
const maxPfIndex = pharmacyFirstData.length - pfVisibleCount;

const Header: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selection, setSelection] = useState<string>('');
  const [pfIndex, setPfIndex] = useState<number>(0);
  const navigate = useNavigate();

  const toggleMenu = (menu: string) =>
    setActiveMenu(prev => (prev === menu ? null : menu));

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelection(val);
    if (val === 'All Services') navigate('/services');
  };

  return (
    <div style={{ fontFamily: '"Montserrat","Inter","Helvetica Neue",Arial,sans-serif' }}>
      {/* ========== Header ========== */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          width: '100%',
          background: 'white',
          zIndex: 999,
          borderBottom: '1px solid #ccc',
        }}
      >
        {/* Top bar */}
        <div className="container d-flex justify-content-between align-items-center py-2">
          <img
            src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
            alt="Logo"
            style={{ height: 40 }}
          />
          <div className="d-flex align-items-center">
            <a
              href="mailto:coleshillpharmacy@nhs.com"
              className="me-4 text-decoration-none"
              style={{ color: MAIN_TEXT_COLOR }}
            >
              📧 coleshillpharmacy@nhs.com
            </a>
            <a href="tel:01634404142" className="text-decoration-none" style={{ color: MAIN_TEXT_COLOR }}>
              📞 01634 404142
            </a>
          </div>
        </div>
        {/* Nav bar */}
        <div className="bg-light border-top" style={{ height: '50px' }}>
          <div className="container d-flex justify-content-between align-items-center h-100">
            <div className="d-flex align-items-center flex-nowrap overflow-auto">
              {[
                'Browse Services',
                'NHS Services',
                'Weight Loss',
                'Travel Vaccinations',
              ].map(label => (
                <button
                  key={label}
                  onClick={() => toggleMenu(label)}
                  className="btn btn-link text-decoration-none d-flex align-items-center me-3 p-0"
                  style={{ fontSize: '1rem', color: MAIN_TEXT_COLOR }}
                >
                  {label}
                  <img
                    src={chevronDown}
                    alt=""
                    style={{
                      width: 20,
                      marginLeft: 4,
                      transform: activeMenu === label ? 'rotate(180deg)' : undefined,
                      transition: 'transform 0.3s',
                    }}
                  />
                </button>
              ))}
              <span className="me-3" style={{ fontSize: '1rem', cursor: 'pointer' }}>
                Blog
              </span>
              <span className="me-3" style={{ fontSize: '1rem', cursor: 'pointer' }}>
                Contact
              </span>
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: 'rgb(80, 248, 228)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                padding: '4px 12px',
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* ========== Dropdown Overlay ========== */}
      {activeMenu && (
        <>
          <div
            onClick={() => setActiveMenu(null)}
            style={{
              position: 'fixed',
              top: 100,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 100px)',
              background: 'rgba(0,0,0,0.3)',
              zIndex: 997,
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 100,
              left: 0,
              width: '100%',
              height: 'calc(100vh - 100px)',
              background: '#fff',
              zIndex: 998,
              overflowY: 'auto',
              padding: '2rem',
            }}
          >
            <ul className="list-unstyled ps-0">
              {dropdownData[activeMenu].map((item, idx) => (
                <li
                  key={idx}
                  className="py-3 px-4 border-bottom d-flex justify-content-between align-items-center"
                  style={{ color: MAIN_TEXT_COLOR, cursor: 'pointer' }}
                  onClick={() => {
                    if (item === 'All Services') {
                      navigate('/services');
                      setActiveMenu(null);
                    }
                  }}
                >
                  {item}
                  <img
                    src={chevronDown}
                    alt=""
                    style={{ width: 20, transform: 'rotate(-90deg)' }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* ========== Main Content ========== */}
      <div style={{ paddingTop: '150px' }}>
        {/* Hero */}
        <section className="container py-5">
          <div className="row align-items-center">
            {/* Left: text & CTA */}
            <div className="col-md-6">
              <h1 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2.5rem' }}>
                Trusted <span style={{ color: '#00D364' }}>Pharmacy</span><br />
                Care In Coleshill
              </h1>
              <p style={{ color: MAIN_TEXT_COLOR, fontSize: '1rem', margin: '1rem 0' }}>
                Explore our wide range of treatments or consult with our medical professionals.
              </p>
              <div className="d-flex align-items-center mb-3">
                <select
                  value={selection}
                  onChange={handleSelect}
                  className="form-select me-3"
                  style={{ maxWidth: 200 }}
                >
                  <option value="">Select a service</option>
                  {dropdownData['Browse Services'].map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  className="btn"
                  style={{
                    backgroundColor: '#00D364',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '0.6rem 1.2rem',
                  }}
                >
                  Get Started Now
                </button>
              </div>
              <div className="d-flex align-items-center">
                <img
                  src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
                  alt="Google"
                  style={{ height: 24, marginRight: '0.5rem' }}
                />
                <span style={{ color: MAIN_TEXT_COLOR, fontSize: '1rem' }}>
                  ★★★★★ 4.9/5.0
                </span>
              </div>
            </div>

            {/* Right: hero cards */}
            <div className="col-md-6 d-flex gap-3" style={{ alignItems: 'flex-start' }}>
              {/* Weight loss – height = two stacked cards */}
              <div
                className="card"
                style={{
                  width: `${cardWidth}px`,
                  height: `${220 * 2 + cardGap}px`,
                  border: 'none',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <img
                    src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
                    alt="Weight loss service"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="card-body d-flex justify-content-between align-items-center px-3">
                  <small style={{ fontWeight: 500 }}>Weight loss service</small>
                  <img
                    src={chevronDown}
                    alt=""
                    style={{ width: 16, transform: 'rotate(-90deg)' }}
                  />
                </div>
              </div>

              {/* Stack travel + ear wax in one column */}
              <div className="d-flex flex-column gap-3">
                <div
                  className="card"
                  style={{
                    width: '180px',
                    height: '220px',
                    border: 'none',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img
                      src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Ftravel-clinic.webp&w=1200&q=75"
                      alt="Travel Clinic"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex justify-content-between align-items-center px-3">
                    <small style={{ fontWeight: 500 }}>Travel Clinic</small>
                    <img
                      src={chevronDown}
                      alt=""
                      style={{ width: 16, transform: 'rotate(-90deg)' }}
                    />
                  </div>
                </div>

                <div
                  className="card"
                  style={{
                    width: '180px',
                    height: '220px',
                    border: 'none',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ height: '140px', overflow: 'hidden' }}>
                    <img
                      src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fearwax-removal.webp&w=1200&q=75"
                      alt="Ear wax removal"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-body d-flex justify-content-between align-items-center px-3">
                    <small style={{ fontWeight: 500 }}>Ear wax removal</small>
                    <img
                      src={chevronDown}
                      alt=""
                      style={{ width: 16, transform: 'rotate(-90deg)' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Popular services */}
        <section className="container py-5 bg-light rounded">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Popular services</h2>
            <button className="btn btn-link" style={{ color: MAIN_TEXT_COLOR }}>See all services</button>
          </div>
          <div className="row g-4">
            {[
              { title: 'Weight loss injections', sub: 'Achieve your weight goals.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fweight-loss-4.webp&w=640&q=75' },
              { title: 'Erectile dysfunction', sub: 'Effective solutions tailored to your needs.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fed-3.webp&w=640&q=75' },
              { title: 'Emergency contraception', sub: 'Fast, confidential help when you need it.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fmorning-after-pill.webp&w=640&q=75' },
              { title: 'Flu vaccination', sub: 'Stay protected this season with a quick flu jab.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fflu-vaccine.webp&w=640&q=75' },
              { title: 'Hair Loss', sub: 'Support for healthier, fuller hair.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fhair-loss-2.webp&w=640&q=75' },
              { title: 'Vitamin B12 Injection', sub: 'Restore energy and improve vitality.', img: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fservices%2Fvitamin-b12-injection.webp&w=640&q=75' },
            ].map((svc, i) => (
              <div key={i} className="col-sm-6 col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div style={{ height: 140, overflow: 'hidden' }}>
                    <img
                      src={svc.img}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                      alt={svc.title}
                    />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title mb-1" style={{ fontSize: '1rem' }}>{svc.title}</h5>
                    <p className="card-text small text-muted">{svc.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Vaccinations */}
        <section className="container py-5">
          <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '1.75rem', marginBottom: '1rem' }}>
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
                  onClick={() => navigate(`/vaccinations/${vac.title.toLowerCase().replace(/ /g, '-')}`)}
                >
                  <img
                    src={vac.img}
                    className="w-100 h-100"
                    style={{ objectFit: 'cover', transition: 'transform 0.3s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
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

        {/* How it works */}
        <section className="container py-5">
          <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700, fontSize: '2rem' }}>
            How it <span style={{ color: MAIN_TEXT_COLOR }}>works</span>
          </h2>
          <div className="row gy-4 mt-4">
            {[
              {
                icon: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F1.webp&w=256&q=75',
                title: 'Book an appointment',
                text: 'Save yourself from waiting in the queue, book an appointment online or by phone.',
              },
              {
                icon: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F2.webp&w=256&q=75',
                title: 'Attend your consultation',
                text: 'Our clinicians are highly proficient in providing principal care to patients.',
              },
              {
                icon: 'https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fhow-it-works%2F3.webp&w=256&q=75',
                title: 'Receive treatment',
                text: 'Collect your medications or treatments in-store or choose home delivery.',
              },
            ].map((step, i) => (
              <div key={i} className="col-md-4">
                <div className="card h-100 p-4 border-0 shadow-sm" style={{ borderRadius: '0.75rem' }}>
                  <img
                    src={step.icon}
                    alt={step.title}
                    style={{ width: 48, height: 48, marginBottom: '1rem' }}
                  />
                  <h5 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{step.title}</h5>
                  <p style={{ color: MAIN_TEXT_COLOR, lineHeight: 1.4 }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      
        {/* ========= Pharmacy First carousel ========= */}
        <section className="container-fluid px-4" style={{ background: '#0F1637', color: '#fff', padding: '4rem 0' }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 style={{ fontWeight: 700, fontSize: '2rem' }}>
              Pharmacy First <span style={{ fontWeight: 400 }}>treatments</span>
            </h2>
            <div>
              <button
                onClick={() => setPfIndex(i => Math.max(0, i - 1))}
                disabled={pfIndex === 0}
                style={{
                  background: '#fff',
                  borderRadius: '0.5rem',
                  border: 'none',
                  marginRight: '0.5rem',
                  opacity: pfIndex === 0 ? 0.3 : 1,
                  cursor: pfIndex === 0 ? 'default' : 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img
                  src={chevronDown}
                  alt="Prev"
                  width={20}
                  style={{ transform: 'rotate(-90deg)' }}
                />
              </button>
              <button
                onClick={() => setPfIndex(i => Math.min(maxPfIndex, i + 1))}
                disabled={pfIndex === maxPfIndex}
                style={{
                  background: '#fff',
                  borderRadius: '0.5rem',
                  border: 'none',
                  opacity: pfIndex === maxPfIndex ? 0.3 : 1,
                  cursor: pfIndex === maxPfIndex ? 'default' : 'pointer',
                  padding: '0.5rem',
                }}
              >
                <img
                  src={chevronDown}
                  alt="Next"
                  width={20}
                  style={{ transform: 'rotate(90deg)' }}
                />
              </button>
            </div>
          </div>
          <p style={{ opacity: 0.8, marginBottom: '2rem' }}>
            Free NHS advice and treatments for common conditions.
          </p>
          <div
            className="d-flex "
            style={{
              gap: `${cardGap}px`,
              width: `calc(100% + ${cardGap}px)`,
              transform: `translateX(-${pfIndex * (cardWidth + cardGap)}px)`,
              transition: 'transform 0.3s ease',
              padding: '0 1rem',
            }}
          >
            {pharmacyFirstData.map((svc, idx) => (
              <div
                key={idx}
                className="card text-center flex-shrink-0"
                style={{
                  width: `${cardWidth}px`,
                  border: 'none',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  background: '#fff',
                }}
              >
                <div style={{ height: '180px', overflow: 'hidden' }}>
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
                    style={{
                      width: '80%',
                      margin: '0 auto',
                      padding: '0.4rem 0',
                    }}
                    onClick={() =>
                      navigate(
                        `/pharmacy-first/${svc.title.toLowerCase().replace(/ /g, '-')}`
                      )
                    }
                  >
                    Get started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========= Find us ========= */}
        <section className="container py-5">
          <h2 style={{ color: MAIN_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>
                Contact us for Travel vaccination, ear wax removal and a wide range of NHS or private services
                we offer.
              </p>
              <p><strong>Phone:</strong> 01675 466014</p>
              <p><strong>Email:</strong> coleshillpharmacy@nhs.com</p>
              <p><strong>Address:</strong> 114–116 High St, Coleshill, Birmingham B46 3BJ</p>
              <p>
                <strong>Hours:</strong><br/>
                Monday–Friday 8:30 am–6 pm<br/>
                Saturday 9 am–5:30 pm<br/>
                Sunday Closed
              </p>
            </div>
            <div className="col-md-6">
              <iframe
                title="Coleshill Pharmacy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '0.5rem' }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Header;
