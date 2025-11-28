import { Controller, Post, Body } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Trainers')
@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Post()
  @ApiOperation({ summary: "Создать тренера" })
  create(@Body() dto: CreateTrainerDto) {
    return this.trainerService.create(dto);
  }
}
