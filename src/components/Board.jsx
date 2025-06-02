// src/components/Board.jsx
import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import { initialData } from '../data/mockData';
import { useAuth } from '../authentication/AuthContext';

export default function Board() {
  const [data, setData] = useState(initialData);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { user } = useAuth();

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId];
    const destColumn = data.columns[destination.droppableId];

    const sourceTaskIds = [...sourceColumn.taskIds];
    const [movedTask] = sourceTaskIds.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTaskIds.splice(destination.index, 0, movedTask);
      const newColumn = { ...sourceColumn, taskIds: sourceTaskIds };
      setData({
        ...data,
        columns: { ...data.columns, [newColumn.id]: newColumn },
      });
    } else {
      const destTaskIds = [...destColumn.taskIds];
      destTaskIds.splice(destination.index, 0, movedTask);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTaskIds },
          [destColumn.id]: { ...destColumn, taskIds: destTaskIds },
        },
      });
    }
  };

  const handleAddColumn = () => {
    if (!newColumnTitle.trim()) return;
    if (user?.role !== 'admin') {
      alert('Только администраторы могут добавлять колонки');
      return;
    }

    const newId = `column-${Date.now()}`;
    const newColumn = {
      id: newId,
      title: newColumnTitle,
      taskIds: [],
    };

    setData({
      ...data,
      columns: { ...data.columns, [newId]: newColumn },
      columnOrder: [...data.columnOrder, newId],
    });

    setNewColumnTitle('');
  };

  const handleDeleteColumn = (columnId) => {
    if (user?.role !== 'admin') {
      alert('Только администраторы могут удалять колонки');
      return;
    }

    const newColumns = { ...data.columns };
    delete newColumns[columnId];

    const newOrder = data.columnOrder.filter((id) => id !== columnId);

    const newTasks = { ...data.tasks };
    data.columns[columnId].taskIds.forEach((taskId) => {
      delete newTasks[taskId];
    });

    setData({
      ...data,
      columns: newColumns,
      columnOrder: newOrder,
      tasks: newTasks,
    });
  };

  const handleRenameColumn = (columnId, newTitle) => {
    if (user?.role !== 'admin') {
      alert('Только администраторы могут переименовывать колонки');
      return;
    }

    setData((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          title: newTitle,
        },
      },
    }));
  };

  const handleAddTask = (columnId, taskContent) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: taskContent || 'Новая задача',
      createdBy: user?.id || 'unknown',
    };

    setData((prevData) => {
      const newColumn = {
        ...prevData.columns[columnId],
        taskIds: [...prevData.columns[columnId].taskIds, newTaskId],
      };

      return {
        ...prevData,
        tasks: {
          ...prevData.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prevData.columns,
          [columnId]: newColumn,
        },
      };
    });
  };

  return (
    <div className="board-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-board">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                onDelete={() => handleDeleteColumn(column.id)}
                onRename={(newTitle) => handleRenameColumn(column.id, newTitle)}
                onAddTask={(taskContent) => handleAddTask(column.id, taskContent)}
                canEdit={user?.role === 'admin'}
                canAddTasks={!!user}
              />
            );
          })}
        </div>
      </DragDropContext>

      {user?.role === 'admin' && (
        <div className="add-column">
          <input
            type="text"
            placeholder="Новая колонка"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
          />
          <button onClick={handleAddColumn}>Добавить колонку</button>
        </div>
      )}
    </div>
  );
}
