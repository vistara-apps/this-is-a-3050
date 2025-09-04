/**
 * Workflow Execution Engine for FlowLink CRM
 * Handles workflow execution, step processing, and integration orchestration
 */

import apiService from './api'
import ValidationService from './validation'

class WorkflowExecutionError extends Error {
  constructor(message, step = null, originalError = null) {
    super(message)
    this.name = 'WorkflowExecutionError'
    this.step = step
    this.originalError = originalError
  }
}

class WorkflowEngine {
  constructor() {
    this.executionHistory = new Map()
    this.activeExecutions = new Map()
  }

  /**
   * Execute a workflow with given input data
   */
  async executeWorkflow(workflow, inputData = {}, context = {}) {
    const executionId = this.generateExecutionId()
    const execution = {
      id: executionId,
      workflowId: workflow.workflowId,
      status: 'running',
      startTime: new Date(),
      steps: [],
      inputData,
      context,
      currentStepIndex: 0
    }

    this.activeExecutions.set(executionId, execution)

    try {
      // Validate workflow before execution
      ValidationService.validateWorkflow(workflow)

      const steps = typeof workflow.stepsJson === 'string' 
        ? JSON.parse(workflow.stepsJson) 
        : workflow.stepsJson

      execution.totalSteps = steps.length

      // Execute each step in sequence
      for (let i = 0; i < steps.length; i++) {
        execution.currentStepIndex = i
        const step = steps[i]
        
        const stepExecution = await this.executeStep(step, execution)
        execution.steps.push(stepExecution)

        // Check if step failed and workflow should stop
        if (stepExecution.status === 'failed' && !step.continueOnError) {
          execution.status = 'failed'
          execution.error = stepExecution.error
          break
        }

        // Check for conditional logic
        if (step.type === 'condition' && !stepExecution.result) {
          // Skip remaining steps if condition is false
          execution.status = 'completed_conditional'
          break
        }
      }

      if (execution.status === 'running') {
        execution.status = 'completed'
      }

    } catch (error) {
      execution.status = 'failed'
      execution.error = error.message
      console.error('Workflow execution failed:', error)
    } finally {
      execution.endTime = new Date()
      execution.duration = execution.endTime - execution.startTime
      
      // Move to history and clean up active executions
      this.executionHistory.set(executionId, execution)
      this.activeExecutions.delete(executionId)

      // Store execution in backend if available
      try {
        await apiService.request('/workflow-executions', {
          method: 'POST',
          body: {
            workflowId: workflow.workflowId,
            executionId,
            status: execution.status,
            duration: execution.duration,
            steps: execution.steps.length,
            inputData: execution.inputData,
            error: execution.error
          }
        })
      } catch (apiError) {
        console.warn('Failed to store execution history:', apiError)
      }
    }

    return execution
  }

  /**
   * Execute a single workflow step
   */
  async executeStep(step, execution) {
    const stepExecution = {
      stepId: step.id || `step_${execution.currentStepIndex}`,
      type: step.type,
      platform: step.platform,
      status: 'running',
      startTime: new Date(),
      input: step.config || {},
      output: null,
      error: null
    }

    try {
      switch (step.type) {
        case 'trigger':
          stepExecution.output = await this.executeTrigger(step, execution)
          break
        
        case 'action':
          stepExecution.output = await this.executeAction(step, execution)
          break
        
        case 'condition':
          stepExecution.result = await this.executeCondition(step, execution)
          stepExecution.output = { conditionMet: stepExecution.result }
          break
        
        case 'delay':
          await this.executeDelay(step, execution)
          stepExecution.output = { delayCompleted: true }
          break
        
        default:
          throw new WorkflowExecutionError(`Unknown step type: ${step.type}`, step)
      }

      stepExecution.status = 'completed'

    } catch (error) {
      stepExecution.status = 'failed'
      stepExecution.error = error.message
      console.error(`Step execution failed:`, error)
    } finally {
      stepExecution.endTime = new Date()
      stepExecution.duration = stepExecution.endTime - stepExecution.startTime
    }

    return stepExecution
  }

