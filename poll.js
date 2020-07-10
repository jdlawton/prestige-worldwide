var apiKey = "LOL, NO";

var infoBtnEl = document.querySelector("#poll-info");
var credBtnEl = document.querySelector("#credit-info");
var btnConEl = document.querySelector("#button-container");

var pollId = {
    id: "",
    title: "",
    poll_status: "",
    choices: []
}

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
            console.log(data);
        });
    }
});
}

//request account infomration from api
//testapi();

//get information about the poll
var getPollInfo = function () {
    fetch("https://api.open-agora.com/polls/Pyn0FYhq8H?api_token=" + apiKey).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        }
    });
}

var vote = function (event) {
    //console.log(event.target);
    var buttonId = event.target.textContent;
    //console.log(userVote);
    //console.log("inside vote. voting for: " + userVote);
    buttonId = buttonId.split(" ");
    //console.log(userVote[0]);
    //console.log(userVote[1]);
    var buttonNum = parseInt(buttonId[1]);

    /*switch (voteChoice) {
        case 1:
            console.log("Switch: vote 1");
            break;
        case 2:
            console.log("Switch: vote 2");
            break;
        case 3:
            console.log("Switch: vote 3");
            break;
        case 4:
            console.log("Switch: vote 4");
            break;
        case 5:
            console.log("Switch: vote 5");
            break;
        case 6:
            console.log("Switch: vote 6");
            break;
        case 7:
            console.log("Switch: vote 7");
            break;
        case 8:
            console.log("Switch: vote 8");
            break;
        case 9:
            console.log("Switch: vote 9");
            break;
        case 10:
            console.log("Switch: vote 10");
            break;

    }*/

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

var savePollId = function () {
    localStorage.setItem("pollId", JSON.stringify(pollId));
    console.log(pollId);
};

var dummySave = function () {
    pollId.id = "Pyn0FYhq8H";
    pollId.title = "Test Poll";
    pollId.poll_status = "OPEN";
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
    console.log(pollId);
    savePollId();
}

var loadPollId = function () {
    pollId = JSON.parse(localStorage.getItem("pollId"));
    if (!pollId) {
        pollId = {
            id: "",
            title: "",
            poll_status: "",
            choices: []
        };
    }

    console.log (pollId);
}

//dummySave();
loadPollId();

//event listeners
infoBtnEl.addEventListener("click", getPollInfo);
btnConEl.addEventListener("click", vote);
credBtnEl.addEventListener("click", creditCheck);
