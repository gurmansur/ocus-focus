import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import authConfig from './config/auth.config';
import cacheConfig from './config/cache.config';
import loggerConfig from './config/logger.config';
import throttlerConfig from './config/throttler.config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { RolesGuard } from './guards/roles.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';
import { AtorModule } from './modules/ator/ator.module';
import { AuthModule } from './modules/auth/auth.module';
import { CasoDeTesteModule } from './modules/caso-de-teste/caso-de-teste.module';
import { CasoUsoModule } from './modules/caso-uso/caso-uso.module';
import { CenariosModule } from './modules/cenarios/cenarios.module';
import { ColaboradorProjetoModule } from './modules/colaborador-projeto/colaborador-projeto.module';
import { ColaboradorModule } from './modules/colaborador/colaborador.module';
import { EmailModule } from './modules/email/email.module';
import { EstimativaModule } from './modules/estimativa/estimativa.module';
import { ExecucaoDeTesteModule } from './modules/execucao-de-teste/execucao-de-teste.module';
import { FatorAmbientalProjetoModule } from './modules/fator-ambiental-projeto/fator-ambiental-projeto.module';
import { FatorTecnicoProjetoModule } from './modules/fator-tecnico-projeto/fator-tecnico-projeto.module';
import { FatoresAmbientaisModule } from './modules/fatores-ambientais/fatores-ambientais.module';
import { FatoresTecnicosModule } from './modules/fatores-tecnicos/fatores-tecnicos.module';
import { KanbanModule } from './modules/kanban/kanban.module';
import { PriorizacaoModule } from './modules/priorizacao/priorizacao.module';
import { ProjetoModule } from './modules/projeto/projeto.module';
import { RequisitoModule } from './modules/requisito/requisito-funcional.module';
import { ResultadoRequisitoModule } from './modules/resultado-requisito/resultado-requisito.module';
import { SprintModule } from './modules/sprint/sprint.module';
import { StakeholderModule } from './modules/stakeholder/stakeholder.module';
import { StatusPriorizacaoModule } from './modules/status-priorizacao/status-priorizacao.module';
import { SuiteDeTesteModule } from './modules/suite-de-teste/suite-de-teste.module';
import { UserStoryModule } from './modules/user-story/user-story.module';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { ValidationPipe as CustomValidationPipe } from './pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [authConfig, cacheConfig, throttlerConfig, loggerConfig],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get('auth.jwt.expiresIn')}s`,
        },
      }),
    }),
    // Rate limiting configuration
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get('throttler.ttl') * 1000,
          limit: config.get('throttler.limit'),
        },
      ],
    }),
    // Passport configuration for authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Cache module with memory store instead of Redis
    CacheModule.register({
      isGlobal: true,
      ttl: 60 * 60 * 1000, // 1 hour
    }),
    // Serve static files from public directory
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    // Event emitter for application-wide events
    EventEmitterModule.forRoot(),
    // Original modules
    AtorModule,
    AuthModule,
    CasoUsoModule,
    CenariosModule,
    ColaboradorModule,
    EstimativaModule,
    FatoresAmbientaisModule,
    FatoresTecnicosModule,
    PriorizacaoModule,
    ProjetoModule,
    RequisitoModule,
    StakeholderModule,
    UsuarioModule,
    FatorTecnicoProjetoModule,
    FatorAmbientalProjetoModule,
    ColaboradorProjetoModule,
    StatusPriorizacaoModule,
    ResultadoRequisitoModule,
    SprintModule,
    UserStoryModule,
    ExecucaoDeTesteModule,
    CasoDeTesteModule,
    SuiteDeTesteModule,
    KanbanModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
