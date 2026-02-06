# Card Operations Quick Reference

## File Location
`/root/n8n-nodes-crmax/nodes/Crmax/CardDescription.ts`

## Exports
- `cardOperations` - Operation selector dropdown
- `cardFields` - All field definitions for each operation

## Operations Summary

| # | Operation | Value | Method | Endpoint | Required Fields |
|---|-----------|-------|--------|----------|----------------|
| 1 | **Create** | `create` | POST | `/api/organizations/{orgId}/cards` | pipelineId, stageId, title |
| 2 | **Get** | `get` | GET | `/api/cards/{cardId}` | cardId |
| 3 | **Get Many** | `getMany` | GET | `/api/cards` | pipelineId |
| 4 | **Update** | `update` | PATCH | `/api/cards/{cardId}` | cardId |
| 5 | **Archive** | `archive` | PATCH | `/api/cards/{cardId}/archive` | cardId, archive (bool) |
| 6 | **Move Stage** | `moveStage` | PATCH | `/api/cards/{cardId}` | cardId, stageId |
| 7 | **Delete** | `delete` | DELETE | `/api/cards/{cardId}` | cardId |
| 8 | **Add Note** | `addNote` | POST | `/api/cards/{cardId}/notes` | cardId, content |
| 9 | **Get Notes** | `getNotes` | GET | `/api/cards/{cardId}/notes` | cardId |

## Field Counts by Operation

- **Create**: 3 required + 9 optional in additionalFields
- **Get**: 1 required (cardId)
- **Get Many**: 1 required (pipelineId) + 6 filters + pagination controls
- **Update**: 1 required (cardId) + 9 optional in updateFields
- **Archive**: 2 required (cardId, archive)
- **Move Stage**: 2 required (cardId, stageId)
- **Delete**: 1 required (cardId)
- **Add Note**: 2 required (cardId, content)
- **Get Notes**: 1 required (cardId)

## Key Features

### Create Operation
- Supports phone auto-contact creation
- Dynamic custom fields via JSON
- Optional assignedTo (name or UUID)
- Origin tracking

### Get Many Operation
- Pagination support (pageNumber, pageSize)
- Multiple filters: stageId, assignedTo, status, textFilter
- Status options: active, archived, won, scheduled
- Text search across multiple fields

### Update Operation
- Partial updates supported
- CAPI enrichment fields (city, state, zip_code)
- Email updates both card and contact
- Stage movement with history tracking

### Archive Operation
- Bidirectional (archive/unarchive)
- Cards remain in reports when archived
- Auto-archive when moved to archived_stage_ids

### Notes Operations
- Add individual notes with timestamps
- Retrieve all notes with author info
- Useful for interaction tracking

## Integration Notes

1. **Authentication**: All operations require Bearer token from credentials
2. **Organization Context**: Create operation uses organizationId from credentials
3. **Error Handling**: Implement proper error responses for 400, 401, 404
4. **Pagination**: Default limit is 50, max is 100
5. **Date Format**: Use YYYY-MM-DD for scheduledDate
6. **Phone Format**: International format without symbols (5511999999999)

## Total Lines of Code: 571

## Status: Complete ✓

All 9 card operations fully implemented with comprehensive field definitions.
