import { Link } from "@tanstack/react-router";

import { Button } from "@/components/atoms/button";
import { ColourSchemePicker } from "@/components/molecules/colour-scheme-picker";
import { PageLoader } from "@/components/molecules/page-loader";
import { SaveStatus } from "@/components/molecules/save-status";
import { ProfileSettings } from "@/components/organisms/profile-settings";
import type { ColourScheme } from "@/lib/colour-schemes";
import { useUpdateProfileMutation } from "@/lib/mutations";
import {
  useCodeLanguagesQuery,
  useLearningStylesQuery,
  useMeQuery,
  useSessionQuery,
} from "@/lib/queries";
import { useColourSchemeStore } from "@/stores/colour-scheme-store";

function ColourSchemeSection({ signedIn }: { signedIn: boolean }) {
  const colourScheme = useColourSchemeStore((state) => state.colourScheme);
  const setColourScheme = useColourSchemeStore((state) => state.setColourScheme);
  const mutation = useUpdateProfileMutation();

  const handleChange = (scheme: ColourScheme) => {
    setColourScheme(scheme);
    if (signedIn) mutation.mutate({ colourTheme: scheme });
  };

  return (
    <section aria-labelledby="colour-scheme" className="flex max-w-2xl flex-col gap-3">
      <div>
        <h2 id="colour-scheme" className="text-lg font-semibold">
          Colour scheme
        </h2>
        <p className="text-sm text-muted-foreground">
          Pick the colours that are easiest for you to tell apart.{" "}
          {signedIn ? "Saved on this device and to your profile." : "Saved on this device."}
        </p>
      </div>
      <ColourSchemePicker value={colourScheme} onChange={handleChange} />
      {signedIn && (
        <SaveStatus
          status={mutation.status}
          errorMessage={`${mutation.error?.message}. It's still saved on this device.`}
        />
      )}
    </section>
  );
}

function SignedInSettings() {
  const me = useMeQuery();
  const learningStyles = useLearningStylesQuery();
  const codeLanguages = useCodeLanguagesQuery();
  const queries = [me, learningStyles, codeLanguages];

  if (queries.some((query) => query.isError)) {
    return (
      <div role="alert" className="flex max-w-2xl flex-col items-start gap-3">
        <p className="text-sm text-destructive">
          Your profile settings couldn't be loaded. The colour scheme above still works.
        </p>
        <Button
          variant="outline"
          className="min-h-11"
          onClick={() => {
            for (const query of queries) if (query.isError) query.refetch();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!me.data || !learningStyles.data || !codeLanguages.data) return <PageLoader />;

  return (
    <ProfileSettings
      me={me.data.data}
      learningStyles={learningStyles.data.data.learningStyles}
      codeLanguages={codeLanguages.data.data.codeLanguages}
    />
  );
}

export function SettingsPage() {
  const session = useSessionQuery();
  const signedIn = Boolean(session.data);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="mt-1 text-muted-foreground">Make Growth work the way you see best.</p>
      </div>
      <div className="flex flex-col gap-8 lg:block lg:columns-2 lg:gap-x-12 lg:*:mb-8 lg:*:break-inside-avoid">
        <ColourSchemeSection signedIn={signedIn} />
        {signedIn ? (
          <SignedInSettings />
        ) : (
          <p className="max-w-2xl text-sm text-muted-foreground">
            <Link to="/login" className="font-medium text-foreground underline underline-offset-4">
              Log in
            </Link>{" "}
            to set your display name, learning style, code language, text to speech and leaderboard
            visibility.
          </p>
        )}
      </div>
    </div>
  );
}
