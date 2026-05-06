// // WegovyPage.tsx

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../Header';
// import './WeGovyPage.css';

// const MAIN_TEXT_COLOR = 'rgb(68, 135, 198)';
// const ACCENT_COLOR = '#00D364';
// const DARK_BG = '#0F1637';
// const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

// const WegovyPage: React.FC = () => {
//   const navigate = useNavigate();

//   // Helper to create URL-friendly slugs if needed
//   const slugify = (str: string) =>
//     str
//       .toLowerCase()
//       .replace(/[()]/g, '')
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/^-+|-+$/g, '');

//   return (
//     <>
//       {/* Use the SAME <Header /> from your other pages */}
//       <Header />

//       <main className="pt-header">
//         {/* ===============================
//             BREADCRUMB / PAGE PATH
//            =============================== */}
//         {/* <div className="breadcrumb-wrapper">
//           <div className="container">
//             <nav className="page-path">
//               <Link to="/">Home</Link>
//               <span className="sep">›</span>
//               <Link to="/services">Services</Link>
//               <span className="sep">›</span>
//               <Link to="/weight-loss-management">Weight loss</Link>
//               <span className="sep">›</span>
//               <span className="current">Wegovy</span>
//             </nav>
//           </div>
//         </div> */}
//         {/* =============================== */}

//         {/* ===============================
//             HERO / INTRODUCTION SECTION
//            =============================== */}
//         <section className="container hero-section">
//           <div className="row justify-content-center">
//             <div className="col-md-8 text-center">
//               {/* Page Title */}
//               <h1
//                 className="page-title"
//                 style={{
//                   color: MAIN_TEXT_COLOR,
//                   fontWeight: 700,
//                   fontSize: '2.5rem',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 Wegovy
//               </h1>

//               {/* Bullet Points */}
//               <ul className="hero-bullets">
//                 <li>
//                   {/* <span className="bullet-icon">✓</span> */}
//                   Clinically proven approach to weight management
//                 </li>
//                 <li>
//                   {/* <span className="bullet-icon">✓</span> */}
//                   Comprehensive support from our pharmacy team
//                 </li>
//                 <li>
//                   {/* <span className="bullet-icon">✓</span> */}
//                   Personalised guidance for long-term success
//                 </li>
//                 <li>
//                   {/* <span className="bullet-icon">✓</span> */}
//                   Convenient treatment plan tailored to your lifestyle
//                 </li>
//               </ul>

//               {/* Book Appointment CTA */}
//               <button
//                 className="btn-accent"
//                 onClick={() => navigate('/book/66')} // Assuming 16 is the ID for Wegovy booking
//               >
//                 Book Your Wegovy Consultation
//               </button>

//               {/* Hero Image */}
//               <div className="hero-image-wrap">
//                 <img
//                   src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FlO0TFZ73tv0D9H5.webp&w=1080&q=75"
//                   className="hero-image"
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//         {/* =============================== */}

//         {/* ===============================
//             WEGOVY AT CHATHAM PHARMACY SECTION
//            =============================== */}
//         <section className="container about-section">
//           <h2 className="section-heading">Wegovy at Coleshill Pharmacy</h2>
//           <p className="section-subtext">
//             A new, evidence-based solution, underpinned by rigorous clinical
//             research, that helps adults manage their weight effectively and
//             safely. By combining proven medical insights with personalised
//             support, this approach addresses the core challenges of weight loss
//             while promoting long-term lifestyle changes to maintain and improve
//             overall well-being.
//           </p>
//         </section>
//         {/* =============================== */}

//         {/* ===============================
//             WHY CHOOSE WEGOVY? SECTION
//            =============================== */}
//         <section className="container about-section">
//           <h2 className="section-heading">Why Choose Wegovy?</h2>
//           <p className="section-subtext">
//             Wegovy is a prescription medicine designed specifically for weight
//             loss. <br />
//             At Coleshill Pharmacy, we combine friendly advice with professional
//             expertise to ensure you’re supported every step of the way.
//             <br />
//             From the initial consultation to ongoing monitoring, our dedicated
//             team is here to help you reach your goals with confidence.
//           </p>
//           <div className="about-image-wrap">
//             <img
//               src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fpromo%2FX_yYcVWixlsJA3I.webp&w=3840&q=75"
//               alt="Why Choose Wegovy?"
//               className="about-image"
//             />
//           </div>
//         </section>
//         {/* =============================== */}

