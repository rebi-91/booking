import React from "react";
import Header from '../Header';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-light">
      <Header />

      <section className="find-us container py-5">
        <h2 className="text-center mb-3" style={{ fontWeight: 700, marginTop: 30 }}>
        Get in Touch
        </h2>

        <div className="row align-items-center">
          {/* Contact details */}
          <div className="col-md-6 mb-4 mb-md-0">
            <p>
              Contact us for travel vaccination, ear wax removal and a wide
              range of NHS or private services we offer.
            </p>
            <p>
              <strong>Phone:</strong> <a href="tel:01675466014">01675 466014</a>
            </p>
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:coleshillpharmacy@gmail.com">
                coleshillpharmacy@gmail.com
              </a>
            </p>
            <p>
              <strong>Address:</strong> <br />
              114–116 High St, Coleshill, Birmingham B46 3BJ
            </p>
            <p>
              <strong>Hours:</strong> <br />
              Monday–Friday 8:30 am–6 pm
              <br />
              Saturday 9 am–5:30 pm
              <br />
              Sunday Closed
            </p>
          </div>

          {/* Map */}
          <div className="col-md-6">
            <iframe
              title="Coleshill Pharmacy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.123456789!2d-1.7890123!3d52.5654321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48776789abcdef12:0x3456789abcdef!2s114-116%20High%20St,%20Coleshill%20B46%203BJ,%20UK!5e0!3m2!1sen!2suk!4v1623456789012"
              width="100%"
              height="300"
              style={{
                border: 0,
                borderRadius: "0.5rem",
                marginBottom: "30px",
              }}
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
