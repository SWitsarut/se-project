/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(role: string): void;
  }
}
// ***********************************************
// This example commands.ts shows you how to
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
Cypress.Commands.add('login', (role) => {
  cy.visit('/login');
  const lowerCaseRole = role.toLowerCase();
  let username = '';
  const password = 'testtest';
  if (lowerCaseRole === 'publisher') {
    username = 'truepublisher';
  }
  else if (lowerCaseRole === 'admin') {
    username = 'trueadmin';
  }
  else {
    username = 'trueuser';
  }
  cy.wait(1000);
  cy.get('[name=username]').type(`${username}`);
  cy.get('[name=password]').type(`${password}{enter}`);

  // cy.url().should('not.include', '/login');
});
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
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }