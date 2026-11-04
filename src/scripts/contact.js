// Contact Form and FAQ Accordion Logic
export function initContactPage() {
  // FAQ accordion
  window.toggleFaq = function(btn) {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('.material-symbols-outlined');
    const isHidden = content.classList.contains('hidden');

    const parent = document.getElementById('faq-accordion');
    if (!parent) return;

    const allContents = parent.querySelectorAll('.faq-content');
    const allIcons = parent.querySelectorAll('.faq-icon');

    allContents.forEach(el => el.classList.add('hidden'));
    allIcons.forEach(i => i.classList.remove('rotate-180'));

    if (isHidden) {
      content.classList.remove('hidden');
      if (icon) icon.classList.add('rotate-180');
    }
  };

  // Consultation form handler
  const form = document.getElementById('consultation-form');
  const successState = document.getElementById('success-state');
  const resetBtn = document.getElementById('reset-form-btn');

  if (form && successState) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      form.classList.add('hidden');
      successState.classList.remove('hidden');
      successState.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  if (resetBtn && form && successState) {
    resetBtn.addEventListener('click', function() {
      form.reset();
      form.classList.remove('hidden');
      successState.classList.add('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
}

