import { ITodo } from "./todo";

export interface ITodoList {
  get: (id?: string) => ITodo | ITodo[] | null;
  add: (todo: ITodo) => ITodo;
  create: (data: any) => ITodo;
  update: (id: string, changes: any) => ITodo | null;
  delete: (id: string) => ITodo | null;
}
