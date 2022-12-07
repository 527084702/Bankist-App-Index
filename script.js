'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function(btn){
  return btn.addEventListener('click', openModal);
})
/*
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);
*/
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Button scrolling

btnScrollTo.addEventListener('click', function(e){
  //e.preventDefault
  const s1coords = section1.getBoundingClientRect();

  //console.log('current scroll (X/Y)', window.pageXOffset, pageYOffset);

  //window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset); //current position + current scroll
  /* //old method for scroll
  window.scrollTo({
    left: s1coords.left + window.pageXOffset, 
    top: s1coords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
  section1.scrollIntoView({ behavior: 'smooth'});//only work for modern browser

})

// Page Navigation scrolling
/* // Version 1 - only for select few element.
document.querySelectorAll('.nav__link').forEach(function(el){
  el.addEventListener('click', function(e){
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth'});
  })
})
*/
// Version 2 - work for large amount of element
// 1. Add event listener co common parent element
// 2. Determine what element originated the event.
document.querySelector('.nav__links').addEventListener('click', function(e){
  e.preventDefault();
  //console.log(e.target);
  // CHeck/Matching
  if (e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth'});
  }
})


// Tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


tabsContainer.addEventListener('click', function(e){
  const clicked = e.target.closest('.operations__tab');
  //console.log(clicked)

  if(!clicked) return;

  // remove active tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  
  // active clicked tab
  clicked.classList.add('operations__tab--active'); 
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

// Menu fade animation
const nav = document.querySelector('.nav');

const handleHover = function(e, opacity){
  if (e.target.classList.contains('nav__link')){

    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    //console.log(logo);
    sibling.forEach(el => {
      if (el !==link) el.style.opacity = this; //normally use 'opacity' when passing 2 values.
    });
   //logo.style.opacity = opacity; //hide Bankist logo
  }
}

/*nav.addEventListener('mouseover', function(e){
  handleHover(e, 0.5);
})*/
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation

/* //old style for sticky function. but the scroll always running when page moved. website performance will going down.
const testNav = document.querySelector('#nav--1');
const initialCoords = testNav.getBoundingClientRect();

window.addEventListener('scroll', function(){
  if (window.scrollY > initialCoords.bottom) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
})*/

/*
or change CSS by adding :
  position: fixed;
  background-color: rgba(255, 255, 255, 0.95);
*/
const stickyHeader = document.querySelector('#header--1');
const navHeight = nav.getBoundingClientRect().height; //get height dynamic

const stickyFunction = function(entries){
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const stickyOptions = {
  root: null,
  threshold: 1, //[0, 0.2]
  //rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyFunction, stickyOptions)

headerObserver.observe(stickyHeader);

// Reveal sections
const allSection = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target); //stop observe when done. performance increase. 
}

const revealOption = {
  root: null,
  threshold: 0.17,
}

const revealObserver = new IntersectionObserver(revealSection, revealOption);

allSection.forEach(function(section){
  revealObserver.observe(section);
  //section.classList.add('section--hidden');
})

// Slow loading images
const slowImg = document.querySelectorAll('img[data-src]');

const imgSection = function(entries, observer){
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  //when img is loaded, remove filter(blur)
  entry.target.addEventListener('load', function(){
    entry.target.classList.remove('lazy-img');
  })

  observer.unobserve(entry.target); //stop observe when done. performance increase.
}

const imgOption = {
  root: null,
  threshold: 0,
  rootMargin: `200px`, //load fast before user reach the img
}

const imgObserver = new IntersectionObserver(imgSection, imgOption);

slowImg.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');


  let curSlide = 0;
  const maxSlide = slides.length;

  const createDots = function () {
    slides.forEach(function (s, i) {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    })
  };



  const activatedDot = function (slide) {
    // Remove all active dots
    document.querySelectorAll('.dots__dot').forEach(function (dot) {
      dot.classList.remove('dots__dot--active');
    })

    // Add active dot
    //console.log(slide);
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }


  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    })
  }


  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activatedDot(curSlide);
  }

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activatedDot(curSlide);
  }

  const init = function () {
    goToSlide(0);
    createDots();
    activatedDot(0);
  }
  init();


  // Event handlers
  btnLeft.addEventListener('click', prevSlide);
  btnRight.addEventListener('click', nextSlide);

  document.addEventListener('keydown', function (e) {
    //console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    //console.log(e);
    if (e.target.classList.contains('dots__dot')) {
      //const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; //Destructuring
      //console.log(e.target.dataset.slide);
      goToSlide(slide);
      activatedDot(slide);
    }
  })
}
slider();



/*
//Reference area
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');


const message = document.createElement('div');
message.classList.add('cookie-missage');
message.innerHTML = 'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it</button>';

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true)); //able to show on mutl area.
// header.before(message);
// header.afrer(message);

//Delete element
document.querySelector('.btn--close-cookie').addEventListener('click', function(){
  message.remove();
  //message.parentElement.removeChild(message);
})

//Style
message.style.backgroundColor = '#37383d'
message.style.color = 'white';
//message.style.width = '50%';

//document.documentElement.style.setProperty('--color-primary', 'red');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
logo.setAttribute('company', 'Bankist');

// Classes
logo.classList.add('a', 'b');
logo.classList.remove('a');
logo.classList.toggle('a');
logo.classList.contains('a'); //not includes
*/

//Testing area

/*
const h1 = document.querySelector('h1');

const alerH1 = function(e){
  alert('You are reading the heading XD');
  h1.removeEventListener('mouseenter', alerH1);
}
h1.addEventListener('mouseenter', alerH1);

//or setting time to remove event.
/*setTimeout(function(){
  h1.removeEventListener('mouseenter', alerH1);
},3000)*/ 

/*
const randomInt = (min, max) => Math.floor(Math.random() * (max - min) + min);
const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;


/*document.querySelector('.nav__links').addEventListener('click', function(e){
  //console.log(randomColor());
  this.style.backgroundColor = randomColor();
  e.stopPropagation();//stop propagation good for mutl handlers for same events
});*/


//document.querySelector('.header').style.background = 'black';

// Function for warning if user is really want to close the tab.
// only use for when user is filling something etc.
/*
window.addEventListener('beforeunload', function(e){
  e.preventDefault();
  console.log(e);
  e.returnValue = '';
})
*/ 

