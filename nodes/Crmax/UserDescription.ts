import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List users/attendants of the organization',
				action: 'List users',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a user/attendant by ID',
				action: 'Get a user',
			},
		],
		default: 'list',
	},
];

export const userFields: INodeProperties[] = [
	// ----------------------------------
	//         list
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				default: 'user',
				description: 'Filter by role',
				options: [
					{ name: 'Org Admin', value: 'org_admin' },
					{ name: 'User (Attendant)', value: 'user' },
					{ name: 'Viewer', value: 'viewer' },
				],
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: 'online',
				description: 'Filter by presence status',
				options: [
					{ name: 'Online', value: 'online' },
					{ name: 'Away', value: 'away' },
					{ name: 'Busy', value: 'busy' },
					{ name: 'Offline', value: 'offline' },
				],
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by name or email',
			},
		],
	},

	// ----------------------------------
	//         get
	// ----------------------------------
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['user'],
				operation: ['get'],
			},
		},
		description: 'The user/attendant to retrieve. Choose from the list or specify an ID via expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
