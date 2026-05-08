import { supabase } from "../lib/supabaseClient";
import type { Achievement, UserAchievement } from "../types/database";

type UserAchievementResponse = UserAchievement & {
  achievement: Achievement | Achievement[] | null;
};

export type UserAchievementWithDetails = UserAchievement & {
  achievement: Achievement;
};

export async function listAchievements(): Promise<Achievement[]> {
  const { data, error } = await supabase
    .from("achievements")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function listUserAchievements(): Promise<UserAchievementWithDetails[]> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select(
      `
      id,
      user_id,
      achievement_id,
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
    .order("unlocked_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as UserAchievementResponse[];

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
        user_id: row.user_id,
        achievement_id: row.achievement_id,
        unlocked_at: row.unlocked_at,
        achievement,
      };
    })
    .filter((row): row is UserAchievementWithDetails => row !== null);
}