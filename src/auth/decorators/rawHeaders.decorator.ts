import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const rawheaders = req.rawHeaders;

    if (!rawheaders)
      throw new InternalServerErrorException('rawHeaders no exist!');

    return rawheaders;
  },
);
