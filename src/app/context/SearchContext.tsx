"use client";
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the shape of the context
interface SearchContextType {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

// Create context with a proper default type
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<string>("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

// Custom hook
export function useSearch(): SearchContextType {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
