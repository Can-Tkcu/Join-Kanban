let task_cards = [];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();

setURL("https://join.can-tuekuecue-developer.com/smallest_backend_ever-master");

board = "summary.html"

/**
Initializes the page by loading data, greeting the user, rendering the current date, and syncing the task data with the summary board.
@async
*/
async function init() {
    await loadAtStart()
    task_cards = (await JSON.parse(backend.getItem("tasks"))) || [];
    await greetUser();
    renderCurrentDate();
    renderAmountToTasks();
    checkNav();
}

/**
Checks to see if the summary navigation has loaded, then marks it with a blue background.
*/
function checkNav() {
    const intervalId = setInterval(() => {
      if (document.getElementById('summary-html')) {
        navLoaded = true;
        markSummaryNav();
        clearInterval(intervalId);
      }
    }, 150);
  }

/**
Renders the current date in the "urgent-date" element.
*/
function renderCurrentDate() {
    let currentYear = new Date().getFullYear().toString();
    let currentDay = new Date().getDate().toString();
    let currentMonth = month[d.getMonth()];
    document.getElementById('urgent-date').innerHTML = `${currentMonth} ${currentDay}, ${currentYear}`;
}

/**
Greets the user based on the current time of day and displays their name.
*/
async function greetUser() {
    let currentTime = new Date().getHours();
    if (currentTime < 12) {
        document.getElementById("greet-at-time").innerHTML = "Good morning, ";
    } else {
        document.getElementById("greet-at-time").innerHTML = "Good evening, ";
    }
    document.getElementById("greet-user").innerHTML = getCurrentUserName();
}


/**
Returns the number of tasks in the specified state.
@param {string} state - The state of the tasks to count.
@returns {number} - The number of tasks in the specified state.
*/
function syncSummaryTasks(state) {
    let states = task_cards.filter((a) => a.state === state)
    let amountState = states.length;
    return amountState
}

/**
Returns the number of tasks with a priority of "urgent".
@returns {number} - The number of urgent tasks.
*/
function syncSummaryUrgent() {
    let urgent = task_cards.filter((a) => a.priority[0] === "urgent")
    let amountUrgent = urgent.length;
    console.log(amountUrgent);
    return amountUrgent
}

/**
Renders the number of tasks in each state and the number of urgent tasks.
*/
function renderAmountToTasks() {
    getDoc('task-to-do-id-').innerHTML = syncSummaryTasks("to_do");
    getDoc('task-in-board-id-').innerHTML = task_cards.length;
    getDoc('task-in-progress-id-').innerHTML = syncSummaryTasks("in_progress");
    getDoc('task-awaiting-feedback-id-').innerHTML = syncSummaryTasks("await_feedback");
    getDoc('task-done-id-').innerHTML = syncSummaryTasks("done");
    getDoc("task-id-").innerHTML = syncSummaryUrgent();
}

/**
Redirects the user to the board page.
*/
function goToBoard(){
    window.location.href = "./board.html"
}

/**
Adds a blue background to the summary navigation.
*/
function markSummaryNav(){
    document.getElementById("summary-html").classList.add("bgNavBlue");
    document.getElementById("mob-summary-html").classList.add("bgNavBlue");
}
