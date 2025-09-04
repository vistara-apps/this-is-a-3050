/**
 * Data Validation and Business Logic Service
 * Implements comprehensive validation rules for FlowLink CRM
 */

class ValidationError extends Error {
  constructor(message, field = null, code = null) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
    this.code = code
  }
}

class ValidationService {
  // Email validation
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      throw new ValidationError('Email is required', 'email', 'REQUIRED')
    }
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', 'email', 'INVALID_FORMAT')
    }
    return true
  }

  // Password validation
  static validatePassword(password) {
    if (!password) {
      throw new ValidationError('Password is required', 'password', 'REQUIRED')
    }
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long', 'password', 'TOO_SHORT')
    }
    if (!/(?=.*[a-z])/.test(password)) {
      throw new ValidationError('Password must contain at least one lowercase letter', 'password', 'MISSING_LOWERCASE')
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      throw new ValidationError('Password must contain at least one uppercase letter', 'password', 'MISSING_UPPERCASE')
    }
    if (!/(?=.*\d)/.test(password)) {
      throw new ValidationError('Password must contain at least one number', 'password', 'MISSING_NUMBER')
    }
    return true
  }

  // User data validation
  static validateUserData(userData) {
    const errors = []

    try {
      this.validateEmail(userData.email)
    } catch (error) {
      errors.push(error)
    }

    if (userData.password) {
      try {
        this.validatePassword(userData.password)
      } catch (error) {
        errors.push(error)
      }
    }

    if (userData.firstName && userData.firstName.trim().length < 2) {
      errors.push(new ValidationError('First name must be at least 2 characters long', 'firstName', 'TOO_SHORT'))
    }

    if (userData.lastName && userData.lastName.trim().length < 2) {
      errors.push(new ValidationError('Last name must be at least 2 characters long', 'lastName', 'TOO_SHORT'))
    }

    if (errors.length > 0) {
      throw new ValidationError('User data validation failed', null, 'VALIDATION_FAILED', errors)
    }

    return true
  }

  // Workflow validation
  static validateWorkflow(workflowData) {
    const errors = []

    if (!workflowData.name || workflowData.name.trim().length < 3) {
      errors.push(new ValidationError('Workflow name must be at least 3 characters long', 'name', 'TOO_SHORT'))
    }

    if (workflowData.name && workflowData.name.length > 100) {
      errors.push(new ValidationError('Workflow name cannot exceed 100 characters', 'name', 'TOO_LONG'))
    }

    if (workflowData.description && workflowData.description.length > 500) {
      errors.push(new ValidationError('Workflow description cannot exceed 500 characters', 'description', 'TOO_LONG'))
    }

    // Validate workflow steps
    if (workflowData.stepsJson) {
      try {
        const steps = typeof workflowData.stepsJson === 'string' 
          ? JSON.parse(workflowData.stepsJson) 
          : workflowData.stepsJson

        if (!Array.isArray(steps) || steps.length === 0) {
          errors.push(new ValidationError('Workflow must have at least one step', 'stepsJson', 'EMPTY_STEPS'))
        }

        // Validate each step
        steps.forEach((step, index) => {
          if (!step.type) {
            errors.push(new ValidationError(`Step ${index + 1} must have a type`, `steps[${index}].type`, 'MISSING_TYPE'))
          }

          if (!['trigger', 'action', 'condition'].includes(step.type)) {
            errors.push(new ValidationError(`Step ${index + 1} has invalid type`, `steps[${index}].type`, 'INVALID_TYPE'))
          }

          if (!step.platform) {
            errors.push(new ValidationError(`Step ${index + 1} must specify a platform`, `steps[${index}].platform`, 'MISSING_PLATFORM'))
          }
        })

        // Ensure workflow has at least one trigger
        const hasTrigger = steps.some(step => step.type === 'trigger')
        if (!hasTrigger) {
          errors.push(new ValidationError('Workflow must have at least one trigger', 'stepsJson', 'MISSING_TRIGGER'))
        }

        // Ensure workflow has at least one action
        const hasAction = steps.some(step => step.type === 'action')
        if (!hasAction) {
          errors.push(new ValidationError('Workflow must have at least one action', 'stepsJson', 'MISSING_ACTION'))
        }

      } catch (parseError) {
        errors.push(new ValidationError('Invalid workflow steps format', 'stepsJson', 'INVALID_JSON'))
      }
    }

    if (errors.length > 0) {
      const error = new ValidationError('Workflow validation failed', null, 'VALIDATION_FAILED')
      error.errors = errors
      throw error
    }

    return true
  }

  // Integration validation
  static validateIntegration(integrationData) {
    const errors = []

    if (!integrationData.platformName || integrationData.platformName.trim().length < 2) {
      errors.push(new ValidationError('Platform name is required', 'platformName', 'REQUIRED'))
    }

    const supportedPlatforms = ['Google Sheets', 'Slack', 'Zapier', 'Microsoft Teams', 'Airtable']
    if (integrationData.platformName && !supportedPlatforms.includes(integrationData.platformName)) {
      errors.push(new ValidationError('Unsupported platform', 'platformName', 'UNSUPPORTED_PLATFORM'))
    }

    // Validate platform-specific requirements
    if (integrationData.platformName === 'Google Sheets') {
      if (!integrationData.config?.spreadsheetId) {
        errors.push(new ValidationError('Google Sheets integration requires spreadsheet ID', 'config.spreadsheetId', 'REQUIRED'))
      }
    }

    if (integrationData.platformName === 'Slack') {
      if (!integrationData.config?.workspaceId) {
        errors.push(new ValidationError('Slack integration requires workspace ID', 'config.workspaceId', 'REQUIRED'))
      }
    }

    if (integrationData.platformName === 'Zapier') {
      if (!integrationData.apiKey) {
        errors.push(new ValidationError('Zapier integration requires API key', 'apiKey', 'REQUIRED'))
      }
    }

    if (errors.length > 0) {
      const error = new ValidationError('Integration validation failed', null, 'VALIDATION_FAILED')
      error.errors = errors
      throw error
    }

    return true
  }

  // Custom field validation
  static validateCustomField(fieldData) {
    const errors = []

    if (!fieldData.fieldName || fieldData.fieldName.trim().length < 2) {
      errors.push(new ValidationError('Field name must be at least 2 characters long', 'fieldName', 'TOO_SHORT'))
    }

    if (fieldData.fieldName && fieldData.fieldName.length > 50) {
      errors.push(new ValidationError('Field name cannot exceed 50 characters', 'fieldName', 'TOO_LONG'))
    }

    // Validate field name format (no special characters except underscore)
    if (fieldData.fieldName && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(fieldData.fieldName)) {
      errors.push(new ValidationError('Field name can only contain letters, numbers, and underscores, and must start with a letter', 'fieldName', 'INVALID_FORMAT'))
    }

    const validFieldTypes = ['text', 'number', 'email', 'phone', 'date', 'datetime', 'boolean', 'dropdown', 'multiselect', 'textarea']
    if (!fieldData.fieldType || !validFieldTypes.includes(fieldData.fieldType)) {
      errors.push(new ValidationError('Invalid field type', 'fieldType', 'INVALID_TYPE'))
    }

    const validEntityTypes = ['contact', 'deal', 'company', 'task']
    if (!fieldData.entityType || !validEntityTypes.includes(fieldData.entityType)) {
      errors.push(new ValidationError('Invalid entity type', 'entityType', 'INVALID_TYPE'))
    }

    // Validate dropdown options
    if (fieldData.fieldType === 'dropdown' || fieldData.fieldType === 'multiselect') {
      if (!fieldData.options || !Array.isArray(fieldData.options) || fieldData.options.length === 0) {
        errors.push(new ValidationError('Dropdown and multiselect fields must have at least one option', 'options', 'REQUIRED'))
      }

      if (fieldData.options) {
        fieldData.options.forEach((option, index) => {
          if (!option || typeof option !== 'string' || option.trim().length === 0) {
            errors.push(new ValidationError(`Option ${index + 1} cannot be empty`, `options[${index}]`, 'EMPTY_OPTION'))
          }
        })
      }
    }

    if (errors.length > 0) {
      const error = new ValidationError('Custom field validation failed', null, 'VALIDATION_FAILED')
      error.errors = errors
      throw error
    }

    return true
  }

  // CRM record validation
  static validateCRMRecord(recordData, customFields = []) {
    const errors = []

    // Validate required standard fields
    if (!recordData.data) {
      errors.push(new ValidationError('Record data is required', 'data', 'REQUIRED'))
      return false
    }

    // Validate email if present
    if (recordData.data.email) {
      try {
        this.validateEmail(recordData.data.email)
      } catch (error) {
        errors.push(new ValidationError('Invalid email in record data', 'data.email', 'INVALID_FORMAT'))
      }
    }

    // Validate phone number format if present
    if (recordData.data.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
      if (!phoneRegex.test(recordData.data.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push(new ValidationError('Invalid phone number format', 'data.phone', 'INVALID_FORMAT'))
      }
    }

    // Validate custom fields
    customFields.forEach(field => {
      const value = recordData.data[field.fieldName]
      
      if (field.required && (!value || value.toString().trim().length === 0)) {
        errors.push(new ValidationError(`${field.fieldName} is required`, `data.${field.fieldName}`, 'REQUIRED'))
      }

      if (value) {
        switch (field.fieldType) {
          case 'email':
            try {
              this.validateEmail(value)
            } catch (error) {
              errors.push(new ValidationError(`Invalid email format for ${field.fieldName}`, `data.${field.fieldName}`, 'INVALID_FORMAT'))
            }
            break
          
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(new ValidationError(`${field.fieldName} must be a number`, `data.${field.fieldName}`, 'INVALID_TYPE'))
            }
            break
          
          case 'date':
            if (isNaN(Date.parse(value))) {
              errors.push(new ValidationError(`${field.fieldName} must be a valid date`, `data.${field.fieldName}`, 'INVALID_FORMAT'))
            }
            break
          
          case 'boolean':
            if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
              errors.push(new ValidationError(`${field.fieldName} must be true or false`, `data.${field.fieldName}`, 'INVALID_TYPE'))
            }
            break
          
          case 'dropdown':
            if (field.options && !field.options.includes(value)) {
              errors.push(new ValidationError(`${field.fieldName} must be one of: ${field.options.join(', ')}`, `data.${field.fieldName}`, 'INVALID_OPTION'))
            }
            break
          
          case 'multiselect':
            if (Array.isArray(value)) {
              value.forEach(item => {
                if (field.options && !field.options.includes(item)) {
                  errors.push(new ValidationError(`Invalid option "${item}" for ${field.fieldName}`, `data.${field.fieldName}`, 'INVALID_OPTION'))
                }
              })
            } else {
              errors.push(new ValidationError(`${field.fieldName} must be an array`, `data.${field.fieldName}`, 'INVALID_TYPE'))
            }
            break
        }
      }
    })

    if (errors.length > 0) {
      const error = new ValidationError('CRM record validation failed', null, 'VALIDATION_FAILED')
      error.errors = errors
      throw error
    }

    return true
  }

  // Subscription plan validation
  static validateSubscriptionPlan(planId) {
    const validPlans = ['free', 'pro', 'business']
    if (!validPlans.includes(planId)) {
      throw new ValidationError('Invalid subscription plan', 'planId', 'INVALID_PLAN')
    }
    return true
  }

  // API key validation
  static validateAPIKey(apiKey, platform) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new ValidationError('API key is required', 'apiKey', 'REQUIRED')
    }

    // Platform-specific API key validation
    switch (platform) {
      case 'Zapier':
        if (apiKey.length < 32) {
          throw new ValidationError('Zapier API key appears to be invalid', 'apiKey', 'INVALID_FORMAT')
        }
        break
      
      case 'Google Sheets':
        // Google API keys typically start with 'AIza'
        if (!apiKey.startsWith('AIza') && !apiKey.includes('oauth')) {
          throw new ValidationError('Google API key appears to be invalid', 'apiKey', 'INVALID_FORMAT')
        }
        break
    }

    return true
  }

  // Bulk validation helper
  static validateBulk(items, validationFunction) {
    const results = []
    const errors = []

    items.forEach((item, index) => {
      try {
        validationFunction(item)
        results.push({ index, valid: true, item })
      } catch (error) {
        results.push({ index, valid: false, item, error })
        errors.push({ index, error })
      }
    })

    return {
      results,
      errors,
      isValid: errors.length === 0,
      validCount: results.filter(r => r.valid).length,
      errorCount: errors.length
    }
  }
}

export default ValidationService
export { ValidationError }
