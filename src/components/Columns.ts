import { createColumnHelper } from "@tanstack/react-table";
import { IBank } from "types/Bank";

const columnHelper = createColumnHelper<IBank>();

export const columns = [
  columnHelper.accessor("сode", {
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
];
