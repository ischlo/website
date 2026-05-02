document.addEventListener('DOMContentLoaded', () => {
  const screenRatio = window.innerWidth / window.innerHeight;

  const interests = ['gis', 'spatial_data', 'visualisation', 'ml', 'bayesian','statistics', 'modelling', 'rstats', 'python', 'sql'];
  const alsoInterests = ['networks', 'urban_analytics', 'cities', 'economics', 'risk', 'sustainability'];

  const interestsEl = document.querySelector('#interests');
  if (interestsEl) {
    const makeTag = (tag) => {
      const a = document.createElement('a');
      a.href = `https://ischlo.github.io/blog/#category=${encodeURIComponent(tag)}`;
      a.target = '_blank';

      const span = document.createElement('span');
      span.className = 'interest_element';
      span.textContent = `#${tag}`;

      a.appendChild(span);
      return a;
    };

    interests.forEach((t) => interestsEl.appendChild(makeTag(t)));

    const h4 = document.createElement('h4');
    h4.textContent = 'Interests ';
    interestsEl.appendChild(h4);

    alsoInterests.forEach((t) => interestsEl.appendChild(makeTag(t)));
  }

  let clicked = null;
  const portSectionTitles = Array.from(document.querySelectorAll('.portfolio_section_title h5'));
  const sections = {
    software_tit: 'software',
    research_tit: 'research',
    courseworks_tit: 'courseworks',
    publications_tit: 'publications',
  };

  const pane = document.querySelector('.portfolio_sections_pane');

  const applySize = (sectionId, { width, height, border }) => {
    const el = document.querySelector(`#${sectionId}.portfolio_section`);
    if (!el) return;
    el.style.width = width;
    el.style.height = height;
    el.style.border = border ?? '1px solid rgb(63, 37, 141)';
  };

  const isMobile = () => screenRatio <= 1 && window.innerWidth < 700;

  const resetAll = () => {
    if (pane) pane.style.gridTemplateColumns = '1fr 1fr';
    portSectionTitles.forEach((h5) => {
      const sectionId = sections[h5.id];
      if (!sectionId) return;
      if (isMobile()) {
        applySize(sectionId, { width: '80vw', height: '35vh', border: '1px solid rgb(63, 37, 141)' });
      } else {
        applySize(sectionId, { width: '40vw', height: '35vh', border: '1px solid rgb(63, 37, 141)' });
      }
    });
  };

  portSectionTitles.forEach((h5) => {
    h5.addEventListener('click', () => {
      const sectionId = sections[h5.id];
      if (!sectionId) return;

      if (clicked !== null) {
        resetAll();
        clicked = null;
        return;
      }

      clicked = h5.id;
      if (isMobile()) {
        applySize(sectionId, { width: '80vw', height: '70vh' });
      } else {
        applySize(sectionId, { width: '70vw', height: '70vh' });
      }

      portSectionTitles.forEach((other) => {
        if (other.id === clicked) return;
        const otherSectionId = sections[other.id];
        if (!otherSectionId) return;
        applySize(otherSectionId, { width: '0vh', height: '0vh', border: '0' });
      });
    });
  });

  resetAll();
});
