
setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");

let users = [];

/**
Loads users from the server and sets the users variable to the retrieved data.
@async
*/
async function loadUsers() {
    await downloadFromServer();
    users = (await JSON.parse(backend.getItem("users"))) || [];
}

/**
Adds a new user to the users array if the email is not already in use.
@async
*/
async function addUser() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let searchExistingUser = users.map(user => user.email === email.toLowerCase())
    if (searchExistingUser.indexOf(true) > -1) {
        renderUnsucessfull();
    }
    else {
        users.push({ "name": name, "email": email.toLowerCase(), "password": password, "contacts": [], "tasks": [], "forgotPW": false });
        await saveUsersToServer();
        registrationSuccessfull();
    }
}

/**
Displays an error message if a user with the given email already exists.
*/
function renderUnsucessfull() {
    document.getElementById("signup-sucessfull").classList.add("signup-unsuccessfull");
    document.getElementById("signup-sucessfull").classList.remove("d-none");
    document.getElementById("signup-sucessfull").innerHTML = `Sign up unsuccessfull! <br> Email already exists!`
}

/**
Redirects the user to the index page after a successful registration.
*/
function registrationSuccessfull() {
    document.getElementById("signup-sucessfull").classList.remove("d-none");
    setTimeout(() => {
        window.location.href = 'index.html?msg=Du hast dich erfolgreich Registriert';
    }, 500);

}

/**
Sends a reset password email to the user with the given email address.
@async
*/
async function sendResetMail() {
    let inputMail = document.getElementById("email").value;
    let checkMail = registeredUsers.map(mail => mail.email === inputMail);
    if (checkMail.indexOf(true) > -1) {
        let userForgotPW = users.map(user => user.email === inputMail).indexOf(true);
        users[userForgotPW].forgotPW = true;
        await saveUsersToServer();
        timeOutToRedirect();
        if (document.getElementById("forgot-sucessfull").classList.contains("forgot-unsuccessfull")) {
            sendResetTrue();
        }
        document.getElementById("forgot-sucessfull").classList.remove("d-none")
    } else {
        sendResetElse();
    }
}


function timeOutToRedirect(){
    setTimeout(() => {
        window.location.href = "./resetPassword.html";
    }, 1500);
}

function sendResetTrue(){
    document.getElementById("forgot-sucessfull").classList.remove("forgot-unsuccessfull");
    document.getElementById("forgot-sucessfull").innerHTML = "You got a Mail!";
}

function sendResetElse(){
    document.getElementById("forgot-sucessfull").classList.remove("d-none")
    document.getElementById("forgot-sucessfull").classList.add("forgot-unsuccessfull")
    document.getElementById("forgot-sucessfull").innerHTML = "Email not exist!"
}


/**
Saves the users array to the server.
@async
*/
async function saveUsersToServer() {
    await backend.setItem('users', JSON.stringify(users));
}

/**
Updates the password of the user who has requested a password reset and saves the updated users array to the server.
Redirects the user to the index page upon successful password reset.
@async
*/
async function setNewPassword() {
        let IndexOfUser = users.map(user => user.forgotPW === true).indexOf(true);
        let user = users[IndexOfUser];
        let newPW = document.getElementById("new-password");
        user.password = newPW.value;
        user.forgotPW = false;
        await saveUsersToServer();
        window.location.href ="./index.html"
}

/**
Validates that the password entered in the "new password" field matches the password entered in the "confirm password" field.
@returns {boolean} - True if the passwords match, false otherwise.
*/
function validatePassword() {
    let newPwValue = document.getElementById("new-password").value;
    let confirmPwValue = document.getElementById("confirm-password").value;
    return newPwValue === confirmPwValue;
}