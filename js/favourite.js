// Variables
const cards = document.querySelector('.cards');
const favCard = document.querySelector('.fav-card');
const empty = document.querySelector('.empty-notification');

// api token
const token = '1171300010070892';

// KNOW MORE button logic
// on clicking on 'know more' on any card it will open a new page with a detailed information.
// know more is a link with href = "./info.html?hero_id=${id}" where we are passing querystring with character id

// DISPLAY FAVOURITELIST
// On giving id, this function will fetch data from api and display characters
const renderCharacters = async (id) => {

    let url = `https://superheroapi.com/api.php/${token}/${id}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.response === 'error') {
        console.log('Error!');
        return;
    };

    // if publisher not available then 'NA'
    let publisher = `${data.biography.publisher === "" ? 'NA' : data.biography.publisher}`;

    // creating favourite character cards
    let favHero = document.createElement('div');

    favHero.classList.add('fav-card', 'mb-lg');

    favHero.innerHTML = `
        <div class="fav-hero-image">
             <img src=${data.image.url} alt="${data.name}-img">
        </div>

        <div class="fav-hero-details flex-col evenly align text-center">
                    
            <div class="fav-each-detail "> 
                <h2 class="highlight"> ${data.name} </h2>
            </div>

            <div class="fav-each-detail ">
                <h2> ${data.biography["full-name"]} </h2>
            </div>

            <div class="fav-each-detail flex center align">
                <i class="bi bi-pen-fill icon"></i>
                <h3> ${publisher} </h3>
            </div>

            <div class="options flex around align ">
                <a href="./info.html?hero_id=${id}" class="btn-link know-more"> know More!<i class="bi bi-box-arrow-up-right ml"></i></a>
                <i class="bi bi-trash large-icon pointer orange" function="delete" favHeroId=${id}></i>
            </div>      
        </div>
    `;
    cards.insertBefore(favHero, cards.appendChild(favHero));
};

// on loading this function will fetch id's from storage and pass to render function
const getFavourites = () => {

    cards.innerHTML = "";

    let localData = JSON.parse(window.localStorage.getItem('favHeroes'));

    // if local data doesnt exist or empty then show data empty image
    if (!localData || localData.length === 0) {

        empty.classList.remove('none');
        return;
    };

    localData.map((element) => {

        // id's are of string type converting to number and fetchin data from url
        renderCharacters(parseInt(element));
    });
};

// on fav page loading fav charcters will be displayed from local storage
window.addEventListener('load', getFavourites);

// DELETE FAVOURITE'S

// This DELETE function will fetch data from local storage filter the list by character we want to delete 
// and again store filtered data into local storage.
const deleteFavHero = (favHeroId) => {

    let fetchData = JSON.parse(window.localStorage.getItem('favHeroes'));

    if (!fetchData) {
        console.log("Please,Refersh the page!")
        return;
    }

    let filteredData = fetchData.filter((element) => {

        if (element !== favHeroId) {
            return element;
        };
    });

    window.localStorage.setItem('favHeroes', JSON.stringify(filteredData));
    // after filetering again displaying new characters
    getFavourites();
};

// if user click on trash icon then only calling delete function
cards.addEventListener('click', (event) => {

    // Attributes like function and id were provided to every fav hero card
    let functionType = event.target.getAttribute('function');
    let favHeroId = event.target.getAttribute('favHeroId');

    if (functionType === "delete") {

        deleteFavHero(favHeroId);
    };
});