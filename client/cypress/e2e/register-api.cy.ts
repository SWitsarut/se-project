beforeEach(() => {
  cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
})

const timestamp = new Date().getTime();
const email = `user_api${timestamp}@email.com`
const username = `user_api${timestamp}`;
const password = 'testtest';
const displayName = `testUserAPI${timestamp}`;

const userData = {
  email: email,
  username: username,
  displayName: displayName,
  password: password,
  confirmPassword: password,
  acceptTermsOfUse: true
};

describe('Send POST request to register user', () => {
  it('should register a user via POST request', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      headers: {
        'Content-Type': 'application/json'
      },
      body: userData,
      failOnStatusCode: false,
    }).then(response => {

      expect(response.status).to.eq(200);
      cy.log('User registered successfully');

    });
  });
});

describe('Send POST request to register user that already exist', () => {
  it('should return 400 HTTP status', () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      headers: {
        'Content-Type': 'application/json'
      },
      body: userData,
      failOnStatusCode: false,
    }).then(response => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq('Username or Email already in use');
      cy.log('User registration failed: Username or Email already in use');
    });
  });
});