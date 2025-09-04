import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'

function FieldBuilder({ onSave, variant = 'text' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fieldData, setFieldData] = useState({
    fieldName: '',
    fieldType: variant,
    entityType: 'contact',
    options: []
  })

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
    { value: 'boolean', label: 'Yes/No' }
  ]

  const entityTypes = [
    { value: 'contact', label: 'Contact' },
    { value: 'deal', label: 'Deal' },
    { value: 'company', label: 'Company' }
  ]

  const handleSave = () => {
    if (fieldData.fieldName.trim()) {
      onSave({
        ...fieldData,
        fieldId: Date.now().toString()
      })
      setFieldData({
        fieldName: '',
        fieldType: variant,
        entityType: 'contact',
        options: []
      })
      setIsOpen(false)
    }
  }

  const addOption = () => {
    setFieldData({
      ...fieldData,
      options: [...fieldData.options, '']
    })
  }

  const updateOption = (index, value) => {
    const newOptions = [...fieldData.options]
    newOptions[index] = value
    setFieldData({
      ...fieldData,
      options: newOptions
    })
  }

  const removeOption = (index) => {
    setFieldData({
      ...fieldData,
      options: fieldData.options.filter((_, i) => i !== index)
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent hover:bg-opacity-5 transition-all duration-200"
      >
        <Plus size={20} className="mx-auto mb-2 text-gray-400" />
        <span className="text-gray-600">Add Custom Field</span>
      </button>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Create Custom Field</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Field Name</label>
          <input
            type="text"
            value={fieldData.fieldName}
            onChange={(e) => setFieldData({ ...fieldData, fieldName: e.target.value })}
            placeholder="Enter field name..."
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Field Type</label>
            <select
              value={fieldData.fieldType}
              onChange={(e) => setFieldData({ ...fieldData, fieldType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Entity Type</label>
            <select
              value={fieldData.entityType}
              onChange={(e) => setFieldData({ ...fieldData, entityType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {entityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {fieldData.fieldType === 'dropdown' && (
          <div>
            <label className="block text-sm font-medium mb-2">Dropdown Options</label>
            <div className="space-y-2">
              {fieldData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="p-2 rounded-md hover:bg-red-100 text-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="btn-secondary text-sm"
              >
                Add Option
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-4">
          <button onClick={handleSave} className="btn-primary">
            Create Field
          </button>
          <button onClick={() => setIsOpen(false)} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default FieldBuilder