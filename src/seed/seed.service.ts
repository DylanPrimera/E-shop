import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
  seed() {
    return 'This action adds a new seed';
  }
}
