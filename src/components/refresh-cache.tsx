"use client";
import { useInterval } from "interval-hooks";

import { useEffect, useState } from "react";

export function RefreshCache({ check }: { check: () => Promise<void> }) {
  const [shouldRun, setShouldRun] = useState(false);
  useEffect(() => {
    const onFocus = () => setShouldRun(true);
    const onBlur = () => setShouldRun(false);

    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  });

  useInterval(check, shouldRun ? 1000 : null);

  return null;
}