//         {/* ===============================
//             WEGOVY PRICING SECTION
//            =============================== */}
//         <section className="container products-section">
//           <h2 className="section-heading">Wegovy Pricing</h2>
//           <div className="pricing-list">
//             <div className="pricing-card">
//               <h3 className="product-title">Wegovy 0.25mg</h3>
//               <p className="product-sub">
//                 1 Injection (4 weeks supply) — <strong>£99.00</strong>
//               </p>
//             </div>
//             <div className="pricing-card">
//               <h3 className="product-title">Wegovy 0.5mg</h3>
//               <p className="product-sub">
//                 1 Injection (4 weeks supply) — <strong>£119.00</strong>
//               </p>
//             </div>
//             <div className="pricing-card">
//               <h3 className="product-title">Wegovy 1mg</h3>
//               <p className="product-sub">
//                 1 Injection (4 weeks supply) — <strong>£139.00</strong>
//               </p>
//             </div>
//             <div className="pricing-card">
//               <h3 className="product-title">Wegovy 1.7mg</h3>
//               <p className="product-sub">
//                 1 Injection (4 weeks supply) — <strong>£179.00</strong>
//               </p>
//             </div>
//             <div className="pricing-card">
//               <h3 className="product-title">Wegovy 2.4mg</h3>
//               <p className="product-sub">
//                 1 Injection (4 weeks supply) — <strong>£199.00</strong>
//               </p>
//             </div>
//           </div>
//         </section>
//         {/* =============================== */}

//         {/* ===============================
//             HOW IT WORKS SECTION
//            =============================== */}
//         <section className="container about-section">
//           <h2 className="section-heading">How the Wegovy Service Works</h2>
//           <div className="timeline-cards">
//             <div className="timeline-card">
//               <span className="timeline-label">Step 1</span>
//               <h4 className="timeline-title">Initial Consultation</h4>
//               <p className="timeline-text">
//                 Speak with our pharmacy team to discuss whether Wegovy is suitable
//                 for your specific health needs.
//               </p>
//             </div>
//             <div className="timeline-card">
//               <span className="timeline-label">Step 2</span>
//               <h4 className="timeline-title">Prescription & Setup</h4>
//               <p className="timeline-text">
//                 Receive your personalised dosage plan and learn how to self-administer
//                 the injections safely.
//               </p>
//             </div>
//             <div className="timeline-card">
//               <span className="timeline-label">Step 3</span>
//               <h4 className="timeline-title">Ongoing Support</h4>
//               <p className="timeline-text">
//                 Attend check-ups and follow our guidance on lifestyle, diet, and exercise
//                 to maximise results.
//               </p>
//             </div>
//           </div>

//           <div className="text-center mt-4">
//             <button
//               className="btn-accent"
//               style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
//               onClick={() => navigate('/book/66')}
//             >
//               Book Your Appointment Now
//             </button>
//           </div>
//         </section>
//         {/* =============================== */}

//         {/* ===============================
//             DETAILED INFORMATION SECTIONS
//            =============================== */}
//         <section className="container about-section">
//           <h2 className="section-heading1">Wegovy Overview</h2>
//           <p className="section-subtext">
//             Wegovy is a prescription medication designed to support weight management.
//             It works by helping individuals reduce appetite and manage food intake.
//             This advice is strictly for informational purposes.
//           </p>

//           <h3 className="subsection-heading">What Is Wegovy?</h3>
//           <p className="section-subtext">
//             Wegovy is a glucagon-like peptide-1 receptor agonist. It assists in weight
//             loss by moderating hunger signals. The medication requires a clear plan and
//             careful oversight.
//           </p>

//           <h3 className="subsection-heading">Using Wegovy Safely</h3>
//           <p className="section-subtext">
//             Safety is paramount when using Wegovy. Always follow instructions provided
//             by your healthcare professional. Do not change your dosage without proper advice.
//           </p>
//           <p className="section-subtext">
//             Consult your doctor before starting any new treatment. This medication
//             must only be used under medical supervision. Inform your professional of
//             any existing conditions.
//           </p>

