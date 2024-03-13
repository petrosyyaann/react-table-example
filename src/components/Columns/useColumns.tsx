import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Dispatch, SetStateAction, useMemo } from 'react'
import { IBank } from 'types/Bank'

export const useColumns = (
  selectRows: number[],
  setselectRows: Dispatch<SetStateAction<number[]>>
) => {
  const columnHelper = createColumnHelper<IBank>()

  const columns = useMemo<ColumnDef<IBank, any>[]>(
    () => [
      columnHelper.display({
        id: 'chekboxes',
        header: ({ table }) => (
          <input
            type="checkbox"
            onClick={() =>
              selectRows.length ===
              table.getPrePaginationRowModel().rows.length + 1
                ? setselectRows([])
                : setselectRows(
                    Array.from(
                      {
                        length:
                          table.getPrePaginationRowModel().rows.length + 1,
                      },
                      (_, index) => index
                    )
                  )
            }
            checked={
              selectRows.length ===
              table.getPrePaginationRowModel().rows.length + 1
            }
            readOnly
          />
        ),
        enableSorting: false,
      }),
      columnHelper.accessor('code', {
        header: 'Code',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('integrationCode', {
        header: 'Интеграционный код',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor('branchName', {
        header: 'Название филиала',
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor('alternativeBranchBame', {
        header: 'Альтернативное наименование филиала',
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor('branchTypeFromR12', {
        header: 'Тип филиала из R12',
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor('branchNumber', {
        header: 'Номер филиала',
        cell: (info) => info.renderValue(),
      }),
    ],
    [columnHelper, selectRows, setselectRows]
  )

  return columns
}
