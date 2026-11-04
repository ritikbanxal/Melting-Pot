import './styles/main.css';
import { initNavigation } from './scripts/navigation.js';
import { initPrinciples } from './scripts/principles.js';
import { initServicesFilter } from './scripts/services-filter.js';
import { initContactPage } from './scripts/contact.js';
import { initAboutPage } from './scripts/about.js';

export function initAllPageInteractions() {
  initPrinciples();
  initServicesFilter();
  initContactPage();
  initAboutPage();
}

// Expose on window for instantaneous client-side navigation re-hydration
window._initPageScripts = initAllPageInteractions;

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAllPageInteractions();
});

