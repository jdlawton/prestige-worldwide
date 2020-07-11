var bandBtn = document.querySelector("#band-btn")

var bandSearch = function() {
    var bands = ["clutch", "the black keys"]
    for (var i = 0; i < bands.length; i++) {
    var apiKey = "app_id=e3abf6a96b165072b89208b2a7146862";
    fetch(
        'https://rest.bandsintown.com/artists/' + bands[i] + '/?' + apiKey)
    .then(function (response) {
        console.log(response)
        return response.json();
        
    })
    .then(function (ArtistData) {
        console.log(ArtistData);
        displayBandInfo(ArtistData);
    })
}
}

var displayBandInfo = function(ArtistData) {
var response = document.querySelector("#response")
var picture = document.querySelector("#image_url")
//response.innerHTML = '';
var bandText = document.querySelector(".band-text")
console.log(bandText);
bandText.textContent = ArtistData.name;
//picture.setAttribute('src', ArtistData.image_url);
}

var bandName = document.querySelector("input");

var searchBtn = document.querySelectorAll(".button")
var formSubmitHandler = function (event) {
    //event.preventDefault();
    var clutchBtn = document.querySelector("#clutch");
    var clutchBand = "clutch";
    var theKeysBtn = document.querySelector("#The-Black-Keys")
    var theBlackKeysBand = "the black keys"
    // have a for loop for the buttons with the same class so if you click button[i] then you get band[i]
    // would need a var with array of band names.  the band name value would be the integer clicked.  
    // var band = ["band", "band", etc.]
     //for (var i = 0; i < searchBtn.length; i++) {
    if (searchBtn.value = clutchBtn) {
        bandSearch(clutchBand);
    } 
    else if (searchBtn.theKeysBtn) {
        bandSearch(theBlackKeysBand);
    } else {
        alert("Not a band");
    }
    console.log(event);
}

searchBtn.forEach((btn) => {
    btn.addEventListener("click", (event) => {
       bandSearch(event.target)
      console.log(event.target);
    });
  });