  /**
   * Execute trigger step (usually validation or data retrieval)
   */
  async executeTrigger(step, execution) {
    switch (step.platform) {
      case 'CRM':
        return this.executeCRMTrigger(step, execution)
      
      case 'Google Sheets':
        return this.executeGoogleSheetsTrigger(step, execution)
      
      case 'Slack':
        return this.executeSlackTrigger(step, execution)
      
      case 'Webhook':
        return this.executeWebhookTrigger(step, execution)
      
      default:
        throw new WorkflowExecutionError(`Unsupported trigger platform: ${step.platform}`, step)
    }
  }

  /**
   * Execute action step
   */
  async executeAction(step, execution) {
    switch (step.platform) {
      case 'CRM':
        return this.executeCRMAction(step, execution)
      
      case 'Google Sheets':
        return this.executeGoogleSheetsAction(step, execution)
      
      case 'Slack':
        return this.executeSlackAction(step, execution)
      
      case 'Email':
        return this.executeEmailAction(step, execution)
      
      case 'Zapier':
        return this.executeZapierAction(step, execution)
      
      default:
        throw new WorkflowExecutionError(`Unsupported action platform: ${step.platform}`, step)
    }
  }

  /**
   * Execute condition step
   */
  async executeCondition(step, execution) {
    const { field, operator, value } = step.config
    const contextValue = this.getContextValue(field, execution)

    switch (operator) {
      case 'equals':
        return contextValue === value
      
      case 'not_equals':
        return contextValue !== value
      
      case 'contains':
        return String(contextValue).includes(value)
      
      case 'greater_than':
        return Number(contextValue) > Number(value)
      
      case 'less_than':
        return Number(contextValue) < Number(value)
      
      case 'is_empty':
        return !contextValue || contextValue === ''
      
      case 'is_not_empty':
        return contextValue && contextValue !== ''
      
      default:
        throw new WorkflowExecutionError(`Unsupported condition operator: ${operator}`, step)
    }
  }

  /**
   * Execute delay step
   */
  async executeDelay(step, execution) {
    const delayMs = step.config.delay || 1000
    return new Promise(resolve => setTimeout(resolve, delayMs))
  }

  // Platform-specific trigger implementations
  async executeCRMTrigger(step, execution) {
    switch (step.event) {
      case 'new_record':
        // Check for new CRM records
        const records = await apiService.getCRMRecords({
          created_after: execution.context.lastCheck || execution.startTime
        })
        return { newRecords: records.length, records }
      
      case 'updated_record':
        // Check for updated CRM records
        const updatedRecords = await apiService.getCRMRecords({
          updated_after: execution.context.lastCheck || execution.startTime
        })
        return { updatedRecords: updatedRecords.length, records: updatedRecords }
      
      default:
        throw new WorkflowExecutionError(`Unsupported CRM trigger event: ${step.event}`, step)
    }
  }

  async executeGoogleSheetsTrigger(step, execution) {
    const { integrationId, spreadsheetId, range } = step.config
    
    try {
      const data = await apiService.getGoogleSheetsData(integrationId, spreadsheetId, range)
      return { rowCount: data.values?.length || 0, data: data.values }
    } catch (error) {
      throw new WorkflowExecutionError(`Google Sheets trigger failed: ${error.message}`, step, error)
    }
  }

  async executeSlackTrigger(step, execution) {
    // Slack triggers are typically webhook-based
    // This would be handled by the webhook trigger
    return { message: 'Slack trigger executed' }
  }

  async executeWebhookTrigger(step, execution) {
    // Webhook triggers are handled externally
    // This step validates the webhook data
    const webhookData = execution.inputData.webhook || {}
    return { webhookReceived: true, data: webhookData }
  }

  // Platform-specific action implementations
  async executeCRMAction(step, execution) {
    switch (step.action) {
      case 'create_record':
        const recordData = this.buildRecordData(step.config, execution)
        const newRecord = await apiService.createCRMRecord(recordData)
        return { recordId: newRecord.recordId, record: newRecord }
      
      case 'update_record':
        const updateData = this.buildRecordData(step.config, execution)
        const recordId = this.getContextValue(step.config.recordId, execution)
        const updatedRecord = await apiService.updateCRMRecord(recordId, updateData)
        return { recordId, record: updatedRecord }
      
      default:
        throw new WorkflowExecutionError(`Unsupported CRM action: ${step.action}`, step)
    }
  }

