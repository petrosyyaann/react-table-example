import { useMemo, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import "./index.css";
import { banks } from "./data/Banks";
import { IBank } from "types/Bank";

export function App() {
  const [data] = useState(() => [...banks]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectRows, setselectRows] = useState<number[]>([]);

  const columnHelper = createColumnHelper<IBank>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<IBank, any>[]>(
    () => [
      columnHelper.accessor("code", {
        header: "Code",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("integrationCode", {
        header: "Интеграционный код",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("branchName", {
        header: "Название филиала",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("alternativeBranchBame", {
        header: "Альтернативное наименование филиала",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("branchTypeFromR12", {
        header: "Тип филиала из R12",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("branchNumber", {
        header: "Номер филиала",
        cell: (info) => info.renderValue(),
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  {...{
                    className: header.column.getCanSort()
                      ? "cursor-pointer select-none"
                      : "",
                    onClick: header.column.getToggleSortingHandler(),
                  }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? " ↕️"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={Number(row.id) % 2 ? "td-even" : ""}
                  style={{
                    paddingLeft: cell.column.id === "code" ? "5px" : "",
                  }}
                  onClick={() => {
                    selectRows.includes(row.index)
                      ? setselectRows((prev) =>
                          prev.filter((value) => value !== row.index)
                        )
                      : setselectRows((prev) => [...prev, row.index]);
                  }}
                >
                  {cell.column.id === "code" ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectRows.includes(row.index)}
                      />
                      <div className="input-div">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </div>
                    </div>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => alert(selectRows)}>Выбранные строки</button>
    </div>
  );
}
