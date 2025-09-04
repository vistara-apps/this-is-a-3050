import React, { useState } from 'react'
import { Search, Filter, Edit, Trash2, Plus } from 'lucide-react'

function DataTable({ data, columns, onEdit, onDelete, onAdd, variant = 'default' }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  
  const showFilters = variant === 'withFilters'
  const isEditable = variant === 'editable'

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const sortedData = sortField ? 
    [...filteredData].sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      }
      return aVal < bVal ? 1 : -1
    }) : filteredData

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  return (
    <div className="card">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Data Records</h3>
        <div className="flex items-center gap-4">
          {showFilters && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <button className="p-2 border border-gray-200 rounded-md hover:bg-gray-50">
                <Filter size={16} />
              </button>
            </div>
          )}
          {onAdd && (
            <button onClick={onAdd} className="btn-primary text-sm">
              <Plus size={16} className="mr-2" />
              Add Record
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map(column => (
                <th
                  key={column.key}
                  className="text-left py-3 px-4 font-medium text-text-secondary cursor-pointer hover:text-text-primary"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {sortField === column.key && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {isEditable && (
                <th className="text-left py-3 px-4 font-medium text-text-secondary w-24">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.key} className="py-3 px-4 text-sm">
                    {column.render ? 
                      column.render(item[column.key], item) : 
                      item[column.key]
                    }
                  </td>
                ))}
                {isEditable && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(item)}
                        className="p-1 rounded hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            No records found
          </div>
        )}
      </div>
    </div>
  )
}

export default DataTable