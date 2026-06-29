import { Request, Response } from 'express';

export const serveDocsUI = (req: Request, res: Response): void => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>LomaX Bank API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    body { margin: 0; background: #0b1329; color: #fff; font-family: 'Inter', sans-serif; }
    #swagger-ui { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .swagger-ui { background: #0b1329 !important; color: #fff !important; }
    .swagger-ui .info .title, 
    .swagger-ui .info p, 
    .swagger-ui .info a, 
    .swagger-ui .info li, 
    .swagger-ui .info code,
    .swagger-ui .info h1,
    .swagger-ui .info h2,
    .swagger-ui .info h3,
    .swagger-ui .info h4,
    .swagger-ui .info h5 { color: #f8fafc !important; }
    .swagger-ui .scheme-container { background: #111e3b !important; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.5) !important; border: 1px solid #1e293b !important; }
    .swagger-ui .opblock { border-radius: 8px !important; background: #111e3b !important; border: 1px solid #1e293b !important; }
    .swagger-ui .opblock-summary-path,
    .swagger-ui .opblock-summary-description { color: #cbd5e1 !important; }
    .swagger-ui .tabli a { color: #94a3b8 !important; }
    .swagger-ui .tabli.active a { color: #38bdf8 !important; }
    .swagger-ui .btn.authorize { border-color: #10b981 !important; color: #10b981 !important; background: transparent !important; }
    .swagger-ui .btn.authorize svg { fill: #10b981 !important; }
    .swagger-ui select { background: #0b1329 !important; color: #fff !important; border-color: #1e293b !important; }
    .swagger-ui input[type=text] { background: #0b1329 !important; color: #fff !important; border-color: #1e293b !important; }
    .swagger-ui .dialog-ux .modal-ux { background: #111e3b !important; border: 1px solid #1e293b !important; }
    .swagger-ui .dialog-ux .modal-ux-header h3 { color: #fff !important; }
    .swagger-ui .dialog-ux .modal-ux-content h4 { color: #cbd5e1 !important; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
  `;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
};

export const serveSwaggerSpec = (req: Request, res: Response): void => {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'LomaX Enterprise Banking API',
      version: '1.0.0',
      description: 'API specifications for LomaX Banking Platform production environment.',
      contact: {
        name: 'LomaX Support',
        email: 'support@lomax.com'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Current Environment Host'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error description message' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['customerId', 'password'],
          properties: {
            customerId: { type: 'string', example: 'CUST100001' },
            password: { type: 'string', example: 'Password123' }
          }
        },
        TransferRequest: {
          type: 'object',
          required: ['transferType', 'sourceAccount', 'amount'],
          properties: {
            transferType: { type: 'string', enum: ['Own Account Transfer', 'Internal Transfer', 'NEFT', 'RTGS', 'IMPS', 'UPI'], example: 'Internal Transfer' },
            sourceAccount: { type: 'string', example: 'ACC827364817264' },
            targetAccount: { type: 'string', example: 'ACC928374615234' },
            amount: { type: 'number', example: 5000 },
            remarks: { type: 'string', example: 'Rent payment' },
            payeeName: { type: 'string', example: 'John Doe' },
            payeeAccount: { type: 'string', example: 'ACC928374615234' },
            ifscCode: { type: 'string', example: 'LOMX0000001' },
            upiId: { type: 'string', example: 'john@upi' }
          }
        }
      }
    },
    paths: {
      '/api/auth/login': {
        post: {
          summary: 'User Login',
          description: 'Authenticate user using customerId/email and password.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Successful authentication. Returns token or triggers 2FA verification.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      token: { type: 'string', example: 'eyJhbGciOi...' },
                      twoFactorRequired: { type: 'boolean', example: false }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Invalid credentials',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        }
      },
      '/api/transactions/transfer': {
        post: {
          summary: 'Initiate Transfer',
          description: 'Initiate a money transfer. Demands JWT token and optional X-Idempotency-Key.',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'X-Idempotency-Key',
              in: 'header',
              required: false,
              schema: { type: 'string' },
              description: 'Unique key to avoid request duplication'
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TransferRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'Transfer successfully processed.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      transaction: {
                        type: 'object',
                        properties: {
                          transactionId: { type: 'string', example: 'LMX20260701837492817' },
                          amount: { type: 'number', example: 5000 },
                          timestamp: { type: 'string', example: '2026-06-29T11:00:00Z' }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Transfer limits or balance validations failure',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } }
            }
          }
        }
      }
    }
  };

  res.json(spec);
};
