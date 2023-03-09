/**
 * Clears the class list for all category colors.
 * @function clearCLassList
 */
function clearCLassList() {
    getDoc('color0').classList = ('category-color');
    getDoc('color1').classList = ('category-color');
    getDoc('color2').classList = ('category-color');
    getDoc('color3').classList = ('category-color');
    getDoc('color4').classList = ('category-color');
    getDoc('color5').classList = ('category-color');
  }
  
  /**
   * Clears the priority dropdown for the task.
   * @function clearPrio
   */
  function clearPrio() {
    let prio = getDoc('priorities');
    prio.innerHTML = "";
  }
  
  /**
   * Clears the category color selection and returns to the category list view.
   * @function returnToList
   */
  function returnToList() {
    let categoryList = getDoc("category-body");
    selectedColor = [];
    categoryList.innerHTML = "";
    categoryList.innerHTML = categoryListTemplate();
  }
  
  /**
   * Clears the subtask list and returns to the subtask view.
   * @function returnToSubtask
   */
  function returnToSubtask() {  
    let subtaskList = getDoc("subtask-body");
    subtaskList.innerHTML = "";
    subtaskList.innerHTML = subtaskTemplate();
  }
  
  /**
   * Clears the category list and renders the initial list for the given category.
   * @function resetList
   * @param {string} cat - The category for which to reset the list.
   */
  function resetList(cat) {
    let categoryList = getDoc("category-body");
    categoryList.innerHTML = "";
    categoryList.innerHTML = initList(cat); renderCategoryList();
  }
  
  /**
   * Clears the input fields for the task and related data, and updates the UI.
   * @async
   * @function clearInputs
   */
  async function clearInputs() {
    clearFields();
    resetContactList();
    returnToList();
    clearArrays();
    renderContactList();
    renderCategoryList();
    if(board == "board.html" || board == "contacts.html") {
      renderPrioritiesAT();
    } else {
      renderPriorities();
    }
    }
   
  /**
   * Clears the input fields for the task.
   * @function clearFields
   */
  function clearFields() {
    getDoc("title").value = "";
    getDoc("description").value = "";
    getDoc('date').value = "";
    if(board == "board.html" || board == "contacts.html") {
      getDoc('prioritiesAT').innerHTML = "";
    } else {
      getDoc('priorities').innerHTML = "";
    }
  }
  
  /**
   * Clears the arrays for the user, priority, category, and subtask data.
   * @function clearArrays
   */
  function clearArrays() {
    userToTask = [];
    prioToTask = [];
    categoryToTask = [];
    subtaskToTask = [];
  }
  
  /**
   * Resets the contact list and hides it from view.
   * @function resetContactList
   */
  function resetContactList() {
    getDoc('contact-list').classList.add("option-wrapper");
    getDoc('contact-list').classList.add("d-none");
  }
   

/**
 * Saves the task data to the server.
 * @async
 * @function saveTaskToServer
 */
