import React, { useState } from 'react'
import { Plus, Play, Pause, Trash2, Settings } from 'lucide-react'

function WorkflowCanvas({ workflow, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  
  const steps = workflow ? JSON.parse(workflow.stepsJson) : []
  
  const stepIcons = {
    trigger: '🎯',
    action: '⚡',
    condition: '🔀',
    delay: '⏰'
  }

  const handleToggleEnabled = () => {
    if (onUpdate) {
      onUpdate({
        ...workflow,
        isEnabled: !workflow.isEnabled
      })
    }
  }

  if (!workflow) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">🔧</div>
        <h3 className="text-xl font-semibold mb-2">No Workflow Selected</h3>
        <p className="text-text-secondary mb-4">
          Select a workflow from the sidebar or create a new one to get started.
        </p>
        <button className="btn-primary">
          <Plus size={16} className="mr-2" />
          Create New Workflow
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{workflow.name}</h2>
            <p className="text-text-secondary">{workflow.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleEnabled}
              className={`p-2 rounded-md ${
                workflow.isEnabled 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={workflow.isEnabled ? 'Pause workflow' : 'Start workflow'}
            >
              {workflow.isEnabled ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => onDelete && onDelete(workflow.workflowId)}
              className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            workflow.isEnabled ? 'bg-green-500' : 'bg-gray-400'
          }`}></div>
          <span className="text-sm text-text-secondary">
            {workflow.isEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Workflow Steps</h3>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl">{stepIcons[step.type] || '⚡'}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium capitalize">{step.type}</span>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {step.platform}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {step.event || step.action || 'Configure this step'}
                  </p>
                </div>
                {isEditing && (
                  <button className="p-2 rounded-md hover:bg-gray-100">
                    <Settings size={16} />
                  </button>
                )}
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-px h-6 bg-gray-300"></div>
                  <div className="absolute top-8 w-2 h-2 bg-gray-300 rounded-full transform -translate-x-1/2"></div>
                </div>
              )}
            </div>
          ))}
          
          {isEditing && (
            <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent hover:bg-accent hover:bg-opacity-5 transition-all duration-200">
              <Plus size={20} className="mx-auto mb-2 text-gray-400" />
              <span className="text-gray-600">Add Step</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkflowCanvas