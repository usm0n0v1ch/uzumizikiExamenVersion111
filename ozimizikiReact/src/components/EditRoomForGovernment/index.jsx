import React, { useEffect, useState } from 'react';
import styles from './style.module.css';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default function EditRoomForGovernment() {
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const userId = localStorage.getItem('userId');  // Получаем userId из localStorage

    useEffect(() => {
        // Fetch rooms for the current user
        if (userId) {
            fetch(`http://127.0.0.1:8000/api/room/?userId=${userId}`)
                .then((response) => response.json())
                .then((data) => setRooms(data))
                .catch((error) => console.error('Error fetching rooms:', error));
        } else {
            console.log('User ID not found in localStorage.');
        }

        // Fetch users for the 'government' role
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/user/');
                if (!response.ok) {
                    throw new Error('Unable to load users');
                }
                const data = await response.json();
                const governmentUsers = data.filter(user => user.role === 'government');
                setUsers(governmentUsers);
                setLoadingUsers(false);
            } catch (error) {
                console.error('Error loading users:', error);
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, [userId]);

    const handleEditClick = (room) => {
        setCurrentRoom(room);
        setIsEditing(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setCurrentRoom((prevState) => ({
            ...prevState,
            [name]: files ? files[0] : type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Add room data to FormData
        Object.keys(currentRoom).forEach((key) => {
            formData.append(key, currentRoom[key]);
        });

        fetch(`http://127.0.0.1:8000/api/room/${currentRoom.id}/`, {
            method: 'PUT',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error updating room');
                }
                return response.json();
            })
            .then((data) => {
                setRooms((prevRooms) =>
                    prevRooms.map((room) => (room.id === data.id ? data : room))
                );
                setIsEditing(false);
                setCurrentRoom(null);
            })
            .catch((error) => console.error('Error updating room:', error));
    };

    const handleDelete = (roomId) => {
        fetch(`http://127.0.0.1:8000/api/room/${roomId}/`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error deleting room');
                }
                setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
            })
            .catch((error) => console.error('Error deleting room:', error));
    };

    return (
        <div className={styles.container}>
            <h1>Список комнат</h1>
            <div>
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div key={room.id} className={styles.card}>
                            <div className={styles.imgInfo}>
                                <img className={styles.img} src={room.photo} alt={room.name} />
                                <div className={styles.info}>
                                    <div className={styles.name}>{room.name}</div>
                                    <div>Этаж: {room.floor}</div>
                                    <div>Площадь: {room.size} m²</div>
                                    <div>Цена: {room.price} сум</div>
                                </div>
                            </div>

                            <div className={styles.features}>
                                <div>Интернет: {room.internet ? 'Да' : 'Нет'}</div>
                                <div>Мебель: {room.furniture ? 'Да' : 'Нет'}</div>
                                <div>Кондиционер: {room.air_conditioning ? 'Да' : 'Нет'}</div>
                                <div>Отопление: {room.heating ? 'Да' : 'Нет'}</div>
                                <div>Количество компьютеров: {room.computer_count}</div>
                                <div>Доска: {room.blackboard_simple ? 'Да' : 'Нет'}</div>
                                <div>Электронная доска: {room.blackboard_touchscreen ? 'Да' : 'Нет'}</div>
                            </div>

                            <div className={styles.actions}>
                                <button
                                    onClick={() => handleDelete(room.id)}
                                    className={styles.deleteButton}
                                >
                                    Удалить
                                </button>
                                <button
                                    onClick={() => handleEditClick(room)}
                                    className={styles.editButton}
                                >
                                    Редактировать
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет доступных комнат.</p>
                )}
            </div>

            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
                {currentRoom && (
                    <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
                        <h2>Редактировать комнату</h2>
                        <div>
                            <label>
                                Название:
                                <input
                                    type="text"
                                    name="name"
                                    value={currentRoom.name || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Описание:
                                <textarea
                                    name="description"
                                    value={currentRoom.description || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Фото:
                                <input
                                    type="file"
                                    name="photo"
                                    onChange={handleChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Этаж:
                                <input
                                    type="number"
                                    name="floor"
                                    value={currentRoom.floor || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Размер:
                                <input
                                    type="number"
                                    name="size"
                                    value={currentRoom.size || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Цена:
                                <input
                                    type="number"
                                    name="price"
                                    value={currentRoom.price || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Интернет:
                                <input
                                    type="checkbox"
                                    name="internet"
                                    checked={currentRoom.internet || false}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Мебель:
                                <input
                                    type="checkbox"
                                    name="furniture"
                                    checked={currentRoom.furniture || false}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Кондиционер:
                                <input
                                    type="checkbox"
                                    name="air_conditioning"
                                    checked={currentRoom.air_conditioning || false}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Отопление:
                                <input
                                    type="checkbox"
                                    name="heating"
                                    checked={currentRoom.heating || false}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Количество компьютеров:
                                <input
                                    type="number"
                                    name="computer_count"
                                    value={currentRoom.computer_count || ''}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Обычная доска:
                                <input
                                    type="checkbox"
                                    name="blackboard_simple"
                                    checked={currentRoom.blackboard_simple || false}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                Выберите пользователя:
                                <select
                                    name="user_id"
                                    value={currentRoom.user_id || userId} // Значение по умолчанию - userId из localStorage
                                    onChange={handleChange}
                                    required
                                >
                                    {loadingUsers ? (
                                        <option>Загрузка пользователей...</option>
                                    ) : (
                                        users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>
                        </div>
                        <div className={styles.actionsModal}>
                            <button type="submit" className={styles.saveButton}>
                                Сохранить
                            </button>
                            <button
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setIsEditing(false)}
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
