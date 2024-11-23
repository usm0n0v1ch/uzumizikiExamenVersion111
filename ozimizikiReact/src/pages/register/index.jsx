import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
export default function Register({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                localStorage.setItem('userId', data.userId);
                localStarage.setItem('role', data.role);

            
                onLogin();

                navigate('/'); 
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>Регистрация</div>
            <form onSubmit={handleRegister} className={styles.form}>
                <input
                    type="text"
                    placeholder="Имя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
                <input className={styles.button} type="submit" value="Зарегистрироваться" />
            </form>
        </div>
    );
}
