"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/lib/types"
import { deleteTask, updateTaskStatus } from "@/lib/actions/tasks"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (task: Task) => void
}

export function TaskList({ tasks, isLoading, onEdit, onDelete, onStatusChange }: TaskListProps) {
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleStatusChange = async (task: Task) => {
    setUpdatingId(task._id)
    try {
      const updatedTask = await updateTaskStatus(task._id, !task.completed)
      onStatusChange(updatedTask)
      toast({
        title: updatedTask.completed ? "Task completed" : "Task reopened",
        description: updatedTask.completed ? "Your task has been marked as completed." : "Your task has been reopened.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId)
    try {
      await deleteTask(taskId)
      onDelete(taskId)
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <Card className="text-center p-6">
        <CardTitle className="mb-2">No tasks found</CardTitle>
        <CardDescription>{`You don't have any tasks yet. Click "Add Task" to create your first task.`}</CardDescription>
      </Card>
    )
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "work":
        return "bg-blue-500"
      case "personal":
        return "bg-green-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            layout
          >
            <Card className={`transition-all duration-200 ${task.completed ? "opacity-70" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className={`${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className={`${getCategoryColor(task.category)} text-white`}>
                        {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                      </Badge>
                      {task.completed && (
                        <Badge variant="outline" className="bg-green-500 text-white">
                          Completed
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.description || "No description provided."}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id={`task-${task._id}`}
                    checked={task.completed}
                    disabled={updatingId === task._id}
                    onCheckedChange={() => handleStatusChange(task)}
                  />
                  <label htmlFor={`task-${task._id}`} className="text-sm font-medium cursor-pointer">
                    {task.completed ? "Completed" : "Mark complete"}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(task._id)} disabled={deletingId === task._id}>
                          {deletingId === task._id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

