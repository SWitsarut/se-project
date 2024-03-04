import { timeStamp } from "console";

beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
})

describe('Add book', () => {

  it('should be able to add book', () => {
    cy.login('publisher');

    cy.get('button').contains('truepublisher', { timeout: 100000 }).should('be.visible').click();
    cy.get('button').contains('Book management', { timeout: 100000 }).should('be.visible').click();
    cy.get('button').contains('Add book', { timeout: 100000 }).should('be.visible').click();
    cy.url().should('include', '/new');

    const timestamp = new Date().getTime();
    cy.get('input').get('[placeholder=ISBN]').type(`${timestamp}`);
    cy.get('input').get('[placeholder=Title]').type(`Book${timestamp}`);
    cy.get('input').get('[placeholder=Authors]').type(`Kenshi Yoshida{enter}`);
    cy.get('input').get('[placeholder=Category]').type(`manga`);
    cy.get('input').get('[placeholder="0.00"]').type(`${timestamp / 10000}`);
    cy.get('input').get('[placeholder=Genres]').type(`vanilla{enter}ntr`);
    cy.get('textarea').type(`description`);
    cy.get('button').contains('Upload Cover').click()

  })
})