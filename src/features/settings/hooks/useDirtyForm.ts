import { useMemo,useState } from "react";

export const useDirtyForm = <T>(initial: T) => {
  const [form, setForm] = useState<T>(initial);
  const [prevInitial, setPrevInitial] = useState<T>(initial);

  if (JSON.stringify(prevInitial) !== JSON.stringify(initial)) {
    setPrevInitial(initial);
    setForm(initial);
  }

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(prevInitial),
    [form, prevInitial],
  );

  const update = <K extends keyof T>(key: K, value: T[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const reset = () => setForm(prevInitial);

  return { form, setForm, update, isDirty, reset };
};
