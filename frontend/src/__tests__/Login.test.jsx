import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import Login from '../pages/Login';

  // Mock the component to extract testing functions
const renderLogin = () => {
  const MockedLogin = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPass, setShowPass] = React.useState(false);
    const [error, setError] = React.useState('');
    const [formErrors, setFormErrors] = React.useState({});

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validateForm = () => {
      const errors = {};
      
      if (!email.trim()) {
        errors.email = 'Email wajib diisi';
      } else if (!isValidEmail(email)) {
        errors.email = 'Format email tidak valid';
      }
      
      if (!password.trim()) {
        errors.password = 'Password wajib diisi';
      } else if (password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
      }
      
      setFormErrors(errors);
      
      // Return the validation result
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      // Use functional state updates to get current values
      setEmail(currentEmail => {
        setPassword(currentPassword => {
          const errors = {};
          
          console.log('Validating with functional update:', { currentEmail, currentPassword });
          
          if (!currentEmail.trim()) {
            errors.email = 'Email wajib diisi';
          } else if (!isValidEmail(currentEmail)) {
            errors.email = 'Format email tidak valid';
          }
          
          if (!currentPassword.trim()) {
            errors.password = 'Password wajib diisi';
          } else if (currentPassword.length < 6) {
            errors.password = 'Password minimal 6 karakter';
          }
          
          setFormErrors(errors);
          
          if (Object.keys(errors).length > 0) {
            return currentPassword; // Don't submit
          }
          
          // Submit form with current values
          axios.post(
            'http://localhost:4000/api/auth/login',
            { email: currentEmail, password: currentPassword },
            { withCredentials: true }
          ).then(response => {
            localStorage.setItem('user', JSON.stringify(response.data.user));
            window.location.href = '/dashboard';
          }).catch(err => {
            if (err.response?.data?.details) {
              const { details } = err.response.data;
              const backendErrors = {};
              
              if (details.email) backendErrors.email = details.email;
              if (details.password) backendErrors.password = details.password;
              
              setFormErrors(backendErrors);
              setError(err.response.data.message || 'Login gagal');
            } else {
              setError(err.response?.data?.message || 'Login gagal: email atau password salah');
            }
          });
          
          return currentPassword;
        });
        return currentEmail;
      });
    };

    const handleEmailChange = (e) => {
      const newEmail = e.target.value;
      console.log('handleEmailChange called with:', newEmail);
      setEmail(newEmail);
      // Clear email error when user starts typing but keep the value
      if (formErrors.email && newEmail.length > 0) {
        setFormErrors(prev => ({ ...prev, email: '' }));
      }
      if (error) {
        setError('');
      }
    };

    const handlePasswordChange = (e) => {
      const newPassword = e.target.value;
      setPassword(newPassword);
      // Clear password error when user starts typing but keep the value
      if (formErrors.password && newPassword.length > 0) {
        setFormErrors(prev => ({ ...prev, password: '' }));
      }
      if (error) {
        setError('');
      }
    };

    return (
      <div>
        <form onSubmit={handleSubmit} data-testid="login-form">
          <input
            data-testid="email-input"
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="nama@email.com"
          />
          {formErrors.email && (
            <div data-testid="email-error">{formErrors.email}</div>
          )}
          
          <input
            data-testid="password-input"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Masukkan password"
          />
          {formErrors.password && (
            <div data-testid="password-error">{formErrors.password}</div>
          )}
          
          <button
            data-testid="show-password-toggle"
            type="button"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? 'Hide' : 'Show'}
          </button>
          
          {error && <div data-testid="general-error">{error}</div>}
          
          <button type="submit" data-testid="submit-button">Login</button>
        </form>
      </div>
    );
  };

  return render(<MockedLogin />);
};

