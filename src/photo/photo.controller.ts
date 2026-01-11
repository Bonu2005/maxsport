import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Controller('photos')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  // ➕ создать фото
  @Post()
  create(@Body() dto: CreatePhotoDto) {
    return this.photoService.create(dto);
  }

  // 📸 все фото
  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  // 🔍 фото по id
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.photoService.findById(id);
  }
}
