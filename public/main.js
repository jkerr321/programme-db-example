// for query selectors
const matches = document.querySelectorAll('.js-grid-match');
const editButton = document.querySelector('.js-modal-edit-button');
const tableToggles = document.querySelectorAll('.js-table-toggle');
const wantToggles = document.querySelectorAll('.js-wants-toggle');
const filterToggle = document.querySelector('.js-filter-toggle');
const dataPoints = ['season', 'league', 'date', 'opponent', 'home_away', 'score', 'competition', 'match_notes', 'got_want', 'price', 'notes', 'id'];

// TODO no query selectors on these do they need to be global?
const modal = document.querySelector('.js-modal');
const modalContentForm = document.querySelector('.js-modal-content-form');
const modalEditable = document.querySelector('.js-modal-content-editable');

const hide = (element) => element.classList.add('hidden');
const show = (element) => element.classList.remove('hidden');

const toggleClickableSpan = (element) => {
	hide(element);
	if (element.nextElementSibling) {
		show(element.nextElementSibling);
	} else {
		show(element.previousElementSibling);
	}
};

const getSeasonContainer = (event) => {
	let seasonContainer;
	let element = event.target;
	while (element) {
		if (element.dataset && element.dataset.seasonString) {
			seasonContainer = element;
			break;
		} else {
			element = element.parentElement;
		}
	}
	return seasonContainer;
};

const showModal = (event) => {
	const season = getSeasonContainer(event);
	const modalInfoContainer = document.querySelector('.js-modal-content-info');
	let modalInfo = {};

	// modalInfo = {
	// 	season: '1908/09',
	// 	opponent: 'Tranmere Rovers',
	// 	etc...
	// }
	dataPoints.forEach(dataPoint => {
		modalInfo[dataPoint] = event.srcElement.attributes[`data-${dataPoint}`].value;
	});

	populateModalData(modalInfo);
	season.appendChild(modal); // position modal under correct season on page

	// populate form inside modal then hide;
	populateForm(modalInfo);
	hide(modalContentForm);
	show(modalEditable);

	show(modalInfoContainer);
	hide(modalContentForm);

	show(modal);
};

const populateModalData = (modalInfo) => {
	dataPoints.forEach(dataPoint => {
		if (document.querySelector(`.js-modal-${dataPoint}`)) {
			let preamble = '';
			// add some explainer text to less obvious data points
			if (modalInfo[dataPoint] && dataPoint === 'match_notes') {
				preamble = 'Match Notes: ';
			}
			if (modalInfo[dataPoint] && dataPoint === 'price') {
				preamble = 'Programme Price: ';
			}
			if (modalInfo[dataPoint] && dataPoint === 'notes') {
				preamble = 'Programme Notes: ';
			}
			document.querySelector(`.js-modal-${dataPoint}`).innerHTML = `${preamble}${modalInfo[dataPoint]}` || '';
		}
	});
};

const populateForm = (modalInfo) => {
	// get form divs that we want to insert data into
	const formWant = document.querySelector('.js-form-want');
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
	show(modalContentForm);
	hide(modalEditable);
};

const toggleFilter = (event) => {
	toggleClickableSpan(event.srcElement);
	const filter = document.querySelector('.js-filter-form');
	if(filter.classList.contains('hidden')) {
		show(filter);
	} else {
		hide(filter);
	}
};

const toggleWants = (event) => {
	toggleClickableSpan(event.srcElement);
	const seasonContainer = getSeasonContainer(event);
	const matchCells = seasonContainer.querySelectorAll('td');

	if (event.srcElement.classList.contains('js-show-wants')) {
		matchCells.forEach(cell => {
			if (cell.innerHTML === 'Got') {
				//TODO is this a better way of doing some of the other stuff?
				hide(cell.parentNode);
			}
		});
	} else {
		matchCells.forEach(cell => show(cell.parentNode));
	}
};

const toggleTable = (event) => {
	const seasonContainer = getSeasonContainer(event);
	const table = seasonContainer.querySelector('.js-games-table');
	const dots = seasonContainer.querySelector('.js-games-dots');
	const wantsToggle = seasonContainer.querySelector('.js-wants-toggle');
	const showAllSpan = seasonContainer.querySelector('.js-show-all');
	
	if (!modal.classList.contains('hidden')) { hide(modal) };
	if (event.srcElement.classList.contains('js-show-more')) {
		hide(dots);
		show(table);
		if (wantsToggle) {
			show(wantsToggle); 
		}
	} else {
		if (wantsToggle) {
			hide(wantsToggle);
		}
		hide(table);
		show(dots);
		
		// when hiding table also unfilter 'wants' back to full list
		toggleWants(event);
		toggleClickableSpan(showAllSpan);
	}
	toggleClickableSpan(event.srcElement);
};

tableToggles.forEach(toggle => toggle.addEventListener('click', e => toggleTable(e)));
matches.forEach(match => match.addEventListener('click', e => showModal(e)));
wantToggles.forEach(toggle => toggle.addEventListener('click', e => toggleWants(e)));
editButton.addEventListener('click', e => showForm(e));
filterToggle.addEventListener('click', e => toggleFilter(e));
