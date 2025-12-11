# Sanesul - Controle de Frota e Equipamentos

Project ready for GitHub + Render static hosting with Firebase.

Files:
- index.html
- painel.html
- frota.html
- equipamentos.html
- js/
- css/styles.css
- firebase-config.js

Deploy: push to GitHub (root), then Render Static Site, Publish Directory: ./

Firebase: enable Auth (Email/Password), create Firestore, create first user in Auth and add document in `users` collection with ID = UID and fields:
{ "user":"email", "nivel":"admin|supervisor|cidade", "cidade":"NomeDaCidade" }
