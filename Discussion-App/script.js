var rightSubjectNode = document.getElementById("subject");
var rightQuestionNode = document.getElementById("question");
var rightSubmitButton = document.getElementById("submitBtn");
var leftDataListNode = document.getElementById("dataList");
var rightPanelNode = document.getElementById("toggleDisplay");
var resolveHolderNode = document.getElementById("resolveHolder");
var rightResponseQuestionNode = document.getElementById("respondQue");
var rightResponseAnswerNode = document.getElementById("respondAns");
var rightCommentHolderNode = document.getElementById("commentHolder")
var commentatorName = document.getElementById("pickName");
var commentatorComment = document.getElementById("pickComment");
var commentButton = document.getElementById("commentBtn");
var questionSearchNode = document.getElementById("questionSearch");
var upvoteButton = document.getElementById("upvote");
var downvoteButton = document.getElementById("downvote");
var resolveBtn = document.getElementById("resolveBtn");
var upvoteValueNode = document.getElementById("upvoteValue");
var downvoteValueNode = document.getElementById("downvoteValue");
var newQuestionFormButton = document.getElementById("newQuestionForm");



//search listen event
questionSearchNode.addEventListener("input", searchQuestion);

//search the question
function searchQuestion(){
    var searchedElement = questionSearchNode.value;
    let flag = 0;
    allQuestions = savedQuestions();
    if(searchedElement){
        leftDataListNode.innerHTML = "";
        allQuestions.forEach((question)=>{
            if((question.title).includes(searchedElement)){
                createQuestionList(question, 1);
                flag = 1;
            }
        });
        if(flag == 0){
            var q = {
                title : "No data found!",
                description : ""
            }
            createQuestionList(q, 2);
        }

    }
    else{
        leftDataListNode.innerHTML = "";
        init();
    }
}

//main function
function init(){
    let allSavedQuestions = sortTheQuestionList();
    if(allSavedQuestions != []){
        allSavedQuestions.forEach(function(question) {
            createQuestionList(question, 1);
        });
    }
}
init();

rightSubmitButton.addEventListener("click", onSaveQuestion);


//onsubmit listener 
function onSaveQuestion(){
    let question ={
        questionId : createId(),
        title : rightSubjectNode.value,
        description : rightQuestionNode.value,
        responses : [],
        upvote : 0,
        downvote : 0,
        timestamp : (new Date()),
        favorite : false,
    };
    removeInput();
    if(question.title != "" && question.description != "")
    {
        createQuestionList(question, 1);
        saveIntoLocalStorage(question);
    }
}

function removeInput(){
    rightSubjectNode.value = "";
    rightQuestionNode.value = "";
}

function createId(){
    const d = new Date();
    let id = d.getDate().toString() + d.getMonth().toString() + d.getFullYear().toString() + d.getTime().toString();
    return id;
}

//create the container for question on left side
function createQuestionList(question, flag){
    var questionContainer = document.createElement("div");
    questionContainer.style.backgroundColor = "white";
    var questionTitle = document.createElement("h3");
    questionContainer.setAttribute("id", `${question.questionId}`);
    var questionDescription = document.createElement("p");
    if(flag == 1)
    {

        var timestampNode = document.createElement("span");
        var favoriteBtn = document.createElement("button");
        favoriteBtn.innerHTML = "Favorite";
        favoriteBtn.style.float = "right";
        timestampNode.innerHTML = timeAgo(question.timestamp);
        timestampNode.style.fontSize = "9px";
        timestampNode.style.float = "right";
        questionContainer.appendChild(favoriteBtn);
        favoriteBtn.onclick = addToFavorite(question);
    }
    questionTitle.innerHTML = question.title;
    questionDescription.innerHTML = question.description;
    questionContainer.appendChild(questionTitle);
    if(flag == 1)
    {
        questionContainer.appendChild(timestampNode);
    }
    questionContainer.appendChild(questionDescription);

    leftDataListNode.appendChild(questionContainer);

    questionContainer.addEventListener("click", onQuestionClick(question));

    
}

