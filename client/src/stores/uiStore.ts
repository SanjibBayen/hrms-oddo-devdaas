export const uiStore = {
  state: {
    activeModal: null as string | null,
    toasts: [] as any[],
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
