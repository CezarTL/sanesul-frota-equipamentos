// js/auth.js
import { initFirebase } from './firebase.js';

const btnLogin = document.getElementById('btnLogin');
const email = document.getElementById('email');
const pass = document.getElementById('pass');
const city = document.getElementById('city');
const msg = document.getElementById('msg');

btnLogin.addEventListener('click', async ()=>{
  msg.textContent = '';
  if(!email.value || !pass.value || !city.value){ msg.textContent = 'Preencha email, senha e cidade.'; return; }
  try{
    await initFirebase();
    const cred = await window.firebaseAuth.signInWithEmailAndPassword(email.value.trim(), pass.value.trim());
    const uid = cred.user.uid;
    const doc = await window.firebaseDB.collection('users').doc(uid).get();
    if(!doc.exists){ msg.textContent = 'Usuário autenticado, mas perfil não encontrado no Firestore.'; return; }
    const perfil = doc.data();
    if(perfil.nivel==='cidade' && perfil.cidade !== city.value){ msg.textContent = 'Você não tem permissão para acessar essa cidade.'; return; }
    sessionStorage.setItem('sanesul_profile', JSON.stringify({uid, ...perfil, selectedCity: city.value}));
    window.location.href = 'painel.html';
  }catch(err){
    console.error(err);
    msg.textContent = err.message || 'Erro ao autenticar';
  }
});
