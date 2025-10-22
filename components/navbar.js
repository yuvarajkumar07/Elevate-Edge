class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        nav {
          background: #111111; /* match site dark header */
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        .logo-container {
          display: flex;
          align-items: center;
        }
        .logo {
          background: #000000ff; /* site accent */
          color: #111111;
          font-weight: 700;
          font-size: 1.1rem;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
        .brand {
          color: #ffffff;
        }
        .brand h1 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }
        .brand p {
          font-size: 0.875rem;
          margin: 0;
          opacity: 0.9;
        }
        ul {
          display: flex;
          gap: 1rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        a {
          color: #ffffff;
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        a:hover {
          background-color: rgba(223,166,103,0.12);
        }
        @media (max-width: 768px) {
          nav {
            flex-direction: column;
            gap: 1rem;
          }
          ul {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      </style>
      <nav>
        <div class="logo-container">
          <div class="logo">
            <img src="assets/logo.png" alt="Elevate Edge Logo" style="width:48px;height:48px;display:block;" />
          </div>
          <div class="brand">
            <h1>Elevate Edge Interiors</h1>
            <p>LET'S DESIGN YOUR DREAM SPACE TOGETHER.</p>
          </div>
        </div>
        <ul>
          <li><a href="/">Home</a></li>
        </ul>
      </nav>
    `;
  }
}
customElements.define('custom-navbar', CustomNavbar);