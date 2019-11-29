// Homepage functionality
if (document.querySelector('.js-modal')) {
    const modal = document.querySelector('.js-modal');
    const modalContentInfo = document.querySelector('.js-modal-content-info');
    const modalContentForm = document.querySelector('.js-modal-content-form');
    const matches = document.querySelectorAll('.js-grid-match');
    const editButton = document.querySelector('.js-modal-edit-button');

    const hideInitialModal = () => {
        const modalContentInitial = document.querySelector('.js-modal-initial');
        if (!modalContentInitial.classList.contains('hidden')) {
            modalContentInitial.classList.add('hidden')
        }
    }

    const getModalData = (event) => {
        return {
            season: event.srcElement.attributes['data-season'].value,
            league: event.srcElement.attributes['data-league'].value,
            tier: event.srcElement.attributes['data-tier'].value,
            date: event.srcElement.attributes['data-date'].value,
            opponent: event.srcElement.attributes['data-opponent'].value,
            home_away: event.srcElement.attributes['data-home-away'].value,
            score: event.srcElement.attributes['data-score'].value,
            result: event.srcElement.attributes['data-result'].value,
            position: event.srcElement.attributes['data-position'].value,
            points: event.srcElement.attributes['data-points'].value,
            competition: event.srcElement.attributes['data-competition'].value,
            match_notes: event.srcElement.attributes['data-match-notes'].value,
            got_want: event.srcElement.attributes['data-got-want'].value,
            price: event.srcElement.attributes['data-price'].value,
            notes: event.srcElement.attributes['data-notes'].value
        }
    }

    // NB Alas this isn't merged with functionality in toggleView because the modal is shown on load
    const showInfoModal = (event) => {
        hideInitialModal();
        const modalInfo = getModalData(event);
        populateModalData(modalInfo);
        populateForm(modalInfo);
        modalInfo.isFilled === 'true' ? showModalInfo() : showForm();
        // hide table if it's in view
        if (!table.classList.contains('hidden')) {
            table.classList.add('hidden');
        }
        modal.classList.remove('hidden');
    }

    const populateModalData = (modalInfo) => {
        // changeBorderColour(modalInfo.colour);

        // get modal divs that we want to insert data into
        const modalCommonName = document.querySelector('.js-modal-common-name');
        const modalLatinName = document.querySelector('.js-modal-latin-name');
        const modalPerennialAnnual = document.querySelector('.js-modal-perennial-annual');
        const modalImage = document.querySelector('.js-modal-image');
        const modalPlantedDate = document.querySelector('.js-modal-planted-date');
        const modalLink = document.querySelector('.js-modal-link');
        const modalNotes = document.querySelector('.js-modal-notes');
        
        // update modal with plant info
        modalCommonName.innerHTML = modalInfo.commonName || '';
        modalLatinName.innerHTML = modalInfo.latinName || '';
        modalNotes.innerHTML = modalInfo.notes || '';

        if (modalInfo.plantedDate) {
            modalPlantedDate.innerHTML = `Planted ${modalInfo.plantedDate}`;
        } else {
            modalPlantedDate.innerHTML = '';
        }

        if (modalInfo.perennialAnnual === 'P') {
            modalPerennialAnnual.innerHTML = 'Perennial';
        } else if (modalInfo.perennialAnnual === 'A') {
            modalPerennialAnnual.innerHTML = 'Annual';
        } else {
            modalPerennialAnnual.innerHTML = '';
        }

        if (modalInfo.image) {
            modalImage.innerHTML = `<img src=${modalInfo.image}>`;
        } else {
            modalImage.innerHTML = '';
        }

        if (modalInfo.link) {
            modalLink.innerHTML = `<a href=${modalInfo.link} target="_blank">RHS link</a>`;
        } else {
            modalLink.innerHTML = '';
        }

    };

    const populateForm = (modalInfo) => {
        // get form divs that we want to insert data into
        const formTitle = document.querySelector('.js-form-title');
        const formCommonName = document.querySelector('.js-form-common-name');
        const formLatinName = document.querySelector('.js-form-latin-name');
        const formAnnual = document.querySelector('.js-form-annual');
        const formPerennial = document.querySelector('.js-form-perennial');
        const formColour = document.querySelector('.js-form-colour');
        const formColourOptions = formColour.querySelectorAll('option');
        const formImage = document.querySelector('.js-form-image');
        const formPlantedDate = document.querySelector('.js-form-planted-date');
        const formLink = document.querySelector('.js-form-link');
        const formNotes = document.querySelector('.js-form-notes');
        const formPosition = document.querySelectorAll('.js-form-position');
        
        changeBorderColour(modalInfo.colour);

        // set form placeholder values
        formTitle.innerHTML = modalInfo.position || '';
        formCommonName.placeholder = modalInfo.commonName || '';
        formLatinName.placeholder = modalInfo.latinName || '';
        formImage.placeholder = modalInfo.image || '';
        formPlantedDate.placeholder = modalInfo.plantedDate || '';
        formLink.placeholder = modalInfo.link || '';
        formNotes.placeholder = modalInfo.notes || '';
        formPosition.forEach(field => field.value = modalInfo.position || '');

        // remove current radio button selection
        formPerennial.removeAttribute('checked');
        formAnnual.removeAttribute('checked');

        if (modalInfo.perennialAnnual === 'P') formPerennial.setAttribute('checked', '');
        if (modalInfo.perennialAnnual === 'A') formAnnual.setAttribute('checked', '');

        // remove currently selected default colour value and update to current plant colour
        for (let i = 0; i < formColour.options.length; i++) {
            formColour.options[i].removeAttribute('selected');
        }
        for (let i = 0; i < formColour.options.length; i++) {
            if (formColour.options[i].value.toLowerCase() === modalInfo.colour.toLowerCase()) {
                formColour.options[i].setAttribute('selected', '');
            }
        }
    }

    const showForm = () => {
        modalContentForm.classList.remove('hidden');
        modalContentInfo.classList.add('hidden');
    }

    const showModalInfo = () => {
        modalContentInfo.classList.remove('hidden');
        modalContentForm.classList.add('hidden');
    }

    const changeBorderColour = newColour => {
        if(newColour) {
            modalContentInfo.setAttribute('style', `border: 20px solid ${newColour}`)
            modalContentForm.setAttribute('style', `border: 20px solid ${newColour}`)
        } else {
            // remove previously set colour so form goes back to default border colour
            modalContentForm.removeAttribute('style');
        }
    }

    //make this more functional - at least pass in form colour - is it being used elsewhere? If not contain it here
    const changeFormColour = () => {
        for (let i = 0; i < formColour.options.length; i++) {
            if (formColour.options[i].selected) {
                changeBorderColour(formColour.options[i].value);
            }
        }
    }

    matches.forEach(match => match.addEventListener('click', e => showInfoModal(e)));
    editButton.addEventListener('click', e => showForm(e));
    formColour.addEventListener('change', changeFormColour);
}
