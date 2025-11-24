import React, { useState } from 'react';
import mariaData from '../data/maria.json';
import { normalizarTexto } from '../utils/normalizarTexto';
function MuseuPage() {
  
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
 
   const [maryInput, setMaryInput] = useState('');
  const [maryMessage, setMaryMessage] = useState('');

 const buscarMensagemMary = () => {
  const termo = normalizarTexto(maryInput);

  if (!termo) {
    setMaryMessage('Digite um título mariano para buscar.');
    return;
  }

  const chavesNormalizadas = Object.keys(mariaData).reduce((acc, key) => {
    acc[normalizarTexto(key)] = mariaData[key];
    return acc;
  }, {});

  if (chavesNormalizadas[termo]) {
    const msgs = chavesNormalizadas[termo];
    const idx = Math.floor(Math.random() * msgs.length);
    const msg = msgs[idx];
    setMaryMessage(`"${msg.text}" — ${msg.source}`);
  } else {
    setMaryMessage('Nenhuma mensagem encontrada para esse título.');
  }
};

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
    
          <section className="py-10">
        <div className="bg-blue-800 p-8 text-center rounded-2xl max-w-4xl mx-auto">
          <h1 className="font-slab text-4xl sm:text-4xl text-white m-0">Museu das Palavras</h1>
          <p className="font-slab text-2xl text-gray-200 m-0 mt-2">Frases que atravessam os séculos para tocar o coração</p>
        </div>

        {/* Galeria de Cards com Citações */}
        <div className="mt-8 max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="/img/testemunho27.jpeg" alt="Imagem de Eucaristia" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho27.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-base font-slab text-gray-700 flex-grow">"Todos nascem como originais, mas muitos morrem como cópias."</p>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Beato Carlo Acutis</p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-lg  overflow-hidden flex flex-col">
            <img src="/img/testemunho30.jpeg" alt="Imagem de oração" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho30.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-base font-slab text-gray-700 flex-grow">"O sofrimento é o sinal de que estamos no caminho certo."</p>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Padre Pio</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="/img/testemunho33.jpeg" alt="Imagem de fé" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho33.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-base font-slab text-gray-700 flex-grow">"A fé move montanhas. Não há limite para o que podemos alcançar quando confiamos em Deus."</p>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— São João Paulo II</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="/img/testemunho28.jpeg" alt="Imagem de luz e oração" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho28.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-base font-slab text-gray-700 flex-grow">"Senhor, faze-me instrumento de tua paz. Onde houver ódio, que eu leve o amor..."</p>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— São Francisco de Assis</p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-lg  shadow-lg overflow-hidden flex flex-col">
            <img src="/img/testemunho31.jpeg" alt="Imagem de oração" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho31.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <a className="text-base font-slab text-gray-700 flex-grow" href='https://www.vaticannews.va/pt/igreja/news/2023-07/santo-inacio-loyola-amar-servir-legado-vida-companhia-jesus.html' target='blank'>"Em Tudo Amar e Servir"</a>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Santo Inácio de Loyola</p>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="/img/testemunho32.jpeg" alt="Imagem de fé" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho32.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <a className="text-base font-slab text-gray-700 flex-grow" href='https://www.livrarialoyola.com.br/produto/o-diario-de-sandra-nova-edicao-com-a-vida-o-milagre-de-cura-e-a-oracao-de-intercessao-369715' target='blank'>"Tenho certeza de que esta é a minha vocação: viver com os últimos."</a>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Beata Sandra Sabattini</p>
            </div>
          </div>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src=" https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1umOyM3hr69ZUkl1ZTrpHgWhxY8l0kVC_Gg&s" alt="Imagem de fé" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho32.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <a className="text-base font-slab text-gray-700 flex-grow" href="https://formacao.cancaonova.com/diversos/frases-de-santa-teresinha/" target='blank'>"Quero passar meu céu fazendo o bem na terra."</a>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Santa Teresinha do Menino Jesus</p>
            </div>
          </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Saint_Augustine_by_Philippe_de_Champaigne.jpg/800px-Saint_Augustine_by_Philippe_de_Champaigne.jpg" alt="Imagem de fé" className="w-full h-40 object-cover cursor-pointer" onClick={() => abrirImagem('/img/testemunho32.jpeg')} />
            <div className="p-4 flex flex-col flex-grow">
              <a className="text-base font-slab text-gray-700 flex-grow" href="https://www.pensador.com/frases_de_santo_agostinho/" target='blank'>"Ter fé é assinar uma folha em branco e deixar que Deus nela escreva o que quiser."</a>
              <p className="font-semibold mt-2 text-right text-gray-900 text-sm">— Santo Agostinho</p>
            </div>
          </div>
         
         
          {/* Adicione os outros cards aqui se precisar */}

        </div>
      </section>

    
            {/* Banner "Riqueza Eterna" */}
        <div className="p-6 max-w-3xl mx-auto text-center rounded-2xl mt-10 bg-yellow-500 bg-opacity-90 shadow-lg">
          <h1 className="text-4xl text-white font-slab drop-shadow-md">Riqueza Eterna</h1>
          <p className="text-2xl text-white mt-2 font-slab drop-shadow-sm">Pão da eternidade, Excelso Rei</p>
        </div>

        {/* Galeria de imagens */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img className="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho36.jpeg" alt="Celebração da Eucaristia" onClick={() => abrirImagem('/img/testemunho36.jpeg')} />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-800">Celebração da Eucaristia</h3>
                <p className="text-sm text-gray-600">O pão consagrado, corpo de Cristo.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img className="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho37.jpeg" alt="Sacerdote em Oração" onClick={() => abrirImagem('/img/testemunho37.jpeg')} />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-800">Sacerdote em Oração</h3>
                <p className="text-sm text-gray-600">Momento de adoração e entrega.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img className="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/DSC03260.jpg" alt="Adoração ao Santíssimo" onClick={() => abrirImagem('/img/DSC03260.jpg')} />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-800">Adoração ao Santíssimo</h3>
                <p className="text-sm text-gray-600">Presença real de Cristo entre nós.</p>
              </div>
            </div>
            
             <div className="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img className="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho35.jpeg" alt="Imagem de fé" onClick={() => abrirImagem('/img/testemunho35.jpg')} />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold text-gray-800">Fé Viva</h3>
                <p className="text-sm text-gray-600">Expressão sincera do amor cristão.</p>
              </div>
            </div>
            
             <div class="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img class="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho38.jpeg" alt="Imagem de fé" Onclick={() => abrirImagem('/img/testemunho38.jpeg')} />
              <div class="p-4 text-center">
                <h3 class="text-lg font-bold text-gray-800">Esperança em Cristo</h3>
                <p class="text-sm text-gray-600">Luz que guia nossos passos.</p>
              </div>
           </div>
            
               <div class="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
              <img class="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho42.jpeg" alt="Imagem de luz" Onclick={() => abrirImagem('/img/testemunho42.jpeg')} />
              <div class="p-4 text-center">
                <h3 class="text-lg font-bold text-gray-800">Luz da Salvação</h3>
                <p class="text-sm text-gray-600">Reflexo da glória divina.</p>
              </div>
            </div>

                <div class="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <img class="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/testemunho40.jpeg" alt="Imagem de fé"  Onclick={() => abrirImagem('/img/testemunho40.jpeg')} />
                <div class="p-4 text-center">
                  <h3 class="text-lg font-bold text-gray-800">Caminho da Cruz</h3>
                  <p class="text-sm text-gray-600">Cristo venceu a morte por nós.</p>
                </div>
              </div>


                <div class="bg-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <img class="w-full h-64 object-cover rounded-t-xl cursor-pointer" src="/img/DSC03322.jpg" alt="Imagem de fé"  Onclick={() => abrirImagem('/img/DSC03322.jpg')} />
                <div class="p-4 text-center">
                  <h3 class="text-lg font-bold text-gray-800">Vitória Eterna</h3>
                  <p class="text-sm text-gray-600">O Cristo ressuscitado reina.</p>
                </div>
              </div>
          </div>
        </div>

        {/* Modal Visualizador de Imagem */}
        {isImageViewerOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={fecharImagem}>
            <span className="absolute top-4 right-6 text-white text-4xl font-bold cursor-pointer" onClick={fecharImagem}>&times;</span>
            <img className="max-h-[90vh] max-w-[90vw] rounded-lg" src={currentImage} alt="Imagem ampliada" />
          </div>
        )}

      {/* Seção Aparições de Nossa Senhora */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-slab text-gray-800 mb-2">Aparições de Nossa Senhora</h2>
          <p className="text-gray-600 mb-10 text-lg font-slab">Mensagens do Céu que continuam tocando os corações dos fiéis.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card Fátima */}
          <div className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Virgen_de_F%C3%A1tima.JPG/800px-Virgen_de_F%C3%A1tima.JPG" alt="Nossa Senhora de Fátima" className="w-full h-64 object-cover rounded-xl mb-4 cursor-pointer" onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Virgen_de_F%C3%A1tima.JPG/800px-Virgen_de_F%C3%A1tima.JPG')} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora de Fátima</h3>
            <p className="text-lg text-gray-600"><strong>Local:</strong> Fátima, Portugal – 1917</p>
            <p className="text-lg text-gray-600"><strong>Mensagem:</strong> Rosário diário, conversão e paz.</p>
            <blockquote className="italic text-indigo-600 mt-3">“Rezem o terço todos os dias...”</blockquote>
            
          </div>
          {/* Adicione os outros cards de aparições aqui... */}

            <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg/800px-France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg" alt="Nossa Senhora de Lourdes" class="w-full h-64 object-cover rounded-xl mb-4"  onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg/800px-France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg')} /> 
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora de Lourdes</h3>
            <p class="text-lg text-gray-600"><strong>Local:</strong> Lourdes, França – 1858</p>
            <p class="text-lg text-gray-600"><strong>Mensagem:</strong> Maria foi concebida sem a mancha do pecado original..</p>
            <blockquote class="italic text-indigo-600 mt-3">“Eu sou a Imaculada Conceição.”</blockquote>
          </div>

            <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Onuva_-_La_Virgen_de_las_Gracias_de_Onuva_-_La_Puebla_del_R%C3%ADo_%28Sevilla%29.jpg" alt="Nossa Senhora das Graças" class="w-full h-64 object-cover rounded-xl mb-4"  onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg/800px-France-002009_-_Our_Lady_of_Lourdes_%2815774765182%29.jpg')} />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora das Graças</h3>
            <p class="text-lg text-gray-600"><strong>Local:</strong> Paris, França – 1830</p>
            <p class="text-lg text-gray-600"><strong>Mensagem:</strong> Graças e proteção pela fé.</p>
            <blockquote class="italic text-indigo-600 mt-3">“Venha ao pé deste altar. Aqui as graças serão derramadas sobre todos que as pedirem com confiança e fervor.”</blockquote>
          </div>

           <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <img src="https://blog.cancaonova.com/felipeaquino/files/2019/12/07.jpg" alt="Nossa Senhora de Guadalupe" class="w-full h-64 object-cover rounded-xl mb-4" onClick={() => abrirImagem('https://blog.cancaonova.com/felipeaquino/files/2019/12/07.jpg')} />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora de Guadalupe</h3>
            <p class="text-lg text-gray-600"><strong>Local:</strong> México – 1531</p>
            <p class="text-lg text-gray-600"><strong>Mensagem:</strong> Amor maternal e dignidade dos humildes.</p>
            <blockquote class="italic text-indigo-600 mt-3">“Não estou eu aqui, que sou tua Mãe?”</blockquote>
          </div>

          <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ8UFqbSZTYUCbEif-Kzx1o2tHn4bUN8Nsbeg4Gry9VrmqFVU3RdfKIdDB4ifXfiEWnU8&usqp=CAU" alt="Nossa Senhora de La Salette" class="w-full h-64 object-cover rounded-xl mb-4" onClick={() => abrirImagem('https://blog.cancaonova.com/felipeaquino/files/2019/12/07.jpg')} />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora de La Salette</h3>
            <p class="text-lg text-gray-600"><strong>Local:</strong> La Salette, França – 1846</p>
            <p class="text-lg text-gray-600"><strong>Mensagem:</strong> A necessidade de oração e penitência.</p>
            <blockquote class="italic text-indigo-600 mt-3">“Se meu povo não quiser se submeter, sou forçada a deixar o braço de meu Filho cair. Ele é tão pesado que já não posso segurá-lo.”</blockquote>
          </div>

             <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Est%C3%A1tua_original_de_Nossa_Senhora_das_L%C3%A1grimas_%28Original_statue_of_Our_Lady_of_Tears%29.jpg" alt="Nossa Senhora de La Salette" class="w-full h-64 object-cover rounded-xl mb-4" onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/7/72/Est%C3%A1tua_original_de_Nossa_Senhora_das_L%C3%A1grimas_%28Original_statue_of_Our_Lady_of_Tears%29.jpg')} />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora das Lágrimas</h3>
              <p class="text-lg text-gray-600"><strong>Local:</strong> Campinas, Brasil – 1930</p>
              <p class="text-lg text-gray-600"><strong>Mensagem:</strong>Este é o rosário de Minhas lágrimas.</p>
              <blockquote class="italic text-indigo-600 mt-3">“Por meio deste rosário o demônio será derrotado e o poder do inferno destruído.</blockquote>
            </div>

               <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/N._S._Aparecida_no_Santu%C3%A1rio_Nacional.webp/984px-N._S._Aparecida_no_Santu%C3%A1rio_Nacional.webp.png" alt="Nossa Senhora de La Salette" class="w-full h-64 object-cover rounded-xl mb-4"  onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/N._S._Aparecida_no_Santu%C3%A1rio_Nacional.webp/984px-N._S._Aparecida_no_Santu%C3%A1rio_Nacional.webp.png')} />
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora Aparecida</h3>
                <p class="text-lg text-gray-600"><strong>Local:</strong> Guaratinguetá, São Paulo – 1717</p>
                <p class="text-lg text-gray-600"><strong>Mensagem:</strong> Conversão e fidelidade a Deus.</p>
                <blockquote class="italic text-indigo-600 mt-3">“"Aparecida, padroeira do Brasil, rogai por nós!”</blockquote>
              </div>

                <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Virgen_del_Rosario_de_San_Nicol%C3%A1s_-_III.jpg" alt="Nossa Senhora de La Salette" class="w-full h-64 object-cover rounded-xl mb-4" onClick={() => abrirImagem('https://upload.wikimedia.org/wikipedia/commons/4/45/Virgen_del_Rosario_de_San_Nicol%C3%A1s_-_III.jpg')} />
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Nossa Senhora do Rosário de San Nicolás</h3>
                  <p class="text-lg text-gray-600"><strong>Local:</strong>  Argentina – 1983–1990
                  </p>
                  <p class="text-lg text-gray-600"><strong>Mensagem:</strong> Chamada à conversão, oração do terço, amor à Eucaristia.</p>
                  <blockquote class="italic text-indigo-600 mt-3">“Sou a Mãe de todos os tempos. Vinde a mim quando estiverdes aflitos.”</blockquote>
                </div>

                  <div class="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition">
                    <img src="https://images.cdn-files-a.com/uploads/5860772/2000_6211063409eb7.jpg" alt="Nossa Senhora de La Salette" class="w-full h-64 object-cover rounded-xl mb-4" onClick={() => abrirImagem('https://images.cdn-files-a.com/uploads/5860772/2000_6211063409eb7.jpg')} />
                    <h3 class="text-xl font-semibold text-gray-800 mb-2"> Nossa Senhora de Akita</h3>
                    <p class="text-lg text-gray-600"><strong>Local:</strong> Japão, 1973
                    </p>
                    <p class="text-lg text-gray-600"><strong>Mensagem:</strong> oração, penitência, reparação; profecias sobre crises na Igreja.</p>
                    <blockquote class="italic text-indigo-600 mt-3">“O demônio infiltrará até mesmo na Igreja, de tal forma que se verão cardeais contra cardeais e bispos contra bispos.”</blockquote>
                  </div>
    
          </div>
          <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-10 p-4 rounded-lg shadow bg-blue-50">
      <h3 className="text-2xl text-center mb-2 text-blue-800 font-slab sm:text-2xl">Maria quer falar contigo</h3>
      <p className="mb-4 text-xl font-slab text-blue-700">Digite um título mariano</p>
      <input
        className="p-2 w-full mb-2 rounded border"
        type="text"
        placeholder="Ex: nossa senhora das graças"
        value={maryInput}
        onChange={e => setMaryInput(e.target.value)}
      />
      <button
        className="p-2 bg-blue-600 text-white text-xl font-slab rounded-lg w-auto mt-3 px-6"
        onClick={buscarMensagemMary}
      >
        Buscar a Mensagem
      </button>
      <div className="mt-4 text-center text-lg font-slab text-blue-800 min-h-[80px]">
        {maryMessage}
      </div>
    </div>
      </section>

      {/* Modal Visualizador de Imagem */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={fecharImagem}>
          <span className="absolute top-4 right-6 text-white text-4xl font-bold cursor-pointer" onClick={fecharImagem}>&times;</span>
          <img className="max-h-[90vh] max-w-[90vw] rounded-lg" src={currentImage} alt="Imagem ampliada" />
        </div>
      )}
    </>
  );
}

export default MuseuPage;