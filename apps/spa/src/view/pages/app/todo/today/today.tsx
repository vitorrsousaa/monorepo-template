import { DeleteProjectModal } from "@/modules/todo/modals/delete-project-modal"
import { EditTodoModal } from "@/modules/todo/modals/edit-todo-modal"
import { NewProjectModal } from "@/modules/todo/modals/new-project-modal"
import { NewTodoModal } from "@/modules/todo/modals/new-todo-modal"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { Checkbox } from "@repo/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Calendar, MessageSquare, MoreVertical, Plus, Settings } from "lucide-react"
import { useState } from "react"

interface Todo {
  id: string
  title: string
  description?: string
  dueDate?: string
  completed: boolean
  tags?: string[]
  comments?: number
  projectId: string
}

interface Project {
  id: string
  name: string
  emoji: string
  todos: Todo[]
}

export function Today() {
  const [isNewTodoModalOpen, setIsNewTodoModalOpen] = useState(false)
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [deleteProjectModal, setDeleteProjectModal] = useState<{ isOpen: boolean; project: Project | null }>({
    isOpen: false,
    project: null,
  })
  const [selectedTodo, setSelectedTodo] = useState<any>(null)

  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Casa",
      emoji: "🏠",
      todos: [
        {
          id: "1",
          title: "Ração do bob",
          description: "10 semanas",
          dueDate: "2025-11-30",
          completed: false,
          tags: ["Casa 🏠", "Compras"],
          projectId: "1",
        },
        {
          id: "2",
          title: "Sabão pastoso",
          description: "6 semanas",
          dueDate: "2025-01-04",
          completed: false,
          tags: ["Casa 🏠", "Compras"],
          projectId: "1",
        },
      ],
    },
    {
      id: "2",
      name: "Estudos",
      emoji: "🎓",
      todos: [
        {
          id: "3",
          title: "Practice speak in english",
          description: "Gliglish · learn languages by...",
          dueDate: "2024-12-20",
          completed: false,
          tags: ["Estudos 🎓", "Inglês"],
          projectId: "2",
        },
        {
          id: "4",
          title: "Ler texto em ingles",
          description: "30 minutos",
          dueDate: "2025-04-15",
          completed: false,
          tags: ["Estudos 🎓", "Inglês"],
          projectId: "2",
        },
        {
          id: "5",
          title: "Assistir um video em ingles",
          description: "15 minutos https://www.youtu...",
          dueDate: "2025-05-15",
          completed: false,
          tags: ["Estudos 🎓", "Inglês"],
          projectId: "2",
        },
        {
          id: "6",
          title: "Procurar evento no meetup",
          dueDate: "2025-11-28",
          completed: false,
          tags: ["Estudos 🎓"],
          projectId: "2",
        },
      ],
    },
    {
      id: "3",
      name: "Pessoal",
      emoji: "😊",
      todos: [
        {
          id: "7",
          title: "Assistir vídeo do Cesar",
          description: "https://www.youtube.com/@c...",
          dueDate: "2025-10-03",
          completed: false,
          tags: ["Pessoal 😊"],
          projectId: "3",
        },
        {
          id: "8",
          title: "Diário - Uma carta para seu eu de amanhã",
          description: "Eu sou capaz de alcançar o s...",
          dueDate: "2025-12-10",
          completed: false,
          tags: ["Pessoal 😊", "Hábitos"],
          projectId: "3",
        },
        {
          id: "9",
          title: "🧠 Planning Mensal",
          description: "Rotina: Verificar quais as met...",
          dueDate: "2025-12-27",
          completed: false,
          tags: ["Pessoal 😊", "Rotinas 📆"],
          projectId: "3",
        },
        {
          id: "10",
          title: "Meditação",
          description: "3/310 vezes no ano",
          dueDate: "2024-12-16",
          completed: false,
          tags: ["Pessoal 😊", "Hábitos"],
          projectId: "3",
        },
        {
          id: "11",
          title: "Cripto",
          description: "Comprar Cripto de acordo co...",
          dueDate: "2025-06-30",
          completed: false,
          tags: ["Pessoal 😊", "Finanças"],
          projectId: "3",
        },
      ],
    },
    {
      id: "4",
      name: "Profissional",
      emoji: "💼",
      todos: [
        {
          id: "12",
          title: "Separando testes de regra de negócios de testes de frameworks",
          description: "#3 Clean Architecture & Type...",
          dueDate: "2025-05-15",
          completed: false,
          tags: ["Profissional 💼", "NodeJS"],
          projectId: "4",
        },
        {
          id: "13",
          title: "High order function",
          description: "Higher Order Functions",
          dueDate: "2025-05-20",
          completed: false,
          tags: ["Profissional 💼", "NodeJS"],
          projectId: "4",
        },
        {
          id: "14",
          title: "Revisar tasks",
          dueDate: "2025-05-21",
          completed: false,
          tags: ["Profissional 💼"],
          projectId: "4",
        },
        {
          id: "15",
          title: "Read daily.dev",
          dueDate: "2025-12-04",
          completed: false,
          tags: ["Profissional 💼", "Conteúdos q..."],
          comments: 3,
          projectId: "4",
        },
        {
          id: "16",
          title: "Linkedin",
          description: "Acessar o linkedin todos os di...",
          dueDate: "2025-12-10",
          completed: false,
          tags: ["Profissional 💼"],
          comments: 3,
          projectId: "4",
        },
      ],
    },
  ])

  const handleNewTodo = (projectId: string) => {
    setSelectedProjectId(projectId)
    setIsNewTodoModalOpen(true)
  }

  const getTodoCountText = (count: number) => {
    return `${count}`
  }

  const handleDeleteProject = (project: Project) => {
    setDeleteProjectModal({ isOpen: true, project })
  }

  const confirmDeleteProject = () => {
    if (deleteProjectModal.project) {
      console.log("[v0] Deleting project:", deleteProjectModal.project.id)
      setProjects(projects.filter((p) => p.id !== deleteProjectModal.project?.id))
    }
  }

  const handleTaskClick = (todo: Todo, project: Project) => {
    setSelectedTodo({ ...todo, project: project.name, createdAt: new Date().toISOString() })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const isOverdue = date < now && date.toDateString() !== now.toDateString()

    return {
      text: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isOverdue,
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 border-b border-border px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-balance">Today</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.reduce((acc, project) => acc + project.todos.length, 0)} tasks
            </p>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Kanban Board - Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <div className="p-6 flex gap-4" style={{ minWidth: "max-content" }}>
          {projects.map((project) => (
            <div key={project.id} className="flex-shrink-0 w-80 h-full flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{project.emoji}</span>
                  <h2 className="font-semibold">{project.name}</h2>
                  <Badge variant="secondary" className="rounded-full px-2">
                    {getTodoCountText(project.todos.length)}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Project Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteProject(project)
                    }}>Delete Project</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Todo Cards */}
              <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
                {project.todos.map((todo) => {
                  const dateInfo = todo.dueDate ? formatDate(todo.dueDate) : null
                  return (
                    <Card key={todo.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors" onClick={() => handleTaskClick(todo, project)}>
                      <div className="space-y-3">
                        {/* Todo Header */}
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-0.5 border-2 data-[state=checked]:border-primary" />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-balance leading-tight">{todo.title}</h3>
                            {todo.description && (
                              <p className="text-sm text-muted-foreground mt-1 truncate">{todo.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Todo Footer */}
                        <div className="space-y-2">
                          {dateInfo && (
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="w-3 h-3" />
                              <span className={dateInfo.isOverdue ? "text-destructive" : "text-primary"}>
                                {dateInfo.text}
                              </span>
                            </div>
                          )}

                          {todo.tags && todo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {todo.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs bg-secondary/50 text-foreground"
                                >
                                  # {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {todo.comments && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MessageSquare className="w-3 h-3" />
                              <span>{todo.comments}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* Add Task Button */}
              <Button
                variant="ghost"
                className="mt-3 justify-start text-muted-foreground hover:text-primary flex-shrink-0"
                onClick={() => handleNewTodo(project.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
            </div>
          ))}
        </div>
      </div>

      <NewTodoModal
        isOpen={isNewTodoModalOpen}
        onClose={() => setIsNewTodoModalOpen(false)}
        projectId={selectedProjectId}
      />

      <NewProjectModal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} />

      <DeleteProjectModal
        isOpen={deleteProjectModal.isOpen}
        onClose={() => setDeleteProjectModal({ isOpen: false, project: null })}
        projectName={deleteProjectModal.project?.name || ""}
        onConfirm={confirmDeleteProject}
      />
      {selectedTodo && (
        <EditTodoModal isOpen={!!selectedTodo} onClose={() => setSelectedTodo(null)} todo={selectedTodo} />
      )}
    </div>
  )
}
