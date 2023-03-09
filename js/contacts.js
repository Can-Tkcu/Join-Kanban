let contacts = [];
let firstChar = [];
let currentUser = [];
let currentContactBox = [];

/**
Initializes the app by loading data from the server and rendering the contact list, category list, priority options, and contacts, and updating the navigation menu
@function
@name initC
*/
async function initC() {
    await loadAtStart()
    contacts = await JSON.parse(backend.getItem("contacts")) || [];
    categories = (await JSON.parse(backend.getItem("categories"))) || [];
    task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
    renderContactList();
    renderCategoryList();
    renderPriorities()
    renderContacts();
    checkNav();
}

board = "contacts.html";

//Clears the inner HTML of an element with the specified ID
const clearHTML = function (id) {
    return document.getElementById(`${id}`).innerHTML = " ";
}

/**
Checks if the navigation menu has finished loading and sets the navLoaded variable to true when it has
@function
@name checkNav
*/
function checkNav() {
    const intervalId = setInterval(() => {
      if (document.getElementById('summary-html')) {
        navLoaded = true;
        markContactNav();
        clearInterval(intervalId);
      }
    }, 150);
  }

  setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");
    
/**
Adds the current user ID to the currentUser array
@function
@name addCurrentUser
@param {number} id - The ID of the current user to add to the array
*/
async function addCurrentUser(id) {
    currentUser = [];
    currentUser.push(id);
}

//Shows the desktop version of the add contact modal
function showModal() {
    getDoc('modal').classList.remove("d-none");
}

//showMobileModal
function showMobileModal() {
    getDoc('modal-mobile').classList.remove("d-none");
    getDoc('mobile-add-Contact').classList.add("d-none");
    getDoc('summary-main-page').classList.add("d-none");
    getDoc('header').classList.add("d-none");
}


//Shows the mobile version of the edit contact modal and hides the mobile contact summary page and header, and loads the current user's data into the form
function showEditMobileModal() {
    getDoc('modal-mobile-edit').classList.remove("d-none");
    getDoc('mobile-contact-details').classList.add("d-none");
    getDoc('mobile-add-Contact').classList.add("d-none");
    getDoc('summary-main-page').classList.add("d-none");
    getDoc('header').classList.add("d-none");
    loadCurrentUserData();

}

//Saves changes made to the current user in the edit contact modal and saves the updated contact data to the server, then hides the edit contact modal and displays the mobile contact details for the current user
async function saveMobileChanges() {
    let user = contacts[currentUser];
    let name = getDoc("mobile-edit-contact-name").value;
    let email = getDoc("mobile-edit-contact-email").value;
    let phone = getDoc("mobile-edit-contact-phone").value;
    user.name = name;
    user.email = email;
    user.phone = phone;
    await saveContactsToServer();
    hideEditMobileModal();
    openMobileContactDetails(currentUser);
}

//Loads the current user's data into the edit contact form
function loadCurrentUserData() {
    let user = contacts[currentUser];
    getDoc("mobile-edit-contact-name").value = user.name;
    getDoc("mobile-edit-contact-email").value = user.email;
    getDoc("mobile-edit-contact-phone").value = user.phone;
}

/**
Hides the specified modal by adding a CSS class to animate it out and then removing it from the DOM
@function
@name hideModal
@param {string} modal - The ID of the modal to hide
*/
function hideModal(modal) {
    getDoc(modal).classList.add("modal-move-out");
    setTimeout(() => {
        getDoc(modal).classList.add("d-none");
        getDoc(modal).classList.remove("modal-move-out");
    }, 225);
}

//Hides the mobile version of the add contact modal and displays the mobile contact summary page and header
function hideMobileModal() {
    getDoc('modal-mobile').classList.add("modal-mobile-move-out");
    setTimeout(() => {
        getDoc("modal-mobile").classList.add("d-none");
        getDoc('mobile-add-Contact').classList.remove("d-none");
        getDoc('summary-main-page').classList.remove("d-none");
        getDoc('header').classList.remove("d-none");
        getDoc('modal-mobile').classList.remove("modal-mobile-move-out");
    }, 400);
}

//Hides the mobile version of the edit contact modal and displays the mobile contact details for the current user

