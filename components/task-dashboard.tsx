"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskList } from "@/components/task-list"
import { TaskForm } from "@/components/task-form"
import type { Task } from "@/lib/types"
import { getTasks } from "@/lib/actions/tasks"

interface TaskDashboardProps {
  userId: string
}

export function TaskDashboard({ userId }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      try {
        const fetchedTasks = await getTasks()
        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleAddTask = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleTaskSaved = (savedTask: Task) => {
    if (editingTask) {
      setTasks(tasks.map((task) => (task._id === savedTask._id ? savedTask : task)))
    } else {
      setTasks([savedTask, ...tasks])
    }
    setShowForm(false)
    setEditingTask(null)
  }

  const handleTaskDeleted = (taskId: string) => {
    setTasks(tasks.filter((task) => task._id !== taskId))
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true
    if (filter === "completed") return task.completed
    if (filter === "incomplete") return !task.completed
    if (filter === task.category) return true
    return false
  })

  const categories = ["work", "personal", "urgent"]
  const uniqueCategories = Array.from(new Set([...categories, ...tasks.map((task) => task.category)])).filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Tasks</h1>
          <p className="text-muted-foreground">Manage and organize your tasks efficiently</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter tasks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
              {uniqueCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTask ? "Edit Task" : "Add New Task"}</CardTitle>
            <CardDescription>
              {editingTask ? "Update your task details below" : "Fill in the details to create a new task"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TaskForm
              userId={userId}
              task={editingTask}
              onSave={handleTaskSaved}
              onCancel={() => {
                setShowForm(false)
                setEditingTask(null)
              }}
            />
          </CardContent>
        </Card>
      )}

      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onEdit={handleEditTask}
        onDelete={handleTaskDeleted}
        onStatusChange={(updatedTask) => {
          setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
        }}
      />
    </div>
  )
}

