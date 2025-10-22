class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        footer {
          background: #111111; /* site dark footer */
          color: #e6e6e6;
          padding: 2rem;
          text-align: center;
          margin-top: auto;
        }
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .footer-links a {
          color: #b7b7b7;
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover {
          color: white;
        }
        .contact p { margin: 0.25rem 0; color: #b7b7b7; }
        .copyright {
          color: #707070;
          font-size: 0.875rem;
        }
        @media (max-width: 768px) {
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
        }
      </style>
      <footer>
        <div class="footer-content">
          <div class="footer-top" style="display:flex;align-items:center;justify-content:center;gap:2rem;flex-wrap:wrap;">
            <div class="footer-logo">
              <img src="assets/logo.png" alt="Elevate Edge Logo" style="width:80px;height:80px;" />
            </div>
            <div class="footer-links">
              <a href="/">Home</a>
              <a href="#">About</a>
              <a href="#">Services</a>
              <a href="#">Contact Us</a>
            </div>
          </div>
          <div class="contact" style="margin-top:1rem;">
            <p>Jubilee Hills, Hyderabad - 500033, Telangana</p>
            <p>studioelevateedge@gmail.com | +91 89197 94276</p>
          </div>
          <p class="copyright">&copy; 2025 Elevate Edge Interiors. All rights reserved.</p>
        </div>
      </footer>
    `;
  }
}
customElements.define('custom-footer', CustomFooter);