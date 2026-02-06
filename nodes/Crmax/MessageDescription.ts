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
				name: 'Send Text',
				value: 'sendText',
				description: 'Send a text message via WhatsApp',
				action: 'Send a text message',
			},
			{
				name: 'Send Text Sync',
				value: 'sendTextSync',
				description: 'Send a text message and wait for delivery status (timeout 25s)',
				action: 'Send a text message synchronously',
			},
			{
				name: 'Send Image',
				value: 'sendImage',
				description: 'Send an image via WhatsApp',
				action: 'Send an image',
			},
			{
				name: 'Send Audio',
				value: 'sendAudio',
				description: 'Send an audio file via WhatsApp',
				action: 'Send an audio file',
			},
			{
				name: 'Send Document',
				value: 'sendDocument',
				description: 'Send a document via WhatsApp',
				action: 'Send a document',
			},
			{
				name: 'Send via Conversation',
				value: 'sendViaConversation',
				description: 'Send a message to an existing conversation',
				action: 'Send message via conversation',
			},
			{
				name: 'Send via Conversation Sync',
				value: 'sendViaConversationSync',
				description: 'Send a message to a conversation and wait for status',
				action: 'Send message via conversation synchronously',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the delivery status of a message',
				action: 'Get message status',
			},
		],
		default: 'sendText',
	},
];

export const messageFields: INodeProperties[] = [
	// Send Text fields
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendTextSync'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendTextSync'],
			},
		},
		default: '',
		description: 'WhatsApp instance ID',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendText', 'sendTextSync'],
			},
		},
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Text message content to send',
	},

	// Send Image fields
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendImage'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendImage'],
			},
		},
		default: '',
		description: 'WhatsApp instance ID',
	},
	{
		displayName: 'Image URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendImage'],
			},
		},
		default: '',
		placeholder: 'https://example.com/image.jpg',
		description: 'URL of the image to send',
	},
	{
		displayName: 'Caption',
		name: 'caption',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendImage'],
			},
		},
		default: '',
		description: 'Optional caption for the image',
	},

	// Send Audio fields
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendAudio'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendAudio'],
			},
		},
		default: '',
		description: 'WhatsApp instance ID',
	},
	{
		displayName: 'Audio URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendAudio'],
			},
		},
		default: '',
		placeholder: 'https://example.com/audio.mp3',
		description: 'URL of the audio file to send',
	},

	// Send Document fields
	{
		displayName: 'Phone Number',
		name: 'phone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendDocument'],
			},
		},
		default: '',
		placeholder: '5588999887766',
		description: 'Recipient phone number (with country code, no + or spaces)',
	},
	{
		displayName: 'Instance ID',
		name: 'instanceId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendDocument'],
			},
		},
		default: '',
		description: 'WhatsApp instance ID',
	},
	{
		displayName: 'Document URL',
		name: 'mediaUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendDocument'],
			},
		},
		default: '',
		placeholder: 'https://example.com/document.pdf',
		description: 'URL of the document to send',
	},
	{
		displayName: 'File Name',
		name: 'fileName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendDocument'],
			},
		},
		default: '',
		placeholder: 'document.pdf',
		description: 'Optional file name for the document',
	},

	// Send via Conversation fields
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendViaConversation', 'sendViaConversationSync'],
			},
		},
		default: '',
		description: 'ID of the conversation to send the message to',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['message'],
				operation: ['sendViaConversation', 'sendViaConversationSync'],
			},
		},
		typeOptions: {
			rows: 4,
		},
		default: '',
		description: 'Text message content to send',
	},

	// Get Status fields
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
