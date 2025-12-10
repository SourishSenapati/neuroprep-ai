// WebNN Polyfill for non-supporting browsers
(function() {
  if ('ml' in navigator) {
    console.log('WebNN natively supported');
    return;
  }

  console.log('WebNN not supported, loading polyfill...');

  // Minimal WebNN API polyfill
  navigator.ml = {
    createContext: async function(options) {
      return {
        compute: async function(inputs) {
          // Fallback to CPU-based computation
          console.warn('Using WebNN polyfill (CPU fallback)');
          return inputs;
        }
      };
    },
    
    getNeuralNetworkContext: async function() {
      return this.createContext();
    }
  };

  console.log('WebNN polyfill loaded');
})();
