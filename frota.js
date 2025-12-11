// js/frota.js
import { initFirebase } from './firebase.js';
import * as XLSX from 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

(async function(){
  await initFirebase();
  const profile = JSON.parse(sessionStorage.getItem('sanesul_profile')||'null');
  if(!profile){ location.href='index.html'; return; }
  document.getElementById('logout').addEventListener('click', ()=>{ window.firebaseAuth.signOut(); sessionStorage.removeItem('sanesul_profile'); location.href='index.html'; });
  const tableBody = document.querySelector('#tableFrota tbody');
  async function load(){ tableBody.innerHTML=''; const snap = await window.firebaseDB.collection('frota').get(); let i=1; snap.forEach(doc=>{ const r=doc.data(); if(profile.nivel==='cidade' && r.cidade!==profile.selectedCity) return; const tr=document.createElement('tr'); tr.innerHTML=`<td>${i++}</td><td>${r.cidade||''}</td><td>${r.veiculo||''}</td><td>${r.placa||''}</td><td>${r.kmFinal||''}</td><td>${r.kmRodado||''}</td><td>${r.litros||''}</td>`; tableBody.appendChild(tr); }); }
  await load();
  document.getElementById('saveVeic').addEventListener('click', async ()=>{
    const obj = {
      cidade: document.getElementById('cidade').value || profile.selectedCity || '',
      veiculo: document.getElementById('veiculo').value,
      placa: document.getElementById('placa').value,
      kmInicial: Number(document.getElementById('kmInicial').value)||0,
      kmFinal: Number(document.getElementById('kmFinal').value)||0,
      kmRodado: 0,
      litros: Number(document.getElementById('litros').value)||0,
      valorAbast: Number(document.getElementById('valorAbast').value)||0,
      proxRev: document.getElementById('proxRev').value||'',
      custoManut: 0
    };
    obj.kmRodado = obj.kmFinal - obj.kmInicial;
    await window.firebaseDB.collection('frota').add(obj);
    document.getElementById('msg').innerText = 'Salvo.'; await load();
  });

  window.importVeic = async function(){
    const f = document.getElementById('fileImportVeic').files[0];
    if(!f) return alert('Selecione arquivo');
    const reader = new FileReader();
    reader.onload = async (e)=>{
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, {type:'array'});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      for(const r of rows){ await window.firebaseDB.collection('frota').add(r); }
      alert('Importado.');
      await load();
    };
    reader.readAsArrayBuffer(f);
  };
})();
