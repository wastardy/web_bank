'use strict';

//#region Query Selectors
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
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
//#endregion

//#region Testing
console.log(document.documentElement);
//#endregion