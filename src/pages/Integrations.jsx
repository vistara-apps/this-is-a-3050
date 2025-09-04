import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import IntegrationCard from '../components/IntegrationCard'
import { Search, Filter } from 'lucide-react'

function Integrations() {
  const { state, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, connected, available

  const availableIntegrations = [
    { platformName: 'Microsoft Teams', description: 'Team communication and collaboration' },
    { platformName: 'Airtable', description: 'Flexible database and project management' },
    { platformName: 'Trello', description: 'Visual project management with boards and cards' },
    { platformName: 'Zapier', description: 'Connect 5000+ apps with automated workflows' },
  ]

  const allIntegrations = [
    ...state.integrations.map(int => ({ ...int, variant: 'connected' })),
    ...availableIntegrations
      .filter(avail => !state.integrations.find(conn => conn.platformName === avail.platformName))
      .map(int => ({ ...int, variant: 'available' }))
  ]

  const filteredIntegrations = allIntegrations.filter(integration => {
    const matchesSearch = integration.platformName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'all' || 
      (filter === 'connected' && integration.variant === 'connected') ||
      (filter === 'available' && integration.variant === 'available')
    
    return matchesSearch && matchesFilter
  })

  const handleConnect = (integration) => {
    if (integration.variant === 'available') {
      const newIntegration = {
        integrationId: Date.now().toString(),
        userId: state.user.userId,
        platformName: integration.platformName,
        apiKey: 'encrypted_key_' + Date.now(),
        config: { status: 'connected' }
      }
      dispatch({ type: 'ADD_INTEGRATION', payload: newIntegration })
    }
  }

  const connectedCount = state.integrations.length
  const availableCount = availableIntegrations.length - connectedCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Integrations</h1>
        <p className="text-text-secondary">
          Connect your favorite apps to automate workflows and sync data.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
          <div className="text-sm text-text-secondary">Connected Apps</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{availableCount}</div>
          <div className="text-sm text-text-secondary">Available Apps</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">{state.workflows.length}</div>
          <div className="text-sm text-text-secondary">Active Workflows</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          >
            <option value="all">All Apps</option>
            <option value="connected">Connected</option>
            <option value="available">Available</option>
          </select>
        </div>
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration, index) => (
          <IntegrationCard
            key={`${integration.platformName}-${index}`}
            integration={integration}
            variant={integration.variant}
            onConnect={handleConnect}
          />
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No integrations found</h3>
          <p className="text-text-secondary">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Popular Integrations */}
      {filter === 'all' && searchTerm === '' && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Popular Integrations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Google Sheets', 'Slack', 'Zapier', 'Microsoft Teams'].map((app) => (
              <div key={app} className="p-4 border border-gray-200 rounded-lg text-center hover:border-accent transition-colors cursor-pointer">
                <div className="text-2xl mb-2">
                  {app === 'Google Sheets' && '📊'}
                  {app === 'Slack' && '💬'}
                  {app === 'Zapier' && '⚡'}
                  {app === 'Microsoft Teams' && '👥'}
                </div>
                <div className="font-medium text-sm">{app}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Integrations