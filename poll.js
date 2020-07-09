var apiKey = "";

var testapi = function () {
    console.log("testing api call");
    fetch("https://api.open-agora.com/info?api_token="+apiKey, {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
}).then(function(response) {
    if(response.ok) {
        response.json().then(function(data) {
            console.log(data);
        });
    }
});
}

testapi();