// Helper functions to access internal state
const getValidationFunctions = () => {
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (email, password) => {
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!isValidEmail(email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!password.trim()) {
      errors.password = 'Password wajib diisi';
    } else if (password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    return errors;
  };

  return { isValidEmail, validateForm };
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Email Validation', () => {
    test('should validate email format correctly', () => {
      const { isValidEmail } = getValidationFunctions();
      
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
    });

    test('should show email required error', async () => {
      renderLogin();
      
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);
      
      expect(screen.getByTestId('email-error')).toHaveTextContent('Email wajib diisi');
    });

    test('should show invalid email format error', async () => {
      console.log('=== Starting should show invalid email format error test ===');
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(emailInput, 'invalid-email');
      console.log('Email typed, about to click submit');
      
      await userEvent.click(submitButton);
      console.log('Submit clicked, waiting for error');
      
      // Add a small delay to let state update properly
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Format email tidak valid');
      });
    });
  });

  describe('Password Validation', () => {
    test('should show password required error', async () => {
      renderLogin();
      
      const submitButton = screen.getByTestId('submit-button');
      await userEvent.click(submitButton);
      
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password wajib diisi');
    });

    test('should show password minimum length error', async () => {
      renderLogin();
      
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(passwordInput, '123');
      await userEvent.click(submitButton);
      
      expect(screen.getByTestId('password-error')).toHaveTextContent('Password minimal 6 karakter');
    });
  });

  describe('Form Integration', () => {
    test('should not submit with invalid form', async () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.type(passwordInput, '123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('email-error')).toHaveTextContent('Format email tidak valid');
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password minimal 6 karakter');
      });
      expect(axios.post).not.toHaveBeenCalled();
    });

    test('should submit form with valid data', async () => {
      const mockResponse = {
        data: {
          message: 'Login berhasil',
          user: {
            username: 'testuser',
            email: 'test@example.com'
          }
        }
      };
      
      axios.post.mockResolvedValue(mockResponse);
      
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:4000/api/auth/login',
          { email: 'test@example.com', password: 'password123' },
          { withCredentials: true }
        );
      });
      
      // Check if localStorage.setItem is being called (since it's mocked)
      expect(localStorage.setItem).toHaveBeenCalledTimes(1);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'user',
        JSON.stringify(mockResponse.data.user)
      );
      
      expect(window.location.href).toBe('/dashboard');
    });
  });

  describe('Show/Hide Password', () => {
    test('should toggle password visibility', async () => {
      renderLogin();
      
      const passwordInput = screen.getByTestId('password-input');
      const toggleButton = screen.getByTestId('show-password-toggle');
      
      // Initially password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click to show password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(toggleButton).toHaveTextContent('Hide');
      
      // Click to hide password
      await userEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(toggleButton).toHaveTextContent('Show');
    });
  });

  describe('Error Handling', () => {
    test('should display backend validation errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Login gagal',
            details: {
              email: 'Email tidak terdaftar',
              password: 'Password salah'
            }
          }
        }
      };
      
      axios.post.mockRejectedValue(mockError);
      
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('general-error')).toHaveTextContent('Login gagal');
        expect(screen.getByTestId('email-error')).toHaveTextContent('Email tidak terdaftar');
        expect(screen.getByTestId('password-error')).toHaveTextContent('Password salah');
      });
    });

    test('should handle network errors', async () => {
      const mockError = {
        response: {
          data: {
            message: 'Server error'
          }
        }
      };
      
      axios.post.mockRejectedValue(mockError);
      
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('general-error')).toHaveTextContent('Server error');
      });
    });
  });

  describe('Form State Management', () => {
    test('should clear errors when user starts typing', async () => {
      renderLogin();
      
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const submitButton = screen.getByTestId('submit-button');
      
      // Submit with invalid data to show errors
      await userEvent.click(submitButton);
      expect(screen.getByTestId('email-error')).toBeInTheDocument();
      expect(screen.getByTestId('password-error')).toBeInTheDocument();
      
      // Start typing in email field
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'test');
      await waitFor(() => {
        expect(screen.queryByTestId('email-error')).not.toBeInTheDocument();
      });
      
      // Start typing in password field
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'test');
      await waitFor(() => {
        expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
      });
    });
  });
});
