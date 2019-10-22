const modal = document.querySelector(".modal");
const triggers = document.querySelectorAll(".grid-plant");


const populatePlantData = (event) => {
    const commonName = event.srcElement.attributes['data-common-name'].value;
    const latinName = event.srcElement.attributes['data-latin-name'].value;
    const image = event.srcElement.attributes['data-image'].value;
    const plantedDate = event.srcElement.attributes['data-planted-date'].value;
    const link = event.srcElement.attributes['data-link'].value;

    if (commonName) {
        document.querySelector('.modal-image').innerHTML = commonName;
    }
    if (latinName) {
        document.querySelector('.modal-image').innerHTML = latinName;
    }
    if (plantedDate) {
        document.querySelector('.modal-image').innerHTML = plantedDate;
    }
    if (image) {
        document.querySelector('.modal-image').innerHTML = `<img src=${image}>`;
    }
    if (link) {
        document.querySelector('.modal-link').innerHTML = `<a href=${link} target="_blank">RHS link</a>`;
    }
};

function showModal(event, plant) {
    populatePlantData(event);
    modal.classList.add("show-modal");
}

function hideModal() {
    if (event.relatedTarget === 'div.modal' || event.relatedTarget === 'div.borders-grid') {
        return
    } else {
        modal.classList.remove('show-modal');
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

// triggers[0].addEventListener("mouseenter", showModal);
// triggers[0].addEventListener("mouseleave", hideModal);
// triggers[0].addEventListener("click", showModal);

// <div class="modal-common-name"></div>
//     <div class="modal-latin-name"></div>
//     <div class="modal-image"></div>
//     <div class="modal-date"></div>
//     <div class="modal-link"></div>
