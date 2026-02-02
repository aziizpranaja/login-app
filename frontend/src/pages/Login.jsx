import React, { useState, useLayoutEffect } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useLayoutEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Apply theme on component mount and theme change
  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleFocus = (field) => {
    setFocusedField(field);
  };

  const handleBlur = (field) => {
    const errors = { ...formErrors };
    
    if (field === 'email') {
      if (!email.trim()) {
        errors.email = 'Email wajib diisi';
      } else if (!isValidEmail(email)) {
        errors.email = 'Format email tidak valid';
      } else {
        delete errors.email;
      }
    }
    
    if (field === 'password') {
      if (!password.trim()) {
        errors.password = 'Password wajib diisi';
      } else if (password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
      } else {
        delete errors.password;
      }
    }
    
    setFormErrors(errors);
    setFocusedField('');
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
    return Object.keys(errors).length === 0;
  };
  
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:4000/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      console.log('Login successful:', response.data);
      setIsLoading(false);
      
      // Use React Router navigation instead of window.location
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error responses from backend
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
      
      setIsLoading(false);
    }
  };

  return (
    <div className="vh-100 vw-100 d-flex align-items-center justify-content-center overflow-hidden position-relative" style={{ background: isDarkMode ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleTheme}
        className="position-absolute top-0 end-0 m-3 btn"
        style={{
          zIndex: 1000,
          background: isDarkMode ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: '50%',
          width: '45px',
          height: '45px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
        }}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Animated Background Elements */}
      <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
        <div className="position-absolute" 
             style={{ 
               top: '10%', 
               left: '5%', 
               width: '200px', 
               height: '200px', 
               background: 'rgba(255, 255, 255, 0.05)',
               borderRadius: '50%',
               animation: 'float 6s ease-in-out infinite' 
             }}></div>
        <div className="position-absolute" 
             style={{ 
               bottom: '15%', 
               right: '5%', 
               width: '150px', 
               height: '150px', 
               background: 'rgba(255, 255, 255, 0.05)',
               borderRadius: '50%',
               animation: 'float 8s ease-in-out infinite reverse' 
             }}></div>
        <div className="position-absolute" 
             style={{ 
               top: '40%', 
               left: '30%', 
               width: '100px', 
               height: '100px', 
               background: 'rgba(255, 255, 255, 0.03)',
               borderRadius: '50%',
               animation: 'float 4s ease-in-out infinite' 
             }}></div>
      </div>

      <div className="container h-100 d-flex align-items-center justify-content-center position-relative z-1">
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card border-0 shadow-lg" style={{ 
              animation: 'slideUp 0.5s ease-out',
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}>
              <div className="card-body p-4 p-md-5">
                {/* Logo/Brand Section */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div 
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center transition-all"
                      style={{ 
                        width: focusedField ? '65px' : '60px', 
                        height: focusedField ? '65px' : '60px',
                        transition: 'all 0.3s ease',
                        background: 'var(--primary-color)'
                      }}
                    >
                      <i className="bi bi-shield-lock text-white fs-3"></i>
                    </div>
                  </div>
                  <h2 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>Selamat Datang</h2>
                  <p className="text-muted mb-0" style={{ color: 'var(--text-muted)' }}>Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                {/* Error Alert */}
                {(error || Object.keys(formErrors).length > 0) && (
                  <div className="alert alert-danger d-flex align-items-center animate-shake" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>
                      {error && <div>{error}</div>}
                      {formErrors.email && <div className="small mt-1">{formErrors.email}</div>}
                      {formErrors.password && <div className="small mt-1">{formErrors.password}</div>}
                    </div>
                    <button 
                      type="button" 
                      className="btn-close ms-auto" 
                      onClick={() => {
                        setError('');
                        setFormErrors({});
                      }}
                    ></button>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="mt-4">
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${focusedField === 'email' ? 'bg-primary text-white' : 'bg-light'} transition-all`} style={{ 
                        background: focusedField === 'email' ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                        color: focusedField === 'email' ? 'white' : 'var(--text-secondary)',
                        borderColor: 'var(--border-color)'
                      }}>
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        id="email"
                        type="email"
                        className={`form-control form-control-lg border-start-0 ${formErrors.email ? 'is-invalid' : ''}`}
                        placeholder="nama@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          // Clear error when user starts typing
                          if (formErrors.email) {
                            setFormErrors(prev => ({ ...prev, email: '' }));
                          }
                        }}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        style={{
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                      />
                    </div>
                    {formErrors.email && (
                      <div className="invalid-feedback d-block">
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label fw-semibold" style={{ color: 'var(--text-primary)' }}>
                      Password
                    </label>
                    <div className="input-group">
                      <span className={`input-group-text ${focusedField === 'password' ? 'bg-primary text-white' : 'bg-light'} transition-all`} style={{ 
                        background: focusedField === 'password' ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                        color: focusedField === 'password' ? 'white' : 'var(--text-secondary)',
                        borderColor: 'var(--border-color)'
                      }}>
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        id="password"
                        type={showPass ? 'text' : 'password'}
                        className={`form-control form-control-lg border-start-0 ${formErrors.password ? 'is-invalid' : ''}`}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          // Clear error when user starts typing
                          if (formErrors.password) {
                            setFormErrors(prev => ({ ...prev, password: '' }));
                          }
                        }}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        style={{
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          borderColor: 'var(--border-color)'
                        }}
                      />
                      <button
                        type="button"
                        className={`btn ${showPass ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setShowPass(!showPass)}
                        style={{ 
                          borderLeft: 'none',
                          background: showPass ? 'var(--primary-color)' : 'var(--bg-tertiary)',
                          color: showPass ? 'white' : 'var(--text-secondary)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <i className={`bi ${showPass ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
                      </button>
                    </div>
                    {formErrors.password && (
                      <div className="invalid-feedback d-block">
                        {formErrors.password}
                      </div>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}
                      />
                      <label className="form-check-label" htmlFor="rememberMe" style={{ color: 'var(--text-primary)' }}>
                        Ingat saya
                      </label>
                    </div>
                    <a href="#" className="text-decoration-none" style={{ color: 'var(--primary-color)' }}>
                      Lupa password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg w-100 py-3 fw-semibold position-relative overflow-hidden"
                    disabled={isLoading}
                    style={{
                      background: 'var(--primary-color)',
                      borderColor: 'var(--primary-color)',
                      color: 'white'
                    }}
                  >
                    <span className="position-relative">
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Masuk...
                        </>
                      ) : (
                        'Masuk'
                      )}
                    </span>
                  </button>
                </form>

                {/* Footer Links */}
                <div className="text-center mt-4 pt-4 border-top" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="mb-0" style={{ color: 'var(--text-muted)' }}>
                    Belum punya akun? 
                    <a href="#" className="text-decoration-none fw-semibold ms-1" style={{ color: 'var(--primary-color)' }}>
                      Daftar sekarang
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center mt-4">
              <p className="small mb-0" style={{ color: 'var(--text-muted)' }}>
                © 2024 Aplikasi Login. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow: hidden;
        }
        
        .card {
          border-radius: 16px;
          transition: transform 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .form-control:focus, .input-group-text:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.2rem var(--primary-color);
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px var(--primary-color);
        }
        
        .form-control {
          border-radius: 0 8px 8px 0;
          border-left: none;
          padding: 12px 16px;
        }
        
        .input-group-text {
          border-radius: 8px 0 0 8px;
          border-right: none;
          transition: all 0.3s ease;
        }
        
        .input-group .form-control:focus {
          border-left: none;
        }
        
        .alert {
          border-radius: 8px;
          border: none;
        }
        
        .transition-all {
          transition: all 0.3s ease;
        }
        
        .animate-shake {
          animation: shake 0.5s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @media (max-width: 576px) {
          .card-body {
            padding: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
