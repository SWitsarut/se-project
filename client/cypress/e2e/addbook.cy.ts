beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
})

describe('Add book', () => {

  it('should redirect to homepage', () => {
    cy.visit('/');

    cy.get('h1').click();
    cy.get('[href="/login"]').click()

    const username = 'admin@email.com'
    const password = 'adminadmin'
    cy.get('[name=username]').type(`${username}{enter}`)
    cy.get('[name=password]').type(`${password}{enter}`)
  })
})