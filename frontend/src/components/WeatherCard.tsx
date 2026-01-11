import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Leaf, Droplets, Cloud, Wind, X, Search, Clock } from "lucide-react";
import { AvatarClima } from "./AvatarClima";
import { Previsao5Dias } from "./Provisao5dia";

function RelogioVivo({ timezone }: { timezone: string }) {
    const [hora, setHora] = useState<string>("--:--");

    useEffect(() => {
        const atualizar = () => {
            try {
                const agora = new Date();
                const formatador = new Intl.DateTimeFormat('pt-BR', {
                    timeZone: timezone || undefined,
                    hour: '2-digit',
                    minute: '2-digit',
                });
                setHora(formatador.format(agora));
            } catch (e) {
                setHora("--:--");
            }
        };

        atualizar();
        const intervalo = setInterval(atualizar, 1000);
        return () => clearInterval(intervalo);
    }, [timezone]);

    return <span className="animate-pulse">{hora}</span>;
}

interface WeatherCardProps {
    data: any;
    corTema: string;
    bgCard: string;
    nomeUsuario: string;
    isPesquisa: boolean;
    onFecharPesquisa: () => void;
}

export function WeatherCard({
    data,
    corTema,
    bgCard,
    nomeUsuario,
    isPesquisa,
    onFecharPesquisa
}: WeatherCardProps) {

    if (!data) return null;

    const getSaudacao = () => {
        if (!data.data_hora_local) return "Olá";
        const hora = parseInt(data.data_hora_local.split('T')[1].split(':')[0], 10);

        if (hora >= 0 && hora < 5) return "Boa madrugada";
        if (hora >= 5 && hora < 12) return "Bom dia";
        if (hora >= 12 && hora < 18) return "Boa tarde";
        return "Boa noite";
    };

    const getTempGradient = (temp: number) => {
        if (temp >= 30) return "from-orange-600/70 to-yellow-500/70";
        if (temp >= 20) return "from-yellow-500/70 to-green-500/70";
        if (temp >= 10) return "from-cyan-600/70 to-blue-500/70";
        return "from-blue-700/70 to-indigo-800/70";
    };

    const getVentoGradient = (v: number) => v < 15 ? "from-emerald-500/70 to-green-400/70" : "from-slate-600/70 to-red-500/70";
    const getUmidadeGradient = (u: number) => u < 60 ? "from-yellow-600/70 to-orange-400/70" : "from-blue-700/70 to-indigo-500/70";
    const getNuvensGradient = (c: number) => c < 20 ? "from-sky-400/70 to-blue-300/70" : "from-slate-600/70 to-gray-500/70";
    const VentoIcon = data.velocidade_vento > 20 ? Wind : Leaf;

    return (
        <div className="w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            {isPesquisa && (
                <div className="absolute -top-12 right-0 z-50">
                    <button onClick={onFecharPesquisa} className="bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg transition-all animate-bounce">
                        <X className="h-4 w-4" /> SAIR DA PESQUISA
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* === CARD PRINCIPAL === */}
                <Card className={`col-span-1 border-0 shadow-2xl overflow-hidden relative flex flex-col justify-between p-8 min-h-[350px] ${bgCard}`}>
                    {isPesquisa && (
                        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-2">
                            <Search className="h-3 w-3 text-white" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Modo Pesquisa</span>
                        </div>
                    )}

                    <div className="text-white z-10 mt-2">
                        <h2 className="text-3xl font-bold">{getSaudacao()}, {nomeUsuario}!</h2>
                        <div className="flex flex-col gap-2 mt-2">
                            <p className="text-white/70 text-sm uppercase tracking-widest font-bold">
                                {data.cidade_nome}
                            </p>

                            <div className="flex items-center gap-1.5 text-white/90 text-sm font-mono bg-black/20 w-fit px-3 py-1.5 rounded-md border border-white/10 shadow-inner">
                                <Clock className="h-4 w-4" />
                                <RelogioVivo timezone={data.timezone} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center m:h-40">
                        <AvatarClima
                            categoria={data.insight_categoria}
                            dataHoraLocal={data.data_hora_local}
                            corTexto={corTema}
                        />
                    </div>

                    <div className="text-white z-10 text-center bg-black/20 p-3 rounded-xl backdrop-blur-sm">
                        <p className="text-sm font-medium">{data.insight_categoria.replace(/_/g, ' ').replace(/"/g, '')}</p>
                    </div>
                </Card>


                {/* === COLUNA DIREITA === */}
                <div className="col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className={`bg-gradient-to-br ${getTempGradient(data.temperatura)} border-0 p-4 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                            <span className="text-xs text-white/80 font-bold uppercase mb-1">Temperatura</span>
                            <span className="text-3xl font-black text-white drop-shadow-md">{data.temperatura.toFixed(0)}°C</span>
                            <div className="flex gap-2 text-xs mt-2 font-bold text-white/90">
                                <span className="flex items-center text-sky-700">min<span className="flex items-center text-white/70"><ArrowDown className="h-3 w-3 text-white/70" />{data.temp_min?.toFixed(0)}°</span></span>
                                <span className="flex items-center text-red-600">max<span className="flex items-center text-white/70"><ArrowUp className="h-3 w-3 text-white/70" />{data.temp_max?.toFixed(0)}°</span></span>
                            </div>
                        </Card>

                        <Card className={`bg-gradient-to-br ${getVentoGradient(data.velocidade_vento)} border-0 p-4 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                            <span className="text-xs text-white/80 font-bold uppercase mb-1">Vento</span>
                            <div className="flex flex-col items-center gap-1 text-white">
                                <VentoIcon className="h-4 w-4 animate-pulse" />
                                <span className="text-2xl font-bold">{data.velocidade_vento} <span className="text-[10px] opacity-80">km/h</span></span>
                            </div>
                            <span className="text-xs mt-1 font-bold text-white/90">
                                {data.velocidade_vento < 10 ? "Brisa Leve" : "Moderado"}
                            </span>
                        </Card>

                        <Card className={`bg-gradient-to-br ${getUmidadeGradient(data.umidade)} border-0 p-4 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                            <span className="text-xs text-white/80 font-bold uppercase mb-1">Umidade</span>
                            <Droplets className="h-6 w-6 my-1 text-white drop-shadow-sm" />
                            <span className="text-2xl font-bold text-white">{data.umidade}%</span>
                            <span className="text-[10px] text-white/80">
                                {data.umidade > 60 ? 'Ar Úmido' : 'Ar Seco'}
                            </span>
                        </Card>

                        <Card className={`bg-gradient-to-br ${getNuvensGradient(data.probabilidade_chuva)} border-0 p-4 flex flex-col items-center justify-center shadow-lg hover:scale-105 transition-transform`}>
                            <span className="text-xs text-white/80 font-bold uppercase mb-1">Chuva</span>
                            <Cloud className="h-6 w-6 my-1 text-white drop-shadow-sm" />
                            <span className="text-2xl font-bold text-white">{data.probabilidade_chuva}%</span>
                            <span className="text-[10px] text-white/80">probabilidade</span>
                        </Card>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-6 border border-white/5 backdrop-blur-md">
                        {data.daily ? (
                            <Previsao5Dias daily={data.daily} />
                        ) : (
                            <p className="text-white/50 text-center">
                                Sem dados de previsão detalhada.<br />
                                <span className="text-xs text-white/30">(Limpe o banco para atualizar a estrutura)</span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}