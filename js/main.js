async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html" & nav.html
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

let dateInput;
let today = new Date().toISOString().split('T')[0];
let userToTask = [];
let categoryToTask = [];
let prioToTask = [];
let colors = ["8AA4FF", "FF0000", "2AD300", "FF7A00", "E200BE", "0038FF"];
let selectedColor = [];
let categories = [];
let subtaskToTask = [];
let printTask = [];

const getDoc = function (id) {
  return document.getElementById(`${id}`);
}

//////////////////////////////////////////////////////////////////////////////////////////// --add functions--
/**
 * adds the task to the board and checks if inputs are missing
 */
async function addToBoard() {
  InputForTask(selectedState);
  if( noContactIsSelected() == false || noCategoryIsSelected() == false || noPriorityIsSelected() == false ) 
   return 
   pushTask();
  
}

/**
 * handles the push for each card created, depending on which page the user is at it will either guide the user to the board page else it will just update and close the add task sidebar
 */
async function pushTask() {
  task_cards.push(printTask[0]);
    clearInputs();
    await saveTaskToServer();
    showAnim();
    if(board === "board.html") {
      clearInputs();
      openAddTask();
      updateHTML();
    } else {
      setTimeout(function() {window.location.href = "board.html";}, 1500);
    }
}


/**
 * fills out the JSON and provides a JSON Array filled out by the user for the final push 
 */
function InputForTask(state) {
  let assignee = userToTask;
  let category = categoryToTask;
  let priority = prioToTask;
  let subtasks = subtaskToTask;
  let task = cardAsJSON(state, assignee, category, priority, subtasks);
  printTask = [];
  printTask.push(task);
}


/**
 * This JSON is responsible for the task card creation, it will print out the provided data by the user
 */
function cardAsJSON(state, assignee, category, priority, subtasks) {
  let title = getDoc("title");
  let description = getDoc("description");
  let date = getDoc("date");
  let task_card_data = {
    "state": state,
    "category": category,
    "date": date.value,
    "declaration-header": title.value,
    "declaration-text": description.value,
    "assignees": assignee,
    "priority": priority,
    "subtasks": subtasks
  }; return task_card_data;
}

/**
 * Adds a new subtask to the task and renders the subtasks.
 * @function addSubtask
 */
function addSubtask() {
  let subtaskList = getDoc("subtask-body");
  let subtask = getDoc("subTask");  
  let subtaskForPrint = {
    "checkState": false,
    "task": subtask.value
  }
  subtaskToTask.push(subtaskForPrint);
  subtaskList.innerHTML = "";
  subtaskList.innerHTML = subtaskTemplate();
  renderSubtasks();
}

/**
 * Renders the subtasks in the subtask container.
 * @function renderSubtasks
 */
function renderSubtasks() {
  let container = getDoc('subTaskContainer');
  container.innerHTML = "";
  for (let i = 0; i < subtaskToTask.length; i++) {
    const image = subtaskToTask[i];
    container.innerHTML += `
      <div class="subtask-content">
        <img id="box${i}" onclick="check(${i})" src="./img/icons/empty checkbox.png">${image.task}
      </div>
  `;
  }
}

/**
 * Renders the list of selected users in the overlay.
 * @function renderSelectedUsers
 */
function renderSelectedUsers() {
  let list = getDoc('selected-users');
  list.innerHTML = "";
  for (let i = 0; i < userToTask.length; i++) {
    const element = userToTask[i];
    list.innerHTML += `<div class="add-task-overlay-assignee">
                         <div class="overlay-assginee-img fm-inter-400" style="background: ${element["userColor"]}">${element["userInits"]}</div>
                       </div>`;
  }
}

/**
 * Toggles the state of a subtask check box and updates the check state of the corresponding subtask.
 * @function check
 * @param {number} ID - The ID of the subtask to toggle the check box for.
 */
function check(ID) {
  let subtask = subtaskToTask[ID];
  const image = document.getElementById('box' + ID);
  const source = image.attributes[2];
  if(source.nodeValue == './img/icons/empty checkbox.png') {
    source.nodeValue = './img/icons/checked box.png'
    subtask.checkState = true;
  } else {
    source.nodeValue = './img/icons/empty checkbox.png'
    subtask.checkState = false;
  }
}


/**
 * adds a category to the task JSON creating the cardAsJSON format 
 */
function addCategory(elemcolor, ID) {
  let name = getDoc('cat-name' + ID).innerHTML;
  let color = elemcolor;
  let category = {
    "ID": ID,
    "name": name,
    "color": color,
  };
  validate(category);
}


/**
 * Checks if a category is already selected. If already selected it clears out the array and pushes the newly selected category 
 */
function validate(category) {
  if (categoryToTask.length <= 0) {
    categoryToTask.push(category);
    resetList(category);
  } else {
    categoryToTask = [];
    categoryToTask.push(category);
    resetList(category);
  }
}


/**
 * adds a new category chosen by the user
 */
async function addNewCategory() {
  let name = getDoc('new-cat-name');
  let color =  selectedColor[0];

  let newCategory = {
    "ID": categories.length,
    "name": name.value,
    "color": color,
  };

  if (color == undefined) {
    alert("please select a color")
    return
  }

  pushCat(newCategory);
}

/**
 * pushes the category after validation
 */
