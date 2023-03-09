async function initB() {
  await downloadFromServer();
  task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  categories = (await JSON.parse(backend.getItem("categories"))) || [];
  updateHTML();
  checkNav();
}

setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");

let task_cards = [];

let completedSubtasks = [];

let result = [];

let card_states = ["to_do", "in_progress", "await_feedback", "done"];

let board = "board.html";

let currentDraggedCard;

let currentState;

//////////////////////////////////////////////////////////////////////////////////////////// --add functions--

/**
 * Initializes the application by downloading data from the server, parsing it from the backend, and updating the HTML and navigation.
 * @async
 * @function
 * @returns {Promise<void>}
 */
function checkNav() {
  const intervalId = setInterval(() => {
    if (document.getElementById('summary-html')) {
      navLoaded = true;
      markBoardNav();
      clearInterval(intervalId);
    }
  }, 150);
}

/**
 * Searches for task cards by filtering the `task_cards` array based on the value of the "search-task-web" input field, and updates the HTML to display the filtered results.
 * @function
 * @returns {void}
 */
function searchTask() {
  let search = getDoc('search-task-web');
  result = task_cards.filter(cards => cards["declaration-header"].includes(search.value));
  
  if(search.value == "") {
    updateHTML();
  }
  filterSearchValue();
  updateFilteredProgressBars();
}


/**
 * updates the progress bars for filtered cards
 */
function updateFilteredProgressBars() {
  for (let i = 0; i < result.length; i++) {
    const card = result[i];
    monitorSubtasks(card, card.id)
  }
}


/**
 * Clears the innerHTML of the "to_do", "in_progress", "await_feedback", and "done" elements.
 * @function
 * @returns {void}
 */
function clearRows() {
  getDoc("to_do").innerHTML = "";
  getDoc("in_progress").innerHTML = "";
  getDoc("await_feedback").innerHTML = "";
  getDoc("done").innerHTML = "";
}

/**
 * Filters the task cards based on the `result` array and updates the HTML to display the filtered results.
 * @function
 * @param {Array} result - The array of task cards to filter and display.
 * @returns {void}
 */
function filterSearchValue() {
  clearRows();
  filerSearchValueLoop();
  renderTemplates();
}

function filerSearchValueLoop(){
  for (let h = 0; h < 1; h++) {
    const card_state = card_states[h];
    
    getDoc(card_state).innerHTML = "";
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      const state = element["state"];
      const id = element["id"];
      getDoc(state).innerHTML += generateCard(element);

        for (let j = 0; j < element["assignees"].length; j++) {
          const userData = element["assignees"];
          renderUsers(userData, id);
        }}
  }
}


/**
 * This function lets the user add existing contacts who are not yet assigned to a task
 * @param {number} ID 
 */
function addUserToEditTask(ID) {
  let users = contacts[ID];
  if (userToTask.indexOf(users) > -1) {
    userToTask.splice(userToTask.indexOf(users), 1);
  } else {
    userToTask.push(users);
  }
}


/**
 * Checks if an email connected to a contact exists if true it checks the current selected task_card
 */
 function addNewContactEdit(ID) {
  let card = task_cards[ID]
  let contactemail = getDoc('contact-email');
  let xy;
  contacts.forEach(contact => {
    if(emailExists(contact,contactemail)) {
      xy = true;
      checkForDuplicate(card, contact, ID, contactemail);
    }});
    if(xy !== true) {
      alert("this contact does not exist");
    }
}

/**
 * This function lets the user edit a task and change the values of it
 * @param {number} ID 
 */
async function editTask(ID) {
  let card = task_cards[ID];
  if (prioToTask.length == 0) {
    alert("Please select a priority")
    return false;
  } else {
    card["declaration-header"] = getDoc('task-edit-header').value;
    card["declaration-text"] = getDoc('task-edit-text').value;
    card["date"] = getDoc('task-edit-date').value;
    card["priority"] = prioToTask;
    card["subtasks"] = subtaskToTask;
    await saveTaskToServer();
    updateHTML();
    closeEdit();
  }
}


//////////////////////////////////////////////////////////////////////////////////////////// --render functions--

/**
 * Renders a list of users in the DOM.
 *
 * @param {Object[]} userData - An array of user data objects.
 * @param {string} id - The identifier of the DOM element to render the users into.
 * @returns {void}
 */
