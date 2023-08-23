import {
  Table,
  TablePagination,
  TableWrapper,
  TBody,
  THead,
} from "@components/Table";
import { OpenInNewIcon } from "@svg";
import { classNames } from "@utils/functions";
import { useNetwork } from "@wallet/context/Network";
import { useWeb3React } from "@web3-react/core";
import { FC, useEffect, useMemo, useState } from "react";
import { fromNow } from "@utils/formatting/relative-time";
// import { useWhiteListInfo } from "@utils/hooks/useWhitelistInfo";
import { Checkbox } from "@components/Checkbox";
import ChevronDownIcon from "@utils/SVG/ChevronDownIcon";
import DropDown, { BulkImportModal } from "@components/Dropdown";
import DateLib from "@date/DateLib";
import { TableCheckBox } from "@components/Checkbox/TableCheckbox";
import { SearchBar } from "@components/common/SearchBar";
import { whitelists } from "mock/whitelist";

import { useGlobalFilter, useRowSelect, useTable } from "react-table";

/* interface RenderHeaderProps {
  col: {
    align: string,
    name: string
  }
}
interface RenderWhenProps {
  row: {transaction: {timestamp: string;}}
}
interface RenderDetailsProps {
  row: object;
  extraData?: any;
}
interface RenderActionsProps {
  row: object;
} */

const TableHeader = (name, align, ...tableheadProps) => {
  return (
    <th
      scope="col"
      className={classNames(
        `pt-6 pb-2 font-bold text-xs leading-4.5 tracking-wider font-poppins text-text-gray uppercase border-b border-b-DAE2EB`,
        name.align === "right" ? "text-right" : "text-left"
      )}
      {...tableheadProps}
    >
      {name.name}
    </th>
  );
};

const DateRenderer = ({ value, ...tdProps }) => (
  <td
    className="py-6 text-sm font-medium font-poppins text-prim-blue"
    title={DateLib.toLongDateFormat(value)}
    {...tdProps}
  >
    {DateLib.toDateFormat(
      value,
      {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      },
      "UTC"
    )}
  </td>
);

const DetailsRenderer = ({ cellName, cellValue, ...tdProps }) => {
  if (cellName === "createdAtTimestamp") {
    return <DateRenderer value={cellValue} {...tdProps} />;
  }
  return (
    <td
      className={classNames(
        "flex py-6",
        cellName === "account" && "justify-end"
      )}
      {...tdProps}
    >
      <div className="flex items-center">
        <span
          className={classNames(
            " font-poppins text-sm whitespace-nowrap text-prim-blue uppercase",
            cellName === "account"
              ? "font-normal text-right"
              : "font-semibold text-left"
          )}
        >
          {cellValue}
        </span>
      </div>
    </td>
  );
};

const ActionsRenderer = ({ checked, onChange }) => {
  return (
    <td className="py-6 pr-2 min-w-120">
      <div className="flex items-center py-1 pr-2">
        <Checkbox
          id="table-data"
          custom
          checked={checked}
          onChange={onChange}
        />
      </div>
    </td>
  );
};
const HeaderActionRenderer = ({ checked, onChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <th
      scope="col"
      className="relative pt-6 pb-2 border-b min-w-120 border-b-DAE2EB"
    >
      <div
        className={classNames(
          "flex items-center  w-fit py-1 pr-2 pl-1",
          showDropdown && "bg-EEEEEE rounded-md "
        )}
      >
        <Checkbox
          id="table-data-0"
          custom
          checked={checked}
          onChange={onChange}
        />
        <div
          className="relative flex-grow p-1 cursor-pointer"
          onClick={handleDropdown}
        >
          <ChevronDownIcon width={10} height={6} />
          {showDropdown && (
            <DropDown
              setIsOpen={setIsOpen}
              closeDropdown={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>
      <BulkImportModal isOpen={isOpen} onClose={onClose} />
    </th>
  );
};

export const WhitelistTable = () => {
  // const { data, loading, hasMore, handleShowMore } = useWhiteListInfo();
  const data = useMemo(() => whitelists, []);
  const loading = false;

  const { networkId } = useNetwork();
  const { account } = useWeb3React();

  const cols = useMemo(
    () => [
      { Header: "Cover Name", accessor: "coverName" },
      { Header: "Added On", accessor: "createdAtTimestamp" },
      { Header: "Account", accessor: "account" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    // columns,
    prepareRow,
    // selectedFlatRows,
    isAllRowsSelected,
    toggleAllRowsSelected,

    state,
    setGlobalFilter,
  } = useTable(
    {
      columns: cols,
      data: data.transactions,
    },
    useRowSelect,
    useGlobalFilter
  );

  const { globalFilter } = state;

  return (
    <>
      <div className="px-8 py-8 mt-8 mb-6 bg-DAE2EB bg-opacity-30 rounded-2xl">
        <SearchBar
          searchValue={globalFilter}
          onSearchChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      <div className="bg-white shadow-table rounded-3xl">
        <TableWrapper>
          <Table {...getTableProps()}>
            <thead className="rounded-sm text-text-gray bg-FEFEFF">
              {headerGroups.map((headerGroup, i) => (
                <tr
                  key={i}
                  {...headerGroup.getHeaderGroupProps()}
                  className="first-child:pl-7 last-child:pr-8"
                >
                  {i === headerGroups.length - 1 && (
                    <HeaderActionRenderer
                      checked={isAllRowsSelected}
                      onChange={() => toggleAllRowsSelected(!isAllRowsSelected)}
                    />
                  )}
                  {headerGroup.headers.map((column, _i) => {
                    return (
                      <TableHeader
                        key={_i}
                        name={column.render("Header")}
                        align={column.Header === "Account" && "right"}
                        {...column.getHeaderProps()}
                      />
                    );
                  })}
                </tr>
              ))}
            </thead>
            {/* {account ? ( */}
            <tbody {...getTableBodyProps()} className="divide-y divide-DAE2EB">
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    key={i}
                    {...row.getRowProps()}
                    className={classNames(
                      "first-child:pl-8 last-child:pr-8",
                      row.isSelected && "bg-E5EDF9"
                    )}
                  >
                    <ActionsRenderer
                      checked={row.isSelected}
                      onChange={() => row.toggleRowSelected()}
                    />
                    {row.cells.map((cell, _i) => {
                      return (
                        <DetailsRenderer
                          key={_i}
                          cellName={cell.column.id}
                          cellValue={cell.value}
                          {...cell.getCellProps()}
                        />
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
            {/* ) : (
            <tbody>
              <tr className="w-full text-center">
                <td className="p-6" colSpan={columns.length}>
                  Please connect your wallet...
                </td>
              </tr>
            </tbody>
          )} */}
          </Table>
        </TableWrapper>
        <TablePagination
          totalCount={data.transactions.length}
          hasNext={false}
          hasPrev={false}
        />
      </div>
    </>
  );
};
