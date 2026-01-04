import type { Goal } from "@/modules/goals/app/entities/goal";
import { GoalCard } from "@/modules/goals/view/components/goal-card";
import { Button } from "@repo/ui/button";
import { Icon } from "@repo/ui/icon";
import { Input } from "@repo/ui/input";
import { Plus, Search } from "lucide-react";


export function GoalsDashboard() {
  const goals: Goal[] = [
    {
      id: '1',
      name: 'Python Study Plan',
      description: 'Detailed plan to learn Python step by step.',
      progress: 20,
      tasks: 10,
      pending: 8,
    },
    {
      id: '2',
      name: 'Study Plan - Automated Tests',
      description: 'Learn to create and run automated tests to ensure software quality.',
      progress: 17,
      tasks: 6,
      pending: 5,
    },
    {
      id: '3',
      name: 'Web Development Mastery',
      description: 'Complete guide to modern web development with React and Next.js.',
      progress: 33,
      tasks: 15,
      pending: 10,
    },
    {
      id: '4',
      name: 'Database Design Fundamentalssssss',
      description: 'Learn database design principles and SQL optimization techniques.',
      progress: 70,
      tasks: 12,
      pending: 9,
    }
  ]

  return (
    <div className="p-2 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-balance">Goals</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="fire" className="w-5 h-5 text-primary" />
            <span className="font-semibold">7</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search groups..." className="pl-10 bg-card border-border" />
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New Group
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>
    </div>
  );
}