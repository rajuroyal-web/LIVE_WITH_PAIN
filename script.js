let currentDate = new Date().toISOString().split('T')[0];
let data = JSON.parse(localStorage.getItem('dailyOrganizerData')) || {};
let isEditMode = false;
const password = '@The_yuvaraj';

function renderAll() {
    document.getElementById('dateInput').value = currentDate;
    renderMood();
    renderEnergyLevel();
    renderWeather();
    renderSleepSchedule();
    renderTodoList();
    renderMotivation();
    renderGoals();
    renderExpenseTracker();
    renderHabits();
    renderWaterIntake();
    renderNotes();
    renderMeals();
    updateEditableState();
    renderCalendar();
}

function updateEditableState() {
    const editableElements = document.querySelectorAll('input:not([type="date"]), textarea, select, .addMeal, #addTodo, #addGoal, #addTransaction');
    editableElements.forEach(el => {
        el.disabled = !isEditMode;
    });
    document.getElementById('saveButton').disabled = !isEditMode;
}

function setMood(mood) {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        data[currentDate].mood = mood;
        renderMood();
    }
}

function renderMood() {
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === data[currentDate]?.mood);
    });
}

function setEnergyLevel(level) {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        data[currentDate].energyLevel = level;
        renderEnergyLevel();
    }
}

function renderEnergyLevel() {
    document.querySelectorAll('.energy-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.energy <= (data[currentDate]?.energyLevel || 0));
    });
}

function setWeather(weather) {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        data[currentDate].weather = weather;
        renderWeather();
    }
}

function renderWeather() {
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.weather === data[currentDate]?.weather);
    });
}

function renderSleepSchedule() {
    document.getElementById('wakeTime').value = data[currentDate]?.wakeTime || '';
    document.getElementById('sleepTime').value = data[currentDate]?.sleepTime || '';
}

function addTodo() {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        if (!data[currentDate].todos) data[currentDate].todos = [];
        data[currentDate].todos.push({ text: '', completed: false });
        renderTodoList();
    }
}

