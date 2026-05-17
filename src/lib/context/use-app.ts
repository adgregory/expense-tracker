"use client";

import { useContext } from "react";
import { AppContext, AppState } from "./app-context";

export function useApp(): AppState {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
