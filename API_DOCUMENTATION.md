# FlowLink CRM API Documentation

## Overview

FlowLink CRM provides a comprehensive RESTful API that enables developers to build custom integrations, automate workflows, and extend the platform's capabilities. This API-first architecture ensures that all functionality available in the web interface is also accessible programmatically.

## Base URL

```
https://api.flowlinkcrm.com/v1
```

## Authentication

All API requests require authentication using Bearer tokens. Include your API token in the Authorization header:

```
Authorization: Bearer YOUR_API_TOKEN
```

### Getting an API Token

1. Log in to your FlowLink CRM account
2. Navigate to Settings > API Keys
3. Click "Generate New API Key"
4. Copy and securely store your token

## Rate Limiting

- **Free Plan**: 100 requests per hour
- **Pro Plan**: 1,000 requests per hour  
- **Business Plan**: 10,000 requests per hour

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets

## Error Handling

The API uses conventional HTTP response codes and returns JSON error objects:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid workflow configuration",
    "details": {
      "field": "stepsJson",
      "reason": "Workflow must have at least one trigger"
    }
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `429` - Rate Limited
- `500` - Internal Server Error

## Endpoints

### Authentication

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "user": {
    "userId": "user_123",
    "email": "user@example.com",
    "subscriptionPlan": "pro"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### POST /auth/logout
Invalidate the current access token.

### Users

#### GET /users/me
Get current user information.

**Response:**
```json
{
  "userId": "user_123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "subscriptionPlan": "pro",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### PUT /users/me
Update current user information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith"
}
```

### Workflows

#### GET /workflows
List all workflows for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `status` (optional): Filter by status (`enabled`, `disabled`)

**Response:**
```json
{
  "workflows": [
    {
      "workflowId": "wf_123",
      "name": "New Lead Notification",
      "description": "Send Slack notification when new lead is added",
      "isEnabled": true,
      "stepsJson": "[{\"type\":\"trigger\",\"platform\":\"CRM\",\"event\":\"new_record\"}]",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

#### POST /workflows
Create a new workflow.

**Request Body:**
```json
{
  "name": "New Lead Notification",
  "description": "Send Slack notification when new lead is added",
  "stepsJson": [
    {
      "type": "trigger",
      "platform": "CRM",
      "event": "new_record"
    },
    {
      "type": "action",
      "platform": "Slack",
      "action": "send_message",
      "config": {
        "channel": "#leads",
        "message": "New lead: {{name}} from {{company}}"
      }
    }
  ],
  "isEnabled": false
}
```

#### GET /workflows/{workflowId}
Get a specific workflow.

#### PUT /workflows/{workflowId}
Update a workflow.

#### DELETE /workflows/{workflowId}
Delete a workflow.

#### POST /workflows/{workflowId}/execute
Execute a workflow manually.

**Request Body:**
```json
{
  "inputData": {
    "name": "John Doe",
    "company": "Acme Corp"
  }
}
```

**Response:**
```json
{
  "executionId": "exec_456",
  "status": "completed",
  "startTime": "2024-01-15T10:30:00Z",
  "endTime": "2024-01-15T10:30:05Z",
  "duration": 5000,
  "steps": [
    {
      "stepId": "step_1",
      "type": "trigger",
      "status": "completed",
      "duration": 100
    },
    {
      "stepId": "step_2", 
      "type": "action",
      "status": "completed",
      "duration": 4900
    }
  ]
}
```

#### GET /workflows/{workflowId}/executions
Get execution history for a workflow.

### Integrations

#### GET /integrations
List all integrations.

**Response:**
```json
{
  "integrations": [
    {
      "integrationId": "int_123",
      "platformName": "Google Sheets",
      "status": "connected",
      "config": {
        "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
      },
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /integrations
Create a new integration.

**Request Body:**
```json
{
  "platformName": "Google Sheets",
  "config": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "authToken": "ya29.a0AfH6SMC..."
  }
}
```

#### PUT /integrations/{integrationId}
Update an integration.

#### DELETE /integrations/{integrationId}
Delete an integration.

#### POST /integrations/{integrationId}/test
Test an integration connection.

### CRM Records

#### GET /crm-records
List CRM records.

**Query Parameters:**
- `limit` (optional): Number of results (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `search` (optional): Search term for name, email, or company
- `created_after` (optional): ISO 8601 timestamp
- `updated_after` (optional): ISO 8601 timestamp

**Response:**
```json
{
  "records": [
    {
      "recordId": "rec_123",
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Acme Corp",
        "leadSource": "Website"
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

#### POST /crm-records
Create a new CRM record.

**Request Body:**
```json
{
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "company": "Tech Corp",
    "leadSource": "Social Media"
  }
}
```

#### GET /crm-records/{recordId}
Get a specific CRM record.

#### PUT /crm-records/{recordId}
Update a CRM record.

#### DELETE /crm-records/{recordId}
Delete a CRM record.

#### POST /crm-records/bulk-import
Import multiple CRM records.

**Request Body:**
```json
{
  "records": [
    {
      "data": {
        "name": "John Doe",
        "email": "john@example.com",
        "company": "Acme Corp"
      }
    },
    {
      "data": {
        "name": "Jane Smith", 
        "email": "jane@example.com",
        "company": "Tech Corp"
      }
    }
  ]
}
```

### Custom Fields

#### GET /custom-fields
List custom fields.

**Response:**
```json
{
  "fields": [
    {
      "fieldId": "field_123",
      "fieldName": "leadSource",
      "fieldType": "dropdown",
      "entityType": "contact",
      "options": ["Website", "Social Media", "Referral"],
      "required": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### POST /custom-fields
Create a custom field.

**Request Body:**
```json
{
  "fieldName": "leadSource",
  "fieldType": "dropdown",
  "entityType": "contact",
  "options": ["Website", "Social Media", "Referral"],
  "required": false
}
```

#### PUT /custom-fields/{fieldId}
Update a custom field.

#### DELETE /custom-fields/{fieldId}
Delete a custom field.

### External Integrations

#### POST /integrations/google-sheets/connect
Connect Google Sheets integration.

**Request Body:**
```json
{
  "authCode": "4/0AX4XfWi..."
}
```

#### POST /integrations/slack/connect
Connect Slack integration.

**Request Body:**
```json
{
  "authCode": "xoxp-..."
}
```

#### POST /integrations/zapier/connect
Connect Zapier integration.

**Request Body:**
```json
{
  "apiKey": "sk_live_..."
}
```

#### POST /integrations/google-sheets/{integrationId}/data
Get data from Google Sheets.

**Request Body:**
```json
{
  "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "range": "Sheet1!A1:D10"
}
```

#### POST /integrations/slack/{integrationId}/message
Send Slack message.

**Request Body:**
```json
{
  "channel": "#general",
  "message": "Hello from FlowLink CRM!"
}
```

### Analytics

#### GET /analytics
Get analytics data.

**Query Parameters:**
- `start_date` (optional): ISO 8601 date (default: 30 days ago)
- `end_date` (optional): ISO 8601 date (default: today)

**Response:**
```json
{
  "totalWorkflows": 5,
  "activeWorkflows": 3,
  "totalExecutions": 150,
  "successfulExecutions": 142,
  "failedExecutions": 8,
  "successRate": 94.67,
  "executionsByDay": [
    {
      "date": "2024-01-15",
      "executions": 12,
      "successful": 11,
      "failed": 1
    }
  ]
}
```

## Webhooks

FlowLink CRM can send webhooks to notify your application of events.

### Webhook Events

- `workflow.executed` - Workflow execution completed
- `crm_record.created` - New CRM record created
- `crm_record.updated` - CRM record updated
- `integration.connected` - New integration connected
- `integration.disconnected` - Integration disconnected

### Webhook Payload

```json
{
  "event": "workflow.executed",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "workflowId": "wf_123",
    "executionId": "exec_456",
    "status": "completed",
    "duration": 5000
  }
}
```

### Webhook Security

Webhooks are signed using HMAC-SHA256. Verify the signature using the `X-FlowLink-Signature` header:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## SDKs and Libraries

### JavaScript/Node.js

```bash
npm install @flowlink/crm-sdk
```

```javascript
const FlowLink = require('@flowlink/crm-sdk');

const client = new FlowLink({
  apiKey: 'your-api-key'
});

// Create a workflow
const workflow = await client.workflows.create({
  name: 'New Lead Notification',
  stepsJson: [
    { type: 'trigger', platform: 'CRM', event: 'new_record' },
    { type: 'action', platform: 'Slack', action: 'send_message' }
  ]
});
```

### Python

```bash
pip install flowlink-crm
```

```python
from flowlink import FlowLinkClient

client = FlowLinkClient(api_key='your-api-key')

# Create a CRM record
record = client.crm_records.create({
    'data': {
        'name': 'John Doe',
        'email': 'john@example.com',
        'company': 'Acme Corp'
    }
})
```

## Support

- **Documentation**: https://docs.flowlinkcrm.com
- **API Status**: https://status.flowlinkcrm.com
- **Support Email**: api-support@flowlinkcrm.com
- **Community Forum**: https://community.flowlinkcrm.com

## Changelog

### v1.2.0 (2024-01-15)
- Added bulk import endpoint for CRM records
- Enhanced webhook security with HMAC signatures
- Improved error messages and validation

### v1.1.0 (2024-01-01)
- Added custom fields API
- Introduced workflow execution history
- Added analytics endpoints

### v1.0.0 (2023-12-01)
- Initial API release
- Core workflow, integration, and CRM functionality
