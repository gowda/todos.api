import { Todo } from "./todo";

export class MemoryTodo implements Todo {
  id: string;
  title: string;
  description: string;
  done: Boolean;
  created: Date;
  updated: Date;

  private generateId() {
    return [new Date().getTime(), 42, Math.floor(Math.random() * 42)].join('');
  }

  constructor(data: any) {
    this.id = this.generateId();
    this.title = data.title;
    this.description = data.description;
    this.done = data.done || false;
    this.created = new Date();
    this.updated = new Date();
  }

  update(data: any) {
    var updated = false;
    if (data.title) {
      updated = true;
      this.title = data.title;
    }

    if (data.description) {
      updated = true;
      this.description = data.description;
    }

    if (data.done) {
      updated = true;
      this.done = data.done;
    }

    if (updated) {
      this.updated = new Date();
    }

    return this;
  }
}
