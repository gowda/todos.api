export interface Todo {
  id: string,
  title: string,
  description?: string,
  done: Boolean,
  created: Date,
  updated: Date,
  update: (data: any) => Todo,
}
