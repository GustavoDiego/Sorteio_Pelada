import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { DrawService } from './draw.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Player } from 'src/shared/interfaces/player.interface';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

class DrawRequestBody {
  jogadores: Player[];
  numeroDeTimes: number;
  tamanhoPorTime: number;
}

@ApiTags('draw')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('draw')
export class DrawController {
  constructor(private readonly drawService: DrawService) {}

  @Post()
  @ApiOperation({ summary: 'Realiza o sorteio de jogadores em times balanceados' })
  @ApiBody({ type: DrawRequestBody })
  @ApiResponse({ status: 201, description: 'Times gerados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou insuficientes' })
  realizarSorteio(@Body() body: DrawRequestBody) {
    const { jogadores, numeroDeTimes, tamanhoPorTime } = body;
    return this.drawService.sortearTimes(jogadores, numeroDeTimes, tamanhoPorTime);
  }
}
