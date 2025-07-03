import React from 'react';
import Header from '../Header';
import { useNavigate } from 'react-router-dom';

const MAI_TEXT_COLOR = 'rgb(14, 75, 141)';
const MAIN_TEXT_COLOR = 'rgb(119, 128, 159)';

const EmergencySupply: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <main className="pt-header container py-5 emergency-supply-page">
        <h1 style={{ color: MAI_TEXT_COLOR, fontWeight: 700, marginBottom: '1rem' }}>
          Emergency Supply of Your Medicines
        </h1>
        <p style={{ color: MAIN_TEXT_COLOR, marginBottom: '1rem' }}>
          If you find yourself without your essential medication before you can get a
          new prescription, we may be able to supply an emergency quantity to
          tide you over until your GP surgery reopens or an electronic prescription
          arrives.
        </p>

        <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 600, marginTop: '2rem' }}>
          How It Works
        </h2>
        <ol style={{ color: MAIN_TEXT_COLOR, marginLeft: '1rem' }}>
          <li>You must have started the treatment (taken at least one dose).</li>
          <li>Your prescription must still be valid (within 6 months for a paper script).</li>
          <li>You will need to pay the standard NHS prescription charge&nbsp;
            <strong>£9.90</strong>&nbsp;(unless exempt).</li>
          <li>Supply is at the pharmacist’s professional discretion.</li>
        </ol>

        <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 600, marginTop: '2rem' }}>
          When to Raise a Request
        </h2>
        <p style={{ color: MAIN_TEXT_COLOR }}>
          If you cannot contact your GP and are at risk of missing a dose,
          click below to raise an NHS 111 request for an emergency prescription.
        </p>
        <div className="mb-4">
        <button
            onClick={() => window.open('https://111.nhs.uk/emergency-prescription', '_blank')}
            style={{
              backgroundColor: 'rgb(119, 128, 159) ',
              color: '#ffffff',
              padding: '1.8rem 0.8rem',
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: '0 1px 1px rgba(33, 0, 0), 0 4px 6px rgba(0, 0, 0, 0.25)',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Raise a request with NHS 111
          </button>
        </div>

        {/* Find Us */}
        <section id="find-us" className="container py-5 find-us">
          <h2 style={{ color: MAI_TEXT_COLOR, fontWeight: 700 }}>Find us</h2>
          <div className="row align-items-center mt-4">
            <div className="col-md-6">
              <p>
                Contact us for emergency prescription supply and a wide range of NHS or private
                services.
              </p>
              <p>
                <strong>Phone:</strong> 01675 466014
              </p>
              <p>
                <strong>Email:</strong> coleshillpharmacy@gmail.com
              </p>
              <p>
                <strong>Address:</strong> 114–116 High St, Coleshill, Birmingham
                B46 3BJ
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Monday–Friday 8:30 am–6 pm
                <br />
                Saturday 9 am–5:30 pm
                <br />
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

export default EmergencySupply;

