import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Input } from "@repo/ui/input";
import { MoreVertical, Plus, Search, Timer } from "lucide-react";


export function GoalsDashboard() {
  return (
    <div className="p-2 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-balance">Goals</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span className="font-semibold">7</span>
          </div>
          <Button variant="ghost" size="icon">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </Button>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Card 1 */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Timer className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-balance">Python Study Plan</h3>
                <p className="text-sm text-muted-foreground mt-1">Detailed plan to learn Python step by step.</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">2/10 tasks</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[20%]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-chart-2">20% complete</span>
                <span className="text-muted-foreground">8 pending</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Card 2 */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-balance">Study Plan - Automated Tests</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn to create and run automated tests to ensure software quality.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">1/6 tasks</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[17%]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-chart-2">17% complete</span>
                <span className="text-muted-foreground">5 pending</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Card 3 */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-balance">Web Development Mastery</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete guide to modern web development with React and Next.js.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">5/15 tasks</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[33%]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-chart-2">33% complete</span>
                <span className="text-muted-foreground">10 pending</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Project Card 4 */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-balance">Database Design Fundamentals</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Learn database design principles and SQL optimization techniques.
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">3/12 tasks</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[25%]" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-chart-2">25% complete</span>
                <span className="text-muted-foreground">9 pending</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}