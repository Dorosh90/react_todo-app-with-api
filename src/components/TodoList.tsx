import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletePost: (postId: number) => Promise<void>;
  loadingTodo: number[];
  changePost: (updatedTodo: Todo) => Promise<void>;
  editingInputRef: React.RefObject<HTMLInputElement>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletePost,
  loadingTodo,
  changePost,
  editingInputRef,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {todos &&
        todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            deletePost={deletePost}
            loadingTodo={loadingTodo}
            changePost={changePost}
            editingInputRef={editingInputRef}
          />
        ))}
    </section>
  );
};
