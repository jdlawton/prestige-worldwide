//api key, remove before pushing to GH
var apiKey = "fZYwg4ZBLCTz2foj9DsfTO0cppIhM0el";

//these lines must be included in order to include the Google charting functionality
google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(drawBasic);

//elements on my test page I will be accessing
//var infoBtnEl = document.querySelector("#poll-info");
//var credBtnEl = document.querySelector("#credit-info");
//var btnConEl = document.querySelector("#button-container");
//var getChartEl = document.querySelector("#get-chart");
//var showChartEl = document.querySelector("#show-chart");
//var getResEl = document.querySelector("#get-results");
//var chartConEl = document.querySelector("#chart-container");
var messagesEl = document.querySelector("#messages");
//var updateEl = document.querySelector("#update-pollId");
//var closeEl = document.querySelector("#close-poll");
var amountEl = document.querySelector("#amount");
//var resetEl = document.querySelector("#delete-votes");
var bandsEl = document.querySelector("#bands");
var donateBtnEl = document.querySelector("#donate-button");

//the main poll object, consisting of the poll ID, poll title, poll status (OPEN/CLOSED), an array of choices
//the choices each contain an id, label, num(their position in the poll), and score(the amount attributed to that choice)
var pollId = {
    id: "",
    title: "",
    poll_status: "",
    choices: []
}

//the voting function, enter a value into the amount textarea on the page and click the band you want to contribute for. this function will then assign that amount
//to the corresponding band. It will then get the current scores for each band, store that info in pollId and then update the graph with the new info.
//**NOTE - THIS CALL COSTS 20 CREDITS TOTAL (10 TO VOTE AND 10 TO UPDATE THE SCORES) **
var vote = function () {
    //var buttonId = event.target.id;
    //buttonId = buttonId.split("-");
    //var buttonNum = parseInt(buttonId[1]);
    var voteAmount = amountEl.value;
    var voteId = bandsEl.value;
    console.log(voteId);
    voteId = voteId.split("-");
    var voteNum = parseInt(voteId[1]);
    console.log(voteNum);

    //Loop through the array of choices in pollId and find the one with the num attribute that matches the button pressed.
    //Then it copies the ID for that choice into voteChoiceId which will be used to form the api call below.
    for (var i=0; i<pollId.choices.length; i++) {
        if(voteNum === pollId.choices[i].num) {
            var voteChoiceId = pollId.choices[i].id;
            console.log("VoteChoiceId: " + voteChoiceId);
        }
    }

    //checking over all of our info to make sure everything is set correctly for the call
    /*
    console.log("Going into vote call...");
    console.log("We are voting in poll with ID: " + pollId.id);
    console.log("Poll title: " + pollId.title);
    console.log("Choice Number: " + pollId.choices[buttonNum-1].num);
    console.log("Choice ID: " + pollId.choices[buttonNum-1].id);
    console.log("VoteChoiceId: " + voteChoiceId);
    console.log("Choice Title: " + pollId.choices[buttonNum-1].label);
    console.log("amount: " + amountEl.value);
    console.log("voteAmount: " + voteAmount);
    */
    
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
                        //console.log(data);
                        amountEl.value = "";
                        //call the getResults function after the vote has been recorded to update the scores and the chart
                        getResults();
                    });
                } else {
                    //error logging for if the fetch returns something other than success, displays the error on the console and the page
                    console.log ("Error getting results");
                    console.log ("Error #: " + response.status);
                    console.log ("Error Message: " + response.statusText);
                    messagesEl.textContent = "Couldn't contact server, error #" + response.status + " " + response.statusText;
                }
    }).catch (function(error) {
        //error logging if contacting the server fails, displays error on the console and the page
        console.log ("Error contacting server: " + error);
        messagesEl.textContent = "Error contacting server! " + error;
    });    
    
}

//this function saves the current pollId object to localStorage. saving this allows us to continue displaying and working with poll data while
//minimizing the number of calls to the api to save our credits.
var savePollId = function () {
    localStorage.removeItem("pollId");
    localStorage.setItem("pollId", JSON.stringify(pollId));
};

//loads the pollId info from localStorage. if there is no pollId info in localStorage, it initializes an empty pollId object.
var loadPollId = function () {
    pollId = JSON.parse(localStorage.getItem("pollId"));
    if (!pollId) {
        pollId = {
            id: "",
            title: "",
            poll_status: "",
            choices: []
        };
        updatePollId();
    }
}

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
                //console.log(data);
                for(var i=0; i<data.length; i++) {
                    if(data[i].poll_status === "OPEN"){
                        pollId.id = data[i].id;
                        pollId.title = data[i].title;
                        pollId.poll_status = data[i].poll_status;
                        pollId.choices = [];
                        //call the api and find all of the choices associated with the OPEN poll, then assign their
                        //data to the pollId.choices[] array.
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
                                        });
                                    }
                                    getResults();
                                    savePollId();
                                });
                                //getResults();
                            }
                        });
                    }
                }
            });
        }
    });
}

