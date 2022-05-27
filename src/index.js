import { Header } from "./components/Header.js";
import HomeScreen from "./screens/HomeScreen.js";

const router = async () => {
  const header = document.getElementById("header");
  header.innerHTML = Header.render();
  Header.after_render();
  const main = document.getElementById("main-content");
  main.innerHTML = await HomeScreen.render();
  HomeScreen.after_render();
};

window.addEventListener("DOMContentLoaded", router);
