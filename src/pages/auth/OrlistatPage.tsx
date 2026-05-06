// // src/pages/OrlistatPage.tsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Header from '../Header';
// import './MounjaroPage.css';

// const MAIN_TEXT_COLOR = 'rgb(68, 135, 198)';
// const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

// const OrlistatPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <Header />

//       <main>
//         {/* HERO / INTRO */}
//         <section className="container hero-section">
//           <div className="row justify-content-center">
//             <div className="col-md-8 text-center">
//               <h1
//                 className="page-title"
//                 style={{
//                   color: MAIN_TEXT_COLOR,
//                   fontWeight: 700,
//                   fontSize: '2.5rem',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 Orlistat
//               </h1>

//               {/* text under the title → left aligned, but centered block */}
//               <ul
//                 className="hero-bullets text-start mx-auto"
//                 style={{ maxWidth: 760 }}
//               >
//                 <li>Helps reduce fat absorption from meals</li>
//                 <li>Pharmacy-led care with quick assessment</li>
//                 <li>Works best alongside diet & activity changes</li>
//                 <li>Discreet supply and ongoing support</li>
//               </ul>

//               {/* button remains centered */}
//               <button
//                 className="btn-accent"
//                 onClick={() => navigate('/book/67')}
//               >
//                 Start your Orlistat assessment
//               </button>

//               <div className="hero-image-wrap">
//                 <img
//                   src="https://yourmedicals.co.uk/cdn/shop/files/Untitleddesign_24.png?v=1722501684"
//                   alt="Orlistat capsules"
//                   className="hero-image"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ORLISTAT @ COLESHILL */}
//         <section className="container about-section">
//           <h2 className="section-heading">Orlistat at Coleshill Pharmacy</h2>
//           <p className="section-subtext text-start">
//             Orlistat is a licensed weight-loss medicine that blocks some of the fat
//             you eat from being absorbed. Our friendly team will check suitability,
//             give practical diet tips, and support you throughout your treatment so
//             you can make safe, sustainable progress.
//           </p>
//         </section>

//         {/* WHY CHOOSE ORLISTAT */}
//         <section className="container about-section">
//           <h2 className="section-heading">Why choose Orlistat?</h2>
//           <p className="section-subtext text-start">
//             Orlistat works in your gut to reduce fat absorption—unlike appetite
//             suppressants. With our pharmacy support, you’ll get:
//           </p>
//           <ul
//             className="hero-bullets text-start"
//             style={{ maxWidth: 760 }}
//           >
//             <li>Clear guidance on a reduced-fat eating plan</li>
//             <li>Advice on vitamins (A, D, E, K) and timing</li>
//             <li>Regular check-ins to track progress</li>
//             <li>Discreet, local service from our UK pharmacy</li>
//           </ul>
//           <div className="about-image-wrap">
//             <img
//               src="https://yourmedicals.co.uk/cdn/shop/files/Untitleddesign_24.png?v=1722501684"
//               alt="Healthy lifestyle with Orlistat"
//               className="about-image"
//             />
//           </div>
//         </section>

//         {/* PRICING */}
//         <section className="container products-section">
//           <h2 className="section-heading">Orlistat Pricing</h2>
//           <div className="pricing-list">
//             <div className="pricing-card text-start">
//               <h3 className="product-title">Orlistat 60mg</h3>
//               <p className="product-sub">
//                 84 capsules — <strong>£34.99</strong>
//               </p>
//               <p className="product-sub small">
//                 Suitable for adults with BMI ≥28 (subject to assessment).
//               </p>
//             </div>
//             <div className="pricing-card text-start">
//               <h3 className="product-title">Orlistat 60mg</h3>
//               <p className="product-sub">
//                 120 capsules — <strong>£44.99</strong>
//               </p>
//               <p className="product-sub small">
//                 Best value course. We’ll confirm suitability.
//               </p>
//             </div>
//             <div className="pricing-card text-start">
//               <h3 className="product-title">Orlistat 120mg</h3>
//               <p className="product-sub">
//                 84 capsules — <strong>£59.99</strong>
//               </p>
//               <p className="product-sub small">
//                 Prescription-strength; clinical approval required.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* HOW IT WORKS */}
//         <section className="container about-section">
//           <h2 className="section-heading">How the service works</h2>
//           <div className="timeline-cards text-start">
//             <div className="timeline-card">
//               <span className="timeline-label">Step 1</span>
//               <h4 className="timeline-title">Online consultation</h4>
//               <p className="timeline-text">
//                 Tell us about your health, medicines and goals. We’ll quickly check if Orlistat is appropriate for you.
//               </p>
//             </div>
//             <div className="timeline-card">
//               <span className="timeline-label">Step 2</span>
//               <h4 className="timeline-title">Pharmacist review</h4>
//               <p className="timeline-text">
//                 Get tailored advice on diet, fat intake targets, and vitamin timing to reduce side effects.
//               </p>
//             </div>
//             <div className="timeline-card">
//               <span className="timeline-label">Step 3</span>
//               <h4 className="timeline-title">Collect or get delivered</h4>
//               <p className="timeline-text">
//                 Discreet supply. We’ll follow up to support your progress and answer questions.
//               </p>
//             </div>
//           </div>

