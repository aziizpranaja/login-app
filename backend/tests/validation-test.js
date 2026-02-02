// Simple validation test
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Test function
const test = (name, fn) => {
  try {
    fn();
    console.log('?', name);
  } catch (error) {
    console.log('?', name);
    console.log('  Error:', error.message);
  }
};

const expect = (actual) => ({
  toBe: (expected) => {
    if (actual !== expected) {
      throw new Error('Expected ' + expected + ', but got ' + actual);
    }
  }
});

// Email validation tests
console.log('Running validation tests...');

test('should validate correct email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
});

test('should reject invalid email', () => {
  expect(validateEmail('invalid-email')).toBe(false);
});

test('should reject empty email', () => {
  expect(validateEmail('')).toBe(false);
});

console.log('Tests completed!');
