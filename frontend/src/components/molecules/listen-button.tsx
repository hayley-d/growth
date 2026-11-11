import { Mic, Square } from "lucide-react";

import { Button } from "@/components/atoms/button";
import { isSpeechSupported } from "@/lib/speech";
import { useSpeechStore } from "@/stores/speech-store";

type ListenButtonProperties = {
  id: string;
  texts: readonly string[];
};

export function ListenButton({ id, texts }: ListenButtonProperties) {
  const speakingId = useSpeechStore((state) => state.speakingId);
  const start = useSpeechStore((state) => state.start);
  const stop = useSpeechStore((state) => state.stop);
  if (!isSpeechSupported()) return null;
  const speaking = speakingId === id;
  return (
    <Button
      type="button"
      aria-pressed={speaking}
      className="min-h-11 shrink-0 bg-primary hover:bg-primary/70"
      onClick={() => (speaking ? stop() : start(id, texts))}
    >
      {speaking ? <Square aria-hidden /> : <Mic aria-hidden />}
      {speaking ? "Stop" : "Listen"}
    </Button>
  );
}
