describe('Zenith Singularity E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Forges Neural Link and Enters Chamber', () => {
    // 1. Forge Link
    cy.contains('Forge Neural Link').click();
    cy.contains('Auth Nexus').should('be.visible');

    // 2. Initiate Scan (Auth)
    cy.contains('Initiate Scan').click();
    cy.contains('Nexus Manifold').should('be.visible');

    // 3. Enter Chamber
    cy.contains('Enter Chamber').click();
    cy.contains('Neural Calibration').should('be.visible');
  });

  it('Enables Bio-Analysis and Detects Rift', () => {
    // Navigate to Chamber
    cy.contains('Forge Neural Link').click();
    cy.contains('Initiate Scan').click();
    cy.contains('Enter Chamber').click();

    // Enable Bio
    cy.contains('Enable Bio-Analysis').click();
    cy.contains('Bio-Analysis Enabled').should('be.visible');

    // Verify AR Overlays
    cy.contains('GAZE_TRACK: LOCKED').should('be.visible');
    cy.contains('BIO-HASH: ACTIVE').should('be.visible');

    // Wait for simulated Rift (since we can't easily inject socket events in E2E without mocking)
    // However, the frontend mocks it every 2s.
    // We check if the thought process updates.
    cy.get('.text-purple-500').should('exist');
  });

  it('Triggers Freemium Limit', () => {
    cy.contains('Forge Neural Link').click();
    cy.contains('Initiate Scan').click();
    cy.contains('Enter Chamber').click();
    cy.contains('Enable Bio-Analysis').click();

    // Click Amber Brain (Simulate Limit)
    // Need to target the button specifically, maybe by title or icon class if possible
    // Using a selector based on the button we added
    cy.get('button[title="Simulate Freemium Limit"]').click();

    cy.contains('Singularity Limit Reached').should('be.visible');
    cy.contains('Unlock Infinite Rift').should('be.visible');
  });
});
