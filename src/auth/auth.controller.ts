import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Req, Res, UseInterceptors, UploadedFiles, UploadedFile, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ResetPasswordDto, SendOtpDto, SendOtpDtoReset, SignInDto, VerifyOtpDto, VerifyOtpDtoReset } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Request, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path';
import { GuardGuard } from 'src/guard/guard.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Загрузите изображение пользователя',
    required: true,
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary', // ключевое для поля файла
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.mimetype)) {
          return cb(new Error('You can upload only images (jpeg, png, webp)'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.uploadFile(req, res, file);
  }


  @Post("signup")
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.signup(createAuthDto);
  }



  @Post('send-otp')
  async sendOtp(@Body() sendOtp: SendOtpDto) {
    const { to, subject } = sendOtp;
    return this.authService.sendOtp(to, subject || 'Verification Code');
  }


  @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    return this.authService.logout(req, res);
  }

  @Post('signin')
  async signin(@Body() dto: SignInDto, @Req() req: Request) {
    const ip =
      req.headers['x-forwarded-for']?.toString() ||

      'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    return this.authService.signin(dto, ip, userAgent);
  }


  @ApiBearerAuth('access-token')
  @UseGuards(GuardGuard)
  @Get('me')
  getMyData(@Req() req) {
    return this.authService.getMyData(req.user.id);
  }


  @Post('send-otp-reset')
  sendOtpReset(@Body() dto: SendOtpDtoReset) {
    return this.authService.sendOtpReset(dto);
  }

  @Post('verify-otp-reset')
  verifyOtpReset(@Body() dto: VerifyOtpDtoReset) {
    console.log(dto);

    return this.authService.verifyOtpReset(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
