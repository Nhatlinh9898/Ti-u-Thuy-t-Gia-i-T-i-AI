export function removeConsolePlugin() {
  return {
    name: 'remove-console',
    transform(code, id) {
      // Skip node_modules and files with syntax errors
      if (id.includes('node_modules') || id.includes('smartGeminiService.ts')) return code;
      
      // Remove console statements only in production and for valid JS/TS files
      if (process.env.NODE_ENV === 'production') {
        try {
          return code
            .replace(/console\.log\(.*?\);?/g, '')
            .replace(/console\.error\(.*?\);?/g, '')
            .replace(/console\.warn\(.*?\);?/g, '')
            .replace(/console\.info\(.*?\);?/g, '')
            .replace(/console\.debug\(.*?\);?/g, '');
        } catch (error) {
          // If transformation fails, return original code
          return code;
        }
      }
      
      return code;
    }
  };
}
