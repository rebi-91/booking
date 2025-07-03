// src/pages/auth/MicrosuctionPage.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './MicrosuctionPage.css';

const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

const faqItems = [
  {
    question: 'How long does it take?',
    answer:
      'The treatment usually takes about 15 to 20 minutes. It’s quick and you can go back to your day straight after.',
  },
  {
    question: 'Can I hear straight away?',
    answer:
      'Many people feel an improvement in their hearing straight after. It can be a relief if your ears were blocked with wax!',
  },
  {
    question: 'Do I need to prepare for it?',
    answer:
      'Using ear drops a few days before can help soften the wax, making it easier to remove. We’ll let you know if that’s needed.',
  },
  {
    question: 'Does microsuction hurt?',
    answer:
      'No, it shouldn’t hurt. Most people feel comfortable during the treatment. You might feel a slight tickle or suction in your ear, but it’s over quickly.',
  },
];

const MicrosuctionPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main className="pt-header microsuction-page">
        {/* ===============================
            BREADCRUMB / PAGE PATH
           =============================== */}
<div className="breadcrumb-wrapper">
  </div>
  <div className="container">
    <nav className="page-path">
      <Link to="/">Home</Link>
      <span className="sep">›</span>
      <Link to="/services">Services</Link>
      <span className="sep">›</span>
      <span className="current">Microsuction</span>
    </nav>
    <h1 className="page-title">
      Professional Ear Wax Removal in{' '}
      <span className="page-title--coleshill">Coleshill</span>
    </h1>
  </div>


        {/* =============================== */}

        {/* Hero */}
        <section className="container hero-section">
          <h1 className="hero-title">
          – Book Your Appointment Today!
          </h1>
          <ul className="hero-bullets">
            <li>5+ years of experience performing microsuction procedures</li>
            <li>Quick and simple, lasting just 15–20 minutes</li>
            <li>The most effective way to clean your ears & improve your hearing</li>
          </ul>
          <button className="btn-accent" onClick={() => navigate('/book/18')}>
            Book your appointment now
          </button>
          <div className="hero-image-wrap">
            <img
              src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75"
              alt="ear wax removal"
              className="hero-image"
            />
          </div>
          <div className="rating">
            <img
              src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
              alt="Google logo"
            />
            <span>★★★★★ 4.9/5.0</span>
          </div>
        </section>

        {/* About / FAQ */}
        <section className="container about-section">
          <h2 className="section-heading">About Microsuction Earwax Removal</h2>
          <p className="section-subtext">
            Microsuction is a safe and simple way to clean blocked ears. It uses a tiny suction device to gently remove wax without any mess. This treatment is quick, painless, and done by trained professionals at our pharmacy to help you hear clearly again.
          </p>

          <div className="accordion" id="microsuctionFaq">
            {faqItems.map((item, idx) => (
              <div key={idx} className="accordion-item mb-2">
                <h3
                  className={`accordion-header${idx === 0 ? ' open' : ''}`}
                  onClick={(e) => {
                    const header = e.currentTarget;
                    const caret = header.querySelector('.accordion-caret') as HTMLElement;
                    header.classList.toggle('open');
                    if (caret) {
                      caret.style.transform = header.classList.contains('open')
                        ? 'rotate(270deg)'
                        : 'rotate(90deg)';
                    }
                    const body = header.nextElementSibling as HTMLElement;
                    body?.classList.toggle('show');
                  }}
                >
                  <div className="accordion-title-row">
                    <span className="accordion-question">{item.question}</span>
                    <img
                      src={ICON_CHEVRON}
                      alt="Toggle"
                      className="accordion-caret"
                      style={{ transform: idx === 0 ? 'rotate(270deg)' : 'rotate(90deg)' }}
                    />
                  </div>
                </h3>
                <div className={`accordion-body${idx === 0 ? ' show' : ''}`}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Helped Section */}
        <section className="container py-5">
          <h2 className="section-title">We have helped thousands of patients with our services</h2>
          <p className="section-text">
            Having blocked ears can be one of the most frustrating feelings there is, but our team of professionals can quickly and efficiently remove the earwax using our microsuction technique.
          </p>
          <button className="btn-accent" onClick={() => navigate('/book/18')}>
            Book your appointment now
          </button>
        </section>

        {/* Why choose us */}
        <section className="container py-5">
          <h2 className="section-title">Why choose us?</h2>
          <ul className="why-list">
            <li>10+ years experience</li>
            <li>2,000+ happy patients</li>
            <li>5+ expert staff members</li>
            <li>Using the latest technology</li>
            <li>Detailed assessment of your ear health</li>
          </ul>
          <button className="btn-accent" onClick={() => navigate('/book/18')}>
            Book your appointment now
          </button>
        </section>

        {/* What to do before */}
        <section className="container py-5">
          <h2 className="section-title">What to do before you come in</h2>
          <ul className="before-list">
            <li>Use olive oil drops (twice daily for 5 days).</li>
            <li>Avoid inserting anything into your ears on the day.</li>
            <li>Relax and let our professionals handle the rest.</li>
          </ul>
        </section>

        {/* Pricing & Steps */}
        <section className="container py-5">
          <h2 className="section-title">Pricing & How it works</h2>
          <p className="section-text">
            Our service is £35 for one ear and £55 for two ears.
          </p>
          <div className="steps-row">
            <div className="step">
              <h3>Book an appointment</h3>
              <p>Save yourself from waiting in the queue, book online or by phone.</p>
            </div>
            <div className="step">
              <h3>Attend your consultation</h3>
              <p>Our clinicians are highly proficient in providing principal care.</p>
            </div>
            <div className="step">
              <h3>Receive treatment</h3>
              <p>Please book the appointment before coming in .</p>
              <p>See above.</p>
            
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default MicrosuctionPage;


// // src/pages/auth/MicrosuctionPage.tsx
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../Header';
// import './MicrosuctionPage.css';

// const ICON_CHEVRON =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

// const MicrosuctionPage: React.FC = () => {
//   const navigate = useNavigate();

//   // FAQ items
//   const faqItems = [
//     { question: 'How long does it take?', answer: 'The treatment usually takes about 15 to 20 minutes. It’s quick and you can go back to your day straight after.' },
//     { question: 'Can I hear straight away?', answer: 'Many people feel an improvement in their hearing straight after. It can be a relief if your ears were blocked with wax!' },
//     { question: 'Do I need to prepare for it?', answer: 'Using ear drops a few days before can help soften the wax, making it easier to remove. We’ll let you know if that’s needed.' },
//     { question: 'Does microsuction hurt?', answer: 'No, it shouldn’t hurt. Most people feel comfortable during the treatment. You might feel a slight tickle or suction in your ear, but it’s over quickly.' },
//   ];

//   const [openFaqs, setOpenFaqs] = useState<boolean[]>(faqItems.map(() => false));
//   const toggleFaq = (index: number) => {
//     setOpenFaqs(prev => {
//       const next = [...prev];
//       next[index] = !next[index];
//       return next;
//     });
//   };

//   return (
//     <>
//       <Header />
//       <main className="pt-header microsuction-page">
//         {/* Hero */}
//         <section className="hero-section container py-5">
//           <h1 className="hero-title">Professional Ear Wax Removal in <br/>– Book Your Appointment Today!</h1>
//           <ul className="hero-bullets">
//             <li>10+ years of experience performing microsuction procedures</li>
//             <li>Quick and simple, lasting just 15-20 minutes</li>
//             <li>The most effective way to clean your ears & improve your hearing</li>
//           </ul>
//           <button className="btn btn-primary btn-lg mb-4" onClick={() => navigate('/book/4')}>
//             Book your appointment now
//           </button>
//           <div className="hero-images">
//             <img src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75" alt="ear wax removal 1" />
           
//           </div>
//           <div className="rating">
//             <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png" alt="Google logo" />
//             <span>★★★★★ 4.9/5.0</span>
//           </div>
//         </section>

//         {/* About section */}
//         <section className="container py-5">
//           <h2 className="section-title">About Microsuction Earwax Removal</h2>
//           <p className="section-text">
//             Microsuction is a safe and simple way to clean blocked ears. It uses a tiny suction device to gently remove wax without any mess. This treatment is quick, painless, and done by trained professionals at our pharmacy to help you hear clearly again.
//           </p>
//           <div className="accordion" id="faq">
//             {faqItems.map((item, i) => (
//               <div key={i} className="accordion-item">
//                 <button className={`accordion-header ${openFaqs[i] ? 'open' : ''}`} onClick={() => toggleFaq(i)}>
//                   <span>{item.question}</span>
//                   <img src={ICON_CHEVRON} className={`caret ${openFaqs[i] ? 'rotated' : ''}`} alt="toggle" />
//                 </button>
//                 {openFaqs[i] && <div className="accordion-body">{item.answer}</div>}
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Helped Section */}
//         <section className="container py-5">
//           <h2 className="section-title">We have helped thousands of patients with our services</h2>
//           <p className="section-text">
//             Having blocked ears can be one of the most frustrating feelings there is, but our team of professionals can quickly and efficiently remove the earwax using our microsuction technique.
//           </p>
//           <button className="btn btn-primary" onClick={() => navigate('/book/4')}>Book your appointment now</button>
//         </section>

//         {/* Why choose us */}
//         <section className="container py-5">
//           <h2 className="section-title">Why choose us?</h2>
//           <ul className="why-list">
//             <li>10+ years experience</li>
//             <li>2,000+ happy patients</li>
//             <li>5+ expert staff members</li>
//             <li>Using the latest technology</li>
//             <li>Detailed assessment of your ear health</li>
//           </ul>
//           <button className="btn btn-primary" onClick={() => navigate('/book/4')}>Book your appointment now</button>
//         </section>

//         {/* Before section */}
//         <section className="container py-5">
//           <h2 className="section-title">What to do before you come in</h2>
//           <ul className="before-list">
//             <li>Use olive oil drops (twice daily for 5 days).</li>
//             <li>Avoid inserting anything into your ears on the day.</li>
//             <li>Relax and let our professionals handle the rest.</li>
//           </ul>
//         </section>

//         {/* Pricing & steps */}
//         <section className="container py-5">
//           <h2 className="section-title">Pricing & How it works</h2>
//           <p className="section-text">Our service is £50 for one ear and £65 for two ears. £25 consult fee if no wax removed.</p>
//           <div className="steps-row">
//             <div className="step">
//               <h3>Book an appointment</h3>
//               <p>Save yourself from waiting in the queue, book online or by phone.</p>
//             </div>
//             <div className="step">
//               <h3>Attend your consultation</h3>
//               <p>Our clinicians are highly proficient in providing principal care.</p>
//             </div>
//             <div className="step">
//               <h3>Receive treatment</h3>
//               <p>Collect your medication or choose home delivery.</p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default MicrosuctionPage;