function renderUsers(userData, id) {
  let users = getDoc("assigned-users" + id);
  users.innerHTML = "";
  for (let i = 0; i < userData.length; i++) {
    const user = userData[i];
    if (i < 3) {
      users.innerHTML += generateUsersHTML(user);
    }
    if (i > 2) {
      users.innerHTML = "";
      renderUserSurplus(userData, users);
    }}
}


/**
 * If there are more than 3 users assigned to a task the 3rd user icon will be displaying the surplus that amounts.
 */
function renderUserSurplus(userData, users) {
  for (let j = 0; j < 2; j++) {
    const user = userData[j];
    const additionals = userData.length;
    users.innerHTML += generateUserSurplusHTML(user); // renders the first 2 users in the array if array has over 3 users
    if (j == 1) {
      users.innerHTML += generateLeftoverAmount(additionals); // shows the added users if total assigned usercount is over 3 
    }}
}

/**
 * Renders an add task form in the DOM with priorities.
 *
 */
function renderAddTask() {
  let form = getDoc('add-task');
  
  form.innerHTML = "";
  form.innerHTML += generateAddTaskForm(), renderPrioritiesAT();
}

/**
 * Renders task card templates in the DOM for each task status.
 *
 */
function renderTemplates() {
  getDoc("to_do").innerHTML += templateCard(0);
  getDoc("in_progress").innerHTML += templateCard(1);
  getDoc("await_feedback").innerHTML += templateCard(2);
  getDoc("done").innerHTML += templateCard(3);
}


/**
 * This render function will display the assigned contacts to each task and the option to invite new ones
 * @param {array} assignees 
 * @param {number} ID 
 */
function renderAssignedTaskUsers(assignees, ID) {
  let dropdown = getDoc('edit-assigned-users');
  dropdown.innerHTML = "";
  if(assignees == []) {
    dropdown.innerHTML += newContactEditTemplate(ID, "edit-assigned-users");
  } else {
    dropdown.innerHTML += newContactEditTemplate(ID, "edit-assigned-users");
    for (let i = 0; i < assignees.length; i++) {
      const elem = assignees[i];
      const ID = elem["userID"];
      dropdown.innerHTML += contactEditTemplate(elem, i, ID);
      } 
  }
}


/**
 * This function is for generateCard 
 */
 function renderAssignedUsers(assignees) {
  let list = getDoc('assigned-users');
  list.innerHTML = "";
  for (let i = 0; i < assignees.length; i++) {
    const element = assignees[i];
    list.innerHTML += `<div class="overlay-assignee">
                        <div class="overlay-assginee-img fm-inter-400" style="background: ${element["userColor"]}">${element["userInits"]}</div>
                        <span class="overlay-assignee-name fm-inter-400">${element["name"]}</span>
                       </div>`;
  }
}

/**
 * Renders a list of subtasks in the DOM.
 *
 * @param {Object[]} subtasks - An array of subtask objects.
 */
function renderSubtasksCard(subtasks) {
  let list = getDoc('subtasks');
  list.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    const element = subtasks[i];
    list.innerHTML += `<div class="">
                          <div class="subtask-content">
                              <span>${element.task}</span>
                          </div>
                       </div>`;
  }
}


/**
 * Renders a list of subtasks in the DOM.
 *
 * @param {Object[]} subtasks - An array of subtask objects.
 */
function renderSubtasksTasks(subtasks, ID) {
  let list = getDoc('edit-subtasks');
  list.innerHTML = "";
  
  for (let i = 0; i < subtasks.length; i++) {
    const element = subtasks[i];
    let resolveImage = () => {
      let result;
      if(element.checkState == false){
        result = './img/icons/empty checkbox.png'
      } else {
        result = './img/icons/checked box.png'
      }
      return result;
     };
    
    list.innerHTML += `<div class="">
                          <div class="subtask-content">
                            <img id="box${i}" onclick="checkBoard(${i}, ${ID})" src="${resolveImage()}">${element.task}
                          </div>
                       </div>`;
  }

}

