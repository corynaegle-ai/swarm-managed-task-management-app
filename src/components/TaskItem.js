import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const TaskItem = ({ task, index, onToggle, onDelete }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`task-item ${task.completed ? 'completed' : ''}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform || ''} rotate(5deg)`
              : provided.draggableProps.style?.transform || 'none',
            transition: 'all 0.2s ease',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: snapshot.isDragging ? '0 4px 8px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div
            {...provided.dragHandleProps}
            className="drag-handle"
            style={{
              cursor: snapshot.isDragging ? 'grabbing' : 'grab',
              padding: '4px',
              borderRadius: '3px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s ease',
              fontSize: '14px',
              color: '#666',
              minWidth: '20px',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              if (!snapshot.isDragging) {
                e.target.style.backgroundColor = '#f0f0f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!snapshot.isDragging) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            ⋮⋮
          </div>
          
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            style={{
              cursor: 'pointer',
              transform: 'scale(1.2)'
            }}
          />
          
          <span
            style={{
              flex: 1,
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#888' : '#333',
              fontSize: '14px'
            }}
          >
            {task.text}
          </span>
          
          <button
            onClick={() => onDelete(task.id)}
            style={{
              background: '#ff4757',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              padding: '4px 8px',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff3742';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff4757';
            }}
          >
            Delete
          </button>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;