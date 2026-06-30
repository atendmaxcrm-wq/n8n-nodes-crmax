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
				name: 'Get Notes',
				value: 'getNotes',
				description: 'List internal notes of a conversation',
				action: 'Get conversation notes',
			},
			{
				name: 'Update Note',
				value: 'updateNote',
				description: 'Update an internal note',
				action: 'Update a conversation note',
			},
			{
				name: 'Delete Note',
				value: 'deleteNote',
				description: 'Delete an internal note',
				action: 'Delete a conversation note',
			},
		],
		default: 'addNote',
	},
];

export const conversationFields: INodeProperties[] = [
	// ----------------------------------
	//   conversationId (addNote/getNotes/deleteNote)
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
				operation: ['addNote', 'getNotes', 'deleteNote'],
			},
		},
		description: 'ID of the conversation',
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
