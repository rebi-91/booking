// src/pages/MounjaroPage.tsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Header';
import './MounjaroPage.css';

const MAIN_TEXT_COLOR = 'rgb(68, 135, 198)';
const ACCENT_COLOR = '#00D364';
const DARK_BG = '#0F1637';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const MounjaroPage: React.FC = () => {
  const navigate = useNavigate();

  // Helper to create URL-friendly slug if needed
  const slugify = (str: string) =>
    str
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  return (
    <>
      {/* ←—— SAME <Header /> as your other pages */}
      <Header />

      <main>
        {/* ===============================
            BREADCRUMB / PAGE PATH
           =============================== */}
        {/* <div className="breadcrumb-wrapper">
          <div className="container">
            <nav className="page-path">
              <Link to="/">Home</Link>
              <span className="sep">›</span>
              <Link to="/services">Services</Link>
              <span className="sep">›</span>
              <Link to="/weight-loss-management">Weight loss</Link>
              <span className="sep">›</span>
              <span className="current">Mounjaro</span>
            </nav>
          </div>
        </div> */}
        {/* =============================== */}

        {/* ===============================
            HERO / INTRODUCTION SECTION
           =============================== */}
        <section className="container hero-section">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              {/* Page Title */}
              <h1
                className="page-title"
                style={{
                  color: MAIN_TEXT_COLOR,
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                }}
              >
                Mounjaro
              </h1>

              {/* Bullet Points */}
              <ul className="hero-bullets">
                <li>
                  {/* <span className="bullet-icon">✓</span> */}
                  Innovative approach to weight management
                </li>
                <li>
                  {/* <span className="bullet-icon">✓</span> */}
                  Clinically researched for safe and effective results
                </li>
                <li>
                  {/* <span className="bullet-icon">✓</span> */}
                  Focuses on hormonal pathways to regulate appetite
                </li>
                <li>
                  {/* <span className="bullet-icon">✓</span> */}
                  Supported by our expert pharmacy team
                </li>
              </ul>

              {/* Book Appointment CTA */}
              <button
                className="btn-accent"
                onClick={() => navigate('/book/55')} 
              >
                Book Your Mounjaro Consultation
              </button>

              {/* Hero Image */}
              <div className="hero-image-wrap">
                <img
                  src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FDZDc21uYIxEas7T.webp&w=1080&q=75"
                  alt="Mounjaro Pen"
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </section>
        {/* =============================== */}

        {/* ===============================
            MOUNJARO AT Coleshill PHARMACY SECTION
           =============================== */}
        <section className="container about-section">
          <h2 className="section-heading">Mounjaro at Coleshill Pharmacy</h2>
          <p className="section-subtext">
            Mounjaro (tirzepatide) is a GLP-1/GIP receptor agonist shown in clinical
            trials to help adults lose weight safely when used alongside diet and
            exercise. At Coleshill Pharmacy, our friendly team provides guidance on how
            to self-administer, monitors your progress, and tailors ongoing support
            so you achieve sustainable results.
          </p>
        </section>
        {/* =============================== */}

        {/* ===============================
            WHY CHOOSE MOUNJARO? SECTION
           =============================== */}
        <section className="container about-section">
          <h2 className="section-heading">Why Choose Mounjaro?</h2>
          <p className="section-subtext">
            Unlike other medications, Mounjaro targets two hormones (GLP-1 and GIP),
            offering a dual‐mechanism approach to appetite control. Our pharmacy team
            ensures you get the most out of your treatment by providing:
          </p>
          <ul className="hero-bullets">
            <li>
             
              Dose escalation plans to minimise side effects
            </li>
            <li>
              
              Personalized coaching on diet & lifestyle
            </li>
            <li>
              
              Regular check‐ins by phone or in‐person
            </li>
            <li>
              
              Ongoing support to maintain long-term success
            </li>
          </ul>
          <div className="about-image-wrap">
            <img
              src="https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fpromo%2FX_yYcVWixlsJA3I.webp&w=3840&q=75"
              alt="Why Choose Mounjaro?"
              className="about-image"
            />
          </div>
        </section>
        {/* =============================== */}

        {/* ===============================
            MOUNJARO PRICING SECTION
           =============================== */}
        <section className="container products-section">
          <h2 className="section-heading">Mounjaro Pricing</h2>
          <div className="pricing-list">
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 2.5mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£159.99</strong>
              </p>
            </div>
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 5mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£179.99</strong>
              </p>
            </div>
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 7.5mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£239.99</strong>
              </p>
            </div>
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 10mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£259.99</strong>
              </p>
            </div>
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 12.5mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£279.99</strong>
              </p>
            </div>
            <div className="pricing-card">
              <h3 className="product-title">Mounjaro 15mg</h3>
              <p className="product-sub">
                1 Injection (4 weeks supply) — <strong>£298.99</strong>
              </p>
            </div>
          </div>
        </section>
        {/* =============================== */}

        {/* ===============================
            HOW IT WORKS SECTION
           =============================== */}
        <section className="container about-section">
          <h2 className="section-heading">How the Mounjaro Service Works</h2>
          <div className="timeline-cards">
            <div className="timeline-card">
              <span className="timeline-label">Step 1</span>
              <h4 className="timeline-title">Initial Consultation</h4>
              <p className="timeline-text">
                Discuss your weight history, medical background, and goals with our
                pharmacy team. We’ll confirm whether Mounjaro is suitable for you.
              </p>
            </div>
            <div className="timeline-card">
              <span className="timeline-label">Step 2</span>
              <h4 className="timeline-title">Prescription & Education</h4>
              <p className="timeline-text">
                Our pharmacist will provide a personalised dose‐escalation schedule and
                demonstrate proper injection technique.
              </p>
            </div>
            <div className="timeline-card">
              <span className="timeline-label">Step 3</span>
              <h4 className="timeline-title">Ongoing Monitoring</h4>
              <p className="timeline-text">
                You’ll have regular check‐ins—either by phone or in person—to track your
                weight loss, manage side effects, and adjust your dose as needed.
              </p>
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              className="btn-accent"
              style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              onClick={() => navigate('/book/55')}
            >
              Book Your Appointment Now
            </button>
          </div>
        </section>
        {/* =============================== */}

        {/* ===============================
            DETAILED INFORMATION SECTIONS
           =============================== */}
        <section className="container about-section">
          <h2 className="section-heading">Mounjaro Overview</h2>
          <p className="section-subtext">
            Mounjaro is a once‐weekly injectable medication (tirzepatide) that combines
            GLP-1 and GIP receptor agonist action. It helps reduce appetite and
            improve blood sugar control. Always follow professional guidance to ensure
            safe and effective usage.
          </p>

          <h3 className="subsection-heading">What Is Mounjaro?</h3>
          <p className="section-subtext">
            Mounjaro works on two gut‐derived hormones (GLP-1 and GIP), which regulate
            both appetite and insulin secretion. This dual action helps you feel fuller
            for longer and supports healthy weight loss.
          </p>

          <h3 className="subsection-heading">Using Mounjaro Safely</h3>
          <p className="section-subtext">
            Mounjaro must be prescribed by a licensed healthcare professional. It’s
            essential to follow the dose escalation carefully—starting low and
            gradually increasing—to minimise gastrointestinal side effects like nausea.
          </p>
          <p className="section-subtext">
            Inform us of any medical conditions (e.g., pancreatitis, thyroid issues) as
            these may affect your eligibility. If you experience severe side effects,
            contact our pharmacy team immediately.
          </p>

          <h3 className="subsection-heading">Preparing for Mounjaro Treatment</h3>
          <p className="section-subtext">
            Prior to your first dose, complete a short questionnaire on your medical
            history and discuss any allergies. Keep a log of your food intake and
            exercise habits, as these will help guide ongoing support.
          </p>
          <p className="section-subtext">
            Plan to store your pen in the fridge and follow handling instructions to
            keep the medication stable. Having a support network (friend or family)
            can help make the transition smoother.
          </p>

          <h3 className="subsection-heading">Managing Side Effects</h3>
          <p className="section-subtext">
            Common side effects include mild nausea, diarrhea, or injection‐site
            redness. These often resolve after the first few weeks as your body
            adjusts. Staying well‐hydrated and eating smaller meals can help.
          </p>
          <p className="section-subtext">
            If you develop severe abdominal pain or symptoms of pancreatitis, stop
            taking Mounjaro and seek medical attention immediately.
          </p>

          <h3 className="subsection-heading">Monitoring Your Progress</h3>
          <p className="section-subtext">
            Keep track of your body weight weekly and note any changes in appetite or
            energy levels. Regular follow‐up appointments (every 4–6 weeks) allow us
            to make dose adjustments and provide tailored nutritional advice.
          </p>
          <p className="section-subtext">
            Having accurate data helps us fine‐tune your plan for maximum effectiveness.
            We’ll celebrate milestones with you and help you stay motivated.
          </p>

          <h3 className="subsection-heading">Frequently Asked Questions</h3>
          <div className="accordion" id="mounjaroFaq">
            {/* FAQ Item 1 */}
            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) {
                    if (header.classList.contains('open')) {
                      caret.style.transform = 'rotate(270deg)';
                    } else {
                      caret.style.transform = 'rotate(90deg)';
                    }
                  }
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) {
                    body.classList.toggle('show');
                  }
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">
                    How long before I see weight loss results?
                  </span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>
                    ›
                  </span>
                </div>
              </h3>
              <div className="accordion-body">
                Most patients notice some appetite suppression and small weight loss
                within the first 4–6 weeks. Optimal results are often seen after 12–16
                weeks, especially when combined with healthy diet and exercise habits.
              </div>
            </div>
            {/* FAQ Item 2 */}
            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) {
                    if (header.classList.contains('open')) {
                      caret.style.transform = 'rotate(270deg)';
                    } else {
                      caret.style.transform = 'rotate(90deg)';
                    }
                  }
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) {
                    body.classList.toggle('show');
                  }
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">Can I take Mounjaro if I’m diabetic?</span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>
                    ›
                  </span>
                </div>
              </h3>
              <div className="accordion-body">
                Yes—Mounjaro was originally approved to improve glycaemic control in
                type 2 diabetes. If you have diabetes, your dose may start lower and
                progress more slowly, with close monitoring of blood sugar levels.
              </div>
            </div>
            {/* FAQ Item 3 */}
            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) {
                    if (header.classList.contains('open')) {
                      caret.style.transform = 'rotate(270deg)';
                    } else {
                      caret.style.transform = 'rotate(90deg)';
                    }
                  }
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) {
                    body.classList.toggle('show');
                  }
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">What are the common side effects?</span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>
                    ›
                  </span>
                </div>
              </h3>
              <div className="accordion-body">
                The most common side effects are mild to moderate gastrointestinal
                symptoms (nausea, diarrhea, constipation). These often subside after
                the first few dose escalations.
              </div>
            </div>
            {/* FAQ Item 4 */}
            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) {
                    if (header.classList.contains('open')) {
                      caret.style.transform = 'rotate(270deg)';
                    } else {
                      caret.style.transform = 'rotate(90deg)';
                    }
                  }
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) {
                    body.classList.toggle('show');
                  }
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">
                    Do I need to follow a special diet while on Mounjaro?
                  </span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>
                    ›
                  </span>
                </div>
              </h3>
              <div className="accordion-body">
                While Mounjaro helps suppress appetite, maintaining a balanced diet
                (high in protein and fiber, low in refined sugars) will significantly
                enhance your weight loss results.
              </div>
            </div>
          </div>
        </section>
        {/* =============================== */}

        {/* ===============================
            FIND US / CONTACT SECTION
           =============================== */}
        
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

        {/* =============================== */}
      </main>
    </>
  );
};

export default MounjaroPage;
