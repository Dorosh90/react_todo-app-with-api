import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { Loading } from './Loading';

interface Props {
  todo: Todo;
  deletePost: (postId: number) => Promise<void>;
  loadingTodo: number[];
  changePost: (updatedTodo: Todo) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deletePost,
  loadingTodo,
  changePost,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { id, completed, title } = todo;

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
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      {/* Remove button appears only on hover */}
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
      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loading isLoading={isLoading} loadingTodo={loadingTodo} todoId={id} />
    </div>
  );
};
