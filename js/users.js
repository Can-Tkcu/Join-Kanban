
let users = [];
let loggedUsers = [];
let activeUser = [];


setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");

/**
Loads data from the server when the page is first loaded.
@async
*/
async function loadAtStart() {
    await downloadFromServer();
    loggedUsers = JSON.parse(await backend.getItem("loggedUser")) || [];
    users = JSON.parse(await backend.getItem("users")) || [];
}

/**
Returns the email address of the currently logged in user.
@returns {string} - The email address of the currently logged in user.
*/
function loadCurrentUserMail() {
    let lastUser = loggedUsers.length -1;
    return loggedUsers[lastUser].email;
}

/**
Returns an array of data for the currently logged in user.
@returns {Array} - An array of data for the currently logged in user.
*/
function loadDataFromCurrentUser() {
    let currentEmail = loadCurrentUserMail();
    let loggedInUser = users.filter(a => a.email === currentEmail);
    return loggedInUser;
}

/**
Returns the name of the currently logged in user, or "Max Mustermann" if the user is a guest.
@returns {string} - The name of the currently logged in user, or "Max Mustermann" if the user is a guest.
*/
function getCurrentUserName() {
    let guest = [];
    guest = loggedUsers.map(a => a.email === "guest@joinKanBan.de");
    let lastUser = guest.length -1;
    if (guest[lastUser] === true) {
        let name = "Max Mustermann";
        return name;
    } else {
        let name = loadDataFromCurrentUser();
        name = name[0].name
        return name;
    }
}