async function pushCat(newCategory) {
  categories.push(newCategory);
  categoryToTask.push(newCategory);
  await saveCatToServer();
  resetList(newCategory);
}

/**
 * this function lets the user choose a color background for new categories
 */
function addColor(color, ID) {
  let selection = getDoc('color' + ID);

  selectedColor = [];
  selectedColor.push(color);
  clearCLassList();
  selection.classList.add('shadow');
}

/**
 * adds selected user to userToTask which is the array that holds the assigned contacts for the task card if a user already exists it will be equalized so no doubles exist
 */
function addUserToTask(ID) {
  let users = contacts[ID];

  if (userToTask.indexOf(users) > -1) {
    userToTask.splice(userToTask.indexOf(users), 1);
  } else {
    userToTask.push(users);
  }
  renderSelectedUsers();
}


/**
 * Depending on which priority is selected it toggles off the other 2 remaining priorities and sets the style accordingly
 */
function selectPrio(ID, imgID, background, after, before, prioRestA, prioRestAcolor, prioRestB, prioRestBcolor) {
  let image = getDoc(imgID);
  getDoc(prioRestA + "-img").src = `./img/icons/${prioRestAcolor}.png`;
  getDoc(prioRestB + "-img").src = `./img/icons/${prioRestBcolor}.png`;
  select(ID, background, after, before, prioRestA, prioRestB, image);
}


/**
 * belongs to selectPrio function
 */
 function select(ID, background, after, before, prioRestA, prioRestB, image) {
   getDoc(ID).classList.add(background);
   image.src = `./img/icons/${after}.png`;
   getDoc(prioRestA).classList = prioRestA, "fm-OpenSA-400";
   getDoc(prioRestB).classList = prioRestB, "fm-OpenSA-400";
   prioToTask = [];
   prioToTask.push(ID);
 }

//////////////////////////////////////////////////////////////////////////////////////////// --render functions--

function renderPriorities() {
    let prio = getDoc('priorities');
    prio.innerHTML += generatePrioHTML();
}

function renderPrioritiesAT() {
  let prio = getDoc('prioritiesAT');
  prio.innerHTML += generatePrioHTML();
}

/**
 * Renders the contact list dropdown and adds it to the page.
 * @function renderContactList
 */
function renderContactList() {
  let dropdown = getDoc("contact-list");
  dropdown.innerHTML = "";
  if(contacts == []) {
    dropdown.innerHTML += newContactAddTemplate();
  } else {
    dropdown.innerHTML += newContactAddTemplate();
    for (let i = 0; i < contacts.length; i++) {
      const elem = contacts[i];
      // handle for 0 contacts
      dropdown.innerHTML += contactTemplate(elem, i);
    }
  }
  saveTaskToServer();
}

function resolveCheckedState() {
  for (let i = 0; i < contacts.length; i++) {
    const elem = contacts[i];

    if (userToTask.indexOf(elem) > -1) {
      document.getElementById('checkboxID' + i).checked = true;
    }
  }
}

/**
 * Renders the category color bar and adds it to the page.
 * @function renderCatColors
 */
function renderCatColors() {
  let colorbar = getDoc('cat-colors');
  let ID = -1;
  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];
    ID++;
    colorbar.innerHTML += /*html*/` <div id="color${ID}" class="category-color" style="background: #${color}" onclick="addColor('${color}', ${ID})"></div>`;
  }
}

/**
 * Renders the category list and adds it to the page.
 * @function renderCategoryList
 */
function renderCategoryList() {
  let list = getDoc("categories");
  list.innerHTML = "";
  if (categories == []) {
    list.innerHTML += newCategoryTemplate();
  } else {
    list.innerHTML += newCategoryTemplate();
    for (let i = 0; i < categories.length; i++) {
      const elem = categories[i];
      list.innerHTML += categoryTemplate(elem);
    }
  }
}

////////////////////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////////////////// --MISC--

/**
 * Checks if a contact is selected for the task, and displays an alert if no contact is selected.
 * @function noContactIsSelected
 * @returns {boolean} Returns false.
 */
function noContactIsSelected() {
  if (userToTask.length == 0) {
    alert("Please select a contact")
    return false;
  }
}

/**
 * Checks if a priority is selected for the task, and displays an alert if no priority is selected.
 * @function noPriorityIsSelected
 * @returns {boolean} Returns false.
 */
function noPriorityIsSelected() {
  if (prioToTask.length == 0) {
    alert("Please select a priority")
    return false;
  } 
}

/**
 * Checks if a category is selected for the task, and displays an alert if no category is selected.
 * @function noCategoryIsSelected
 * @returns {boolean} Returns false.
 */

function noCategoryIsSelected() {
  if(categoryToTask.length == 0) { 
    alert("Please select a category");
    return false;
  } 
}

/**
 * Validates the date input for the task and displays a message if the input date is earlier than the current date.
 * @function validateDate
 */
function validateDate(){
dateInput = document.getElementById("date").value;
if(dateInput < today){
  document.getElementById("date-check").classList.remove("d-none");
  document.getElementById("date-check").innerHTML = "Wrong Date";
}else if(document.getElementById("date-check").innerHTML === "Wrong Date" && dateInput >= today)
document.getElementById("date-check").classList.add("d-none");
}
