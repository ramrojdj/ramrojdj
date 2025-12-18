const nav = document.querySelector("nav");
const handleNavButtons = event => {
    try {
        const active = document.querySelector(".content:not([hidden])");
        const userSelection = event.target.closest("button").title;
        const newActive = document.querySelector(`.content#${userSelection}`);

        const buttonActive = document.querySelector("button.active");
        const newButtonActive = document.querySelector(`button[title="${userSelection}"]`);

        buttonActive.classList.remove("active");
        newButtonActive.classList.add("active");

        active.hidden = true;
        newActive.hidden = false;

        return true;
    } catch (error) {return false };
};

nav.addEventListener("click", handleNavButtons);