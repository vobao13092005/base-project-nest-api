import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import mikroConfig from './mikro-orm.config';
import { JwtService } from '@nestjs/jwt';
import controllers from './controllers';
import services from './services';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroConfig),
  ],
  controllers: controllers,
  providers: [JwtService, ...services],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

  }
}
