import { useAuth } from '../authentication/AuthContext';
import { Link } from 'react-router-dom';
import { FaTasks, FaProjectDiagram, FaBell } from 'react-icons/fa';
import { useEffect, useState } from 'react';

export default function WelcomePage() {
  const { user } = useAuth();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Определяем текущую выбранную компанию
  const selectedCompany = user?.companies?.find(
    (c) => c.id === user?.selectedCompanyId
  );

  return (
    <div style={styles.container}>
      {/* 👋 Приветствие */}
      <div style={{
        ...styles.greetingContainer,
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
      }}>
        <h1 style={styles.gradientHeading}>
          Добро пожаловать, {user?.name || 'Пользователь'}! 👋
        </h1>

        {/* Название компании */}
        {selectedCompany && (
          <p style={{ ...styles.subheading, fontWeight: 500, color: '#374151' }}>
            Вы работаете в компании: <strong>{selectedCompany.name}</strong>
          </p>
        )}

        <p style={styles.subheading}>
          Здесь вы можете увидеть свои задачи, следить за прогрессом проектов и быть в курсе последних событий.
        </p>
      </div>

      {/* 📌 Секции */}
      <div style={styles.grid}>
        <Card
          title="Задачи на сегодня"
          icon={<FaTasks size={22} />}
          items={[
            'Завершить отчёт по проекту Alpha',
            'Ответить на комментарии',
            'Доработка интерфейса'
          ]}
          link="/tasks"
          linkText="Перейти к задачам"
        />

        <Card
          title="Прогресс проектов"
          icon={<FaProjectDiagram size={22} />}
          progressList={[
            { name: 'Project Alpha', percent: 70 },
            { name: 'CRM 2.0', percent: 45 },
            { name: 'Redesign', percent: 30 }
          ]}
          link="/projects"
          linkText="Перейти к проектам"
        />

        <Card
          title="Уведомления"
          icon={<FaBell size={22} />}
          items={[
            'Новое сообщение в проекте Alpha',
            'Изменение дедлайна по CRM'
          ]}
          link="/notifications"
          linkText="Открыть уведомления"
        />
      </div>
    </div>
  );
}

function Card({ title, icon, items, link, linkText, progressList }) {
  return (
    <section style={styles.card}>
      <div style={styles.cardHeader}>
        <div style={styles.icon}>{icon}</div>
        <h2 style={styles.cardTitle}>{title}</h2>
      </div>

      {progressList ? (
        progressList.map((project, index) => (
          <div key={index} style={styles.progressBlock}>
            <div style={styles.progressHeader}>
              <span>{project.name}</span>
              <span>{project.percent}%</span>
            </div>
            <div style={styles.progressBarBackground}>
              <div
                style={{
                  ...styles.progressBarForeground,
                  width: `${project.percent}%`
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <ul style={styles.taskList}>
          {items.map((item, idx) => (
            <li key={idx} style={styles.taskItem}>{item}</li>
          ))}
        </ul>
      )}

      <Link to={link} style={styles.link}>
        {linkText} →
      </Link>
    </section>
  );
}

// 🎨 Стили (оставляем без изменений)
const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
    color: '#1f2937'
  },
  greetingContainer: {
    marginBottom: '40px'
  },
  gradientHeading: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '12px',
    color: '#111827',
    background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'inline-block'
  },
  subheading: {
    color: '#6b7280',
    fontSize: '16px',
    maxWidth: '600px',
    lineHeight: 1.5
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'default'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  icon: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    margin: 0
  },
  taskList: {
    paddingLeft: '16px',
    marginBottom: '20px',
    fontSize: '15px',
    color: '#374151'
  },
  taskItem: {
    marginBottom: '10px'
  },
  progressBlock: {
    marginBottom: '16px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '4px'
  },
  progressBarBackground: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px'
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px'
  },
  link: {
    fontSize: '14px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  }
};
