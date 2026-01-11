import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Droplets, Wind, Thermometer, Clock } from "lucide-react";

interface WeatherData {
    _id?: string;
    createdAt?: string;
    temperatura: number;
    umidade: number;
    velocidade_vento: number;
    insight_categoria: string;
}

interface WeatherHistoryProps {
    history: WeatherData[];
}

export function WeatherHistory({ history }: WeatherHistoryProps) {
    if (!history || history.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mt-8 animate-in slide-in-from-bottom-10 duration-700 pb-10">
            <h3 className="text-xl font-bold text-slate-200 mb-4 pl-2 border-l-4 border-cyan-500 flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-500" />
                Histórico Recente
            </h3>

            <div className="rounded-xl border border-slate-800 bg-slate-950/50 overflow-hidden shadow-lg backdrop-blur-sm">
                <Table>
                    <TableCaption className="pb-4 text-slate-500">
                        Últimas leituras registradas para esta cidade.
                    </TableCaption>
                    <TableHeader className="bg-slate-900">
                        <TableRow className="border-slate-800 hover:bg-slate-900">
                            <TableHead className="text-slate-400">Horário</TableHead>
                            <TableHead className="text-slate-400">Temp.</TableHead>
                            <TableHead className="text-slate-400">Umidade</TableHead>
                            <TableHead className="text-slate-400">Vento</TableHead>
                            <TableHead className="text-right text-slate-400">Condição</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map((item, index) => (
                            <TableRow key={index} className="border-slate-800 hover:bg-slate-900/50 transition-colors">
                                <TableCell className="font-medium text-slate-300">
                                    {item.createdAt
                                        ? new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                        : '-'}
                                </TableCell>

                                <TableCell className="text-slate-300">
                                    <div className="flex items-center gap-1">
                                        <Thermometer className="h-3 w-3 text-yellow-500" />
                                        {item.temperatura.toFixed(0)}°C
                                    </div>
                                </TableCell>

                                <TableCell className="text-slate-300">
                                    <div className="flex items-center gap-1">
                                        <Droplets className="h-3 w-3 text-blue-500" />
                                        {item.umidade}%
                                    </div>
                                </TableCell>

                                <TableCell className="text-slate-300">
                                    <div className="flex items-center gap-1">
                                        <Wind className="h-3 w-3 text-emerald-500" />
                                        {item.velocidade_vento} km/h
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-cyan-400 border border-slate-700">
                                        {item.insight_categoria?.replace('_', ' ')}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}