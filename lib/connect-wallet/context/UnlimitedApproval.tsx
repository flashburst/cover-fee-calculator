import useLocalStorage from "@utils/hooks/useLocalStorage";
import React, { ReactChild } from "react";

const UnlimitedApprovalContext = React.createContext<any>({
  unlimitedApproval: false,
  setUnlimitedApproval: () => {},
});

export function useUnlimitedApproval() {
  const context = React.useContext(UnlimitedApprovalContext);

  if (context === undefined) {
    throw new Error(
      "useUnlimitedApproval must be used within a UnlimitedApprovalProvider"
    );
  }
  return context;
}

export const UnlimitedApprovalProvider = ({
  children,
}: {
  children: ReactChild;
}) => {
  const [unlimitedApproval, setUnlimitedApproval] = useLocalStorage(
    "unlimitedApproval",
    false
  );

  return (
    <UnlimitedApprovalContext.Provider
      value={{ unlimitedApproval, setUnlimitedApproval }}
    >
      {children}
    </UnlimitedApprovalContext.Provider>
  );
};
