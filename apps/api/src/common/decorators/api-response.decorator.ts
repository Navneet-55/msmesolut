import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export const ApiStandardResponse = <TModel extends Type<any>>(
  model: TModel,
  status = 200,
  description = 'Success',
) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            $ref: getSchemaPath(model),
          },
          requestId: {
            type: 'string',
            example: 'uuid-here',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    }),
  );
};

export const ApiErrorResponse = (status = 400, description = 'Error') => {
  return ApiResponse({
    status,
    description,
    schema: {
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        statusCode: {
          type: 'number',
          example: status,
        },
        message: {
          type: 'string',
          example: 'Error message',
        },
        requestId: {
          type: 'string',
          example: 'uuid-here',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
        path: {
          type: 'string',
          example: '/api/endpoint',
        },
        method: {
          type: 'string',
          example: 'POST',
        },
      },
    },
  });
};

