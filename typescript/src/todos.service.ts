import { MemoryTodoList } from "./memory-todo-list";
import { ITodoList } from "./todo-list";

export class TodoService {
  private list: ITodoList;

  constructor() {
    this.list = new MemoryTodoList();
  }

  public get(id?: string) {
    return this.list.get(id);
  }

  public create(data: any) {
    return this.list.create(data);
  }

  public update(id: string, changes: any) {
    return this.list.update(id, changes);
  }

  public delete(id: string) {
    return this.list.delete(id);
  }
}
