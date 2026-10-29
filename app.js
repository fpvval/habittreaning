const API_URL = 'http://localhost:8000'; // Позже заменим на реальный адрес

// Telegram WebApp Init
const tg = window.Telegram.WebApp;
tg.expand();

document.getElementById('user-greeting').innerText = `Привет, ${tg.initDataUnsafe.user?.first_name || 'Друг'}!`;

async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);
        return await response.json();
    } catch (e) {
        console.error('Ошибка загрузки:', e);
        return [];
    }
}

async function addHabit() {
    const input = document.getElementById('habit-input');
    if (!input.value) return;

    await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: input.value })
    });
    input.value = '';
    renderHabits();
}

async function toggleHabit(id) {
    await fetch(`${API_URL}/habits/${id}`, { method: 'PUT' });
    renderHabits();
}

async function renderHabits() {
    const habits = await fetchData('habits');
    const list = document.getElementById('habits-list');
    list.innerHTML = habits.map(h => `
        <li class="${h.is_completed ? 'completed' : ''}">
            <div style="display: flex; align-items: center;">
                <div class="checkbox ${h.is_completed ? 'checked' : ''}" onclick="toggleHabit(${h.id})"></div>
                <span class="item-text">${h.name}</span>
            </div>
        </li>
    `).join('');
}

async function addSchedule() {
    const time = document.getElementById('sched-time');
    const task = document.getElementById('sched-task');
    if (!time.value || !task.value) return;

    await fetch(`${API_URL}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: time.value, task: task.value })
    });
    time.value = '';
    task.value = '';
    renderSchedule();
}

async function renderSchedule() {
    const items = await fetchData('schedule');
    const list = document.getElementById('schedule-list');
    list.innerHTML = items.sort((a, b) => a.time.localeCompare(b.time)).map(i => `
        <li>
            <div style="display: flex; align-items: center;">
                <span class="time-badge">${i.time}</span>
                <span class="item-text">${i.task}</span>
            </div>
        </li>
    `).join('');
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`${tab}-section`).classList.add('active');
    event.target.classList.add('active');
}

// Initial load
renderHabits();
renderSchedule();