/**

Updates the check state of a subtask in the task cards.
@param {number} i - The index of the subtask to update.
@param {string} ID - The ID of the task card.
*/
function checkBoard(i, ID) {
  let subtask = task_cards[ID].subtasks;
  const image = document.getElementById('box' + i);
  const source = image.attributes[2];
  if(source.nodeValue == './img/icons/empty checkbox.png') {
    subtask[i].checkState = true;
    source.nodeValue = './img/icons/checked box.png'
  } else if(source.nodeValue == './img/icons/checked box.png'){
    subtask[i].checkState = false;
    source.nodeValue = './img/icons/empty checkbox.png'
  }
  subtaskToTask = [];
  subtaskToTask = subtask;
}

//////////////////////////////////////////////////////////////////////////////////////////// --HTML / TEMPLATES--

/**

Updates the HTML content by calling multiple functions
@function
@name updateHTML
*/
function updateHTML() {
  mapThroughCards();
  filterStates();
  renderTemplates();
  updateProgressBar();
}

/**
Updates the id property of each object in an array of task cards by mapping through them
@function
@name mapThroughCards
*/
function mapThroughCards() {
  task_cards.map((card, index) => {
    card.id = index++;
  });
}


/**
 * This function renders each card depending on the state it has and will display the card in the correct column
 */
 function filterStates() {
   card_states.forEach(card_state => {
     let currentCardState = task_cards.filter((t) => t["state"] == card_state);
     getDoc(card_state).innerHTML = "";
   for (let i = 0; i < currentCardState.length; i++) {
     const element = currentCardState[i];
     const id = element["id"];
     getDoc(card_state).innerHTML += generateCard(element);
     
       for (let j = 0; j < element["assignees"].length; j++) {
         const userData = element["assignees"];
         renderUsers(userData, id);
       }}});      
 }

/**
Updates the progress bar by calling a function to monitor the subtasks of each card in an array of task cards
@function
@name updateProgressBar
*/
function updateProgressBar() {
  for (let i = 0; i < task_cards.length; i++) {
    const card = task_cards[i];
    monitorSubtasks(card, i)
  }
}


/**

Updates the progress bar fill and fill-text for a given task card based on its subtasks
@function
@name monitorSubtasks
@param {Object} card - The task card object whose subtasks should be monitored
@param {number} i - The index of the task card in the array
*/
function monitorSubtasks(card, i) {
  let fill = getDoc("fill" + i);
  let filltext = getDoc("fill-text" + i);
  let subtasks = card.subtasks
  let completedSubtasks = subtasks.filter((t) => t.checkState == true) 
  let result = (completedSubtasks.length / subtasks.length * 100);
  if (subtasks.length > 0) {
    fill.style.width = `${result}%`;
    filltext.innerHTML = `${completedSubtasks.length}/${subtasks.length} Done`;
  } else {
    fill.style.width = `0%`;
    filltext.innerHTML = `no subtasks`;
  }
}

/**

Highlights a template card popup by calling multiple functions with the same set of parameters
*/
function highlight(a, b, c, d) {
  templateCardPopupHandleA(a, b, c, d);
  templateCardPopupHandleB(a, b, c, d);
  templateCardPopupHandleC(a, b, c, d);
  templateCardPopupHandleD(a, b, c, d);
}


//////////////////////////////////////////////////////////////////////////////////////////// --MISC--

