import { useContext, createContext } from "react";

// context wrapper

const NewContext = createContext();

export function ContextWrapper({ children, data }) {
  return <NewContext.Provider value={data}>{children}</NewContext.Provider>;
}

export function UseContext() {
  return useContext(NewContext);
}
