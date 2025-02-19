import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Loading } from './Loading';

interface Props {
  todo: Todo;
  deletePost: (postId: number) => Promise<void>;
  loadingTodo: number[];
  changePost: (updatedTodo: Todo) => Promise<void>;
  editingInputRef: React.RefObject<HTMLInputElement>;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deletePost,
  loadingTodo,
  changePost,
  editingInputRef,
  isEditing,
  setIsEditing,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { id, completed, title } = todo;

  const [editText, setEditText] = useState(title);

  // useEffect(() => {
  //   editingInputRef.current?.focus();
  // }, [isEditing]);

  const handleSave = async () => {
    if (!editText.trim()) {
      try {
        await deletePost(id);
      } catch {
        setIsEditing(true);
        setEditText(title);
      }

      return;
    }

    if (editText.trim() === title) {
      setIsEditing(false);

      return;
    }

    setIsLoading(true);
    try {
      await changePost({ ...todo, title: editText.trim() });
    } catch {
      setIsEditing(true);
      setEditText(title);

      return;
    }

    setIsEditing(false);
    setIsLoading(false);
    console.log(isEditing +' after change');
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      handleSave();
    } else if (event.key === 'Escape') {
      setEditText(title);
      setIsEditing(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            setIsLoading(true);
            changePost({ ...todo, completed: !completed }).finally(() =>
              setIsLoading(false),
            );
          }}
        />
      </label>

      {isEditing ? (
        <form onSubmit={e => e.preventDefault()}>
          <input
            //ref={editingInputRef}
            type="text"
            data-cy="TodoTitleField"
            className="todo__title-field"
            value={editText}
            placeholder="Empty todo will be deleted"
            onChange={event => setEditText(event.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleSave()}
            autoFocus
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            console.log(isEditing + ' before change');
          }}
        >
          {title}
        </span>
      )}

      {/* Remove button appears only on hover */}

      {!isEditing && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            setIsLoading(true);
            deletePost(id);
          }}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loading isLoading={isLoading} loadingTodo={loadingTodo} todoId={id} />
    </div>
  );
};
