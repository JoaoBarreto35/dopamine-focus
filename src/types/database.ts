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
export type PilotProfileGroup = "diagnosed_tdah" | "suspected_tdah";

export type PilotAgeRange =
  | "under_18"
  | "18_24"
  | "25_34"
  | "35_44"
  | "45_plus";

export type PilotImprovementGroup =
  | "large_improvement"
  | "moderate_improvement"
  | "no_improvement_or_dropout";

export type PilotParticipant = {
  id: string;
  participant_code: string;
  profile_group: PilotProfileGroup;
  age_range: PilotAgeRange;
  accepted_anonymous_participation: boolean;
  created_at: string;
};

export type PilotFeedback = {
  id: string;
  participant_id: string;
  days_observed: number;
  initial_focus_score: number;
  final_focus_score: number;
  improvement_group: PilotImprovementGroup;
  completed_observation: boolean;
  qualitative_note: string;
  created_at: string;
};

export type PilotFeedbackWithParticipant = PilotFeedback & {
  participant: PilotParticipant;
};

export type PilotFeedbackSummary = {
  total_participants: number;
  large_improvement_count: number;
  moderate_improvement_count: number;
  no_improvement_or_dropout_count: number;
  large_improvement_percentage: number;
  moderate_improvement_percentage: number;
  no_improvement_or_dropout_percentage: number;
};