//listener onclick on datalist of question on left side
function onQuestionClick(question){
    return function(){
        hideRightPanel();
        showRightSide();
        rightResponseQuestionNode.innerHTML = "";
        rightResponseAnswerNode.innerHTML = "";
        showQuestionOnRightPanel(question);
        showResponses(question);
        showVotes(question);
        commentButton.onclick = saveResponses(question);
        upvoteButton.onclick = onUpvoteClick(question);
        downvoteButton.onclick = onDownvoteClick(question);
        resolveBtn.onclick = onResolvecClick(question);
    }
}

function showVotes(question){
    let allQuestions = savedQuestions();
    allQuestions.forEach(element => {
        if(element.questionId == question.questionId){
            upvote = element.upvote;
            downvote = element.downvote;
        }
    });
    showUpvoteValue(upvote);
    showDownvoteValue(downvote);
}

function showRightSide(){
    resolveHolderNode.style.display = "block";
    rightCommentHolderNode.style.display = "block";
    rightResponseQuestionNode.style.display = "block";
    rightResponseAnswerNode.style.display = "block";
}

//it  will hide the right panel
function hideRightPanel(){
    rightPanelNode.style.display = "none";
}

//show question on right panel
function showQuestionOnRightPanel(question){
    var questionNode = document.createElement("div");
    var questionHeader = document.createElement("h2");
    questionHeader.innerHTML = "Question";
    var questionTitle = document.createElement("h3");
    var questionDescription = document.createElement("p");
    questionTitle.innerHTML = question.title;
    questionDescription.innerHTML = question.description;
    questionNode.appendChild(questionTitle);
    questionNode.appendChild(questionDescription);
    rightResponseQuestionNode.appendChild(questionHeader);
    rightResponseQuestionNode.appendChild(questionNode);
}

var responseListNode = document.createElement("div");

//check for the comments
function showResponses(question){
    var responsesTitle =  document.createElement("h2");
    responsesTitle.innerHTML = "Responses";
    rightResponseAnswerNode.appendChild(responsesTitle);
    if((question.responses).length != 0){
        question.responses.forEach(function(response){
            console.log(response);
            createResponsesList(response);
        })
    }
    else{
        responseListNode.innerHTML = "No Responses!!";
        rightResponseAnswerNode.appendChild(responseListNode);
    }
}

//append all the comments
function createResponsesList(response){
    responseListNode.innerHTML = "";
    var commentNodeList = document.createElement("div");
    var nameNode = document.createElement("h3");
    var commentNode = document.createElement("p");
    var timestampNode = document.createElement("span");
    timestampNode.innerHTML = timeAgo(response.timestamp);
    timestampNode.style.fontSize = "9px";
    timestampNode.style.float = "right";
    nameNode.innerHTML = response.title;
    commentNode.innerHTML = response.comment;
    commentNodeList.appendChild(nameNode);
    commentNodeList.appendChild(timestampNode);
    commentNodeList.appendChild(commentNode);
    rightResponseAnswerNode.appendChild(commentNodeList);
}

//save data in local storage
function saveIntoLocalStorage(question){
    let allQuestions = savedQuestions();
    allQuestions.push(question);
    localStorage.setItem("questions", JSON.stringify(allQuestions));
}

//check for all saved questions
function savedQuestions(){
    let allQuestions = localStorage.getItem("questions");
    if(allQuestions){
        return JSON.parse(allQuestions);
    }
    else{
        return [];
    }
}


//it save the responses in the localstorage
function saveResponses(question){
    return function(){
        let response = {
            title : commentatorName.value,
            comment : commentatorComment.value,
            timestamp : (new Date()),
        }
        if(response.title.length > 0 && response.comment.length > 0){
            createResponsesList(response);
            question.responses.push(response);
            let allQuestions = savedQuestions();
            const key = question.questionId;
            console.log(question,key);
            let allNonRepondedQuestion = allQuestions.filter(element => {
                if(element.questionId != key){
                    return true;
                }
            });
            allNonRepondedQuestion.push(question);
            localStorage.clear();
            localStorage.setItem("questions", JSON.stringify(allNonRepondedQuestion));
            removeResponseInputs();
        }
    }
}

function removeResponseInputs(){
    commentatorComment.value = "";
    commentatorName.value = "";
}

