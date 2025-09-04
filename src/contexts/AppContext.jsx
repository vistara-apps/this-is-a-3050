import React, { createContext, useContext, useReducer, useEffect } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    userId: '1',
    email: 'user@example.com',
    subscriptionPlan: 'pro',
    createdAt: new Date().toISOString()
  },
  integrations: [
    {
      integrationId: '1',
      userId: '1',
      platformName: 'Google Sheets',
      apiKey: 'encrypted_key_1',
      config: { status: 'connected' }
    },
    {
      integrationId: '2',
      userId: '1',
      platformName: 'Slack',
      apiKey: 'encrypted_key_2',
      config: { status: 'connected' }
    }
  ],
  workflows: [
    {
      workflowId: '1',
      userId: '1',
      name: 'New Lead Notification',
      description: 'Send Slack notification when new lead is added',
      stepsJson: JSON.stringify([
        { type: 'trigger', platform: 'CRM', event: 'new_record' },
        { type: 'action', platform: 'Slack', action: 'send_message' }
      ]),
      isEnabled: true
    }
  ],
  customFields: [
    {
      fieldId: '1',
      userId: '1',
      fieldName: 'Lead Source',
      fieldType: 'dropdown',
      entityType: 'contact'
    }
  ],
  crmRecords: [
    {
      recordId: '1',
      userId: '1',
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        company: 'Acme Corp',
        leadSource: 'Website'
      }
    }
  ]
}

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_WORKFLOW':
      return {
        ...state,
        workflows: [...state.workflows, action.payload]
      }
    case 'UPDATE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.map(w => 
          w.workflowId === action.payload.workflowId ? action.payload : w
        )
      }
    case 'DELETE_WORKFLOW':
      return {
        ...state,
        workflows: state.workflows.filter(w => w.workflowId !== action.payload)
      }
    case 'ADD_INTEGRATION':
      return {
        ...state,
        integrations: [...state.integrations, action.payload]
      }
    case 'ADD_CRM_RECORD':
      return {
        ...state,
        crmRecords: [...state.crmRecords, action.payload]
      }
    case 'UPDATE_CRM_RECORD':
      return {
        ...state,
        crmRecords: state.crmRecords.map(r => 
          r.recordId === action.payload.recordId ? action.payload : r
        )
      }
    case 'ADD_CUSTOM_FIELD':
      return {
        ...state,
        customFields: [...state.customFields, action.payload]
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}