/**
Highlights the elements with the specified IDs if a string parameter contains a certain substring
*/
function templateCardPopupHandleA(a, b, c, d) {
  if(a.indexOf(currentState) > -1) {
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}

/**
Highlights the elements with the specified IDs if a string parameter contains a certain substring
*/
function templateCardPopupHandleB(a, b, c, d) {
  if(b.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}

/**
Highlights the elements with the specified IDs if a string parameter contains a certain substring
*/
function templateCardPopupHandleC(a, b, c, d) {
  if(c.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${d}`).classList.add("drag-highlight", "order-1");
  } 
}

/**
Highlights the elements with the specified IDs if a string parameter contains a certain substring
*/
function templateCardPopupHandleD(a, b, c, d) {
  if(d.indexOf(currentState) > -1) {
    getDoc(`${a}`).classList.add("drag-highlight", "order-1");
    getDoc(`${b}`).classList.add("drag-highlight", "order-1");
    getDoc(`${c}`).classList.add("drag-highlight", "order-1");
  } 
}

/**
Sets the global variable currentState to the specified number
*/
function throwState(num) {
  currentState = num;
}

/**

Removes the "highlight" class from the element with the specified ID
@function
@name removeHighlight
@param {string} id - The ID of the element to remove the "highlight" class from
*/
function removeHighlight(id) {
  getDoc(id).classList.remove("highlight");
}

/**

Removes the "drag-highlight" class from the elements with the specified IDs
@function
@name removeTemps
@param {string} a - The ID of the first element to remove the "drag-highlight" class from
@param {string} b - The ID of the second element to remove the "drag-highlight" class from
@param {string} c - The ID of the third element to remove the "drag-highlight" class from
@param {string} d - The ID of the fourth element to remove the "drag-highlight" class from
*/
function removeTemps(a, b, c, d) {
  getDoc(`${a}`).classList.remove("drag-highlight");
  getDoc(`${b}`).classList.remove("drag-highlight");
  getDoc(`${c}`).classList.remove("drag-highlight");
  getDoc(`${d}`).classList.remove("drag-highlight");
}

/**
Sets the global variable currentDraggedCard to the specified ID
@function
@name startDragging
@param {string} ID - The ID of the card element being dragged
*/
function startDragging(ID) {
  currentDraggedCard = ID;
}

/**
Prevents the default behavior of a drop event
@function
@name allowDrop
@param {object} ev - The event object representing a drop event
*/
function allowDrop(ev) {
  ev.preventDefault();
}

/**
Moves the dragged task card to the specified state, updates the HTML, removes the "highlight" class from the specified state, and saves the task to the server
@function
@name moveTo
@param {string} state - The state to move the dragged task card to
*/
function moveTo(state) {
  task_cards[currentDraggedCard]["state"] = state;
  updateHTML();
  removeHighlight(state);
  saveTaskToServer();
}

/**
Displays the task overlay by removing the "d-none" class and adding the "show-task-overlay" class after a delay
@function
@name showOverlay
*/
function showOverlay() {
  getDoc('overlay-bg').classList.remove('d-none');
  getDoc('task-overlay').classList.remove('d-none');
  setTimeout(() => {
    getDoc('task-overlay').classList.add('show-task-overlay');
  }, 100);
   prioToTask = [];
   setToggle();
}

/**
Closes the task overlay by removing the "show-task-overlay" class, waiting for the animation to complete, and adding the "d-none" class to both the overlay and the overlay background
@function
@name closeOverlay
*/
function closeOverlay() {
  getDoc('task-overlay').classList.remove('show-task-overlay');
  closeEdit();
  setTimeout(() => {
    getDoc('task-overlay').classList.add('d-none');
    getDoc('overlay-bg').classList.add('d-none');
  }, 225);
  clearPrio();
}

/**
 * Sets the priority when editing a card
 * @param {number} ID 
 */
function setPrio(ID) {
  prioToTask = [];
  let card = task_cards[ID];
  prioToTask.push(card['priority'][0])
  subtaskToTask = card['subtasks']
}

/**
Populates the task overlay with HTML generated from the specified task card and updates the assigned users, subtasks, and subtask status in the overlay
@function
@name overlayData
@param {number} ID - The ID of the task card to display in the overlay
*/
function overlayData(ID) {
  let card = task_cards[ID];
  getDoc('task-overlay').innerHTML = "";
  getDoc('task-overlay').innerHTML += generateOverlayHTML(card);
  getDoc('task-edit').innerHTML = "";
  getDoc('task-edit').innerHTML += generateOverlayEditHTML(card);
  renderAssignedUsers(card["assignees"]);
  renderAssignedTaskUsers(card["assignees"], ID);
  renderSubtasksCard(card["subtasks"])
  renderSubtasksTasks(card["subtasks"], ID)
}

/**
 * determines the priority and sets it accordingly
 * @param {string} prio 
 */
function determinePrio(prio) {
  if(prio === "urgent") {
    selectPrio('urgent', 'urgent-img', 'select-urgent', 'urgent white', 'urgent red', 'medium', 'medium yellow', 'low', 'low green')
  } 
  if(prio === "medium") {
    selectPrio('medium', 'medium-img', 'select-medium', 'medium white', 'medium yellow', 'urgent', 'urgent red', 'low', 'low green')
  } 
  if(prio === "low") {
    selectPrio('low', 'low-img', 'select-low', 'low white', 'low green', 'urgent', 'urgent red', 'medium', 'medium yellow')
  } 
}


/**
 * This function is for the overlays in mobile mode depending on viewport width it will display a different exit button 
 */
function detectWindowWidth() {
  if (window.innerWidth > 468) {
    getDoc("overlay-exit-img").setAttribute("src", "./img/icons/overlay exit button.png");
    getDoc("overlay-exit-edit-img").setAttribute("src", "./img/icons/overlay exit button.png");
  } else {
    getDoc("overlay-exit-img").setAttribute("src", "./img/icons/arrow left blue.png");
    getDoc("overlay-exit-edit-img").setAttribute("src", "./img/icons/arrow left blue.png");
  } 
}

/**
 * When adding a new contact to an existing task this function will prevent duplicates
 * @param {object} card 
 * @param {JSON} contact 
 * @param {number} ID 
 * @param {string} contactemail 
 */
function checkForDuplicate(card, contact, ID, contactemail) {
  if(checkIfUserIsAssigned(card, contact)) {
    alert("This contact is already assigned");
    contactemail.value = "";
  } else {
    pushNewUser(card, contact);
    returnToListEdit(ID);
  }
}

/**
Checks if a given email address already exists in a contact object
@function
@name emailExists
@param {Object} contact - The contact object to check
@param {Object} contactemail - The email address to search for in the contact object
@returns {boolean} - True if the email address exists in the contact object, false otherwise
*/
function emailExists(contact, contactemail) {
  return contact["email"] === contactemail.value
}

/**
 * Checks if the provided contact email is already assigned to the card 
 * @param {object} card 
 * @param {string} contact 
 * @returns 
 */
function checkIfUserIsAssigned(card, contact) {
 return (card["assignees"].some(e => e.email === contact["email"]))
}

/**
Adds a new contact to the assignees array of a given task card and returns the new length of the assignees array
@function
@name pushNewUser
@param {Object} card - The task card object to add the contact to
@param {Object} contact - The contact object to add to the task card's assignees array
@returns {number} - The new length of the task card's assignees array after adding the contact
*/
function pushNewUser(card, contact) {
 return card["assignees"].push(contact);
}


/**
Clears the contact list in the task edit form and returns to the task list display for a given task card
@function
@name returnToListEdit
@param {number} ID - The ID of the task card to return to the list display for
*/
function returnToListEdit(ID) {
  let card = task_cards[ID];
  let contactList = getDoc('task-edit-contacts');
  contactList.innerHTML = "";
  contactList.innerHTML += contactListTemplate();renderAssignedTaskUsers(card["assignees"], ID);
}

/**
Opens the task edit form and sets the priority based on the specified value
@function
@name openEdit
@param {string} prio - The priority value to set for the task
*/
function openEdit(prio) {
  getDoc('task-overlay').classList.remove('show-task-overlay');
  setTimeout(() => {
    getDoc('task-overlay').classList.add('d-none');
    getDoc('task-edit').classList.remove('d-none');
  }, 225);
  setTimeout(() => {
    getDoc('task-edit').classList.add('show-task-overlay');
  }, 300);
  renderPriorities();
  determinePrio(prio);
}

/**
Closes the task edit form and clears any temporary arrays and form data
@function
@name closeEdit
*/
function closeEdit() {
  getDoc('task-edit').classList.remove('show-task-overlay');
  setTimeout(() => {
    getDoc('task-edit').classList.add('d-none');
    getDoc('overlay-bg').classList.add('d-none');
  }, 225);
  setToggle();
  prioToTask = [];
  subtaskToTask = [];
}

/**
Opens the add task form and sets the selected state value
@function
@name openAddTask
@param {string} selection - The selected state value for the new task
*/
function openAddTask(selection) {
  getDoc('add-task-bg').classList.remove('d-none');
  getDoc('add-task').classList.remove('d-none');
  getDoc('add-task').innerHTML = "";
  renderAddTask();
  renderContactList();
  renderCategoryList();
  setTimeout(() => {
    getDoc('add-task-bg').classList.toggle('task-overlay-bg');
    getDoc('add-task').classList.toggle('show-add-task');
  }, 125);
  selectedState = selection;
  subtaskToTask = [];
}


/**
 * this return the toggle values for the priority buttons back to origin
 */
function setToggle() {
  toggle = false;
}


/**
Adds the "bgNavBlue" class to the board navigation links for the desktop and mobile versions of the site
@function
@name markBoardNav
*/
function markBoardNav() {
  document.getElementById("board-html").classList.add("bgNavBlue");
  document.getElementById("mob-board-html").classList.add("bgNavBlue");
}