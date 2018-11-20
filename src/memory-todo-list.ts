import { Todo } from "./todo";
import { TodoList } from "./todo-list";
import { MemoryTodo } from "./memory-todo";

export class MemoryTodoList implements TodoList {
  list: Todo[];

  constructor() {
    this.list = [];
  }

  get(id?: string) {
    if (id) {
      return this.list.find(todo => todo.id === id) || null;
    }

    return this.list;
  }

  add(todo: Todo) {
    this.list.push(todo);
    return todo;
  }

  create(data: any) {
    var todo = new MemoryTodo(data);

    return this.add(todo);
  }

  update(id: string, changes: any) {
    var todo = this.list.find(todo => todo.id === id);

    if (todo) {
      return todo.update(changes);
    }

    return null;
  }

  delete(id: string) {
    var todo = this.list.find(todo => todo.id === id);

    if (todo) {
      var index = this.list.indexOf(todo);
      return this.list.splice(index, 1)[0];
    }

    return null;
  }
}
