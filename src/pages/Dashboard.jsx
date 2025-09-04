import React from 'react'
import { useApp } from '../contexts/AppContext'
import { BarChart3, Users, GitBranch, TrendingUp, Plus } from 'lucide-react'

function Dashboard() {
  const { state } = useApp()

  const stats = [
    {
      name: 'Active Workflows',
      value: state.workflows.filter(w => w.isEnabled).length,
      icon: GitBranch,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      name: 'Connected Apps',
      value: state.integrations.length,
      icon: BarChart3,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      name: 'CRM Records',
      value: state.crmRecords.length,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    },
    {
      name: 'Growth Rate',
      value: '+23%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ]

  const quickActions = [
    { name: 'Create Workflow', description: 'Build a new automation', icon: GitBranch },
    { name: 'Add Integration', description: 'Connect a new app', icon: Plus },
    { name: 'Import Data', description: 'Upload CRM records', icon: Users },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary">
          Welcome back! Here's what's happening with your automations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">{stat.name}</p>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <action.icon className="h-5 w-5 text-accent" />
                  <div>
                    <div className="font-medium">{action.name}</div>
                    <div className="text-sm text-text-secondary">{action.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Workflow "New Lead Notification" executed</p>
                <p className="text-xs text-text-secondary">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New CRM record added: John Doe</p>
                <p className="text-xs text-text-secondary">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Google Sheets integration updated</p>
                <p className="text-xs text-text-secondary">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workflows */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Workflows</h2>
          <button className="btn-primary text-sm">View All</button>
        </div>
        <div className="space-y-4">
          {state.workflows.slice(0, 3).map((workflow) => (
            <div key={workflow.workflowId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${workflow.isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <div>
                  <h3 className="font-medium">{workflow.name}</h3>
                  <p className="text-sm text-text-secondary">{workflow.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{workflow.isEnabled ? 'Active' : 'Inactive'}</p>
                <p className="text-xs text-text-secondary">Last run: 2h ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard