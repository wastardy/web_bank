'use strict';

//#region Query Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// first task (smooth scroll)
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1'); 

const headerImage = document.querySelector('.header__img'); 

// event propagation
const navbar = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const navLink = document.querySelector('.nav__link');

// smooth page navigation
const allNavbarLinks = document.querySelectorAll('.nav__link');

// tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// sticky navbar, Observer API
const header = document.querySelector('.header');

// reveal sections
const allSections = document.querySelectorAll('.section');
//#endregion

//#region Methods
const openModal = (event) => {
    event.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = () => {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

// 1st task (smooth scroll)
const smoothScroll = () => {
    const section1Coords = section1.getBoundingClientRect();
    // console.log(section1Coords);

    // window.scrollTo(
    //     section1Coords.left + window.pageXOffset, 
    //     section1Coords.top + window.pageYOffset
    // );

    window.scrollTo({
        left: section1Coords.left + window.pageXOffset, 
        top: section1Coords.top + window.pageYOffset,
        behavior: 'smooth'
    });

    // new way to implement smooth scroll
    section1.scrollIntoView({ behavior: 'smooth' });
}

///////////////////////////////////////////////////

// 2nd task (page navigation)
// Unofficient Approach <================
/* function handleNavbarClick (event) {
    event.preventDefault();
    // console.log('LINKLINKLINK');

    // const id = event.currentTarget.getAttribute('href');
    const id = this.getAttribute('href');
    // console.log(id);

    document.querySelector(id).scrollIntoView({
        behavior: 'smooth'
    });
}*/

// Use instead event delegation
// 1. Add event listener to common parent elemt
// 2. Determine what element originated the event
function handleNavbarClick (event) {
    event.preventDefault();
    
    if (event.target.classList.contains('nav__link')) {
        // console.log('LINK');
        
        const id = event.target.getAttribute('href');
        //console.log(id);

        document.querySelector(id).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

///////////////////////////////////////////////////

// 3rd task (tabbed component)
// Event Delegation & DOM Traversing
function switchTabs (event) {
    // const clicked = event.target.parentElement;
    const clicked = event.target.closest('.operations__tab');
    // console.log(clicked);

    // Guard clause
    if (!clicked) return;

    // Remove active class
    tabs.forEach(tab => 
        tab.classList.remove('operations__tab--active')
    );
    tabsContent.forEach(content => 
        content.classList.remove('operations__content--active')
    );

    // Active tab
    clicked.classList.add('operations__tab--active');

    // Activate content area
    document.querySelector(
        `.operations__content--${clicked.dataset.tab}`
    ).classList.add('operations__content--active');

}

///////////////////////////////////////////////////

// 4th task (menu fade animation)
// Passing arguments to event handler
function navbarHover (event) {
    if (event.target.classList.contains('nav__link')) {
        const link = event.target;

        const nav = link.closest('.nav');
        
        const siblings = nav.querySelectorAll('.nav__link');

        const logo = nav.querySelector('.nav__logo');

        // opacity === 0.5 ? 1 : 0.5;

        siblings.forEach(element => {
            if (element !== link) element.style.opacity = this;
        });
        if (logo) logo.style.opacity = this;
    }
}

///////////////////////////////////////////////////

// 5th task (sticky navbar)
/* function navbarSticky (event) {
    // console.log(this.window.scrollY);
    if (window.scrollY > initialCoordinates.top) {
        navbar.classList.add('sticky');
    }
    else {
        navbar.classList.remove('sticky');
    }
} */

///////////////////////////////////////////////////

// 6th task (Observer API)
function obsNavbarSticky (entries) {
    const [ entry ] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) {
        navbar.classList.add('sticky');
    }
    else {
        navbar.classList.remove('sticky');
    }
}

///////////////////////////////////////////////////

// 7th task (reveal sections)
//#endregion

//#region Event Handlers
btnsOpenModal.forEach(button => {
    return button.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' 
        && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

// first task (smooth scroll)
btnScrollTo.addEventListener('click', smoothScroll);

///////////////////////////////////////////////////

// second task (page navigation)
// Use event delegation
// 1. Add event listener to common parent elemt
// 2. Determine what element originated the event

// Bad approach <===============================
// allNavbarLinks.forEach(navLink => 
//     navLink.addEventListener('click', handleNavbarClick)
// );

navLinks.addEventListener('click', handleNavbarClick);

///////////////////////////////////////////////////

// third task (tabbed component)
tabsContainer.addEventListener('click', switchTabs);

///////////////////////////////////////////////////

// forth task (menu fade animation)
// Passing argument into handler func
navbar.addEventListener('mouseover', navbarHover.bind(0.5));
navbar.addEventListener('mouseout', navbarHover.bind(1));

///////////////////////////////////////////////////

// fifth task (sticky navbar)
/* const initialCoordinates = section1.getBoundingClientRect();

    window.addEventListener('scroll', navbarSticky); */

///////////////////////////////////////////////////

// sixth task (observer API)
const navbarHeight = navbar.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(
    obsNavbarSticky, 
    {
        root: null, // for viewing entire viewport
        threshold: 0,
        rootMargin: `-${navbarHeight}px`,
    }
);

headerObserver.observe(header);

///////////////////////////////////////////////////

// seventh task (reveal sections)
function revealSection (entries, observer) {
    const [ entry ] = entries;
    console.log(entry);

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionsObserver = new IntersectionObserver(
    revealSection, 
    {
        root: null,
        threshold: 0.17,
    }
);

allSections.forEach(section => {
    sectionsObserver.observe(section);
    section.classList.add('section--hidden');
});
//#endregion

//#region Testing
// Сreating and inserting elements
/* const header = document.querySelector('.header');
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = `bla bla bla we 
//     use cookies for improved functionality`;
message.innerHTML = `bla bla bla we use cookies for improved 
functionality <button class="btn btn-close-cookie">Got it!</button>`;

// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// delete elements
document.querySelector('.btn-close-cookie')
    .addEventListener('click', () => {
        message.remove();
    });
*/

///////////////////////////////////////////////////

// Styles
/* message.style.backgroundColor = '#37383d';
message.style.width = '103.7%';
message.style.height = Number.parseFloat(
    getComputedStyle(message).height) + 30 + 'px';
console.log(getComputedStyle(message).height);

document.documentElement.style.setProperty('--color-primary', 'orangered');

const logo = document.querySelector('nav__logo');
console.log(logo.getAtribute('src'));
*/

///////////////////////////////////////////////////

// Types of events & events handlers
// headerImage.addEventListener('mouseenter', () => {
//     alert('haha got u, motherfucker');
// });

// oldschool way
// headerImage.onmouseenter = function () {
//     alert('haha got u, motherfucker');
// }

///////////////////////////////////////////////////

// Randomcolor, Event propagation
/* const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomColor = () => `rgb(
    ${randomInt(0, 255)}, 
    ${randomInt(0, 255)}, 
    ${randomInt(0, 255)}
)`;

navbar.addEventListener('click', function (e) {
    console.log('NAVBAR', e.target, e.currentTarget);
    this.style.backgroundColor = randomColor();
});

navLinks.addEventListener('click', function (e) {
    console.log('Links', e.target, e.currentTarget);
    this.style.backgroundColor = randomColor();
});

navLink.addEventListener('click', function (e) {
    console.log('Link', e.target, e.currentTarget);
    this.style.backgroundColor = randomColor();

    // Stop propagation <=========================
    // e.stopPropagation();
}); */

// DOM Traversing
// const h1 = document.querySelector('h1');
// h1.firstElementChild.style.color = 'red';

///////////////////////////////////////////////////

// Observer API
/* const obsCallback = function (entries, observer) {
    entries.forEach(entry => {
        console.log(entry);
    });
}

const obsOptions = {
    root: null, 
    threshold: [0, 0.2], 
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); */

///////////////////////////////////////////////////

// 

//#endregion