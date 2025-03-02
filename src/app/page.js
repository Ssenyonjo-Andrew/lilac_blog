import React from 'react';
import './globals.css'; // Import the CSS file

const Page = () => {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h1>ROBOTICS AND AI CHAPTER</h1>
        <div className="user-info">
          <span>Welcome, Admin</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Quick Actions Section */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn">Add Student</button>
            <button className="action-btn">Add Teacher</button>
            <button className="action-btn">Create Announcement</button>
          </div>
        </section>

        {/* Student Management Section */}
        <section className="student-management">
          <h2>Student Management</h2>
          <table className="student-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Grade</th>
                <th>Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Grade 10</td>
                <td>95%</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>Grade 9</td>
                <td>90%</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Alice Johnson</td>
                <td>Grade 11</td>
                <td>85%</td>
                <td>
                  <button className="edit-btn">Edit</button>
                  <button className="delete-btn">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Announcements Section */}
        <section className="announcements">
          <h2>Announcements</h2>
          <div className="announcement-list">
            <div className="announcement-card">
              <h3>School Holiday</h3>
              <p>There will be no school on Monday, October 30th, due to a public holiday.</p>
              <span className="announcement-date">Posted on: 2023-10-25</span>
            </div>
            <div className="announcement-card">
              <h3>Parent-Teacher Meeting</h3>
              <p>The parent-teacher meeting is scheduled for November 5th. Please confirm your attendance.</p>
              <span className="announcement-date">Posted on: 2023-10-20</span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2023 School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
