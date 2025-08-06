import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

// PASSO 1: TODO O SEU CONTEÚDO ESTÁ AQUI, ORGANIZADO EM UMA LISTA.
const saintsData = [
  {
    id: 1,
    name: 'Beato Carlo Acutis',
    title: 'O Padroeiro da Internet',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmqWcgZPfqijUXmBdTgmhXR9P8Y_kpJYsONg&s',
    biography: (
      <>
        <p><strong>Nascimento e Juventude:</strong><br />Carlo Acutis nasceu em 3 de maio de 1991, em Londres, mas viveu na Itália desde pequeno. Era um jovem comum: gostava de videogames, programação, futebol e tinha um forte interesse por tecnologia...</p>
        <p><strong>Conversão e Vida de Fé:</strong><br />Carlo não passou por uma conversão dramática... amava tanto a Virgem Maria que ele até disse:<blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700">"A Virgem Maria é a unica mulher da minha vida"</blockquote></p>
        <p><strong>Obra e Legado:</strong><br />Apaixonado pela Eucaristia, Carlo usou seus conhecimentos em informática para criar um site que catalogava <span className="text-accent200">milagres eucarísticos pelo mundo</span>...</p>
        <p><strong>Doença e Morte:</strong><br />Em 11 de outubro de 2006, Carlo foi internado... repetia sua frase mais conhecida:<blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700">"A Eucaristia é a minha estrada para o céu."</blockquote></p>
        <p><strong>Beatificação:</strong><br />Foi beatificado em 10 de outubro de 2020, em Assis...</p>
        <p><strong>Milagres:</strong><br />O milagre que permitiu a beatificação de Carlo aconteceu em Campo Grande (MS), Brasil...</p>
      </>
    )
  },
  {
    id: 2,
    name: 'Santa Teresinha do Menino Jesus',
    title: 'A Pequena Flor de Deus',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1umOyM3hr69ZUkl1ZTrpHgWhxY8l0kVC_Gg&s',
    biography: (
       <>
       <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
      <p><strong>Nascimento e Juventude:</strong><br />
      Santa Teresinha nasceu em 2 de janeiro de 1873, em Alençon, na França. Seu nome de batismo era <em>Marie Françoise-Thérèse Martin</em>. Era a caçula de nove filhos do casal Luís e Zélia Martin, ambos canonizados. Desde cedo, Teresinha demonstrava grande sensibilidade, fé e um amor profundo por Jesus. Ficou órfã de mãe aos 4 anos, o que marcou muito sua infância.</p>

      <p><strong>Vocação precoce e entrada no Carmelo:</strong><br />
      Desde pequena, desejava ser freira. Aos 15 anos, pediu pessoalmente ao Papa Leão XIII para entrar no Carmelo de Lisieux, o que foi autorizado pouco depois. Viveu no convento com simplicidade, humildade e grande amor.</p>

      <p><strong>Obra e espiritualidade:</strong><br />
      Santa Teresinha desenvolveu uma espiritualidade conhecida como <a className="text-accent200" href="https://bibliotecacatolica.com.br/blog/formacao/o-que-e-a-pequena-via/?srsltid=AfmBOorLHvRZOWrRkjTnsjS23wJoVVypgX8lphs_FuQsWUwqiicu87bl" target="_blank" rel="noopener noreferrer">“Pequena Via”</a>, baseada em fazer as pequenas coisas com grande amor. Ela ensinava que não é necessário realizar grandes feitos para agradar a Deus, mas sim viver com humildade e confiança. Sua autobiografia, <a className="text-accent200" href="https://pt.wikipedia.org/wiki/Hist%C3%B3ria_de_uma_alma" target="_blank" rel="noopener noreferrer"> História de uma Alma</a>, tocou milhões de pessoas após sua morte.</p>

      <p><strong>A aparição do Menino Jesus:</strong><br />
      Durante uma grave doença em maio de 1883, o Menino Jesus apareceu a Teresinha, trazendo um sorriso que lhe curou a alma e o corpo. Segundo ela:<br />
      <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-yellow-700">
        “De repente, o Menino Jesus me apareceu, belo como nunca vi, e me sorriu... naquele momento fui curada.”
      </blockquote>
      Este momento marcou sua profunda devoção à infância de Cristo e inspirou seu nome religioso: <em>Teresa do Menino Jesus e da Sagrada Face</em>.</p>

      <p><strong>Doença e morte:</strong><br />
      Aos 24 anos, foi acometida pela tuberculose. Mesmo com muito sofrimento, manteve a paz, a fé e a entrega total a Deus. Faleceu em 30 de setembro de 1897, deixando como últimas palavras:</p>

      <blockquote className="border-l-4 border-pink-500 pl-4 italic text-pink-700">
        "Oh! Eu não me arrependo de ter me entregado ao Amor."
      </blockquote>

       <p><strong>Milagres:</strong><br />
        O milagre reconhecido oficialmente para a canonização de Santa Teresinha envolveu a cura de uma freira francesa chamada Sister Pauline Martin (prima de Teresinha), que sofria de uma grave doença no fígado. Após a oração e intercessão de Santa Teresinha, ela teve uma recuperação considerada inexplicável pela medicina da época.
      </p>
      
      <p><strong>Canonização e legado:</strong><br />
      Canonizada em 1925, foi declarada <strong>Doutora da Igreja</strong> em 1997 por São João Paulo II. É Padroeira das Missões, mesmo nunca tendo saído do convento, por oferecer tudo pelas almas e pela Igreja.</p>

      <p><strong>Inspiração:</strong><br />
      Santa Teresinha nos ensina que a santidade está nas pequenas atitudes feitas com grande amor. Seu desejo mais profundo era:</p>

      <blockquote className="border-l-4 border-rose-500 pl-4 italic text-rose-700">
        "Quero passar meu céu fazendo o bem na terra."
      </blockquote>
    </div>
       </>
    )
  },
  {
    id: 3,
    name: 'Padre Pio',
    title: 'O Santo dos Estigmas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk',
    biography :    (
      <>
       <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
         <p><strong>Nascimento e Juventude:</strong><br />
        Padre Pio nasceu em 25 de maio de 1887, na pequena cidade de Pietrelcina, na Itália. Seu nome de batismo era <em>Francesco Forgione</em>. Desde criança demonstrava uma fé profunda e grande desejo de servir a Deus.</p>

      <p><strong>Vocação e vida religiosa:</strong><br />
        Entrou na Ordem dos Frades Capuchinhos ainda jovem, recebendo o hábito em 1903 e sendo ordenado sacerdote em 1910. Passou a viver na pequena cidade de San Giovanni Rotondo, onde ficaria famoso por seus dons espirituais.</p>

      <p><strong>Os estigmas:</strong><br />
        Em 1918, Padre Pio recebeu os <span className="text-rose-700">estigmas</span>, as chagas visíveis nas mãos, pés e lado, que correspondiam às feridas de Cristo crucificado. Esses sinais permaneceram com ele por mais de 50 anos, causando dor e sofrimento, mas também atraindo muitos fiéis.</p>

      <p><strong>Dons espirituais e milagres:</strong><br />
        Padre Pio ficou conhecido por sua capacidade de:<br />
        - Ler corações e confessar com uma profundidade espiritual única;<br />
        - Realizar curas milagrosas;<br />
        - Bilocação (estar em dois lugares ao mesmo tempo);<br />
        - Profecias;<br />
        - Eucaristias longas e intensas.<br />
        Milhares de pessoas buscavam sua orientação espiritual e oração.</p>

      <p><strong>A luta diária contra o demônio:</strong><br />
        Padre Pio enfrentou intensas batalhas espirituais ao longo de toda a sua vida. Ele relatava que o demônio o atacava constantemente, tentando desviá-lo da sua missão de servir a Deus e ajudar as almas. Essas batalhas não eram apenas interiores, mas também manifestavam-se fisicamente, causando sofrimento ao santo.<br />
        Curiosamente, ele dizia que <span className="text-rose-700">o demônio nunca o atacava no dia de São José</span>, o seu santo protetor. Para Padre Pio, São José era um guardião poderoso e uma fonte de proteção contra as forças do mal.</p>

      <p><strong>Vida de oração e sacrifício:</strong><br />
        Vivia uma rotina rigorosa de oração, penitência e ajuda aos necessitados. Era também muito dedicado à celebração da Missa, que realizava com grande reverência.</p>

      <p><strong>Confissão de uma mulher:</strong><br />
          Durante uma confissão, Padre Pio revelou a uma mulher um segredo muito profundo e doloroso: ela havia abortado um filho que, no futuro, seria um papa. A mulher, surpresa e tocada por essa revelação, compreendeu a gravidade e o impacto espiritual daquele gesto e acabou desmaiando.</p>

      <p><strong>Falecimento e canonização:</strong><br />
        Faleceu em 23 de setembro de 1968. Foi canonizado em 2002 pelo Papa João Paulo II, que destacou sua vida de fé, dor e amor a Deus.</p>

      <p><strong>Legado e inspiração:</strong><br />
        Padre Pio nos ensina o valor do sofrimento oferecido com amor, a importância do perdão e da confissão, e a certeza de que Deus age no meio da dor para transformar vidas.</p>
      
      </div>

      </>
    )
  },
  {
    id: 4,
    name: 'Santa Rita de Cássia',
    title: 'A Santa das Causas Impossíveis',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13J',
    biography: (
      <>
      <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p><strong>Nascimento e Juventude:</strong><br />
        Santa Rita nasceu em 1381, na pequena vila de Roccaporena, na Itália. Desde criança demonstrava grande piedade e desejava seguir a vida religiosa, mas por obediência aos pais, casou-se ainda jovem com Paolo Mancini.</p>
        
        <p><strong>Vida de Casamento:</strong><br />
        Paolo era um homem rude e violento. Rita, com fé e paciência, orou por sua conversão e conseguiu que ele mudasse de vida pouco antes de ser assassinado. Seus dois filhos desejaram vingar a morte do pai, mas Rita pediu a Deus que os levasse antes que cometessem esse pecado. Ambos adoeceram e faleceram pouco depois.</p>
        
        <p><strong>Entrada no convento:</strong><br />
        Após perder a família, Rita desejava entrar no convento agostiniano de Cássia. Foi recusada várias vezes por ser viúva. Segundo a tradição, três santos — Santo Agostinho, São Nicolau de Tolentino e São João Batista — a levaram milagrosamente para dentro do convento durante a noite. Assim, as irmãs aceitaram sua entrada.</p>
        
       <p><strong>O estigma doloroso e rejeição:</strong><br />
        Durante a oração, um espinho da coroa de Cristo desprendeu-se milagrosamente e feriu sua testa. A ferida tornou-se profunda e exalava um odor fétido, tão intenso que causava incômodo às outras freiras, levando-as a isolá-la. Mesmo assim, Rita suportou com humildade e ofereceu tudo por amor a Cristo.</p>
        
        <p><strong>Milagre da Rosa:</strong><br />
         Nos últimos dias de sua vida, mesmo gravemente doente e no frio do inverno, pediu a uma visitante que colhesse uma rosa em seu jardim. Milagrosamente, a rosa foi encontrada florida. Após sua morte, em 22 de maio de 1457, o cheiro de rosas invadiu o convento, substituindo o odor fétido de sua ferida. Era um sinal de sua santidade.</p>
        
        <p><strong>Estigmas e Morte:</strong><br />
        Rita recebeu os estigmas de Cristo em sua testa, simbolizando sua união com o sofrimento de Jesus. Faleceu em 22 de maio de 1457, após uma vida de oração e sacrifício.</p>
        
        <p><strong>Canonização:</strong><br />
        Santa Rita foi canonizada em 1900 pelo Papa Leão XIII. É conhecida como a santa das causas impossíveis e é invocada por aqueles que enfrentam situações desesperadoras.</p>
      </div>
      </> 
    )
  },
  {
    id: 5,
    name: 'São Francisco de Assis',
    title: 'O Santo da Natureza',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13Jf',
    biography: (
      <>
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p><strong>Nascimento e Juventude:</strong><br />
        São Francisco de Assis nasceu em 1181, em Assis, na Itália. Filho de um rico comerciante, teve uma juventude despreocupada e cheia de festas. No entanto, sentia um vazio interior e buscava algo mais profundo.</p>            
        <p><strong>Conversão e Vocação:</strong><br />
        Durante uma guerra entre Assis e Perugia, Francisco foi capturado e passou um ano na prisão. Essa experiência o levou a uma profunda conversão espiritual. Após uma visão em que ouviu a voz de Cristo dizendo: <span className="text-green-700">"Francisco, restaura minha Igreja"</span>, decidiu dedicar sua vida a Deus.</p>
        <p><strong>Vida de Pobreza e Humildade:</strong><br />
        Abandonou todos os bens materiais e começou a viver em extrema pobreza, pregando o amor de Deus e a simplicidade. Rejeitou as riquezas e o conforto, vivendo como um verdadeiro mendigo. Sua vida de pobreza radical inspirou muitos a segui-lo.</p>
        <p><strong>Fundação da Ordem Franciscana:</strong><br />
        Em 1209, fundou a Ordem dos Frades Menores, conhecida como Ordem Franciscana. Seu ideal era viver em harmonia com a natureza e com todos os seres vivos. A regra da ordem enfatizava a pobreza, a humildade e o amor ao próximo.</p>
        <p><strong>Amor pela Natureza:</strong><br />
        São Francisco tinha um amor profundo pela natureza, considerando-a uma criação de Deus. Ele via todos os seres como irmãos e irmãs, chamando o sol de "Irmão Sol"
        e a lua de "Irmã Lua". Sua famosa oração, <span className="text-blue-700">"Cântico das Criaturas"</span>, expressa sua reverência por toda a criação:</p>
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-blue-700">
          "Louvado sejas, meu Senhor, por todas as tuas criaturas, especialmente por nosso irmão sol, que nos dá o dia e a luz..."
        </blockquote>
        <p><strong>Os Estigmas:</strong><br />
        Em 1224, durante um retiro no Monte Alverne, recebeu os estigmas de Cristo, as chagas visíveis que simbolizavam sua união com o sofrimento de Jesus. Ele se tornou o primeiro santo a receber esses sinais visíveis.</p>
        <p><strong>Morte e Canonização:</strong><br />
        Faleceu em 3 de outubro de 1226, aos 44 anos, após uma vida de intensa oração e serviço. Foi canonizado pelo Papa Gregório IX em 1228, apenas dois anos após sua morte. É o padroeiro dos animais, do meio ambiente e dos ecologistas.</p>
        <p><strong>Legado:</strong><br />   
        O legado de São Francisco é um chamado à simplicidade, à paz e ao amor por toda a criação. Sua vida inspira milhões a viverem com compaixão, humildade e respeito por todas as criaturas de Deus.</p>
        </div>
      </>
    )

  },
  {
    id: 6,
    name: 'Sao Bento',
    title: 'O Pai do Monasticismo Ocidental',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk2y8mJH5jv1eX13JfX1Yk',
    biography: (
      <>
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p><strong>Nascimento e Juventude:</strong><br />
        São Bento nasceu em 480 d.C. em Núrsia, na Itália. Desde jovem, demonstrou grande interesse pela vida espiritual e buscava uma vida de oração e contemplação.</p>
        <p><strong>Vida Monástica:</strong><br />
        Aos 20 anos, decidiu abandonar o mundo e se retirar para uma caverna em Subiaco, onde viveu como eremita por três anos. Durante esse tempo, muitos começaram a procurá-lo em busca de orientação espiritual.</p>
        <p><strong>Fundação da Ordem Beneditina:</strong><br />
        Em 529, fundou o mosteiro de Monte Cassino, onde estabeleceu uma regra monástica que se tornaria a base para a vida monástica ocidental. A Regra de São Bento enfatiza a oração, o trabalho, a humildade e a obediência.</p>
        <p><strong>A Regra de São Bento:</strong><br />
        A Regra de São Bento é um conjunto de diretrizes para a vida monástica, que inclui:<br />
        - Oração diária e celebração da Liturgia das Horas;<br />
        - Trabalho manual e intelectual;<br />
        - Vida comunitária e obediência ao abade;<br />
        - Hospitalidade e acolhimento aos peregrinos.<br />
        A regra é conhecida por seu equilíbrio e sabedoria, promovendo uma vida de oração e trabalho.</p>
        <p><strong>Milagres e Intercessão:</strong><br />
        São Bento é conhecido por realizar milagres, como curas e proteção contra o mal. Um dos mais famosos é o milagre do cálice envenenado, onde ele abençoou um cálice que havia sido envenenado por um monge invejoso, e o veneno se quebrou em pedaços.</p>
        <p><strong>Legado e Influência:</strong><br />
        São Bento é considerado o pai do monasticismo ocidental. Sua regra influenciou profundamente a vida monástica na Europa e é ainda hoje seguida por muitas comunidades beneditinas. Ele é o padroeiro da Europa e dos monges.</p>
        <p><strong>Morte e Canonização:</strong><br />
        Faleceu em 547 d.C. em Monte Cassino, onde foi sepultado. Foi canonizado pelo Papa Gregório I no século VI. Sua festa é celebrada em 11 de julho.</p>
        <p><strong>Inspiração:</strong><br />
        São Bento nos ensina a importância da oração, do trabalho e da vida comunitária. Ele disse:<br />
        <blockquote className="border-l-4 border-green-500 pl-4 italic text-green-700">
          "Ora et labora" (Reza e trabalha)
        </blockquote>
        Essa frase resume sua filosofia de vida, que ainda inspira muitos a buscarem um equilíbrio entre a vida espiritual e o trabalho.</p>
        </div>
      </>
    )
  },
  {
    id: 7,
    name: 'Santa Faustina Kowalska',
    title: 'A Apóstola da Misericórdia',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13',
    biography: (
      <>
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p><strong>Nascimento e Juventude:</strong><br />
        Santa Faustina Kowalska nasceu em 25 de agosto de 1905, na Polônia. Desde jovem, sentia uma forte vocação religiosa e desejava entrar em um convento. Trabalhou como empregada doméstica para ajudar sua família antes de entrar na vida religiosa.</p>
        <p><strong>Vida Religiosa:</strong><br />
        Em 1925, Faustina entrou na Congregação das Irmãs da Misericórdia, onde viveu uma vida de oração, penitência e serviço aos pobres. Ela tinha uma vida simples, mas profunda, dedicada à contemplação da misericórdia de Deus.</p> 
        <p><strong>Visões e Revelações:</strong><br />
        Santa Faustina teve visões de Jesus, que lhe revelou a importância da misericórdia divina. Em uma dessas visões, Jesus pediu que ela pintasse uma imagem dele com as palavras <span className="text-blue-700">"Jesus, eu confio em Vós"</span>, que se tornaria a famosa imagem da Divina Misericórdia. Ele também lhe pediu que propagasse a devoção à Sua misericórdia.</p>
        <p><strong>O Diário de Santa Faustina:</strong><br />
        Santa Faustina escreveu um diário espiritual, conhecido como <a className="text-accent200" href="https://pt.wikipedia.org/wiki/Di%C3%A1rio_de_Santa_Faustina" target="_blank" rel="noopener noreferrer">"Diário: A Misericórdia Divina na Minha Alma"</a>, onde registrou suas experiências místicas, vis
ões e ensinamentos de Jesus sobre a misericórdia. O diário é uma fonte rica de espiritualidade e ensinamentos sobre a confiança em Deus.</p>
        <p><strong>Oração da Divina Misericórdia:</strong><br />
        Jesus revelou a Santa Faustina a importância da oração da Divina Misericórdia, que deve ser rezada às 3 horas da tarde, a hora da morte de Jesus. A oração é uma súplica pela misericórdia de Deus sobre o mundo e sobre as almas, e é recitada com o Rosário da Misericórdia.</p>
        <p><strong>Doença e Morte:</strong><br />
        Santa Faustina adoeceu gravemente em 1937, sofrendo de tuberculose. Mesmo em meio ao sofrimento, ela manteve sua fé e confiança em Deus. Faleceu em 5 de outubro de 1938, com apenas 33 anos. Sua última palavra foi "Misericórdia".</p>
        <p><strong>Canonização:</strong><br />
        Santa Faustina foi canonizada pelo Papa João Paulo II em 30 de abril de 2000, e sua festa é celebrada em 5 de outubro. Ela é a padroeira da Divina Misericórdia e é amplamente venerada por sua mensagem de confiança em Deus e misericórdia para com os outros.</p>
        <p><strong>Legado e Inspiração:</strong><br />
        Santa Faustina nos ensina a importância da misericórdia divina e da confiança em Deus. Sua vida e ensinamentos inspiram milhões de pessoas a buscarem a misericórdia de Deus e a praticarem a compaixão com os outros. Ela disse:</p>
        <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-700">
          "A misericórdia é o maior atributo de Deus. É o amor que se inclina para o sofrimento do outro."
        </blockquote>
        </div>
      </>
    )
  },
  {
    id: 8,
    name: 'Santa efigênia',
    title: 'A Santa Protetora dos Músicos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX1Yk2y8mJH5jv1eX13',
    biography: (
      <>
        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
        <p><strong>Nascimento e Juventude:</strong><br />
        Santa Efigênia nasceu no século III, em uma família nobre na cidade de Alexandria, no Egito. Desde jovem, demonstrou grande fé em Cristo e um amor profundo pela música, especialmente pela música sacra.</p>
        <p><strong>Conversão e Vida Cristã:</strong><br />
        Efigênia se converteu ao cristianismo após ouvir a pregação de um missionário cristão. Sua fé era tão forte que ela decidiu dedicar sua vida a Deus, abandonando as riquezas e o conforto de sua família. Ela começou a usar sua habilidade musical para louvar a Deus e evangelizar outros.</p>
        <p><strong>Perseguição e Martirio:</strong><br />
        Durante o reinado do imperador romano Diocleciano, Efigênia foi perseguida por sua fé cristã. Ela se recusou a renunciar a Cristo, mesmo diante de torturas e ameaças.
        Finalmente, foi condenada à morte por decapitação. Antes de sua execução, ela compôs uma última canção de louvor a Deus, expressando sua fé e confiança na vida eterna.</p>
        <p><strong>Oração e Intercessão:</strong><br />
        Santa Efigênia é invocada como a padroeira dos músicos e cantores. Sua vida de fé e devoção à música a torna uma intercessora especial para aqueles que trabalham com música, especialmente na liturgia e na evangelização através da arte musical. Muitos músicos e cantores rezam pedindo sua proteção e inspiração.</p>
        <p><strong>Legado e Inspiração:</strong><br />
        Santa Efigênia é lembrada por sua coragem, fé inabalável e amor pela música. Ela nos ensina a importância de usar nossos talentos para glorificar a Deus e servir aos outros. Sua vida é um exemplo de como a música pode ser uma forma poderosa de louvor e evangelização.</p>
        <p><strong>Festa e Veneração:</strong><br />
        A festa de Santa Efigênia é celebrada em 11 de janeiro. Ela é venerada especialmente na tradição cristã oriental, onde é considerada uma mártir e santa. Sua imagem é frequentemente retratada com um instrumento musical, simbolizando sua dedicação à música e ao louvor a Deus.</p>
        <p><strong>Inspiração:</strong><br />
        Santa Efigênia nos inspira a viver nossa fé com coragem, a usar nossos talentos para o bem e a confiar em Deus, mesmo nas dificuldades. Ela disse:</p>
        <blockquote className="border-l-4 border-pink-500 pl-4 italic text-pink-700">
          "A música é a linguagem do céu, e através dela podemos tocar o coração de Deus."
        </blockquote>
        </div>
      </>
    )
  },
];

function ExemplosPage() {
  return (
    <>
      <Navbar />

      <div className="bg-accent200">
        <div className="p-8 text-center rounded-2xl mt-10">
          <h1 className="font-slab text-[2.0rem] text-bg100 m-0">DEUS MUDOU MEU VIVER</h1>
          <p className="font-slab text-[2.0rem] text-bg100 mt-4">Exemplos de Fé: Conheça as Histórias dos Santos</p>
        </div>

        {/* PASSO 2: A "FÁBRICA" QUE USA O MOLDE E OS DADOS */}
        {saintsData.map((saint) => (
          <section key={saint.id} className="bg-white py-12 px-6 md:px-20">
            <div className="md:flex items-start gap-8">
              <img src={saint.image} alt={saint.name} className="w-full md:w-64 rounded-xl shadow-md mb-4 md:mb-0" />
              <div>
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-slab text-center text-gray-800 mb-8">
                    {saint.name} – {saint.title}
                  </h2>
                  <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                    {saint.biography}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        <footer className="bg-accent200 text-bg100 text-center py-6 mt-10">
          <p>© 2025 Conectados pela Fé. Todos os direitos reservados.</p>
        </footer>
      </div>
    </>
  );
}

export default ExemplosPage;