//           <h3 className="subsection-heading">Preparing for Wegovy Treatment</h3>
//           <p className="section-subtext">
//             Preparation is a key step in achieving successful outcomes. A full medical
//             evaluation helps to ensure you are a suitable candidate. Organise your
//             records and discuss your health history with your doctor.
//           </p>
//           <p className="section-subtext">
//             Adopting a balanced diet and regular exercise can enhance treatment effects.
//             Consider keeping a food diary and exercise log. This practice supports long-term
//             wellbeing and can improve overall treatment outcomes.
//           </p>

//           <h3 className="subsection-heading">Managing Side Effects</h3>
//           <p className="section-subtext">
//             Side effects may occur during treatment. Common issues include mild nausea
//             and slight headaches. It is essential to note any changes and report concerns
//             to your healthcare provider promptly.
//           </p>
//           <p className="section-subtext">
//             If symptoms worsen or become severe, consult your doctor immediately. Persistent
//             discomfort should not be ignored. Early intervention can prevent complications
//             and ensure safe treatment progression.
//           </p>

//           <h3 className="subsection-heading">Monitoring Your Progress</h3>
//           <p className="section-subtext">
//             Regular monitoring is a vital part of treatment. Keep a record of weight changes
//             and any side effects. This information will help tailor ongoing advice and
//             adjustments to your treatment plan.
//           </p>
//           <p className="section-subtext">
//             Record body weight and vital signs regularly. A simple journal can capture daily
//             changes. Accurate data assists in making informed treatment decisions.
//           </p>

