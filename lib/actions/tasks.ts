"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase, Task } from "@/lib/db"
import { getSession } from "@/lib/auth"
import type { Task as TaskType } from "@/lib/types"

// Get all tasks for the current user
export async function getTasks(): Promise<TaskType[]> {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()
    const tasks = await Task.find({ userId: session.userId }).sort({ createdAt: -1 }).lean()

    return tasks.map((task: any) => ({
      ...task,
      _id: task._id.toString(),
    }))
  } catch (error) {
    console.error("Error getting tasks:", error)
    throw new Error("Failed to get tasks")
  }
}

// Create a new task
export async function createTask(taskData: {
  title: string
  description?: string
  category: string
  userId: string
  completed: boolean
}): Promise<TaskType> {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()
    const task = await Task.create({
      ...taskData,
      userId: session.userId,
    })

    revalidatePath("/dashboard")

    return {
      ...task.toObject(),
      _id: task._id.toString(),
    }
  } catch (error) {
    console.error("Error creating task:", error)
    throw new Error("Failed to create task")
  }
}

// Update an existing task
export async function updateTask(taskData: {
  _id: string
  title: string
  description?: string
  category: string
  completed: boolean
}): Promise<TaskType> {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    // Verify task belongs to user
    const existingTask = await Task.findOne({
      _id: taskData._id,
      userId: session.userId,
    })

    if (!existingTask) {
      throw new Error("Task not found or unauthorized")
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskData._id,
      {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        completed: taskData.completed,
      },
      { new: true },
    ).lean()

    revalidatePath("/dashboard")

    return {
      ...updatedTask,
      _id: updatedTask._id.toString(),
    }
  } catch (error) {
    console.error("Error updating task:", error)
    throw new Error("Failed to update task")
  }
}

// Update task status (completed/incomplete)
export async function updateTaskStatus(taskId: string, completed: boolean): Promise<TaskType> {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    // Verify task belongs to user
    const existingTask = await Task.findOne({
      _id: taskId,
      userId: session.userId,
    })

    if (!existingTask) {
      throw new Error("Task not found or unauthorized")
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, { completed }, { new: true }).lean()

    revalidatePath("/dashboard")

    return {
      ...updatedTask,
      _id: updatedTask._id.toString(),
    }
  } catch (error) {
    console.error("Error updating task status:", error)
    throw new Error("Failed to update task status")
  }
}

// Delete a task
export async function deleteTask(taskId: string): Promise<void> {
  try {
    const session = await getSession()
    if (!session) {
      throw new Error("Unauthorized")
    }

    await connectToDatabase()

    // Verify task belongs to user
    const existingTask = await Task.findOne({
      _id: taskId,
      userId: session.userId,
    })

    if (!existingTask) {
      throw new Error("Task not found or unauthorized")
    }

    await Task.findByIdAndDelete(taskId)
    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Error deleting task:", error)
    throw new Error("Failed to delete task")
  }
}