async function saveTaskToServer() {
    await backend.setItem("tasks", JSON.stringify(task_cards));
  }
  
  /**
   * Saves the category data to the server.
   * @async
   * @function saveCatToServer
   */
  async function saveCatToServer() {
    await backend.setItem("categories", JSON.stringify(categories));
  }
  
  /**
   * Displays the animation for adding a task to the board.
   * @function showAnim
   */
  function showAnim() {
    getDoc('add-to-board').style = `transform: translateY(0vh);`;
    setTimeout(function() {hideAnim()}, 1000);
  }
  
  /**
   * Hides the animation for adding a task to the board.
   * @function hideAnim
   */
  function hideAnim() {
   getDoc('add-to-board').style = `transform: translateY(100vh);`;
   
  }
  
  
  /**
   * Checks which template is opened and closes the oposite accordingly
   */
  function detectHTML(ID) {
    let str = getDoc(ID).classList;
    let check = !str.contains('d-none')
    if(ID == 'help-template' && check) {
      toggleHelp('legal-template');
    } 
    if(ID == 'legal-template' && check) {
      toggleLegal('help-template');
    } 
  }
  
  /**
   * Toggles the legal notice to display or hide the highlighted area and shows the legal notice.
   * @function toggleLegal
   * @param {string} ID - The ID of the legal notice to toggle.
   */
  let legal = false;
  function toggleLegal(ID) {
    detectHTML(ID);
    showLegalNotice();
    if(legal == true) {
      highlightOff();
    } else if(legal == false) {
      highlightOn();
    }
  }
  
  /**
   * Turns off the highlight for the legal notice and updates the UI.
   * @function highlightOff
   */
  function highlightOff() {
    getDoc('legal-img').setAttribute("src", "./img/icons/info-icon.png");
    getDoc('legal-span').classList.remove('fm-OpenSA-700');
    legal = false;
  }
  
  /**
   * Turns on the highlight for the legal notice and updates the UI.
   * @function highlightOn
   */
  function highlightOn() {
    getDoc('legal-img').setAttribute("src", "./img/icons/info icon white.png");
    getDoc('legal-span').classList.add('fm-OpenSA-700');
    legal = true;
  }
  
  
  /**
   * Checks which File is currently opened and applies d-none accordingly
   */
  function showLegalNotice() {
    checkForFile();
    toggleLegalHTML();
  }
  
  
  /**
   * If User is at contacts.html d-none is applied accordingly 
   */
  function toggleHelp(ID) {
    detectHTML(ID);
    checkForFile();
    getDoc('help-template').classList.toggle("d-none");
  }
  
  
  function toggleLegalHTML() {
    getDoc('legal-template').classList.toggle("d-none");
    getDoc('legal').classList.toggle("legal-clicked");
  }
  
  /**
   * determines which html page is opened and adds d-none to main containers to display legal or help page 
   */
  function checkForFile() {
    currentFileIsSummary(); 
    currentFileIsBoard();
    currentFileIsAddTask();
    currentFileIsContacts();
  }
  
  /**
   * Toggles the visibility of task rows and the search box for the board file.
   * @function currentFileIsBoard
   */
  function currentFileIsBoard() {
    if(board == "board.html") {
      getDoc('task-row-wrapper').classList.toggle("d-none");
      getDoc('search-task').classList.toggle("d-none");
    }
  }
  
  /**
   * Toggles the visibility of the add task button for the add task file.
   * @function currentFileIsAddTask
   */
  function currentFileIsAddTask() {
    if(board == "add_task.html") {
      getDoc('add-task').classList.toggle("d-none");
    }
  }
  
  /**
   * Toggles the visibility of the greeting, tasks, and task container for the summary file.
   * @function currentFileIsSummary
   */
  function currentFileIsSummary() {
    if(board == "summary.html") {
      getDoc('greeting').classList.toggle("d-none");
      getDoc('tasks').classList.toggle("d-none");
      getDoc('task-container').classList.toggle("d-none");
    }
  }
  
  /**
   * Toggles the visibility of the contact details and contacts for the contacts file.
   * @function currentFileIsContacts
   */
  function currentFileIsContacts() {
    if(board == "contacts.html") {
      getDoc('contact-details').classList.toggle("d-none");
      getDoc('contacts').classList.toggle("d-none");
    }
  }
  
  /**
   * Opens the mobile menu for screens with a width less than or equal to 1024px.
   * @function openMobileMenu
   */
  function openMobileMenu(){
    if(window.innerWidth <= 1024){
      let mobileMenu = document.getElementById("mobile-menu");
      if(mobileMenu.classList.contains("d-none")){
        mobileMenu.classList.remove("d-none")
      }else{
        mobileMenu.classList.add("mobile-menu-move-out");
        setTimeoutOpenMobileMenu();
      }
    }else{
      return false;
    }
  }  
  
  function setTimeoutOpenMobileMenu(){
    setTimeout(() => {
      mobileMenu.classList.remove("mobile-menu-move-out");
      mobileMenu.classList.add("d-none");
    }, 500);
  }