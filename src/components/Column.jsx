// components/Column.jsx
import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';

export default function Column({ 
  column, 
  tasks, 
  onDelete, 
  onRename, 
  onAddTask, 
  canEdit,
  canAddTasks 
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleRename = () => {
    onRename(title);
    setEditing(false);
  };

  const handleAddTaskSubmit = () => {
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle);
      setNewTaskTitle('');
      setAddingTask(false);
    }
  };

  return (
    <div className="kanban-column">
      <div className="column-header">
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
          />
        ) : (
          <>
            <h2 style={{ flex: '1' }}>{column.title}</h2>
            {canEdit && (
              <div className="column-actions" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {canAddTasks && (
                  <button
                    onClick={() => setAddingTask(!addingTask)}
                    title="Добавить задачу"
                    style={{ fontSize: '18px', cursor: 'pointer', background: 'none', border: 'none' }}
                  >
                    +
                  </button>
                )}
                <div className="column-menu" style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer' }}
                    title="Меню"
                  >
                    ⋮
                  </button>
                  {showMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <button
                        onClick={() => {
                          setEditing(true);
                          setShowMenu(false);
                        }}
                        style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        Редактировать
                      </button>
                      <button
                        onClick={() => {
                          onDelete();
                          setShowMenu(false);
                        }}
                        style={{ padding: '8px', cursor: 'pointer', background: 'none', border: 'none' }}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            className="task-list"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {addingTask && (
              <div style={{ marginTop: '10px' }}>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTaskSubmit()}
                  placeholder="Введите название задачи"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    marginBottom: '6px',
                  }}
                />
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button
                    onClick={handleAddTaskSubmit}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      flex: 1,
                    }}
                  >
                    Добавить
                  </button>
                  <button
                    onClick={() => setAddingTask(false)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}