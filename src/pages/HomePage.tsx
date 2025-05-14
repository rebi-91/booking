
// import supabase from "../supabase";
// import React, { useState, useRef, useEffect, FormEvent } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import html2canvas from "html2canvas";


// interface Service {
//   title: string;
//   description: string;
//   iconUrl: string;
//   reasonCode: number;
// }

// const services: Service[] = [
//   { title: "Prescription Collection & Delivery", description: "Reliable service bringing your medication directly to your doorstep.", iconUrl: "https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//016-gloves.png", reasonCode: 1 },
//   { title: "Travel Health Clinic", description: "Expert advice and vaccinations tailored to your travel plans.", iconUrl: "https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//026-medicine.png", reasonCode: 2 },
//   { title: "Private Consultations", description: "Confidential health advice in our private consultation room.", iconUrl: "https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//029-formula.png", reasonCode: 3 },
//   { title: "Smoking Cessation Support", description: "Guidance and tools to help you quit for good.", iconUrl: "https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//031-pharmacy.png", reasonCode: 5 },
// ];

// const reasonOptions = [
//   { label: "Nominate Coleshill Pharmacy", value: 1 },
//   { label: "Book A Consultation", value: 2 },
//   { label: "Book a COVID jab (must be over 75 years)", value: 3 },
//   { label: "Book other vaccinations", value: 4 },
//   { label: "Book A Blood pressure check", value: 5 },
// ];

// const HomePage: React.FC = () => {
//   const [activeIdx, setActiveIdx] = useState<number>(0);
//   const [fullName, setFullName] = useState<string>("");
//   const [dob, setDob] = useState<string>("");
//   const [tel, setTel] = useState<string>("");
//   const [reason, setReason] = useState<number>(services[0].reasonCode);
//   const [consulDate, setConsulDate] = useState<string>("");
//   const [consulTime, setConsulTime] = useState<string>("");
//   const [bookings, setBookings] = useState<{ date:string; time:string; reason:number }[]>([]);
//   const [submitted, setSubmitted] = useState<boolean>(false);

//   const formRef = useRef<HTMLFormElement>(null);
//   const inputRefs = {
//     fullName: useRef<HTMLInputElement>(null),
//     dob: useRef<HTMLInputElement>(null),
//     tel: useRef<HTMLInputElement>(null)
//   };

//   const INACTIVE_WIDTH = 220;
//   const ACTIVE_WIDTH = 250;
//   const GAP = 5;
//   const accentColor = 'hsla(172,78.9%,57.3%,0.85)';
//   const brightBg = 'rgba(1,14,27,0.97)';

//   // Fetch bookings
//   useEffect(() => {
//     supabase.from('booking').select('consulDate, consulTime, reason').then(({ data }) => {
//       if (data) setBookings(data as any);
//     });
//   }, []);

//   // Update reason automatically when activeIdx changes
//   useEffect(() => {
//     setReason(services[activeIdx].reasonCode);
//   }, [activeIdx]);

//   const handleCardClick = (idx: number) => {
//     setActiveIdx(idx);
//     setSubmitted(false);
//     setConsulDate('');
//     setConsulTime('');
//     formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   const prev = () => setActiveIdx(i => Math.max(0, i - 1));
//   const next = () => setActiveIdx(i => Math.min(services.length - 1, i + 1));

//   // Generate date bounds
//   const today = new Date().toISOString().slice(0,10);
//   const maxDate = (() => { const d = new Date(); d.setDate(d.getDate()+14); return d.toISOString().slice(0,10); })();

//   // Compute taken times for date+reason
//   const takenTimes = bookings
//     .filter(b => b.date === consulDate && b.reason === reason)
//     .map(b => b.time);

//   // Generate time slots 9:00–18:00 every 15m
//   const totalSlots = ((18 - 9)*60)/15;
//   const times = Array.from({ length: totalSlots }, (_, i) => {
//     const m = 9*60 + i*15;
//     const h = Math.floor(m/60);
//     const mm = m % 60;
//     return `${h.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}`;
//   });

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     let raw = tel.trim(); if (raw.startsWith('0')) raw = raw.slice(1);
//     const telNumber = `44${raw}`;
//     const [yyyy, mo, da] = dob.split('-');
//     const dateBirth = `${da}/${mo}/${yyyy}`;
//     await supabase.from('booking').insert([{ fullName, dateBirth, telNumber, reason, consulDate, consulTime }]);
//     setSubmitted(true);
//   };

//   const handleFocus = (ref: React.RefObject<HTMLInputElement>) => {
//     ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   };

//   const capture = () => {
//     const el = document.getElementById('confirmation');
//     if (!el) return;
//     html2canvas(el).then(canvas => {
//       const link = document.createElement('a');
//       link.download = 'confirmation.png';
//       link.href = canvas.toDataURL();
//       link.click();
//     });
//   };

