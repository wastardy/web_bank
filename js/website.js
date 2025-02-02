'use strict';

//#region Query Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

// first task (smooth scroll)
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1'); 
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

// first task (smooth scroll)
const smoothScroll = () => {
    // event.preventDefault();

    const section1Coords = section1.getBoundingClientRect();
    console.log(section1Coords);
}
//#endregion

//#region Event Listeners
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
btnScrollTo.addEventListener('click', (event) => {
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


//#endregion