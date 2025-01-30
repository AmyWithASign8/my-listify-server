import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { PrismaClientService } from './prisma-client/prisma-client.service';
import { PrismaClientModule } from './prisma-client/prisma-client.module';

@Module({
  imports: [UserModule, PrismaClientModule],
  controllers: [],
  providers: [PrismaClientService],
})
export class AppModule {}