function hideEditMobileModal() {
    getDoc('modal-mobile-edit').classList.add("modal-mobile-move-out");
    setTimeout(() => {
        getDoc('modal-mobile-edit').classList.add("d-none");
        getDoc('mobile-add-Contact').classList.remove("d-none");
        getDoc('summary-main-page').classList.add("d-none");
        getDoc('mobile-contact-details').classList.remove("d-none");
        getDoc('header').classList.remove("d-none");
        getDoc('modal-mobile-edit').classList.remove("modal-mobile-move-out");
    }, 400);
}

//Opens the mobile version of the contact details view, hiding the summary page and other components, and displaying the details for the current user
function openMobileContactDetails() {
    if (window.innerWidth <= 1024) {
        getDoc('mobile-contact-details').classList.remove("d-none");
        getDoc('summary-main-page').classList.add('d-none');
        getDoc('contacts').classList.add("d-none");
        getDoc('mobile-add-Contact').classList.add("d-none");
        getDoc('header').classList.add("contact-details-head");
        clearHTML('mobile-contact-details');
        getDoc('mobile-contact-details').innerHTML = templateMobileContactDetails(currentUser);
    } else {
        return false
    }
}

//Closes the mobile version of the edit contact modal
function closeMobileEdit() {
    getDoc('mobile-contact-details').classList.add("d-none");
    getDoc('summary-main-page').classList.remove('d-none');
    getDoc('contacts').classList.remove("d-none");
    getDoc('mobile-add-Contact').classList.remove("d-none");
    getDoc('header').classList.remove("contact-details-head");
    renderContacts();
}

//Opens the desktop version of the edit contact modal
function openEditContact() {
    getDoc('edit-contact-modal').classList.remove("d-none");
    editContact();
}

//Closes the desktop version of the edit contact modal
function closeEditContact() {
    getDoc('edit-contact-modal').classList.add("d-none");
}

/**
Sets the background color and border radius of a contact box element
@function
@name setBgColorToContactsBox
@param {number} i - The index of the contact box element to modify
*/
function setBgColorToContactsBox(i) {
    getDoc("contact-box-" + currentContactBox[0]).classList.remove("set-bg-color");
    currentContactBox = [];
    addCurrentContactBox(i);
    getDoc("contact-box-" + currentContactBox[0]).classList.add("set-bg-color");
    getDoc("contact-box-" + currentContactBox[0]).style.borderRadius = "8px";
}

/**
Sets the background color and border radius of a contact box element
@function
@name setBgColorToContactsBox
@param {number} i - The index of the contact box element to modify
*/
function addCurrentContactBox(i) {
    currentContactBox.push(i);
}

//Starts a phone call with the contact at the specified index
function startCall(i) {
    window.open("tel:" + contacts[i].phone);
}

/**
Opens the user's email client to send an email to the contact at the specified index
@function
@name sendMail
@param {number} i - The index of the contact to send an email to
*/
function sendMail(i) {
    window.open("mailto:" + contacts[i].email);
}

/**
 * Returns a random RGB color in string format.
 * @returns {string} A string in the format of "rgb(r, g, b)".
 */
function randomColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);

    return `rgb(${r} ,${g} , ${b})`;
}

/**
 * Takes a phone number in string format and converts it to a standard format.
 * @param {string} dn - The phone number to convert.
 * @returns {string} The phone number in the standard format of "(+49) XXXX-X-XXXXX" or "(+49) XXX-XXXXXXX".
 */
function convertPhone(dn) {
    let phoneNumberLength = dn.length;
    if (phoneNumberLength < 4) { return dn; }
    if (phoneNumberLength < 7) { return `(${dn.slice(0, 3)}) ${dn.slice(3)}` }
    if (phoneNumberLength <= 10) return `(+49)${dn.slice(1, 4)}${dn.slice(4, 5)}-${dn.slice(5, 10)}`;
    return `(+49)${dn.slice(1, 3)}${dn.slice(3, 4)}-${dn.slice(4, 7)}-${dn.slice(7, 11)}`;
}

/**
 * Converts the phone number input to the standard format while typing.
 */
function covertDnOnInput() {
    dn = getDoc("add-contact-phone").value;
    getDoc("add-contact-phone").innerHTML = convertPhone(dn);
}

/**
Renders the list of contacts in the UI.
*/
function renderContacts() {
    if (board == "contacts.html") {
        clearHTML("contacts");
    }
    contacts.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));
    if (board == "contacts.html") {
        renderContactBox();
        for (let i = 0; i < contacts.length; i++) {
            sortContactsToFirstLetterBox(contacts[i].name.charAt(0), i);
        }
    }
}

/**
 * Renders the contact boxes and details on the contacts page.
 */
