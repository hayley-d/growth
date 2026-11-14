import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import {
  type ListCodeLanguagesResponse,
  type ListLearningStylesResponse,
  type MeResponse,
  signUpRequestSchema,
  type UpdateUserProfileRequest,
} from "@shared/schemas";
import { Button } from "@/components/atoms/button";
import { FormField } from "@/components/molecules/form-field";
import { SaveStatus } from "@/components/molecules/save-status";
import { useUpdateDisplayNameMutation, useUpdateProfileMutation } from "@/lib/mutations";

type Profile = MeResponse["data"]["profile"];

type ProfileSettingsProperties = {
  me: MeResponse["data"];
  learningStyles: ListLearningStylesResponse["data"]["learningStyles"];
  codeLanguages: ListCodeLanguagesResponse["data"]["codeLanguages"];
};

const displayNameSchema = signUpRequestSchema.pick({ name: true });

const selectClassName =
  "min-h-11 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:max-w-sm md:text-sm";

function useProfileSetting<Field extends keyof UpdateUserProfileRequest & keyof Profile>(
  field: Field,
  saved: Profile[Field],
) {
  const mutation = useUpdateProfileMutation();
  const pending = mutation.isPending ? mutation.variables[field] : undefined;
  return {
    value: (pending ?? saved) as Profile[Field],
    save: (value: NonNullable<UpdateUserProfileRequest[Field]>) =>
      mutation.mutate({ [field]: value } as UpdateUserProfileRequest),
    status: <SaveStatus status={mutation.status} errorMessage={mutation.error?.message} />,
  };
}

function SettingSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex max-w-2xl flex-col gap-3">
      <div>
        <h2 id={id} className="text-lg font-semibold">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}

function DisplayNameSetting({ displayName }: { displayName: string }) {
  const mutation = useUpdateDisplayNameMutation();
  const form = useForm({
    defaultValues: { name: displayName },
    validators: { onChange: displayNameSchema },
    onSubmit: ({ value }) => mutation.mutate(value.name),
  });

  return (
    <SettingSection
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
      <SaveStatus status={mutation.status} errorMessage={mutation.error?.message} />
    </SettingSection>
  );
}

function LearningStyleSetting({
  saved,
  learningStyles,
}: {
  saved: string | null;
  learningStyles: ProfileSettingsProperties["learningStyles"];
}) {
  const setting = useProfileSetting("learningStyleId", saved);

  return (
    <SettingSection
      id="learning-style"
      title="Learning style"
      description="Lessons lean towards the way you learn best."
    >
      <label htmlFor="learning-style-select" className="sr-only">
        Learning style
      </label>
      <select
        id="learning-style-select"
        className={selectClassName}
        value={setting.value ?? ""}
        onChange={(event) => setting.save(event.target.value)}
      >
        {setting.value === null && (
          <option value="" disabled>
            Not chosen yet
          </option>
        )}
        {learningStyles.map((learningStyle) => (
          <option key={learningStyle.id} value={learningStyle.id}>
            {learningStyle.name}
          </option>
        ))}
      </select>
      <Link
        to="/onboarding"
        search={{ retake: true }}
        className="inline-flex min-h-11 items-center self-start text-sm font-medium underline underline-offset-4"
      >
        Not sure? Retake the quiz
      </Link>
      {setting.status}
    </SettingSection>
  );
}

function CodeLanguageSetting({
  saved,
  codeLanguages,
}: {
  saved: string | null;
  codeLanguages: ProfileSettingsProperties["codeLanguages"];
}) {
  const setting = useProfileSetting("codeLanguageId", saved);

  return (
    <SettingSection
      id="code-language"
      title="Code language"
      description="The language the code trace shows."
    >
      <label htmlFor="code-language-select" className="sr-only">
        Code language
      </label>
      <select
        id="code-language-select"
        className={selectClassName}
        value={setting.value ?? ""}
        onChange={(event) => setting.save(event.target.value)}
      >
        {setting.value === null && (
          <option value="" disabled>
            Not chosen yet
          </option>
        )}
        {codeLanguages.map((codeLanguage) => (
          <option key={codeLanguage.id} value={codeLanguage.id}>
            {codeLanguage.name}
          </option>
        ))}
      </select>
      {setting.status}
    </SettingSection>
  );
}

function ToggleSetting({
  field,
  saved,
  id,
  title,
  description,
  label,
}: {
  field: "textToSpeech" | "showOnLeaderboard";
  saved: boolean;
  id: string;
  title: string;
  description: string;
  label: string;
}) {
  const setting = useProfileSetting(field, saved);

  return (
    <SettingSection id={id} title={title} description={description}>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 self-start">
        <input
          type="checkbox"
          checked={setting.value}
          onChange={(event) => setting.save(event.target.checked)}
          className="size-5 cursor-pointer accent-primary"
        />
        <span className="font-medium">{label}</span>
        <span className="text-sm text-muted-foreground">{setting.value ? "On" : "Off"}</span>
      </label>
      {setting.status}
    </SettingSection>
  );
}

export function ProfileSettings({ me, learningStyles, codeLanguages }: ProfileSettingsProperties) {
  const { user, profile } = me;

  return (
    <>
      <DisplayNameSetting displayName={user.displayName} />
      <LearningStyleSetting saved={profile.learningStyleId} learningStyles={learningStyles} />
      <CodeLanguageSetting saved={profile.codeLanguageId} codeLanguages={codeLanguages} />
      <ToggleSetting
        field="textToSpeech"
        saved={profile.textToSpeech}
        id="text-to-speech"
        title="Audio buttons"
        description="Show a Listen button on lesson steps."
        label="Show audio buttons"
      />
      <ToggleSetting
        field="showOnLeaderboard"
        saved={profile.showOnLeaderboard}
        id="leaderboard"
        title="Leaderboard"
        description="Choose whether other learners can see you."
        label="Show me on the leaderboard"
      />
    </>
  );
}
