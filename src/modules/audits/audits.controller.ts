import { Controller } from '@nestjs/common';
import { AuditsService } from './audits.service';

@Controller('audits')
export class AuditsController {
  constructor(private readonly auditsService: AuditsService) {}
}