async function renderContactBox() {
    clearHTML("contacts");
    for (let i = 0; i < contacts.length; i++) {
        if (firstChar.indexOf(contacts[i].name.charAt(0).toLowerCase()) === -1) {
            firstChar.push(contacts[i].name.charAt(0).toLowerCase());
        }
    }
    firstChar.sort();
    for (let i = 0; i < firstChar.length; i++) {
        if (!getDoc("contact-container-" + firstChar[i].toUpperCase())) {
            getDoc("contacts").innerHTML += templateRenderContacts(i);
        }
    }
}

/**
 * Renders the details of a contact and clears the contact details box.
 * @param {number} i - The index of the contact in the contacts array.
 */
function renderContactDetails(i) {
    clearHTML("contact-details");
    getDoc("contact-details").innerHTML = templateContactDetails(i);
}

 //Adds a new contact to the contacts array and saves it to the server.
async function addContact() {
    let name = $('#add-contact-name').val();
    let email = $('#add-contact-email').val();
    let phone = $('#add-contact-phone').val();
    let userID = contacts.length;
    let userColor = randomColor();
    contacts.push({ "userColor": userColor, "userID": userID, "name": name, "email": email, "phone": phone, "userInits": firstLetterToUpperCase(name) });
    $('#add-contact-name, #add-contact-email, #add-contact-phone').val("");
    await saveContactsToServer();
    renderContacts();
    hideModal('modal');
    renderContactList();
    resolveCheckedState();
}

//Adds a new contact to the contacts array based on the data provided by the mobile add contact modal.
async function addMobileContact() {
    let name = $('#mobile-add-contact-name').val();
    let email = $('#mobile-add-contact-email').val();
    let phone = $('#mobile-add-contact-phone').val();
    let userID = contacts.length;
    let userColor = randomColor();
    contacts.push({ "userColor": userColor, "userID": userID, "name": name, "email": email, "phone": phone, });
    $('#mobile-add-contact-name, #mobile-add-contact-email, #mobile-add-contact-phone').val("");
    await saveContactsToServer();
    renderContacts();
}

 //Sets the values of the contact edit modal based on the data of the currently selected contact.
async function editContact() {
    let user = contacts[currentUser];
    getDoc("contact-edit-name").value = user.name;
    getDoc("contact-edit-mail").value = user.email;
    getDoc("contact-edit-phone").value = user.phone;
    await saveContactsToServer();
}

/**
 * Deletes the provided contact from the contacts array and reloads the page to reflect the changes.
 * @param {number} user - The ID of the contact to delete.
 */
async function deleteContact(user) {
    contacts.splice(user, 1);
    await saveContactsToServer();
    window.location.reload();
    renderContacts();
}

//Saves changes to a contact's details to the `contacts` array and the server.
async function saveChanges() {
    let user = contacts[currentUser];
    let name = getDoc("contact-edit-name").value;
    let email = getDoc("contact-edit-mail").value;
    let phone = getDoc("contact-edit-phone").value;
    user.name = name;
    user.email = email;
    user.phone = phone;
    await saveContactsToServer();
    closeEditContact();
    renderContacts();
    renderContactDetails(currentUser);
}

//Saves the `contacts` array to the server.
async function saveContactsToServer() {
    await backend.setItem('contacts', JSON.stringify(contacts));
}

/**
 * Returns the provided string with the first letter of each word capitalized.
 * 
 * @param {string} name - The string to be modified.
 * @returns {string} The modified string.
 */
function firstLetterToUpperCase(name) {
    var separateWord = name.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase();
    }
    return separateWord.join('');
}

/**
 * Sorts a contact into the appropriate contact box on the "Contacts" page.
 * @param {string} char - The first letter of the contact's name.
 * @param {number} i - The index of the contact in the `contacts` array.
 */
function sortContactsToFirstLetterBox(char, i) {
    if (getDoc("first-letter-" + char.toUpperCase()).innerHTML == char.toUpperCase()) {
        getDoc("contact-container-" + char.charAt(0).toUpperCase()).innerHTML += templateRenderSortContacts(i);
    } else {
        return false;
    }
}

//Adds the "bgNavBlue" class to the appropriate HTML element based on the current window size.
function markContactNav() {
    if (window.innerWidth <= 1024) {
        document.getElementById("mob-contacts-html").classList.add("bgNavBlue");
    } else {
        document.getElementById("contacts-html").classList.add("bgNavBlue");
    }
}