//           {/* keep button centered */}
//           <div className="text-center mt-4">
//             <button
//               className="btn-accent"
//               style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
//               onClick={() => navigate('/book/12')}
//             >
//               Start your assessment
//             </button>
//           </div>
//         </section>

//         {/* DETAILED INFO */}
//         <section className="container about-section">
//           <h2 className="section-heading">Orlistat overview</h2>
//           <p className="section-subtext text-start">
//             Orlistat reduces absorption of dietary fat by inhibiting pancreatic and gastric lipases. It’s most effective alongside a lower-fat, lower-calorie diet and increased activity.
//           </p>

//           <h3 className="subsection-heading">Using Orlistat safely</h3>
//           <p className="section-subtext text-start">
//             Common effects include oily stools and urgency—especially with high-fat meals. A daily multivitamin at bedtime may be recommended. Tell us if you take warfarin, ciclosporin or levothyroxine—extra monitoring or spacing doses may be needed.
//           </p>

//           <h3 className="subsection-heading">Who it suits</h3>
//           <p className="section-subtext text-start">
//             Generally adults with BMI ≥30, or ≥28 with risk factors. Not suitable if pregnant/breast-feeding, or with chronic malabsorption or cholestasis. We’ll assess your medical history to confirm suitability.
//           </p>

//           <h3 className="subsection-heading">FAQ</h3>
//           <div className="accordion text-start" id="orlistatFaq">
//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) body.classList.toggle('show');
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">How soon will I see results?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 Many people notice changes within 12 weeks when combined with a reduced-fat diet and activity plan.
//               </div>
//             </div>

//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) body.classList.toggle('show');
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">Do I need to change my diet?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 Yes—keeping total fat low reduces side effects and improves results. We’ll give you a simple plan to follow.
//               </div>
//             </div>

//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) body.classList.toggle('show');
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">Is 60mg or 120mg right for me?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 We’ll advise the safest strength after your assessment. 120mg is prescription-strength and requires clinical approval.
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* FIND US / CONTACT */}
//         <section id="find-us" className="container py-5 find-us">
//           <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6 text-start">
//               <p>Contact us for weight loss advice and a wide range of NHS or private services.</p>
//               <p><strong>Phone:</strong> 01675 466014</p>
//               <p><strong>Email:</strong> coleshillpharmacy@gmail.com</p>
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

// export default OrlistatPage;
// src/pages/OrlistatPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './MounjaroPage.css';

const DARK_BG = '#0F1637';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

const orlistatImage =
  'https://pharmacyservice.co.uk/wp-content/uploads/pharmacy_mentor/importImages/orlistat-120mg-2.jpeg';

const heroBullets = [
  'Helps reduce fat absorption from meals',
  'Pharmacy-led care with quick assessment',
  'Works best alongside diet and activity changes',
  'Discreet supply and ongoing support',
];

const pricing = [
  {
    strength: 'Orlistat 60mg',
    supply: '84 capsules',
    price: '£34.99',
    note: 'Suitable for adults with BMI ≥28, subject to assessment.',
  },
  {
    strength: 'Orlistat 60mg',
    supply: '120 capsules',
    price: '£44.99',
    note: 'Best value course. We will confirm suitability before supply.',
  },
  {
    strength: 'Orlistat 120mg',
    supply: '84 capsules',
    price: '£59.99',
    note: 'Prescription-strength treatment. Clinical approval required.',
  },
];

const serviceSteps = [
  {
    label: 'Step 1',
    title: 'Online consultation',
    text:
      'Tell us about your health, current medicines and weight-loss goals so we can check suitability.',
  },
  {
    label: 'Step 2',
    title: 'Pharmacist review',
    text:
      'Our pharmacist will review your answers and provide advice on diet, fat intake and safe use.',
  },
  {
    label: 'Step 3',
    title: 'Supply & support',
    text:
      'If suitable, your treatment can be supplied discreetly with ongoing support from our pharmacy team.',
  },
];

const benefits = [
  {
    title: 'Fat absorption',
    text:
      'Orlistat works in the gut by reducing the absorption of some dietary fat from meals.',
  },
  {
    title: 'Diet support',
    text:
      'We provide practical advice on lower-fat eating to improve results and reduce side effects.',
  },
  {
    title: 'Pharmacy care',
    text:
      'Our team checks suitability, explains safe use and supports you during treatment.',
  },
];

