// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation function
const validatePassword = (password) => {
  if (!password) return false;
  return password.trim().length >= 6;
};

// Form validation function
const validateLoginForm = (email, password) => {
  const errors = {};
  
  if (!email) {
    errors.email = 'Email wajib diisi';
  } else if (!validateEmail(email)) {
    errors.email = 'Format email tidak valid';
  }
  
  if (!password) {
    errors.password = 'Password wajib diisi';
  } else if (!validatePassword(password)) {
    errors.password = 'Password minimal 6 karakter';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

describe('Email Validation', () => {
  test('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  test('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });

  test('should reject empty email', () => {
    expect(validateEmail('')).toBe(false);
  });
});

describe('Password Validation', () => {
  test('should reject empty password', () => {
    expect(validatePassword('')).toBe(false);
  });

  test('should reject short password', () => {
    expect(validatePassword('123')).toBe(false);
  });

  test('should accept valid password', () => {
    expect(validatePassword('password123')).toBe(true);
  });
});

describe('Login Form Validation', () => {
  test('should return error when both fields are empty', () => {
    const result = validateLoginForm('', '');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Email wajib diisi');
    expect(result.errors.password).toBe('Password wajib diisi');
  });

  test('should return error for invalid email format', () => {
    const result = validateLoginForm('invalid-email', 'password123');
    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe('Format email tidak valid');
  });

  test('should return valid for correct inputs', () => {
    const result = validateLoginForm('test@example.com', 'password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
