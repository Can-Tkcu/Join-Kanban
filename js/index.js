/**
Hides the page container and displays a loading animation until the page is fully loaded.
*/
function loading(){
    document.getElementById("page-container").classList.add("d-none");
    setTimeout(() => {
        document.body.classList.remove("bg-blue");
        document.getElementById("animation").classList.add("d-none");
        document.getElementById("page-container").classList.remove("d-none");
    }, 750);
    
}

