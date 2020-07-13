//api key, remove before pushing to GH
var apiKey = "HIDDEN";

google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);

//Elements on my test page I will be accessing
var infoBtnEl = document.querySelector("#poll-info");
var credBtnEl = document.querySelector("#credit-info");
var btnConEl = document.querySelector("#button-container");
var getChartEl = document.querySelector("#get-chart");
var showChartEl = document.querySelector("#show-chart");
var getResEl = document.querySelector("#get-results");
var chartConEl = document.querySelector("#chart-container");
var creditsEl = document.querySelector("#credits");
var updateEl = document.querySelector("#update-pollId");
var closeEl = document.querySelector("#close-poll");
var amountEl = document.querySelector("#amount");
var resetEl = document.querySelector("#delete-votes");

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
    //var buttonId = event.target.textContent;
    var buttonId = event.target.id;
    //console.log(event.target.id);
    //console.log(userVote);
    //console.log("inside vote. voting for: " + userVote);
    buttonId = buttonId.split("-");
    //console.log(buttonId[0]);
    //console.log(buttonId[1]);
    var buttonNum = parseInt(buttonId[1]);
    var voteAmount = amountEl.value;

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
    console.log("amount: " + amountEl.value);
    console.log("voteAmount: " + voteAmount);

    //var bodyStr = '{"poll_id": "'+pollId.id+'" , "choice_id": "'+voteChoiceId+'" }';
    //console.log(bodyStr);

    
    fetch("https://api.open-agora.com/votes/?api_token="+apiKey, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: '{"poll_id": "'+pollId.id+'", "choice_id": "'+voteChoiceId+'", "score": '+voteAmount+' }',
                //body: '{"poll_id": "PUAlaUWQTW" , "choice_id": "CjQyGxXWYQ", "score": 20 }',
                method: "POST"
    }).then(function(response) {
                if(response.ok) {
                    response.json().then(function(data) {
                        console.log("Voting");
                        console.log(data);
                        console.log("GettingResults");
                        getResults();
                    });
                }
    });

    
    //debugger;
    
    //console.log("reloading");
    //getChart();
    //location.reload();
    //drawBasic();
    
}

//This function saves the current pollId object to localStorage. Saving this us to continue displaying and working with poll data while
//minimizing the number of calls to the api to save our credits.
var savePollId = function () {
    localStorage.removeItem("pollId");
    localStorage.setItem("pollId", JSON.stringify(pollId));
    //console.log(pollId);
};



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
    fetch("https://api.open-agora.com/polls/"+pollId.id+"/results/sum/charts/hbar?api_token="+apiKey, {
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
    //console.log("Deleting old chart...");
    chartConEl.innerHTML = "";
    //console.log("Inside displayChart");
    if (pollId.chartUrl) {
        //console.log("Trying to display: " + pollId.chartUrl);
        var chartEl = document.createElement("img");
        chartEl.src = pollId.chartUrl;
        chartConEl.appendChild(chartEl);
        //location.reload();
    }
}

//Calls the api and returns the current results/standings for the poll. It logs the results to console and also
//saves each band's score to the pollId.choices array so the score can be accessed locally.
//**NOTE - THIS CALL COSTS 10 CREDITS **
var getResults = function () {
    //debugger
    console.log("Inside getResults");
    fetch("https://api.open-agora.com/polls/"+pollId.id+"/results/sum?api_token="+apiKey, {
        headers: {
            Accept: "application/json",
        }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                console.log("data.length: " + data.length);
                //debugger;
                for(var i=0; i<data.length; i++) {
                    console.log("Score: "+data[i].score);
                    //pollId.choices[i].score = data[i].score;
                    for(var j=0; j<pollId.choices.length; j++) {
                        if (pollId.choices[j].num === data[i].choice.num){
                            //console.log("We found a match");
                            //console.log("Adding " + data[i].choice.score + " to " + pollId.choices[j].label);
                            pollId.choices[j].score = data[i].score;
                            //drawBasic();
                        }
                    }
                }
                console.log("getResults SAVING");
                savePollId();
                drawBasic();
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
                                            //color: choiceData[i].color
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

//This function will delete all of the votes for the current poll
var deleteVotes = function () {
    fetch ("https://api.open-agora.com/votes/for-poll/"+pollId.id+"?api_token=" + apiKey, {
        headers: {
            Accept: "application/json"
        },
        method: "DELETE"
    }).then(function(response) {
        if(response.ok) {
            //response.json().then(function(data) {
                //console.log(data);
                console.log("Poll Reset");
                getResults();
                drawBasic();
            //});
        }
    });
}

//functions to call every time the program loads
//dummySave();
//creditCheck();
loadPollId();
//displayChart();
//displayChart();
//console.log(pollId);

//============================================================



function drawBasic() {

      var data = google.visualization.arrayToDataTable([
        ['Band', 'Amount',],
        [pollId.choices[0].label, pollId.choices[0].score],
        [pollId.choices[1].label, pollId.choices[1].score],
        [pollId.choices[2].label, pollId.choices[2].score],
        [pollId.choices[3].label, pollId.choices[3].score],
        [pollId.choices[4].label, pollId.choices[4].score],
        [pollId.choices[5].label, pollId.choices[5].score],
        [pollId.choices[6].label, pollId.choices[6].score],
        [pollId.choices[7].label, pollId.choices[7].score],
        [pollId.choices[8].label, pollId.choices[8].score],
        [pollId.choices[9].label, pollId.choices[9].score]
      ]);

      var options = {
        title: 'Band Vote',
        chartArea: {width: '50%'},
        height: 500,
        hAxis: {
          title: 'Amount Raised',
          minValue: 0,
          maxValue: 1000
        },
        /*vAxis: {
          title: 'Bands'
        }*/
      };

      var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

      chart.draw(data, options);
    }


//==============================================================

//event listeners
infoBtnEl.addEventListener("click", getPollInfo);
btnConEl.addEventListener("click", vote);
credBtnEl.addEventListener("click", creditCheck);
getChartEl.addEventListener("click", getChart);
getResEl.addEventListener("click", getResults);
updateEl.addEventListener("click", updatePollId);
closeEl.addEventListener("click", closePoll);
showChartEl.addEventListener("click", displayChart);
resetEl.addEventListener("click", deleteVotes);