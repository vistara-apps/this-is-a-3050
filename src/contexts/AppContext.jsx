import React, { createContext, useContext, useReducer, useEffect } from 'react'
import authService from '../services/auth'
import apiService from '../services/api'
import ValidationService from '../services/validation'
import workflowEngine from '../services/workflowEngine'

const AppContext = createContext()

const initialState = {
  // Authentication state
  isAuthenticated: false,
  user: null,
  authLoading: true,
  
  // Application data
  integrations: [],
  workflows: [],
  customFields: [],
  crmRecords: [],
  
  // UI state
  loading: false,
  error: null,
  notifications: [],
  
  // Workflow execution state
  activeExecutions: [],
  executionHistory: [],
  
  // Analytics data
  analytics: {
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successRate: 0
  }
}

function appReducer(state, action) {
  switch (action.type) {
    // Authentication actions
    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload }
    
    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        authLoading: false,
        error: null
      }
    
    case 'SET_UNAUTHENTICATED':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        authLoading: false,
        integrations: [],
        workflows: [],
        customFields: [],
        crmRecords: []
      }
    
    // Loading and error states
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    // Notifications
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      }
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      }
    
    // Workflows
    case 'SET_WORKFLOWS':
      return { ...state, workflows: action.payload }
    
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
    
    // Integrations
    case 'SET_INTEGRATIONS':
      return { ...state, integrations: action.payload }
    
    case 'ADD_INTEGRATION':
      return {
        ...state,
        integrations: [...state.integrations, action.payload]
      }
    
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(i => 
          i.integrationId === action.payload.integrationId ? action.payload : i
        )
      }
    
    case 'DELETE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.filter(i => i.integrationId !== action.payload)
      }
    
    // CRM Records
    case 'SET_CRM_RECORDS':
      return { ...state, crmRecords: action.payload }
    
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
    
    case 'DELETE_CRM_RECORD':
      return {
        ...state,
        crmRecords: state.crmRecords.filter(r => r.recordId !== action.payload)
      }
    
    // Custom Fields
    case 'SET_CUSTOM_FIELDS':
      return { ...state, customFields: action.payload }
    
    case 'ADD_CUSTOM_FIELD':
      return {
        ...state,
        customFields: [...state.customFields, action.payload]
      }
    
    case 'UPDATE_CUSTOM_FIELD':
      return {
        ...state,
        customFields: state.customFields.map(f => 
          f.fieldId === action.payload.fieldId ? action.payload : f
        )
      }
    
    case 'DELETE_CUSTOM_FIELD':
      return {
        ...state,
        customFields: state.customFields.filter(f => f.fieldId !== action.payload)
      }
    
    // Workflow Executions
    case 'SET_ACTIVE_EXECUTIONS':
      return { ...state, activeExecutions: action.payload }
    
    case 'SET_EXECUTION_HISTORY':
      return { ...state, executionHistory: action.payload }
    
    case 'ADD_EXECUTION':
      return {
        ...state,
        activeExecutions: [...state.activeExecutions, action.payload]
      }
    
    case 'UPDATE_EXECUTION':
      return {
        ...state,
        activeExecutions: state.activeExecutions.map(e => 
          e.id === action.payload.id ? action.payload : e
        )
      }
    
    // Analytics
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload }
    
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  // Initialize authentication on app start
  useEffect(() => {
    initializeAuth()
  }, [])

  // Authentication functions
  const initializeAuth = async () => {
    dispatch({ type: 'SET_AUTH_LOADING', payload: true })
    
    try {
      if (authService.isUserAuthenticated()) {
        const user = authService.getCurrentUser()
        dispatch({ type: 'SET_AUTHENTICATED', payload: user })
        await loadUserData()
      } else {
        // Enable demo mode for development
        const demoResult = authService.enableDemoMode()
        if (demoResult.success) {
          dispatch({ type: 'SET_AUTHENTICATED', payload: demoResult.user })
          await loadDemoData()
        } else {
          dispatch({ type: 'SET_UNAUTHENTICATED' })
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error)
      dispatch({ type: 'SET_ERROR', payload: 'Authentication failed' })
      dispatch({ type: 'SET_UNAUTHENTICATED' })
    }
  }

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const result = await authService.login(email, password)
      if (result.success) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: result.user })
        await loadUserData()
        showNotification('Login successful', 'success')
        return { success: true }
      } else {
        dispatch({ type: 'SET_ERROR', payload: result.error })
        return { success: false, error: result.error }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
      return { success: false, error: error.message }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'SET_UNAUTHENTICATED' })
      showNotification('Logged out successfully', 'info')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Data loading functions
  const loadUserData = async () => {
    try {
      const [workflows, integrations, customFields, crmRecords] = await Promise.all([
        apiService.getWorkflows().catch(() => []),
        apiService.getIntegrations().catch(() => []),
        apiService.getCustomFields().catch(() => []),
        apiService.getCRMRecords().catch(() => [])
      ])

      dispatch({ type: 'SET_WORKFLOWS', payload: workflows })
      dispatch({ type: 'SET_INTEGRATIONS', payload: integrations })
      dispatch({ type: 'SET_CUSTOM_FIELDS', payload: customFields })
      dispatch({ type: 'SET_CRM_RECORDS', payload: crmRecords })

      // Load execution data
      const activeExecutions = workflowEngine.getActiveExecutions()
      const executionHistory = workflowEngine.getExecutionHistory()
      dispatch({ type: 'SET_ACTIVE_EXECUTIONS', payload: activeExecutions })
      dispatch({ type: 'SET_EXECUTION_HISTORY', payload: executionHistory })

    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  const loadDemoData = async () => {
    // Load demo data for development
    const demoData = {
      workflows: [
        {
          workflowId: 'demo-1',
          userId: 'demo-user',
          name: 'New Lead Notification',
          description: 'Send Slack notification when new lead is added',
          stepsJson: JSON.stringify([
            { type: 'trigger', platform: 'CRM', event: 'new_record' },
            { type: 'action', platform: 'Slack', action: 'send_message' }
          ]),
          isEnabled: true
        }
      ],
      integrations: [
        {
          integrationId: 'demo-int-1',
          userId: 'demo-user',
          platformName: 'Google Sheets',
          apiKey: 'demo_key_1',
          config: { status: 'connected' }
        },
        {
          integrationId: 'demo-int-2',
          userId: 'demo-user',
          platformName: 'Slack',
          apiKey: 'demo_key_2',
          config: { status: 'connected' }
        }
      ],
      customFields: [
        {
          fieldId: 'demo-field-1',
          userId: 'demo-user',
          fieldName: 'Lead Source',
          fieldType: 'dropdown',
          entityType: 'contact',
          options: ['Website', 'Social Media', 'Referral', 'Cold Call']
        }
      ],
      crmRecords: [
        {
          recordId: 'demo-record-1',
          userId: 'demo-user',
          data: {
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Acme Corp',
            leadSource: 'Website'
          }
        }
      ]
    }

    dispatch({ type: 'SET_WORKFLOWS', payload: demoData.workflows })
    dispatch({ type: 'SET_INTEGRATIONS', payload: demoData.integrations })
    dispatch({ type: 'SET_CUSTOM_FIELDS', payload: demoData.customFields })
    dispatch({ type: 'SET_CRM_RECORDS', payload: demoData.crmRecords })
  }

  // Workflow functions
  const createWorkflow = async (workflowData) => {
    try {
      ValidationService.validateWorkflow(workflowData)
      
      const workflow = {
        ...workflowData,
        workflowId: `workflow_${Date.now()}`,
        userId: state.user?.userId,
        createdAt: new Date().toISOString()
      }

      // Try to save to backend, fallback to local state
      try {
        const savedWorkflow = await apiService.createWorkflow(workflow)
        dispatch({ type: 'ADD_WORKFLOW', payload: savedWorkflow })
        showNotification('Workflow created successfully', 'success')
        return { success: true, workflow: savedWorkflow }
      } catch (apiError) {
        // Fallback to local state for demo mode
        dispatch({ type: 'ADD_WORKFLOW', payload: workflow })
        showNotification('Workflow created (demo mode)', 'success')
        return { success: true, workflow }
      }
    } catch (error) {
      showNotification(`Failed to create workflow: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  const executeWorkflow = async (workflowId, inputData = {}) => {
    try {
      const workflow = state.workflows.find(w => w.workflowId === workflowId)
      if (!workflow) {
        throw new Error('Workflow not found')
      }

      const execution = await workflowEngine.executeWorkflow(workflow, inputData)
      dispatch({ type: 'ADD_EXECUTION', payload: execution })
      
      const message = execution.status === 'completed' 
        ? 'Workflow executed successfully' 
        : `Workflow execution ${execution.status}`
      
      showNotification(message, execution.status === 'completed' ? 'success' : 'warning')
      return { success: true, execution }
    } catch (error) {
      showNotification(`Workflow execution failed: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  // Integration functions
  const createIntegration = async (integrationData) => {
    try {
      ValidationService.validateIntegration(integrationData)
      
      const integration = {
        ...integrationData,
        integrationId: `integration_${Date.now()}`,
        userId: state.user?.userId,
        createdAt: new Date().toISOString()
      }

      try {
        const savedIntegration = await apiService.createIntegration(integration)
        dispatch({ type: 'ADD_INTEGRATION', payload: savedIntegration })
        showNotification('Integration created successfully', 'success')
        return { success: true, integration: savedIntegration }
      } catch (apiError) {
        dispatch({ type: 'ADD_INTEGRATION', payload: integration })
        showNotification('Integration created (demo mode)', 'success')
        return { success: true, integration }
      }
    } catch (error) {
      showNotification(`Failed to create integration: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  // CRM functions
  const createCRMRecord = async (recordData) => {
    try {
      ValidationService.validateCRMRecord(recordData, state.customFields)
      
      const record = {
        ...recordData,
        recordId: `record_${Date.now()}`,
        userId: state.user?.userId,
        createdAt: new Date().toISOString()
      }

      try {
        const savedRecord = await apiService.createCRMRecord(record)
        dispatch({ type: 'ADD_CRM_RECORD', payload: savedRecord })
        showNotification('CRM record created successfully', 'success')
        return { success: true, record: savedRecord }
      } catch (apiError) {
        dispatch({ type: 'ADD_CRM_RECORD', payload: record })
        showNotification('CRM record created (demo mode)', 'success')
        return { success: true, record }
      }
    } catch (error) {
      showNotification(`Failed to create CRM record: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  // Custom field functions
  const createCustomField = async (fieldData) => {
    try {
      ValidationService.validateCustomField(fieldData)
      
      const field = {
        ...fieldData,
        fieldId: `field_${Date.now()}`,
        userId: state.user?.userId,
        createdAt: new Date().toISOString()
      }

      try {
        const savedField = await apiService.createCustomField(field)
        dispatch({ type: 'ADD_CUSTOM_FIELD', payload: savedField })
        showNotification('Custom field created successfully', 'success')
        return { success: true, field: savedField }
      } catch (apiError) {
        dispatch({ type: 'ADD_CUSTOM_FIELD', payload: field })
        showNotification('Custom field created (demo mode)', 'success')
        return { success: true, field }
      }
    } catch (error) {
      showNotification(`Failed to create custom field: ${error.message}`, 'error')
      return { success: false, error: error.message }
    }
  }

  // Notification functions
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: `notification_${Date.now()}`,
      message,
      type,
      timestamp: new Date().toISOString()
    }
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })
    }, 5000)
  }

  const removeNotification = (notificationId) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId })
  }

  // Error handling
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  // Context value with all functions and state
  const contextValue = {
    // State
    ...state,
    
    // Authentication
    login,
    logout,
    
    // Data operations
    createWorkflow,
    executeWorkflow,
    createIntegration,
    createCRMRecord,
    createCustomField,
    
    // UI operations
    showNotification,
    removeNotification,
    clearError,
    
    // Direct dispatch for complex operations
    dispatch
  }

  return (
    <AppContext.Provider value={contextValue}>
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
