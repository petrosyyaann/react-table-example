import { useState } from 'react'
import {
  ColumnFiltersState,
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
import { DebouncedInput } from './components/DebouncedInput/DebouncedInput'
import { useColumns } from './components/Columns/useColumns'

export function App() {
  const [data] = useState(() => [...banks])

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectRows, setselectRows] = useState<number[]>([])

  const columns = useColumns(selectRows, setselectRows)

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

                      {(header.column.getCanSort() &&
                        {
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string]) ??
                        ' ↕️'}
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
                    {cell.column.id === 'chekboxes' ? (
                      <input
                        readOnly
                        type="checkbox"
                        checked={selectRows.includes(row.index)}
                      />
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
