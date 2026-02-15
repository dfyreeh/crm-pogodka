// context/PageContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface PageContextProps {
  title: string;
  setTitle: (title: string) => void;
}

const PageContext = createContext<PageContextProps>({
  title: "Dashboard",
  setTitle: () => {},
});

export const usePage = () => useContext(PageContext);

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState("Dashboard");

  return (
    <PageContext.Provider value={{ title, setTitle }}>
      {children}
    </PageContext.Provider>
  );
};
