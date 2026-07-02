import { renderFooter } from "./components/footer.js";
import { renderHeader } from "./components/header.js";
import { initRouter } from "./router.js";

const LOAD_COUNT_KEY = "guitarras-app-spa-page-loads";

function incrementPageLoads() {
  const currentCount = Number(sessionStorage.getItem(LOAD_COUNT_KEY)) || 0;
  sessionStorage.setItem(LOAD_COUNT_KEY, String(currentCount + 1));
}

document.addEventListener("DOMContentLoaded", () => {
  incrementPageLoads();
  renderHeader();
  renderFooter();
  initRouter();
});
