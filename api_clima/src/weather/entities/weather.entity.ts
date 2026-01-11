import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeatherDocument = HydratedDocument<Weather>;

@Schema({ timestamps: true })
export class Weather {
  @Prop()
  cidade_id: string;

  @Prop()
  cidade_nome: string;

  @Prop()
  cidade: string;

  @Prop()
  pais: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop({ required: true })
  temperatura: number;

  @Prop()
  umidade: number;

  @Prop()
  chuva: number;

  @Prop()
  velocidade_vento: number;

  @Prop()
  eh_dia: boolean;

  @Prop()
  condicao_ceu: number;

  @Prop()
  temp_max: number;

  @Prop()
  temp_min: number;

  @Prop()
  probabilidade_chuva: number;

  @Prop()
  insight_categoria: string;

  @Prop()
  saudacao_sistema: string;

  @Prop()
  data_hora_local: string;

  @Prop()
  coleta_timestamp: string;


  @Prop()
  timezone: string;

  @Prop({ type: Object })
  daily: any;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);
