export const appStore = {
  state: {
    sidebarCollapsed: false,
    theme: "light",
  },
  listeners: new Set<() => void>(),
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
  setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((l) => l());
  }
};
