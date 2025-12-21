
test('Global setup is correct', () => {
    expect(process.env.NODE_ENV).toBe('test');
    // expect(process.env.OPENAI_API_KEY).toBeDefined(); // Might not be defined in CI
});
