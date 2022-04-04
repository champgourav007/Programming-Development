var storedTodos = []
var textBox = document.getElementById("text-box");
init();

function init(){
    textBox.addEventListener("keydown", eventHandler);
}

function createTodo(value){
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
    deleteButton.setAttribute("id", "delete-button");
    deleteButton.setAttribute("onclick", "deleteButton(this)");
    readButton.setAttribute("id", "read-button");
    readButton.setAttribute("onclick", "readButton(this)");
    taskHeading.innerHTML = value;
    return container;
}

function eventHandler( event ){
    var code = event.code;
    var todoBox = document.getElementById("text-box");
    var value = todoBox.value;

    if(code === "Enter" && value != ""){
        event.preventDefault();
        container = createTodo(value);
        storedTodos.push(value);
        localStorage.setItem("todos", JSON.stringify(storedTodos));
        var leftDiv = document.getElementById("left-div");
        leftDiv.appendChild(container);
        todoBox.value = "";
    }
}

function deleteButton(event){
    var parent = event.parentElement.children;
    var text = parent[0].innerHTML;
    var todos = JSON.parse(localStorage.getItem("todos"));
    var index = todos.indexOf(text);
    todos.splice(index, 1);
    localStorage.clear();
    localStorage.setItem("todos", JSON.stringify(todos));
    event.parentElement.remove();

}

function readButton(event){
    var parent = event.parentElement.children;
    console.log(parent);
    textBox.value = parent[0].innerHTML;
    deleteButton(event);
}

var storedTodos = JSON.parse(localStorage.getItem("todos"));
if(storedTodos.length != 0){
    for(var i = 0; i < storedTodos.length; i++){
        container = createTodo(storedTodos[i]);
        var leftDiv = document.getElementById("left-div");
        leftDiv.appendChild(container);
    }
}