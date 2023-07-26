import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BoardModule, TypeOrmModule.forRoot(typeORMConfig), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
