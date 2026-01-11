import { useState, useEffect } from 'react';
import { Search, Loader2, LogOut, MapPin, AlertCircle, RefreshCw, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WeatherCard } from './components/WeatherCard';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Footer } from './components/Footer';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const TEMAS: Record<string, { bgApp: string, bgCard: string, textPro: string }> = {
  NEUTRO: { bgApp: "bg-slate-900", bgCard: "bg-gradient-to-br from-slate-700 to-slate-800", textPro: "text-slate-500" },
  CALOR_INFERNAL: { bgApp: "bg-orange-900", bgCard: "bg-gradient-to-br from-orange-500 to-red-500", textPro: "text-orange-300" },
  CALOR_PRAIA: { bgApp: "bg-blue-900", bgCard: "bg-gradient-to-br from-blue-400 to-cyan-500", textPro: "text-cyan-200" },
  FRIO_CONGELANTE: { bgApp: "bg-indigo-900", bgCard: "bg-gradient-to-br from-blue-600 to-indigo-700", textPro: "text-blue-200" },
  FRIO_LEVE: { bgApp: "bg-slate-800", bgCard: "bg-gradient-to-br from-cyan-600 to-blue-700", textPro: "text-cyan-200" },
  CHUVA: { bgApp: "bg-gray-800", bgCard: "bg-gradient-to-br from-slate-500 to-gray-600", textPro: "text-blue-200" },
  TEMPESTADE: { bgApp: "bg-purple-900", bgCard: "bg-gradient-to-br from-purple-600 to-indigo-700", textPro: "text-purple-300" },
};

