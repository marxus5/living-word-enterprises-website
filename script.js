// Page interactions are grouped by the matching controls in the HTML.

document.querySelectorAll('.current-year').forEach(function (year) {
  year.textContent = new Date().getFullYear();
});

// Draw decorative bars for the sample player.
document.querySelectorAll('.bars').forEach(function (container) {
  for (var index = 0; index < 28; index += 1) {
    var bar = document.createElement('span');
    bar.style.height = (6 + Math.random() * 26) + 'px';
    container.appendChild(bar);
  }
});

// Play the local sample audio once the MP3 has been added to the project.
var sampleAudio = document.getElementById('sample-audio');
var samplePlayButton = document.querySelector('.play-btn');
var sampleSubtitle = document.querySelector('.play-sub');
var listenButtons = document.querySelectorAll('.nav-cta');
var samplePlayLinks = document.querySelectorAll('.sample-play-link');

if (sampleAudio && samplePlayButton) {
  samplePlayButton.disabled = true;

  function updateListenButtons() {
    listenButtons.forEach(function (button) {
      button.textContent = sampleAudio.paused ? 'Listen now' : 'Pause audio';
    });
    samplePlayLinks.forEach(function (button) {
      button.textContent = sampleAudio.paused ? 'Listen to a sample' : 'Pause audio';
    });
  }

  function playSample() {
    sampleAudio.play().catch(function () {
      updateListenButtons();
      if (sampleSubtitle) {
        sampleSubtitle.textContent = 'Tap play to listen to the sample.';
      }
    });
  }

  document.querySelectorAll('.nav-cta, .sample-play-link').forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (!sampleAudio.paused) {
        sampleAudio.pause();
      } else {
        playSample();
      }
    });
  });

  if (new URLSearchParams(window.location.search).get('playSample') === '1') {
    window.scrollTo({ top: 0 });
    playSample();
  }

  sampleAudio.addEventListener('canplay', function () {
    samplePlayButton.disabled = false;
    if (sampleSubtitle) {
      sampleSubtitle.textContent = 'Sample affirmation';
    }
  });

  sampleAudio.addEventListener('error', function () {
    samplePlayButton.disabled = true;
    if (sampleSubtitle) {
      sampleSubtitle.textContent = 'Add audio/BeRenewedSample.m4a to enable playback.';
    }
  });

  sampleAudio.addEventListener('play', function () {
    updateListenButtons();
    samplePlayButton.innerHTML = '&#10074;&#10074;';
    samplePlayButton.setAttribute('aria-label', 'Pause sample');
  });

  sampleAudio.addEventListener('pause', function () {
    updateListenButtons();
    samplePlayButton.innerHTML = '&#9658;';
    samplePlayButton.setAttribute('aria-label', 'Play sample');
  });

  sampleAudio.addEventListener('ended', function () {
    updateListenButtons();
    samplePlayButton.innerHTML = '&#9658;';
    samplePlayButton.setAttribute('aria-label', 'Play sample');
  });

  samplePlayButton.addEventListener('click', function () {
    if (sampleAudio.paused) {
      playSample();
    } else {
      sampleAudio.pause();
    }
  });
}

// Open a prefilled email draft for the contact form.
var contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(contactForm);
    var name = formData.get('name').trim();
    var email = formData.get('email').trim();
    var message = formData.get('message').trim();
    var subject = encodeURIComponent('Website message from ' + name);
    var body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);

    window.location.href = 'mailto:PLJordan2023@gmail.com?subject=' + subject + '&body=' + body;
  });
}

// Show local confirmation after the waitlist form is submitted.
var waitlistForm = document.getElementById('waitlist-form');
var waitlistConfirmation = document.getElementById('waitlist-confirm');
var googleSheetsSignupEndpoint = 'https://script.google.com/macros/s/AKfycby-0eIRdKNW8fefR_z_WMO_T0EhJzeaQnHVv_G9c-WblDqYhDJPFeX-8_VJvOstAeEtBw/exec';

if (waitlistForm && waitlistConfirmation) {
  waitlistForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(waitlistForm);
    var email = String(formData.get('email') || '').trim();
    var phone = String(formData.get('phone') || '').trim();
    var website = String(formData.get('website') || '').trim();

    if (website) {
      waitlistForm.reset();
      return;
    }

    if (!googleSheetsSignupEndpoint) {
      waitlistConfirmation.textContent = 'Email sign-up is not connected yet. Please check back soon.';
      waitlistConfirmation.classList.add('is-visible');
      return;
    }

    var signupButton = waitlistForm.querySelector('button[type="submit"]');
    var payload = new URLSearchParams();
    payload.set('email', email);
    payload.set('phone', phone);
    payload.set('website', website);
    signupButton.disabled = true;

    fetch(googleSheetsSignupEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      body: payload
    }).then(function () {
      waitlistConfirmation.textContent = 'Thanks! Your signup request was sent.';
      waitlistConfirmation.classList.add('is-visible');
      waitlistForm.reset();
    }).catch(function () {
      waitlistConfirmation.textContent = 'We could not submit your email. Please try again later.';
      waitlistConfirmation.classList.add('is-visible');
    }).finally(function () {
      signupButton.disabled = false;
    });
  });
}

