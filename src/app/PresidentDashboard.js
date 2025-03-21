import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './PresidentDashboard.css';

const PresidentDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSessions: 0,
    pendingApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Fetch initial data on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch user data
        const userResponse = await fetch('http://localhost:2001/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!userResponse.ok) {
          throw new Error('Authentication failed');
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch dashboard statistics
        const statsResponse = await fetch('http://localhost:2001/api/president/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const statsData = await statsResponse.json();
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.message === 'Authentication failed') {
          router.push('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('savedEmail');
    router.push('/login');
  };

  // Tab content components
  const OverviewTab = () => (
    <div className="tab-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p className="stat-value">{stats.activeSessions}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Approvals</h3>
          <p className="stat-value">{stats.pendingApprovals}</p>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="tab-content">
      <h2>User Management</h2>
      {/* Add user management functionality here */}
      <button className="action-btn">Add New User</button>
    </div>
  );

  const SettingsTab = () => (
    <div className="tab-content">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Profile</h3>
        <p>Email: {userData?.email}</p>
        <p>Name: {userData?.name}</p>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="dashboard-container loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>President Dashboard</h2>
          <p>Welcome, {userData?.name || 'President'}</p>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
          <button className="nav-item logout" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          <div className="user-info">
            <span>Last Login: {new Date().toLocaleString()}</span>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'users' && <UsersTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;