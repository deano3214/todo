let todo = JSON.parse(localStorage.getItem("todo")) || [];

const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");
const todoDone = document.getElementById("todoDone");
const dayName = document.getElementById("dayName");
const dayNumber = document.getElementById("dayNumber");
const completedList = document.getElementById("completedList");
const categoryInput = document.getElementById("categoryInput");
const progressRing = document.getElementById("progressRing");
const progressText = document.getElementById("progressText");
const navButtons = document.querySelectorAll(".nav-btn");
const doneCountText = document.getElementById("doneCount");
const doneList = document.getElementById("doneList");
const listsContainer = document.getElementById("listsContainer");
const dateInput = document.getElementById("dateInput");
const upcomingContainer = document.getElementById ("upcomingContainer")

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  addButton.addEventListener("click", addTask);
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  deleteButton.addEventListener("click", deleteAllTasks);
  displayTasks();
  showDate();

  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll(".view").forEach((view) => view.classList.add("hidden"));
      document.getElementById(`${button.dataset.view}-view`).classList.remove("hidden");
    });
  });
});


function showDate() {
  const today = new Date();
  dayName.textContent = today.toLocaleDateString("en-AU", { weekday: "long" });
  dayNumber.textContent = today.getDate();
}

function addTask() {
  const newTask = todoInput.value.trim();
  if (newTask !== "") {
    todo.push({
      text: newTask,
      disabled: false,
      category: categoryInput.value, 
      date: dateInput.value,
    });
    saveToLocalStorage();
    todoInput.value = "";
    displayTasks();
  }
}

function deleteAllTasks() {
  todo = [];
  saveToLocalStorage();
  displayTasks();
}

function displayTasks() {
  todoList.innerHTML = "";
  completedList.innerHTML = "";
  doneList.innerHTML = "";

  todo.forEach((item, index) => {
    const container = document.createElement("div");
    container.className = "todo-container";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.id = `input-${index}`;
    checkbox.checked = item.disabled;
    checkbox.addEventListener("change", () => toggleTask(index));

    const text = document.createElement("p");
    text.id = `todo-${index}`;
    text.className = item.disabled ? "disabled" : "";
    text.textContent = item.text;
    text.addEventListener("click", () => editTask(index));

    const category = item.category || "personal";

    const tag = document.createElement("span");
    tag.className = `tag ${category}`;
    tag.textContent = category;

    container.append(checkbox, text, tag);

    if (item.disabled) {
      completedList.appendChild(container);

      const doneItem = document.createElement("p");
      doneItem.textContent = item.text;
      doneList.appendChild(doneItem);
    } else {
      todoList.appendChild(container);
    }
  });

  if (todoCount) {
    todoCount.textContent = todo.length;
  }

  const doneCount = todo.filter((item) => item.disabled).length;

  if (todoDone) {
    todoDone.textContent = doneCount;
  }

  doneCountText.textContent = doneCount;

  const percent = todo.length === 0 ? 0 : Math.round((doneCount / todo.length) * 100);
  progressText.textContent = `${percent}%`;
    progressRing.style.setProperty("--progress", `${percent}%`);

  showLists();
   showUpcoming();
}

function showLists() {
  listsContainer.innerHTML = "";

  const categories = ["personal", "work", "school", "health"];

  categories.forEach((name) => {
    const count = todo.filter((item) => (item.category || "personal") === name).length;

    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.className = `tag ${name}`;
    label.textContent = name;

    const number = document.createElement("span");
    number.className = "list-count";
    number.textContent = count;

    row.append(label, number);
    listsContainer.appendChild(row);
  });
}

function showUpcoming() {
  upcomingContainer.innerHTML = "";

  const dated = todo.filter((item) => !item.disabled && item.date);
  const days = [...new Set(dated.map((item) => item.date))].sort();

  if (days.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-text";
    empty.textContent = "No upcoming tasks";
    upcomingContainer.appendChild(empty);
    return;
  }

  days.forEach((day) => {
    const heading = document.createElement("p");
    heading.className = "day-heading";
    heading.textContent = new Date(day + "T00:00:00").toLocaleDateString("en-AU", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    upcomingContainer.appendChild(heading);

    dated
      .filter((item) => item.date === day)
      .forEach((item) => {
        const row = document.createElement("div");
        row.className = "upcoming-row";

        const name = document.createElement("p");
        name.textContent = item.text;

        const tag = document.createElement("span");
        const category = item.category || "personal";
        tag.className = `tag ${category}`;
        tag.textContent = category;

        row.append(name, tag);
        upcomingContainer.appendChild(row);
      });
  });
}

function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text;
  const inputElement = document.createElement("input");

  inputElement.value = existingText;
  todoItem.replaceWith(inputElement);
  inputElement.focus();

  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim();
    if (updatedText) {
      todo[index].text = updatedText;
      saveToLocalStorage();
    }
    displayTasks();
  });
}

function toggleTask(index) {
 todo[index].disabled = !todo[index].disabled;
  saveToLocalStorage();
  displayTasks();
}

function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo));
}