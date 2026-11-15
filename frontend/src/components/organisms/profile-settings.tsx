import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { Code, Lightbulb, Trophy, Volume2 } from "lucide-react";
import { toast } from "sonner";

import {
  type ListCodeLanguagesResponse,
  type ListLearningStylesResponse,
  type MeResponse,
  signUpRequestSchema,
  type UpdateUserProfileRequest,
} from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Switch } from "@/components/atoms/switch";
import { FormField } from "@/components/molecules/form-field";
import { SaveStatus } from "@/components/molecules/save-status";
import { SettingsCard, SettingsRow } from "@/components/molecules/settings-card";
import { useUpdateDisplayNameMutation, useUpdateProfileMutation } from "@/lib/mutations";

type Profile = MeResponse["data"]["profile"];

type ProfileSettingsProperties = {
  me: MeResponse["data"];
  learningStyles: ListLearningStylesResponse["data"]["learningStyles"];
  codeLanguages: ListCodeLanguagesResponse["data"]["codeLanguages"];
};

const displayNameSchema = signUpRequestSchema.pick({ name: true });

function useProfileSetting<Field extends keyof UpdateUserProfileRequest & keyof Profile>(
  field: Field,
  saved: Profile[Field],
  savedMessage: string,
) {
  const mutation = useUpdateProfileMutation();
  const pending = mutation.isPending ? mutation.variables[field] : undefined;
  return {
    value: (pending ?? saved) as Profile[Field],
    save: (value: NonNullable<UpdateUserProfileRequest[Field]>) =>
      mutation.mutate({ [field]: value } as UpdateUserProfileRequest, {
        onSuccess: () => toast.success(savedMessage, { id: field }),
      }),
    status: mutation.isError ? (
      <SaveStatus status="error" errorMessage={mutation.error.message} />
    ) : null,
  };
}

function ProfileSelect({
  id,
  value,
  options,
  onChange,
}: {
  id: string;
  value: string | null;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        aria-describedby={`${id}-description`}
        className="min-h-11 w-full bg-background text-base data-[size=default]:h-auto sm:w-48 md:text-sm"
      >
        <SelectValue placeholder="Not chosen yet" />
      </SelectTrigger>
      <SelectContent position="popper" align="end" className="w-(--radix-select-trigger-width)">
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id} className="min-h-11">
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DisplayNameSetting({ displayName }: { displayName: string }) {
  const mutation = useUpdateDisplayNameMutation();
  const form = useForm({
    defaultValues: { name: displayName },
    validators: { onChange: displayNameSchema },
    onSubmit: ({ value }) =>
      mutation.mutate(value.name, {
        onSuccess: () => toast.success("Display name saved", { id: "display-name" }),
      }),
  });

  return (
    <SettingsCard
      id="display-name"
      title="Display name"
      description="The name other learners see on the leaderboard."
    >
      <form
        className="flex flex-col gap-3 sm:max-w-sm"
        onSubmit={(event) => {
          event.preventDefault();
          if (!mutation.isPending) form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => (
            <FormField
              id="display-name-input"
              label="Display name"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(value) => {
                mutation.reset();
                field.handleChange(value);
              }}
              error={field.state.meta.errors[0]?.message}
            />
          )}
        </form.Field>
        <Button type="submit" disabled={mutation.isPending} className="min-h-11 self-start">
          Save name
        </Button>
      </form>
      {mutation.isError ? (
        <SaveStatus status="error" errorMessage={mutation.error.message} />
      ) : null}
    </SettingsCard>
  );
}

function LearningStyleSetting({
  saved,
  learningStyles,
}: {
  saved: string | null;
  learningStyles: ProfileSettingsProperties["learningStyles"];
}) {
  const setting = useProfileSetting("learningStyleId", saved, "Learning style saved");

  return (
    <SettingsRow
      icon={Lightbulb}
      title="Learning style"
      description="Lessons lean towards the way you learn best."
      controlId="learning-style-select"
      control={
        <ProfileSelect
          id="learning-style-select"
          value={setting.value}
          options={learningStyles}
          onChange={setting.save}
        />
      }
    >
      <Link
        to="/onboarding"
        search={{ retake: true }}
        className="inline-flex min-h-11 items-center self-start text-sm font-medium underline underline-offset-4 pointer-fine:min-h-8"
      >
        Not sure? Retake the quiz
      </Link>
      {setting.status}
    </SettingsRow>
  );
}

function CodeLanguageSetting({
  saved,
  codeLanguages,
}: {
  saved: string | null;
  codeLanguages: ProfileSettingsProperties["codeLanguages"];
}) {
  const setting = useProfileSetting("codeLanguageId", saved, "Code language saved");

  return (
    <SettingsRow
      icon={Code}
      title="Code language"
      description="The language the code trace shows."
      controlId="code-language-select"
      control={
        <ProfileSelect
          id="code-language-select"
          value={setting.value}
          options={codeLanguages}
          onChange={setting.save}
        />
      }
    >
      {setting.status}
    </SettingsRow>
  );
}

function ToggleSetting({
  field,
  saved,
  id,
  icon,
  title,
  description,
}: {
  field: "textToSpeech" | "showOnLeaderboard";
  saved: boolean;
  id: string;
  icon: typeof Volume2;
  title: string;
  description: string;
}) {
  const setting = useProfileSetting(field, saved, `${title} saved`);
  const controlId = `${id}-switch`;

  return (
    <SettingsRow
      icon={icon}
      title={title}
      description={description}
      controlId={controlId}
      control={
        <div className="flex min-h-11 items-center gap-3">
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            {setting.value ? "On" : "Off"}
          </span>
          <Switch
            id={controlId}
            size="lg"
            aria-describedby={`${controlId}-description`}
            checked={setting.value}
            onCheckedChange={setting.save}
          />
        </div>
      }
    >
      {setting.status}
    </SettingsRow>
  );
}

export function ProfileSettings({ me, learningStyles, codeLanguages }: ProfileSettingsProperties) {
  const { user, profile } = me;

  return (
    <>
      <DisplayNameSetting displayName={user.displayName} />
      <SettingsCard
        id="preferences"
        title="Preferences"
        description="How lessons and the leaderboard work for you."
      >
        <ul className="divide-y">
          <LearningStyleSetting saved={profile.learningStyleId} learningStyles={learningStyles} />
          <CodeLanguageSetting saved={profile.codeLanguageId} codeLanguages={codeLanguages} />
          <ToggleSetting
            field="textToSpeech"
            saved={profile.textToSpeech}
            id="text-to-speech"
            icon={Volume2}
            title="Audio buttons"
            description="Show a Listen button on lesson steps."
          />
          <ToggleSetting
            field="showOnLeaderboard"
            saved={profile.showOnLeaderboard}
            id="leaderboard"
            icon={Trophy}
            title="Leaderboard"
            description="Let other learners see you on the leaderboard."
          />
        </ul>
      </SettingsCard>
    </>
  );
}
