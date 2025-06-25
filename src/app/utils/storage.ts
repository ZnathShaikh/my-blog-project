import { LOCAL_STORAGE_KEYS } from "@/constants/storage"; 

type LoggedInUser = {
    id: number;
    name: string;
  };

// Save user to localStorage
export function setLoggedInUser(user: LoggedInUser) {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.LOGGEDIN_USER,
      JSON.stringify(user)
    );
  }

export function getLoggedInUser(): LoggedInUser | null {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.LOGGEDIN_USER);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
      } catch (err) {
        console.error("Failed to parse LOGGEDIN_USER:", err);
        return null;
      }
    }

// Clear user from localStorage (logout)
export function clearLoggedInUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.LOGGEDIN_USER);
  }