//Calls the api and returns the current results/standings for the poll. It logs the results to console and also
//saves each band's score to the pollId.choices array so the score can be accessed locally. finally, it calls drawBasic
//to redraw the chart with the updated data
//**NOTE - THIS CALL COSTS 10 CREDITS **
var getResults = function () {
    console.log("Inside getResults");
    fetch("https://api.open-agora.com/polls/"+pollId.id+"/results/sum?api_token="+apiKey, {
        headers: {
            Accept: "application/json",
        }
    }).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                //console.log(data);
                //console.log("data.length: " + data.length);
                for(var i=0; i<data.length; i++) {
                    //console.log("Score: "+data[i].score);
                    //pollId.choices[i].score = data[i].score;
                    for(var j=0; j<pollId.choices.length; j++) {
                        if (pollId.choices[j].num === data[i].choice.num){
                            //console.log("We found a match");
                            pollId.choices[j].score = data[i].score;
                        }
                    }
                }
                //save the updated scores to localStorage and redraw the chart with updated info
                savePollId();
                drawBasic();
            });
        } else {
            //error logging for if the fetch returns something other than success
            console.log ("Error getting results");
            console.log ("Error #: " + response.status);
            console.log ("Error Message: " + response.statusText);
            messagesEl.textContent = "Couldn't contact server, error #" + response.status + " " + response.statusText;
        }
    }).catch (function(error) {
        //error logging for if the fetch cannot contact the server
        console.log ("Error contacting server: " + error);
        messagesEl.textContent = "Error contacting server! " + error;
    });
}

//this function was provided by the Google library to create the bar graph on the page.
function drawBasic() {
    if(pollId.id){
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
        title: 'Donations',
        chartArea: {width: '50%'},
        height: 600,
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
}

//********************************************************************************************************
//THE FOLLOWING FUNCTIONS WERE CREATED PRIMARILY FOR TESTING PURPOSES AND TO MAKE INTERACTING
//WITH THE API EASIER WHILE I BUILT THE FUNCTIONALITY NEEDED FOR OUR PROJECT. IN THE EVENT THE PROJECT
//CONTINUED A LOT OF THIS WOULD LIKELY BE INTEGRATED INTO A "VENUE MANAGER CONTROL PANEL" TYPE OF PAGE
//THAT WOULD ALLOW FOR POLL CREATING, UPDATING, DELETING, CLOSING, ETC.
//********************************************************************************************************

//function calls the api and displays the number of credits available for the subscription this month.
//**NOTE - THIS CALL COSTS 0 CREDITS */
var creditCheck = function () {
    fetch("https://api.open-agora.com/info?api_token="+apiKey, {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
}).then(function(response) {
    if(response.ok) {
        response.json().then(function(data) {
            console.log(data.subscription.credits);
        });
    }
});
}

//get information about the poll. This will return info like the poll ID, title, status, the poll choices and the choice IDs, numbers, and labels.
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

//**NOTE ** - THIS FUNCTION IS NO LONGER USED AFTER MOVING THE CHARTING TO GOOGLE
//makes an api call to get/update the chart with the current poll results, this call returns a url to the chart which is subsequently stored in the pollId
//object so the chart can continue to be displayed wihout needing to make a call.
//**NOTE - THIS CALL COSTS 10 CREDITS **
/*
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
*/

//**NOTE ** - THIS FUNCTION IS NO LONGER USED AFTER MOVING THE CHARTING TO GOOGLE
//function to add an img element to the chart-container div, displaying the current chart image from the pollId.chartUrl
/*
var displayChart = function () {
    chartConEl.innerHTML = "";
    if (pollId.chartUrl) {
        var chartEl = document.createElement("img");
        chartEl.src = pollId.chartUrl;
        chartConEl.appendChild(chartEl);
    }
}
*/

//this function updates the pollId object with the current open poll. it first calls the api to find all of the polls associated with the apiKey, then
//finds the poll with poll_status: OPEN. it then saves that poll's id and title, and poll_status and then calls the api to get a list of choices associated
//with the open poll. it then iterates through the returned poll choices and pushes each choice to the pollId.choices[] array. 
//finally, it saves the new pollId object to localStorage so we can work off of that data
//locally until the poll changes/closes.


//This will close the currently open poll. it assumes there is only one poll with OPEN status at a time
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
                //if response.ok then the delete was successful, then update the results and the chart showing the now empty poll/chart
                console.log("Poll Reset");
                getResults();
                drawBasic();
        }
    });
}


//functions to call every time the program loads
loadPollId();

//event listeners
//infoBtnEl.addEventListener("click", getPollInfo);
//btnConEl.addEventListener("click", vote);
//credBtnEl.addEventListener("click", creditCheck);
//getChartEl.addEventListener("click", getChart);
//getResEl.addEventListener("click", getResults);
//updateEl.addEventListener("click", updatePollId);
//closeEl.addEventListener("click", closePoll);
//showChartEl.addEventListener("click", displayChart);
//resetEl.addEventListener("click", deleteVotes);
donateBtnEl.addEventListener("click", vote);