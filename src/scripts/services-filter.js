// Filter Logic for Services page
export function initServicesFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.service-card');
  const counter = document.getElementById('visible-count');

  if (!filterButtons.length || !cards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedFilter = button.getAttribute('data-filter');

      // Style active button
      filterButtons.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'active-filter');
        btn.classList.add('bg-surface-container', 'text-on-surface');
      });
      button.classList.remove('bg-surface-container', 'text-on-surface');
      button.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'active-filter');

      let visibleCount = 0;

      // Filter cards
      cards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (selectedFilter === 'all' || categories.includes(selectedFilter)) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (counter) {
        counter.textContent = visibleCount;
      }
    });
  });
}

