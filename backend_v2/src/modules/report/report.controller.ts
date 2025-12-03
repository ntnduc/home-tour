import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Report')
@Controller('/api/report')
export class ReportController {}
