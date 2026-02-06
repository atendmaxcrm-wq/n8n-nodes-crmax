import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['message'],
			},
		},
		options: [
			{
				name: 'Send Text by Session',
				value: 'sendTextBySession',
				description: 'Send a text message to an existing session (recommended)',
				action: 'Send text by session',
			},
			{
				name: 'Send Text by Phone',
				value: 'sendTextByPhone',
				description: 'Send a text message to a phone number using a WhatsApp instance',
				action: 'Send text by phone',
			},
			{
				name: 'Send File by Session',
				value: 'sendFileBySession',
				description: 'Send a file (image, audio, document) to a session',
				action: 'Send file by session',
			},
			{
				name: 'Send File by Phone',
				value: 'sendFileByPhone',
				description: 'Send a file to a phone number using a WhatsApp instance',
				action: 'Send file by phone',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the delivery status of a message',
				action: 'Get message status',
			},
		],
		default: 'sendTextBySession',
	},
];

export const messageFields: INodeProperties[] = [
	// ==================== SEND TEXT BY SESSION ====================
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextBySession'],
			},
		},
		default: '',
		placeholder: '2026020600001',
		description: 'Session ID to send the message to (from webhook or session list)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextBySession'],
			},
		},
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Text message content to send',
	},

	// ==================== SEND TEXT BY PHONE ====================
	{
		displayName: 'WhatsApp Instance',
		name: 'instanceId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getInstances',
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextByPhone'],
			},
		},
		default: '',
		description: 'WhatsApp instance (channel) to send from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextByPhone'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextByPhone'],
			},
		},
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Text message content to send',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendTextByPhone'],
			},
		},
		options: [
			{
				displayName: 'Wait for Status',
				name: 'sync',
				type: 'boolean',
				default: false,
				description: 'Whether to wait for delivery status (timeout 25s)',
			},
		],
	},

	// ==================== SEND FILE BY SESSION ====================
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileBySession'],
			},
		},
		default: '',
		placeholder: '2026020600001',
		description: 'Session ID to send the file to',
	},
	{
		displayName: 'File Type',
		name: 'fileType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileBySession'],
			},
		},
		options: [
			{
				name: 'Image',
				value: 'image',
			},
			{
				name: 'Audio',
				value: 'audio',
			},
			{
				name: 'Document',
				value: 'document',
			},
		],
		default: 'image',
		description: 'Type of file to send',
	},
	{
		displayName: 'File URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileBySession'],
			},
		},
		default: '',
		placeholder: 'https://example.com/file.jpg',
		description: 'URL of the file to send',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileBySession'],
				fileType: ['image', 'document'],
			},
		},
		default: '',
		description: 'Optional caption for the file',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileBySession'],
				fileType: ['document'],
			},
		},
		default: '',
		placeholder: 'document.pdf',
		description: 'File name to display',
	},

	// ==================== SEND FILE BY PHONE ====================
	{
		displayName: 'WhatsApp Instance',
		name: 'instanceId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getInstances',
		},
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
			},
		},
		default: '',
		description: 'WhatsApp instance (channel) to send from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'File Type',
		name: 'fileType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
			},
		},
		options: [
			{
				name: 'Image',
				value: 'image',
			},
			{
				name: 'Audio',
				value: 'audio',
			},
			{
				name: 'Document',
				value: 'document',
			},
		],
		default: 'image',
		description: 'Type of file to send',
	},
	{
		displayName: 'File URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
			},
		},
		default: '',
		placeholder: 'https://example.com/file.jpg',
		description: 'URL of the file to send',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
				fileType: ['image', 'document'],
			},
		},
		default: '',
		description: 'Optional caption for the file',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendFileByPhone'],
				fileType: ['document'],
			},
		},
		default: '',
		placeholder: 'document.pdf',
		description: 'File name to display',
	},

	// ==================== GET STATUS ====================
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['getStatus'],
			},
		},
		default: '',
		description: 'ID of the message to check status for',
	},
];
