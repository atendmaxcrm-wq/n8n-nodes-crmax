import type { INodeProperties } from 'n8n-workflow';

export const sessionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['session'],
			},
		},
		options: [
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get multiple sessions',
				action: 'Get many sessions',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a session by ID or number',
				action: 'Get a session',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a session',
				action: 'Update a session',
			},
			{
				name: 'Get Messages',
				value: 'getMessages',
				description: 'Get all messages from a session',
				action: 'Get session messages',
			},
			{
				name: 'Send Text Message',
				value: 'sendText',
				description: 'Send a text message to a session',
				action: 'Send text message to session',
			},
			{
				name: 'Close',
				value: 'close',
				description: 'Close a session',
				action: 'Close a session',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer a session to another department or user',
				action: 'Transfer a session',
			},
		],
		default: 'getAll',
	},
];

export const sessionFields: INodeProperties[] = [
	// ----------------------------------
	//         session:getAll
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['getAll'],
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
				resource: ['session'],
				operation: ['getAll'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
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
				resource: ['session'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: '',
				description: 'Filter sessions by status',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				description: 'Filter sessions by contact ID',
			},
			{
				displayName: 'Channel ID',
				name: 'channelId',
				type: 'string',
				default: '',
				description: 'Filter sessions by channel ID',
			},
		],
	},

	// ----------------------------------
	//         session:get
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format, e.g., 2026020600001)',
	},

	// ----------------------------------
	//         session:update
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format)',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Open',
						value: 'open',
					},
					{
						name: 'Closed',
						value: 'closed',
					},
				],
				default: 'open',
				description: 'Session status',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'Low',
						value: 'low',
					},
					{
						name: 'Normal',
						value: 'normal',
					},
					{
						name: 'High',
						value: 'high',
					},
					{
						name: 'Urgent',
						value: 'urgent',
					},
				],
				default: 'normal',
				description: 'Session priority',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				description: 'Session subject or title',
			},
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
				description: 'Assign session to a department',
			},
			{
				displayName: 'Assigned To (User ID)',
				name: 'assignedTo',
				type: 'string',
				default: '',
				description: 'Assign session to a specific user',
			},
		],
	},

	// ----------------------------------
	//         session:getMessages
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['getMessages'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format)',
	},

	// ----------------------------------
	//         session:sendText
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['sendText'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format)',
	},
	{
		displayName: 'Text',
		name: 'text',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['sendText'],
			},
		},
		default: '',
		typeOptions: {
			rows: 4,
		},
		description: 'The text message to send',
	},

	// ----------------------------------
	//         session:close
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['close'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format)',
	},

	// ----------------------------------
	//         session:transfer
	// ----------------------------------
	{
		displayName: 'Session ID or Number',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['transfer'],
			},
		},
		default: '',
		description: 'The session ID (UUID) or session number (YYYYMMDDNNNNN format)',
	},
	{
		displayName: 'Transfer To',
		name: 'transferTo',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['session'],
				operation: ['transfer'],
			},
		},
		options: [
			{
				displayName: 'Department ID',
				name: 'departmentId',
				type: 'string',
				default: '',
				description: 'Transfer session to a department',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Transfer session to a specific user',
			},
		],
	},
];
