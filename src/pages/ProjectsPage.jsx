import React, { useState, useEffect } from "react";

const ProjectsPage = ({ companyName }) => {
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteCopied, setInviteCopied] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Ошибка загрузки пользователей");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Ошибка при загрузке пользователей:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleUser = (user) => {
    setSelectedUsers((prev) =>
      prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
    );
  };

  const handleCreateProject = () => {
    if (projectName.trim() !== "") {
      setProjects([
        ...projects,
        { name: projectName, users: selectedUsers },
      ]);
      setProjectName("");
      setSelectedUsers([]);
      setShowForm(false);
    }
  };

  const handleInviteClick = () => {
    const inviteLink = `${window.location.origin}/invite?company=${encodeURIComponent(companyName)}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      setInviteCopied(true);
      setTimeout(() => setInviteCopied(false), 2000);
    });
  };

  return (
    <div style={styles.container}>
      {/* Блок компании */}
      <div style={styles.companyCard}>
        <h2>Компания "{companyName}"</h2>
        <button style={styles.primaryButton} onClick={handleInviteClick}>
          Добавить участника по ссылке
        </button>
        {inviteCopied && (
          <p style={{ color: "green", marginTop: "0.5rem" }}>
            Ссылка скопирована в буфер обмена!
          </p>
        )}
      </div>

      {/* Блок проектов */}
      <div style={styles.card}>
        <h1 style={styles.title}>Проекты</h1>

        <div style={styles.linkContainer}>
          <span style={styles.link} onClick={() => setShowForm(true)}>
            + Добавить проект
          </span>
        </div>

        <div style={styles.projectsList}>
          {projects.map((project, index) => (
            <div key={index} style={styles.projectCard}>
              <strong>{project.name}</strong>
              <p style={{ marginTop: "0.5rem", fontSize: "14px" }}>
                Участники: {project.users.join(", ") || "Нет"}
              </p>
            </div>
          ))}

          <div style={styles.bigAddCard} onClick={() => setShowForm(true)}>
            <span style={styles.plus}>+</span>
          </div>
        </div>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <div style={styles.form}>
            <h2>Новый проект</h2>

            <label>Название проекта</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Введите название"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <label>Участники проекта</label>
            {loading ? (
              <p>Загрузка пользователей...</p>
            ) : (
              <div style={styles.userList}>
                {users.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      ...styles.userItem,
                      backgroundColor: selectedUsers.includes(user.name)
                        ? "#c7d2fe"
                        : "#f3f4f6",
                    }}
                    onClick={() => toggleUser(user.name)}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}

            <div style={styles.buttons}>
              <button style={styles.primaryButton} onClick={handleCreateProject}>
                Создать
              </button>
              <button style={styles.secondaryButton} onClick={() => setShowForm(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Обновлённые стили
const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
    maxWidth: "900px",
  },
  companyCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "2rem",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
  },
  linkContainer: {
    marginBottom: "1.5rem",
  },
  link: {
    color: "#2563eb",
    fontSize: "16px",
    cursor: "pointer",
    display: "inline-block",
  },
  projectsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "flex-start",
  },
  projectCard: {
    padding: "1rem",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    minWidth: "200px",
  },
  bigAddCard: {
    width: "200px",
    height: "120px",
    backgroundColor: "#e0e7ff",
    border: "2px dashed #2563eb",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "2rem",
    color: "#2563eb",
    cursor: "pointer",
  },
  plus: {
    fontSize: "3rem",
    lineHeight: "1",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  form: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "350px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "1rem",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryButton: {
    backgroundColor: "#e5e7eb",
    color: "#111827",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  userList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  userItem: {
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #ccc",
    userSelect: "none",
  },
};

export default ProjectsPage;
