import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { StakeholderDto } from 'src/modules/stakeholder/dto/stakeholder.dto';
import { StakeholderService } from 'src/modules/stakeholder/stakeholder.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentStakeholder?: StakeholderDto;
    }
  }
}

@Injectable()
export class StakeholderAtualMiddleware implements NestMiddleware {
  constructor(
    private stakeholderService: StakeholderService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.headers.authorization?.split(' ')[1];

    if (access_token) {
      try {
        const payload = await this.jwtService.verifyAsync(access_token, {
          secret: process.env.JWT_SECRET,
        });

        req.currentStakeholder = await this.stakeholderService.findOne(
          payload.id,
        );
      } catch (error) {
        req.currentStakeholder = undefined;
      }
    }

    next();
  }
}
