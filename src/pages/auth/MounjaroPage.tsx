import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './MounjaroPage.css';

const DARK_BG = '#0F1637';
const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';

const ICON_CHEVRON =
  'https://zbcowibbhjynfpkqgupz.supabase.co/storage/v1/object/public/booking//chevron.png';

const mounjaroImage =
  'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fproducts%2FDZDc21uYIxEas7T.webp&w=1080&q=75';

const supportImage =
  'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2Fpromo%2FX_yYcVWixlsJA3I.webp&w=3840&q=75';

const heroBullets = [
  'Dual-action GLP-1 / GIP weight management treatment',
  'Clinically researched for safe and effective results',
  'Helps regulate appetite and support long-term weight loss',
  'Ongoing support from our pharmacy team',
];

const pricing = [
  { strength: 'Mounjaro 2.5mg', price: '£159.99' },
  { strength: 'Mounjaro 5mg', price: '£179.97' },
  { strength: 'Mounjaro 7.5mg', price: '£239.97' },
  { strength: 'Mounjaro 10mg', price: '£259.97' },
  { strength: 'Mounjaro 12.5mg', price: '£279.97' },
  { strength: 'Mounjaro 15mg', price: '£298.97' },
];

const serviceSteps = [
  {
    label: 'Step 1',
    title: 'Initial consultation',
    text:
      'We review your weight history, medical background and goals to confirm whether Mounjaro is suitable for you.',
  },
  {
    label: 'Step 2',
    title: 'Treatment guidance',
    text:
      'Our pharmacist explains dose escalation, injection technique, side effects and safe storage of the pen.',
  },
  {
    label: 'Step 3',
    title: 'Ongoing monitoring',
    text:
      'We continue to monitor your progress, support lifestyle changes and help manage side effects where needed.',
  },
];

const benefits = [
  {
    title: 'Dual action',
    text:
      'Mounjaro acts on GLP-1 and GIP pathways, helping regulate appetite and improve fullness.',
  },
  {
    title: 'Pharmacist support',
    text:
      'You receive practical guidance on treatment, side effects, diet, lifestyle and progress.',
  },
  {
    title: 'Safe progression',
    text:
      'Treatment starts at a lower dose and is gradually increased to help minimise side effects.',
  },
];

const faqItems = [
  {
    question: 'How long before I see weight loss results?',
    answer:
      'Some patients notice appetite changes within the first few weeks. Weight loss is usually more noticeable over 12–16 weeks when treatment is combined with diet and lifestyle changes.',
  },
  {
    question: 'Can I take Mounjaro if I am diabetic?',
    answer:
      'Mounjaro is also used in type 2 diabetes. If you have diabetes or take medicines that affect blood glucose, we will review this carefully before treatment and may recommend GP input.',
  },
  {
    question: 'What are the common side effects?',
    answer:
      'The most common side effects are nausea, diarrhoea, constipation, reduced appetite and mild injection-site reactions. These often improve as your body adjusts.',
  },
  {
    question: 'Do I need to change my diet?',
    answer:
      'Yes. Mounjaro works best alongside a balanced diet, smaller portions, regular activity and ongoing support.',
  },
  {
    question: 'How should I store Mounjaro?',
    answer:
      'Mounjaro pens should usually be stored in the fridge. We will explain storage, handling and safe disposal when you start treatment.',
  },
];

const MounjaroPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  return (
    <>
      <Header />

      <main className="pt-header mounjaro-page">
        {/* HERO */}
        <section className="mj-hero">
          <div className="mj-hero__bg" aria-hidden="true" />

          <div className="container mj-hero__inner">
            <div className="mj-hero__content">
              <span className="mj-eyebrow">Coleshill Pharmacy · Weight Loss Clinic</span>

              <h1 className="mj-hero__title">
                Mounjaro
                <span className="mj-hero__title-accent">
                  weight loss support
                </span>
              </h1>

              <p className="mj-hero__lede">
                A once-weekly injectable treatment supported by our pharmacy
                team to help you manage weight safely and confidently.
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
                  onClick={() => navigate('/book/55')}
                >
                  Book your Mounjaro consultation
                </button>

                <a href="#pricing" className="mj-btn-ghost">
                  View pricing
                </a>
              </div>
            </div>

            <div className="mj-hero__media">
              <div className="mj-hero__media-frame">
                <img src={mounjaroImage} alt="Mounjaro treatment pen" />
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
            <h2>Mounjaro at Coleshill Pharmacy</h2>
            <p className="mj-section__lede">
              Mounjaro, also known as tirzepatide, is a GLP-1/GIP receptor
              agonist used to support weight management when combined with
              healthy eating, activity and ongoing clinical support.
            </p>
          </div>

          <div className="mj-split">
            <div className="mj-split__text">
              <h3>Why choose Mounjaro?</h3>
              <p>
                Mounjaro works on two hormone pathways involved in appetite,
                fullness and blood sugar regulation. This dual action can help
                reduce hunger and support sustainable weight loss.
              </p>

              <ul className="mj-check-list">
                <li>Dose escalation plans to help minimise side effects</li>
                <li>Personalised support with diet and lifestyle changes</li>
                <li>Regular check-ins by phone or in person</li>
                <li>Ongoing pharmacy support throughout treatment</li>
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
              Mounjaro pricing at <span className="accent">Coleshill</span>
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
            <h2>Clinically supported weight management</h2>
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
              <h2>How the Mounjaro service works</h2>
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
                onClick={() => navigate('/book/55')}
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
            <h2>Mounjaro overview</h2>
            <p className="mj-section__lede">
              Important information to help you use Mounjaro safely and get the
              most from your treatment.
            </p>
          </div>

          <div className="mj-info-card">
            <h3>What is Mounjaro?</h3>
            <p>
              Mounjaro is a once-weekly injectable medicine containing
              tirzepatide. It acts on GLP-1 and GIP receptors, which are
              involved in appetite regulation, fullness and blood sugar control.
            </p>

            <h3>Using Mounjaro safely</h3>
            <p>
              Treatment normally starts at a low dose and is increased gradually.
              This helps reduce side effects such as nausea, diarrhoea or
              constipation. You should follow the dose schedule provided by the
              pharmacist or prescriber.
            </p>

            <h3>Preparing for treatment</h3>
            <p>
              Before treatment, we will review your medical history,
              current medicines, allergies and suitability. The pen should be
              stored correctly and used according to the instructions provided.
            </p>

            <h3>Managing side effects</h3>
            <p>
              Common side effects include nausea, diarrhoea, constipation,
              reduced appetite and injection-site redness. Eating smaller meals,
              avoiding very fatty foods and staying hydrated may help.
            </p>
            <p>
              Seek urgent medical advice if you develop severe abdominal pain,
              persistent vomiting, signs of dehydration, or symptoms that feel
              severe or unusual.
            </p>

            <h3>Monitoring progress</h3>
            <p>
              We recommend tracking your weight, appetite, side effects and
              general wellbeing. Follow-up appointments help us review progress
              and support safe continuation.
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
                    aria-controls={`mounjaro-faq-${idx}`}
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
                    id={`mounjaro-faq-${idx}`}
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

export default MounjaroPage;