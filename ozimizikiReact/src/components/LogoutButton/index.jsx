import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
const LogoutButton = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
 
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userId');

    fetch('http://localhost:8000/api/logout/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        console.log('Logout successful');
      } else {
        console.error('Logout failed');
      }
    })
    .catch(error => {
      console.error('Error during logout:', error);
    });

    navigate('/login');
  };

  return (
    <div onClick={handleLogout} className={styles.button}>
      Logout
    </div>
  );
};

export default LogoutButton;