const faqItems = [
  {
    question: 'How soon will I see results?',
    answer:
      'Many people notice changes within 12 weeks when Orlistat is used with a reduced-fat diet and regular activity.',
  },
  {
    question: 'Do I need to change my diet?',
    answer:
      'Yes. Keeping your fat intake lower helps Orlistat work better and reduces side effects such as oily stools or urgency.',
  },
  {
    question: 'Is 60mg or 120mg right for me?',
    answer:
      'We will advise the safest option after your assessment. Orlistat 120mg is prescription-strength and requires clinical approval.',
  },
  {
    question: 'Can Orlistat affect vitamins?',
    answer:
      'Yes. Orlistat can reduce absorption of fat-soluble vitamins A, D, E and K. A multivitamin may be recommended, usually taken at bedtime away from Orlistat.',
  },
];

const OrlistatPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <Header />

      {/* Using mounjaro-page class because this imports MounjaroPage.css */}
      <main className="pt-header mounjaro-page">
        {/* HERO */}
        <section className="mj-hero">
          <div className="mj-hero__bg" aria-hidden="true" />

          <div className="container mj-hero__inner">
            <div className="mj-hero__content">
              <span className="mj-eyebrow">
                Coleshill Pharmacy · Weight Loss Clinic
              </span>

              <h1 className="mj-hero__title">
                Orlistat
                <span className="mj-hero__title-accent">
                  weight loss support
                </span>
              </h1>

              <p className="mj-hero__lede">
                A clinically used oral weight-loss medicine that helps reduce
                fat absorption when combined with a lower-fat diet and lifestyle
                support.
              </p>

              <ul className="mj-hero__bullets">
                {heroBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="mj-hero__cta">
                <button
                  type="button"
                  className="mj-btn-accent"
                  onClick={() => navigate('/book/67')}
                >
                  Book your consultation
                </button>

                <a href="#pricing" className="mj-btn-ghost">
                  View pricing
                </a>
              </div>
            </div>

            <div className="mj-hero__media">
              <div className="mj-hero__media-frame">
                <img src={orlistatImage} alt="Orlistat capsules" />
              </div>

              <div className="mj-hero__badge">
                <strong>Oral</strong>
                <span>capsule treatment</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="container mj-section mj-about">
          <div className="mj-section__head">
            <span className="mj-kicker">Treatment overview</span>
            <h2>Orlistat at Coleshill Pharmacy</h2>
            <p className="mj-section__lede">
              Orlistat is a licensed weight-loss medicine that works in the gut
              by reducing the amount of fat absorbed from meals. Our team will
              check suitability and provide practical advice to support safe,
              sustainable progress.
            </p>
          </div>

          <div className="mj-split">
            <div className="mj-split__text">
              <h3>Why choose Orlistat?</h3>
              <p>
                Orlistat works differently from appetite-suppressing medicines.
                It is taken with meals and works best when combined with a
                reduced-fat eating plan.
              </p>

              <ul className="mj-check-list">
                <li>Clear guidance on a reduced-fat diet</li>
                <li>Advice on fat-soluble vitamins A, D, E and K</li>
                <li>Support with side effects such as oily stools or urgency</li>
                <li>Discreet local service from our pharmacy team</li>
              </ul>
            </div>

            <div className="mj-split__image">
              <img src={orlistatImage} alt="Orlistat weight loss treatment" />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="container mj-section mj-pricing">
          <div className="mj-section__head">
            <span className="mj-kicker">Pricing</span>
            <h2>
              Orlistat pricing at <span className="accent">Coleshill</span>
            </h2>
            <p className="mj-section__lede">
              All supplies are subject to pharmacist assessment and suitability.
            </p>
          </div>

          <div className="mj-pricing-grid">
            {pricing.map((item, idx) => (
              <div key={`${item.strength}-${idx}`} className="mj-pricing-card">
                <span className="mj-price-tag">{item.supply}</span>
                <h3>{item.strength}</h3>
                <p>
                  Treatment supply — <strong>{item.price}</strong>
                </p>
                <p style={{ marginTop: '0.6rem', fontSize: '0.92rem' }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="container mj-section mj-benefits">
          <div className="mj-section__head">
            <span className="mj-kicker">Why it works</span>
            <h2>Orlistat with pharmacy support</h2>
          </div>

          <div className="mj-cards-grid mj-benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={benefit.title} className="mj-benefit-card">
                <span className="mj-benefit-num">0{idx + 1}</span>
                <h3>{benefit.title}</h3>
                <p>{benefit.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIMELINE */}
        <section
          className="mj-timeline"
          style={{ backgroundColor: DARK_BG, color: '#fff' }}
        >
          <div className="container">
            <div className="mj-section__head mj-section__head--light">
              <span className="mj-kicker mj-kicker--light">Your journey</span>
              <h2>How the Orlistat service works</h2>
            </div>

            <div className="mj-timeline-grid">
              {serviceSteps.map((step) => (
                <div key={step.label} className="mj-timeline-step">
                  <span className="mj-timeline-label">{step.label}</span>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              ))}
            </div>

            <div className="mj-timeline-cta">
              <button
                type="button"
                className="mj-btn-accent"
                onClick={() => navigate('/book/67')}
              >
                Book your consultation
              </button>
            </div>
          </div>
        </section>

        {/* DETAILED INFORMATION */}
        <section className="container mj-section mj-info">
          <div className="mj-section__head">
            <span className="mj-kicker">Patient information</span>
            <h2>Orlistat overview</h2>
            <p className="mj-section__lede">
              Important information to help you use Orlistat safely and get the
              most from treatment.
            </p>
          </div>

          <div className="mj-info-card">
            <h3>What is Orlistat?</h3>
            <p>
              Orlistat is a weight-loss medicine that reduces absorption of
              dietary fat by inhibiting pancreatic and gastric lipases. It works
              locally in the gut and should be used with a reduced-fat,
              calorie-controlled diet.
            </p>

            <h3>Using Orlistat safely</h3>
            <p>
              Orlistat is usually taken with meals that contain fat. If a meal is
              missed or contains no fat, the dose is usually skipped. Taking it
              with high-fat meals increases the chance of side effects.
            </p>

            <h3>Managing side effects</h3>
            <p>
              Common effects include oily stools, urgency, wind and increased
              bowel movements. These are more likely if your meal contains too
              much fat.
            </p>

            <h3>Vitamins and interactions</h3>
            <p>
              Orlistat can reduce absorption of fat-soluble vitamins A, D, E and
              K. A multivitamin may be recommended at bedtime. Tell us if you
              take warfarin, ciclosporin or levothyroxine, as extra advice,
              dose spacing or monitoring may be needed.
            </p>

            <h3>Who it may not suit</h3>
            <p>
              Orlistat may not be suitable during pregnancy or breastfeeding, or
              in people with chronic malabsorption or cholestasis. We will assess
              your health and medicines before supply.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mj-section mj-faq">
          <div className="mj-section__head">
            <span className="mj-kicker">FAQs</span>
            <h2>Frequently asked questions</h2>
          </div>

          <div className="mj-accordion">
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={item.question}
                  className={`mj-accordion-item${isOpen ? ' is-open' : ''}`}
                >
                  <button
                    type="button"
                    className={`mj-accordion-header${isOpen ? ' open' : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={`orlistat-faq-${idx}`}
                    onClick={() => toggleFaq(idx)}
                  >
                    <span>{item.question}</span>
                    <img
                      src={ICON_CHEVRON}
                      alt=""
                      aria-hidden="true"
                      className={`mj-accordion-caret${isOpen ? ' rotated' : ''}`}
                    />
                  </button>

                  <div
                    id={`orlistat-faq-${idx}`}
                    className={`mj-accordion-body${isOpen ? ' show' : ''}`}
                    role="region"
                  >
                    <div className="mj-accordion-body__inner">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FIND US */}
        <section id="find-us" className="container mj-section mj-find-us">
          <div className="mj-section__head">
            <span className="mj-kicker">Visit</span>
            <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>
              Find us
            </h2>
          </div>

          <div className="mj-find-us__grid">
            <div className="mj-find-us__info">
              <p>
                Contact us for weight loss advice, travel vaccination, ear wax
                removal, and a wide range of NHS or private services.
              </p>

              <ul className="mj-find-us__list">
                <li>
                  <strong>Phone</strong>
                  <a href="tel:01675466014">01675 466014</a>
                </li>
                <li>
                  <strong>Email</strong>
                  <a href="mailto:coleshillpharmacy@gmail.com">
                    coleshillpharmacy@gmail.com
                  </a>
                </li>
                <li>
                  <strong>Address</strong>
                  <span>114–116 High St, Coleshill, Birmingham B46 3BJ</span>
                </li>
                <li>
                  <strong>Hours</strong>
                  <span>
                    Monday–Friday 8:30 am – 6 pm
                    <br />
                    Saturday 9 am – 5:30 pm
                    <br />
                    Sunday Closed
                  </span>
                </li>
              </ul>
            </div>

            <div className="mj-find-us__map">
              <iframe
                title="Coleshill Pharmacy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
                width="100%"
                height="360"
                style={{ border: 0, borderRadius: '0.75rem' }}
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

export default OrlistatPage;