// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//fazendo conexão com o firebase para autenticação
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: 'AIzaSyBSMFCnmzQZn00gqeLlJa9ES0PDGxXAaX8',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

firebase.initializeApp(firebaseConfig);

Cypress.Commands.add("renderReCaptcha", () => {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-cy');
  recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
  });

})

// const appVerifier = window.recaptchaVerifier;

// criando comando de login
Cypress.Commands.add("login", (phoneNumber = '3288888-8888', code='123456') =>{
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      .then((confirmationResult) => {
        confirmationResult.confirm(code).then((result) => {
          // User signed in successfully.
          const user = result.user;
          // ...
        }).catch((error) => {
          // User couldn't sign in (bad verification code?)
          // ...
        });
        // ...
      }).catch((error) => {
        // Error; SMS not sent
        // ...
      });

});


Cypress.Commands.add("logout", ()=>{
    return firebase.auth().signOut();
})