// Keep the mobile menu button's accessible state in sync with the menu.
var menuButton = document.getElementById('hamburger-btn');
var mobileMenu = document.getElementById('mobile-menu');

if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', function () {
    var isOpen = mobileMenu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

// Open and close each volume's scripture references.
document.querySelectorAll('[data-modal]').forEach(function (button) {
  button.addEventListener('click', function () {
    var dialog = document.getElementById(button.getAttribute('data-modal'));

    if (dialog) {
      dialog.showModal();
    }
  });
});

document.querySelectorAll('.modal-close').forEach(function (button) {
  button.addEventListener('click', function () {
    button.closest('dialog').close();
  });
});

var testimonials = [
  {
    quote: 'I downloaded this particular album from iTunes. This is a wonderful compilation of Scriptures and hymns. I was kind of nervous at first that there would be some "new age" weirdness about it. This is not the case. There is a quick introduction about what exactly is Biblical mediation. Then a male and female voice alternate reading Scripture from a "first person" tense, with traditional hymns and the sound of waves being played in the background. A great way to start the day!',
    name: '@ISayToMyself'
  },
  {
    quote: "I gave this CD to my niece and it quickly became her favorite CD, even replacing her Mariah Carey! She's a new believer and it's giving her so much encouragement and strength. I listen to it as I clean my house and it's so inspirational & uplifting. It's wonderful.",
    name: 'Cynthia T.'
  },
  {
    quote: 'My friend played the CD in her grandmother\'s room, and her grandmother kept requesting that it continue to play. When nurses came into her room, they would remark that there was something different. She attributes much of their progress to the fact that healing scriptures were playing repeatedly in their room. The Word of God is living and active, and it brought healing to a hospital room in Orlando.',
    name: 'Adrienne G.'
  },
  {
    quote: "The Lord laid it on my heart to get your CDs for my boys. I'm going through a separation from their dad; he had been verbally abusive and it was really affecting them. Well, I've been playing the CDs at night for them - and I am so happy to share that I am noticing a difference. They are behaving better and even doing better in school. I'm so thankful.",
    name: 'Jennifer M.'
  },
  {
    quote: 'What a blessing the word of God truly food for my soul. This is awesome, the voice is so anointed very clear and easy to understand not static.',
    name: '@dholmes4050'
  },
  {
    quote: "For so long I searched for some good anointed Scripture CDs. I can't stop listening to them - what a blessing.",
    name: 'Agnes N.'
  }
];
var testimonialTrack = document.getElementById('testi-track');
var reviewList = document.getElementById('review-list');
var reviewsDialog = document.getElementById('reviews-dialog');
var openReviewsButton = document.getElementById('open-reviews');
var testimonialExcerptLength = 160;

function createReviewStars() {
  var stars = document.createElement('div');
  stars.className = 'stars';
  stars.textContent = '★★★★★';
  stars.setAttribute('aria-label', '5 out of 5 stars');
  return stars;
}

function createReviewAttribution(name) {
  var attribution = document.createElement('div');
  attribution.className = 'who';
  attribution.textContent = name;
  return attribution;
}

function createTestimonialCard(review, reviewIndex) {
  var card = document.createElement('div');
  var text = document.createElement('p');
  var continueButton = document.createElement('button');
  var excerpt = review.quote;

  card.className = 'testi';
  if (excerpt.length > testimonialExcerptLength) {
    excerpt = excerpt.slice(0, testimonialExcerptLength).trimEnd() + '...';
  }
  text.textContent = '"' + excerpt + '"';
  continueButton.className = 'review-continue';
  continueButton.type = 'button';
  continueButton.textContent = 'Continue reading';
  continueButton.setAttribute('data-review-index', reviewIndex);

  card.append(createReviewStars(), text, continueButton, createReviewAttribution(review.name));
  return card;
}

function createFullReview(review, reviewIndex) {
  var item = document.createElement('article');
  var text = document.createElement('p');

  item.className = 'full-review';
  item.id = 'full-review-' + reviewIndex;
  text.textContent = '"' + review.quote + '"';
  item.append(createReviewStars(), text, createReviewAttribution(review.name));
  return item;
}

if (testimonialTrack) {
  testimonials.concat(testimonials).forEach(function (review, index) {
    testimonialTrack.appendChild(createTestimonialCard(review, index % testimonials.length));
  });
}

if (reviewList) {
  testimonials.forEach(function (review, index) {
    reviewList.appendChild(createFullReview(review, index));
  });
}

if (testimonialTrack && reviewList && reviewsDialog) {
  testimonialTrack.addEventListener('click', function (event) {
    var button = event.target.closest('.review-continue');

    if (!button) {
      return;
    }

    var review = reviewList.children[Number(button.getAttribute('data-review-index'))];

    if (review) {
      reviewsDialog.showModal();
      requestAnimationFrame(function () {
        review.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    }
  });
}

if (testimonialTrack) {
  testimonialTrack.closest('.testi-marquee').addEventListener('click', function () {
    testimonialTrack.classList.toggle('is-paused');
  });
}

if (reviewsDialog && openReviewsButton) {
  openReviewsButton.addEventListener('click', function () {
    reviewsDialog.showModal();
  });

  reviewsDialog.addEventListener('click', function (event) {
    if (event.target === reviewsDialog) {
      reviewsDialog.close();
    }
  });
}
