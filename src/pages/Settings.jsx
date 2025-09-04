import React, { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import FieldBuilder from '../components/FieldBuilder'
import { User, Bell, Shield, CreditCard, Database } from 'lucide-react'

function Settings() {
  const { state, dispatch } = useApp()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'fields', name: 'Custom Fields', icon: Database },
  ]

  const handleSaveField = (fieldData) => {
    dispatch({ type: 'ADD_CUSTOM_FIELD', payload: fieldData })
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={state.user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subscription Plan</label>
                  <input
                    type="text"
                    value={state.user.subscriptionPlan}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 capitalize"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Workflow Notifications</h4>
                    <p className="text-sm text-text-secondary">Get notified when workflows run</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Integration Updates</h4>
                    <p className="text-sm text-text-secondary">Alerts for integration status changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-text-secondary">Receive email summaries</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <button className="btn-primary">Change Password</button>
                <div>
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-text-secondary mb-2">
                    Add an extra layer of security to your account
                  </p>
                  <button className="btn-secondary">Enable 2FA</button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
              <div className="card bg-gradient-to-r from-accent to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold capitalize">{state.user.subscriptionPlan} Plan</h4>
                    <p className="opacity-90">
                      {state.user.subscriptionPlan === 'pro' ? '$29/month' : 'Free'}
                    </p>
                  </div>
                  <button className="bg-white text-accent px-4 py-2 rounded-md font-medium">
                    {state.user.subscriptionPlan === 'free' ? 'Upgrade' : 'Manage'}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Usage This Month</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="card text-center">
                    <div className="text-lg font-bold">{state.workflows.length}/10</div>
                    <div className="text-sm text-text-secondary">Workflows</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-lg font-bold">{state.integrations.length}/5</div>
                    <div className="text-sm text-text-secondary">Integrations</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-lg font-bold">245/1000</div>
                    <div className="text-sm text-text-secondary">Executions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'fields':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Fields</h3>
              <p className="text-text-secondary mb-6">
                Create custom fields to capture additional data for your CRM records.
              </p>
              
              <div className="space-y-4">
                {state.customFields.map((field) => (
                  <div key={field.fieldId} className="card border-l-4 border-accent">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{field.fieldName}</h4>
                        <p className="text-sm text-text-secondary">
                          {field.fieldType} field for {field.entityType}
                        </p>
                      </div>
                      <button className="btn-secondary text-sm">Edit</button>
                    </div>
                  </div>
                ))}
                
                <FieldBuilder onSave={handleSaveField} />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
        <p className="text-text-secondary">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-accent bg-opacity-10 text-accent'
                      : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="card">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings