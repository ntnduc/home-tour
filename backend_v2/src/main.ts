import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filter/http-exception.filter';
import { PermissionTreeService } from './common/services/permission-tree.service';
import { StickAuthGaurd } from './modules/auth/jwt-auth.guard';
import { PermissionsGuard } from './modules/rbac/guards/permissions.guard';
import { PropertyAccessGuard } from './modules/rbac/guards/property-access.guard';
import { RolesGuard } from './modules/rbac/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  app.useGlobalFilters(new AllExceptionFilter());

  const jwtService = app.get(JwtService);
  const permissionTreeService = app.get(PermissionTreeService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new StickAuthGaurd(jwtService, reflector));
  app.useGlobalGuards(new RolesGuard(reflector));
  app.useGlobalGuards(new PropertyAccessGuard(reflector));
  app.useGlobalGuards(new PermissionsGuard(reflector, permissionTreeService));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Home Tour API')
    .setDescription('The Home Tour API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
