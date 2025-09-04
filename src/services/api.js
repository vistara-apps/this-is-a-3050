/**
 * FlowLink CRM API Service Layer
 * Implements the API-first architecture as specified in the PRD
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

class APIService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.token = localStorage.getItem('auth_token')
  }

  setAuthToken(token) {
    this.token = token
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new APIError(
          data.message || 'API request failed',
          response.status,
          data
        )
      }

      return data
    } catch (error) {
      if (error instanceof APIError) {
        throw error
      }
      throw new APIError('Network error', 0, { originalError: error.message })
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData,
    })
  }

  async logout() {
    const result = await this.request('/auth/logout', { method: 'POST' })
    this.setAuthToken(null)
    return result
  }

  // User management
  async getCurrentUser() {
    return this.request('/users/me')
  }

  async updateUser(userData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: userData,
    })
  }

  // Integration management
  async getIntegrations() {
    return this.request('/integrations')
  }

  async createIntegration(integrationData) {
    return this.request('/integrations', {
      method: 'POST',
      body: integrationData,
    })
  }

  async updateIntegration(integrationId, integrationData) {
    return this.request(`/integrations/${integrationId}`, {
      method: 'PUT',
      body: integrationData,
    })
  }

  async deleteIntegration(integrationId) {
    return this.request(`/integrations/${integrationId}`, {
      method: 'DELETE',
    })
  }

  async testIntegration(integrationId) {
    return this.request(`/integrations/${integrationId}/test`, {
      method: 'POST',
    })
  }

  // Workflow management
  async getWorkflows() {
    return this.request('/workflows')
  }

  async createWorkflow(workflowData) {
    return this.request('/workflows', {
      method: 'POST',
      body: workflowData,
    })
  }

  async updateWorkflow(workflowId, workflowData) {
    return this.request(`/workflows/${workflowId}`, {
      method: 'PUT',
      body: workflowData,
    })
  }

  async deleteWorkflow(workflowId) {
    return this.request(`/workflows/${workflowId}`, {
      method: 'DELETE',
    })
  }

  async executeWorkflow(workflowId, inputData = {}) {
    return this.request(`/workflows/${workflowId}/execute`, {
      method: 'POST',
      body: inputData,
    })
  }

  async getWorkflowExecutions(workflowId) {
    return this.request(`/workflows/${workflowId}/executions`)
  }

  // Custom field management
  async getCustomFields() {
    return this.request('/custom-fields')
  }

  async createCustomField(fieldData) {
    return this.request('/custom-fields', {
      method: 'POST',
      body: fieldData,
    })
  }

  async updateCustomField(fieldId, fieldData) {
    return this.request(`/custom-fields/${fieldId}`, {
      method: 'PUT',
      body: fieldData,
    })
  }

  async deleteCustomField(fieldId) {
    return this.request(`/custom-fields/${fieldId}`, {
      method: 'DELETE',
    })
  }

  // CRM record management
  async getCRMRecords(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString()
    return this.request(`/crm-records${queryParams ? `?${queryParams}` : ''}`)
  }

  async createCRMRecord(recordData) {
    return this.request('/crm-records', {
      method: 'POST',
      body: recordData,
    })
  }

  async updateCRMRecord(recordId, recordData) {
    return this.request(`/crm-records/${recordId}`, {
      method: 'PUT',
      body: recordData,
    })
  }

  async deleteCRMRecord(recordId) {
    return this.request(`/crm-records/${recordId}`, {
      method: 'DELETE',
    })
  }

  async bulkImportCRMRecords(records) {
    return this.request('/crm-records/bulk-import', {
      method: 'POST',
      body: { records },
    })
  }

  // External API integrations
  async connectGoogleSheets(authCode) {
    return this.request('/integrations/google-sheets/connect', {
      method: 'POST',
      body: { authCode },
    })
  }

  async connectSlack(authCode) {
    return this.request('/integrations/slack/connect', {
      method: 'POST',
      body: { authCode },
    })
  }

  async connectZapier(apiKey) {
    return this.request('/integrations/zapier/connect', {
      method: 'POST',
      body: { apiKey },
    })
  }

  // Google Sheets specific operations
  async getGoogleSheetsData(integrationId, spreadsheetId, range) {
    return this.request(`/integrations/google-sheets/${integrationId}/data`, {
      method: 'POST',
      body: { spreadsheetId, range },
    })
  }

  async updateGoogleSheetsData(integrationId, spreadsheetId, range, values) {
    return this.request(`/integrations/google-sheets/${integrationId}/update`, {
      method: 'POST',
      body: { spreadsheetId, range, values },
    })
  }

  // Slack specific operations
  async sendSlackMessage(integrationId, channel, message) {
    return this.request(`/integrations/slack/${integrationId}/message`, {
      method: 'POST',
      body: { channel, message },
    })
  }

  async getSlackChannels(integrationId) {
    return this.request(`/integrations/slack/${integrationId}/channels`)
  }

  // Zapier specific operations
  async triggerZapierWebhook(integrationId, webhookUrl, data) {
    return this.request(`/integrations/zapier/${integrationId}/trigger`, {
      method: 'POST',
      body: { webhookUrl, data },
    })
  }

  // Analytics and reporting
  async getAnalytics(dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString()
    return this.request(`/analytics${queryParams ? `?${queryParams}` : ''}`)
  }

  async getWorkflowAnalytics(workflowId, dateRange = {}) {
    const queryParams = new URLSearchParams(dateRange).toString()
    return this.request(`/analytics/workflows/${workflowId}${queryParams ? `?${queryParams}` : ''}`)
  }

  // Subscription and billing
  async getSubscription() {
    return this.request('/subscription')
  }

  async updateSubscription(planId) {
    return this.request('/subscription', {
      method: 'PUT',
      body: { planId },
    })
  }

  async getBillingHistory() {
    return this.request('/billing/history')
  }
}

// Create and export a singleton instance
const apiService = new APIService()
export default apiService

// Export the class for testing purposes
export { APIService, APIError }
