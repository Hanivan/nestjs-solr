import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('transactions')
  async handleAddTrx() {
    return this.appService.addTrx();
  }

  @Get('transactions')
  async handleGetTrx(@Query('from') from?: string, @Query('to') to?: string) {
    const fromDate = from
      ? new Date(from)
      : new Date(new Date().setDate(new Date().getDate() - 540));
    const toDate = to ? new Date(to) : new Date();

    return this.appService.getTransactionStats(fromDate, toDate);
  }

  @Get('transaction/:userId')
  async handleSearchTrx(@Param('userId') userId: string) {
    return this.appService.searchTransactions(userId);
  }

  @Get('search')
  async handleAdvancedSearch(
    @Query('userId') userId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('minAmount') minAmount?: string,
    @Query('maxAmount') maxAmount?: string,
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('q') searchText?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.appService.searchAdvanced({
      userId,
      dateRange:
        fromDate || toDate
          ? {
              from: fromDate ? new Date(fromDate) : new Date(0),
              to: toDate ? new Date(toDate) : new Date(),
            }
          : undefined,
      amount:
        minAmount || maxAmount
          ? {
              min: minAmount ? Number(minAmount) : undefined,
              max: maxAmount ? Number(maxAmount) : undefined,
            }
          : undefined,
      type,
      status,
      searchText,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
