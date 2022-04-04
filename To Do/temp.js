var todos = [];
var counter = 0;
function init(){
    var leftPanelDiv = document.createElement("div");
    var rightPanelDiv = document.createElement("div");
    leftPanelDiv.setAttribute("id","leftDiv");
    var heading = document.createElement("h1");
    leftPanelDiv.appendChild(heading);

    var subheading = document.createElement("h3");
    heading.appendChild(subheading);
    subheading.innerHTML = "Add Task by typing on right side and Press Enter";
    rightPanelDiv.setAttribute("id", "rightDiv");

    var parent = document.body;
    parent.appendChild(leftPanelDiv);
    parent.appendChild(rightPanelDiv);

    var inputTodo = document.createElement("textarea");
    inputTodo.setAttribute("placeholder", "Enter Something");
    inputTodo.setAttribute("id", "inputbox");
    rightPanelDiv.appendChild(inputTodo);
    inputTodo.addEventListener("keydown", eventHandler);

}

function eventHandler( event ){
    var code = event.code; // 'keyCode' is depreciated so we use 'code'
    var todoBox = document.getElementById("inputbox");
    var value = todoBox.value;

    if(code === "Enter" && value != ""){
        event.preventDefault(); //it will prevent from automatic enter performed

        var container = document.createElement("div");
        var taskHeading = document.createElement("p");
        var readButton = document.createElement("button");
        var deleteButton = document.createElement("button");

        container.appendChild(taskHeading);
        container.appendChild(readButton);
        container.appendChild(deleteButton);
        container.setAttribute("class", "todoContainer");
        readButton.innerHTML = "Read";
        deleteButton.innerHTML = "Delete";
        taskHeading.innerHTML = value;
        todos.push(value);
        localStorage.setItem("todos", JSON.stringify(todos));
        var leftDiv = document.getElementById("leftDiv");
        leftDiv.appendChild(container);
        todoBox.value = ""; // This will remove the typed content in text area box
    }
}

init();

//in localStorage the data is stored in key value pairs and when we get
//the saved data. But while getting the data it will return in form of string
//so to store the data in required datatypes so we have to convert or stringify
//the data using JSON. 
let storedTodos = localStorage.getItem("todos");
if(storedTodos !== null){
    todos = JSON.parse(storedTodos);
}

todos.forEach(value => {
 

    var container = document.createElement("div");
    var taskHeading = document.createElement("p");
    var readButton = document.createElement("button");
    var deleteButton = document.createElement("button");

    container.appendChild(taskHeading);
    container.appendChild(readButton);
    container.appendChild(deleteButton);
    container.setAttribute("class", "todoContainer");
    readButton.innerHTML = "Read";
    readButton.setAttribute("id", "read-button");
    deleteButton.innerHTML = "Delete";
    deleteButton.setAttribute("id", "delete-button");

    taskHeading.innerHTML = value;
    
    var leftDiv = document.getElementById("leftDiv");
    leftDiv.appendChild(container);
    // todoBox.value = ""; // This will remove the typed content in text area box 
});


var deleteButton = document.getElementById("delete-button");
deleteButton.addEventListener("click", function(event){
    var parent = deleteButton.parentNode;
    var text =  parent.children[0].innerHTML;
    var index = todos.indexOf(text);
    todos.splice(index, 1);
    localStorage.clear();
    localStorage.setItem("todos", JSON.parse(todos));
    deleteButton.parentElement.remove();
});

