import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather, WeatherDocument } from './entities/weather.entity';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
  ) { }

  async create(createWeatherDto: CreateWeatherDto): Promise<Weather> {
    const createdWeather = new this.weatherModel(createWeatherDto);
    return await createdWeather.save();
  }

  async findAll(cidade?: string): Promise<Weather[]> {
    const filtro = cidade
      ? { cidade_nome: { $regex: new RegExp(cidade, 'i') } }
      : {};

    return this.weatherModel
      .find(filtro)
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async findLatest(cidade: string): Promise<Weather | any> {
    const filtro = cidade
      ? { cidade_nome: { $regex: new RegExp(cidade, 'i') } }
      : {};

    const dadoLocal = await this.weatherModel
      .findOne(filtro)
      .sort({ createdAt: -1 })
      .exec();

    if (dadoLocal) {
      return dadoLocal;
    }

    return this.buscarNaApiExterna(cidade);
  }

  private async buscarNaApiExterna(cidade: string) {
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results) return null;

      const local = geoData.results[0];

      let sulfixo = local.country_code || "";
      if (local.admin1) {
        sulfixo = local.admin1;
      }
      const nomeFormatado = `${local.name} - ${sulfixo}`;

      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,wind_speed_10m,cloud_cover&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;

      const wRes = await fetch(weatherUrl);
      const wData = await wRes.json();

      const current = wData.current;
      const daily = wData.daily;

      let cat = "NEUTRO";
      const t = current.temperature_2m;
      if (t > 30) cat = "CALOR_INFERNAL";
      else if (t > 25 && current.precipitation === 0) cat = "CALOR_PRAIA";
      else if (t < 15) cat = "FRIO_LEVE";

      if (current.precipitation > 0) cat = "CHUVA";
      if (current.precipitation > 10) cat = "TEMPESTADE";

      const dadoVolatil = {
        cidade_nome: nomeFormatado,
        temperatura: current.temperature_2m,
        umidade: current.relative_humidity_2m,
        chuva: current.precipitation,
        velocidade_vento: current.wind_speed_10m,
        eh_dia: !!current.is_day,
        condicao_ceu: current.cloud_cover,
        temp_max: daily.temperature_2m_max[0],
        temp_min: daily.temperature_2m_min[0],
        probabilidade_chuva: daily.precipitation_probability_max[0],
        insight_categoria: cat,
        saudacao_sistema: "Resultado da Pesquisa",
        data_hora_local: current.time,
        timezone: wData.timezone,
        createdAt: new Date(),
        daily: daily
      };

      return dadoVolatil;

    } catch (error) {
      return null;
    }
  }

  async findOne(id: string) {
    return this.weatherModel.findById(id);
  }

  async remove(id: string) {
    return this.weatherModel.findByIdAndDelete(id);
  }
}