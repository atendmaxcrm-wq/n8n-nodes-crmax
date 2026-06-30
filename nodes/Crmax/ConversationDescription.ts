import type { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
			},
		},
		options: [
			{
				name: 'Add Note',
				value: 'addNote',
				description: 'Add an internal note to a conversation',
				action: 'Add a note to a conversation',
			},
			{
				name: 'Assign',
				value: 'assign',
				description: 'Assign a conversation to an attendant and/or team',
				action: 'Assign a conversation',
			},
			{
				name: 'Delete Note',
				value: 'deleteNote',
				description: 'Delete an internal note',
				action: 'Delete a conversation note',
			},
			{
				name: 'Get Notes',
				value: 'getNotes',
				description: 'List internal notes of a conversation',
				action: 'Get conversation notes',
			},
			{
				name: 'Toggle AI',
				value: 'toggleAi',
				description: 'Pause or resume the AI agent for a conversation',
				action: 'Toggle AI for a conversation',
			},
			{
				name: 'Transfer',
				value: 'transfer',
				description: 'Transfer a conversation to another attendant and/or team',
				action: 'Transfer a conversation',
			},
			{
				name: 'Update Note',
				value: 'updateNote',
				description: 'Update an internal note',
				action: 'Update a conversation note',
			},
		],
		default: 'addNote',
	},
];

export const conversationFields: INodeProperties[] = [
	// ----------------------------------
	//   conversationId (todas as operações por conversa)
	// ----------------------------------
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['addNote', 'getNotes', 'deleteNote', 'assign', 'transfer', 'toggleAi'],
			},
		},
		description: 'ID of the conversation',
	},

	// ----------------------------------
	//         assign
	// ----------------------------------
	{
		displayName: 'Attendant',
		name: 'userId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['assign'],
			},
		},
		description:
			'Attendant to assign the conversation to. Required (an API token has no user of its own, so the assignee must be explicit). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Team',
		name: 'teamId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['assign'],
			},
		},
		description:
			'Optional team to set on the conversation. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         transfer
	// ----------------------------------
	{
		displayName: 'To Attendant',
		name: 'toUserId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['transfer'],
			},
		},
		description:
			'Attendant to transfer the conversation to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'To Team',
		name: 'toTeamId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTeams',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['transfer'],
			},
		},
		description:
			'Team to transfer the conversation to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['transfer'],
			},
		},
		description: 'Optional reason for the transfer',
	},

	// ----------------------------------
	//         toggleAi
	// ----------------------------------
	{
		displayName: 'AI Enabled',
		name: 'aiEnabled',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['toggleAi'],
			},
		},
		description: 'Whether the AI agent is active for this conversation. Turn off to pause the AI (manual handling).',
	},

	// ----------------------------------
	//         addNote
	// ----------------------------------
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['addNote'],
			},
		},
		description: 'The note content',
	},
	{
		displayName: 'Author (User) Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getUsers',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['addNote'],
			},
		},
		description: 'Attendant to record as the author of the note. Recommended when using an API token (the token has no user of its own); if left empty, the first org admin is used as the author. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         updateNote / deleteNote
	// ----------------------------------
	{
		displayName: 'Note ID',
		name: 'noteId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['updateNote', 'deleteNote'],
			},
		},
		description: 'ID of the note',
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['conversation'],
				operation: ['updateNote'],
			},
		},
		description: 'The new note content',
	},
];
