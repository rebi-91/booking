import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './WeightlossPage.css';

// Colors
const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';
const ACCENT_COLOR    = '#00D364';
const DARK_BG         = '#0F1637';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const timelineSteps = [
  {
    label: 'TODAY',
    title: 'Simple assessment',
    text:
      "Book an appointment for a free consultation at Coleshill Pharmacy. If eligible, you'll receive your clinically-prescribed medication swiftly.",
  },
  {
    label: '1–6 MONTHS',
    title: 'Healthy weight loss',
    text:
      'Lose weight and learn how to reframe your relationship with food. Expect increased fitness, energy, and confidence.',
  },
  {
    label: '6–12 MONTHS',
    title: 'Lasting change',
    text:
      'With continued support from your coach, adopt healthier lifestyle habits to help maintain weight loss.',
  },
];
// Chevron icon
const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

const faqItems = [
  {
    question: 'Who are Weight loss management for?',
    answer:
      'They’re for people who struggle to lose weight through diet and exercise alone. We’ll check your health to see if they’re right for you.',
  },
  {
    question: 'What side effects might I feel?',
    answer:
      'Some people feel sick or have an upset tummy, but these usually improve as your body adjusts. We’re here to help if you’re worried.',
  },
  {
    question: 'Do I need to change my diet?',
    answer:
      'Yes, it’s important to eat healthy, balanced meals while using Weight loss management. They work best when combined with good eating habits and regular activity.',
  },
  {
    question: 'What are Weight loss management?',
    answer:
      'Weight loss management help you eat less by making you feel full for longer. They work alongside healthy eating and exercise to support your weight loss journey.',
  },
  {
    question: 'How do they help with weight loss?',
    answer:
      'They reduce hunger and help control your appetite, so it’s easier to stick to smaller portions and healthier choices over time.',
  },
  {
    question: 'Can I stop injections anytime?',
    answer:
      'Yes, you can stop if needed, but it’s best to discuss this with us first. We’ll guide you on the next steps for your weight loss.',
  },
  {
    question: 'Are Weight loss management safe?',
    answer:
      'Yes, they are approved and safe when used correctly. We’ll make sure they’re suitable for you before starting treatment.',
  },
];

const weightLossProducts = [
  {
    title: 'Wegovy',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FlO0TFZ73tv0D9H5.webp&w=1080&q=75',
    bullets: [
      'Clinically proven approach to weight management',
      'Comprehensive support from our pharmacy team',
      'Personalised guidance for long-term success',
      'Convenient treatment plan tailored to your lifestyle',
    ],
  },
  {
    title: 'Mounjaro',
    img:
      'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FDZDc21uYIxEas7T.webp&w=1080&q=75',
    bullets: [
      'Innovative approach to weight management',
      'Clinically researched for safe and effective results',
      'Focuses on hormonal pathways to regulate appetite',
      'Supported by our expert pharmacy team',
    ],
  },
];

const benefits = [
  {
    title: 'Proven Treatment',
    text:
      'Clinical trials have seen clients reduce body weight by up to 22%* when combined with a balanced diet and exercise.',
  },
  {
    title: 'Reduce Cravings',
    text:
      'Prescribed, weight loss medication that reduces cravings and helps control your appetite.',
  },
  {
    title: 'Clinical Care',
    text:
      'Dedicated team of clinicians on hand to help you throughout your plan, adjust dosages and manage potential side effects.',
  },
];



