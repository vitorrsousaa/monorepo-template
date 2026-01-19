import { Button } from "@repo/ui/button"
import { Checkbox } from "@repo/ui/checkbox"
import { Dialog, DialogContent } from "@repo/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Input } from "@repo/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Textarea } from "@repo/ui/textarea"
import {
  Activity,
  Bell,
  Calendar,
  ChevronDown,
  ChevronUp,
  Copy,
  Flag,
  Inbox,
  LinkIcon,
  Mail,
  MapPin,
  MoreHorizontal,
  Printer,
  Puzzle,
  Tag,
  Trash2,
  X,
} from "lucide-react"
import { useState } from "react"

interface EditTodoModalProps {
  isOpen: boolean
  onClose: () => void
  todo: any
}

export function EditTodoModal({ isOpen, onClose, todo }: EditTodoModalProps) {
  const [todoData, setTodoData] = useState({
    title: todo.title,
    description: todo.description || "",
    project: todo.project || "Inbox",
    section: todo.section || "",
    priority: todo.priority,
    dueDate: todo.dueDate || "",
    completed: todo.completed,
  })

  const handleDelete = () => {
    console.log("[v0] Deleting todo:", todo.id)
    onClose()
  }

  const handleDuplicate = () => {
    console.log("[v0] Duplicating todo:", todo.id)
    onClose()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Inbox className="w-4 h-4" />
            <span>{todoData.project}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">Added on {formatDate(todo.createdAt)}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Copy link to task
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Mail className="w-4 h-4 mr-2" />
                  Add comments via email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Activity className="w-4 h-4 mr-2" />
                  View task activity
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Puzzle className="w-4 h-4 mr-2" />
                  Add extension...
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Left Side - Main Content */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={todoData.completed}
                onCheckedChange={(checked) => setTodoData({ ...todoData, completed: !!checked })}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <Input
                  value={todoData.title}
                  onChange={(e) => setTodoData({ ...todoData, title: e.target.value })}
                  className="text-lg font-medium border-0 px-0 focus-visible:ring-0"
                  placeholder="Task name"
                />
                <Textarea
                  value={todoData.description}
                  onChange={(e) => setTodoData({ ...todoData, description: e.target.value })}
                  className="min-h-[60px] border-0 px-0 focus-visible:ring-0 resize-none"
                  placeholder="Description"
                />
              </div>
            </div>

            <Button variant="ghost" className="text-muted-foreground h-8 px-2">
              <span className="text-sm">+ Add sub-task</span>
            </Button>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                  U
                </div>
                <Input placeholder="Comment" className="flex-1 bg-muted/50" />
              </div>
            </div>
          </div>

          {/* Right Side - Metadata */}
          <div className="w-80 border-l border-border p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Project</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Inbox className="w-4 h-4" />
                <span>{todoData.project}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Section</span>
              </div>
              <Select value={todoData.section} onValueChange={(value) => setTodoData({ ...todoData, section: value })}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="No section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No section</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Calendar className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Deadline</span>
                  <span>🔥</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Calendar className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Priority</span>
              </div>
              <Select
                value={todoData.priority}
                onValueChange={(value) => setTodoData({ ...todoData, priority: value })}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Flag className="w-3 h-3" />
                      <span>P4 - Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Flag className="w-3 h-3" />
                      <span>P3 - Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Flag className="w-3 h-3" />
                      <span>P2 - High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Labels</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Tag className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Reminders</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Bell className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Location</span>
                  <span>🔥</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MapPin className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
