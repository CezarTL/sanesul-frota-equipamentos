// app.js (ES Modules)
// Minimal starter that initializes Firebase (compat) and provides login + basic Firestore usage.
// This is a concise implementation — expand as needed.

import { firebaseConfig } from './firebase-config.js';

async function loadFirebaseCompat(){
  if(window.firebaseApp) return;
  // load compat libs
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
  await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js');
  window.firebaseApp = firebase.initializeApp(firebaseConfig);
  window.firebaseAuth = firebase.auth();
  window.firebaseDB = firebase.firestore();
  console.log('Firebase compat initialized');
}

const inputEmail = document.getElementById('inputEmail');
const inputPass = document.getElementById('inputPass');
const btnLogin = document.getElementById('btnLogin');
const loginMsg = document.getElementById('loginMsg');
const loginSection = document.getElementById('login-section');
const appSection = document.getElementById('app-section');
const welcome = document.getElementById('welcome');
const btnLogout = document.getElementById('btnLogout');
const content = document.getElementById('content');

btnLogin.addEventListener('click', async ()=>{
  const email = inputEmail.value.trim();
  const pass = inputPass.value.trim();
  if(!email || !pass){ loginMsg.textContent = 'Informe email e senha'; return; }
  loginMsg.textContent = 'Entrando...';
  try{
    await loadFirebaseCompat();
    const cred = await window.firebaseAuth.signInWithEmailAndPassword(email, pass);
    const uid = cred.user.uid;
    // load profile
    const doc = await window.firebaseDB.collection('users').doc(uid).get();
    if(!doc.exists){ loginMsg.textContent = 'Usuário sem perfil. Peça ao ADM para criar o perfil.'; return; }
    const perfil = doc.data();
    sessionStorage.setItem('sanesul_user', JSON.stringify({uid, ...perfil}));
    onLogin({uid, ...perfil});
  }catch(err){
    console.error(err);
    loginMsg.textContent = 'Erro: '+err.message;
  }
});

btnLogout.addEventListener('click', async ()=>{
  if(window.firebaseAuth) await window.firebaseAuth.signOut();
  sessionStorage.removeItem('sanesul_user');
  location.reload();
});

async function onLogin(profile){
  loginSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  welcome.textContent = `${profile.user} — ${profile.nivel}`;
  // render basic dashboard and controls
  renderMain(profile);
}

function renderMain(profile){
  content.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = 'Painel';
  content.appendChild(h);

  // quick actions
  const btnMigrate = document.createElement('button');
  btnMigrate.textContent = 'Migrar dados locais para Firestore';
  btnMigrate.addEventListener('click', migrateLocalToFirestore);
  content.appendChild(btnMigrate);

  const btnOpenVeic = document.createElement('button');
  btnOpenVeic.textContent = 'Abrir Controle de Veículos';
  btnOpenVeic.addEventListener('click', ()=>openVeiculos(profile));
  content.appendChild(btnOpenVeic);

  const btnOpenEquip = document.createElement('button');
  btnOpenEquip.textContent = 'Abrir Controle de Equipamentos';
  btnOpenEquip.addEventListener('click', ()=>openEquipamentos(profile));
  content.appendChild(btnOpenEquip);
}

async function openVeiculos(profile){
  content.innerHTML = '<h4>Veículos</h4>';
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>#</th><th>Cidade</th><th>Veículo</th><th>Placa</th><th>KM Final</th></tr></thead><tbody></tbody>';
  wrap.appendChild(table);
  content.appendChild(wrap);

  // load frota collection
  const snap = await window.firebaseDB.collection('frota').get();
  snap.forEach((doc, idx)=>{
    const r = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${r.cidade||''}</td><td>${r.veiculo||''}</td><td>${r.placa||''}</td><td>${r.kmFinal||''}</td>`;
    table.querySelector('tbody').appendChild(tr);
  });
}

async function openEquipamentos(profile){
  content.innerHTML = '<h4>Equipamentos</h4>';
  const wrap = document.createElement('div');
  wrap.className = 'table-wrap';
  const table = document.createElement('table');
  table.innerHTML = '<thead><tr><th>#</th><th>Cidade</th><th>Tipo</th><th>Código</th><th>Horas</th></tr></thead><tbody></tbody>';
  wrap.appendChild(table);
  content.appendChild(wrap);

  const snap = await window.firebaseDB.collection('equipamentos').get();
  snap.forEach((doc, idx)=>{
    const r = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${idx+1}</td><td>${r.cidade||''}</td><td>${r.tipo||''}</td><td>${r.codigo||''}</td><td>${r.horas||''}</td>`;
    table.querySelector('tbody').appendChild(tr);
  });
}

// migration helper: send localStorage items to Firestore
async function migrateLocalToFirestore(){
  if(!confirm('Enviar dados locais (frota/equip) para o Firestore?')) return;
  await loadFirebaseCompat();
  const localF = JSON.parse(localStorage.getItem('frota')) || [];
  const localE = JSON.parse(localStorage.getItem('equip')) || [];
  for(const r of localF){ await window.firebaseDB.collection('frota').add(r); }
  for(const e of localE){ await window.firebaseDB.collection('equipamentos').add(e); }
  alert('Migração concluída.');
}

// auto-login if session exists
(function(){
  const s = sessionStorage.getItem('sanesul_user');
  if(s){ const p = JSON.parse(s); onLogin(p); }
})();
