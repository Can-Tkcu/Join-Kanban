
let registeredUsers = [];
let loggedUser = [];
let pwState = 0;

// Setzt den E-Mail- und Passwort-Input in den persistenten Speicher
function rememberMe(email, password) {
    localStorage.setItem('rememberedEmail', email);
    localStorage.setItem('rememberedPassword', password);
  }
  
  // Liest die gespeicherten Daten aus dem persistenten Speicher und füllt das Formular automatisch aus
  function fillLoginForm() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
  
    if (rememberedEmail && rememberedPassword ) {
      document.getElementById('input-email').value = rememberedEmail;
      document.getElementById('input-password').value = rememberedPassword;
      document.getElementById('index-form-checkbox-icon').src = './img/icons/unchecked.png';
    }
  }
  

  function setToLocalStorage(email, password){
      let rememberMeUnchecked = document.getElementById('index-checked-checkbox').classList.contains('d-none');
      if (!rememberMeUnchecked) {
        rememberMe(email, password);
      }
  }


  setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");
  
/**
 * Loads users from server and sets global variables accordingly.
 * @async
 * @function loadUsers
 */
async function loadUsers() {
    await downloadFromServer();
    users = (await JSON.parse(backend.getItem("users"))) || [];
    registeredUsers = await JSON.parse(backend.getItem("users")) || [];
    loggedUser = await JSON.parse(backend.getItem("loggedUser")) || [];
}


/**
 * Authenticates the user based on email and password.
 * @async
 * @function login
 */
async function login() {
    let email = document.getElementById('input-email').value;
    let password = document.getElementById('input-password').value;
    let currentUserValue = []
    currentUserValue = registeredUsers.find(u => u.email == email.toLowerCase() && u.password == password)
    if (currentUserValue) {
        setToLocalStorage(email, password);
        loggedUser.push({"email": email.toLowerCase(),});
        await backend.setItem("loggedUser", JSON.stringify(loggedUser));
        email = '';
        password = '';
        window.location.href = "summary.html";
    } else {
        validateLoginInput();
    }
}

function validateLoginInput(){
    document.getElementById("input-password").placeholder = "Ups! Try again";
    document.getElementById("wrong-password").classList.remove("d-none");
    document.getElementById('input-email').value = "";
    document.getElementById('input-password').value = "";
}

/**
 * Logs in the guest user.
 * @async
 * @function guestLogin
 */
async function guestLogin() {
    loggedUser.push({"email": "guest@joinKanBan.de"})
    await backend.setItem("loggedUser", JSON.stringify(loggedUser));
    window.location.href = "./summary.html";
}

/**
 * Toggles the visibility of a checkbox.
 * @function toggleCheckbox
 */
function toggleCheckbox(){
    if(document.getElementById("index-checked-checkbox").classList.contains("d-none")){
        document.getElementById("index-checked-checkbox").classList.remove("d-none");
    }else{
        document.getElementById("index-checked-checkbox").classList.add("d-none");
    }
;
}

/**
 * Hides the "wrong password" message if it's displayed.
 * @function checkWrongInput
 */
function checkWrongInput() {
    if (!document.getElementById("wrong-password").classList.contains("d-none")) {
        document.getElementById("wrong-password").classList.add("d-none");
    }
}

/**
 * Toggles the visibility of the password input field.
 * @function changeVisibility
 */
function changeVisibility(){
            if(pwState === 0){
                document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";
                document.getElementById("input-password").type = "password";
                pwState = 1;
            }
            if(pwState === 1){
                document.getElementById("login-password-image").src="./img/icons/visibility.png";
                document.getElementById("input-password").type = "text";
                pwState = 0;
            }
        }
        
  /**
 * Changes the visibility of the password input field based on the lock image.
 * @function changeVisibilityOnInput
 * @returns {boolean} Returns false.
 */      
function changeVisibilityOnInput(){
    let lockImg = document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";
    if(lockImg){
        document.getElementById("input-password").type = "password";
        return false;
    }else{
        document.getElementById("login-password-image").src = "./img/icons/visibility-off.png";

    }

}