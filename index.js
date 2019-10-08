let modal = document.getElementById("modal");
let btnCreate = document.getElementById("btnCreate");
let inputSearch = document.getElementById("inputSearch");
let btnSearch = document.getElementById("btnSearch");
let btnReset = document.getElementById("btnReset");

const priorityWeights = {
    'low': 3,
    'middle': 2,
    'high': 1,
}

btnSearch.onclick = renderItems;

btnReset.onclick = function () {
    inputSearch.value = "";
    renderItems();
}


btnCreate.onclick = function () {
    modal.style.display = "flex";
    renderForm({
        id: Date.now(),
        title: "",
        description: "",
        priority: "",
        deadline: "",
        completed: false
    }, false);
};

function closeForm() {
    modal.style.display = "none";
}

window.onload = renderItems;

function updateToDos(toDoList) {
    localStorage.setItem("toDo-list", JSON.stringify(toDoList));
    renderItems();
}

function loadToDos() {
    return JSON.parse(localStorage.getItem("toDo-list") || "[]");
}

function renderForm(toDo, edit) {

    modal.innerHTML = `
<div id="modal-content" class="modal-content">
    <div class="modal-caption">
        <h3>${edit ? "Edit toDo" : "Add To-Do item"}</h3>
        <i class="fas fa-times" id="cancel" onclick="closeForm()"></i>
    </div>
    <form id="toDoList" action="#">
        <div class="modal-form" onsubmit="return false;">
            <input value="${toDo.title}" placeholder="Name *" type="text" name="title" maxlength="20"
            autofocus required>
            <input placeholder="Description" value="${toDo.description}" type="text" name="description">
            <select name="priority" id="priority" required>
                <option value="" hidden>Priority *</option>
                <option class="low" value="low" ${toDo.priority !== "low" || "selected"}>Low</option>
                <option class="middle" value="middle" ${toDo.priority !== "middle" || "selected"}>Middle</option>
                <option class="high" value="high" ${toDo.priority !== "high" || "selected"}>High</option>
            </select>
            <input value="${toDo.deadline}" type="date" name="deadline">
        </div>
        <div class="modal-footer">
            <button type="reset" id="cancel" onclick="closeForm()">Cancel</button>
            <button type="submit" id="add">Add</button>
        </div>
    </form>
</div>
    `;

    modal.querySelector("form").onsubmit = () => submitForm(toDo);
}

function renderItems() {
    let listOfItems = document.getElementById("listOfItems");
    listOfItems.innerHTML = "";

    let toDosTmp = loadToDos();
    let toDos = [];

    if (inputSearch.value !== '') {
        toDosTmp.forEach((item) => {
            if (item.title.search(inputSearch.value) >= 0 || item.description.search(inputSearch.value) >= 0 || item.priority.search(inputSearch.value) >= 0) {
                toDos.push(item);
            }
        })
    } else {
        toDos = toDosTmp;
    }

    toDos.sort((x, y) => {
        let done = (x.done === y.done) ? 0 : x.done ? 1 : -1;
        if (done !== 0) {
            return done;
        }

        return priorityWeights[x.priority] - priorityWeights[y.priority];
    });

    // 2 ways fo sort

    // return priorityWeights[item1.priority] - priorityWeights[item2.priority]

    // if (priorityWeights[item1.priority] === priorityWeights[item2.priority]) {
    //     return 0
    // }
    // if (priorityWeights[item1.priority] > priorityWeights[item2.priority]) {
    //     return 1
    // }
    // if (priorityWeights[item1.priority] < priorityWeights[item2.priority]) {
    //     return -1
    // }

    toDos.forEach((item) => {
        const div = document.createElement("div");
        div.innerHTML = `
            <p>${item.title}</p>
            <p>${item.description}</p>
            <p class="${item.priority}">${item.priority}</p>
            <p>${item.deadline}</p>
            <div class="toDoFooter">
            <button id="close" onclick="deleteItem(${item.id})">Delete</button>
            <button onclick="switchDone(${item.id})">
                ${item.done ? "Mark as undone" : "Mark as done"}
            </button>
                ${item.done ? "" : `<button onclick="editItem(${item.id})">Edit</button>
`}
        </div>           
`;

        div.className = "toDo";
        if (item.done) {
            div.className += " done";
        }
        listOfItems.appendChild(div);
    });
}

// PUT DEL TAG
function switchDone(id) {
    // id toDo-шки

    const toDoList = loadToDos();
    const toDo = toDoList.find((item) => (item.id === id));
    toDo.done = !toDo.done;

    updateToDos(toDoList);
    renderItems();
}

function editItem(id) {
    const toDoList = loadToDos();
    const toDo = toDoList.find((item) => (item.id === id));

    renderForm(toDo, true);

    modal.style.display = "flex";
}

function deleteItem(id) {
    const newtoDoList = loadToDos().filter((item) => (item.id !== id));
    updateToDos(newtoDoList);
}

function submitForm(toDo) {
    const form = document.getElementById("toDoList");

    toDo.title = form["title"].value;
    toDo.description = form["description"].value;
    toDo.priority = form["priority"].value;
    toDo.deadline = form["deadline"].value;

    const toDoList = loadToDos();

    const oldIndex = toDoList.findIndex((item) => (item.id === toDo.id));

    if (oldIndex >= 0)
        toDoList[oldIndex] = toDo;
    else
        toDoList.push(toDo);

    updateToDos(toDoList);

    modal.style.display = "none";

    return false;
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};