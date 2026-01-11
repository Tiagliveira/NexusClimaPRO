import { useMemo } from "react";
import { Sun, CloudRain, Moon, Snowflake, CloudLightning, Cloud } from "lucide-react";
import { gerarInsight } from "../lib/insights";

interface AvatarProps {
    categoria: string;
    dataHoraLocal: string;
    corTexto: string;
}

const getPeriodo = (dataHora: string): string => {
    if (!dataHora) return 'Manha';
    const horaString = dataHora.includes('T') ? dataHora.split('T')[1] : dataHora.split(' ')[1];
    const hora = parseInt(horaString?.split(':')[0] || "12", 10);

    if (hora >= 0 && hora < 6) return 'Madrugada';
    if (hora >= 6 && hora < 12) return 'Manha';
    if (hora >= 12 && hora < 18) return 'Tarde';
    return 'Noite';
};

const formatarCategoria = (cat: string) => {
    if (!cat) return "Neutro";
    return cat
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

export function AvatarClima({ categoria, dataHoraLocal, corTexto }: AvatarProps) {

    const periodo = useMemo(() => getPeriodo(dataHoraLocal), [dataHoraLocal]);
    const fraseAleatoria = useMemo(() => gerarInsight(categoria), [categoria]);

    const ehDia = periodo === 'Manha' || periodo === 'Tarde';

    const IconeComponent = useMemo(() => {
        if (categoria.includes("TEMPESTADE")) return CloudLightning;
        if (categoria.includes("CHUVA")) return CloudRain;
        if (categoria.includes("FRIO")) return Snowflake;
        if (categoria.includes("NUBLADO")) return Cloud;
        return ehDia ? Sun : Moon;
    }, [categoria, ehDia]);

    const catFormatada = formatarCategoria(categoria);
    const nomeImagem = `${catFormatada}${periodo}.webp`;
    const caminhoImagem = `/assets/avatar/${nomeImagem}`;

    return (
        <div className="relative flex flex-col items-center justify-center h-full gap-2 transition-all duration-500 py-0">

            <div className={`absolute -top-20 right-0 opacity-30 scale-[1] z-0 animate-pulse ${corTexto}`}>
                <IconeComponent strokeWidth={2} size={100} />
            </div>

            <div className="relative z-10 group m-0">
                <div className="absolute inset-0 bg-white/30 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700 m-0 p-0" />

                <img
                    src={caminhoImagem}
                    alt={`Avatar ${nomeImagem}`}
                    className="relative w-40 h-40 md:w-50 md:h-50 mb-3 object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        console.warn("Imagem não encontrada:", caminhoImagem);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            <div className="relative z-20 -mt-3">
                <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-xl max-w-[280px] transform hover:-translate-y-1 transition-transform">
                    <p className="text-white font-medium text-sm italic leading-relaxed text-center drop-shadow-md">
                        {fraseAleatoria}
                    </p>
                </div>
            </div>
        </div>
    );
}