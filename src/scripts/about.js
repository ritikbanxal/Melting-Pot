// Growth Cards Hover Logic for About page
export function initAboutPage() {
  document.querySelectorAll('.growth-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('shadow-md');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('shadow-md');
    });
  });
}

