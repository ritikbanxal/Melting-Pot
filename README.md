# Melting Pot Psychological Services Website

A complete, production-ready website for **Melting Pot Psychological Services** (*"Where Every Story Belongs"*), converted with 100% visual and interactive fidelity from Google Stitch designs.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build for production (Hostinger ready)
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 🌐 Deploying to Hostinger (Step-by-Step)

The project is already pre-configured for instant static hosting on **Hostinger** (or any static hosting service like Netlify, Vercel, or Apache/Nginx).

### Method A: Via Hostinger File Manager (cPanel / hPanel)
1. Run `npm run build` in your terminal. This generates the production files in the `dist/` directory.
2. Log into your **Hostinger Control Panel** (hPanel).
3. Open **File Manager** and navigate to your website's **`public_html/`** folder.
4. Upload all the contents inside the `dist/` directory directly into `public_html/`:
   - `index.html`
   - `about.html`
   - `services.html`
   - `contact.html`
   - `assets/` (folder containing compiled CSS & JS)
5. Visit your domain! Your website will load instantly.

### Method B: Via Git Deploy in Hostinger
1. Push this repository to GitHub or GitLab.
2. In Hostinger hPanel, configure Git deployment pointing to the `dist` branch or set up standard deployment.

---

## 📱 Responsive & Design Highlights
- **Desktop, Laptop, Tablet & Mobile**: Fully responsive layouts with fluid container paddings, adaptive grids, and a touch-friendly slide-out mobile drawer menu.
- **Ultra-Fast & Lightweight**:
  - Total compiled CSS: **~34 kB** (~6.2 kB gzipped)
  - Total compiled JS: **~7 kB** (~2.5 kB gzipped)
  - Sub-second first contentful paint.
- **Interactive Features**:
  - **Home**: Dynamic 5 Brand Principles interactive tabs with live card updates.
  - **About Us**: 9 Key Growth Areas interactive cards, 8 Practice Values, Vision & Mission split.
  - **Services**: Real-time 5-category filter chip catalog with visible service counter for all 11 clinical offerings.
  - **Contact**: 6-step consultation request form with seamless `#success-state` confirmation, office details, and interactive FAQ accordion.
- **Crisis Support**: Dedicated 988 Suicide & Crisis Lifeline banners with one-touch phone dialers.

