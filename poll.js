var apiKey = "fZYwg4ZBLCTz2foj9DsfTO0cppIhM0el";

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