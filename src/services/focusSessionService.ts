import { supabase } from "../lib/supabaseClient";
import type { FocusSession } from "../types/database";

export type RegisterFocusSessionInput = {
  taskId: string | null;
  durationMinutes: number;
  startedAt: string;
  finishedAt: string;
};

export async function registerFocusSession(
  input: RegisterFocusSessionInput
): Promise<FocusSession> {
  const { data, error } = await supabase.rpc("register_focus_session", {
    p_task_id: input.taskId,
    p_duration_minutes: input.durationMinutes,
    p_started_at: input.startedAt,
    p_finished_at: input.finishedAt,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listTodayFocusSessions(): Promise<FocusSession[]> {
  const today = new Date();
  const startOfDay = new Date(today);
  const endOfDay = new Date(today);

  startOfDay.setHours(0, 0, 0, 0);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("focus_sessions")
    .select("*")
    .gte("started_at", startOfDay.toISOString())
    .lte("started_at", endOfDay.toISOString())
    .order("started_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}