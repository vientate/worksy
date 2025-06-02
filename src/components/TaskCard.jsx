// components/TaskCard.jsx
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { initialData } from '../data/mockData';
import { useAuth } from '../authentication/AuthContext';

export default function TaskCard({ task, index }) {
  const { currentUser } = useAuth();
  const creator = initialData.users[task.createdBy]?.name || 'Неизвестно';

  // Проверка, может ли пользователь редактировать задачу
  const canEdit = currentUser?.role === 'admin' || currentUser?.id === task.createdBy;

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={!canEdit}>
      {(provided) => (
        <div
          className="task-item"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div>{task.content}</div>
          <div style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
            Создал: {creator}
          </div>
          {canEdit && (
            <div style={{ marginTop: '5px', fontSize: '0.8em', color: '#999' }}>
              (Перетащите для перемещения)
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}