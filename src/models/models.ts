export interface IUser {
  createdAt: Date;
  email: string;
  name: string | undefined;
}
export interface IWorkday {
  id: string;
  date: string;
  hoursWorked: number;
  minutesWorked: number;
}

export interface ITodo {
  todo: string;
  id: string;
  date: number;
  taskCompleted: boolean;
}
