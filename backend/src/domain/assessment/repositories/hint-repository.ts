import type { Hint, HintChanges, NewHint } from "@/domain/assessment/hint";
import type { Repository } from "@/domain/common/repository";

export type HintRepository = Repository<Hint, NewHint, HintChanges>;
