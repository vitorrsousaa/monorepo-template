import { Button } from "@repo/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu"
import { Archive, Copy, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react"

interface GoalActionsDropdownProps {
  goalId: string
}

export function GoalActionsDropdown({ goalId }: GoalActionsDropdownProps) {
  const handleViewGoal = () => {
    console.log("[v0] Viewing goal:", goalId)
    // Navigate to goal details or open view modal
  }

  const handleEditGoal = () => {
    console.log("[v0] Editing goal:", goalId)
    // Open edit modal
  }

  const handleDuplicateGoal = () => {
    console.log("[v0] Duplicating goal:", goalId)
    // Duplicate goal logic
  }

  const handleArchiveGoal = () => {
    console.log("[v0] Archiving goal:", goalId)
    // Archive goal logic
  }

  const handleDeleteGoal = () => {
    console.log("[v0] Deleting goal:", goalId)
    // Show confirmation dialog and delete
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
        <DropdownMenuItem onClick={handleViewGoal} className="cursor-pointer">
          <Eye className="w-4 h-4 mr-2" />
          View Goal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditGoal} className="cursor-pointer">
          <Pencil className="w-4 h-4 mr-2" />
          Edit Goal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDuplicateGoal} className="cursor-pointer">
          <Copy className="w-4 h-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem onClick={handleArchiveGoal} className="cursor-pointer">
          <Archive className="w-4 h-4 mr-2" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteGoal} className="cursor-pointer text-destructive focus:text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
