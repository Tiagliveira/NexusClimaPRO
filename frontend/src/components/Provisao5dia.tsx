import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, CloudRain, Sun, CloudLightning, CloudSun } from "lucide-react";

interface PrevisaoProps {
    daily: any;
}

export function Previsao5Dias({ daily }: PrevisaoProps) {
    if (!daily || !daily.time || !Array.isArray(daily.time)) return null;

    const getHojeLocal = () => {
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, '0');
        const dia = String(agora.getDate()).padStart(2, '0');
        return `${ano}-${mes}-${dia}`;
    };

    const hojeStr = getHojeLocal();

    const startIndex = daily.time.findIndex((t: string) => t === hojeStr);

    const indiceInicial = startIndex >= 0 ? startIndex : 0;

    const getTempGradient = (temp: number) => {
        if (temp >= 30) return "from-orange-600/70 to-red-600/70";
        if (temp >= 25) return "from-yellow-500/70 to-orange-500/70";
        if (temp >= 20) return "from-green-500/70 to-yellow-500/70";
        if (temp >= 10) return "from-cyan-600/70 to-blue-500/70";
        return "from-blue-700/70 to-indigo-800/70";
    };

    const getIcone = (chuva: number) => {
        if (chuva > 70) return <CloudLightning className="h-6 w-6 text-white drop-shadow-md animate-pulse" />;
        if (chuva > 40) return <CloudRain className="h-6 w-6 text-white drop-shadow-md" />;
        if (chuva > 20) return <CloudSun className="h-6 w-6 text-yellow-100 drop-shadow-md" />;
        return <Sun className="h-6 w-6 text-yellow-400 drop-shadow-md animate-spin-slow" />;
    };

    const getDiaSemana = (dateString: string) => {
        const dateObj = new Date(dateString + "T12:00:00");

        if (dateString === hojeStr) return "HOJE";

        return dateObj.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
    };

    const getDataFormatada = (dateString: string) => {
        const parts = dateString.split('-');
        return parts.length === 3 ? `${parts[2]}/${parts[1]}` : dateString;
    };

    return (
        <div className="w-full">
            <h3 className="text-white/80 font-bold mb-3 flex justify-center items-center gap-2 text-sm uppercase tracking-wider">
                Previsão da Semana
            </h3>

            <div className="grid grid-cols-5 gap-2">
                {daily.time.slice(indiceInicial, indiceInicial + 5).map((diaString: string, indexRelativo: number) => {

                    const i = indiceInicial + indexRelativo;

                    const maxTemp = daily.temperature_2m_max?.[i] ?? daily.tempmax?.[i];
                    const minTemp = daily.temperature_2m_min?.[i] ?? daily.tempmin?.[i];
                    const probChuva = daily.precipitation_probability_max?.[i]
                        ?? daily.precipitationprobmax?.[i]
                        ?? 0;

                    if (maxTemp === undefined || maxTemp === null) return null;

                    return (
                        <Card
                            key={`${diaString}-${i}`}
                            className={`
                                bg-gradient-to-b ${getTempGradient(maxTemp)} 
                                border-0 text-white p-2 text-center flex flex-col items-center justify-between 
                                hover:scale-105 transition-transform shadow-lg cursor-default min-h-[110px]
                            `}
                        >
                            <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase ${diaString === hojeStr ? 'text-cyan-300 animate-pulse' : 'text-white/90'}`}>
                                    {getDiaSemana(diaString)}
                                </span>
                                <span className="text-[9px] text-white/70">
                                    {getDataFormatada(diaString)}
                                </span>
                            </div>

                            <div className="my-1">
                                {getIcone(probChuva)}
                            </div>

                            <div className="text-xs w-full flex flex-col gap-1 items-center font-bold">
                                <span className="flex items-center text-white drop-shadow-sm">
                                    <ArrowUp className="h-3 w-3 mr-0.5" />
                                    {Math.round(maxTemp)}°
                                </span>
                                <span className="flex items-center text-white/70">
                                    <ArrowDown className="h-3 w-3 mr-0.5" />
                                    {minTemp !== undefined ? Math.round(minTemp) : '--'}°
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}