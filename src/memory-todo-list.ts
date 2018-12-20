import { MemoryTodo } from "./memory-todo";
import { ITodo } from "./todo";
import { ITodoList } from "./todo-list";

export class MemoryTodoList implements ITodoList {
  private list: ITodo[];

  constructor() {
    this.list = [];
  }

  public get(id?: string) {
    if (id) {
      return this.list.find((todo) => todo.id === id) || null;
    }

    return this.list;
  }

  public add(todo: ITodo) {
    this.list.push(todo);
    return todo;
  }

  public create(data: any) {
    const todo = new MemoryTodo(data);

    return this.add(todo);
  }

  public update(id: string, changes: any) {
    const todo = this.list.find((item) => item.id === id);

    if (todo) {
      return todo.update(changes);
    }

    return null;
  }

  public delete(id: string) {
    const todo = this.list.find((item) => item.id === id);

    if (todo) {
      const index = this.list.indexOf(todo);
      return this.list.splice(index, 1)[0];
    }

    return null;
  }
}
