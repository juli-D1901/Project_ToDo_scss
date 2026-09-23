// ==========================================
// TODO LIST
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const currentDay = document.querySelector("#currentDay");
const currentDate = document.querySelector("#currentDate");

const searchInput = document.querySelector("#searchInput");

const tasksContainer = document.querySelector("#tasksContainer");

const addButton = document.querySelector("#addButton");

const modal = document.querySelector("#modal");

const descriptionInput =
    document.querySelector("#descriptionInput");

const dateInput =
    document.querySelector("#dateInput");

const reminderInput =
    document.querySelector("#reminderInput");

const saveButton =
    document.querySelector("#saveButton");

const cancelButton =
    document.querySelector("#cancelButton");

const filters =
    document.querySelectorAll(".filter");


// ==========================================
// DATA
// ==========================================

let tasks =
    JSON.parse(localStorage.getItem("tasks")) || [];


// ID задачи, которую редактируем

let editingTaskId = null;


// Активный фильтр

let currentFilter = "all";


// ==========================================
// CURRENT DATE
// ==========================================

function updateCurrentDate() {

    const today = new Date();


    const day = new Intl.DateTimeFormat("ru-RU", {
        weekday: "long"
    }).format(today);


    const date = new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long"
    }).format(today);


    currentDay.textContent =
        day.charAt(0).toUpperCase() + day.slice(1);


    currentDate.textContent = date;

}


// Показываем текущую дату

updateCurrentDate();


// Проверяем дату каждый час

setInterval(
    updateCurrentDate,
    60 * 60 * 1000
);


// ==========================================
// CURRENT DATE + TIME
// ==========================================

// Получаем текущую дату и время
// в формате, который понимает datetime-local

function getCurrentDateTime() {

    const now = new Date();


    const year =
        now.getFullYear();


    const month =
        String(now.getMonth() + 1)
            .padStart(2, "0");


    const day =
        String(now.getDate())
            .padStart(2, "0");


    const hours =
        String(now.getHours())
            .padStart(2, "0");


    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");


    return `${year}-${month}-${day}T${hours}:${minutes}`;

}


// ==========================================
// SET MINIMUM DATE + TIME
// ==========================================

function setMinimumDateTime() {

    dateInput.min = getCurrentDateTime();

}


// ==========================================
// LOCAL STORAGE
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// FORMAT TASK DATE
// ==========================================

