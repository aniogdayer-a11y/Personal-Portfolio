// Effects remain enabled as requested by the portfolio owner.
// Ignore previously saved pause settings; no UI switch is shown.
export function motionAllowed() { return true; }

export function useMotionPreference() {
  return { enabled: motionAllowed() };
}
