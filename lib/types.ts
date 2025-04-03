export interface User {
  _id: string
  name: string
  email: string
  password: string
}

export interface Task {
  _id: string
  userId: string
  title: string
  description?: string
  category: string
  completed: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface Session {
  userId: string
  name: string
  email: string
}

