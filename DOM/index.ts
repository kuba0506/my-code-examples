import { Header } from "./header";
import { checkMobile } from "./utils";

window.addEventListener("DOMContentLoaded", () => {
    checkMobile();

    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);
});

Header();