//   return (
//     <div className="container py-5">
//       {/* Logo & Call */}
//       <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap" style={{ gap: '1rem' }}>
//         <div style={{ borderRadius: '1rem', overflow: 'hidden', width: '78%', maxWidth: 320, padding: '1rem', boxShadow: '0 1.7px 5px rgba(148,156,239,0.88)', backgroundColor: brightBg }}>
//           <img src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.png" alt="Coleshill Logo" style={{ width: '100%', display: 'block' }} />
//         </div>
//         <button onClick={() => window.location.href = 'tel:01675466014'} style={{ backgroundColor: brightBg, border: 'none', borderRadius: '50%', width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', cursor: 'pointer', boxShadow: '0 1.9px 5px rgba(22,211,253,0.88)' }} aria-label="Call us">📞</button>
//       </div>

//       {/* Carousel */}
//       <div style={{ backgroundColor: brightBg, borderRadius: '1.5rem' }}>
//         <div className="d-flex align-items-center justify-content-center" style={{ padding: '1rem 0' }}>
//           <button className="btn btn-outline-secondary rounded-circle me-2" style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 600 }} onClick={prev} disabled={activeIdx===0}>‹</button>
//           <div style={{ width: ACTIVE_WIDTH, overflow: 'hidden' }}>
//             <div style={{ display: 'flex', gap: GAP, transform: `translateX(-${activeIdx*(INACTIVE_WIDTH+GAP)}px)`, transition: 'transform 0.3s ease' }}>
//               {services.map((svc, idx) => (
//                 <div key={idx} onClick={() => handleCardClick(idx)} style={{ width: idx===activeIdx?ACTIVE_WIDTH:INACTIVE_WIDTH, padding: '2rem', borderRadius: '1.5rem', backgroundColor: idx===activeIdx?accentColor:'#FFFFFF', color: idx===activeIdx?'#FFFFFF':'#000000', transition: 'width 0.3s ease, background-color 0.3s ease', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', flexShrink:0 }}>
//                   <img src={svc.iconUrl} alt={svc.title} style={{ width: 60, height: 60, marginBottom: '1rem' }} />
//                   <h5>{svc.title}</h5>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <button className="btn btn-outline-secondary rounded-circle ms-2" style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 600 }} onClick={next} disabled={activeIdx===services.length-1}>›</button>
//         </div>
//       </div>

//       {/* Form */}
//       <form ref={formRef} onSubmit={handleSubmit} style={{ backgroundColor: brightBg, borderRadius: '1.5rem', marginTop: '1rem', padding: '1.5rem' }}>
//         <h5 className="mb-3">Booking Details</h5>
//         <div className="mb-3">
//           <label className="form-label">Reason</label>
//           <select className="form-select" value={reason} onChange={e => setReason(Number(e.target.value))} style={{ backgroundColor: '#f8f9fa' }}>
//             {reasonOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
//           </select>
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Consultation Date</label>
//           <input type="date" className="form-control" value={consulDate} onChange={e => setConsulDate(e.target.value)} min={today} max={maxDate} style={{ backgroundColor: '#f8f9fa', color: bookings.filter(b=>b.date===consulDate && b.reason===reason).length>=((18-9)*4)?'red':'green' }} required />
//         </div>
//         {consulDate && (
//           <div className="mb-3">
//             <label className="form-label">Consultation Time</label>
//             <div style={{ maxHeight: '150px', overflowY: 'auto', background: '#f8f9fa', borderRadius: '0.5rem', padding: '0.5rem' }}>
//               {times.map(t => {
//                 const taken = bookings.some(b => b.date===consulDate && b.time===t && b.reason===reason);
//                 return (
//                   <button key={t} type="button" onClick={() => !taken && setConsulTime(t)} disabled={taken} style={{ display: 'block', width: '100%', margin: '0.25rem 0', padding: '0.5rem', background: 'transparent', color: taken ? 'red' : 'green', border: consulTime===t?'2px solid #000':'none', cursor: taken?'not-allowed':'pointer', textAlign: 'left' }}>
//                     {t}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//         <div className="mb-3"><label className="form-label">Full Name</label><input ref={inputRefs.fullName} type="text" className="form-control" value={fullName} onFocus={() => handleFocus(inputRefs.fullName)} onChange={e=>setFullName(e.target.value)} style={{ backgroundColor: '#f8f9fa' }} required /></div>
//         <div className="mb-3"><label className="form-label">Date of Birth</label><input ref={inputRefs.dob} type="date" className="form-control" value={dob} onFocus={() => handleFocus(inputRefs.dob)} onChange={e=>setDob(e.target.value)} style={{ backgroundColor: '#f8f9fa' }} required /></div>
//         <div className="mb-3"><label className="form-label">Telephone Number</label><div className="input-group"><span className="input-group-text">+44</span><input ref={inputRefs.tel} type="tel" className="form-control" value={tel} onFocus={() => handleFocus(inputRefs.tel)} onChange={e=>setTel(e.target.value)} style={{ backgroundColor: '#f8f9fa' }} required /></div></div>
//         <div className="text-center"><button type="submit" className="btn" style={{ backgroundColor: '#ADD8E6', color: '#000' }}>Submit</button></div>
//       </form>

