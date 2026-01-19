import { EditTodoModal } from "@/modules/todo/modals/edit-todo-modal"
import { NewTodoModal } from "@/modules/todo/modals/new-todo-modal"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Checkbox } from "@repo/ui/checkbox"
import { Input } from "@repo/ui/input"
import { Calendar, Flag, GripVertical, Plus } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"


export function Projects() {
  const { id } = useParams();
  const projectId = id as string;
  const [selectedTodo, setSelectedTodo] = useState<any>(null)
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false)
  const [sections, setSections] = useState(["Backlog", "In Progress", "Review", "Done"])
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      setSections([...sections, newSectionName.trim()])
      setNewSectionName("")
      setIsAddingSection(false)
    }
  }

  // Mock project data
  const projects = {
    "1": {
      name: "Python Study Plan",
      emoji: "🐍",
      description: "Detailed plan to learn Python step by step",
      todos: [
        {
          id: "1",
          title: "Lists and Dictionaries",
          description: "Learn about Python data structures",
          section: "in-progress",
          priority: "medium",
          dueDate: "2025-01-25",
          completed: false,
          createdAt: "2024-01-15T10:30:00",
        },
        {
          id: "2",
          title: "Error Handling",
          description: "Study try/except blocks and error types",
          section: "backlog",
          priority: "high",
          dueDate: "2025-01-28",
          completed: false,
          createdAt: "2024-01-16T14:20:00",
        },
        {
          id: "3",
          title: "File Operations",
          description: "Learn to read and write files",
          section: "done",
          priority: "low",
          dueDate: "2025-02-01",
          completed: true,
          createdAt: "2024-01-10T09:00:00",
        },
      ],
    },
    "2": {
      name: "Study Plan - Automated Tests",
      emoji: "✅",
      description: "Learn to create and execute automated tests",
      todos: [
        {
          id: "4",
          title: "Test Coverage",
          description: "Improve test coverage to 80%",
          section: "review",
          priority: "medium",
          dueDate: "2025-01-30",
          completed: false,
          createdAt: "2024-01-17T09:15:00",
        },
        {
          id: "5",
          title: "CI/CD Integration",
          description: "Set up continuous integration pipeline",
          section: "backlog",
          priority: "high",
          dueDate: "2025-02-05",
          completed: false,
          createdAt: "2024-01-18T16:45:00",
        },
      ],
    },
  }

  const project = projectId ? projects[projectId as keyof typeof projects] : null

  if (!project) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Project not found</div>
      </div>
    )
  }

  const completedCount = project.todos.filter((t) => t.completed).length
  const totalCount = project.todos.length
  const progressPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Project Header - Fixed */}
      <div className="flex-shrink-0 border-b border-border px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{project.emoji}</span>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
        </div>
        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} completed ({progressPercentage}%)
          </div>
          <div className="flex-1 max-w-xs h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Tasks grouped by sections - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-8 space-y-6">
        {sections.map((section) => {
          const sectionKey = section.toLowerCase().replace(/\s+/g, "-")
          const sectionTodos = project.todos.filter((t) => t.section === sectionKey)

          return (
            <div key={section}>
              <div className="flex items-center gap-3 mb-3">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <h2 className="font-semibold text-lg">{section}</h2>
                <Badge variant="secondary" className="rounded-full">
                  {sectionTodos.length}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-8"
                  onClick={() => setIsNewTodoModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {sectionTodos.map((todo) => (
                  <div
                    key={todo.id}
                    className="group flex items-center gap-4 p-3 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTodo({ ...todo, project: project.name })}
                  >
                    <Checkbox checked={todo.completed} className="border-2" onClick={(e) => e.stopPropagation()} />
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                        {todo.title}
                      </div>
                      {todo.description && <div className="text-sm text-muted-foreground mt-1">{todo.description}</div>}
                      <div className="flex items-center gap-3 mt-2">
                        {todo.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(todo.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </div>
                        )}
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-xs",
                            todo.priority === "high"
                              ? "bg-destructive/20 text-destructive"
                              : todo.priority === "medium"
                                ? "bg-chart-2/20 text-chart-2"
                                : "bg-chart-4/20 text-chart-4",
                          )}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {todo.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}

                {sectionTodos.length === 0 && (
                  <div className="text-sm text-muted-foreground italic py-4 text-center">No tasks in this section</div>
                )}
              </div>
            </div>
          )
        })}

          {/* Add New Section */}
          {isAddingSection ? (
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Section name"
                className="h-9"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddSection()
                  if (e.key === "Escape") {
                    setIsAddingSection(false)
                    setNewSectionName("")
                  }
                }}
              />
              <Button size="sm" onClick={handleAddSection}>
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAddingSection(false)
                  setNewSectionName("")
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="w-full justify-start" onClick={() => setIsAddingSection(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          )}
        </div>
      </div>

      {selectedTodo && (
        <EditTodoModal isOpen={!!selectedTodo} onClose={() => setSelectedTodo(null)} todo={selectedTodo} />
      )}

      <NewTodoModal isOpen={isNewTodoModalOpen} onClose={() => setIsNewTodoModalOpen(false)} projectId={projectId} />
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
