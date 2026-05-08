import { supabase } from "../lib/supabaseClient";
import type { Achievement, FocusSession, Task } from "../types/database";

export type RecentAchievement = {
  id: string;
  unlocked_at: string;
  achievement: Achievement;
};

export type DashboardSummary = {
  tasks: Task[];
  focusSessionsToday: FocusSession[];
  recentFocusSessions: FocusSession[];
  recentAchievements: RecentAchievement[];
};

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const today = new Date();
  const startOfDay = new Date(today);
  const endOfDay = new Date(today);

  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    tasksResult,
    focusSessionsTodayResult,
    recentFocusSessionsResult,
    recentAchievementsResult,
  ] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),

    supabase
      .from("focus_sessions")
      .select("*")
      .gte("started_at", startOfDay.toISOString())
      .lte("started_at", endOfDay.toISOString())
      .order("started_at", { ascending: false }),

    supabase
      .from("focus_sessions")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(5),

    supabase
      .from("user_achievements")
      .select(
        `
        id,
        unlocked_at,
        achievement:achievement_id (
          id,
          code,
          title,
          description,
          xp_reward,
          icon,
          created_at
        )
      `
      )
      .order("unlocked_at", { ascending: false })
      .limit(3),
  ]);

  if (tasksResult.error) {
    throw new Error(tasksResult.error.message);
  }

  if (focusSessionsTodayResult.error) {
    throw new Error(focusSessionsTodayResult.error.message);
  }

  if (recentFocusSessionsResult.error) {
    throw new Error(recentFocusSessionsResult.error.message);
  }

  if (recentAchievementsResult.error) {
    throw new Error(recentAchievementsResult.error.message);
  }

  const recentAchievements = normalizeRecentAchievements(
    recentAchievementsResult.data ?? []
  );

  return {
    tasks: tasksResult.data ?? [],
    focusSessionsToday: focusSessionsTodayResult.data ?? [],
    recentFocusSessions: recentFocusSessionsResult.data ?? [],
    recentAchievements,
  };
}

type RecentAchievementResponse = {
  id: string;
  unlocked_at: string;
  achievement: Achievement | Achievement[] | null;
};

function normalizeRecentAchievements(
  rows: RecentAchievementResponse[]
): RecentAchievement[] {
  return rows
    .map((row) => {
      const achievement = Array.isArray(row.achievement)
        ? row.achievement[0]
        : row.achievement;

      if (!achievement) {
        return null;
      }

      return {
        id: row.id,
        unlocked_at: row.unlocked_at,
        achievement,
      };
    })
    .filter((row): row is RecentAchievement => row !== null);
}