const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const WeightlossPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* ===============================
          BREADCRUMB / PAGE PATH
         =============================== */}
      <div className="breadcrumbwrapper">
        <div className="container">
          <nav className="page-path">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/services">Services</Link>
            <span className="sep">›</span>
            <span className="current">Weight Loss Clinic</span>
          </nav>
         
        </div>
      </div>
      {/* =============================== */}

      <main className="pt-header">
      <h1 className="page-title">
            Breakthrough weight-loss injections for<br />
            long-term results
          </h1>
        {/* Hero / Intro */}
        <section className="container hero-section">
          <div className="hero-content">
            <ul className="hero-bullets">
              <li>Clinically proven weight loss of up to 22%*</li>
              <li>Scientifically backed programme</li>
              <li>Continuous clinical care</li>
            </ul>
            <button
              className="btn-accent"
              onClick={() => navigate('/book/12')}
            >
              Book Your Free Consultation
            </button>
          </div>
          <div className="hero-image">
            <img
              src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
              alt="Patient example"
            />
          </div>
        </section>

        {/* About / FAQ */}
        <section className="container about-faq">
          <h2>About Weight Loss Clinic</h2>
          <p>
            Our weight loss clinic is here to support you on your journey to a
            healthier you. We offer Weight loss management alongside friendly
            advice to help you manage your weight safely. Together, we’ll
            create a plan that fits your needs and works with your lifestyle.
          </p>

          <div className="accordion" id="weightLossFaq">
            {faqItems.map((item, idx) => (
              <div key={idx} className="accordion-item">
                <h3
                  className={`accordion-header${idx === 0 ? ' open' : ''}`}
                  onClick={(e) => {
                    const header = e.currentTarget;
                    header.classList.toggle('open');
                    const caret = header.querySelector('.accordion-caret') as HTMLElement;
                    caret?.classList.toggle('rotated');
                    const body = header.nextElementSibling as HTMLElement;
                    body.classList.toggle('show');
                  }}
                >
                  <span className="accordion-question">{item.question}</span>
                  <img
                    src={ICON_CHEVRON}
                    alt="Toggle"
                    className={`accordion-caret${idx === 0 ? ' rotated' : ''}`}
                  />
                </h3>
                <div className={`accordion-body${idx === 0 ? ' show' : ''}`}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weight Loss Products */}
        <section className="container products-grid">
          <h2>
            Weight loss clinic in <span className="accent">Coleshill</span>
          </h2>
          <div className="cards-grid">
            {weightLossProducts.map((prod, idx) => (
              <div key={idx} className="product-card">
                <div className="product-image-container">
                  <img
                    src={prod.img}
                    alt={prod.title}
                    className="product-image"
                  />
                </div>
                <div className="product-body">
                  <h5 className="product-title">{prod.title}</h5>
                  <ul className="product-bullets">
                    {prod.bullets.map((b, i) => (
                      <li key={i}>
                        <span className="bullet-icon-small">►</span> {b}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="btn-outline-primary"
                    onClick={() => navigate(`/${slugify(prod.title)}`)}
                  >
                    Find out more
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Science-backed Section */}
        <section className="container science-backed">
        <div className="benefitsTitle">
          <h2>Weight loss, backed by science</h2>
          </div>
          <div className="cards-grid benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <h5 className="benefit-title">{benefit.title}</h5>
                <p className="benefit-text">{benefit.text}</p>
              </div>
            ))}
          </div>
        </section>

      {/* Progress Timeline Section */}
         <section
          className="container-fluid px-4 py-5"
          style={{ backgroundColor: DARK_BG, color: '#fff' }}
        >
          <div className="container">
            <h2
              style={{
                fontWeight: 700,
                fontSize: '2rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
            >
              The progress you can expect
            </h2>

            <div className="row gy-4">
              {timelineSteps.map((step, idx) => (
                <div key={idx} className="col-md-4 text-center">
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#fff',
                      color: DARK_BG,
                      fontWeight: 700,
                      borderRadius: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {step.label}
                  </span>
                  <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
                    {step.title}
                  </h4>
                  <p
                    style={{
                      lineHeight: 1.6,
                      maxWidth: '300px',
                      margin: '0 auto',
                    }}
                  >
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
         </section>


        {/* Introduction / Importance Section */}
        <section className="intro-section">
          <h2 className="subsection-heading">
            Introduction to weight loss support at Coleshill Pharmacy
          </h2>
          <div className="intro-text-wrapper">
            <p>
              Maintaining a healthy weight can have a positive impact on every aspect
              of your life. Coleshill Pharmacy is here to help you discover the best
              path toward weight loss success.
            </p>
            <p>
              We proudly serve individuals who seek professional, ongoing
              guidance and trustworthy support.
            </p>
            <p>
              At Coleshill Pharmacy, our commitment extends beyond prescriptions. We
              offer ongoing support, progress tracking, and personal recommendations
              that adapt to your life. By combining professional expertise with a
              friendly atmosphere, we help you feel empowered at every stage and
              growth of your weight loss experience.
            </p>

            <h3 className="subsection-heading">
              Understanding the importance of achieving a healthy weight
            </h3>
            <p>
              Excess weight can increase your risk of serious health issues such as
              diabetes and heart disease. By focusing on healthy habits, you can
              lower these risks. A balanced approach to eating, regular physical
              activity, and suitable medications all contribute to a stronger body
              and an improved overall sense of wellbeing.
            </p>
            <p>
              Our clinic provides resources that fit your unique situation, ensuring
              you stay fully informed and motivated.
            </p>
            <p>
              Alongside enhancing your physical health, a healthy weight can also
              boost mental wellbeing. It often leads to improved self-esteem,
              greater confidence, and an overall sense of balance in life.
            </p>
          </div>
        </section>

        {/* Find Us */}
        <section id="find-us" className="container py-5 find-us">
          <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>Contact us for travel vaccination, ear wax removal and a wide range of NHS or private services we offer.</p>
              <p><strong>Phone:</strong> 01675 466014</p>
              <p><strong>Email:</strong> coleshillpharmacy@gmail.com</p>
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

export default WeightlossPage;

// // src/pages/auth/WeightlossPage.tsx
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Header from '../Header';
// import './WeightlossPage.css';

// // Colors
// const MAIN_TEXT_COLOR = 'rgb(28, 43, 57)';
// const ACCENT_COLOR = '#00D364';
// const TIMELINE_LABEL_BG = '#00D364';
// const DARK_BG = '#0F1637';

// // Chevron icon
// const ICON_CHEVRON =
//   'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

// const faqItems = [
//   {
//     question: 'Who are Weight loss management for?',
//     answer:
//       'They’re for people who struggle to lose weight through diet and exercise alone. We’ll check your health to see if they’re right for you.',
//   },
//   {
//     question: 'What side effects might I feel?',
//     answer:
//       'Some people feel sick or have an upset tummy, but these usually improve as your body adjusts. We’re here to help if you’re worried.',
//   },
//   {
//     question: 'Do I need to change my diet?',
//     answer:
//       'Yes, it’s important to eat healthy, balanced meals while using Weight loss management. They work best when combined with good eating habits and regular activity.',
//   },
//   {
//     question: 'What are Weight loss management?',
//     answer:
//       'Weight loss management help you eat less by making you feel full for longer. They work alongside healthy eating and exercise to support your weight loss journey.',
//   },
//   {
//     question: 'How do they help with weight loss?',
//     answer:
//       'They reduce hunger and help control your appetite, so it’s easier to stick to smaller portions and healthier choices over time.',
//   },
//   {
//     question: 'Can I stop injections anytime?',
//     answer:
//       'Yes, you can stop if needed, but it’s best to discuss this with us first. We’ll guide you on the next steps for your weight loss.',
//   },
//   {
//     question: 'Are Weight loss management safe?',
//     answer:
//       'Yes, they are approved and safe when used correctly. We’ll make sure they’re suitable for you before starting treatment.',
//   },
// ];

// const weightLossProducts = [
//   {
//     title: 'Wegovy',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FlO0TFZ73tv0D9H5.webp&w=1080&q=75',
//     bullets: [
//       'Clinically proven approach to weight management',
//       'Comprehensive support from our pharmacy team',
//       'Personalised guidance for long-term success',
//       'Convenient treatment plan tailored to your lifestyle',
//     ],
//   },
//   {
//     title: 'Mounjaro',
//     img:
//       'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FDZDc21uYIxEas7T.webp&w=1080&q=75',
//     bullets: [
//       'Innovative approach to weight management',
//       'Clinically researched for safe and effective results',
//       'Focuses on hormonal pathways to regulate appetite',
//       'Supported by our expert pharmacy team',
//     ],
//   },
// ];

// const benefits = [
//   {
//     title: 'Proven Treatment',
//     text:
//       'Clinical trials have seen clients reduce body weight by up to 22%* when combined with a balanced diet and exercise.',
//   },
//   {
//     title: 'Reduce Cravings',
//     text:
//       'Prescribed, weight loss medication that reduces cravings and helps control your appetite.',
//   },
//   {
//     title: 'Clinical Care',
//     text:
//       'Dedicated team of clinicians on hand to help you throughout your plan, adjust dosages and manage potential side effects.',
//   },
// ];

// const timelineSteps = [
//   {
//     label: 'TODAY',
//     title: 'Simple assessment',
//     text:
//       "Book an appointment for a free consultation at Coleshill Pharmacy. If eligible, you'll receive your clinically-prescribed medication swiftly.",
//   },
//   {
//     label: '1–6 MONTHS',
//     title: 'Healthy weight loss',
//     text:
//       'Lose weight and learn how to reframe your relationship with food. Expect increased fitness, energy, and confidence.',
//   },
//   {
//     label: '6–12 MONTHS',
//     title: 'Lasting change',
//     text:
//       'With continued support from your coach, adopt healthier lifestyle habits to help maintain weight loss.',
//   },
// ];

// const slugify = (str: string) =>
//   str
//     .toLowerCase()
//     .replace(/[()]/g, '')
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-+|-+$/g, '');

// const WeightlossPage: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <>
//       <Header />

//       {/* ===============================
//           BREADCRUMB / PAGE PATH
//          =============================== */}
//       <div className="breadcrumb-wrapper">
//         <div className="container">
//           <nav className="page-path">
//             <Link to="/">Home</Link>
//             <span className="sep">›</span>
//             <Link to="/services">Services</Link>
//             <span className="sep">›</span>
//             <span className="current">Weight loss</span>
//           </nav>
//         </div>
//       </div>
//       {/* =============================== */}

//       <main className="pt-header">
//         {/* Hero / Intro */}
//         <section className="container py-5">
//           <div className="row justify-content-center">
//             <div className="col-md-8 text-center">
//               <h1
//                 style={{
//                   color: MAIN_TEXT_COLOR,
//                   fontWeight: 700,
//                   fontSize: '2rem',
//                   marginBottom: '1rem',
//                 }}
//               >
//                 Breakthrough weight-<br />
//                 loss injections for<br />
//                 long-term results
//               </h1>

//               <ul
//                 style={{
//                   listStyle: 'none',
//                   padding: 0,
//                   margin: '1.5rem 0',
//                   textAlign: 'left',
//                   maxWidth: '400px',
//                   marginLeft: 'auto',
//                   marginRight: 'auto',
//                 }}
//               >
//                 <li
//                   style={{
//                     display: 'flex',
//                     alignItems: 'flex-start',
//                     marginBottom: '0.75rem',
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       width: '1rem',
//                       color: ACCENT_COLOR,
//                       fontSize: '1.25rem',
//                       marginRight: '0.5rem',
//                     }}
//                   >
//                     ✓
//                   </span>
//                   <span style={{ color: MAIN_TEXT_COLOR }}>
//                     Clinically proven weight loss of up to 22%*
//                   </span>
//                 </li>
//                 <li
//                   style={{
//                     display: 'flex',
//                     alignItems: 'flex-start',
//                     marginBottom: '0.75rem',
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       width: '1rem',
//                       color: ACCENT_COLOR,
//                       fontSize: '1.25rem',
//                       marginRight: '0.5rem',
//                     }}
//                   >
//                     ✓
//                   </span>
//                   <span style={{ color: MAIN_TEXT_COLOR }}>
//                     Scientifically backed weight loss programme
//                   </span>
//                 </li>
//                 <li
//                   style={{
//                     display: 'flex',
//                     alignItems: 'flex-start',
//                   }}
//                 >
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       width: '1rem',
//                       color: ACCENT_COLOR,
//                       fontSize: '1.25rem',
//                       marginRight: '0.5rem',
//                     }}
//                   >
//                     ✓
//                   </span>
//                   <span style={{ color: MAIN_TEXT_COLOR }}>
//                     Continuous clinical care
//                   </span>
//                 </li>
//               </ul>

//               <button
//                 className="btn btn-lg"
//                 style={{
//                   backgroundColor: ACCENT_COLOR,
//                   color: '#fff',
//                   height: '50px',
//                   fontWeight: 500,
//                   padding: '1.5rem 1.5rem',
//                   border: 'none',
//                   borderRadius: '0.375rem',
//                   marginBottom: '1.85rem',
//                   marginLeft: 'auto',
//                   marginRight: 'auto',
//                 }}
//                 onClick={() => navigate('/book/13')}
//               >
//                 Book Your Free Consultation
//               </button>

//               <div style={{ marginBottom: '2rem' }}>
//                 <img
//                   src="https://www.chathampharmacy.co.uk/_next/image?url=%2Fimages%2Fweight-loss%2F1.webp&w=3840&q=90"
//                   alt="Patient example"
//                   style={{
//                     width: '100%',
//                     height: 'auto',
//                     maxWidth: '400px',
//                     borderRadius: '0.5rem',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                   }}
//                 />
//               </div>

//               <div className="d-flex justify-content-center align-items-center gap-2">
//                 <img
//                   src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_74x24dp.png"
//                   alt="Google logo"
//                   style={{ height: '1.5rem' }}
//                 />
//                 <span style={{ color: MAIN_TEXT_COLOR, fontWeight: 500 }}>
//                   ★★★★★ 4.9/5.0
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* About / FAQ */}
//         <section className="container py-4">
//           <h2
//             style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '1rem',
//               textAlign: 'center',
//             }}
//           >
//             About Weight Loss Clinic
//           </h2>
//           <p
//             style={{
//               color: MAIN_TEXT_COLOR,
//               maxWidth: '700px',
//               margin: '0 auto 2rem auto',
//               lineHeight: 1.6,
//               textAlign: 'center',
//             }}
//           >
//             Our weight loss clinic is here to support you on your journey to a
//             healthier you. We offer Weight loss management alongside friendly
//             advice to help you manage your weight safely. Together, we’ll
//             create a plan that fits your needs and works with your lifestyle.
//           </p>

//           <div
//             className="accordion"
//             id="weightLossFaq"
//             style={{ maxWidth: '700px', margin: '0 auto' }}
//           >
//             {faqItems.map((item, idx) => (
//               <div key={idx} className="accordion-item mb-2">
//                 <h3
//                   className={`accordion-header${idx === 0 ? ' open' : ''}`}
//                   onClick={(e) => {
//                     const header = e.currentTarget;
//                     const caret = header.querySelector('.accordion-caret') as HTMLElement;
//                     header.classList.toggle('open');
//                     if (caret) {
//                       caret.style.transform = header.classList.contains('open')
//                         ? 'rotate(270deg)'
//                         : 'rotate(90deg)';
//                     }
//                     const body = header.nextElementSibling as HTMLElement;
//                     body?.classList.toggle('show');
//                   }}
//                 >
//                   <div className="accordion-title-row">
//                     <span className="accordion-number">{idx + 1}</span>
//                     <span className="accordion-question">{item.question}</span>
//                     <img
//                       src={ICON_CHEVRON}
//                       alt="Toggle"
//                       className="accordion-caret"
//                       style={{ transform: idx === 0 ? 'rotate(270deg)' : 'rotate(90deg)' }}
//                     />
//                   </div>
//                 </h3>
//                 <div className={`accordion-body${idx === 0 ? ' show' : ''}`}>
//                   {item.answer}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Weight Loss Products */}
//         <section className="container py-5">
//           <h2
//             style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '1.5rem',
//               textAlign: 'center',
//             }}
//           >
//             Weight loss management in{' '}
//             <span style={{ color: ACCENT_COLOR }}>Coleshill</span>
//           </h2>
//           <div className="row g-4">
//             {weightLossProducts.map((prod, idx) => (
//               <div key={idx} className="col-md-6">
//                 <div
//                   className="card shadow-sm"
//                   style={{
//                     border: 'none',
//                     borderRadius: '0.75rem',
//                     overflow: 'hidden',
//                   }}
//                 >
//                   <div
//                     style={{
//                       height: '220px',
//                       overflow: 'hidden',
//                     }}
//                   >
//                     <img
//                       src={prod.img}
//                       alt={prod.title}
//                       className="w-100 h-100"
//                       style={{
//                         objectFit: 'cover',
//                         transition: 'transform 0.3s',
//                       }}
//                     />
//                   </div>
//                   <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
//                     <h5
//                       style={{
//                         fontWeight: 600,
//                         fontSize: '1.25rem',
//                         marginBottom: '0.75rem',
//                         color: MAIN_TEXT_COLOR,
//                       }}
//                     >
//                       {prod.title}
//                     </h5>
//                     <ul
//                       style={{
//                         listStyle: 'none',
//                         padding: 0,
//                         marginBottom: '1.25rem',
//                         color: MAIN_TEXT_COLOR,
//                         lineHeight: 1.5,
//                       }}
//                     >
//                       {prod.bullets.map((b, i) => (
//                         <li
//                           key={i}
//                           style={{
//                             display: 'flex',
//                             alignItems: 'flex-start',
//                             marginBottom: '0.5rem',
//                           }}
//                         >
//                           <span
//                             style={{
//                               display: 'inline-block',
//                               width: '0.75rem',
//                               color: ACCENT_COLOR,
//                               fontSize: '1rem',
//                               marginRight: '0.5rem',
//                               lineHeight: 1,
//                             }}
//                           >
//                             ►
//                           </span>
//                           <span>{b}</span>
//                         </li>
//                       ))}
//                     </ul>
//                     <button
//                       className="btn btn-outline-primary w-100"
//                       style={{
//                         padding: '0.5rem',
//                         fontWeight: 600,
//                       }}
//                       onClick={() => navigate(`/${slugify(prod.title)}`)}
//                     >
//                       Find out more
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Science-backed Section */}
//         <section
//           className="container py-5"
//           style={{ backgroundColor: '#F8F9FA' }}
//         >
//           <h2
//             style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '2rem',
//               textAlign: 'center',
//             }}
//           >
//             Weight loss, backed by science
//           </h2>
//           <div className="row g-4">
//             {benefits.map((benefit, idx) => (
//               <div key={idx} className="col-md-4">
//                 <div
//                   className="card h-100 shadow-sm"
//                   style={{
//                     border: 'none',
//                     borderRadius: '0.75rem',
//                     padding: '1rem',
//                   }}
//                 >
//                   <h5
//                     style={{
//                       fontWeight: 600,
//                       color: MAIN_TEXT_COLOR,
//                       marginBottom: '0.75rem',
//                     }}
//                   >
//                     {benefit.title}
//                   </h5>
//                   <p style={{ color: MAIN_TEXT_COLOR, lineHeight: 1.6 }}>
//                     {benefit.text}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Progress Timeline Section */}
//         <section
//           className="container-fluid px-4 py-5"
//           style={{ backgroundColor: DARK_BG, color: '#fff' }}
//         >
//           <div className="container">
//             <h2
//               style={{
//                 fontWeight: 700,
//                 fontSize: '2rem',
//                 marginBottom: '2rem',
//                 textAlign: 'center',
//               }}
//             >
//               The progress you can expect
//             </h2>

//             <div className="row gy-4">
//               {timelineSteps.map((step, idx) => (
//                 <div key={idx} className="col-md-4 text-center">
//                   <span
//                     style={{
//                       display: 'inline-block',
//                       backgroundColor: TIMELINE_LABEL_BG,
//                       color: DARK_BG,
//                       fontWeight: 700,
//                       borderRadius: '0.5rem',
//                       padding: '0.25rem 0.75rem',
//                       fontSize: '0.875rem',
//                       marginBottom: '0.75rem',
//                     }}
//                   >
//                     {step.label}
//                   </span>
//                   <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
//                     {step.title}
//                   </h4>
//                   <p
//                     style={{
//                       lineHeight: 1.6,
//                       maxWidth: '300px',
//                       margin: '0 auto',
//                     }}
//                   >
//                     {step.text}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* Introduction / Importance Section */}
//         <section className="container py-5">
//           <h2
//             style={{
//               color: MAIN_TEXT_COLOR,
//               fontWeight: 700,
//               fontSize: '1.75rem',
//               marginBottom: '1rem',
//               textAlign: 'center',
//             }}
//           >
//             Introduction to weight loss support at Coleshill Pharmacy
//           </h2>
//           <div
//             style={{
//               maxWidth: '700px',
//               margin: '0 auto',
//               color: MAIN_TEXT_COLOR,
//               lineHeight: 1.6,
//             }}
//           >
//             <p>
//               Maintaining a healthy weight can have a positive impact on every aspect
//               of your life. Coleshill Pharmacy is here to help you discover the best
//               path toward weight loss success.
//             </p>
//             <p>
//               We proudly serve individuals in Medway who seek professional, ongoing
//               guidance and trustworthy support.
//             </p>
//             <p>
//               At Coleshill Pharmacy, our commitment extends beyond prescriptions. We
//               offer ongoing support, progress tracking, and personal recommendations
//               that adapt to your life. By combining professional expertise with a
//               friendly atmosphere, we help you feel empowered at every stage and
//               growth of your weight loss experience.
//             </p>

//             <h3
//               style={{
//                 color: MAIN_TEXT_COLOR,
//                 fontWeight: 700,
//                 fontSize: '1.5rem',
//                 marginTop: '2rem',
//                 marginBottom: '1rem',
//               }}
//             >
//               Understanding the importance of achieving a healthy weight
//             </h3>
//             <p>
//               Excess weight can increase your risk of serious health issues such as
//               diabetes and heart disease. By focusing on healthy habits, you can
//               lower these risks. A balanced approach to eating, regular physical
//               activity, and suitable medications all contribute to a stronger body
//               and an improved overall sense of wellbeing.
//             </p>
//             <p>
//               Our clinic provides resources that fit your unique situation, ensuring
//               you stay fully informed and motivated.
//             </p>
//             <p>
//               Alongside enhancing your physical health, a healthy weight can also
//               boost mental wellbeing. It often leads to improved self-esteem,
//               greater confidence, and an overall sense of balance in life.
//             </p>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default WeightlossPage;

