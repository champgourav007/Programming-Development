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
                createQuestionList(question);
                flag = 1;
            }
        });
        if(flag == 0){
            var q = {
                title : "No data found!",
                description : ""
            }
            createQuestionList(q);
        }

    }
    else{
        leftDataListNode.innerHTML = "";
        init();
    }
}

//main function
function init(){
    let allSavedQuestions = savedQuestions();
    if(allSavedQuestions != []){
        allSavedQuestions.forEach(function(question) {
            createQuestionList(question);
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
        downvote : 0
    };
    removeInput();
    if(question.title != "" && question.description != "")
    {
        createQuestionList(question);
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
function createQuestionList(question){
    var questionContainer = document.createElement("div");
    questionContainer.style.backgroundColor = "white";
    var questionTitle = document.createElement("h3");
    questionContainer.setAttribute("id", `${question.questionId}`);
    var questionDescription = document.createElement("p");
    questionTitle.innerHTML = question.title;
    questionDescription.innerHTML = question.description;
    questionContainer.appendChild(questionTitle);
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
    nameNode.innerHTML = response.title;
    commentNode.innerHTML = response.comment;
    commentNodeList.appendChild(nameNode);
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
            comment : commentatorComment.value
        }
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
                    return true
                }
            });
            localStorage.clear();
            var upvotedQuestion = allQuestions.filter((ques)=>{
                if(ques.questionId == question.questionId){
                    return true
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
                    return true
                }
            });
            localStorage.clear();
            var downvotedQuestion = allQuestions.filter((ques)=>{
                if(ques.questionId == question.questionId){
                    return true
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