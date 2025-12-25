const themeSwitchBtn = document.getElementById("theme-toggle");
const logoImg = document.getElementById("main-logo");
const themeIcon = document.getElementById("theme-icon");
const savedTheme = localStorage.getItem("theme") || "dark";
const extensionsContainer = document.getElementById("extensions-container");
const response = await fetch("./data.json");
let currentFilter = "all";

let extensionsArray = [];
extensionsArray = await response.json();
function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.classList.add("light");
    logoImg.src = "assets/images/logo-white-theme.svg";
    themeIcon.src = "assets/images/icon-moon.svg";
  } else {
    document.documentElement.classList.remove("light");
    logoImg.src = "assets/images/logo-dark-theme.svg";
    themeIcon.src = "assets/images/icon-sun.svg";
  }
}

applyTheme(savedTheme);

themeSwitchBtn.addEventListener("click", () => {
  const newTheme = document.documentElement.classList.contains("light")
    ? "dark"
    : "light";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
});

const filterBtns = document.getElementById("filter-buttons");

filterBtns.addEventListener("click", (e) => {
  const clickedBtn = e.target;

  if (clickedBtn.tagName !== "BUTTON") return;

  const allButtons = filterBtns.querySelectorAll("button");

  allButtons.forEach((btn) => {
    btn.classList.remove("active-filter");
  });

  clickedBtn.classList.add("active-filter");
  currentFilter = clickedBtn.dataset.filter;
  refreshUI();
});

defaultState(extensionsArray);

extensionsContainer.addEventListener("click", (e) => {
  const clickedBtn = e.target;

  if (clickedBtn.tagName === "BUTTON") {
    extensionsArray = extensionsArray.filter(
      (ext) => ext.name !== clickedBtn.dataset.name
    );
  } else if (e.target.closest("label")) {
    const checkbox = e.target
      .closest("label")
      .querySelector('input[type="checkbox"]');
    const toggledExtension = checkbox.dataset.name;
    extensionsArray = extensionsArray.map((ext) => {
      if (ext.name === toggledExtension) {
        return { ...ext, isActive: !ext.isActive };
      }
      return ext;
    });
  }

  refreshUI();
});

function renderExtensions(array) {
  const html = array
    .map((extension) => {
      return `
  <div class="bg-[var(--bg-header)] rounded-2xl px-4 py-6 border border-[var(--border)] w-full  shadow-sm">
    <div class="flex gap-4 items-start">
      <img src="${extension.logo}" class="w-12 h-12" alt="${extension.name}" />
      <div class="flex flex-col gap-1">
        <p class="font-bold text-lg text-[var(--text-main)] leading-tight">${
          extension.name
        }</p>
        <p class="text-[var(--text-muted)] text-sm">
          ${extension.description}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between mt-8">
      <button class="bg-[var(--bg-button)] text-[var(--text-main)] px-5 py-1.5 rounded-full border border-[var(--border)] hover:bg-[var(--accent)] transition-colors cursor-pointer text-sm font-medium" data-name="${
        extension.name
      }">
        Remove
      </button>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" ${
          extension.isActive ? "checked" : ""
        } data-name="${extension.name}" />
        <div class="group peer w-11 h-6 bg-gray-500 rounded-full duration-300 peer-checked:bg-[var(--accent)] after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
      </label>
    </div>
  </div>
`;
    })
    .join("");
  return html;
}

function defaultState() {
  filterBtns.firstElementChild.classList.add("active-filter");

  refreshUI();
}

function refreshUI() {
  let listToDraw = extensionsArray;

  if (currentFilter === "active") {
    listToDraw = extensionsArray.filter((ex) => ex.isActive);
  } else if (currentFilter === "inactive") {
    listToDraw = extensionsArray.filter((ex) => !ex.isActive);
  }

  extensionsContainer.innerHTML = renderExtensions(listToDraw);
}
