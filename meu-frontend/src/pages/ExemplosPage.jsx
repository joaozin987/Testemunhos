import React, { useState } from 'react';

function ExemplosPage() {
   
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
            <h2 className="text-3xl font-slab text-gray-900">São Carlo Acutis</h2>
            <p className="text-lg font-semibold text-blue-600">O Padroeiro da Internet</p>
        </div>
    </div>
    <div className="mt-6 border-t pt-6 space-y-4 text-gray-700 text-lg leading-relaxed text-justify">
        <p><strong>Nascimento e Juventude:</strong><br/>Carlo Acutis nasceu em 3 de maio de 1991, em Londres, mas viveu na Itália desde pequeno. Era um jovem comum: gostava de videogames, programação, futebol e tinha um forte interesse por tecnologia e internet.</p>
        
        <p><strong>Fé e Vida Espiritual:</strong><br/>Desde criança, Carlo demonstrou grande devoção à Eucaristia. Frequentava diariamente a missa e tinha uma forte ligação com a oração. Ele costumava dizer que a Eucaristia era sua "estrada para o céu".</p>
        
        <p><strong>Obra e Legado:</strong><br/>Apaixonado por tecnologia, Carlo criou um site que catalogava <span className="text-blue-600 font-semibold"><a href='https://www.miracolieucaristici.org/' target='blank'>Milagres eucarísticos pelo mundo</a></span>. Ele acreditava que a internet poderia ser usada para evangelizar e ajudar as pessoas a conhecerem mais sobre a fé católica.</p>
        
        <p><strong>Milagres e Reconhecimento:</strong><br/>Carlo se tornou conhecido por sua vida virtuosa e foi beatificado em 2020 pelo Papa Francisco. Ele é considerado o <em>padroeiro da internet</em> por usar a tecnologia para fins educativos e espirituais. Conseguiu o Posto de Santo no ano de 2025 pelo vaticano na data de 07/09/2025.</p> 
        
        <p><strong>Doença e Falecimento:</strong><br/>Em 2006, aos 15 anos, Carlo foi diagnosticado com leucemia. Durante sua hospitalização, permaneceu alegre e confiante em Deus, oferecendo suas dores pelas pessoas. Faleceu em 12 de outubro de 2006, repetindo sua frase: 
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700 my-2">
                "A Eucaristia é a minha estrada para o céu."
            </blockquote>    
        </p>
        <p><strong>O Amor pela Virgem Maria:</strong><br></br> Carlo tinha um amor tão grande pela virgem maria que ele dizia frequentemente:
         <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700 my-2">
                "A Virgem Maria é a unica mulher da minha Vida."
            </blockquote>
        </p>
        
        <p><strong>Legado Espiritual:</strong><br/>Hoje, Carlo Acutis inspira jovens e adultos a unir fé e tecnologia. Sua vida mostra como a santidade pode ser alcançada mesmo em tempos modernos, e que pequenas ações diárias podem ter grande impacto na vida das pessoas.</p>
    </div>
</article>

<article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
  <div className="flex flex-col sm:flex-row items-center gap-6">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1umOyM3hr69ZUkl1ZTrpHgWhxY8l0kVC_Gg&s" alt="Santa Teresinha do Menino Jesus" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
    <div className="text-center sm:text-left">
      <h2 className="text-3xl font-slab text-gray-900">Santa Teresinha do Menino Jesus</h2>
      <p className="text-lg font-semibold text-pink-600">A Pequena Flor de Deus</p>
    </div>
  </div>
  <div className="mt-6 border-t pt-6 space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
    <p><strong>Nascimento e Família:</strong><br/>Santa Teresinha nasceu em 2 de janeiro de 1873, em Alençon, França, filha de Louis Martin e Zélie Guérin, ambos canonizados posteriormente. Cresceu em uma família profundamente cristã, com forte devoção e exemplos de santidade.</p>
    
    <p><strong>Infância e Formação Espiritual:</strong><br/>Desde muito cedo, Teresinha demonstrou grande sensibilidade e amor a Deus. Era alegre, carinhosa e extremamente devota. Aos quatro anos, sofreu a perda da mãe, mas continuou crescendo na fé com a orientação da família. Gostava de pequenas orações e atos de bondade, considerando que cada gesto podia ser oferecido a Deus.</p>
    
    <p><strong>Vocação Religiosa:</strong><br/>Aos 15 anos, pediu para ingressar no Carmelo de Lisieux. Sua entrada foi excepcionalmente antecipada devido à sua maturidade espiritual. Viveu na clausura como freira carmelita, dedicando-se totalmente à oração, humildade e simplicidade.</p>
    
    <p><strong>Experiências Espirituais e Missões:</strong><br/>Durante sua vida, Teresinha teve visões místicas, incluindo a aparição do Menino Jesus durante uma doença grave em 1883, que a curou. Desenvolveu a <a className='text-red-600' href='https://padrepauloricardo.org/episodios/a-pequena-via-de-santa-teresinha-do-menino-jesus' target='blank'>"pequena via"</a>, ensinando que a santidade se encontra em pequenos atos de amor, oferecidos a Deus com confiança e alegria.</p>
    
    <p><strong>Escritos e Legado:</strong><br/>Escreveu seu famoso livro <em className='text-blue-600'><a href='https://loja.cancaonova.com/livro-historia-de-uma-alma' target='blank'>História de uma Alma</a></em>, onde relata sua vida, experiências espirituais e ensinamentos. Tornou-se modelo de santidade para pessoas comuns, mostrando que qualquer pessoa pode alcançar a santidade através de amor simples e fiel.</p>
    
    <p><strong>Milagres e Reconhecimento:</strong><br/>Após sua morte em 30 de setembro de 1897, aos 24 anos, numerosos milagres foram atribuídos à sua intercessão. Foi canonizada em 17 de maio de 1925 pelo Papa Pio XI, sendo proclamada Doutora da Igreja em 1997 pelo Papa João Paulo II.</p>
    
    <p><strong>Frases Célebres:</strong><br/>
      <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-yellow-700 my-2">“Quero passar meu céu fazendo o bem na terra.”</blockquote>
      <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-yellow-700 my-2">“A santidade não consiste em fazer coisas extraordinárias, mas em fazer tudo com amor.”</blockquote>
    </p>
    
    <p><strong>Legado Atual:</strong><br/>Santa Teresinha é padroeira das missões, exemplo de humildade e devoção, e inspiração espiritual para milhões de pessoas ao redor do mundo. Seu caminho de amor simples e profundo continua influenciando jovens e adultos na fé cristã.</p>
  </div>
</article>


<article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
  <div className="flex flex-col sm:flex-row items-center gap-6">
    <img src="https://r2.padrepauloricardo.org/c7jxv43gkrkcuh1yhdx3pgui8lif" alt="Padre Pio" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
    <div className="text-center sm:text-left">
      <h2 className="text-3xl font-slab text-gray-900">Padre Pio de Pietrelcina</h2>
      <p className="text-lg font-semibold text-rose-700">O Santo dos Estigmas</p>
    </div>
  </div>
  <div className="mt-6 border-t pt-6 space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
    <p><strong>Nascimento e Juventude:</strong><br/>Padre Pio nasceu em 25 de maio de 1887, na pequena cidade de Pietrelcina, Itália, com o nome de batismo Francesco Forgione. Desde criança demonstrou grande devoção a Deus e profunda sensibilidade espiritual.</p>

    <p><strong>Vocação e Vida Religiosa:</strong><br/>Aos 15 anos ingressou na Ordem dos Frades Capuchinhos. Viveu uma vida marcada por intensa oração, penitência e dedicação aos pobres e doentes. Recebeu os estigmas em 1918, tornando-se conhecido mundialmente como o "Santo dos Estigmas".</p>

    <p><strong>Milagres e Confissões:</strong><br/>Padre Pio era famoso por suas confissões, que duravam horas. Muitos fiéis relataram experiências espirituais e curas milagrosas por sua intercessão. Seus dons incluíam bilocação, leitura de corações e profecias.</p>

    <p><strong>Doença e Morte:</strong><br/>Sofreu diversas doenças, incluindo os efeitos do estigma, mas manteve sua fé inabalável. Faleceu em 23 de setembro de 1968, deixando uma legião de seguidores e inúmeros relatos de milagres.</p>

    <p><strong>Legado e Canonização:</strong><br/>Foi canonizado em 16 de junho de 2002 pelo Papa João Paulo II. Padre Pio continua sendo inspiração de fé, oração e penitência, principalmente para aqueles que buscam consolo espiritual.</p>

    <p><strong>Frases Célebres:</strong><br/>
      <blockquote className="border-l-4 border-rose-500 pl-4 italic text-rose-700 my-2">"Faça o bem, não se canse de fazer o bem, pois no tempo certo colherá a recompensa."</blockquote>
      <blockquote className="border-l-4 border-rose-500 pl-4 italic text-rose-700 my-2">"A oração é a chave do dia e a fechadura da noite."</blockquote>
    </p>
  </div>
</article>
<article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
  <div className="flex flex-col sm:flex-row items-center gap-6">
    <img src="https://i.pinimg.com/736x/7f/c9/93/7fc993e1724258e700a32c19ba25cf97.jpg" alt="Santa Rita de Cássia" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
    <div className="text-center sm:text-left">
      <h2 className="text-3xl font-slab text-gray-900">Santa Rita de Cássia</h2>
      <p className="text-lg font-semibold text-rose-700">A Santa das Causas Impossíveis</p>
    </div>
  </div>
  <div className="mt-6 border-t pt-6 space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
    <p><strong>Nascimento e Juventude:</strong><br/>Santa Rita nasceu em 1381, na vila de Roccaporena, Itália. Desde pequena, demonstrou devoção intensa e desejo de seguir a vida religiosa, apesar de se casar jovem.</p>

    <p><strong>Casamento e Família:</strong><br/>Foi casada com um homem violento, mas permaneceu paciente e dedicada. Teve filhos, educando-os na fé e ensinando o perdão. Após a morte do marido e filhos, conseguiu ingressar no convento das Agostinianas em Cássia.</p>

    <p><strong>Vida Religiosa e a Chaga de Cristo:</strong><br/>No convento, Santa Rita se destacou por oração intensa, penitência e amor aos pobres. Em 1442, recebeu uma chaga em sua testa, que lembrava a coroa de espinhos de Cristo, tornando-se símbolo de união com o sofrimento de Jesus. Muitos milagres foram atribuídos à sua intercessão, especialmente em causas impossíveis.</p>

    <p><strong>Morte e Milagre das Rosas:</strong><br/>Santa Rita faleceu em 22 de maio de 1457. Após sua morte, os freiras do convento relataram que o ambiente se encheu de um perfume de rosas, considerado um sinal da santidade de sua vida e da aceitação de suas preces por Deus.</p>

    <p><strong>Frases e Legado:</strong><br/>
      <blockquote className="border-l-4 border-rose-500 pl-4 italic text-rose-700 my-2">"Oh, Senhor, por teu amor e tuas chagas, não me abandones nas minhas dores."</blockquote>
      <blockquote className="border-l-4 border-rose-500 pl-4 italic text-rose-700 my-2">"Com amor, tudo se torna possível."</blockquote>
    </p>

    <p><strong>Canonização:</strong><br/>Santa Rita foi canonizada em 24 de maio de 1900 pelo Papa Leão XIII. É padroeira das causas impossíveis e exemplo de fé, paciência e perseverança.</p>
  </div>
</article>


<article className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-lg">
  <div className="flex flex-col sm:flex-row items-center gap-6">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkjF72wj29FLdba_TEY_utTbB6Qt5SLjhAGQ&s" alt="São Francisco de Assis" className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" />
    <div className="text-center sm:text-left">
      <h2 className="text-3xl font-slab text-gray-900">São Francisco de Assis</h2>
      <p className="text-lg font-semibold text-green-700">O Santo da Simplicidade e da Paz</p>
    </div>
  </div>
  <div className="mt-6 border-t pt-6 space-y-6 text-gray-700 text-lg leading-relaxed text-justify">
    <p><strong>Nascimento e Juventude:</strong><br/>São Francisco nasceu em 1181 ou 1182, em Assis, Itália, filho de um próspero comerciante. Durante a juventude, levou uma vida despreocupada, apreciando festas, amigos e bens materiais.</p>

    <p><strong>Conversão e Renúncia:</strong><br/>Após diversas experiências espirituais, incluindo a visão de Cristo na igreja de São Damião, Francisco renunciou a riqueza familiar e adotou uma vida de pobreza radical, dedicando-se totalmente a Deus e ao serviço dos pobres e doentes.</p>

    <p><strong>Fundação da Ordem Franciscana:</strong><br/>Em 1209, fundou a Ordem dos Frades Menores (Franciscanos), enfatizando simplicidade, humildade e amor à criação. Recebeu os estigmas de Cristo em 1224, tornando-se o primeiro santo a ter as chagas visíveis.</p>

    <p><strong>Amor à Natureza e Animais:</strong><br/>São Francisco tinha profundo amor por toda a criação. Era conhecido por pregar aos pássaros e se relacionar com animais, reconhecendo-os como irmãos e irmãs na obra de Deus.</p>

    <p><strong>Frases e Ensinamentos:</strong><br/>
      <ul className="list-disc pl-5 space-y-2 text-blue-600">
        <li>“Senhor, fazei de mim um instrumento da vossa paz.”</li>
        <li>“É dando que se recebe, é perdoando que se é perdoado.”</li>
        <li>“Onde há ódio, que eu leve o amor; onde há ofensa, que eu leve o perdão.”</li>
      </ul>
    </p>

    <p><strong>Morte e Legado:</strong><br/>São Francisco faleceu em 3 de outubro de 1226, em Assis. Seu exemplo de simplicidade, amor e humildade influenciou profundamente a Igreja e a humanidade. É padroeiro da ecologia e das causas de paz, sendo lembrado como o Santo que mais amou a criação de Deus.</p>
  </div>
</article>

                    </div>
                </div>
            </section>
        </>
    );
}

export default ExemplosPage;