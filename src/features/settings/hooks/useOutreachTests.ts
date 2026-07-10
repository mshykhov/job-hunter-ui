import { useCallback, useState } from "react";

import type { CoverLetterResponse, RecruiterMessageResponse } from "../types";
import { useTestCoverLetter, useTestRecruiterMessage } from "./useOutreach";

/** Runs cover-letter / recruiter-message test generations and holds their per-source results. */
export const useOutreachTests = () => {
  const testCoverLetter = useTestCoverLetter();
  const testRecruiterMessage = useTestRecruiterMessage();
  const [results, setResults] = useState<
    Record<string, CoverLetterResponse | RecruiterMessageResponse>
  >({});

  const runCoverLetter = useCallback(
    (source: string) =>
      testCoverLetter.mutate(
        { source },
        { onSuccess: (data) => setResults((prev) => ({ ...prev, [`${source}-cl`]: data })) }
      ),
    [testCoverLetter]
  );

  const runRecruiterMessage = useCallback(
    (source: string) =>
      testRecruiterMessage.mutate(
        { source },
        { onSuccess: (data) => setResults((prev) => ({ ...prev, [`${source}-rm`]: data })) }
      ),
    [testRecruiterMessage]
  );

  return {
    runCoverLetter,
    runRecruiterMessage,
    testingCoverLetter: testCoverLetter.isPending,
    testingRecruiterMessage: testRecruiterMessage.isPending,
    coverLetterResult: (source: string) =>
      results[`${source}-cl`] as CoverLetterResponse | undefined,
    recruiterMessageResult: (source: string) =>
      results[`${source}-rm`] as RecruiterMessageResponse | undefined,
  };
};
