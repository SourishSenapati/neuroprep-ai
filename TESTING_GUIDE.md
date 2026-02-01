# NeuroPrep AI - Testing Guide

## 🧪 Test Suite Overview

### Backend Unit Tests (Jest)

- **Location:** `backend/__tests__/`
- **Framework:** Jest + ts-jest
- **Coverage Target:** 80% lines, 75% functions

### Frontend E2E Tests (Cypress)

- **Location:** `cypress/e2e/`
- **Framework:** Cypress 13
- **Browser:** Chrome with fake media stream

## 🚀 Running Tests

### Quick Start

```bash

# Install dependencies

npm install

# Run all tests

npm run test:jest
npm run test:e2e

```text

### Backend Tests

```bash

# Run with coverage

npm run test:jest

# Watch mode

cd backend
npm test -- --watch

# Specific test file

npm test -- aiEngine.test.ts

# Verbose output

npm test -- --verbose

```text

### E2E Tests

```bash

# Headless (CI mode)

npm run test:e2e

# Interactive mode

npm run test:e2e:open

# Specific spec

npx cypress run --spec "cypress/e2e/interview.cy.ts"

```text

## 📋 Test Scenarios

### 1. Adaptive AI Flow (Jest)

**Test:** `generates Caltech-level question with RAG context`

```typescript
const result = await generateAdaptiveQuestion('caltech-phd', 5, []);
expect(result.question).toContain('quantum');
expect(result.ragContext.length).toBeGreaterThan(0);

```text

**Test:** `adapts difficulty when stress > 7`

```typescript
const result = await generateAdaptiveQuestion('caltech-phd', 8, []);
expect(result.difficulty).toBe('moderate');

```text

**Test:** `detects LLM-generated responses`

```typescript
const llmResponse = 'Furthermore, it is important to note...';
const analysis = await analyzeResponse(llmResponse, 'Test', { stressLevel: 3 });
expect(analysis.cheatDetected).toBe(true);
expect(analysis.authenticityScore).toBeLessThan(70);

```text

**Test:** `calculates neural resilience correctly`

```typescript
const insights = await generateSessionInsights(mockSession);
expect(insights.neuralResilience).toBeGreaterThan(80);
expect(insights.readiness).toBe('Strong');

```text

### 2. Full Interview Simulation (Cypress)

**Scenario:** Caltech PhD session with score > 90

```javascript
// 1. Start session
cy.contains('Start Interview Session').click();
cy.get('[data-testid="mode-select"]').select('caltech-phd');

// 2. Grant camera (mocked)
cy.get('[data-testid="grant-camera"]').click();

// 3. Answer question
cy.get('[data-testid="response-input"]').type(
  'To model gravitational wave mergers, I would use numerical relativity...'
);
cy.get('[data-testid="submit-response"]').click();

// 4. Verify score > 90
cy.get('[data-testid="technical-score"]').invoke('text').then((text) => {
  expect(parseInt(text)).to.be.greaterThan(90);
});

// 5. Execute Python code
cy.get('.monaco-editor').type('import numpy as np{enter}print(42)');
cy.get('[data-testid="run-code"]').click();
cy.get('[data-testid="code-output"]').should('contain', '42');

// 6. Verify final resilience > 85
cy.get('[data-testid="neural-resilience"]').invoke('text').then((text) => {
  expect(parseInt(text)).to.be.greaterThan(85);
});

```text

### 3. Pyodide Execution (Cypress)

**Test:** `verifies Pyodide numpy execution`

```javascript
cy.get('.monaco-editor').type('import numpy{enter}print(42)');
cy.get('[data-testid="run-code"]').click();
cy.get('[data-testid="code-output"]', { timeout: 10000 })
  .should('contain', '42');

```text

### 4. Neural Reset Trigger (Cypress)

**Test:** `triggers neural reset when stress > 8`

```javascript
cy.get('[data-testid="stress-slider"]').invoke('val', 9).trigger('change');
cy.get('[data-testid="neural-reset-overlay"]', { timeout: 5000 })
  .should('be.visible');
cy.contains('4-7-8 Breathing').should('be.visible');

```text

### 5. Cheat Detection (Cypress)

**Test:** `detects cheat patterns`

```javascript
cy.get('[data-testid="response-input"]').type(
  'Furthermore, it is important to note that in conclusion...'
);
cy.get('[data-testid="submit-response"]').click();
cy.get('[data-testid="auth-flag"]', { timeout: 10000 })
  .should('be.visible');

```text

## 🎯 Coverage Reports

### Generate Coverage

```bash
npm run test:jest

# Opens: coverage/lcov-report/index.html

```text

### Coverage Thresholds

- **Lines:** 80%
- **Functions:** 75%
- **Branches:** 70%
- **Statements:** 80%

## 🔧 Mock Configuration

### OpenAI/Anthropic Mocks (Jest)

```typescript
jest.mock('openai', () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ 
            message: { 
              content: '{"eqScore":8,"technicalScore":85}' 
            } 
          }]
        })
      }
    }
  }))
}));

```text

### Camera Mock (Cypress)

```javascript
cy.window().then((win) => {
  cy.stub(win.navigator.mediaDevices, 'getUserMedia').resolves({
    getTracks: () => [{ stop: () => {} }]
  });
});

```text

### Cypress Browser Config

```typescript
// cypress.config.ts
setupNodeEvents(on, config) {
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--use-fake-ui-for-media-stream');
      launchOptions.args.push('--use-fake-device-for-media-stream');
    }
    return launchOptions;
  });
}

```text

## 🐛 Debugging Tests

### Jest Debug

```bash

# Node inspector

node --inspect-brk node_modules/.bin/jest --runInBand

# VS Code launch.json

{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}

```text

### Cypress Debug

```bash

# Interactive mode with DevTools

npm run test:e2e:open

# Debug specific test

cy.debug()  // Pause execution
cy.pause()  // Interactive pause

```text

## 📊 CI/CD Integration

### GitHub Actions

```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:jest
      - run: npm run test:e2e

```text

### Vercel Pre-Deploy Hook

```json
{
  "buildCommand": "npm run test:jest && npm run build"
}

```text

## ✅ Test Checklist

### Before Commit

- [ ] All Jest tests pass
- [ ] Coverage > 80%
- [ ] No console errors
- [ ] TypeScript compiles

### Before Deploy

- [ ] E2E tests pass
- [ ] Camera permissions work
- [ ] Pyodide executes code
- [ ] WebSocket connects
- [ ] Database seeded

### Production Smoke Tests

- [ ] Health endpoint responds
- [ ] AI streaming works
- [ ] Session persists
- [ ] Scores calculated correctly

## 🎓 Writing New Tests

### Backend Test Template

```typescript
import { functionToTest } from '../module';

describe('Module Name', () => {
  test('should do something', async () => {
    const result = await functionToTest(input);
    expect(result).toBe(expected);
  });
});

```text

### E2E Test Template

```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should perform action', () => {
    cy.get('[data-testid="element"]').click();
    cy.contains('Expected Text').should('be.visible');
  });
});

```text

## 📈 Performance Testing

### Load Testing (Optional)

```bash

# Install k6

npm install -g k6

# Run load test

k6 run loadtest.js

```text

### Metrics to Monitor

- Response time < 5s
- Concurrent sessions > 100
- Memory usage < 512MB
- CPU usage < 80%

---

**Test Coverage:** 80%+ | **E2E Scenarios:** 5 | **CI/CD:** Ready