export default function App() {
  const [configurado, setConfigurado] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [cidadeFixa, setCidadeFixa] = useState("");
  const [cidadePesquisa, setCidadePesquisa] = useState("");
  const [resultadoPesquisa, setResultadoPesquisa] = useState<any>(null);
  const [dadoMonitorado, setDadoMonitorado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [tema, setTema] = useState(TEMAS["NEUTRO"]);

  useEffect(() => {
    const savedCity = localStorage.getItem("nexus_cidade");
    const savedName = localStorage.getItem("nexus_nome");
    if (savedCity && savedName) {
      setCidadeFixa(savedCity);
      setNomeUsuario(savedName);
      setConfigurado(true);
      buscarMonitorado(savedCity);
    }
  }, []);

  useEffect(() => {
    const dadoAtivo = resultadoPesquisa || dadoMonitorado;
    if (dadoAtivo && dadoAtivo.insight_categoria && TEMAS[dadoAtivo.insight_categoria]) {
      setTema(TEMAS[dadoAtivo.insight_categoria]);
    } else {
      setTema(TEMAS["NEUTRO"]);
    }
  }, [resultadoPesquisa, dadoMonitorado]);

  const verificarStatusDados = (dados: any) => {
    const dataCriacao = dados?.createdAt || dados?.created_at;
    if (!dados || !dataCriacao) return { status: 'offline', cor: 'gray', texto: 'Sem Dados', hora: '--:--' };
    const dataBanco = new Date(dataCriacao);
    const agora = new Date();
    const diffMs = agora.getTime() - dataBanco.getTime();
    const diffHoras = diffMs / (1000 * 60 * 60);
    const horaFormatada = dataBanco.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    if (diffHoras > 2) return { status: 'warning', cor: 'red', texto: 'Dados Desatualizados', hora: horaFormatada };
    return { status: 'online', cor: 'green', texto: 'Sistema Online', hora: horaFormatada };
  };

  const handleStart = (nome: string, cidade: string) => {
    localStorage.setItem("nexus_nome", nome);
    localStorage.setItem("nexus_cidade", cidade);
    setNomeUsuario(nome);
    setCidadeFixa(cidade);
    setConfigurado(true);
    buscarMonitorado(cidade);
  };

  const handleLogout = () => {
    localStorage.clear();
    setConfigurado(false);
    setCidadeFixa("");
    setNomeUsuario("");
    setDadoMonitorado(null);
    setResultadoPesquisa(null);
    setErro("");
  };

  const buscarMonitorado = async (cidade: string) => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(`${API_BASE}/weather/latest?cidade=${cidade}`);
      if (res.ok) setDadoMonitorado(await res.json());
      else setErro("Não foi possível conectar ao servidor principal.");
    } catch (e) {
      console.error(e);
      setErro("Erro de conexão. Verifique sua internet.");
    } finally {
      setLoading(false);
    }
  };

  const handlePesquisa = async (e: any) => {
    e.preventDefault();
    if (!cidadePesquisa) return;
    setLoading(true);
    setErro("");
    setResultadoPesquisa(null);
    try {
      const res = await fetch(`${API_BASE}/weather/latest?cidade=${cidadePesquisa}`);
      if (res.ok) {
        const data = await res.json();
        if (!data) setErro(`Cidade '${cidadePesquisa}' não encontrada.`);
        else setResultadoPesquisa(data);
      } else {
        setErro(`Não encontramos a cidade '${cidadePesquisa}'. Verifique a digitação.`);
      }
    } catch (e) {
      console.error(e);
      setErro(`Falha ao buscar '${cidadePesquisa}'. O servidor pode estar offline.`);
    } finally {
      setLoading(false);
    }
  };

  const fecharPesquisa = () => {
    setResultadoPesquisa(null);
    setCidadePesquisa("");
    setErro("");
  };

  if (!configurado) return <WelcomeScreen onStart={handleStart} />;

  const dados = resultadoPesquisa || dadoMonitorado;
  const statusSistema = verificarStatusDados(dados);

  return (
    <div className={`min-h-screen w-full overflow-x-hidden flex flex-col items-center py-6 px-4 transition-colors duration-1000 relative ${tema.bgApp}`}>

      <div className="w-full max-w-6xl flex justify-between items-center mb-4 gap-5 min-[810px]:justify-center">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
            Nexus Clima
            <span className={`text-lg font-bold bg-white/10 px-2 rounded-md ${tema.textPro}`}>PRO</span>
          </h1>
          <div className="flex items-center gap-2 mt-1 text-white/50 text-sm font-medium uppercase tracking-widest">
            <MapPin className="h-3 w-3" />
            {loading ? "Buscando..." : (resultadoPesquisa ? resultadoPesquisa.cidade_nome : cidadeFixa)}
          </div>
        </div>

        <div className="w-full max-w-xs relative z-20 hidden min-[810px]:block">
          <form onSubmit={handlePesquisa} className="flex gap-2">
            <Input
              value={cidadePesquisa}
              onChange={(e) => setCidadePesquisa(e.target.value)}
              placeholder="Pesquisar..."
              className="bg-white/5 border-white/10 text-white h-12 backdrop-blur-md focus-visible:ring-white/20"
            />
            <Button type="submit" className="h-12 w-14 bg-white/10 hover:bg-white/20 border border-white/10" disabled={loading}>
              {loading ? <Loader2 className="animate-spin text-white" /> : <Search className="text-white" />}
            </Button>
          </form>
        </div>

        <div className="flex flex-row gap-3">
          <div className="flex flex-col items-center bg-black/10 px-3 py-1.5 rounded-md border border-white/5 ">
            <div className="flex items-center">
              <div className="relative flex h-3 w-3">
                {statusSistema.cor === 'green' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${statusSistema.cor === 'green' ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ml-2 ${statusSistema.cor === 'green' ? 'text-green-400' : 'text-red-400'}`}>
                {statusSistema.texto}
              </span>
            </div>
            {dados && (
              <span className="text-[10px] text-white/30 mt-1 font-mono flex items-center gap-1">
                <RefreshCw className="h-2 w-2" /> Atualizado:
                {statusSistema.hora}
              </span>
            )}
          </div>
          <button onClick={handleLogout} className="flex items-center text-white/30 hover:text-red-600 transition-colors text-sm font-bold mt-2">
            <LogOut className="h-8 w-8" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mb-2 block min-[810px]:hidden">
        <form onSubmit={handlePesquisa} className="flex gap-2 w-full">
          <Input
            value={cidadePesquisa}
            onChange={(e) => setCidadePesquisa(e.target.value)}
            placeholder="Pesquisar..."
            className="bg-white/5 border-white/10 text-white h-12 backdrop-blur-md focus-visible:ring-white/20 w-full"
          />
          <Button type="submit" className="h-12 w-14 bg-white/10 hover:bg-white/20 border border-white/10" disabled={loading}>
            {loading ? <Loader2 className="animate-spin text-white" /> : <Search className="text-white" />}
          </Button>
        </form>
      </div>

      {erro && (
        <div className="absolute top-24 md:top-6 right-4 md:right-auto z-50 w-full max-w-[90%] md:max-w-md bg-red-500/90 backdrop-blur-xl border border-red-400/50 rounded-xl p-4 flex items-center justify-between gap-3 shadow-2xl animate-in fade-in slide-in-from-top-5">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-white h-6 w-6 shrink-0" />
            <p className="text-white text-sm font-medium leading-tight">{erro}</p>
          </div>
          <button onClick={() => setErro("")} className="text-white/70 hover:text-white transition-colors p-1 bg-white/10 rounded-full">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="w-full flex justify-center flex-grow">
        {loading || !dados ? (
          !erro && (
            <div className="text-white/30 flex flex-col items-center mt-20 animate-pulse">
              <Loader2 className="h-16 w-16 animate-spin mb-4 text-white/20" />
              <p className="text-lg font-light tracking-widest uppercase">
                {loading ? "Sincronizando..." : "Aguardando dados..."}
              </p>
            </div>
          )
        ) : (
          <WeatherCard
            data={dados}
            corTema={tema.textPro}
            bgCard={tema.bgCard}
            nomeUsuario={nomeUsuario}
            isPesquisa={!!resultadoPesquisa}
            onFecharPesquisa={fecharPesquisa}
          />
        )}
      </div>

      <Footer corTema={tema.bgCard} />
    </div>
  );
}