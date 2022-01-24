// variables
const characterLike = document.querySelector('.character-like');
let bioSection = document.querySelector(".biography");
let appearSection = document.querySelector(".appearance");
const favList = new Array();

// api token
const token = '1171300010070892';

// window.location return the current url
// window.location.search return the querying part in url
// then using substring to get desired id e.g '?hero-id=' have length 9 so remove upto that and give rest
const queryString = window.location.search;
const queryId = queryString.substring(9);

// function to check if id present in favlist(localstorage) or not
const favCheck = (id) => {

    let state = false;
    let list = JSON.parse(window.localStorage.getItem('favHeroes'));

    if (!list) {
        return;
    };

    list.map((element) => {

        if (id == element) {
            state = true;
        };
    });
    return state;
};

// This function will display information like biography and appearnace on given position on document and with what topic/heading

const renderInfo = (position, topic) => {

    // all questions like name,fullname,etc from topic 'biography' and
    // questions like height,weight,etc from topic 'appearance stored as Array
    let questions = Object.keys(topic);

    questions.map((element) => {

        let newField = document.createElement('div');
        let botBorder = document.createElement('div')

        newField.classList.add('field', 'flex', 'between',);
        botBorder.classList.add('bottom-border')

        newField.innerHTML = `
            <div class="sub-field">
                <h2>${element}</h2>
            </div>
            <div class="sub-field">
                <h2 class="fullName light-text"> ${topic[element]} </h2>
            </div>
        `;

        position.insertBefore(newField, position.appendChild(newField));
        position.insertBefore(botBorder, position.appendChild(botBorder));
    });
};

// This function will fetch details of the character from API
const characterDetails = async () => {

    try {

        let url = `https://superheroapi.com/api.php/${token}/${queryId}`;
        let response = await fetch(url);
        let data = await response.json();

        if (data.response === 'error') {
            console.log('Character not found!');
            return;
        };

        // Title, Name, Image of page  
        document.querySelector('.title').textContent = `Superverse! | ${data.name}`;
        document.querySelector('.name').textContent = data.name;
        document.querySelector('.charImg').src = data.image.url;

        // changing like icon color 
        if (favCheck(queryId)) {
            document.querySelector('.character-like').classList.add('bi-heart-fill');
        }
        else {
            document.querySelector('.character-like').classList.add('bi-heart')
        }

        // Data related to biography and appearance were stored and passed to display
        let bioData = data.biography;
        let appearData = data.appearance;

        renderInfo(bioSection, bioData);
        renderInfo(appearSection, appearData);

        // displaying powerstats
        let powerStat = data.powerstats;

        let powerTitle = document.querySelectorAll('.power-name h2');

        for (let i of powerTitle) {

            let changes = i.textContent.toLowerCase();
            document.querySelector(`.${changes}`).textContent = powerStat[changes];
            document.querySelector(`.${changes}-level`).setAttribute("value", powerStat[changes]);
        };
    }
    catch (error) {
        console.log(error);
    };
};

// on window load character information will be displayed
window.addEventListener('load', characterDetails);

// ADDING CHARACTERS TO FAVOURITE LIST IN LOCAL STORAGE

const addToLocal = (favList, heroId) => {

    // Initially if localStorage empty then create a local storage with key favHeroes and value favList
    if(!localStorage.getItem("favHeroes")){

        window.localStorage.setItem('favHeroes', JSON.stringify(favList));
    }

    // If storage not empty then create new list for new favheroes added by user and push them in storage 
    // concating with old data with same key name 'favHeroes'
    else {
        newList = JSON.parse(window.localStorage.getItem('favHeroes'));
        newList.push(heroId);

        // using [..new Set(data)] to remove duplicates in local Storage
        window.localStorage.setItem('favHeroes', JSON.stringify([...new Set(newList)]));
    };
};

// on clicking like button heart-fill-effect with adding character in local storage
characterLike.addEventListener('click', () => {

    characterLike.classList.remove('bi-heart');
    characterLike.classList.add('bi-heart-fill');
    favList.push(queryId);

    addToLocal(favList, queryId);
});

// POWER VALUES ANIMATION
// selecting all power values container
let progressBars = document.querySelectorAll(".power-value");

const initialiseBar = (bar) => {

    bar.setAttribute("data-visited", false);
    bar.style.width = 0 + '%';
};

for (let bar of progressBars) {

    initialiseBar(bar);
};

// filling animation using setInterval till currentwidth reached targetwidth
const fillBar = (bar) => {

    let currentWidth = 0;
    let targetWidth = bar.getAttribute("value");
    if (targetWidth === "null") {
        return;
    }
    let interval = setInterval(() => {

        if (currentWidth >= targetWidth) {
            clearInterval(interval);
            return;
        };
        currentWidth++;
        bar.style.width = `${currentWidth}%`;
    }, 5);
};

// This function will check every progress bar.
const checkScroll = () => {

    for (let bar of progressBars) {
        let barCoordinates = bar.getBoundingClientRect();
        if ((bar.getAttribute("data-visited") == "false") &&
            (barCoordinates.top <= (window.innerHeight - barCoordinates.height))) {
            bar.setAttribute("data-visited", true);
            fillBar(bar);
        }
        else if (barCoordinates.top > window.innerHeight) {
            bar.setAttribute("data-visited", false);
            initialiseBar(bar);
        };
    };
};

// on window scroll animation start
window.addEventListener("scroll", checkScroll);