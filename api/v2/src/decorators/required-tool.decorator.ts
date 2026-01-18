import { SetMetadata } from '@nestjs/common';

export const REQUIRED_TOOL_KEY = 'requiredTool';

export const RequiredTool = (tool: string) =>
  SetMetadata(REQUIRED_TOOL_KEY, tool);