//listener to upvote
function onUpvoteClick(question){
    return ()=>{
        var allQuestions = savedQuestions();
        if( allQuestions.length ){
            var finalQuestions = allQuestions.filter((ques)=>{
                if(ques.questionId != question.questionId){
                    return true;
                }
            });
            localStorage.clear();
            var upvotedQuestion = allQuestions.filter((ques)=>{
                if(ques.questionId == question.questionId){
                    return true;
                }
            });
            upvotedQuestion[0].upvote = upvotedQuestion[0].upvote + 1;
            showUpvoteValue(upvotedQuestion[0].upvote);
            finalQuestions.push(upvotedQuestion[0]);
            localStorage.setItem("questions", JSON.stringify(finalQuestions));
        }
    }
}

//listener to downvote
function onDownvoteClick(question){
    return ()=>{
        var allQuestions = savedQuestions();
        if( allQuestions.length ){
            var finalQuestions = allQuestions.filter((ques)=>{
                if(ques.questionId != question.questionId){
                    return true;
                }
            });
            localStorage.clear();
            var downvotedQuestion = allQuestions.filter((ques)=>{
                if(ques.questionId == question.questionId){
                    return true;
                }
            });
            downvotedQuestion[0].downvote = downvotedQuestion[0].downvote + 1;
            showDownvoteValue(downvotedQuestion[0].downvote);
            finalQuestions.push(downvotedQuestion[0]);
            localStorage.setItem("questions", JSON.stringify(finalQuestions));
        }
    }
}



function onResolvecClick(question){
    return ()=>{
        removeFromList(question);
        removeFromLocalStorage(question);
    }
}

function removeFromLocalStorage(question){
    var allQuestions = savedQuestions();
    finalQuestionList = allQuestions.filter(function(element){
        if(element.questionId != question.questionId){
            return true;
        }
    })
    localStorage.clear();
    console.log(finalQuestionList);
    localStorage.setItem("questions", JSON.stringify(finalQuestionList));
}

function removeFromList(question){
    var questionListNode = document.getElementById(`${question.questionId}`);
    console.log(questionListNode);
    questionListNode.remove();
    hideRightQuestion();
}

function hideRightQuestion(){
    rightPanelNode.style.display = "block";
    resolveHolderNode.style.display = "none";
    rightCommentHolderNode.style.display = "none";
    rightResponseQuestionNode.style.display = "none";
    rightResponseAnswerNode.style.display = "none";
}

function showUpvoteValue(upvote){
    upvoteValueNode.innerHTML = upvote;
}

function showDownvoteValue(downvote){
    downvoteValueNode.innerHTML = downvote;
}

newQuestionFormButton.addEventListener("click", function(){
    hideRightQuestion();
})

function sortTheQuestionList(){
    let allQuestions = savedQuestions();
    allQuestions.sort(function(a,b){
        return b.upvote - a.upvote;
    })
    return allQuestions;
}



const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];


function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  let minutes = date.getMinutes();

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${ minutes }`;
  }

  if (prefomattedDate) {
    // Today at 10:20
    // Yesterday at 10:20
    return `${ prefomattedDate } at ${ hours }:${ minutes }`;
  }

  if (hideYear) {
    // 10. January at 10:20
    return `${ day }. ${ month } at ${ hours }:${ minutes }`;
  }

  // 10. January 2017. at 10:20
  return `${ day }. ${ month } ${ year }. at ${ hours }:${ minutes }`;
}


// --- Main function
function timeAgo(dateParam) {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();


  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${ seconds } seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${ minutes } minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, 'Today'); // Today at 10:20
  } else if (isYesterday) {
    return getFormattedDate(date, 'Yesterday'); // Yesterday at 10:20
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January at 10:20
  }

  return getFormattedDate(date); // 10. January 2017. at 10:20
}

function addToFavorite(question){
    return ()=>{
        console.log(question);
        if(question.favorite){
            question.favorite = false;
        }
        else{
            question.favorite = true;
        }
        changeFavoriteColor(question);
        localStorage.clear();
        let allQuestions = savedQuestions();
        let remQuestions = allQuestions.filter(function(que){
            if(que.questionId != question.questionId){
                return true
            }
        });
        console.log(remQuestions);
        remQuestions.push(question);
        localStorage.setItem("questions",JSON.stringify(remQuestions));
    }
}

function changeFavoriteColor(question){
    var favoriteBtn = document.getElementById(`${question.questionId}`).children[0];
    if(question.favorite){
        favoriteBtn.style.backgroundColor = "blue";
    }
    else{
        favoriteBtn.style.backgroundColor = "white";
    }
}