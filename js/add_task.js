
let navLoaded = false;

/**
 * Initializes the application by downloading data from the server and rendering the initial UI.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function init() {
  await downloadFromServer();
  task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
  contacts = (await JSON.parse(backend.getItem("contacts"))) || [];
  categories = (await JSON.parse(backend.getItem("categories"))) || [];
  renderContactList();
  renderCategoryList();
  renderPriorities();
  board = "add_task.html";
  selectedState = "to_do";
  checkNav()
}


// Check the navigation state
function checkNav() {
  const intervalId = setInterval(() => {
    if (document.getElementById('summary-html')) {
      navLoaded = true;
      markAddTaskNav();
      clearInterval(intervalId);
    }
  }, 150);
}

setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");

/**
 * Toggles the visibility of a dropdown menu by toggling the "option-wrapper" and "d-none" classes on the element with the given ID.
 * @function
 * @param {string} id - The ID of the element to toggle.
 * @returns {void}
 */
function showDropdown(id) {
  getDoc(id).classList.toggle("option-wrapper");
  getDoc(id).classList.toggle("d-none");
  
}

/**
 * Stops the propagation of an event by calling the `stopPropagation()` method on the event object.
 * @function
 * @param {Event} event - The event object to stop propagation on.
 * @returns {void}
 */
function stopProp(event) {
  event.stopPropagation();
}


/**
 * Adds the "bgNavBlue" class to the "mob-add-task-html" and "add-task-html" elements if the navigation has already loaded.
 * @function
 * @returns {void}
 */
function markAddTaskNav(){
  if(navLoaded){
    document.getElementById("mob-add-task-html").classList.add("bgNavBlue");
    document.getElementById("add-task-html").classList.add("bgNavBlue");
  }




}
