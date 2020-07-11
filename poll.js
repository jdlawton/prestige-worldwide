//api key, remove before pushing to GH
var apiKey = "fZYwg4ZBLCTz2foj9DsfTO0cppIhM0el";

//Elements on my test page I will be accessing
var infoBtnEl = document.querySelector("#poll-info");
var credBtnEl = document.querySelector("#credit-info");
var btnConEl = document.querySelector("#button-container");
var getChartEl = document.querySelector("#get-chart");
var getResEl = document.querySelector("#get-results");
var chartConEl = document.querySelector("#chart-container");
var creditsEl = document.querySelector("#credits");
var updateEl = document.querySelector("#update-pollId");
var closeEl = document.querySelector("#close-poll");

//The main poll object, consisting of the poll ID, poll title, poll status (OPEN/CLOSED), an array of choices, and the URL for the associated chart
var pollId = {
    id: "",
    title: "",
    poll_status: "",
    chartUrl: "",
    choices: []
}

//function calls the api and displays the number of credits available for the subscription this month.
//this is for monitoring the number of remaining calls we can make this month. Most actions cost 10 credits.
//**NOTE - THIS CALL COSTS 0 CREDITS */
var creditCheck = function () {
    //console.log("testing api call");
    fetch("https://api.open-agora.com/info?api_token="+apiKey, {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
}).then(function(response) {
    if(response.ok) {
        response.json().then(function(data) {
            //console.log(data);
            creditsEl.textContent = data.subscription.credits + " Credits Left";
        });
    }
});
}

//request account infomration from api
//testapi();

//get information about the poll. This will return info like the poll ID, title, status, the poll choices and the choice IDs, numbers, and labels.
//This function can be expanded on to save the returned data to the pollId object and save that to localStorage so future actions do not need to make api calls to get
//this information.
//**NOTE - THIS CALL ONLY COSTS 1 CREDIT**
var getPollInfo = function () {
    fetch("https://api.open-agora.com/polls/"+pollId.id+"?api_token=" + apiKey).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
    });
}

//The voting function, currently clicking on one of the vote buttons will add a vote to the appropriate result. The api is called to log the vote for the voter's choice
//**NOTE - THIS CALL COSTS 10 CREDITS **
var vote = function (event) {
    //console.log(event.target);
    var buttonId = event.target.textContent;
    //console.log(userVote);
    //console.log("inside vote. voting for: " + userVote);
    buttonId = buttonId.split(" ");
    //console.log(userVote[0]);
    //console.log(userVote[1]);
    var buttonNum = parseInt(buttonId[1]);

    //Loop through the array of choices in pollId and find the one with the num attribute that matches the button pressed.
    //Then it copies the ID for that choice into voteChoiceId which will be used to form the api call below.
    for (var i=0; i<pollId.choices.length; i++) {
        //console.log("Poll Choice :" + pollId.choices[i].num + " ID: " + pollId.choices[i].id);
        //console.log(typeof(voteChoice));
        //console.log(typeof(pollId.choices[i].num));
        if(buttonNum === pollId.choices[i].num) {
            var voteChoiceId = pollId.choices[i].id;
            console.log("VoteChoiceId: " + voteChoiceId);
        }
    }

    console.log("Going into vote call...");
    console.log("We are voting in poll with ID: " + pollId.id);
    console.log("Poll title: " + pollId.title);
    console.log("Choice Number: " + pollId.choices[buttonNum-1].num);
    console.log("Choice ID: " + pollId.choices[buttonNum-1].id);
    console.log("VoteChoiceId: " + voteChoiceId);
    console.log("Choice Title: " + pollId.choices[buttonNum-1].label);

    var bodyStr = '{"poll_id": "'+pollId.id+'" , "choice_id": "'+voteChoiceId+'" }';
    console.log(bodyStr);

    
    fetch("https://api.open-agora.com/votes/?api_token="+apiKey, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: '{"poll_id": "'+pollId.id+'" , "choice_id": "'+voteChoiceId+'" }',
                //body: '{"poll_id": "Pyn0FYhq8H" , "choice_id": "CfEAzmNK0a" }',
                method: "POST"
    }).then(function(response) {
                if(response.ok) {
                    response.json().then(function(data) {
                        console.log(data);
                    });
                }
    });
    
}

//This function saves the current pollId object to localStorage. Saving this us to continue displaying and working with poll data while
//minimizing the number of calls to the api to save our credits.
var savePollId = function () {
    localStorage.removeItem("pollId");
    localStorage.setItem("pollId", JSON.stringify(pollId));
    //console.log(pollId);
};

//This is just a dummy function that is used to populate the localStorage information with information for my test poll wihout spending 10 credits to call the api.
var dummySave = function () {
    pollId.id = "Pyn0FYhq8H";
    pollId.title = "Test Poll";
    pollId.poll_status = "OPEN";
    pollId.chartUrl = "http://chart.open-agora.com/0py1Xkv3g8";
    pollId.choices.push({
        id: "CUgXDxW5Gi",
        num: 1,
        label: "first choice"
    });
    pollId.choices.push({
        id: "C7IKC5odSV",
        num: 2,
        label: "second choice"
    });
    pollId.choices.push({
        id: "CfEAzmNK0a",
        num: 3,
        label: "third choice"
    });
    pollId.choices.push({
        id: "CdYP2Zor9Z",
        num: 4,
        label: "fourth choice"
    });
    pollId.choices.push({
        id: "Crlg1eFZTf",
        num: 5,
        label: "fifth choice"
    });
    pollId.choices.push({
        id: "Ci3l68EdmZ",
        num: 6,
        label: "sixth choice"
    });
    pollId.choices.push({
        id: "CRAkZwCmRf",
        num: 7,
        label: "seventh choice"
    });
    pollId.choices.push({
        id: "CNSmMD7TqM",
        num: 8,
        label: "eighth choice"
    });
    pollId.choices.push({
        id: "C6CDgE9390",
        num: 9,
        label: "ninth choice"
    });
    pollId.choices.push({
        id: "CZ8Jzjg4Fg",
        num: 10,
        label: "tenth choice"
    });
    //console.log(pollId);
    savePollId();
}

