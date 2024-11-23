import React, { useState } from 'react';
import styles from './style.module.css';

export default function CreateRoomForGovernmentComponent() {
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    size: '',
    internet: false,
    furniture: false,
    air_conditioning: false,
    heating: false,
    computer_count: '',
    blackboard_simple: false,
    blackboard_touchscreen: false,
    description: '',
    price: '',
    busy: false,
    photo: null,
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User ID not found in localStorage');
      return;
    }

    const roomData = new FormData();
    roomData.append('user', userId);
    roomData.append('name', formData.name);
    roomData.append('floor', formData.floor);
    roomData.append('size', formData.size);
    roomData.append('internet', formData.internet);
    roomData.append('furniture', formData.furniture);
    roomData.append('air_conditioning', formData.air_conditioning);
    roomData.append('heating', formData.heating);
    roomData.append('computer_count', formData.computer_count);
    roomData.append('blackboard_simple', formData.blackboard_simple);
    roomData.append('blackboard_touchscreen', formData.blackboard_touchscreen);
    roomData.append('description', formData.description);
    roomData.append('price', formData.price);
    roomData.append('busy', formData.busy);

    if (formData.photo) {
      roomData.append('photo', formData.photo);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/room/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: roomData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Room created successfully!");
        setIsModalOpen(false); 
        setFormData({
          name: '',
          floor: '',
          size: '',
          internet: false,
          furniture: false,
          air_conditioning: false,
          heating: false,
          computer_count: '',
          blackboard_simple: false,
          blackboard_touchscreen: false,
          description: '',
          price: '',
          busy: false,
          photo: null,
        });
      } else {
        const error = await response.json();
        alert("Error creating room: " + JSON.stringify(error));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.container}>
      <button onClick={openModal} className={styles.createRoomForGovernmentButton}>Создать комнату</button>

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button onClick={closeModal} className={styles.closeButton}>X</button>
            <h1>Создать комнату</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
              <label>
                Название:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <br />

              <label>
                Этаж:
                <input type="number" name="floor" value={formData.floor} onChange={handleChange} required />
              </label>
              <br />

              <label>
                Площадь (кв. м):
                <input type="number" name="size" value={formData.size} onChange={handleChange} required />
              </label>
              <br />

              <label>
                Интернет:
                <input type="checkbox" name="internet" checked={formData.internet} onChange={handleChange} />
              </label>
              <br />

              <label>
                Мебель:
                <input type="checkbox" name="furniture" checked={formData.furniture} onChange={handleChange} />
              </label>
              <br />

              <label>
                Кондиционер:
                <input type="checkbox" name="air_conditioning" checked={formData.air_conditioning} onChange={handleChange} />
              </label>
              <br />

              <label>
                Отопление:
                <input type="checkbox" name="heating" checked={formData.heating} onChange={handleChange} />
              </label>
              <br />

              <label>
                Количество компьютеров:
                <input type="number" name="computer_count" value={formData.computer_count} onChange={handleChange} required />
              </label>
              <br />

              <label>
                Доска:
                <input type="checkbox" name="blackboard_simple" checked={formData.blackboard_simple} onChange={handleChange} />
              </label>
              <br />

              <label>
                Электронная доска:
                <input type="checkbox" name="blackboard_touchscreen" checked={formData.blackboard_touchscreen} onChange={handleChange} />
              </label>
              <br />

              <label>
                Описание:
                <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
              </label>
              <br />

              <label>
                Цена:
                <input type="number" name="price" value={formData.price} onChange={handleChange} required />
              </label>
              <br />

              <label>
                Занята:
                <input type="checkbox" name="busy" checked={formData.busy} onChange={handleChange} />
              </label>
              <br />

              <label>
                Фото:
                <input type="file" name="photo" onChange={handleFileChange} />
              </label>
              <br />

              <button className={styles.submitButton} type="submit">Создать</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
