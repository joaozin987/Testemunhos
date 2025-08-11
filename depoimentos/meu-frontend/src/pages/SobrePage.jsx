import React from 'react';

function SobrePage() {
  return (
    <section className="bg-blue-800 py-16 px-6 sm:px-10 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-slab text-white drop-shadow-md">
            Como Surgiu a Ideia
          </h1>
        </div>
    
        <div className="text-white text-xl sm:text-2xl leading-relaxed space-y-8 text-justify">
          <p className="text-gray-200">
            Esta ideia não nasceu de mim — <span className="text-yellow-300 font-slab">foi Deus quem a plantou em meu coração</span>. Ela permaneceu pulsando em minha mente por duas semanas, como um chamado insistente, algo que precisava ganhar vida.
          </p>
          <p className="text-gray-200">
            Senti-me usado como um <span className="text-yellow-300 font-slab">instrumento de fé</span> para alcançar outros jovens. Cada detalhe deste site foi cuidadosamente inspirado por Ele, que me guiou com clareza em cada etapa.
          </p>
          <p className="text-gray-200">
            Deus me mostrou que este seria um <span className="text-yellow-300 font-slab">espaço para testemunhos</span> — um lugar onde jovens poderiam partilhar suas experiências, superações, dúvidas e reencontros com Ele.
          </p>
          <p className="text-gray-200">
            Aqui, <strong className="text-white font-semibold">cada história é uma semente de esperança</strong>. Cada depoimento é uma prova viva de que <span className="font-slab text-yellow-300">Deus age nos detalhes</span> — e que, juntos, somos mais fortes na caminhada da fé.
          </p>
          <p className="text-center mt-12 text-gray-200">
           A <span className="font-slab text-3xl">salvação é individual</span>, <span className="text-yellow-300 text-3xl">mas a caminhada não precisa ser solitária</span>. <br/> <span className="font-slab text-3xl mt-2 block">Vamos juntos até o céu.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

export default SobrePage;