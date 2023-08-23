import { SearchBar } from "@components/common/SearchBar";
import { useState } from "react";
import { WhitelistTable } from "./WhitelistTable";

const Whitelist = () => {
  return (
    <div className="px-4 py-18 sm:px-14 lg:px-28">
      <h4 className="font-bold text-heading font-sora">Whitelist</h4>
      <WhitelistTable />
    </div>
  );
};

export default Whitelist;
