// js/equipamentos.js
import { initFirebase } from './firebase.js';
import * as XLSX from 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
(async function(){
  await initFirebase();
  const profile = JSON.parse(sessionStorage.getItem('sanesul_profile')||'null');
  if(!profile){ location.href='index.html'; return; }
  document.getElementById('logoutBtn').addEventListener('click', ()=>{ window.firebaseAuth.signOut(); sessionStorage.removeItem('sanesul_profile'); location.href='index.html'; });
  const tbody = document.querySelector('#tableEquip tbody');
  async function load(){ tbody.innerHTML=''; const snap = await window.firebaseDB.collection('equipamentos').get(); let i=1; snap.forEach(doc=>{ const r=doc.data(); if(profile.nivel==='cidade' && r.cidade!==profile.selectedCity) return; const tr=document.createElement('tr'); tr.innerHTML=`<td>${i++}</td><td>${r.cidade||''}</td><td>${r.tipo||''}</td><td>${r.codigo||''}</td><td>${r.horas||''}</td><td>${r.prox||''}</td>`; tbody.appendChild(tr); }); }
  await load();
  document.getElementById('saveEquip').addEventListener('click', async ()=>{
    const obj = {
      cidade: document.getElementById('eqCidade').value || profile.selectedCity || '',
      tipo: document.getElementById('eqTipo').value,
      codigo: document.getElementById('eqCodigo').value,
      horas: Number(document.getElementById('eqHoras').value)||0,
      prox: Number(document.getElementById('eqProx').value)||0,
      custo: Number(document.getElementById('eqCusto').value)||0,
      status: document.getElementById('eqStatus') ? document.getElementById('eqStatus').value : 'Ativo'
    };
    await window.firebaseDB.collection('equipamentos').add(obj);
    document.getElementById('msg').innerText = 'Salvo.'; await load();
  });

  window.importEquip = async function(){
    const f = document.getElementById('fileImportEquip').files[0];
    if(!f) return alert('Selecione arquivo');
    const reader = new FileReader();
    reader.onload = async (e)=>{
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, {type:'array'});
      const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      for(const r of rows){ await window.firebaseDB.collection('equipamentos').add(r); }
      alert('Importado.'); await load();
    };
    reader.readAsArrayBuffer(f);
  };
})();
