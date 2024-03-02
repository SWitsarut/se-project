before(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
})

describe('register as user', () => {

  it('should be able to register', () => {
    cy.visit('/');

    cy.get('h1').should('be.visible').click()
    cy.get('[href="/login"]').should('be.visible').click();

    cy.url().should('include', '/login');

    cy.get('form').should('be.visible');

    cy.get('[href="/register"]').click()

    const email = 'user@email.com'
    const username = 'testUser'
    const password = 'testtest'
    const confirmPassword = password
    const displayName = 'testZaZa'
    
    cy.get('[name=email]').type(`${email}{enter}`)
    cy.get('[name=username]').type(`${username}{enter}`)
    cy.get('[name=password]').type(`${password}{enter}`)
    cy.get('[name=confirmPassword]').type(`${confirmPassword}{enter}`)
    cy.get('[name=displayName]').type(`${displayName}{enter}`)
    cy.get('[type=checkbox]').check()
    cy.get('[name=displayName]').type(`{enter}`)
  })

  // it('should be able to log in', () => {
  //   cy.visit('/login')

  //   const username = 'testUser'
  //   const password = 'testtest'

  //   cy.get('[name=username]').type(`${username}{enter}`)
  //   cy.get('[name=password]').type(`${password}{enter}`)
  // })
})