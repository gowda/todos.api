import { ITodo } from "./todo";

export class MemoryTodo implements ITodo {
  public id: string;
  public title: string;
  public description: string;
  public done: boolean;
  public created: Date;
  public updated: Date;

  constructor(data: any) {
    this.id = this.generateId();
    this.title = data.title;
    this.description = data.description;
    this.done = data.done || false;
    this.created = new Date();
    this.updated = new Date();
  }

  public update(data: any) {
    let updated = false;
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

  private generateId() {
    return [new Date().getTime(), 42, Math.floor(Math.random() * 42)].join("");
  }
}
