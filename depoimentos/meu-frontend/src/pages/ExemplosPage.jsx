import React, { useState } from 'react';

function ExemplosPage() {
    // A lógica do modal pode ser útil aqui no futuro se você adicionar imagens clicáveis
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState('');

    const abrirImagem = (imgSrc) => {
        setCurrentImage(imgSrc);
        setIsImageViewerOpen(true);
    };

    const fecharImagem = () => {
        setIsImageViewerOpen(false);
        setCurrentImage('');
    };

    return (
        <>
            <section className="bg-gray-50 py-16 px-4 sm:px-6">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl sm:text-5xl font-slab text-gray-800">Exemplos de Vida</h1>
                        <p className="text-xl text-gray-600 mt-2">Conheça as histórias que inspiram nossa fé.</p>
                    </div>

                    <div className="space-y-16">

                        {/* Artigo: Beato Carlo Acutis */}
                        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmqWcgZPfqijUXmBdTgmhXR9P8Y_kpJYsONg&s" alt="Beato Carlo Acutis" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-3xl font-slab text-gray-900">Beato Carlo Acutis</h2>
                                    <p className="text-lg font-semibold text-blue-600">O Padroeiro da Internet</p>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-6 space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
                                <p><strong>Nascimento e Juventude:</strong><br/>Carlo Acutis nasceu em 3 de maio de 1991, em Londres, mas viveu na Itália desde pequeno. Era um jovem comum: gostava de videogames, programação, futebol e tinha um forte interesse por tecnologia...</p>
                                <p><strong>Conversão e Vida de Fé:</strong><br/>Carlo não passou por uma conversão dramática... amava tanto a Virgem Maria que ele até disse:<blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700 my-2">"A Virgem Maria é a unica mulher da minha vida"</blockquote></p>
                                <p><strong>Obra e Legado:</strong><br/>Apaixonado pela Eucaristia, Carlo usou seus conhecimentos em informática para criar um site que catalogava <span className="text-blue-600 font-semibold">milagres eucarísticos pelo mundo</span>...</p>
                                <p><strong>Doença e Morte:</strong><br/>Em 11 de outubro de 2006, Carlo foi internado... repetia sua frase mais conhecida:<blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700 my-2">"A Eucaristia é a minha estrada para o céu."</blockquote></p>
                            </div>
                        </article>

                        {/* Artigo: Santa Teresinha */}
                        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                             <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1umOyM3hr69ZUkl1ZTrpHgWhxY8l0kVC_Gg&s" alt="Santa Teresinha do Menino Jesus" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-3xl font-slab text-gray-900">Santa Teresinha do Menino Jesus</h2>
                                    <p className="text-lg font-semibold text-pink-600">A Pequena Flor de Deus</p>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-6 space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
                                <p><strong>Nascimento e Juventude:</strong><br/>Santa Teresinha nasceu em 2 de janeiro de 1873, em Alençon, na França...</p>
                                <p><strong>A aparição do Menino Jesus:</strong><br/>Durante uma grave doença em maio de 1883, o Menino Jesus apareceu a Teresinha... Segundo ela:<br/><blockquote className="border-l-4 border-yellow-400 pl-4 italic text-yellow-700 my-2">“De repente, o Menino Jesus me apareceu, belo como nunca vi, e me sorriu... naquele momento fui curada.”</blockquote></p>
                            </div>
                        </article>

                        {/* Artigo: Padre Pio */}
                        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                           <div className="flex flex-col sm:flex-row items-center gap-6">
                               <img src="https://r2.padrepauloricardo.org/c7jxv43gkrkcuh1yhdx3pgui8lif" alt="Padre Pio" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                               <div className="text-center sm:text-left">
                                   <h2 className="text-3xl font-slab text-gray-900">Padre Pio de Pietrelcina</h2>
                                   <p className="text-lg font-semibold text-rose-700">O Santo dos Estigmas</p>
                               </div>
                           </div>
                           <div className="mt-6 border-t pt-6 space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
                               <p><strong>Nascimento e Juventude:</strong><br/>Padre Pio nasceu em 25 de maio de 1887, na pequena cidade de Pietrelcina, na Itália. Seu nome de batismo era <em>Francesco Forgione</em>...</p>
                               <p><strong>Confissão de uma mulher:</strong><br/>Durante uma confissão, Padre Pio revelou a uma mulher um segredo muito profundo e doloroso: ela havia abortado um filho que, no futuro, seria um papa...</p>
                           </div>
                        </article>

                        {/* Artigo: Santa Rita de Cássia */}
                        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img src="https://i.pinimg.com/736x/7f/c9/93/7fc993e1724258e700a32c19ba25cf97.jpg" alt="Santa Rita de Cássia" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-3xl font-slab text-gray-900">Santa Rita de Cássia</h2>
                                    <p className="text-lg font-semibold text-rose-700">A Santa das Causas Impossíveis</p>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-6 space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
                                <p><strong>Nascimento e juventude:</strong><br/>Santa Rita nasceu em 1381, na pequena vila de Roccaporena, na Itália...</p>
                                <blockquote className="border-l-4 border-rose-500 pl-4 mt-3 text-lg italic text-rose-700">"Oh, Senhor, por teu amor e tuas chagas, não me abandones nas minhas dores. Tu és minha única esperança!"</blockquote>
                            </div>
                        </article>

                        {/* Artigo: São Francisco de Assis */}
                        <article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkjF72wj29FLdba_TEY_utTbB6Qt5SLjhAGQ&s" alt="São Francisco de Assis" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-3xl font-slab text-gray-900">São Francisco de Assis</h2>
                                    <p className="text-lg font-semibold text-green-700">O Santo da Simplicidade e da Paz</p>
                                </div>
                            </div>
                            <div className="mt-6 border-t pt-6 space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
                                <p><strong>Conversão e renúncia total:</strong><br/>Ao rezar na igreja de São Damião, ouviu a voz de Jesus: <span className="font-semibold text-blue-600">"Francisco, reconstrói a minha Igreja."</span>...</p>
                                <div className="border-t border-gray-300 pt-6 mt-4"><h3 className="text-2xl font-semibold text-gray-800 mb-4">🌿 Frases célebres</h3><ul className="list-disc pl-5 space-y-2 text-blue-600"><li>“Senhor, fazei de mim um instrumento da vossa paz.”</li><li>“É dando que se recebe, é perdoando que se é perdoado.”</li></ul></div>
                            </div>
                        </article>

                    </div>
                </div>
            </section>
        </>
    );
}

export default ExemplosPage;