import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';

/**
 * BaseController - DRY Principle + Consistent patterns
 * Applies common decorators and guards to all derived controllers
 * Reduces boilerplate and ensures consistent security across endpoints
 */
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ status: 401, description: 'Not authorized' })
export abstract class BaseController {}
