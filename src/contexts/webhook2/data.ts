
import { IncomingWebhook, IncomingWebhookLogEntry } from '@/types/webhook2';

// Mock data for incoming webhooks
export const mockIncomingWebhooks: IncomingWebhook[] = [
  {
    id: 'incoming-webhook-1',
    name: 'GitHub Push Events',
    description: 'Receives push events from GitHub repositories',
    endpointPath: '/github-events',
    enabled: true,
    createdAt: '2023-09-15T10:30:00Z',
    updatedAt: '2023-09-15T10:30:00Z',
    lastCalledAt: '2023-09-20T14:25:10Z',
    secretKey: 'abc123',
    tags: [
      { id: 'tag-1', name: 'Production', color: '#69db7c' },
      { id: 'tag-4', name: 'Important', color: '#ff6b6b' }
    ]
  },
  {
    id: 'incoming-webhook-2',
    name: 'Stripe Payment Events',
    description: 'Receives payment events from Stripe',
    endpointPath: '/stripe-events',
    enabled: true,
    createdAt: '2023-09-18T15:45:00Z',
    updatedAt: '2023-09-18T15:45:00Z',
    lastCalledAt: '2023-09-19T09:12:33Z',
    secretKey: 'def456',
    tags: [
      { id: 'tag-3', name: 'Testing', color: '#ff922b' }
    ]
  },
  {
    id: 'incoming-webhook-3',
    name: 'SendGrid Email Events',
    description: 'Receives email delivery events from SendGrid',
    endpointPath: '/sendgrid-events',
    enabled: false,
    createdAt: '2023-09-20T08:15:00Z',
    updatedAt: '2023-09-20T09:30:00Z',
    lastCalledAt: null,
    secretKey: 'ghi789',
    tags: [
      { id: 'tag-2', name: 'Development', color: '#4dabf7' }
    ]
  }
];

// Mock data for incoming webhook logs
export const mockIncomingWebhookLogs: IncomingWebhookLogEntry[] = [
  {
    id: 'incoming-log-1',
    webhookId: 'incoming-webhook-1',
    webhookName: 'GitHub Push Events',
    timestamp: '2023-09-20T14:25:10Z',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'GitHub-Hookshot/12345',
      'X-GitHub-Event': 'push',
      'X-Hub-Signature': 'sha1=abcdef1234567890'
    },
    requestMethod: 'POST',
    requestBody: JSON.stringify({
      ref: 'refs/heads/main',
      repository: {
        name: 'webhook-demo',
        owner: {
          name: 'acme-org'
        }
      },
      pusher: {
        name: 'johndoe',
        email: 'john@example.com'
      },
      commits: [
        {
          id: '123456',
          message: 'Fix bug in webhook handler',
          author: {
            name: 'John Doe',
            email: 'john@example.com'
          },
          timestamp: '2023-09-20T14:24:10Z'
        }
      ]
    }),
    queryParams: {},
    responseStatus: 200,
    endpointPath: '/github-events',
    responseBody: JSON.stringify({ status: 'success' }),
    isParsed: true,
    parsedData: JSON.stringify({
      event: 'push',
      repo: 'webhook-demo',
      branch: 'main',
      author: 'johndoe',
      commitCount: 1
    }),
    success: true,
    sourceIp: '192.30.252.40',
    contentType: 'application/json'
  },
  {
    id: 'incoming-log-2',
    webhookId: 'incoming-webhook-2',
    webhookName: 'Stripe Payment Events',
    timestamp: '2023-09-19T09:12:33Z',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'Stripe/1.0',
      'Stripe-Signature': 't=1632027153,v1=abcdef1234567890'
    },
    requestMethod: 'POST',
    requestBody: JSON.stringify({
      id: 'evt_1234567890',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_1234567890',
          amount: 2000,
          currency: 'usd',
          status: 'succeeded',
          customer: 'cus_1234567890'
        }
      }
    }),
    queryParams: {},
    responseStatus: 200,
    endpointPath: '/stripe-events',
    responseBody: JSON.stringify({ received: true }),
    isParsed: true,
    parsedData: JSON.stringify({
      event: 'payment_intent.succeeded',
      amount: '$20.00',
      customer: 'cus_1234567890',
      paymentId: 'pi_1234567890'
    }),
    success: true,
    sourceIp: '54.187.174.169',
    contentType: 'application/json'
  },
  {
    id: 'incoming-log-3',
    webhookId: 'incoming-webhook-1',
    webhookName: 'GitHub Push Events',
    timestamp: '2023-09-20T08:30:15Z',
    requestHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'GitHub-Hookshot/12345',
      'X-GitHub-Event': 'pull_request',
      'X-Hub-Signature': 'sha1=abcdef1234567890'
    },
    requestMethod: 'POST',
    requestBody: JSON.stringify({
      action: 'opened',
      pull_request: {
        number: 42,
        title: 'Add new feature',
        user: {
          login: 'janedoe'
        },
        head: {
          ref: 'feature-branch'
        },
        base: {
          ref: 'main'
        }
      },
      repository: {
        name: 'webhook-demo',
        owner: {
          login: 'acme-org'
        }
      }
    }),
    queryParams: {},
    responseStatus: 400,
    endpointPath: '/github-events',
    responseBody: JSON.stringify({ 
      status: 'error', 
      message: 'Unsupported event type' 
    }),
    isParsed: true,
    parsedData: JSON.stringify({
      error: 'Unsupported event type: pull_request',
      supportedEvents: ['push', 'release']
    }),
    success: false,
    sourceIp: '192.30.252.41',
    contentType: 'application/json',
    error: 'Unsupported event type: pull_request'
  }
];
