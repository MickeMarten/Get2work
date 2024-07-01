export interface IUser {
  createdAt: Date;
  email: string;
  name: string | undefined;
}
export interface IWorkday {
  id: string | undefined;
  date: string;
  hoursWorked: number;
  minutesWorked: number;
}
