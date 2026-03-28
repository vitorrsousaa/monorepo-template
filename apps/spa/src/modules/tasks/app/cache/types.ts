import type { WithOptimisticState } from "@/utils/types";
import type { Task } from "@repo/contracts/tasks/entities";

export type TaskWithOptimisticState = WithOptimisticState<Task>;
