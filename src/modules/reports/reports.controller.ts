import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DatesDto } from './dto/dates.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Get('pays-:id')
  public async PaysByIdentification(@Param('id', ParseIntPipe) id: number) {
    const res = await this.reportService.PaysByIdentification(id);

    return res! ? { success: 'OK', ...res } : { ...res, f: 'F' };
  }

  @Get('pays')
  public async PaysByDates(@Query() dates: DatesDto) {
    const res = await this.reportService.PaysByDates(dates);
    return res!?.error ? { ...res, f: 'F' } : res;
  }
}
