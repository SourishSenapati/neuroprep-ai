Cypress.Commands.add('login', (email: string) => {
  cy.session(email, () => {
    cy.visit('/');
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="submit-login"]').click();
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string): Chainable<void>;
    }
  }
}

export {};
