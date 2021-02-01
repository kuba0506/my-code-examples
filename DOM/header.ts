let headerMobile: HTMLElement;
let menuBtn: HTMLElement;
let closeBtn: HTMLElement;
let navigationHeader: HTMLElement;

const SMALL_NAV_CLASS = "main-header--small";
const TOGGLE_CLASS = "open";

const init = () => {
    //  todo temporary remove when backend solution implemented
    notAuthorizedHomePage();
    // END todo temporary remove when backend solution implemented

    cacheDOM();

    bindEvents();
};

const updateNav = () => {
    if (window.isMobile) return;
    if (!navigationHeader) return;

    const scrollTop = window.pageYOffset;

    if (scrollTop > 100) {
        navigationHeader.classList.add(SMALL_NAV_CLASS);
        return;
    }

    navigationHeader.classList.remove(SMALL_NAV_CLASS);
};

const toggleMobileNav = (event: any) =>
    headerMobile.classList.toggle(TOGGLE_CLASS);

//  todo temporary remove when backend solution implemented
const notAuthorizedHomePage = () => {
    const body = document.querySelector("body") as HTMLElement;
    const authorized = document.querySelector("#authorized");

    if (authorized) return;

    body.classList.add("not-authorized");
};
// END todo temporary remove when backend solution implemented

const bindEvents = () => {
    [menuBtn, closeBtn].forEach((item) => {
        if (!item) return;

        item.addEventListener("click", toggleMobileNav);
    });

    window.addEventListener("scroll", () => {
        updateNav();
    });
};

const cacheDOM = () => {
    headerMobile = document.querySelector(
        ".foss-header-ocu-mobile"
    ) as HTMLElement;
    menuBtn = document.querySelector(
        ".mobile-header__toggle-button"
    ) as HTMLElement;
    closeBtn = document.querySelector(
        ".mobile-header__close-button"
    ) as HTMLElement;
    navigationHeader = document.querySelector("header") as HTMLElement;
};

export { init as Header };
