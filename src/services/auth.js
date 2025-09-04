/**
 * Authentication Service for FlowLink CRM
 * Handles user authentication, token management, and session persistence
 */

import apiService from './api'

class AuthService {
  constructor() {
    this.currentUser = null
    this.isAuthenticated = false
    this.initializeAuth()
  }

  initializeAuth() {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('current_user')
    
    if (token && user) {
      try {
        this.currentUser = JSON.parse(user)
        this.isAuthenticated = true
        apiService.setAuthToken(token)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        this.clearAuth()
      }
    }
  }

  async login(email, password) {
    try {
      const response = await apiService.login(email, password)
      const { user, token } = response

      // Store authentication data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('current_user', JSON.stringify(user))
      
      // Update service state
      this.currentUser = user
      this.isAuthenticated = true
      apiService.setAuthToken(token)

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      }
    }
  }

  async register(userData) {
    try {
      const response = await apiService.register(userData)
      const { user, token } = response

      // Store authentication data
      localStorage.setItem('auth_token', token)
      localStorage.setItem('current_user', JSON.stringify(user))
      
      // Update service state
      this.currentUser = user
      this.isAuthenticated = true
      apiService.setAuthToken(token)

      return { success: true, user }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      }
    }
  }

  async logout() {
    try {
      await apiService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearAuth()
    }
  }

  clearAuth() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('current_user')
    this.currentUser = null
    this.isAuthenticated = false
    apiService.setAuthToken(null)
  }

  async refreshUser() {
    if (!this.isAuthenticated) {
      return null
    }

    try {
      const user = await apiService.getCurrentUser()
      this.currentUser = user
      localStorage.setItem('current_user', JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Error refreshing user:', error)
      if (error.status === 401) {
        this.clearAuth()
      }
      return null
    }
  }

  getCurrentUser() {
    return this.currentUser
  }

  isUserAuthenticated() {
    return this.isAuthenticated
  }

  hasSubscription(planType = null) {
    if (!this.currentUser || !this.currentUser.subscriptionPlan) {
      return false
    }

    if (!planType) {
      return this.currentUser.subscriptionPlan !== 'free'
    }

    return this.currentUser.subscriptionPlan === planType
  }

  canAccessFeature(feature) {
    const plan = this.currentUser?.subscriptionPlan || 'free'
    
    const featureAccess = {
      free: ['basic_workflows', 'basic_integrations', 'basic_crm'],
      pro: ['basic_workflows', 'basic_integrations', 'basic_crm', 'advanced_workflows', 'custom_fields', 'analytics'],
      business: ['basic_workflows', 'basic_integrations', 'basic_crm', 'advanced_workflows', 'custom_fields', 'analytics', 'api_access', 'priority_support', 'advanced_integrations']
    }

    return featureAccess[plan]?.includes(feature) || false
  }

  getSubscriptionLimits() {
    const plan = this.currentUser?.subscriptionPlan || 'free'
    
    const limits = {
      free: {
        workflows: 3,
        integrations: 2,
        crmRecords: 100,
        customFields: 5
      },
      pro: {
        workflows: 25,
        integrations: 10,
        crmRecords: 5000,
        customFields: 50
      },
      business: {
        workflows: -1, // unlimited
        integrations: -1, // unlimited
        crmRecords: -1, // unlimited
        customFields: -1 // unlimited
      }
    }

    return limits[plan] || limits.free
  }

  // Token validation and refresh logic
  async validateToken() {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return false
    }

    try {
      // Try to make an authenticated request
      await apiService.getCurrentUser()
      return true
    } catch (error) {
      if (error.status === 401) {
        this.clearAuth()
        return false
      }
      // For other errors, assume token is still valid
      return true
    }
  }

  // OAuth integration helpers
  async initiateGoogleOAuth() {
    const clientId = process.env.VITE_GOOGLE_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/google/callback`
    const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email'
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`

    window.location.href = authUrl
  }

  async initiateSlackOAuth() {
    const clientId = process.env.VITE_SLACK_CLIENT_ID
    const redirectUri = `${window.location.origin}/auth/slack/callback`
    const scope = 'chat:write,channels:read,users:read'
    
    const authUrl = `https://slack.com/oauth/v2/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code`

    window.location.href = authUrl
  }

  // Demo mode for development
  enableDemoMode() {
    const demoUser = {
      userId: 'demo-user',
      email: 'demo@flowlinkcrm.com',
      subscriptionPlan: 'pro',
      createdAt: new Date().toISOString(),
      firstName: 'Demo',
      lastName: 'User'
    }

    const demoToken = 'demo-token-' + Date.now()
    
    localStorage.setItem('auth_token', demoToken)
    localStorage.setItem('current_user', JSON.stringify(demoUser))
    
    this.currentUser = demoUser
    this.isAuthenticated = true
    apiService.setAuthToken(demoToken)

    return { success: true, user: demoUser }
  }
}

// Create and export singleton instance
const authService = new AuthService()
export default authService

// Export class for testing
export { AuthService }
