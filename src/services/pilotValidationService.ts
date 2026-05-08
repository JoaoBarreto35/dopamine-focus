import { supabase } from "../lib/supabaseClient";
import type {
  PilotFeedbackSummary,
  PilotFeedbackWithParticipant,
} from "../types/database";

type PilotFeedbackResponse = Omit<PilotFeedbackWithParticipant, "participant"> & {
  participant: PilotFeedbackWithParticipant["participant"] | PilotFeedbackWithParticipant["participant"][] | null;
};

export async function getPilotFeedbackSummary(): Promise<PilotFeedbackSummary> {
  const { data, error } = await supabase
    .from("pilot_feedback_summary")
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function listPilotFeedback(): Promise<PilotFeedbackWithParticipant[]> {
  const { data, error } = await supabase
    .from("pilot_feedback")
    .select(
      `
      id,
      participant_id,
      days_observed,
      initial_focus_score,
      final_focus_score,
      improvement_group,
      completed_observation,
      qualitative_note,
      created_at,
      participant:participant_id (
        id,
        participant_code,
        profile_group,
        age_range,
        accepted_anonymous_participation,
        created_at
      )
    `
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as PilotFeedbackResponse[];

  return rows
    .map((row) => {
      const participant = Array.isArray(row.participant)
        ? row.participant[0]
        : row.participant;

      if (!participant) {
        return null;
      }

      return {
        id: row.id,
        participant_id: row.participant_id,
        days_observed: row.days_observed,
        initial_focus_score: row.initial_focus_score,
        final_focus_score: row.final_focus_score,
        improvement_group: row.improvement_group,
        completed_observation: row.completed_observation,
        qualitative_note: row.qualitative_note,
        created_at: row.created_at,
        participant,
      };
    })
    .filter((row): row is PilotFeedbackWithParticipant => row !== null);
}