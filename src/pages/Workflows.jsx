import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import WorkflowCanvas from '../components/WorkflowCanvas'
import { Plus, Search } from 'lucide-react'

function Workflows() {
  const { state, dispatch } = useApp()
  const [selectedWorkflow, setSelectedWorkflow] = useState(state.workflows[0] || null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    description: '',
    trigger: '',
    action: ''
  })

  const filteredWorkflows = state.workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateWorkflow = () => {
    if (newWorkflow.name.trim()) {
      const workflow = {
        workflowId: Date.now().toString(),
        userId: state.user.userId,
        name: newWorkflow.name,
        description: newWorkflow.description,
        stepsJson: JSON.stringify([
          { type: 'trigger', platform: 'CRM', event: newWorkflow.trigger },
          { type: 'action', platform: 'Slack', action: newWorkflow.action }
        ]),
        isEnabled: false
      }
      
      dispatch({ type: 'ADD_WORKFLOW', payload: workflow })
      setSelectedWorkflow(workflow)
      setNewWorkflow({ name: '', description: '', trigger: '', action: '' })
      setShowCreateForm(false)
    }
  }

  const handleUpdateWorkflow = (workflow) => {
    dispatch({ type: 'UPDATE_WORKFLOW', payload: workflow })
    setSelectedWorkflow(workflow)
  }

  const handleDeleteWorkflow = (workflowId) => {
    dispatch({ type: 'DELETE_WORKFLOW', payload: workflowId })
    if (selectedWorkflow?.workflowId === workflowId) {
      setSelectedWorkflow(state.workflows[0] || null)
    }
  }

  return (
    <div className="h-full flex gap-6">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <div className="card h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Workflows</h2>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary text-sm"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          <div className="space-y-2 overflow-y-auto">
            {filteredWorkflows.map((workflow) => (
              <button
                key={workflow.workflowId}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                  selectedWorkflow?.workflowId === workflow.workflowId
                    ? 'border-accent bg-accent bg-opacity-10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{workflow.name}</h3>
                  <div className={`w-2 h-2 rounded-full ${
                    workflow.isEnabled ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                <p className="text-xs text-text-secondary line-clamp-2">
                  {workflow.description}
                </p>
              </button>
            ))}

            {filteredWorkflows.length === 0 && (
              <div className="text-center py-8 text-text-secondary">
                <p className="text-sm">No workflows found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {showCreateForm ? (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Create New Workflow</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Workflow Name</label>
                <input
                  type="text"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  placeholder="Enter workflow name..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder="Describe what this workflow does..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Trigger Event</label>
                  <select
                    value={newWorkflow.trigger}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, trigger: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select trigger...</option>
                    <option value="new_record">New CRM Record</option>
                    <option value="record_updated">Record Updated</option>
                    <option value="new_email">New Email</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Action</label>
                  <select
                    value={newWorkflow.action}
                    onChange={(e) => setNewWorkflow({ ...newWorkflow, action: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select action...</option>
                    <option value="send_message">Send Slack Message</option>
                    <option value="update_sheet">Update Google Sheet</option>
                    <option value="send_email">Send Email</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCreateWorkflow} className="btn-primary">
                  Create Workflow
                </button>
                <button 
                  onClick={() => setShowCreateForm(false)} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <WorkflowCanvas
            workflow={selectedWorkflow}
            onUpdate={handleUpdateWorkflow}
            onDelete={handleDeleteWorkflow}
          />
        )}
      </div>
    </div>
  )
}

export default Workflows