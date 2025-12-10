try {
  require('@google/generative-ai');
  console.log('SUCCESS: Package found');
} catch (e) {
  console.log('ERROR: ' + e.message);
  console.log('Require paths: ' + module.paths.join('\n'));
}
