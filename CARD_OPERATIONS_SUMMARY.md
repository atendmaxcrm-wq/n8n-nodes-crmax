# Card Operations - CRMax n8n Node

This document outlines the card operations implemented in `/root/n8n-nodes-crmax/nodes/Crmax/CardDescription.ts`

## Operations Overview

### 1. Create Card
- **Operation**: `create`
- **Method**: POST
- **Endpoint**: `/api/organizations/{{organizationId}}/cards`
- **Required Fields**:
  - `pipelineId` (UUID)
  - `stageId` (UUID)
  - `title` (string)
- **Optional Fields**:
  - `phone` (string)
  - `email` (string)
  - `origin` (string)
  - `value` (number)
  - `scheduledDate` (date, YYYY-MM-DD)
  - `assignedTo` (string - UUID or name)
  - `notes` (string)
  - `contactId` (UUID)
  - `dynamicFields` (JSON object)

### 2. Get Card
- **Operation**: `get`
- **Method**: GET
- **Endpoint**: `/api/cards/{{cardId}}`
- **Required Fields**:
  - `cardId` (UUID)

### 3. Get Many Cards
- **Operation**: `getMany`
- **Method**: GET
- **Endpoint**: `/api/cards`
- **Required Fields**:
  - `pipelineId` (UUID)
- **Query Parameters**:
  - `stageId` (optional, UUID)
  - `assignedTo` (optional, UUID)
  - `status` (optional: active, archived, won, scheduled)
  - `textFilter` (optional, string)
  - `pageNumber` (optional, default: 1)
  - `pageSize` (optional, default: 50)

### 4. Update Card
- **Operation**: `update`
- **Method**: PATCH
- **Endpoint**: `/api/cards/{{cardId}}`
- **Required Fields**:
  - `cardId` (UUID)
- **Optional Fields**:
  - `stageId` (UUID)
  - `title` (string)
  - `value` (number)
  - `notes` (string)
  - `assignedTo` (UUID)
  - `email` (string)
  - `city` (string)
  - `state` (string)
  - `zip_code` (string)

### 5. Archive Card
- **Operation**: `archive`
- **Method**: PATCH
- **Endpoint**: `/api/cards/{{cardId}}/archive`
- **Required Fields**:
  - `cardId` (UUID)
  - `archive` (boolean - true to archive, false to unarchive)

### 6. Move Stage
- **Operation**: `moveStage`
- **Method**: PATCH
- **Endpoint**: `/api/cards/{{cardId}}`
- **Required Fields**:
  - `cardId` (UUID)
  - `stageId` (UUID)
- **Note**: This is a convenience operation that updates only the stageId

### 7. Delete Card
- **Operation**: `delete`
- **Method**: DELETE
- **Endpoint**: `/api/cards/{{cardId}}`
- **Required Fields**:
  - `cardId` (UUID)
- **Warning**: Permanent deletion - irreversible

### 8. Add Note
- **Operation**: `addNote`
- **Method**: POST
- **Endpoint**: `/api/cards/{{cardId}}/notes`
- **Required Fields**:
  - `cardId` (UUID)
  - `content` (string)

### 9. Get Notes
- **Operation**: `getNotes`
- **Method**: GET
- **Endpoint**: `/api/cards/{{cardId}}/notes`
- **Required Fields**:
  - `cardId` (UUID)

## Routing Configuration

The routing should be implemented in the main node file with:

```typescript
// Base URL from credentials
baseURL: credentials.baseUrl

// Organization ID from credentials (for create operation)
organizationId: credentials.organizationId

// Example routing for create:
url: `${credentials.baseUrl}/api/organizations/${credentials.organizationId}/cards`

// Example routing for get/update/delete:
url: `${credentials.baseUrl}/api/cards/${cardId}`

// Example routing for archive:
url: `${credentials.baseUrl}/api/cards/${cardId}/archive`

// Example routing for notes:
url: `${credentials.baseUrl}/api/cards/${cardId}/notes`
```

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer {{apiToken}}
```

The token should be retrieved from the CRMax API credentials.

## Response Formats

### Create/Get/Update Card Response
```json
{
  "id": "uuid",
  "title": "string",
  "stageId": "uuid",
  "pipelineId": "uuid",
  "contactId": "uuid",
  "value": number,
  "status": "active|archived",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "assignedTo": "uuid",
  "notes": "string"
}
```

### Get Many Cards Response
```json
{
  "data": [/* array of cards */],
  "pagination": {
    "page": number,
    "pageSize": number,
    "total": number
  }
}
```

### Note Response
```json
{
  "id": "uuid",
  "content": "string",
  "created_by": "uuid",
  "created_at": "timestamp",
  "user_name": "string"
}
```

## Implementation Notes

1. **Dynamic Fields**: Custom fields should be sent as a JSON object in the `dynamicFields` property
2. **Phone Format**: Use international format without symbols (e.g., "5511999999999")
3. **Date Format**: Use ISO 8601 format (YYYY-MM-DD) for scheduledDate
4. **Pagination**: Default page size is 50, maximum is 100
5. **Archive Behavior**: Archived cards don't appear in Kanban but still count in reports
6. **Stage Movement**: Moving to archived_stage_ids automatically archives the card
7. **Commissions**: Card stage changes may trigger commission calculations

## Next Steps

1. Implement the routing logic in the main Crmax.node.ts file
2. Add the card resource to the resource selector
3. Implement request/response handlers for each operation
4. Add error handling for API responses
5. Test all operations with real API endpoints
