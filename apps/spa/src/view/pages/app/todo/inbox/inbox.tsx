"use client"

import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { Checkbox } from "@repo/ui/checkbox"
import { Input } from "@repo/ui/input"
import { Flag, MoreVertical, Plus, Search } from "lucide-react"
import { useState } from "react"
// import { NewTodoModal } from "@/components/new-todo-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"

export function Inbox() {
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false)

  // Mock data for unscheduled todos
  const inboxTodos = [
    {
      id: "1",
      title: "Lists and Dictionaries",
      project: "Python Study Plan",
      priority: "medium",
      completed: false,
    },
    {
      id: "2",
      title: "Error Handling",
      project: "Python Study Plan",
      priority: "high",
      completed: false,
    },
    {
      id: "3",
      title: "Test Coverage",
      project: "Study Plan - Automated Tests",
      priority: "medium",
      completed: false,
    },
    {
      id: "4",
      title: "CI/CD Integration",
      project: "Study Plan - Automated Tests",
      priority: "high",
      completed: false,
    },
    {
      id: "5",
      title: "Review Python documentation",
      project: null,
      priority: "low",
      completed: false,
    },
    {
      id: "6",
      title: "Set up development environment",
      project: null,
      priority: "high",
      completed: false,
    },
    {
      id: "7",
      title: "Research best practices for testing",
      project: null,
      priority: "medium",
      completed: false,
    },
  ]

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-balance">Inbox</h1>
          <p className="text-muted-foreground mt-1">Tasks without project</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span className="font-semibold">7</span>
          </div>

        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search inbox..." className="pl-10 bg-card border-border" />
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsNewTodoModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Todo
        </Button>
      </div>

      {/* Todo List */}
      <div className="space-y-2">
        {inboxTodos.map((todo) => (
          <Card key={todo.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center gap-4">
              <Checkbox checked={todo.completed} className="border-2" />
              <div className="flex-1">
                <div className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                  {todo.title}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <Badge variant="secondary" className="bg-secondary/50 text-muted-foreground text-xs">
                    No Project
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      todo.priority === "high"
                        ? "bg-destructive/20 text-destructive"
                        : todo.priority === "medium"
                          ? "bg-chart-2/20 text-chart-2"
                          : "bg-chart-4/20 text-chart-4"
                    }
                  >
                    <Flag className="w-3 h-3 mr-1" />
                    {todo.priority}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Set Due Date</DropdownMenuItem>
                  <DropdownMenuItem>Assign to Project</DropdownMenuItem>
                  <DropdownMenuItem>Change Priority</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>

      {/* <NewTodoModal isOpen={isNewTodoModalOpen} onClose={() => setIsNewTodoModalOpen(false)} projectId={null} /> */}
    </div>
  )
}
