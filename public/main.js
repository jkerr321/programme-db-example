// Homepage functionality
if (document.querySelector('.js-modal')) {
    const modal = document.querySelector('.js-modal');
    const modalContentInfo = document.querySelector('.js-modal-content-info');
    const modalContentForm = document.querySelector('.js-modal-content-form');
    const modalEditable = document.querySelector('.js-modal-content-editable');
    const matches = document.querySelectorAll('.js-grid-match');
    const editButton = document.querySelector('.js-modal-edit-button');
    const formWant = document.querySelector('.js-form-want');

    const hideInitialModal = () => {
        const modalContentInitial = document.querySelector('.js-modal-initial');
        if (!modalContentInitial.classList.contains('hidden')) {
            modalContentInitial.classList.add('hidden');
        }
    }

    const getModalData = (event) => {
        return {
            season: event.srcElement.attributes['data-season'].value,
            league: event.srcElement.attributes['data-league'].value,
            date: event.srcElement.attributes['data-date'].value,
            opponent: event.srcElement.attributes['data-opponent'].value,
            homeAway: event.srcElement.attributes['data-home-away'].value,
            score: event.srcElement.attributes['data-score'].value,
            position: event.srcElement.attributes['data-position'].value,
            points: event.srcElement.attributes['data-points'].value,
            competition: event.srcElement.attributes['data-competition'].value,
            matchNotes: event.srcElement.attributes['data-match-notes'].value,
            gotWant: event.srcElement.attributes['data-got-want'].value,
            price: event.srcElement.attributes['data-price'].value,
            notes: event.srcElement.attributes['data-notes'].value,
            id: event.srcElement.attributes['data-id'].value
        }
    }

    const positionModal = () => {
        // to do - put this in sep function
        const boundingPixel = document.querySelector('.js-bounding-pixel').getBoundingClientRect();
        var top = boundingPixel.top;
        let offset = 0;
        if (top <= 0) {
            offset = 0 - top;
        }
        modal.setAttribute('style', `top:${offset}px`)
    }

    // NB Alas this isn't merged with functionality in toggleView because the modal is shown on load
    const showInfoModal = (event) => {
        hideInitialModal();
        const modalInfo = getModalData(event);        
        populateModalData(modalInfo);
        positionModal();
        populateForm(modalInfo);
        hideForm();
        showModalInfo();
        modal.classList.remove('hidden');
    }

    const populateModalData = (modalInfo) => {
        // changeBorderColour(modalInfo.colour);

        //TODO DRY?
        // get modal divs that we want to insert data into
        const modalSeason = document.querySelector('.js-modal-season')
        const modalLeague = document.querySelector('.js-modal-league')
        const modalDate = document.querySelector('.js-modal-date')
        const modalOpponent = document.querySelector('.js-modal-opponent')
        const modalHomeAway = document.querySelector('.js-modal-home_away')
        const modalScore = document.querySelector('.js-modal-score')
        const modalPosition = document.querySelector('.js-modal-position')
        const modalPoints = document.querySelector('.js-modal-points')
        const modalCompetition = document.querySelector('.js-modal-competition')
        const modalMatchNotes = document.querySelector('.js-modal-match_notes')
        const modalGotWant = document.querySelector('.js-modal-got_want')
        const modalPrice = document.querySelector('.js-modal-price')
        const modalNotes = document.querySelector('.js-modal-notes')
        
        // update modal with plant info
        modalSeason.innerHTML = modalInfo.season || '';
        modalLeague.innerHTML = modalInfo.league || '';
        modalDate.innerHTML = modalInfo.date || '';
        modalOpponent.innerHTML = modalInfo.opponent || '';
        modalHomeAway.innerHTML = modalInfo.homeAway || '';
        modalScore.innerHTML = modalInfo.score || '';
        modalPosition.innerHTML = modalInfo.position || '';
        modalPoints.innerHTML = modalInfo.points || '';
        modalCompetition.innerHTML = modalInfo.competition || '';
        modalGotWant.innerHTML = modalInfo.gotWant || '';

        //TODO DRY create func for this
        if (modalInfo.matchNotes) {
            modalMatchNotes.innerHTML = `Match Notes: ${modalInfo.matchNotes}`;
        } else {
            modalMatchNotes.innerHTML = '';
        }

        if (modalInfo.price) {
            modalPrice.innerHTML = `Programme Price: ${modalInfo.price}`;
        } else {
            modalPrice.innerHTML = '';
        }

        if (modalInfo.notes) {
            modalNotes.innerHTML = `Programme Notes: ${modalInfo.notes}`;
        } else {
            modalNotes.innerHTML = '';
        }

        if (modalInfo.points) {
            modalPoints.innerHTML = `Points: ${modalInfo.points}`;
        } else {
            modalPoints.innerHTML = '';
        }

        if (modalInfo.position) {
            modalPosition.innerHTML = `League Position: ${modalInfo.position}`;
        } else {
            modalPosition.innerHTML = '';
        }

    };

    const populateForm = (modalInfo) => {
        // get form divs that we want to insert data into
        const formGot = document.querySelector('.js-form-got');
        const formNotes = document.querySelector('.js-form-notes');
        const formPrice = document.querySelector('.js-form-price');
        const formId = document.querySelector('.js-form-id');
        console.log('==================');
        console.log('modalInfo.id', modalInfo.id);
        console.log('==================');
        
        // set form placeholder values
        formPrice.placeholder = modalInfo.price || '';
        formNotes.placeholder = modalInfo.notes || '';
        formId.value = modalInfo.id || '';
        console.log('==================');
        console.log('formId.value', formId.value);
        console.log('==================');
        

        // remove current radio button selection
        formGot.removeAttribute('checked');
        formWant.removeAttribute('checked');

        if (modalInfo.gotWant === 'got') {
            formGot.setAttribute('checked', '');
        } else {
            formWant.setAttribute('checked', '');
        }
    }

    const showForm = () => {
        modalContentForm.classList.remove('hidden');
        modalEditable.classList.add('hidden');
    }

    const hideForm = () => {
        modalContentForm.classList.add('hidden');
        modalEditable.classList.remove('hidden');
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
    // formGotWant.addEventListener('change', changeFormColour);
}
