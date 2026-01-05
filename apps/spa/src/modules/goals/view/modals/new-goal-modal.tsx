import type React from "react"

import { Button } from "@repo/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@repo/ui/dialog"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Textarea } from "@repo/ui/textarea"
import { Calendar, FileText, Target } from "lucide-react"
import { useState } from "react"

interface NewGoalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NewGoalModal({ isOpen, onClose }: NewGoalModalProps) {
  const [goalName, setGoalName] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalDeadline, setGoalDeadline] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle goal creation logic here
    console.log("[v0] Creating goal:", { goalName, goalDescription, goalDeadline })

    // Reset form and close modal
    setGoalName("")
    setGoalDescription("")
    setGoalDeadline("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Create New Goal
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Set up a new goal to track your progress and stay organized.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="goal-name" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Goal Name
            </Label>
            <Input
              id="goal-name"
              placeholder="e.g., Learn React Advanced Patterns"
              value={goalName}
              onChange={(e) => setGoalName(e.target.value)}
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Description
            </Label>
            <Textarea
              id="goal-description"
              placeholder="Describe your goal and what you want to achieve..."
              value={goalDescription}
              onChange={(e) => setGoalDescription(e.target.value)}
              className="bg-background border-border min-h-[100px] resize-none"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-deadline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Target Deadline (Optional)
            </Label>
            <Input
              id="goal-deadline"
              type="date"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
              className="bg-background border-border"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-border bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
