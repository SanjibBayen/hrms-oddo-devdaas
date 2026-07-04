import { AuthState } from "../types/auth.ts";

export const authStore = {
  state: {
    user: null,
    token: null,
    isAuthenticated: false,
  } as AuthState,
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((l) => l());
  }
};
