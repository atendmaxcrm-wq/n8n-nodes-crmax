import type { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contact'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new contact',
				action: 'Create a contact',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a contact by ID',
				action: 'Get a contact',
			},
			{
				name: 'Get by Phone',
				value: 'getByPhone',
				description: 'Get a contact by phone number',
				action: 'Get a contact by phone',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple contacts',
				action: 'Get many contacts',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a contact by ID',
				action: 'Update a contact',
			},
			{
				name: 'Update by Phone',
				value: 'updateByPhone',
				description: 'Update a contact by phone number',
				action: 'Update a contact by phone',
			},
			{
				name: 'Batch Create/Update',
				value: 'batchCreateUpdate',
				description: 'Create or update multiple contacts',
				action: 'Batch create or update contacts',
			},
			{
				name: 'Update Tags',
				value: 'updateTags',
				description: 'Update contact tags',
				action: 'Update contact tags',
			},
			{
				name: 'Update Custom Fields',
				value: 'updateCustomFields',
				description: 'Update contact custom fields',
				action: 'Update contact custom fields',
			},
		],
		default: 'create',
	},
];

export const contactFields: INodeProperties[] = [
	// ----------------------------------
	//         create
	// ----------------------------------
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Phone number of the contact (required)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the contact',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the contact',
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'string',
				default: '',
				description: 'Source of the contact (e.g., website, referral)',
			},
		],
	},

	// ----------------------------------
	//         get
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the contact to retrieve',
	},

	// ----------------------------------
	//         getByPhone
	// ----------------------------------
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getByPhone'],
			},
		},
		default: '',
		description: 'Phone number of the contact to retrieve',
	},

	// ----------------------------------
	//         getMany
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getMany'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search term to filter contacts',
			},
			{
				displayName: 'Page Number',
				name: 'pageNumber',
				type: 'number',
				default: 1,
				description: 'Page number for pagination',
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 50,
				description: 'Number of results per page',
			},
		],
	},

	// ----------------------------------
	//         update
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the contact to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the contact',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the contact',
			},
		],
	},

	// ----------------------------------
	//         updateByPhone
	// ----------------------------------
	{
		displayName: 'Phone',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateByPhone'],
			},
		},
		default: '',
		description: 'Phone number of the contact to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateByPhone'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Name of the contact',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the contact',
			},
		],
	},

	// ----------------------------------
	//         batchCreateUpdate
	// ----------------------------------
	{
		displayName: 'Contacts',
		name: 'contacts',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['batchCreateUpdate'],
			},
		},
		default: '[\n  {\n    "phone": "+5511999999999",\n    "name": "John Doe",\n    "email": "john@example.com"\n  }\n]',
		description: 'JSON array of contacts to create or update. Each contact must have at least a phone number.',
	},

	// ----------------------------------
	//         updateTags
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateTags'],
			},
		},
		default: '',
		description: 'ID of the contact to update tags',
	},
	{
		displayName: 'Tags',
		name: 'tags',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateTags'],
			},
		},
		default: '[]',
		description: 'Array of tag IDs to assign to the contact',
	},

	// ----------------------------------
	//         updateCustomFields
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateCustomFields'],
			},
		},
		default: '',
		description: 'ID of the contact to update custom fields',
	},
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['updateCustomFields'],
			},
		},
		default: '{}',
		description: 'JSON object with custom field key-value pairs',
	},
];