function formatTaskDate(dateTime) {

    if (!dateTime) {

        return "Без даты";

    }


    const date =
        new Date(dateTime);


    return new Intl.DateTimeFormat(
        "ru-RU",
        {
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(date);

}


// ==========================================
// OPEN MODAL
// ==========================================

function openModal() {

    modal.style.display = "block";


    // Каждый раз обновляем минимальное время

    setMinimumDateTime();

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeModal() {

    modal.style.display = "none";


    descriptionInput.value = "";

    dateInput.value = "";

    reminderInput.checked = false;


    editingTaskId = null;


    saveButton.textContent = "Добавить";

}


// ==========================================
// CREATE TASK ELEMENT
// ==========================================

function createTaskElement(task) {

    // ======================================
    // CARD
    // ======================================

    const article =
        document.createElement("article");


    article.className = "task";


    // Если задача выполнена

    if (task.completed) {

        article.classList.add(
            "task--completed"
        );

    }


    // ======================================
    // CHECKBOX
    // ======================================

    const label =
        document.createElement("label");


    label.className =
        "task__checkbox";


    const checkboxInput =
        document.createElement("input");


    checkboxInput.type =
        "checkbox";


    checkboxInput.checked =
        task.completed;


    const checkbox =
        document.createElement("span");


    checkbox.className =
        "checkbox";


    const checkIcon =
        document.createElement("span");


    checkIcon.className =
        "material-icons";


    checkIcon.textContent =
        "check";


    checkbox.appendChild(
        checkIcon
    );


    label.appendChild(
        checkboxInput
    );


    label.appendChild(
        checkbox
    );


    // ======================================
    // CONTENT
    // ======================================

    const content =
        document.createElement("div");


    content.className =
        "task__content";


    const date =
        document.createElement("span");


    date.className =
        "task__date";


    date.textContent =
        formatTaskDate(task.date);


    const title =
        document.createElement("p");


    title.className =
        "task__title";


    title.textContent =
        task.title;


    content.appendChild(
        date
    );


    content.appendChild(
        title
    );


    // ======================================
    // ACTIONS
    // ======================================

    const actions =
        document.createElement("div");


    actions.className =
        "task__actions";


    // ======================================
    // EDIT BUTTON
    // ======================================

    const editButton =
        document.createElement("button");


    editButton.className =
        "task__edit";


    editButton.setAttribute(
        "aria-label",
        "Редактировать"
    );


    editButton.innerHTML = `
        <span class="material-icons">
            edit
        </span>
    `;


    // ======================================
    // DELETE BUTTON
    // ======================================

    const deleteButton =
        document.createElement("button");


    deleteButton.className =
        "task__delete";


    deleteButton.setAttribute(
        "aria-label",
        "Удалить"
    );


    deleteButton.innerHTML = `
        <span class="material-icons">
            delete
        </span>
    `;


    // Добавляем кнопки

    actions.appendChild(
        editButton
    );


    actions.appendChild(
        deleteButton
    );


    // ======================================
    // ADD TO CARD
    // ======================================

    article.appendChild(
        label
    );


    article.appendChild(
        content
    );


    article.appendChild(
        actions
    );


    // ======================================
    // CHECKBOX
    // ======================================

    checkboxInput.addEventListener(
        "change",
        function () {

            task.completed =
                checkboxInput.checked;


            saveTasks();

            renderTasks();

        }
    );


    // ======================================
    // EDIT
    // ======================================

    editButton.addEventListener(
        "click",
        function () {

            editingTaskId =
                task.id;


            descriptionInput.value =
                task.title;


            dateInput.value =
                task.date || "";


            reminderInput.checked =
                task.reminder || false;


            saveButton.textContent =
                "Сохранить";


            openModal();

        }
    );


    // ======================================
    // DELETE
    // ======================================

    deleteButton.addEventListener(
        "click",
        function () {

            tasks =
                tasks.filter(
                    function (item) {

                        return item.id !== task.id;

                    }
                );


            saveTasks();

            renderTasks();

        }
    );


    return article;

}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks() {

    tasksContainer.innerHTML = "";


    // Текст поиска

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    // Фильтруем задачи

    const filteredTasks =
        tasks.filter(
            function (task) {


                // ==========================
                // STATUS FILTER
                // ==========================

                if (
                    currentFilter === "active" &&
                    task.completed
                ) {

                    return false;

                }


                if (
                    currentFilter === "completed" &&
                    !task.completed
                ) {

                    return false;

                }


                // ==========================
                // SEARCH
                // ==========================

                if (
                    searchText &&
                    !task.title
                        .toLowerCase()
                        .includes(searchText)
                ) {

                    return false;

                }


                return true;

            }
        );


    // ======================================
    // CREATE CARDS
    // ======================================

    filteredTasks.forEach(
        function (task) {

            const taskElement =
                createTaskElement(task);


            tasksContainer.appendChild(
                taskElement
            );

        }
    );

}


// ==========================================
// ADD / EDIT TASK
// ==========================================

saveButton.addEventListener(
    "click",
    function () {


        const title =
            descriptionInput.value.trim();


        const date =
            dateInput.value;


        const reminder =
            reminderInput.checked;


        // ==================================
        // DESCRIPTION VALIDATION
        // ==================================

        if (!title) {

            alert(
                "Введите описание задачи"
            );


            descriptionInput.focus();


            return;

        }


        // ==================================
        // DATE VALIDATION
        // ==================================

        if (!date) {

            alert(
                "Выберите дату и время"
            );


            dateInput.focus();


            return;

        }


        // ==================================
        // PAST DATE VALIDATION
        // ==================================

        const selectedDate =
            new Date(date);


        const now =
            new Date();


        if (selectedDate <= now) {

            alert(
                "Нельзя выбрать прошедшее время"
            );


            setMinimumDateTime();


            dateInput.focus();


            return;

        }


        // ==================================
        // EDIT TASK
        // ==================================

        if (editingTaskId !== null) {


            const task =
                tasks.find(
                    function (item) {

                        return item.id === editingTaskId;

                    }
                );


            if (task) {

                task.title =
                    title;


                task.date =
                    date;


                task.reminder =
                    reminder;

            }

        }


        // ==================================
        // CREATE NEW TASK
        // ==================================

        else {


            const newTask = {

                id: Date.now(),

                title: title,

                date: date,

                reminder: reminder,

                completed: false

            };


            tasks.push(
                newTask
            );

        }


        // ==================================
        // SAVE
        // ==================================

        saveTasks();


        // ==================================
        // UPDATE
        // ==================================

        renderTasks();


        // ==================================
        // CLOSE
        // ==================================

        closeModal();

    }
);


// ==========================================
// ADD BUTTON
// ==========================================

addButton.addEventListener(
    "click",
    function () {


        editingTaskId = null;


        descriptionInput.value = "";


        // Ставим текущую дату и время

        dateInput.value =
            getCurrentDateTime();


        // Но min тоже обновляем

        setMinimumDateTime();


        reminderInput.checked =
            false;


        saveButton.textContent =
            "Добавить";


        openModal();

    }
);


// ==========================================
// CANCEL BUTTON
// ==========================================

cancelButton.addEventListener(
    "click",
    function () {

        closeModal();

    }
);


// ==========================================
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        renderTasks();

    }
);


// ==========================================
// FILTERS
// ==========================================

filters.forEach(
    function (filter) {


        filter.addEventListener(
            "click",
            function () {


                // Убираем active

                filters.forEach(
                    function (item) {

                        item.classList.remove(
                            "filter--active"
                        );

                    }
                );


                // Добавляем active

                filter.classList.add(
                    "filter--active"
                );


                // Получаем фильтр

                currentFilter =
                    filter.dataset.filter;


                // Удаляем старые галочки

                filters.forEach(
                    function (item) {

                        const check =
                            item.querySelector(
                                ".filter__check"
                            );


                        if (check) {

                            check.remove();

                        }

                    }
                );


                // Добавляем галочку

                const checkIcon =
                    document.createElement(
                        "span"
                    );


                checkIcon.className =
                    "material-icons filter__check";


                checkIcon.textContent =
                    "check";


                filter.prepend(
                    checkIcon
                );


                renderTasks();

            }
        );

    }
);


// ==========================================
// INITIAL RENDER
// ==========================================

renderTasks();