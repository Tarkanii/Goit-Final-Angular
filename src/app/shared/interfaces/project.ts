export interface IProject {
  _id: string,
  name: string,
  description: string,
  sprints: ISprint[]
}

export interface ISprint {
  _id: string,
  name: string,
  startDate: string,
  endDate: string,
  duration: number,
  tasks: ITask[]
}

export interface ITask {
  _id: string,
  name: string,
  scheduledHours: string,
  totalHours: string,
  spentHoursDay: { date: string, hours: number }[]
}

export interface ICreateSprintBody {
  name: string,
  startDate: string,
  endDate: string,
  duration: string,
  project: string
}