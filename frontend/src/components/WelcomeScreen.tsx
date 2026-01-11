import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Rocket, MapPin, User } from "lucide-react";

interface WelcomeScreenProps {
    onStart: (nome: string, cidade: string) => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    const [nome, setNome] = useState("");
    const [cidade, setCidade] = useState("");

    const handleSubmit = () => {
        if (nome && cidade) {
            onStart(nome.trim(), cidade.trim());
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white shadow-2xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto bg-cyan-500/10 p-4 rounded-full w-fit">
                        <Rocket className="h-12 w-12 text-cyan-400" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                        Bem-vindo ao Nexus
                    </CardTitle>
                    <p className="text-slate-400">Configure seu perfil para começar o monitoramento.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <User className="h-4 w-4" /> Seu Nome
                        </label>
                        <Input
                            placeholder="Como quer ser chamado?"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="bg-slate-950 border-slate-700 text-white h-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Sua Cidade Principal
                        </label>
                        <Input
                            placeholder="Ex: São Paulo"
                            value={cidade}
                            onChange={(e) => setCidade(e.target.value)}
                            className="bg-slate-950 border-slate-700 text-white h-12"
                        />
                    </div>
                    <Button
                        className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-lg font-bold mt-4"
                        onClick={handleSubmit}
                        disabled={!nome.trim() || !cidade.trim()}
                    >
                        Acessar Sistema
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}