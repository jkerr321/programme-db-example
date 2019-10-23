const modal = document.querySelector('.modal');
const table = document.querySelector('table');
const triggers = document.querySelectorAll('.grid-plant');
const toggle = document.querySelector('.button-toggle-view');

const toggleView = () => {
    if (table.classList.contains('hidden')) {
        table.classList.remove('hidden');
        modal.classList.add('hidden');
    } else {
        modal.classList.remove('hidden');
        table.classList.add('hidden');
    }
}

const populatePlantData = (event) => {
    const commonName = event.srcElement.attributes['data-common-name'].value;
    const latinName = event.srcElement.attributes['data-latin-name'].value;
    const perennialAnnual = event.srcElement.attributes['data-perennial-annual'].value;
    const image = event.srcElement.attributes['data-image'].value;
    const plantedDate = event.srcElement.attributes['data-planted-date'].value;
    const link = event.srcElement.attributes['data-link'].value;

    const modalCommonName = document.querySelector('.modal-common-name');
    const modalLatinName = document.querySelector('.modal-latin-name');
    const modalPerennialAnnual = document.querySelector('.modal-perennial-annual');
    const modalImage = document.querySelector('.modal-image');
    const modalPlantedDate = document.querySelector('.modal-planted-date');
    const modalLink = document.querySelector('.modal-link');

    modalCommonName.innerHTML = commonName || '';
    modalLatinName.innerHTML = latinName || '';
    modalPerennialAnnual.innerHTML = perennialAnnual || '';

    if (plantedDate) {
        modalPlantedDate.innerHTML = `Planted ${plantedDate}`;
    } else {
        modalPlantedDate.innerHTML = '';
    }

    if (image) {
        modalImage.innerHTML = `<img src=${image}>`;
    } else {
        modalImage.innerHTML = '';
    }

    if (link) {
        modalLink.innerHTML = `<a href=${link} target="_blank">RHS link</a>`;
    } else {
        modalLink.innerHTML = '';
    }
};

function showModal(event, plant) {
    populatePlantData(event);
    modal.classList.remove('hidden');
}

function hideModal() {
    if (event.relatedTarget === 'div.modal' || event.relatedTarget === 'div.borders-grid') {
        return
    } else {
        modal.classList.add('hidden');
    }
}

function highlightGridPlant(plant) {
    const alreadySelected = document.querySelector('.selected');
    if (alreadySelected) {
        alreadySelected.classList.remove('selected');
    }
    plant.classList.add('selected');
}

triggers.forEach(plant => plant.addEventListener("click", event => showModal(event, plant)));
triggers.forEach(plant => plant.addEventListener("click", () => highlightGridPlant(plant)));
toggle.addEventListener('click', toggleView);