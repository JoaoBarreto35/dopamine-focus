export type TaskStatus = "pending" | "in_progress" | "completed" | "archived";

export type TaskPriority = "low" | "medium" | "high";

export type FocusSessionStatus = "completed" | "canceled";

export type Profile = {
  id: string;
  name: string;
  xp: number;
  level: number;
  streak_count: number;
  last_focus_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  xp_reward: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FocusSession = {
  id: string;
  user_id: string;
  task_id: string | null;
  duration_minutes: number;
  status: FocusSessionStatus;
  started_at: string;
  finished_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string;
  xp_reward: number;
  icon: string;
  created_at: string;
};

export type UserAchievement = {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
};