//Loads the pollId info from localStorage. If there is no pollId info in localStorage, it initializes an empty pollId object.
var loadPollId = function () {
    pollId = JSON.parse(localStorage.getItem("pollId"));
    if (!pollId) {
        pollId = {
            id: "",
            title: "",
            poll_status: "",
            chartUrl: "",
            choices: []
        };
    }
}

//makes an api call to get/update the chart with the current poll results, this call returns a url to the chart which is subsequently stored in the pollId
//object so the chart can continue to be displayed wihout needing to make a call.
//**NOTE - THIS CALL COSTS 10 CREDITS **
var getChart = function () {
    console.log("Inside getCharts");
    fetch("https://api.open-agora.com/polls/"+pollId.id+"/results/majority/charts/hbar?api_token="+apiKey, {
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                pollId.chartUrl = data.url;
                console.log(pollId.chartUrl);
                savePollId();
                displayChart();
            });
        }
    });
}

//function to add an img element to the chart-container div, displaying the current chart image from the pollId.chartUrl
var displayChart = function () {
    chartConEl.innerHTML = "";
    //console.log("Inside displayChart");
    if (pollId.chartUrl) {
        //console.log("Trying to display: " + pollId.chartUrl);
        var chartEl = document.createElement("img");
        chartEl.src = pollId.chartUrl;
        chartConEl.appendChild(chartEl);
    }
}

//Calls the api and returns the current results/standings for the poll. Currently these are just logged to console.
//**NOTE - THIS CALL COSTS 10 CREDITS **
var getResults = function () {
    console.log("Inside getResults");
    fetch("https://api.open-agora.com/polls/"+pollId.id+"/results/majority?api_token="+apiKey, {
        headers: {
            Accept: "application/json",
        }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
    });
}

//This function updates the pollId object with the current open poll. It first calls the api to find all of the polls associated with the apiKey, then
//finds the poll with poll_status: OPEN. It then saves that poll's id and title, and poll_status and then calls the api to get a list of choices associated
//with the open poll. It then iterates through the returned poll choices and pushes each choice to the pollId.choices[] array. Next it gets the chartUrl for the 
//open poll's chart, stores that in pollId and then displays it to the page. Finally, it saves the new pollId object to localStorage so we can work off of that data
//locally until the poll changes/closes.
var updatePollId = function () {
    console.log("Inside updatePollId");
    //get a list of all polls associated with this apiKey
    fetch ("https://api.open-agora.com/polls/?api_token="+apiKey, {
        headers: {
            Accept: "application/json"
        }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                //pollId = "";
                for(var i=0; i<data.length; i++) {
                    if(data[i].poll_status === "OPEN"){
                        pollId.id = data[i].id;
                        pollId.title = data[i].title;
                        pollId.poll_status = data[i].poll_status;
                        pollId.chartUrl = "";
                        pollId.choices = [];
                        console.log ("New Poll Data...");
                        console.log (pollId);
                        fetch ("https://api.open-agora.com/choices/?api_token="+apiKey+"&poll_id="+pollId.id, {
                            headers: {
                                Accept: "application/json"
                            }
                        }).then(function(choiceRes) {
                            if(choiceRes.ok) {
                                choiceRes.json().then(function(choiceData) {
                                    console.log("ChoiceData: ")
                                    console.log(choiceData);
                                    for(var i=0; i<choiceData.length; i++) {
                                        pollId.choices.push({
                                            id: choiceData[i].id,
                                            num: choiceData[i].num,
                                            label: choiceData[i].label,
                                            color: choiceData[i].color
                                        });
                                    }
                                    savePollId();
                                });
                            }
                        });
                        getChart();
                    }
                }
            });
        }
    });
}

//This will close the currently open poll
var closePoll = function () {
    fetch ("https://api.open-agora.com/polls/"+pollId.id+"?api_token="+apiKey, {
        headers: {
            Accept: "application/json",
            "Content-type": "application/json"
        },
        body: '{"poll_status": "CLOSED"}',
        method: "PATCH"
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                pollId = "";
                console.log(pollId);
            });
        }
    });
}

//functions to call every time the program loads
//dummySave();
//creditCheck();
loadPollId();
displayChart();
//displayChart();
//console.log(pollId);

//event listeners
infoBtnEl.addEventListener("click", getPollInfo);
btnConEl.addEventListener("click", vote);
credBtnEl.addEventListener("click", creditCheck);
getChartEl.addEventListener("click", getChart);
getResEl.addEventListener("click", getResults);
updateEl.addEventListener("click", updatePollId);
closeEl.addEventListener("click", closePoll);