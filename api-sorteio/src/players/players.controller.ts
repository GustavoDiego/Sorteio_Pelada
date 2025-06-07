import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('players')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar jogador' })
  @ApiBody({ type: CreatePlayerDto })
  @ApiResponse({ status: 201, description: 'Jogador criado com sucesso' })
  create(@Request() req, @Body() dto: CreatePlayerDto) {
    return this.playersService.create(req.user._id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os jogadores do usuário logado' })
  @ApiResponse({ status: 200, description: 'Lista de jogadores retornada' })
  findAll(@Request() req) {
    return this.playersService.findAll(req.user._id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar jogador por ID' })
  @ApiParam({ name: 'id', description: 'ID do jogador' })
  @ApiResponse({ status: 200, description: 'Jogador encontrado' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.playersService.findById(req.user._id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar jogador por ID' })
  @ApiParam({ name: 'id', description: 'ID do jogador' })
  @ApiBody({ type: UpdatePlayerDto })
  @ApiResponse({ status: 200, description: 'Jogador atualizado' })
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(req.user._id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover jogador por ID' })
  @ApiParam({ name: 'id', description: 'ID do jogador' })
  @ApiResponse({ status: 200, description: 'Jogador removido' })
  remove(@Request() req, @Param('id') id: string) {
    return this.playersService.remove(req.user._id, id);
  }
}