//       {submitted && (
//         <div id="confirmation" className="mt-4 p-3" style={{ backgroundColor: '#d4edda', borderRadius: '0.5rem' }}>
//           <p><strong>Booking Confirmed!</strong></p>
//           <p>Name: {fullName}</p>
//           <p>Reason: {reasonOptions.find(r=>r.value===reason)?.label}</p>
//           <p>Date: {consulDate}</p>
//           <p>Time: {consulTime}</p>
//           <button onClick={capture} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>📷</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;

import React, { useState } from 'react';

const chevronDown = 'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//down-chevron.png';
const MAIN_TEXT_COLOR = 'rgb(2, 70, 134)'; // centralized text color

const dropdownData: Record<string, string[]> = {
  'Browse Services': [
    'All Services',
    'Travel Clinic',
    'Private Treatments',
    'NHS Treatments',
    'Pharmacy First'
  ],
  'NHS Services': [
    'NHS Services',
    'NHS Repeat Prescriptions',
    'Delivery Service'
  ],
  'Weight Loss': [
    'Wegovy',
    'Mounjaro'
  ],
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
    'Yellow Fever Vaccination'
  ]
};

const Header = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setActiveMenu(prev => (prev === menu ? null : menu));
  };

  return (
    <div style={{ fontFamily: '"proxima-nova", "Inter", "Helvetica Neue", Arial, sans-serif' }}>
      {/* Top Header */}
      <div style={{ position: 'fixed', top: 0, width: '100%', background: 'white', zIndex: 999, borderBottom: '1px solid #ccc' }}>
        <div className="container d-flex justify-content-between align-items-center py-2">
          <img
            src="https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//coleshill.jpg"
            alt="Logo"
            style={{ height: 40, border: 'none', outline: 'none' }}
          />
          <div className="d-flex align-items-center">
            <a
              href="mailto:coleshillpharmacy@nhs.com"
              className="me-4 text-decoration-none"
              style={{ color: MAIN_TEXT_COLOR }}
            >
              📧 coleshillpharmacy@nhs.com
            </a>
            <a
              href="tel:01634404142"
              className="text-decoration-none"
              style={{ color: MAIN_TEXT_COLOR }}
            >
              📞 01634 404142
            </a>
          </div>
        </div>

        {/* Second Nav Bar */}
        <div className="bg-light border-top" style={{ height: '50px' }}>
          <div className="container d-flex justify-content-between align-items-center h-100">
            <div className="d-flex align-items-center flex-nowrap overflow-auto">
              {['Browse Services', 'NHS Services', 'Weight Loss', 'Travel Vaccinations'].map(label => (
                <button
                  key={label}
                  onClick={() => toggleMenu(label)}
                  className="btn btn-link text-decoration-none d-flex align-items-center me-1 p-0"
                  style={{
                    fontSize: '1rem',
                    whiteSpace: 'nowrap',
                    color: MAIN_TEXT_COLOR
                  }}
                >
                  {label}
                  <img
                    src={chevronDown}
                    alt="chevron"
                    style={{
                      width: 22,
                      height: 22,
                      marginLeft: 6,
                      transition: 'transform 0.3s ease',
                      transform: activeMenu === label ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </button>
              ))}
              <span
                className="me-1"
                style={{
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  marginLeft: '20px',
                  color: MAIN_TEXT_COLOR
                }}
              >
                Blog
              </span>
              <span
                className="me-1"
                style={{
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  marginLeft: '40px',
                  color: MAIN_TEXT_COLOR
                }}
              >
                Contact
              </span>
            </div>
            <button
              className="btn"
              style={{
                backgroundColor: 'rgb(138, 246, 196)',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                padding: '4px 10px',
                marginLeft: '60px',
                whiteSpace: 'nowrap'
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Side Panel */}
      {activeMenu && (
        <div
          style={{
            position: 'fixed',
            top: 100,
            left: 0,
            width: '270px',
            background: '#fff',
            borderRight: '1px solid #ccc',
            zIndex: 998,
            paddingTop: '1rem',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          <ul className="list-unstyled ps-3 pe-3">
            {dropdownData[activeMenu].map((item, index) => (
              <li
                key={index}
                className="py-2 border-bottom d-flex justify-content-between align-items-center"
                style={{ color: MAIN_TEXT_COLOR }}
              >
                {item}
                <img
                  src={chevronDown}
                  alt="arrow"
                  style={{
                    width: 22,
                    height: 22,
                    marginLeft: 6,
                    transform: 'rotate(-90deg)'
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