function renderTodoList() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    data[currentDate]?.todos?.forEach((todo, index) => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item d-flex align-items-center mb-2';
        todoItem.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} class="form-check-input me-2">
            <input type="text" value="${todo.text}" placeholder="Enter task..." class="form-control me-2">
            <button class="btn btn-danger btn-sm">Delete</button>
        `;
        todoItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            if (isEditMode) {
                data[currentDate].todos[index].completed = e.target.checked;
            }
        });
        todoItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
            if (isEditMode) {
                data[currentDate].todos[index].text = e.target.value;
            }
        });
        todoItem.querySelector('button').addEventListener('click', () => {
            if (isEditMode) {
                data[currentDate].todos.splice(index, 1);
                renderTodoList();
            }
        });
        todoList.appendChild(todoItem);
    });
}

function renderMotivation() {
    document.getElementById('motivation').value = data[currentDate]?.motivation || '';
}

function addGoal() {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        if (!data[currentDate].goals) data[currentDate].goals = [];
        data[currentDate].goals.push({ text: '', completed: false });
        renderGoals();
    }
}

function renderGoals() {
    const goalList = document.getElementById('goalList');
    goalList.innerHTML = '';
    data[currentDate]?.goals?.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.className = 'goal-item d-flex align-items-center mb-2';
        goalItem.innerHTML = `
            <input type="checkbox" ${goal.completed ? 'checked' : ''} class="form-check-input me-2">
            <input type="text" value="${goal.text}" placeholder="Enter goal..." class="form-control me-2">
            <button class="btn btn-danger btn-sm">Delete</button>
        `;
        goalItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            if (isEditMode) {
                data[currentDate].goals[index].completed = e.target.checked;
            }
        });
        goalItem.querySelector('input[type="text"]').addEventListener('input', (e) => {
            if (isEditMode) {
                data[currentDate].goals[index].text = e.target.value;
            }
        });
        goalItem.querySelector('button').addEventListener('click', () => {
            if (isEditMode) {
                data[currentDate].goals.splice(index, 1);
                renderGoals();
            }
        });
        goalList.appendChild(goalItem);
    });
}

function addTransaction() {
    if (isEditMode) {
        const type = document.getElementById('transactionType').value;
        const category = document.getElementById('category').value;
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;

        if (category && amount) {
            if (!data[currentDate]) data[currentDate] = {};
            if (!data[currentDate].transactions) data[currentDate].transactions = [];
            data[currentDate].transactions.push({ type, category, amount, description });
            renderExpenseTracker();
            
            document.getElementById('category').value = '';
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
        }
    }
}

function renderExpenseTracker() {
    const transactionList = document.getElementById('transactionList');
    transactionList.innerHTML = '';
    let balance = 0;

    data[currentDate]?.transactions?.forEach((transaction, index) => {
        const transactionItem = document.createElement('div');
        transactionItem.className = `transaction-item d-flex justify-content-between align-items-center mb-2 ${transaction.type}`;
        transactionItem.innerHTML = `
            <div>
                <strong>${transaction.category}</strong>
                <small class="text-muted d-block">${transaction.description}</small>
            </div>
            <div class="d-flex align-items-center">
                <span class="me-2 ${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}$${parseFloat(transaction.amount).toFixed(2)}
                </span>
                <button class="btn btn-danger btn-sm">Delete</button>
            </div>
        `;
        transactionItem.querySelector('button').addEventListener('click', () => {
            if (isEditMode) {
                data[currentDate].transactions.splice(index, 1);
                renderExpenseTracker();
            }
        });
        transactionList.appendChild(transactionItem);

        balance += transaction.type === 'income' ? parseFloat(transaction.amount) : -parseFloat(transaction.amount);
    });

    const balanceElement = document.getElementById('balance');
    balanceElement.textContent = `Balance: $${balance.toFixed(2)}`;
    balanceElement.className = balance >= 0 ? 'text-success' : 'text-danger';
}

function renderHabits() {
    const habitList = document.getElementById('habitList');
    habitList.innerHTML = '';
    
    const defaultHabits = ['Read', 'Exercise', 'Meditate'];
    defaultHabits.forEach((habit, index) => {
        const habitItem = document.createElement('div');
        habitItem.className = 'form-check';
        habitItem.innerHTML = `
            <input class="form-check-input" type="checkbox" id="habit-${index}" ${data[currentDate]?.habits?.[index] ? 'checked' : ''}>
            <label class="form-check-label" for="habit-${index}">${habit}</label>
        `;
        habitItem.querySelector('input').addEventListener('change', (e) => {
            if (isEditMode) {
                if (!data[currentDate]) data[currentDate] = {};
                if (!data[currentDate].habits) data[currentDate].habits = [];
                data[currentDate].habits[index] = e.target.checked;
            }
        });
        habitList.appendChild(habitItem);
    });
}

function renderWaterIntake() {
    const waterIntake = document.getElementById('waterIntake');
    waterIntake.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        const waterButton = document.createElement('button');
        waterButton.className = `btn btn-outline-primary ${data[currentDate]?.waterIntake?.[i] ? 'active' : ''}`;
        waterButton.innerHTML = '<i class="fas fa-tint"></i>';
        waterButton.addEventListener('click', () => {
            if (isEditMode) {
                if (!data[currentDate]) data[currentDate] = {};
                if (!data[currentDate].waterIntake) data[currentDate].waterIntake = Array(8).fill(false);
                data[currentDate].waterIntake[i] = !data[currentDate].waterIntake[i];
                renderWaterIntake();
            }
        });
        waterIntake.appendChild(waterButton);
    }
}

function renderNotes() {
    document.getElementById('notes').value = data[currentDate]?.notes || '';
}

function addMealItem(meal) {
    if (isEditMode) {
        if (!data[currentDate]) data[currentDate] = {};
        if (!data[currentDate].meals) data[currentDate].meals = {};
        if (!data[currentDate].meals[meal]) data[currentDate].meals[meal] = [];
        data[currentDate].meals[meal].push({ text: '' });
        renderMeals();
    }
}

function renderMeals() {
    ['breakfast', 'lunch', 'dinner', 'snacks'].forEach(meal => {
        const mealItems = document.getElementById(`${meal}Items`);
        mealItems.innerHTML = '';
        
        data[currentDate]?.meals?.[meal]?.forEach((item, index) => {
            const mealItem = document.createElement('div');
            mealItem.className = 'meal-item d-flex align-items-center mb-2';
            mealItem.innerHTML = `
                <input type="text" value="${item.text}" placeholder="Enter ${meal} item..." class="form-control me-2">
                <button class="btn btn-danger btn-sm">Delete</button>
            `;
            mealItem.querySelector('input').addEventListener('input', (e) => {
                if (isEditMode) {
                    data[currentDate].meals[meal][index].text = e.target.value;
                }
            });
            mealItem.querySelector('button').addEventListener('click', () => {
                if (isEditMode) {
                    data[currentDate].meals[meal].splice(index, 1);
                    renderMeals();
                }
            });
            mealItems.appendChild(mealItem);
        });
    });
}

function saveData() {
    if (isEditMode) {
        localStorage.setItem('dailyOrganizerData', JSON.stringify(data));
        alert('Data saved successfully!');
        isEditMode = false;
        updateEditableState();
        renderCalendar();
    }
}

function renderCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    calendarContainer.innerHTML = '';

    const datepicker = new Datepicker(calendarContainer, {
        autohide: true,
        format: 'yyyy-mm-dd',
        maxDate: new Date(),
        beforeShowDay: (date) => {
            const dateString = date.toISOString().split('T')[0];
            if (data[dateString]) {
                return {
                    classes: 'bg-success text-white'
                };
            } else if (date <= new Date()) {
                return {
                    classes: 'bg-danger text-white'
                };
            }
        }
    });

    datepicker.setDate(currentDate);

    datepicker.element.addEventListener('changeDate', (e) => {
        currentDate = e.detail.date.toISOString().split('T')[0];
        renderAll();
    });
}

document.getElementById('dateInput').addEventListener('change', (e) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
        currentDate = e.target.value;
        renderAll();
    } else {
        alert("You can't select future dates.");
        e.target.value = currentDate;
    }
});

document.getElementById('prevDay').addEventListener('click', () => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() - 1);
    currentDate = date.toISOString().split('T')[0];
    renderAll();
});

document.getElementById('nextDay').addEventListener('click', () => {
    const date = new Date(currentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
        date.setDate(date.getDate() + 1);
        currentDate = date.toISOString().split('T')[0];
        renderAll();
    } else {
        alert("You can't navigate to future dates.");
    }
});

document.getElementById('editButton').addEventListener('click', () => {
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    passwordModal.show();
});

document.getElementById('submitPassword').addEventListener('click', () => {
    const enteredPassword = document.getElementById('passwordInput').value;
    if (enteredPassword === password) {
        isEditMode = true;
        updateEditableState();
        bootstrap.Modal.getInstance(document.getElementById('passwordModal')).hide();
    } else {
        alert('Incorrect password');
    }
});

document.getElementById('saveButton').addEventListener('click', saveData);

document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => setMood(btn.dataset.mood));
});

document.querySelectorAll('.energy-btn').forEach(btn => {
    btn.addEventListener('click', () => setEnergyLevel(btn.dataset.energy));
});

document.querySelectorAll('.weather-btn').forEach(btn => {
    btn.addEventListener('click', () => setWeather(btn.dataset.weather));
});

document.getElementById('addTodo').addEventListener('click', addTodo);
document.getElementById('addGoal').addEventListener('click', addGoal);
document.getElementById('addTransaction').addEventListener('click', addTransaction);

document.querySelectorAll('.addMeal').forEach(btn => {
    btn.addEventListener('click', () => addMealItem(btn.dataset.meal));
});

renderAll();