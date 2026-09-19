const items = [
  "Check tire pressure",
  "Verify fresh-water level",
  "Confirm campground reservation",
  "Test backup camera",
  "Check propane level",
  "Secure loose interior items",
  "Check fire extinguisher",
  "Inspect exterior lights",
  "Check generator oil level"
];

const STORAGE_KEY = "rv-checklist-state-v1";

const checklist = document.querySelector("#checklist");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const checkAllButton = document.querySelector("#checkAllButton");
const resetButton = document.querySelector("#resetButton");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved) && saved.length === items.length) {
      return saved.map(Boolean);
    }
  } catch {
    // Ignore damaged local data and start clean.
  }
  return items.map(() => false);
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateProgress() {
  const completed = state.filter(Boolean).length;
  const percent = (completed / items.length) * 100;
  progressText.textContent = `${completed} of ${items.length} complete`;
  progressBar.style.width = `${percent}%`;
  checkAllButton.textContent = completed === items.length ? "All checked" : "Check all";
  checkAllButton.disabled = completed === items.length;
}

function render() {
  checklist.innerHTML = "";

  items.forEach((item, index) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    const text = document.createElement("span");

    checkbox.type = "checkbox";
    checkbox.checked = state[index];
    checkbox.addEventListener("change", () => {
      state[index] = checkbox.checked;
      saveState();
      updateProgress();
    });

    text.textContent = item;
    label.append(checkbox, text);
    li.append(label);
    checklist.append(li);
  });

  updateProgress();
}

checkAllButton.addEventListener("click", () => {
  state = items.map(() => true);
  saveState();
  render();
});

resetButton.addEventListener("click", () => {
  state = items.map(() => false);
  saveState();
  render();
});

render();
