import { TodoList } from "./todo-list";
import { MemoryTodoList } from "./memory-todo-list";

export class TodoService {
  private list: TodoList;

  constructor() {
    this.list = new MemoryTodoList();
  }

  get(id?: string) {
    return this.list.get(id);
  }

  create(data: any) {
    return this.list.create(data);
  }

  update(id: string, changes: any) {
    return this.list.update(id, changes);
  }

  delete(id: string) {
    return this.list.delete(id);
  }
}
