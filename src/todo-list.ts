import { Todo } from "./todo";

export interface TodoList {
  get: (id?: string) => Todo | Todo[] | null;
  add: (todo: Todo) => Todo;
  create: (data: any) => Todo;
  update: (id: string, changes: any) => Todo | null;
  delete: (id: string) => Todo | null;
}
