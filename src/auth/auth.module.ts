import { UserService } from './../user/service/user.service';
import { JwtStrategy } from './decorator/guards/jwt.strategy';
import { JwtAuthGuard } from './decorator/guards/jwt-auth.guard';
import { RolesGuard } from './decorator/guards/roles.guard';
import { UserModule } from './../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '100s' },
      })
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})

export class AuthModule { }
