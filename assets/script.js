
var bandSearch = function() {
    var apiKey = "app_id=e3abf6a96b165072b89208b2a7146862";
    fetch(
        "https://rest.bandsintown.com/artists/{artistname}/?" + apiKey)
    .then(function (response) {
        console.log(response)
        return response.json();
        
    })
    .then(function (ArtistData) {
        console.log(ArtistData);
        
    })

}

var displayBandInfo = function(response) {

}

var bandName = document.querySelector("input");
var searchBtn = document.querySelector("button");
var formSubmitHandler = function (event) {
    event.preventDefault();
    var band = bandName.value.trim();
    if (band) {
        bandSearch(band);
        bandName.value = "";
    } else {
        alert("Not a band");
    }
    console.log(event);
}
searchBtn.addEventListener("click", formSubmitHandler);
