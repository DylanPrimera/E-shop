import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Execute database seed with dummy products and users',
  })
  @ApiResponse({
    status: 200,
    description: 'Seed executed successfully, returns execution message',
    schema: {
      type: 'string',
      example: 'SEED EXECUTED',
    },
  })
  excecuteSeed() {
    return this.seedService.runSeed();
  }
}
