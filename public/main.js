// Homepage functionality
if (document.querySelector('.js-modal')) {
	const modal = document.querySelector('.js-modal');
	const modalContentInfo = document.querySelector('.js-modal-content-info');
	const modalContentForm = document.querySelector('.js-modal-content-form');
	const modalEditable = document.querySelector('.js-modal-content-editable');
	const matches = document.querySelectorAll('.js-grid-match');
	const editButton = document.querySelector('.js-modal-edit-button');
	const formWant = document.querySelector('.js-form-want');
	const tableToggles = document.querySelectorAll('.js-table-toggle');
	const wantToggles = document.querySelectorAll('.js-wants-toggle');
	const filterToggle = document.querySelector('.js-filter-toggle');

	const getModalData = (event) => {
		return {
			season: event.srcElement.attributes['data-season'].value,
			league: event.srcElement.attributes['data-league'].value,
			date: event.srcElement.attributes['data-date'].value,
			opponent: event.srcElement.attributes['data-opponent'].value,
			homeAway: event.srcElement.attributes['data-home-away'].value,
			score: event.srcElement.attributes['data-score'].value,
			competition: event.srcElement.attributes['data-competition'].value,
			matchNotes: event.srcElement.attributes['data-match-notes'].value,
			gotWant: event.srcElement.attributes['data-got-want'].value,
			price: event.srcElement.attributes['data-price'].value,
			notes: event.srcElement.attributes['data-notes'].value,
			id: event.srcElement.attributes['data-id'].value
		};
	};

	const showInfoModal = (event) => {
		const modalInfo = getModalData(event);
		populateModalData(modalInfo);
		const season = getSeasonContainer(event.path);
		season.appendChild(modal);
		populateForm(modalInfo);
		hideForm();
		showModalInfo();
		modal.classList.remove('hidden');
	};

	const populateModalData = (modalInfo) => {
		// changeBorderColour(modalInfo.colour);

		//TODO DRY?
		// get modal divs that we want to insert data into
		const modalSeason = document.querySelector('.js-modal-season');
		const modalLeague = document.querySelector('.js-modal-league');
		const modalDate = document.querySelector('.js-modal-date');
		const modalOpponent = document.querySelector('.js-modal-opponent');
		const modalHomeAway = document.querySelector('.js-modal-home_away');
		const modalScore = document.querySelector('.js-modal-score');
		const modalCompetition = document.querySelector('.js-modal-competition');
		const modalMatchNotes = document.querySelector('.js-modal-match_notes');
		const modalGotWant = document.querySelector('.js-modal-got_want');
		const modalPrice = document.querySelector('.js-modal-price');
		const modalNotes = document.querySelector('.js-modal-notes');

		// update modal with plant info
		modalSeason.innerHTML = modalInfo.season || '';
		modalLeague.innerHTML = modalInfo.league || '';
		modalDate.innerHTML = modalInfo.date || '';
		modalOpponent.innerHTML = modalInfo.opponent || '';
		modalHomeAway.innerHTML = modalInfo.homeAway || '';
		modalScore.innerHTML = modalInfo.score || '';
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

	};

	const populateForm = (modalInfo) => {
		// get form divs that we want to insert data into
		const formGot = document.querySelector('.js-form-got');
		const formNotes = document.querySelector('.js-form-notes');
		const formPrice = document.querySelector('.js-form-price');
		const formId = document.querySelector('.js-form-id');

		// set form placeholder values
		formPrice.placeholder = modalInfo.price || '';
		formNotes.placeholder = modalInfo.notes || '';
		formId.value = modalInfo.id || '';

		// remove current radio button selection
		formGot.removeAttribute('checked');
		formWant.removeAttribute('checked');

		if (modalInfo.gotWant === 'got') {
			formGot.setAttribute('checked', '');
		} else {
			formWant.setAttribute('checked', '');
		}
	};

	const showForm = () => {
		modalContentForm.classList.remove('hidden');
		modalEditable.classList.add('hidden');
	};

	const hideForm = () => {
		modalContentForm.classList.add('hidden');
		modalEditable.classList.remove('hidden');
	};

	const showModalInfo = () => {
		modalContentInfo.classList.remove('hidden');
		modalContentForm.classList.add('hidden');
	};

	//TODO dry out toggle functions - can they be abstracted?
	const toggleFilter = (event) => {
		toggleSpan(event.srcElement);
		const filter = document.querySelector('.js-filter-form');
		if(filter.classList.contains('hidden')) {
			filter.classList.remove('hidden');
		} else {
			filter.classList.add('hidden');
		}
	};

	const changeBorderColour = newColour => {
		if(newColour) {
			modalContentInfo.setAttribute('style', `border: 20px solid ${newColour}`);
			modalContentForm.setAttribute('style', `border: 20px solid ${newColour}`);
		} else {
			// remove previously set colour so form goes back to default border colour
			modalContentForm.removeAttribute('style');
		}
	};

	//make this more functional - at least pass in form colour - is it being used elsewhere? If not contain it here
	const changeFormColour = () => {
		for (let i = 0; i < formColour.options.length; i++) {
			if (formColour.options[i].selected) {
				changeBorderColour(formColour.options[i].value);
			}
		}
	};

	const toggleSpan = (srcElement) => {
		srcElement.classList.add('hidden');
		if (srcElement.nextElementSibling) {
			srcElement.nextElementSibling.classList.remove('hidden');
		} else {
			srcElement.previousElementSibling.classList.remove('hidden');
		}
	};

	const getSeasonContainer = eventPath => {
		//TODO make this a reduce
		let seasonContainer;
		eventPath.forEach(element => {
			if (element.dataset && element.dataset.season) {
				seasonContainer = element;
			}
		});
		return seasonContainer;
	};

	const toggleWants = (event) => {
		toggleSpan(event.srcElement);
		const seasonContainer = getSeasonContainer(event.path);
		const matchCells = seasonContainer.querySelectorAll('td');

		if (event.srcElement.classList.contains('js-show-wants')) {
			matchCells.forEach(cell => {
				if (cell.innerHTML === 'Got') {
					//TODO is this a better way of doing some of the other stuff?
					cell.parentNode.classList.add('hidden');
				}
			});
		} else {
			matchCells.forEach(cell => cell.parentNode.classList.remove('hidden'));
		}
	};

	const toggleTable = (event) => {
		const seasonContainer = getSeasonContainer(event.path);
		const table = seasonContainer.querySelector('.js-games-table');
		const dots = seasonContainer.querySelector('.js-games-dots');
		const wantsToggle = seasonContainer.querySelector('.js-wants-toggle');

		if (event.srcElement.classList.contains('js-show-more')) {
			dots.classList.add('hidden');
			table.classList.remove('hidden');
			wantsToggle.classList.remove('hidden');
		} else {
			table.classList.add('hidden');
			dots.classList.remove('hidden');
			wantsToggle.classList.add('hidden');
		}

		toggleSpan(event.srcElement);
	};

	matches.forEach(match => match.addEventListener('click', e => showInfoModal(e)));
	tableToggles.forEach(toggle => toggle.addEventListener('click', e => toggleTable(e)));
	wantToggles.forEach(toggle => toggle.addEventListener('click', e => toggleWants(e)));
	editButton.addEventListener('click', e => showForm(e));
	filterToggle.addEventListener('click', e => toggleFilter(e));
}
