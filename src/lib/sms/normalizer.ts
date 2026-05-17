export function normalizeMerchant(raw: string): string {
  let s = raw.toUpperCase().trim();

  // Strip known prefixes
  s = s.replace(/^DLO\*/, "");
  s = s.replace(/^DL\*/, "");
  s = s.replace(/^GOOGLE \*/, "");

  // Strip country suffixes (before *suffix so they don't fire on intermediate results)
  s = s.replace(/\s+COLOMBI(?:A)?$/i, "");
  s = s.replace(/\s+GROUP\s+S$/i, "");

  // Strip *suffix (any * followed by alphanumeric/spaces to end)
  s = s.replace(/\s*\*\s*[A-Z0-9]+$/i, "");

  // Strip _suffix
  s = s.replace(/_[A-Z0-9]+$/i, "");

  // Strip trailing " ." and whitespace
  s = s.replace(/\s*\.\s*$/, "");
  s = s.trim();

  return s;
}
