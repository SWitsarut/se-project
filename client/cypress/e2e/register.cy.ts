beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
})

describe('registeration, login, logout', () => {
  it('should be able to register as user', () => {
    cy.visit('/');

    cy.contains('Login').should('be.visible');
    cy.wait(1000);
    cy.contains('Login').click();
    cy.url().should('include', '/login').should('exist', { timeout: 10000 });

    cy.get('form').should('be.visible');
    cy.get('[href="/register"]').click();
    cy.url().should('include', '/register');

    const timestamp = new Date().getTime();
    const email = `user_${timestamp}@email.com`
    const username = `testuser_${timestamp}`;
    const password = 'testtest';
    const confirmPassword = password;
    const displayName = 'testZaZa';

    cy.get('[name=email]').type(`${email}{enter}`);
    cy.get('[name=username]').type(`${username}{enter}`);
    cy.get('[name=password]').type(`${password}{enter}`);
    cy.get('[name=confirmPassword]').type(`${confirmPassword}{enter}`);
    cy.get('[name=displayName]').type(`${displayName}{enter}`);
    cy.get('[type=checkbox]').check();
    cy.get('[name=displayName]').type(`{enter}`);

    cy.contains('Register Successful').should('be.visible', { timeout: 10000 });
    cy.contains('Go to login').click();

    cy.get('[name=username]').type(`${username}{enter}`);
    cy.get('[name=password]').type(`${password}{enter}`);
    cy.contains('Confirmation email sent').should('be.visible');
  });

  it('should be able register as publisher', () => {
    cy.visit('/');

    cy.contains('Login').should('be.visible');
    cy.contains('Login').click()
    cy.contains('Login').click()
    cy.url().should('include', '/login').should('exist', { timeout: 10000 });

    cy.get('form').should('be.visible');
    cy.get('[href="/register"]').click();
    cy.contains('register as a publisher').click();
    cy.url().should('include', 'publisher');

    const timestamp = new Date().getTime();
    const email = `publisher_${timestamp}@email.com`
    const username = `testpublisher_${timestamp}`;
    const password = 'testtest';
    const confirmPassword = password;
    const publisherName = `publisher_${timestamp}`;
    const displayName = publisherName;

    cy.get('[name=email]').type(`${email}{enter}`);
    cy.get('[name=username]').type(`${username}{enter}`);
    cy.get('[name=password]').type(`${password}{enter}`);
    cy.get('[name=confirmPassword]').type(`${confirmPassword}{enter}`);
    cy.get('[name=publisherName]').type(`${publisherName}{enter}`);
    cy.get('[name=displayName]').type(`${displayName}{enter}`);
    cy.get('[type=checkbox]').check();
    cy.get('[name=displayName]').type(`{enter}`);

    cy.contains('Register Successful').should('be.visible', { timeout: 10000 });
    cy.contains('Go to login').click();

    cy.get('[name=username]').type(`${username}{enter}`);
    cy.get('[name=password]').type(`${password}{enter}`);
    cy.contains('Confirmation email sent').should('be.visible', { timeout: 10000 });
  })

  it('should be able to login and logout', () => {
    cy.visit('/');

    cy.contains('Login').should('be.visible');
    cy.contains('Login').click()
    cy.contains('Login').click()
    cy.url().should('include', '/login').should('exist', { timeout: 10000 });

    const username = 'trueuser';
    const password = 'testtest'

    cy.get('[name=username]').type(`${username}`);
    cy.get('[name=password]').type(`${password}{enter}`);

    cy.url().should('not.include', '/login', { timeout: 10000 });
    cy.contains(`${username}`).should('be.visible');
    cy.contains(`${username}`).click()

    cy.contains('Logout').should('be.visible')
    cy.contains('Logout').click()
    cy.contains('Login').should('be.visible')
  })
});
