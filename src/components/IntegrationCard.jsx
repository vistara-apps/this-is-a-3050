import React from 'react'
import { CheckCircle, Circle, ExternalLink } from 'lucide-react'

function IntegrationCard({ integration, onConnect, variant = 'available' }) {
  const isConnected = variant === 'connected'
  
  const integrationIcons = {
    'Google Sheets': '📊',
    'Slack': '💬',
    'Zapier': '⚡',
    'Microsoft Teams': '👥',
    'Airtable': '🗂️',
    'Trello': '📋'
  }

  return (
    <div className="card hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {integrationIcons[integration.platformName] || '🔗'}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">{integration.platformName}</h3>
            <p className="text-sm text-text-secondary">
              {isConnected ? 'Connected' : 'Available for connection'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isConnected ? (
            <CheckCircle className="text-green-500" size={20} />
          ) : (
            <Circle className="text-gray-400" size={20} />
          )}
        </div>
      </div>
      
      <p className="text-sm text-text-secondary mb-4">
        {integration.description || `Integrate with ${integration.platformName} to automate your workflows.`}
      </p>
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => onConnect && onConnect(integration)}
          className={`${isConnected ? 'btn-secondary' : 'btn-primary'} text-sm`}
        >
          {isConnected ? 'Configure' : 'Connect'}
        </button>
        
        <button className="p-2 rounded-md hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}

export default IntegrationCard