import { create } from "zustand";

const useGlobal = create((set) => ({
  // -------------------------
  // Authentication
  // -------------------------

  authenticated: false,
  user: {},

  login: (user) => {
    set((user) => ({
      authenticated: true,
      user: user,
    }));
  },

  logout: () => {
    set((state) =>({
        authenticated:false,
        user:{}
    }))
  },
}));

export default useGlobal;