//           <h3 className="subsection-heading">Frequently Asked Questions</h3>
//           <div className="accordion" id="wegovyFaq">
//             {/* FAQ Item 1 */}
//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) {
//                     if (header.classList.contains('open')) {
//                       caret.style.transform = 'rotate(270deg)';
//                     } else {
//                       caret.style.transform = 'rotate(90deg)';
//                     }
//                   }
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) {
//                     body.classList.toggle('show');
//                   }
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">How quickly will I notice results with Wegovy?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 Results can vary from person to person. Some may see changes within the first month,
//                 while others may take a bit longer. Sticking to your dosage schedule and following
//                 lifestyle advice usually helps achieve the best outcomes.
//               </div>
//             </div>
//             {/* FAQ Item 2 */}
//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) {
//                     if (header.classList.contains('open')) {
//                       caret.style.transform = 'rotate(270deg)';
//                     } else {
//                       caret.style.transform = 'rotate(90deg)';
//                     }
//                   }
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) {
//                     body.classList.toggle('show');
//                   }
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">Are there any side effects?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 Some people experience mild digestive upset or injection-site discomfort.
//                 Always discuss any ongoing side effects with our pharmacy team or your GP
//                 for further advice.
//               </div>
//             </div>
//             {/* FAQ Item 3 */}
//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) {
//                     if (header.classList.contains('open')) {
//                       caret.style.transform = 'rotate(270deg)';
//                     } else {
//                       caret.style.transform = 'rotate(90deg)';
//                     }
//                   }
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) {
//                     body.classList.toggle('show');
//                   }
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">Can I get Wegovy without a prescription?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 No. Wegovy is a prescription-only medicine and must be approved by a qualified
//                 healthcare professional. This ensures it’s used safely and effectively.
//               </div>
//             </div>
//             {/* FAQ Item 4 */}
//             <div className="accordion-item mb-2">
//               <h3
//                 className="accordion-header"
//                 onClick={(e) => {
//                   const header = e.currentTarget;
//                   const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                   header.classList.toggle('open');
//                   if (caret) {
//                     if (header.classList.contains('open')) {
//                       caret.style.transform = 'rotate(270deg)';
//                     } else {
//                       caret.style.transform = 'rotate(90deg)';
//                     }
//                   }
//                   const body = header.nextElementSibling as HTMLElement;
//                   if (body) {
//                     body.classList.toggle('show');
//                   }
//                 }}
//               >
//                 <div className="accordion-title-row">
//                   <span className="accordion-question">What support can I expect from Coleshill Pharmacy?</span>
//                   <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
//                 </div>
//               </h3>
//               <div className="accordion-body">
//                 Our team will help you understand how to use Wegovy, offer tips on healthy eating
//                 and activity, and monitor your progress to make sure you’re on track for success.
//               </div>
//             </div>
//           </div>
//         </section>
       
//         {/* Find Us */}
//         <section id="find-us" className="container py-5 find-us">
//           <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
//           <div className="row align-items-center mt-4">
//             <div className="col-md-6">
//               <p>Contact us for travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
//               <p><strong>Phone:</strong> 01675 466014</p>
//               <p><strong>Email:</strong> coleshillpharmacy@gmail.com</p>
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

// export default WegovyPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './WeGovyPage.css';

const DARK_BG = '#0F1637';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

const wegovyImage =
  'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FlO0TFZ73tv0D9H5.webp&w=1080&q=75';

const supportImage =
  'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fpromo%2FX_yYcVWixlsJA3I.webp&w=3840&q=75';

const heroBullets = [
  'Clinically proven approach to weight management',
  'Comprehensive support from our pharmacy team',
  'Personalised guidance for long-term success',
  'Convenient treatment plan tailored to your lifestyle',
];

const pricing = [
  { strength: 'Wegovy 0.25mg', price: '£99.00' },
  { strength: 'Wegovy 0.5mg', price: '£119.00' },
  { strength: 'Wegovy 1mg', price: '£139.00' },
  { strength: 'Wegovy 1.7mg', price: '£179.00' },
  { strength: 'Wegovy 2.4mg', price: '£199.00' },
];

const serviceSteps = [
  {
    label: 'Step 1',
    title: 'Initial consultation',
    text:
      'Speak with our pharmacy team to review your health, weight history and treatment goals.',
  },
  {
    label: 'Step 2',
    title: 'Prescription & setup',
    text:
      'If suitable, we explain your dose schedule, storage instructions and how to self-administer safely.',
  },
  {
    label: 'Step 3',
    title: 'Ongoing support',
    text:
      'We help monitor your progress, manage side effects and support healthy lifestyle changes.',
  },
];

const benefits = [
  {
    title: 'Appetite control',
    text:
      'Wegovy helps reduce hunger and supports smaller portions when combined with healthy habits.',
  },
  {
    title: 'Clinical guidance',
    text:
      'Our pharmacy team will check suitability, explain safe use and support you throughout treatment.',
  },
  {
    title: 'Long-term focus',
    text:
      'We support lifestyle changes alongside treatment to help make progress more sustainable.',
  },
];

const faqItems = [
  {
    question: 'How quickly will I notice results with Wegovy?',
    answer:
      'Results vary between patients. Some people notice appetite changes within the first few weeks, but weight loss is usually more noticeable over time when combined with diet and activity.',
  },
  {
    question: 'Are there any side effects?',
    answer:
      'Common side effects include nausea, diarrhoea, constipation, headache and injection-site discomfort. These often improve as your body adjusts to treatment.',
  },
  {
    question: 'Can I get Wegovy without a prescription?',
    answer:
      'No. Wegovy is a prescription-only medicine and must be approved by a qualified healthcare professional to ensure it is safe and suitable for you.',
  },
  {
    question: 'What support can I expect from Coleshill Pharmacy?',
    answer:
      'Our team will help you understand how to use Wegovy, offer guidance on healthy eating and activity, and monitor your progress throughout treatment.',
  },
  {
    question: 'How should Wegovy be stored?',
    answer:
      'Wegovy pens should usually be stored in the fridge. We will explain storage, handling and safe disposal when your treatment is supplied.',
  },
];

const WegovyPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <Header />

      <main className="pt-header wegovy-page">
        {/* HERO */}
        <section className="mj-hero">
          <div className="mj-hero__bg" aria-hidden="true" />

          <div className="container mj-hero__inner">
            <div className="mj-hero__content">
              <span className="mj-eyebrow">
                Coleshill Pharmacy · Weight Loss Clinic
              </span>

              <h1 className="mj-hero__title">
                Wegovy
                <span className="mj-hero__title-accent">
                  weight loss support
                </span>
              </h1>

              <p className="mj-hero__lede">
                A once-weekly injectable treatment with pharmacist-led support
                to help you lose weight safely and build healthier habits.
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
                  onClick={() => navigate('/book/66')}
                >
                  Book your Wegovy consultation
                </button>

                <a href="#pricing" className="mj-btn-ghost">
                  View pricing 
                </a>
              </div>
            </div>

            <div className="mj-hero__media">
              <div className="mj-hero__media-frame">
                <img src={wegovyImage} alt="Wegovy treatment pen" />
              </div>

              <div className="mj-hero__badge">
                <strong>Weekly</strong>
                <span>injectable treatment</span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="container mj-section mj-about">
          <div className="mj-section__head">
            <span className="mj-kicker">Treatment overview</span>
            <h2>Wegovy at Coleshill Pharmacy</h2>
            <p className="mj-section__lede">
              Wegovy is a prescription weight management medicine containing
              semaglutide. It works alongside healthy eating, activity and
              ongoing support to help reduce appetite and manage food intake.
            </p>
          </div>

          <div className="mj-split">
            <div className="mj-split__text">
              <h3>Why choose Wegovy?</h3>
              <p>
                Wegovy is designed specifically for weight management. At
                Coleshill Pharmacy, we combine professional clinical checks with
                friendly support so you feel confident at each stage of treatment.
              </p>

              <ul className="mj-check-list">
                <li>Suitability check before treatment starts</li>
                <li>Clear dose escalation plan and injection guidance</li>
                <li>Support with diet, lifestyle and side-effect management</li>
                <li>Ongoing monitoring to help maintain long-term progress</li>
              </ul>
            </div>

            <div className="mj-split__image">
              <img src={supportImage} alt="Weight loss consultation support" />
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="container mj-section mj-pricing">
          <div className="mj-section__head">
            <span className="mj-kicker">Pricing</span>
            <h2>
              Wegovy pricing at <span className="accent">Coleshill</span>
            </h2>
            <p className="mj-section__lede">
              Each option includes pharmacist-led consultation and support.
            </p>
          </div>

          <div className="mj-pricing-grid">
            {pricing.map((item) => (
              <div key={item.strength} className="mj-pricing-card">
                <span className="mj-price-tag">4 weeks supply</span>
                <h3>{item.strength}</h3>
                <p>
                  1 injection pen — <strong>{item.price}</strong>
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* BENEFITS */}
        <section className="container mj-section mj-benefits">
          <div className="mj-section__head">
            <span className="mj-kicker">Why it works</span>
            <h2>Weight management with clinical support</h2>
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
              <h2>How the Wegovy service works</h2>
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
                onClick={() => navigate('/book/66')}
              >
                Book your appointment now
              </button>
            </div>
          </div>
        </section>

        {/* DETAILED INFORMATION */}
        <section className="container mj-section mj-info">
          <div className="mj-section__head">
            <span className="mj-kicker">Patient information</span>
            <h2>Wegovy overview</h2>
            <p className="mj-section__lede">
              Important information to help you use Wegovy safely and get the
              most from your treatment.
            </p>
          </div>

          <div className="mj-info-card">
            <h3>What is Wegovy?</h3>
            <p>
              Wegovy is a once-weekly injectable medicine containing semaglutide.
              It is a GLP-1 receptor agonist, which means it helps regulate
              appetite and fullness.
            </p>

            <h3>Using Wegovy safely</h3>
            <p>
              Treatment usually starts at a low dose and increases gradually.
              This helps reduce side effects and allows your body to adjust. Do
              not change your dose without professional advice.
            </p>

            <h3>Preparing for treatment</h3>
            <p>
              Before starting, we review your medical history, current medicines,
              allergies and suitability. Keeping a record of your food intake,
              activity and weight can help guide ongoing support.
            </p>

            <h3>Managing side effects</h3>
            <p>
              Common side effects include nausea, diarrhoea, constipation,
              headache and injection-site discomfort. Eating smaller meals,
              avoiding very fatty foods and staying hydrated may help.
            </p>

            <p>
              Seek urgent advice if you develop severe abdominal pain,
              persistent vomiting, signs of dehydration, or symptoms that feel
              severe or unusual.
            </p>

            <h3>Monitoring your progress</h3>
            <p>
              Regular monitoring helps us check your weight loss, tolerability
              and overall wellbeing. Follow-up allows us to support safe
              continuation and adjust advice where needed.
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
                    aria-controls={`wegovy-faq-${idx}`}
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
                    id={`wegovy-faq-${idx}`}
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
                Contact us for weight loss support, travel vaccination, ear wax
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

export default WegovyPage;