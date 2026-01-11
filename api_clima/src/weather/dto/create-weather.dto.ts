export class CreateWeatherDto {
    cidade_id: string;
    cidade_nome: string;
    latitude: number;
    longitude: number;
    temperatura: number;
    umidade: number;
    chuva: number;
    velocidade_vento: number;
    eh_dia: boolean;

    insight_categoria: string;
    saudacao_sistema: string;
    data_hora_local: string;
}
