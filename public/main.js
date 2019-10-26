if (document.querySelector('.js-modal')) {
    const modal = document.querySelector('.js-modal');
    const table = document.querySelector('.js-table');
    const triggers = document.querySelectorAll('.js-grid-plant');
    const toggle = document.querySelector('.js-button-toggle-view');

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
        const colour = event.srcElement.attributes['data-colour'].value;

        const modalCommonName = document.querySelector('.js-modal-common-name');
        const modalLatinName = document.querySelector('.js-modal-latin-name');
        const modalPerennialAnnual = document.querySelector('.js-modal-perennial-annual');
        const modalImage = document.querySelector('.js-modal-image');
        const modalPlantedDate = document.querySelector('.js-modal-planted-date');
        const modalLink = document.querySelector('.js-modal-link');
        const modalContent = document.querySelector('.js-modal-content');

        modalCommonName.innerHTML = commonName || '';
        modalLatinName.innerHTML = latinName || '';
        modalContent.setAttribute('style', `border: 20px solid ${colour}`)

        if (plantedDate) {
            modalPlantedDate.innerHTML = `Planted ${plantedDate}`;
        } else {
            modalPlantedDate.innerHTML = '';
        }

        if (perennialAnnual === 'P') {
            modalPerennialAnnual.innerHTML = 'Perennial';
        } else if (perennialAnnual === 'A') {
            modalPerennialAnnual.innerHTML = 'Annual';
        } else {
            modalPerennialAnnual.innerHTML = '';
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
        //hide table if it's in view
        if (!table.classList.contains('hidden')) {
            table.classList.add('hidden');
        }
        populatePlantData(event);
        modal.classList.remove('hidden');
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
}

if (document.querySelector('.js-photo-modal')) {
    const modal = document.querySelector('.js-photo-modal');
    const modalContent = document.querySelector('.js-photo-modal-content');
    const timeline = document.querySelector('.js-gallery-container');
    const imgs = Array.from(timeline.querySelectorAll('.photo'));
    const close = modal.querySelector('.js-close');

    imgs.forEach(img => img.addEventListener('click', (e) => {
        modal.classList.add('photo-modal__show'); //TODO merge this with modal show above
        modalContent.src = e.srcElement.src;
    }));

    // close modal when anywhere on screen is clicked apart from the image itself
    close.addEventListener('click', () => {
        modal.classList.remove('photo-modal__show');
    });
    modal.addEventListener('click', function () {
        modal.classList.remove('photo-modal__show');
    });
    modalContent.addEventListener('click', function (e) {
        e.stopPropagation();
    });
}