  async executeGoogleSheetsAction(step, execution) {
    const { integrationId, spreadsheetId, range, action } = step.config
    
    switch (action) {
      case 'append_row':
        const values = this.buildSheetValues(step.config.values, execution)
        await apiService.updateGoogleSheetsData(integrationId, spreadsheetId, range, [values])
        return { rowsAdded: 1, values }
      
      case 'update_range':
        const updateValues = this.buildSheetValues(step.config.values, execution)
        await apiService.updateGoogleSheetsData(integrationId, spreadsheetId, range, updateValues)
        return { rowsUpdated: updateValues.length, values: updateValues }
      
      default:
        throw new WorkflowExecutionError(`Unsupported Google Sheets action: ${action}`, step)
    }
  }

  async executeSlackAction(step, execution) {
    const { integrationId, channel, action } = step.config
    
    switch (action) {
      case 'send_message':
        const message = this.buildMessage(step.config.message, execution)
        await apiService.sendSlackMessage(integrationId, channel, message)
        return { messageSent: true, channel, message }
      
      default:
        throw new WorkflowExecutionError(`Unsupported Slack action: ${action}`, step)
    }
  }

  async executeEmailAction(step, execution) {
    const { to, subject, body } = step.config
    const emailData = {
      to: this.interpolateString(to, execution),
      subject: this.interpolateString(subject, execution),
      body: this.interpolateString(body, execution)
    }
    
    // This would integrate with an email service
    console.log('Email would be sent:', emailData)
    return { emailSent: true, ...emailData }
  }

  async executeZapierAction(step, execution) {
    const { integrationId, webhookUrl } = step.config
    const data = this.buildZapierData(step.config.data, execution)
    
    await apiService.triggerZapierWebhook(integrationId, webhookUrl, data)
    return { webhookTriggered: true, data }
  }

  // Helper methods
  generateExecutionId() {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getContextValue(path, execution) {
    // Support dot notation for nested values
    const keys = path.split('.')
    let value = execution.context
    
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key]
      } else {
        return undefined
      }
    }
    
    return value
  }

  interpolateString(template, execution) {
    // Replace {{variable}} placeholders with context values
    return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.getContextValue(path.trim(), execution)
      return value !== undefined ? String(value) : match
    })
  }

  buildRecordData(config, execution) {
    const data = {}
    
    for (const [key, value] of Object.entries(config.fields || {})) {
      if (typeof value === 'string' && value.includes('{{')) {
        data[key] = this.interpolateString(value, execution)
      } else {
        data[key] = value
      }
    }
    
    return { data }
  }

  buildSheetValues(config, execution) {
    return config.map(value => {
      if (typeof value === 'string' && value.includes('{{')) {
        return this.interpolateString(value, execution)
      }
      return value
    })
  }

  buildMessage(template, execution) {
    return this.interpolateString(template, execution)
  }

  buildZapierData(config, execution) {
    const data = {}
    
    for (const [key, value] of Object.entries(config || {})) {
      if (typeof value === 'string' && value.includes('{{')) {
        data[key] = this.interpolateString(value, execution)
      } else {
        data[key] = value
      }
    }
    
    return data
  }

  // Public methods for monitoring and management
  getActiveExecutions() {
    return Array.from(this.activeExecutions.values())
  }

  getExecutionHistory(limit = 50) {
    const executions = Array.from(this.executionHistory.values())
    return executions
      .sort((a, b) => b.startTime - a.startTime)
      .slice(0, limit)
  }

  getExecutionById(executionId) {
    return this.activeExecutions.get(executionId) || this.executionHistory.get(executionId)
  }

  cancelExecution(executionId) {
    const execution = this.activeExecutions.get(executionId)
    if (execution) {
      execution.status = 'cancelled'
      execution.endTime = new Date()
      execution.duration = execution.endTime - execution.startTime
      
      this.executionHistory.set(executionId, execution)
      this.activeExecutions.delete(executionId)
      
      return true
    }
    return false
  }

  // Cleanup old execution history
  cleanupHistory(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days
    const cutoff = new Date(Date.now() - maxAge)
    
    for (const [id, execution] of this.executionHistory.entries()) {
      if (execution.startTime < cutoff) {
        this.executionHistory.delete(id)
      }
    }
  }
}

// Create and export singleton instance
const workflowEngine = new WorkflowEngine()
export default workflowEngine

// Export class for testing
export { WorkflowEngine, WorkflowExecutionError }
