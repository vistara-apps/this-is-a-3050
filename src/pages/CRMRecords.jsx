import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import DataTable from '../components/DataTable'
import { Plus, Upload, Download } from 'lucide-react'

function CRMRecords() {
  const { state, dispatch } = useApp()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRecord, setNewRecord] = useState({
    name: '',
    email: '',
    company: '',
    leadSource: ''
  })

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value) => (
        <div className="font-medium">{value}</div>
      )
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="text-accent">{value}</div>
      )
    },
    {
      key: 'company',
      label: 'Company'
    },
    {
      key: 'leadSource',
      label: 'Lead Source',
      render: (value) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {value}
        </span>
      )
    }
  ]

  const handleAddRecord = () => {
    if (newRecord.name.trim() && newRecord.email.trim()) {
      const record = {
        recordId: Date.now().toString(),
        userId: state.user.userId,
        data: { ...newRecord }
      }
      
      dispatch({ type: 'ADD_CRM_RECORD', payload: record })
      setNewRecord({ name: '', email: '', company: '', leadSource: '' })
      setShowAddForm(false)
    }
  }

  const handleEdit = (record) => {
    console.log('Edit record:', record)
  }

  const handleDelete = (record) => {
    console.log('Delete record:', record)
  }

  const tableData = state.crmRecords.map(record => ({
    ...record.data,
    recordId: record.recordId
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">CRM Records</h1>
          <p className="text-text-secondary">
            Manage your contacts, leads, and customer data.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-sm">
            <Upload size={16} className="mr-2" />
            Import
          </button>
          <button className="btn-secondary text-sm">
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary text-sm"
          >
            <Plus size={16} className="mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{state.crmRecords.length}</div>
          <div className="text-sm text-text-secondary">Total Records</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {state.crmRecords.filter(r => r.data.leadSource === 'Website').length}
          </div>
          <div className="text-sm text-text-secondary">Website Leads</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {state.crmRecords.filter(r => r.data.company).length}
          </div>
          <div className="text-sm text-text-secondary">With Company</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-orange-600">
            {state.customFields.length}
          </div>
          <div className="text-sm text-text-secondary">Custom Fields</div>
        </div>
      </div>

      {/* Add Record Form */}
      {showAddForm && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Add New Record</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={newRecord.name}
                onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                placeholder="Enter full name..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={newRecord.email}
                onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
                placeholder="Enter email address..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={newRecord.company}
                onChange={(e) => setNewRecord({ ...newRecord, company: e.target.value })}
                placeholder="Enter company name..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lead Source</label>
              <select
                value={newRecord.leadSource}
                onChange={(e) => setNewRecord({ ...newRecord, leadSource: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select source...</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaign">Email Campaign</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-6">
            <button onClick={handleAddRecord} className="btn-primary">
              Add Record
            </button>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        data={tableData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setShowAddForm(true)}
        variant="withFilters"
      />
    </div>
  )
}

export default CRMRecords