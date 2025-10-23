// app.js
const API = 'https://budget-and-expense-tracker-backend.onrender.com:5000/api';

const store = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user') || 'null')
};

const qs = id => document.getElementById(id);

// Auth
qs('btn-register').onclick = async () => {
  const name = qs('reg-name').value;
  const email = qs('reg-email').value;
  const password = qs('reg-pass').value;
  const res = await fetch(`${API}/auth/register`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password})
  });
  const data = await res.json();
  if (data.token) saveAuth(data);
  else alert(data.message || 'Error');
};

qs('btn-login').onclick = async () => {
  const email = qs('login-email').value;
  const password = qs('login-pass').value;
  const res = await fetch(`${API}/auth/login`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password})
  });
  const data = await res.json();
  if (data.token) saveAuth(data);
  else alert(data.message || 'Login failed');
};

function saveAuth(data){
  store.token = data.token;
  store.user = data.user;
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  showApp();
}

qs('btn-logout').onclick = () => {
  localStorage.removeItem('token'); localStorage.removeItem('user');
  store.token = null; store.user = null;
  location.reload();
}

function showApp(){
  if (!store.token) {
    qs('auth-section').classList.remove('hidden');
    qs('app-section').classList.add('hidden');
    return;
  }
  qs('auth-section').classList.add('hidden');
  qs('app-section').classList.remove('hidden');
  qs('user-info').innerText = `Hi, ${store.user.name}`;
  loadCategories();
  loadTransactions();
  loadSummary();
}

// API helpers
async function api(path, opts={}) {
  opts.headers = opts.headers || {};
  opts.headers['Content-Type'] = 'application/json';
  if (store.token) opts.headers['Authorization'] = `Bearer ${store.token}`;
  const res = await fetch(`${API}${path}`, opts);
  if (res.status === 401) { alert('Session expired, please login again'); localStorage.clear(); location.reload(); }
  return res.json();
}

// Categories -> populate selects
async function loadCategories(){
  const cats = await api('/categories');
  const catSelect = qs('tx-category'); const budgetSelect = qs('budget-category');
  catSelect.innerHTML=''; budgetSelect.innerHTML='';
  cats.forEach(c => {
    const o = document.createElement('option'); o.value = c.id; o.textContent = `${c.name} (${c.type})`;
    catSelect.appendChild(o);
    budgetSelect.appendChild(o.cloneNode(true));
  });
}

// Add transaction
qs('btn-add-tx').onclick = async () => {
  const category_id = qs('tx-category').value;
  const type = qs('tx-type').value;
  const amount = qs('tx-amount').value;
  const date = qs('tx-date').value;
  const note = qs('tx-note').value;
  if (!amount || !date) return alert('Amount and date required');
  await api('/transactions', { method:'POST', body:JSON.stringify({ category_id, type, amount, date, note }) });
  qs('tx-amount').value=''; qs('tx-note').value='';
  loadTransactions(); loadSummary();
};

// Set budget
qs('btn-set-budget').onclick = async () => {
  const category_id = qs('budget-category').value;
  const limit_amount = qs('budget-amount').value;
  const month = qs('budget-month').value || new Date().toISOString().slice(0,7);
  if (!limit_amount) return alert('Provide budget amount');
  await api('/budgets', { method:'POST', body:JSON.stringify({ category_id, limit_amount, month }) });
  alert('Budget set');
};

// Transactions list
async function loadTransactions(){
  const tx = await api('/transactions');
  const list = qs('tx-list'); list.innerHTML='';
  tx.forEach(t => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${t.category_name}</strong> ${t.note ? '- '+t.note : ''}<div style="font-size:0.9em;color:#666">${t.date}</div></div><div>${t.type} ${parseFloat(t.amount).toFixed(2)} <button data-id="${t.id}" class="del">Del</button></div>`;
    list.appendChild(li);
  });
  document.querySelectorAll('.del').forEach(btn => btn.onclick = async e => {
    const id = e.target.dataset.id;
    await api(`/transactions/${id}`, { method:'DELETE' });
    loadTransactions(); loadSummary();
  });
}

// Summary -> chart
async function loadSummary(){
  const data = await api('/transactions/summary/by-category');
  const labels = data.map(d => d.name);
  const values = data.map(d => parseFloat(d.total));
  renderChart(labels, values);
}

let chart;
function renderChart(labels, values){
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (chart) chart.destroy();
  chart = new Chart(ctx, { type:'pie', data:{ labels, datasets:[{ data: values }] }});
}

// Init
showApp();
