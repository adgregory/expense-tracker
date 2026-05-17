export function normalizeMerchant(raw: string): string {
  let s = raw.toUpperCase().trim();

  // Strip known prefixes (but NOT GOOGLE * — we want to keep it for matching)
  s = s.replace(/^DLO\*/, "");
  s = s.replace(/^DL\*/, "");

  // Strip country suffixes (before *suffix so they don't fire on intermediate results)
  s = s.replace(/\s+COLOMBI(?:A)?$/i, "");
  s = s.replace(/\s+GROUP\s+S$/i, "");

  // Strip _suffix (before *suffix so GOOGLE *WORKSPACE_LUMA → GOOGLE *WORKSPACE → GOOGLE)
  s = s.replace(/_[A-Z0-9]+$/i, "");

  // Strip *suffix (any * followed by alphanumeric/spaces to end)
  s = s.replace(/\s*\*\s*[A-Z0-9]+$/i, "");

  // Strip trailing " ." and whitespace
  s = s.replace(/\s*\.\s*$/, "");
  s = s.trim();

  return s;
}
