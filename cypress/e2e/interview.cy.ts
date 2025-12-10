describe('NeuroPrep AI - Full Interview Simulation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    cy.window().then((win) => {
      win.localStorage.setItem('test-mode', 'true');
    });
  });

  it('simulates Caltech session with score > 90', () => {
    cy.contains('Start Interview Session').click();
    cy.get('[data-testid="mode-select"]').select('caltech-phd');
    cy.contains('Begin').click();

    cy.get('[data-testid="camera-grant"]', { timeout: 10000 }).should('be.visible');
    cy.window().then((win) => {
      cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
        getTracks: () => [{ stop: () => {} }]
      });
    });
    cy.get('[data-testid="grant-camera"]').click();

    cy.get('[data-testid="question-text"]', { timeout: 15000 }).should('contain', 'quantum');

    cy.get('[data-testid="response-input"]').type(
      'To model gravitational wave mergers, I would use numerical relativity with Einstein field equations. ' +
      'The key is solving the constraint equations on initial hypersurface, then evolving using BSSN formulation. ' +
      'For binary black holes, we need adaptive mesh refinement near horizons and wave extraction at large radii.',
      { delay: 50 }
    );

    cy.get('[data-testid="submit-response"]').click();

    cy.get('[data-testid="analysis-score"]', { timeout: 20000 }).should('be.visible');
    cy.get('[data-testid="technical-score"]').invoke('text').then((text) => {
      const score = parseInt(text);
      expect(score).to.be.greaterThan(90);
    });

    cy.get('[data-testid="code-editor"]').should('be.visible');
    cy.get('.monaco-editor').click().focused().type(
      'import numpy as np{enter}' +
      'print(42){enter}' +
      'result = np.array([1, 2, 3]){enter}' +
      'print(result.sum())'
    );

    cy.get('[data-testid="run-code"]').click();
    cy.get('[data-testid="code-output"]', { timeout: 10000 }).should('contain', '42');
    cy.get('[data-testid="code-output"]').should('contain', '6');

    cy.get('[data-testid="end-session"]').click();
    cy.get('[data-testid="final-score"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="neural-resilience"]').invoke('text').then((text) => {
      const resilience = parseInt(text);
      expect(resilience).to.be.greaterThan(85);
    });
  });

  it('verifies Pyodide numpy execution', () => {
    cy.visit('http://localhost:3000/interview');
    cy.get('[data-testid="code-editor"]', { timeout: 15000 }).should('be.visible');
    
    cy.get('.monaco-editor').click().focused().type(
      'import numpy{enter}' +
      'print(42)'
    );

    cy.get('[data-testid="run-code"]').click();
    cy.get('[data-testid="code-output"]', { timeout: 10000 }).should('contain', '42');
  });

  it('triggers neural reset when stress > 8', () => {
    cy.visit('http://localhost:3000/interview');
    cy.get('[data-testid="stress-slider"]').invoke('val', 9).trigger('change');
    
    cy.get('[data-testid="neural-reset-overlay"]', { timeout: 5000 }).should('be.visible');
    cy.contains('4-7-8 Breathing').should('be.visible');
  });

  it('detects cheat patterns', () => {
    cy.visit('http://localhost:3000/interview');
    cy.get('[data-testid="response-input"]').type(
      'Furthermore, it is important to note that in conclusion, the methodology demonstrates...'
    );
    cy.get('[data-testid="submit-response"]').click();

    cy.get('[data-testid="auth-flag"]', { timeout: 10000 }).should('be.visible');
    cy.contains('Authenticity Warning').should('be.visible');
  });
});
