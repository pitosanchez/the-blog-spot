import { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "../services/auth.service";

// Types for our global state
export interface User {
  id: string;
  email: string;
  name: string;
  role: "reader" | "contributor" | "moderator" | "admin";
  membershipTier?: "free" | "supporter" | "patron" | "benefactor";
}

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  theme: "light" | "dark";
  preferences: {
    emailNotifications: boolean;
    showMatureContent: boolean;
    fontSize: "small" | "medium" | "large";
  };
}

// Action types
export type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "UPDATE_PREFERENCES"; payload: Partial<AppState["preferences"]> }
  | { type: "LOGOUT" };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  theme: "light",
  preferences: {
    emailNotifications: true,
    showMatureContent: false,
    fontSize: "medium",
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_THEME":
      return {
        ...state,
        theme: action.payload,
      };

    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };

    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper methods
  login: (user: User) => void;
  logout: () => void;
  updatePreferences: (prefs: Partial<AppState["preferences"]>) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Helper methods
  const login = (user: User) => {
    dispatch({ type: "SET_USER", payload: user });
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(user));
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
  };

  const updatePreferences = (prefs: Partial<AppState["preferences"]>) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: prefs });
    // Save to localStorage
    const updatedPrefs = { ...state.preferences, ...prefs };
    localStorage.setItem("preferences", JSON.stringify(updatedPrefs));
  };

  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    dispatch({ type: "SET_THEME", payload: newTheme });
    localStorage.setItem("theme", newTheme);
  };

  // Load saved state on mount and verify token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if we have a valid token
        const user = await authService.verifyToken();
        
        if (user) {
          dispatch({ type: "SET_USER", payload: user });
        } else {
          // If no valid token, check localStorage for user (backwards compatibility)
          const savedUser = localStorage.getItem("user");
          if (savedUser) {
            dispatch({ type: "SET_USER", payload: JSON.parse(savedUser) });
          }
        }

        // Load theme preference
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          dispatch({ type: "SET_THEME", payload: savedTheme as "light" | "dark" });
        }

        // Load other preferences
        const savedPreferences = localStorage.getItem("preferences");
        if (savedPreferences) {
          dispatch({
            type: "UPDATE_PREFERENCES",
            payload: JSON.parse(savedPreferences),
          });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    initializeAuth();
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    updatePreferences,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
