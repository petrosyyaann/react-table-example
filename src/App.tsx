import { useMemo, useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import './index.css'
import { banks } from './data/Banks'
import { IBank } from 'types/Bank'
import { DebouncedInput } from './components/DebouncedInput/DebouncedInput'

export function App() {
  const [data] = useState(() => [...banks])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectRows, setselectRows] = useState<number[]>([])

  const columnHelper = createColumnHelper<IBank>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns = useMemo<ColumnDef<IBank, any>[]>(
    () => [
      columnHelper.accessor('code', {
        header: () => (
          <>
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
            />
            <p>Code</p>
          </>
        ),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnHelper]
  )

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
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <div>
      <DebouncedInput
        value={globalFilter ?? ''}
        onChange={(value) => setGlobalFilter(String(value))}
        placeholder="Поиск по всей таблице..."
      />
      <p> Всего {table.getPrePaginationRowModel().rows.length}</p>
      <div className="container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    {...{
                      className: header.column.getCanSort()
                        ? 'cursor-pointer select-none'
                        : '',
                      onClick: header.column.getToggleSortingHandler(),
                    }}
                    style={{
                      paddingLeft: header.column.id === 'code' ? '5px' : '',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? ' ↕️'}
                    </div>
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
                    className={Number(row.id) % 2 ? 'td-even' : ''}
                    style={{
                      paddingLeft: cell.column.id === 'code' ? '5px' : '',
                    }}
                    onClick={() => {
                      selectRows.includes(row.index)
                        ? setselectRows((prev) =>
                            prev.filter((value) => value !== row.index)
                          )
                        : setselectRows((prev) => [...prev, row.index])
                    }}
                  >
                    {cell.column.id === 'code' ? (
                      <div className="div-checkbox">
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
      </div>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {'<'}
      </button>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {'>'}
      </button>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value))
        }}
      >
        {Array.from(
          {
            length: Math.floor(
              table.getPrePaginationRowModel().rows.length / 10
            ),
          },
          (_, index) => (index + 1) * 10
        ).map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Показать {pageSize}
          </option>
        ))}
      </select>
      <span>
        <strong>
          {table.getState().pagination.pageIndex + 1} из {table.getPageCount()}
        </strong>
      </span>
      <button onClick={() => alert(selectRows)}>Выбранные строки</button>
    </div>
  )
}
