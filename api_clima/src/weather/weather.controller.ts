import { Controller, Get, Post, Body, Query, Res, Param, Delete } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
// A MUDANÇA ESTÁ AQUI NA LINHA DE BAIXO (import type):
import type { Response } from 'express';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) { }

  @Post()
  create(@Body() createWeatherDto: CreateWeatherDto) {
    return this.weatherService.create(createWeatherDto);
  }

  @Get()
  findAll(@Query('cidade') cidade: string) {
    return this.weatherService.findAll(cidade);
  }

  @Get('latest')
  findLatest(@Query('cidade') cidade: string) {
    return this.weatherService.findLatest(cidade);
  }

  @Get('export/csv')
  async exportCsv(@Res() res: Response) {
    const dados = await this.weatherService.findAll();
    let csv = 'Data,Cidade,Temperatura,Umidade,Categoria\n';

    dados.forEach((d) => {
      // Verifica se createdAt existe antes de tentar formatar
      const dataStr = d['createdAt'] ? new Date(d['createdAt']).toISOString() : new Date().toISOString();
      csv += `${dataStr},${d.cidade_nome},${d.temperatura},${d.umidade},${d.insight_categoria}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=historico.csv');
    return res.send(csv);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weatherService.remove(id);
  }
}
