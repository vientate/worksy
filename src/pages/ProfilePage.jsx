import { useAuth } from '../authentication/AuthContext';
import { useState } from 'react';

export default function ProfilePage() {
  const { user, token, setUser } = useAuth();
  const [nickname, setNickname] = useState(user?.name || '');
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || '');
  const [status, setStatus] = useState('');

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setNewAvatarFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvatar(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    let avatarBase64 = previewAvatar;

    if (newAvatarFile) {
      const reader = new FileReader();
      avatarBase64 = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(newAvatarFile);
      });
    }

    try {
      const res = await fetch('http://localhost:3000/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname,
          avatar: avatarBase64
        })
      });

      const data = await res.json();

      if (res.ok) {
        setUser(prev => ({
          ...prev,
          name: nickname,
          nickname: nickname,
          avatar: avatarBase64
        }));
        setStatus('✅ Профиль обновлён');
      } else {
        setStatus(`❌ Ошибка: ${data.message}`);
        console.error('Ответ сервера при ошибке:', data);
      }
    } catch (err) {
      console.error('Ошибка при сохранении профиля:', err);
      setStatus('❌ Ошибка при сохранении');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>👤 Профиль пользователя</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
        <img
          src={previewAvatar}
          alt="avatar"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #ccc'
          }}
        />
        <div>
          <label style={{ fontWeight: 'bold' }}>Сменить аватар:</label><br />
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Ник:</label><br />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            marginTop: '5px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#537fe7',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        💾 Сохранить изменения
      </button>

      {status && <p style={{ marginTop: '10px' }}>{status}</p>}
    </div>
  );
}
