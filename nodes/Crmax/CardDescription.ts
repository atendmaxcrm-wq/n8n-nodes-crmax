import type { INodeProperties } from 'n8n-workflow';

export const cardOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['card'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new card (lead) in a pipeline',
				action: 'Create a card',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a card by ID',
				action: 'Get a card',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get multiple cards with filters',
				action: 'Get many cards',
			},
			{
				name: 'Get by Contact',
				value: 'getByContact',
				description: 'Get all cards for a specific contact',
				action: 'Get cards by contact',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a card',
				action: 'Update a card',
			},
			{
				name: 'Archive',
				value: 'archive',
				description: 'Archive or unarchive a card',
				action: 'Archive a card',
			},
			{
				name: 'Move Stage',
				value: 'moveStage',
				description: 'Move a card to a different stage',
				action: 'Move card to stage',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a card permanently',
				action: 'Delete a card',
			},
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add a note to a card',
				action: 'Add note to card',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'Get all notes from a card',
				action: 'Get card notes',
			},
		],
		default: 'create',
	},
];

export const cardFields: INodeProperties[] = [
	// ----------------------------------
	//         create
	// ----------------------------------
	{
		displayName: 'Pipeline',
		name: 'pipelineId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Pipeline where the card will be created. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Stage',
		name: 'stageId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getStages',
			loadOptionsDependsOn: ['pipelineId'],
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Initial stage for the card. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Title of the card (lead name)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number of the lead (format: 5511999999999)',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address of the lead',
			},
			{
				displayName: 'Origin',
				name: 'origin',
				type: 'string',
				default: '',
				description: 'Source of the lead (e.g., Meta Ads, Google Ads, Website)',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: 0,
				description: 'Opportunity value in BRL',
			},
			{
				displayName: 'Scheduled Date',
				name: 'scheduledDate',
				type: 'string',
				default: '',
				description: 'Scheduled date for the lead (format: YYYY-MM-DD)',
			},
			{
				displayName: 'Assigned To',
				name: 'assignedTo',
				type: 'string',
				default: '',
				description: 'User ID or name of the person responsible for this card',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Initial notes or observations about the lead',
			},
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				description: 'ID of an existing contact to link to this card',
			},
			{
				displayName: 'Dynamic Fields',
				name: 'dynamicFields',
				type: 'json',
				default: '{}',
				description: 'Custom fields as JSON object (e.g., {"tipo_de_atendimento": "Presencial"})',
			},
		],
	},

	// ----------------------------------
	//         get
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the card to retrieve',
	},

	// ----------------------------------
	//         getMany
	// ----------------------------------
	{
		displayName: 'Pipeline',
		name: 'pipelineId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getMany'],
			},
		},
		default: '',
		description: 'Pipeline to filter cards. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['card'],
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
				resource: ['card'],
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
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				default: '',
				description: 'Filter cards by contact ID',
			},
			{
				displayName: 'Stage',
				name: 'stageId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getStages',
					loadOptionsDependsOn: ['pipelineId'],
				},
				default: '',
				description: 'Filter by stage. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Assigned To',
				name: 'assignedTo',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getUsers',
				},
				default: '',
				description: 'Filter by user responsible for the card. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
					},
					{
						name: 'Archived',
						value: 'archived',
					},
					{
						name: 'Won',
						value: 'won',
					},
					{
						name: 'Lost',
						value: 'lost',
					},
				],
				default: 'active',
				description: 'Filter by card status',
			},
			{
				displayName: 'Include Archived',
				name: 'includeArchived',
				type: 'boolean',
				default: false,
				description: 'Whether to include archived cards in results',
			},
			{
				displayName: 'Text Filter',
				name: 'textFilter',
				type: 'string',
				default: '',
				description: 'Search in title, contact name, phone, email, or notes',
			},
			{
				displayName: 'Origin',
				name: 'origin',
				type: 'string',
				default: '',
				description: 'Filter by lead origin (e.g., Meta Ads, Google Ads, Website)',
			},
			{
				displayName: 'Label',
				name: 'labelId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLabels',
				},
				default: '',
				description: 'Filter by label/tag. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Created After',
				name: 'createdAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter cards created after this date',
			},
			{
				displayName: 'Created Before',
				name: 'createdAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter cards created before this date',
			},
			{
				displayName: 'Updated After',
				name: 'updatedAtAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter cards updated after this date',
			},
			{
				displayName: 'Updated Before',
				name: 'updatedAtBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter cards updated before this date',
			},
			{
				displayName: 'Scheduled After',
				name: 'scheduledDateAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter cards scheduled after this date',
			},
			{
				displayName: 'Scheduled Before',
				name: 'scheduledDateBefore',
				type: 'dateTime',
				default: '',
				description: 'Filter cards scheduled before this date',
			},
			{
				displayName: 'Value Min',
				name: 'valueMin',
				type: 'number',
				default: 0,
				description: 'Minimum opportunity value',
			},
			{
				displayName: 'Value Max',
				name: 'valueMax',
				type: 'number',
				default: 0,
				description: 'Maximum opportunity value',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'multiOptions',
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
					{
						name: 'Labels',
						value: 'labels',
					},
					{
						name: 'Checklist',
						value: 'checklist',
					},
					{
						name: 'Notes',
						value: 'notes',
					},
					{
						name: 'History',
						value: 'history',
					},
				],
				default: ['contact'],
				description: 'Which details to include in the response',
			},
			{
				displayName: 'Order By',
				name: 'orderBy',
				type: 'options',
				options: [
					{
						name: 'Created At',
						value: 'created_at',
					},
					{
						name: 'Updated At',
						value: 'updated_at',
					},
					{
						name: 'Title',
						value: 'title',
					},
					{
						name: 'Value',
						value: 'value',
					},
					{
						name: 'Scheduled Date',
						value: 'due_date',
					},
					{
						name: 'Position',
						value: 'position',
					},
				],
				default: 'created_at',
				description: 'Field to order results by',
			},
			{
				displayName: 'Order Direction',
				name: 'orderDirection',
				type: 'options',
				options: [
					{
						name: 'Descending',
						value: 'DESC',
					},
					{
						name: 'Ascending',
						value: 'ASC',
					},
				],
				default: 'DESC',
				description: 'Direction of ordering',
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
				description: 'Number of results per page (max 100)',
			},
		],
	},

	// ----------------------------------
	//         getByContact
	// ----------------------------------
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getByContact'],
			},
		},
		default: '',
		description: 'ID of the contact to get cards for',
	},
	{
		displayName: 'Pipeline',
		name: 'pipelineId',
		type: 'options',
		required: false,
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getByContact'],
			},
		},
		default: '',
		description: 'Optional: Filter by specific pipeline. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Include Archived',
		name: 'includeArchived',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getByContact'],
			},
		},
		default: false,
		description: 'Whether to include archived cards',
	},

	// ----------------------------------
	//         update
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the card to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Stage ID',
				name: 'stageId',
				type: 'string',
				default: '',
				description: 'Move card to a different stage',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'New title for the card',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'number',
				default: 0,
				description: 'New opportunity value',
			},
			{
				displayName: 'Notes',
				name: 'notes',
				type: 'string',
				default: '',
				description: 'Updated notes or observations',
			},
			{
				displayName: 'Assigned To',
				name: 'assignedTo',
				type: 'string',
				default: '',
				description: 'New responsible user ID',
			},
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				description: 'Email address (also updates contact)',
			},
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City for CAPI enrichment',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State (UF) for CAPI enrichment',
			},
			{
				displayName: 'Zip Code',
				name: 'zip_code',
				type: 'string',
				default: '',
				description: 'ZIP code for CAPI enrichment',
			},
		],
	},

	// ----------------------------------
	//         archive
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['archive'],
			},
		},
		default: '',
		description: 'ID of the card to archive or unarchive',
	},
	{
		displayName: 'Archive',
		name: 'archive',
		type: 'boolean',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['archive'],
			},
		},
		default: true,
		description: 'Whether to archive (true) or unarchive (false) the card',
	},

	// ----------------------------------
	//         moveStage
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['moveStage'],
			},
		},
		default: '',
		description: 'ID of the card to move',
	},
	{
		displayName: 'Pipeline',
		name: 'pipelineId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getPipelines',
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['moveStage'],
			},
		},
		default: '',
		description: 'Pipeline containing the destination stage. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Stage',
		name: 'stageId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getStages',
			loadOptionsDependsOn: ['pipelineId'],
		},
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['moveStage'],
			},
		},
		default: '',
		description: 'Destination stage. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         delete
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the card to delete permanently',
	},

	// ----------------------------------
	//         addNote
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['addNote'],
			},
		},
		default: '',
		description: 'ID of the card to add a note to',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['addNote'],
			},
		},
		default: '',
		description: 'Content of the note',
		typeOptions: {
			rows: 4,
		},
	},

	// ----------------------------------
	//         getNotes
	// ----------------------------------
	{
		displayName: 'Card ID',
		name: 'cardId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['card'],
				operation: ['getNotes'],
			},
		},
		default: '',
		description: 'ID of the card to retrieve notes from',
	},
];
