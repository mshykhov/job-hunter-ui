import { useCallback, useState } from "react";

import type { Preferences } from "../types";
import { useGeneratePreferences, useOptimizeAbout, useSaveAbout, useUploadAbout } from "./usePreferences";
import { useSavedFlash } from "./useSavedFlash";

export const useAboutForm = (preferences: Preferences | undefined) => {
  const saveAboutMutation = useSaveAbout();
  const uploadAboutMutation = useUploadAbout();
  const generateMutation = useGeneratePreferences();
  const optimizeMutation = useOptimizeAbout();
  const { saved, flash } = useSavedFlash();

  const [about, setAbout] = useState<string | null>(preferences?.about ?? null);
  const [dirty, setDirty] = useState(false);
  const [syncedAbout, setSyncedAbout] = useState(preferences?.about);

  if (preferences && preferences.about !== syncedAbout) {
    setSyncedAbout(preferences.about);
    setAbout(preferences.about);
    setDirty(false);
  }

  const change = useCallback((value: string | null) => {
    setAbout(value);
    setDirty(true);
  }, []);

  const discard = useCallback(() => {
    setAbout(preferences?.about ?? null);
    setDirty(false);
  }, [preferences?.about]);

  const saveText = useCallback(() => {
    if (about?.trim()) {
      saveAboutMutation.mutate(about, {
        onSuccess: () => { setDirty(false); flash(); },
      });
    }
  }, [about, saveAboutMutation, flash]);

  const uploadFile = useCallback((file: File) => {
    uploadAboutMutation.mutate(file, {
      onSuccess: (newAbout) => {
        setAbout(newAbout);
        setDirty(false);
        flash();
      },
    });
  }, [uploadAboutMutation, flash]);

  const optimize = useCallback(() => {
    optimizeMutation.mutate(undefined, {
      onSuccess: (optimized) => {
        setAbout(optimized);
        setDirty(true);
        flash();
      },
    });
  }, [optimizeMutation, flash]);

  return {
    about,
    dirty,
    saved,
    saving: saveAboutMutation.isPending || uploadAboutMutation.isPending,
    generating: generateMutation.isPending,
    optimizing: optimizeMutation.isPending,
    change,
    discard,
    saveText,
    uploadFile,
    optimize,
    generate: generateMutation.mutate,
    generateMutation,
  };
};
