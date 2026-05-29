import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DrawRequestDto } from './dto/draw-request.dto';
import { DrawService } from './draw.service';

@ApiTags('draw')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('draw')
export class DrawController {
  constructor(private readonly drawService: DrawService) { }

  @Post()
  @ApiOperation({ summary: 'Realiza o sorteio de jogadores em times balanceados' })
  @ApiBody({ type: DrawRequestDto })
  @ApiResponse({ status: 201, description: 'Times gerados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou insuficientes' })
  realizarSorteio(@Body() body: DrawRequestDto) {
    const { jogadores, numeroDeTimes, tamanhoPorTime } = body;
    return this.drawService.sortearTimes(jogadores, numeroDeTimes, tamanhoPorTime);
  }
}
