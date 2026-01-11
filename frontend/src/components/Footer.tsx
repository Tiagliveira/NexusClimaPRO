import { useState } from 'react';
import { Github, Linkedin, Smartphone, X, ExternalLink, QrCode as IconeQr } from 'lucide-react';
import QRCode from "react-qr-code";

interface FooterProps {
    corTema: string;
}

export function Footer({ corTema }: FooterProps) {
    const [showModal, setShowModal] = useState(false);
    const gradienteBotao = corTema || "bg-slate-700";

    const linkDestino = "https://linktr.ee/DevTO";

    return (
        <>
            <footer className="w-[calc(100%+2rem)] -mx-4 -mb-6 mt-auto py-6 border-t border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                    <div className="text-center md:text-left">
                        <p className="text-white/60 text-sm font-light">
                            Desenvolvido por <strong className="text-white hover:text-cyan-400 transition-colors cursor-pointer">Tiago Oliveira</strong>
                        </p>
                        <p className="text-white/30 text-xs mt-1">
                            © 2025 Nexus Clima. Todos os direitos reservados.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/Tiagliveira"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors hover:scale-110 transform"
                        >
                            <Github size={20} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/tiagoliveiradev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-blue-400 transition-colors hover:scale-110 transform"
                        >
                            <Linkedin size={20} />
                        </a>

                        <div className="h-6 w-px bg-white/10 mx-2 hidden md:block"></div>

                        <button
                            onClick={() => setShowModal(true)}
                            className={`flex items-center gap-2 ${gradienteBotao} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 hover:shadow-white/10`}
                        >
                            <Smartphone size={16} />
                            APP MOBILE
                        </button>
                    </div>
                </div>
            </footer>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setShowModal(false)}
                    />
                    <div className="relative bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`bg-white/10 p-3 rounded-full mb-4`}>
                                <IconeQr className="text-white h-8 w-8" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">Teste no seu Celular</h3>
                            <p className="text-white/50 text-sm mb-6">
                                Aponte a câmera para acessar o LinkTree.
                            </p>

                            <div className="bg-white p-4 rounded-xl mb-6 shadow-inner">
                                <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={linkDestino}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            </div>

                            <a
                                href={linkDestino}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl transition-colors font-medium text-sm group"
                            >
                                Acessar LinkTree
                                <ExternalLink size={14} className="text-white/30 group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}