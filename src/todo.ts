export interface ITodo {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  created: Date;
  updated: Date;
  update: (data: any) => ITodo;
}
