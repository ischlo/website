document.addEventListener('DOMContentLoaded', () => {
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
});
