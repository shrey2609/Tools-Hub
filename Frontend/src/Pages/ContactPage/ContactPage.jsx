import "./ContactPage.css";

function ContactPage() {
  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <p className="trackier-info">
        <strong>About Trackier:</strong> Trackier is a leading platform providing marketing and analytics solutions for businesses worldwide.
      </p>

      <div className="contact-cards">
        <div className="card">
          <h3>📍 Address</h3>
          <a 
            href="https://www.google.com/maps/search/?api=1&query=9th+Floor,+Add+India+Tower,+Sector+125,+Noida,+Uttar+Pradesh+201303" 
            target="_blank" 
            rel="noreferrer"
          >
            9th Floor, Add India Tower, Sector 125, Noida, Uttar Pradesh 201303
          </a>
        </div>

        <div className="card">
          <h3>📞 Phone</h3>
          <a href="tel:+919355019797">+91-93550 19797</a>
        </div>

        <div className="card">
          <h3>✉️ Email</h3>
          <a href="mailto:Support@trackier.com">Support@trackier.com</a>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
