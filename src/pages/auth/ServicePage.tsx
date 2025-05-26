import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header';
import './ServicePage.css';

interface Service {
  id: number;
  title: string;
  img: string;
  duration: string;
  category: 'Private Service' | 'NHS Service' | 'Pharmacy First';
  description: string;
}

const allServices: Service[] = [
    {
      id: 1,
      title: 'Altitude sickness',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F133875%2FKhhXvoL3hS.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Prevents symptoms like nausea, dizziness and headaches',
    },
    {
      id: 2,
      title: 'Sore throat',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F507276%2FIug3MtaspO.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'Feel better and swallow easily',
    },
    {
      id: 3,
      title: 'Travel Consultation',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F530057%2FyyrgMObVYh.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Expert Guidance – Consult a pharmacist with 10+ years of experience.',
    },
    {
      id: 4,
      title: 'Travel vaccine',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Fclinic-digital.lon1.cdn.digitaloceanspaces.com%2F100%2F810793%2FM8XAcWPBe6.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Peace of mind for a healthy journey',
    },
    {
      id: 5,
      title: 'Uncomplicated UTI (Women)',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F963546%2FK6YOS9cMH3.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'No need to book a GP appointment',
    },
    {
      id: 6,
      title: 'Vitamin B12 Injection',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F219742%2Fpu-_f9Dh4vv.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'NHS Service',
      description: 'Boosts your energy and fights tiredness',
    },
    {
      id: 7,
      title: 'Hair loss',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F660941%2FA94GbKY5xM.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Tailored solutions designed to meet your needs',
    },
    {
      id: 8,
      title: 'Impetigo',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F373143%2Fs9tYLb2pEs.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'Quick relief from itching and sore skin',
    },
    {
      id: 9,
      title: 'Infected insect bite',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F120232%2FwfvV667Tx4.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'No need for a GP visit',
    },
    {
      id: 10,
      title: 'Period delay',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F698695%2FAIGRXrZUVU.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Safe and easy to use treatment',
    },
    {
      id: 11,
      title: 'Private flu jab',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F281723%2F8K3Uhf06mK.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Convenient option with no long waiting times',
    },
    {
      id: 12,
      title: 'Shingles',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F314321%2Fsewm1HLfSk.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'Quick access to care through the Pharmacy First scheme',
    },
    {
      id: 13,
      title: 'Weight loss clinic',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F904592%2Fc10d6P2jks.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Clinically proven weight loss of up to 22%*',
    },
    {
      id: 14,
      title: 'Emergency contraception',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F769543%2FKbbzRigIaf.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'NHS Service',
      description: 'Easy to access at your local pharmacy',
    },
    {
      id: 15,
      title: 'Flu vaccination',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F101404%2F2-EtcvQ5-J.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'NHS Service',
      description: 'Reduces your risk of being hospitalised from flu.',
    },
    {
      id: 16,
      title: 'Blood pressure check',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F865410%2FrcaOjteI-1.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'NHS Service',
      description: 'Detects high blood pressure before it causes problems',
    },
    {
      id: 17,
      title: 'COVID-19 Vaccination',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F542160%2F8ruIf7vdRW.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'NHS Service',
      description: 'Free for adults 65 and over on the NHS',
    },
    {
      id: 18,
      title: 'Chickenpox vaccine',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F706101%2FsvONNg1d06.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Quick and easy vaccine at Coleshill Pharmacy',
    },
    {
      id: 19,
      title: 'Ear wax removal',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F123156%2FAHHct1yZUR.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: '+10 years of experience performing microsuction procedures',
    },
    {
      id: 20,
      title: 'Earache',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F91567%2FH_SCOcxLz4.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'Easy treatments for quick recovery',
    },
    {
      id: 21,
      title: 'Erectile dysfunction',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F925070%2Fh4R8QTz0jv.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Private Service',
      description: 'Improves your ability to achieve and maintain an erection',
    },
    {
      id: 22,
      title: 'Sinusitis',
      img: 'https://www.chathampharmacy.co.uk/_next/image?url=https%3A%2F%2Flead-services-agency.fra1.cdn.digitaloceanspaces.com%2F4%2F555059%2FWpuyFRToNN.webp&w=1080&q=75',
      duration: '20 mins',
      category: 'Pharmacy First',
      description: 'Say goodbye to sinus pain',
    },
  ];

  const tabs = [
    { key: 'ALL', label: 'All' },
    { key: 'PRIVATE', label: 'Private Treatments' },
    { key: 'NHS', label: 'NHS Services' },
    { key: 'PHARMACY', label: 'Pharmacy First' },
  ];
  
  const ServicePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('ALL');
  
    const filtered = allServices
      .filter((s) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'PRIVATE') return s.category === 'Private Service';
        if (activeTab === 'NHS') return s.category === 'NHS Service';
        if (activeTab === 'PHARMACY') return s.category === 'Pharmacy First';
        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  
    return (
      <>
        <Header />
  
        <div style={{ paddingTop: 110, backgroundColor: '#ffffff' }}>
          <div className="container pb-2  ">
            {/* Custom breadcrumb / path */}
            <nav className="page-path">
              <Link to="/">Home</Link>
              <span className="sep">›</span>
              <span className="current">Services</span>
            </nav>
  
            {/* Page title & subtitle */}
            <h1  className="page-title">All treatments and services</h1>
            <p className="page-subtitle">
              To get started, choose your treatment, book an appointment and come visit us in store.
            </p>
  
            {/* Tabs */}
            <div className="tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {/* Services Section */}
        <section className="services-section py-5">
          <div className="container">
            <div className="row">
              {filtered.map((service) => (
                <div key={service.id} className="col-md-6 col-lg-4 mb-4" style={{ paddingTop: '30px' }}>
                  <div className="card h-100 shadow-sm border-0 service-card custom-card-width">
                    <div className="position-relative overflow-hidden">
                      <img
                        src={service.img}
                        className="card-img-top zoom-hover"
                        alt={service.title}
                        style={{ height: '220px', objectFit: 'cover' }}
                      />
                      <span
                        className="position-absolute"
                        style={{
                          bottom: '0.5rem',
                          left: '0.5rem',
                          background: 'rgba(0, 0, 0, 0)',
                          color: '#fff',
                          padding: '0.25rem 0.5rem',
                          borderRadius: 4,
                          fontSize: '0.8rem',
                        }}
                      >
                        ⏱ {service.duration}
                      </span>
                    </div>
                    <div className="card-body">
                      <span
                        className={`badge mb-3 ${
                          service.category === 'Private Service'
                            ? 'bg-primary'
                            : service.category === 'NHS Service'
                            ? 'bg-info text-dark'
                            : 'bg-success'
                        }`}
                      >
                        {service.category}
                      </span>
                      <h5 className="card-title mb-2">{service.title}</h5>
                      <p className="card-text text-muted mb-2">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  };
  
  export default ServicePage;