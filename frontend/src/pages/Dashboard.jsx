import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    revenue: 0,
    growth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

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

  useEffect(() => {
    // Load user data from API
    const loadDashboardData = async () => {
      try {
        // Get user data from API
        const response = await axios.get("http://localhost:4000/api/auth/me", { 
          withCredentials: true 
        });

        if (response.data) {
          setUser({
            name: response.data.username,
            email: response.data.email,
            role: response.data.role || 'User',
            avatar: `https://picsum.photos/seed/${response.data.username}/100/100.jpg`
          });
        } else {
          // If no user data found, redirect to login
          window.location.href = '/';
          return;
        }

        // Simulate API calls for dashboard stats and activities
        setTimeout(() => {
          setStats({
            totalUsers: 1247,
            activeUsers: 892,
            revenue: 45678,
            growth: 23.5
          });

          setRecentActivity([
            { id: 1, user: 'Alice Johnson', action: 'Logged in', time: '2 min ago', icon: 'bi-box-arrow-in-right' },
            { id: 2, user: 'Bob Smith', action: 'Updated profile', time: '15 min ago', icon: 'bi-person-gear' },
            { id: 3, user: 'Carol White', action: 'Created new project', time: '1 hour ago', icon: 'bi-plus-circle' },
            { id: 4, user: 'David Brown', action: 'Downloaded report', time: '2 hours ago', icon: 'bi-download' },
            { id: 5, user: 'Emma Davis', action: 'Deleted account', time: '3 hours ago', icon: 'bi-trash' }
          ]);

          setNotifications([
            { id: 1, type: 'success', message: 'System backup completed successfully', time: '5 min ago' },
            { id: 2, type: 'warning', message: 'High memory usage detected', time: '30 min ago' },
            { id: 3, type: 'info', message: 'New update available', time: '1 hour ago' }
          ]);

          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        // Redirect to login on error
        window.location.href = '/';
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      // Clear stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('rememberedEmail');
      
      // Redirect to login
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect on error
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 vw-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5>Loading Dashboard...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="vh-100 vw-100 overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Header/Navbar */}
      <nav className="navbar navbar-expand-lg shadow-sm" style={{ 
        backgroundColor: 'var(--navbar-bg)',
        borderBottom: '1px solid var(--border-color)',
        color: 'var(--text-primary)'
      }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="#" style={{ color: 'var(--text-primary)' }}>
            <i className="bi bi-speedometer2 me-2" style={{ color: 'var(--primary-color)' }}></i>
            Dashboard
          </a>
          
          <div className="navbar-nav ms-auto d-flex align-items-center">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="btn me-3"
              style={{
                background: isDarkMode ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '50%',
                width: '35px',
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>

            {/* User Dropdown */}
            <div className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" style={{ color: 'var(--text-primary)' }}>
                <img src={user?.avatar} alt="Avatar" className="rounded-circle me-2" width="32" height="32" />
                <span className="d-none d-md-inline">{user?.name}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end" style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border-color)'
              }}>
                <li><a className="dropdown-item" href="#" style={{ color: 'var(--text-primary)' }}>
                  <i className="bi bi-person me-2"></i>Profile
                </a></li>
                <li><a className="dropdown-item" href="#" style={{ color: 'var(--text-primary)' }}>
                  <i className="bi bi-gear me-2"></i>Settings
                </a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item text-danger" href="#" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid h-100 pt-4">
        <div className="row g-4 h-100">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 d-none d-md-block">
            <div className="card h-100" style={{ backgroundColor: 'var(--sidebar-bg)', borderColor: 'var(--border-color)' }}>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  <a href="#" className="list-group-item list-group-item-action active" style={{ color: 'white' }}>
                    <i className="bi bi-speedometer2 me-2"></i>Dashboard
                  </a>
                  <a href="#" className="list-group-item list-group-item-action" style={{ color: 'var(--text-primary)' }}>
                    <i className="bi bi-people me-2"></i>Users
                  </a>
                  <a href="#" className="list-group-item list-group-item-action" style={{ color: 'var(--text-primary)' }}>
                    <i className="bi bi-graph-up me-2"></i>Analytics
                  </a>
                  <a href="#" className="list-group-item list-group-item-action" style={{ color: 'var(--text-primary)' }}>
                    <i className="bi bi-file-text me-2"></i>Reports
                  </a>
                  <a href="#" className="list-group-item list-group-item-action" style={{ color: 'var(--text-primary)' }}>
                    <i className="bi bi-envelope me-2"></i>Messages
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="col-md-9 col-lg-10">
            <div className="h-100 overflow-y-auto">
              {/* Welcome Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <h2 className="mb-1">Welcome back, {user?.name}!</h2>
                  <p className="text-muted">Here's what's happening with your system today.</p>
                </div>
              </div>

              {/* Welcome Section */}
              <div className="row mb-4">
                <div className="col-12">
                  <h2 className="mb-1" style={{ color: 'var(--text-primary)' }}>Welcome back, {user?.name}!</h2>
                  <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Here's what's happening with your system today.</p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row g-4 mb-4">
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle p-3" style={{ backgroundColor: 'var(--primary-color)', opacity: 0.1 }}>
                            <i className="bi bi-people fs-4" style={{ color: 'var(--primary-color)' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1" style={{ color: 'var(--text-muted)' }}>Total Users</h6>
                          <h3 className="mb-0" style={{ color: 'var(--text-primary)' }}>{stats.totalUsers.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle p-3" style={{ backgroundColor: 'var(--success-color)', opacity: 0.1 }}>
                            <i className="bi bi-person-check fs-4" style={{ color: 'var(--success-color)' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1" style={{ color: 'var(--text-muted)' }}>Active Users</h6>
                          <h3 className="mb-0" style={{ color: 'var(--text-primary)' }}>{stats.activeUsers.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle p-3" style={{ backgroundColor: 'var(--warning-color)', opacity: 0.1 }}>
                            <i className="bi bi-currency-dollar fs-4" style={{ color: 'var(--warning-color)' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1" style={{ color: 'var(--text-muted)' }}>Revenue</h6>
                          <h3 className="mb-0" style={{ color: 'var(--text-primary)' }}>${stats.revenue.toLocaleString()}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'var(--card-bg)' }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          <div className="rounded-circle p-3" style={{ backgroundColor: 'var(--info-color)', opacity: 0.1 }}>
                            <i className="bi bi-graph-up-arrow fs-4" style={{ color: 'var(--info-color)' }}></i>
                          </div>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h6 className="mb-1" style={{ color: 'var(--text-muted)' }}>Growth</h6>
                          <h3 className="mb-0" style={{ color: 'var(--text-primary)' }}>{stats.growth}%</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Notifications */}
              <div className="row g-4 mb-4">
                <div className="col-lg-8">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">
                        <i className="bi bi-clock-history me-2"></i>Recent Activity
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="list-group-item border-0 px-0">
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0">
                                <div className="bg-light rounded-circle p-2">
                                  <i className={`bi ${activity.icon} text-muted`}></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h6 className="mb-1">{activity.user}</h6>
                                <p className="text-muted mb-0">{activity.action}</p>
                              </div>
                              <div className="flex-shrink-0">
                                <small className="text-muted">{activity.time}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">
                        <i className="bi bi-bell me-2"></i>Notifications
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        {notifications.map((notification) => (
                          <div key={notification.id} className="list-group-item border-0 px-0">
                            <div className="d-flex">
                              <div className="flex-shrink-0">
                                <div className={`rounded-circle p-2 bg-${
                                  notification.type === 'success' ? 'success' : 
                                  notification.type === 'warning' ? 'warning' : 'info'
                                } bg-opacity-10`}>
                                  <i className={`bi ${
                                    notification.type === 'success' ? 'bi-check-circle' : 
                                    notification.type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle'
                                  } text-${
                                    notification.type === 'success' ? 'success' : 
                                    notification.type === 'warning' ? 'warning' : 'info'
                                  }`}></i>
                                </div>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <p className="mb-1 small">{notification.message}</p>
                                <small className="text-muted">{notification.time}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row g-4 mb-4">
                <div className="col-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white border-0">
                      <h5 className="mb-0">
                        <i className="bi bi-lightning me-2"></i>Quick Actions
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-3">
                          <button className="btn btn-outline-primary w-100">
                            <i className="bi bi-plus-circle me-2"></i>Add User
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button className="btn btn-outline-success w-100">
                            <i className="bi bi-file-earmark-plus me-2"></i>New Report
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button className="btn btn-outline-warning w-100">
                            <i className="bi bi-gear me-2"></i>Settings
                          </button>
                        </div>
                        <div className="col-md-3">
                          <button className="btn btn-outline-danger w-100" onClick={handleLogout}>
                            <i className="bi bi-box-arrow-right me-2"></i>Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .h-100 {
          height: 100% !important;
        }
        
        .list-group-item-action:hover {
          background-color: var(--hover-bg);
        }
        
        .list-group-item-action.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }
        
        .card:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
        
        .overflow-y-auto {
          overflow-y: auto;
        }
        
        .btn:hover {
          transform: translateY(-1px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
