// variables
const userInput = document.getElementById('user-input');
const suggestionList = document.querySelector('.suggestions-list');
const wrapper = document.querySelector('.wrapper');
const msgBox =  document.querySelector('.msg');

// api token
const token = '1171300010070892';

// suggestions and favcharacters will be stored here
let suggestions=new Array();
let favList = new Array();
userInput.value="";

// function to check if id present in favlist(localstorage) or not
const favCheck = (id) =>{
 
    let state = false;
    let list = JSON.parse(window.localStorage.getItem('favHeroes'));

    if(!list){
        return;
    };

    list.map((element)=>{
       
        if(id === element){
            state = true;
            // heart filled icon will be displayed if state 'true' and empty for 'false'
        };
    });
   return state;
};

// creatting notification with a message 
const notification = (message) =>{

    msgBox.textContent = message; 
    setTimeout(()=>{
        msgBox.textContent = "";
    },700);
};

//  DISPLAY SUGGESTIONS
const renderList = (list) =>{

    // before rendering new list clearing previous list
    suggestionList.innerHTML="";

    list.map((element)=>{

        // creating new suggestions as a div
        let newHero = document.createElement('div');

        newHero.id = element.id;
        newHero.classList.add('suggestion', 'flex', 'between', 'align');

        newHero.innerHTML =`
        <div class="suggestion-bio flex align">
            <img class="suggestion-img" src= ${element.image} alt="img"/>
            <div class="name pointer ml-md"> ${element.name} </div>
        </div>
        <i class="${favCheck(element.id) ? 'bi-heart-fill' : 'bi-heart' } red pointer" title="Add to Favourite!"></i>
        `;
        
        // joining suggestions in the suggestions list
        suggestionList.insertBefore(newHero, suggestionList.appendChild(newHero));
    });
};

// This function will create SUGGESTIONS for user typed inputs
// we are using async/await to handle promises
// fetch method to get data from URL
const fetchData = async(input) =>{

    try {
        // URL
        let url = `https://superheroapi.com/api.php/${token}/search/${input}`;
        let response = await fetch(url);
        let data = await response.json();

        // getting matching names based on user input
        // but still names are not perfect so we are just only storing it then we will filter it.
        // e.g if entered 'g' it will return names containing letter 'g' but we want name strats with 'g'
        let superData = data.results;

        // if no matching names found then clear suggestion List and return
        if (!superData) {
            suggestionList.innerHTML = "";
            return;
        };

        // Applying filters to meet conditions and get perfect suggestions
        superData.filter((element) => {

            if(element.name.toLowerCase().startsWith(input)){

                // pushing perfect matching names along with id,image(url) in our suggestions array and display that array
                var obj = {
                    id: element.id,
                    name: element.name,
                    image: element.image.url
                };
                return suggestions.push(obj);
            };
        });

        // displaying all suggestions
        renderList(suggestions);
    }
    // if any error
    catch(error){
        console.log(error);
    };
};

// ACCEPTING INPUTS FROM KEYBOARD
userInput.addEventListener('keyup',(event)=>{

    // converting user input to lowercase and removing extra spaces
    let input = (event.target.value).toLowerCase().trim();

    // clearing previous inputs e.g user type'i' then 'ir' so clearing suggestions for i 
    // and storing results only for 'ir' and so on.
    suggestions =[];

    // fetching data for given inputs
    fetchData(input);
});

// ADDING OR PUSHING NEW FAVOURITES HERO IN LOCAL STORAGE
const  addToLocal = (favList,heroId) =>{

    // Initially if localStorage empty then create a local storage with key favHeroes and value favList
    if(!localStorage.getItem("favHeroes")){

       window.localStorage.setItem('favHeroes', JSON.stringify(favList));
    }

   // If storage not empty then create new list for new favheroes added by user and push them in storage 
   // concating with old data with same key name 'favHeroes'
    else{
       newList = JSON.parse(window.localStorage.getItem('favHeroes'));
       newList.push(heroId);

       // using [..new Set(data)] to remove duplicates in local Storage
       window.localStorage.setItem('favHeroes', JSON.stringify( [...new Set(newList)] ));
    };
};

// Adding listener on entire suggestionslist element
// it will listen to events like clicking on fav icon and clicking on suggestion to open new page.
suggestionList.addEventListener('click', (event)=>{

    let currentPointer = event.target;
    
    // Clicking on Heart icon heart fill effect and add to fav list
    if(currentPointer.tagName.toLowerCase() === "i"){

        currentPointer.classList.remove('bi-heart');
        currentPointer.classList.add('bi-heart-fill');

        let heroId = currentPointer.parentNode.id;
        favList.push(heroId);

        if(favCheck(heroId)){
            notification('character already in favourites!')
            return;
        }
        notification('added to favourites!')
        
        addToLocal(favList,heroId);
    };

    // clicking on name or image or suggestion box except heart icon of a particular suggestion
    // will open new page containing details about that character

    if(currentPointer.classList.contains("suggestion") || currentPointer.classList.contains("suggestion-img") 
    || currentPointer.classList.contains("name")){

        // on clicking suggestion - get currentpointer Id
        // on clicking name or image get root container id as id is given to root container only
        let searchId = currentPointer.id || currentPointer.parentNode.parentNode.id;
        
        // we are opening a new page with window.open method with a query string containing hero id
        // on clicking 'ironman'(346) suggestion link will be "domain name/info.html?hero_id=346"
        window.open('./pages/info.html'+'?hero_id='+searchId, "_self");
    };
});