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
  duration: string
}