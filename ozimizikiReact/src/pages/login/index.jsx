import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './style.module.css';
export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/api/login/', {
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
                localStorage.setItem('role', data.role);


                onLogin();


                navigate('/');
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                setErrorMessage(errorData.error || 'Ошибка при авторизации');
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            setErrorMessage('Произошла ошибка при попытке авторизации');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Авторизация</h2>
            <form className={styles.form} onSubmit={handleLogin}>
                <input 
                    type='text' 
                    placeholder='Имя' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input 
                    type='password' 
                    placeholder='Пароль' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                <input className={styles.button} type='submit' value='Авторизоваться' />
            </form>
        </div>
    );
}
