// Principles Interactive Component Logic for Home page
export function initPrinciples() {
  const principleCards = document.querySelectorAll('.principle-card');
  const displayNum = document.getElementById('display-num');
  const displayTitle = document.getElementById('display-title');
  const displayText = document.getElementById('display-text');
  const displayIcon = document.getElementById('display-icon');

  if (!principleCards.length) return;

  const principleData = {
    p1: {
      num: 'Principle 01',
      title: 'Belonging Comes First',
      text: 'Before we delve into symptom inventories or diagnostic assessments, we establish that you are fully welcomed as you are. A grounded sanctuary where your vulnerability is treated with absolute reverence.',
      icon: 'handshake'
    },
    p2: {
      num: 'Principle 02',
      title: 'See the Whole Person',
      text: 'We look far beyond distress markers to identify your innate resilience, cultural context, neurotype, and personal joys. You are a complete, evolving human being—not a cluster of symptoms.',
      icon: 'diversity_3'
    },
    p3: {
      num: 'Principle 03',
      title: 'Respect Every Story',
      text: 'Every narrative brought into our rooms is honored without unsolicited advice or cultural dismissal. We hold space for ambiguous loss, identity exploration, and quiet truth.',
      icon: 'menu_book'
    },
    p4: {
      num: 'Principle 04',
      title: 'Make Room for Purpose',
      text: 'Therapy creates clearance for what matters most. We work collaboratively to help you cultivate intentional meaning, values-aligned work, authentic connection, and vitality.',
      icon: 'lightbulb'
    },
    p5: {
      num: 'Principle 05',
      title: 'Offer Hope Without Promises',
      text: 'We practice authentic realism. Healing takes its own organic timeline, and we promise steady, skilled companionship rather than quick fixes or artificial certainty.',
      icon: 'nature_people'
    }
  };

  principleCards.forEach(card => {
    card.addEventListener('click', function() {
      const target = this.getAttribute('data-target');
      const data = principleData[target];

      // Update active styles in left list
      principleCards.forEach(c => {
        c.classList.remove('bg-surface', 'active-principle');
        c.classList.add('bg-surface-container-low');
        const numSpan = c.querySelector('.principle-num') || c.querySelector('span:first-child');
        if (numSpan) {
          numSpan.classList.remove('bg-primary', 'text-on-primary');
          numSpan.classList.add('bg-secondary-container', 'text-on-secondary-container');
        }
        const iconSpan = c.querySelector('.principle-icon');
        if (iconSpan) {
          iconSpan.textContent = 'chevron_right';
          iconSpan.classList.remove('text-primary');
          iconSpan.classList.add('text-on-surface-variant');
        }
        const bodyEl = c.querySelector('.principle-body');
        if (bodyEl) bodyEl.classList.add('hidden');
      });

      this.classList.remove('bg-surface-container-low');
      this.classList.add('bg-surface', 'active-principle');
      const activeNum = this.querySelector('.principle-num') || this.querySelector('span:first-child');
      if (activeNum) {
        activeNum.classList.remove('bg-secondary-container', 'text-on-secondary-container');
        activeNum.classList.add('bg-primary', 'text-on-primary');
      }
      const activeIcon = this.querySelector('.principle-icon');
      if (activeIcon) {
        activeIcon.textContent = 'expand_more';
        activeIcon.classList.remove('text-on-surface-variant');
        activeIcon.classList.add('text-primary');
      }
      const activeBody = this.querySelector('.principle-body');
      if (activeBody) activeBody.classList.remove('hidden');

      // Update presentation card on right
      if (data && displayNum && displayTitle && displayText && displayIcon) {
        displayNum.textContent = data.num;
        displayTitle.textContent = data.title;
        displayText.textContent = data.text;
        displayIcon.textContent = data.icon;
      }
    });
  });
}
