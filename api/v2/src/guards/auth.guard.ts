import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check new unified user property first, fallback to legacy properties for backward compatibility
    if (
      !request.currentUser &&
      !request.currentColaborator &&
      !request.currentStakeholder
    ) {
      throw new UnauthorizedException('User not authorized');
    }
    return true;
  }
}
