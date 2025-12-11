# Sanesul - Controle de Frota e Equipamentos

Sistema pronto para deploy com Firebase (Auth + Firestore) e hospedagem estática (Render.com).

## Estrutura
- index.html
- styles.css
- app.js (ES Modules)
- firebase-config.js

## Como usar
1. No Firebase Console:
   - Habilite Authentication (Email/Password).
   - Crie Firestore database.
   - Crie o primeiro usuário no Authentication e adicione documento na coleção `users` com ID = UID e campos:
     ```json
     { "user": "email@ex.com", "nivel": "ADM", "cidade": "TODAS" }
     ```
   - Copie suas credenciais e confirme que `firebase-config.js` está preenchido.

2. Subir para GitHub e deploy no Render (Static Site).

3. Como ADM, cria usuários através do painel (ainda é possível usar console do Firebase para criar a 1a conta).

## Migração
Clique em "Migrar dados locais para Firestore" como ADM para enviar dados que estejam no localStorage.

