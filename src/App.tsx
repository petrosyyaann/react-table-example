import { useState } from 'react'
import {
  ColumnFiltersState,
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
import { TableHead } from './components/TableHead/TableHead'
import { TableBody } from './components/TableBody/TableBody'

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
          <TableHead {...table} />
          <TableBody
            table={table}
            selectRows={selectRows}
            setselectRows={setselectRows}
          />
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
