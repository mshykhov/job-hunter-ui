import { useState, useEffect, useCallback } from "react";
import { useSaveAbout, useUploadAbout, useGeneratePreferences } from "./usePreferences";
import { useSavedFlash } from "./useSavedFlash";
import type { Preferences } from "../types";

export const useAboutForm = (preferences: Preferences | undefined) => {
  const saveAboutMutation = useSaveAbout();
  const uploadAboutMutation = useUploadAbout();
  const generateMutation = useGeneratePreferences();
  const { saved, flash } = useSavedFlash();

  const [about, setAbout] = useState<string | null>(preferences?.about ?? null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (preferences) {
      setAbout(preferences.about);
      setDirty(false);
    }
  }, [preferences]);

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

  return {
    about,
    dirty,
    saved,
    saving: saveAboutMutation.isPending || uploadAboutMutation.isPending,
    generating: generateMutation.isPending,
    change,
    discard,
    saveText,
    uploadFile,
    generate: generateMutation.mutate,
    generateMutation,
  };
};
