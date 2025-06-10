import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import {
  FaHome,
  FaTasks,
  FaUserFriends,
  FaChartBar,
  FaCalendarAlt,
  FaArchive,
  FaInbox,
  FaCog,
  FaLifeRing,
  FaChevronLeft,
  FaChevronRight,
  FaProjectDiagram,
  FaBell,
  FaChevronDown
} from 'react-icons/fa';

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');

  const selectedCompany = user?.selectedCompanyId || (user?.companies?.[0]?.id ?? '');

  const handleCompanyChange = (newCompanyId) => {
    const updatedUser = { ...user, selectedCompanyId: newCompanyId };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const sections = [
    { id: 'Welcome', name: 'Главная', icon: <FaHome />, to: '/welcome' },
    { id: 'Projects', name: 'Проекты', icon: <FaProjectDiagram />, to: '/projects' },
    { id: 'Tasks', name: 'Мои задачи', icon: <FaTasks />, to: '/tasks' },
    { id: 'Backlog', name: 'Бэклог', icon: <FaInbox />, to: '/backlog' },
    { id: 'Calendar', name: 'Календарь', icon: <FaCalendarAlt />, to: '/calendar' },
    { id: 'Team', name: 'Команда', icon: <FaUserFriends />, to: '/team', adminOnly: true },
    { id: 'Reports', name: 'Отчеты', icon: <FaChartBar />, to: '/reports' },
    { id: 'Archive', name: 'Архив', icon: <FaArchive />, to: '/archive' },
    { id: 'Notifications', name: 'Уведомления', icon: <FaBell />, to: '/notifications' },
  ];

  return (
    <div
      style={{
        width: collapsed ? '70px' : '220px',
        background: '#f8f9fa',
        borderRight: '1px solid #e0e0e0',
        height: '100vh',
        overflowY: 'auto',
        padding: '16px 0',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        transition: 'width 0.3s ease'
      }}
    >
      {collapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 16px 8px' }}>
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Развернуть"
          >
            <FaChevronLeft size={12} />
          </button>
        </div>
      )}

      <div
        style={{
          padding: '0 16px 16px',
          borderBottom: '1px solid #e0e0e0',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: collapsed ? '8px' : '0',
          position: 'relative'
        }}
      >
        <Link
          to="/profile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : '10px',
            textDecoration: 'none',
            color: '#333'
          }}
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              👤
            </div>
          )}
          {!collapsed && (
            <div>
              <div style={{ fontWeight: '600' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {user?.role === 'admin' ? 'Admin' : 'Участник'}
              </div>
            </div>
          )}
        </Link>

        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Свернуть"
          >
            <FaChevronRight size={12} />
          </button>
        )}
      </div>

      <div style={{ padding: '0 8px' }}>
        {sections
          .filter(section => !section.adminOnly || user?.role === 'admin')
          .map((section) => (
            <Link
              key={section.id}
              to={section.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : '12px',
                padding: '8px 12px',
                borderRadius: '6px',
                marginBottom: '4px',
                cursor: 'pointer',
                background: location.pathname.startsWith(section.to) ? '#e3f2fd' : 'transparent',
                color: location.pathname.startsWith(section.to) ? '#1976d2' : '#333',
                textDecoration: 'none',
                transition: 'all 0.2s',
                height: '40px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{section.icon}</span>
              {!collapsed && (
                <span style={{ fontSize: '14px', lineHeight: '1', display: 'inline-block' }}>
                  {section.name}
                </span>
              )}
            </Link>
          ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 8px 12px',
          background: '#f8f9fa'
        }}
      >
        <div style={{ height: '1px', background: '#e0e0e0', marginBottom: '12px' }}></div>

        <Link
          to="/settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : '12px',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '4px',
            cursor: 'pointer',
            color: '#333',
            textDecoration: 'none',
            height: '40px'
          }}
        >
          <FaCog />
          {!collapsed && (
            <span style={{ fontSize: '14px', lineHeight: '1', display: 'inline-block' }}>
              Настройки
            </span>
          )}
        </Link>

        <Link
          to="/help"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : '12px',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            color: '#333',
            textDecoration: 'none',
            height: '40px'
          }}
        >
          <FaLifeRing />
          {!collapsed && (
            <span style={{ fontSize: '14px', lineHeight: '1', display: 'inline-block' }}>
              Помощь
            </span>
          )}
        </Link>

        {!collapsed && (
          <div style={{ padding: '0 12px', marginTop: '12px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
              Выберите компанию
            </div>
            <div style={{ position: 'relative' }}>
              <select
                style={{
                  width: '100%',
                  height: '30px',
                  padding: '0 32px 0 12px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  background: '#fff',
                  color: '#333',
                  appearance: 'none',
                  cursor: 'pointer'
                }}
                value={selectedCompany || ''}
                onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'add_new_company') {
                    setIsModalOpen(true);
                    // Сбросить выбор в select, чтобы не застревал на "Добавить компанию"
                    setTimeout(() => {
                        const firstCompanyId = user?.companies?.[0]?.id || '';
                        handleCompanyChange(firstCompanyId);
                    }, 0);
                    } else {
                    handleCompanyChange(value);
                    }
                }}
                >
                {user?.companies?.length > 0 &&
                  user.companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                <option value="add_new_company">Добавить компанию</option>
              </select>
              <FaChevronDown
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '24px',
            width: '300px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <h3 style={{ margin: 0 }}>Новая компания</h3>
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Введите название"
              style={{
                padding: '8px',
                fontSize: '14px',
                borderRadius: '6px',
                border: '1px solid #ccc'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: '#f0f0f0',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  if (!newCompanyName.trim()) return;
                  const newCompany = {
                    id: String(Date.now()),
                    name: newCompanyName.trim()
                  };
                  const updatedUser = {
                    ...user,
                    companies: [...(user?.companies || []), newCompany],
                    selectedCompanyId: newCompany.id
                  };
                  setUser(updatedUser);
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  setIsModalOpen(false);
                  setNewCompanyName('');
                  navigate('/welcome');
                }}
                style={{
                  background: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
