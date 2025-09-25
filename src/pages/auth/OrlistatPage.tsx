// src/pages/OrlistatPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './MounjaroPage.css';

const MAIN_TEXT_COLOR = 'rgb(68, 135, 198)';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const OrlistatPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main>
        {/* HERO / INTRO */}
        <section className="container hero-section">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h1
                className="page-title"
                style={{
                  color: MAIN_TEXT_COLOR,
                  fontWeight: 700,
                  fontSize: '2.5rem',
                  marginBottom: '1rem',
                }}
              >
                Orlistat
              </h1>

              {/* text under the title → left aligned, but centered block */}
              <ul
                className="hero-bullets text-start mx-auto"
                style={{ maxWidth: 760 }}
              >
                <li>Helps reduce fat absorption from meals</li>
                <li>Pharmacy-led care with quick assessment</li>
                <li>Works best alongside diet & activity changes</li>
                <li>Discreet supply and ongoing support</li>
              </ul>

              {/* button remains centered */}
              <button
                className="btn-accent"
                onClick={() => navigate('/book/67')}
              >
                Start your Orlistat assessment
              </button>

              <div className="hero-image-wrap">
                <img
                  src="https://yourmedicals.co.uk/cdn/shop/files/Untitleddesign_24.png?v=1722501684"
                  alt="Orlistat capsules"
                  className="hero-image"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ORLISTAT @ COLESHILL */}
        <section className="container about-section">
          <h2 className="section-heading">Orlistat at Coleshill Pharmacy</h2>
          <p className="section-subtext text-start">
            Orlistat is a licensed weight-loss medicine that blocks some of the fat
            you eat from being absorbed. Our friendly team will check suitability,
            give practical diet tips, and support you throughout your treatment so
            you can make safe, sustainable progress.
          </p>
        </section>

        {/* WHY CHOOSE ORLISTAT */}
        <section className="container about-section">
          <h2 className="section-heading">Why choose Orlistat?</h2>
          <p className="section-subtext text-start">
            Orlistat works in your gut to reduce fat absorption—unlike appetite
            suppressants. With our pharmacy support, you’ll get:
          </p>
          <ul
            className="hero-bullets text-start"
            style={{ maxWidth: 760 }}
          >
            <li>Clear guidance on a reduced-fat eating plan</li>
            <li>Advice on vitamins (A, D, E, K) and timing</li>
            <li>Regular check-ins to track progress</li>
            <li>Discreet, local service from our UK pharmacy</li>
          </ul>
          <div className="about-image-wrap">
            <img
              src="https://yourmedicals.co.uk/cdn/shop/files/Untitleddesign_24.png?v=1722501684"
              alt="Healthy lifestyle with Orlistat"
              className="about-image"
            />
          </div>
        </section>

        {/* PRICING */}
        <section className="container products-section">
          <h2 className="section-heading">Orlistat Pricing</h2>
          <div className="pricing-list">
            <div className="pricing-card text-start">
              <h3 className="product-title">Orlistat 60mg</h3>
              <p className="product-sub">
                84 capsules — <strong>£34.99</strong>
              </p>
              <p className="product-sub small">
                Suitable for adults with BMI ≥28 (subject to assessment).
              </p>
            </div>
            <div className="pricing-card text-start">
              <h3 className="product-title">Orlistat 60mg</h3>
              <p className="product-sub">
                120 capsules — <strong>£44.99</strong>
              </p>
              <p className="product-sub small">
                Best value course. We’ll confirm suitability.
              </p>
            </div>
            <div className="pricing-card text-start">
              <h3 className="product-title">Orlistat 120mg</h3>
              <p className="product-sub">
                84 capsules — <strong>£59.99</strong>
              </p>
              <p className="product-sub small">
                Prescription-strength; clinical approval required.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="container about-section">
          <h2 className="section-heading">How the service works</h2>
          <div className="timeline-cards text-start">
            <div className="timeline-card">
              <span className="timeline-label">Step 1</span>
              <h4 className="timeline-title">Online consultation</h4>
              <p className="timeline-text">
                Tell us about your health, medicines and goals. We’ll quickly check if Orlistat is appropriate for you.
              </p>
            </div>
            <div className="timeline-card">
              <span className="timeline-label">Step 2</span>
              <h4 className="timeline-title">Pharmacist review</h4>
              <p className="timeline-text">
                Get tailored advice on diet, fat intake targets, and vitamin timing to reduce side effects.
              </p>
            </div>
            <div className="timeline-card">
              <span className="timeline-label">Step 3</span>
              <h4 className="timeline-title">Collect or get delivered</h4>
              <p className="timeline-text">
                Discreet supply. We’ll follow up to support your progress and answer questions.
              </p>
            </div>
          </div>

          {/* keep button centered */}
          <div className="text-center mt-4">
            <button
              className="btn-accent"
              style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
              onClick={() => navigate('/book/12')}
            >
              Start your assessment
            </button>
          </div>
        </section>

        {/* DETAILED INFO */}
        <section className="container about-section">
          <h2 className="section-heading">Orlistat overview</h2>
          <p className="section-subtext text-start">
            Orlistat reduces absorption of dietary fat by inhibiting pancreatic and gastric lipases. It’s most effective alongside a lower-fat, lower-calorie diet and increased activity.
          </p>

          <h3 className="subsection-heading">Using Orlistat safely</h3>
          <p className="section-subtext text-start">
            Common effects include oily stools and urgency—especially with high-fat meals. A daily multivitamin at bedtime may be recommended. Tell us if you take warfarin, ciclosporin or levothyroxine—extra monitoring or spacing doses may be needed.
          </p>

          <h3 className="subsection-heading">Who it suits</h3>
          <p className="section-subtext text-start">
            Generally adults with BMI ≥30, or ≥28 with risk factors. Not suitable if pregnant/breast-feeding, or with chronic malabsorption or cholestasis. We’ll assess your medical history to confirm suitability.
          </p>

          <h3 className="subsection-heading">FAQ</h3>
          <div className="accordion text-start" id="orlistatFaq">
            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) body.classList.toggle('show');
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">How soon will I see results?</span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
                </div>
              </h3>
              <div className="accordion-body">
                Many people notice changes within 12 weeks when combined with a reduced-fat diet and activity plan.
              </div>
            </div>

            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) body.classList.toggle('show');
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">Do I need to change my diet?</span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
                </div>
              </h3>
              <div className="accordion-body">
                Yes—keeping total fat low reduces side effects and improves results. We’ll give you a simple plan to follow.
              </div>
            </div>

            <div className="accordion-item mb-2">
              <h3
                className="accordion-header"
                onClick={(e) => {
                  const header = e.currentTarget;
                  const caret = header.querySelector('.accordion-caret') as HTMLElement;
                  header.classList.toggle('open');
                  if (caret) caret.style.transform = header.classList.contains('open') ? 'rotate(270deg)' : 'rotate(90deg)';
                  const body = header.nextElementSibling as HTMLElement;
                  if (body) body.classList.toggle('show');
                }}
              >
                <div className="accordion-title-row">
                  <span className="accordion-question">Is 60mg or 120mg right for me?</span>
                  <span className="accordion-caret" style={{ transform: 'rotate(90deg)' }}>›</span>
                </div>
              </h3>
              <div className="accordion-body">
                We’ll advise the safest strength after your assessment. 120mg is prescription-strength and requires clinical approval.
              </div>
            </div>
          </div>
        </section>

        {/* FIND US / CONTACT */}
        <section id="find-us" className="container py-5 find-us">
          <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6 text-start">
              <p>Contact us for weight loss advice and a wide range of NHS or private services.</p>
              <p><strong>Phone:</strong> 01675 466014</p>
              <p><strong>Email:</strong> coleshillpharmacy@gmail.com</p>
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

export default OrlistatPage;
