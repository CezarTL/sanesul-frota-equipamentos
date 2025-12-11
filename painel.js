// js/painel.js
import { initFirebase } from './firebase.js';
(async function(){
  await initFirebase();
  const profile = JSON.parse(sessionStorage.getItem('sanesul_profile')||'null');
  if(!profile){ location.href='index.html'; return; }
  document.getElementById('userInfo').innerText = profile.user + ' — ' + profile.nivel + (profile.selectedCity?(' / '+profile.selectedCity):'');
  const frotaSnap = await window.firebaseDB.collection('frota').get();
  const equipSnap = await window.firebaseDB.collection('equipamentos').get();
  document.getElementById('totalVeic').innerText = frotaSnap.size;
  document.getElementById('totalEquip').innerText = equipSnap.size;
  const totalGasto = frotaSnap.docs.reduce((s,d)=>s+(Number(d.data().custoManut||0)),0) + equipSnap.docs.reduce((s,d)=>s+(Number(d.data().custo||0)),0);
  document.getElementById('totalGasto').innerText = totalGasto.toFixed(2);
  const labels = ['Veículos','Equipamentos'];
  const data = [frotaSnap.size, equipSnap.size];
  const ctx = document.getElementById('chart1').getContext('2d');
  new Chart(ctx, { type:'bar', data:{labels, datasets:[{label:'Contagem', data}] } });
  document.getElementById('logoutBtn').addEventListener('click', ()=>{ window.firebaseAuth.signOut(); sessionStorage.removeItem('sanesul_profile'); location.href='index.html'; });
})();
