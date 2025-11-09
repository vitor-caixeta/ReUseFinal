import Image from "next/image";
import Link from "next/link";
import hero from "@/public/IllustrationHome/HomeTop1.png";
import hero2 from "@/public/IllustrationHome/Illustration2Home.png";
import ItemsShowcase from "@/components/items/ItemsShowcase"; 

export default async function Home() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid items-center gap-8 md:grid-cols-2">
        <div className="w-full">
          <Image
            src={hero}
            alt="Illustration"
            className="h-auto w-full"
            priority
          />
        </div>

        <div className="space-y-4">
          <div className="h-1.5 w-28 rounded-full bg-gradient-to-r from-[#368b7a] to-[#71ba82]" />
          <h2 className="md:text-5xl text-3xl font-bold leading-tight">Renovando objetos, mudando vidas!</h2>
          <p className="text-base leading-relaxed opacity-80">Já pensou em dar um novo destino para aquilo que você não usa mais? Aqui, você pode doar, trocar e encontrar itens de forma sustentável, conectando pessoas e reduzindo o desperdício.</p>

          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#368b7a] to-[#71ba82] px-5 py-2.5 text-sm font-semibold text-white shadow transition active:scale-[0.99]"
          >
            Começar agora
          </Link>
        </div>
      </div>

      {/* Second Session */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="md:text-5xl text-3xl font-bold text-center leading-tight">
          Explore! Veja alguns produtos
        </h2>
        <h3 className="text-2xl leading-relaxed opacity-80 text-center">
          Explore os destaques e encontre o que precisa de forma sustentável
        </h3>
        
        {/* Cards */}
        <div className="flex justify-center mt-8">
          <div className="w-full max-w-6xl">
            <ItemsShowcase />
          </div>
        </div>

        <h3 className="text-2xl mt-18 leading-relaxed opacity-80 text-center">
          Roupas, móveis, eletrônicos até livros, sempre há algo útil esperando por um novo dono.
        </h3>
      </section>

      {/* Third Session*/}
      <section className="mx-auto max-w-6xl px-4 py-10 text-center">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Imagem centralizada */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src={hero2}
              alt="Illustration"
              className="h-auto w-full max-w-md rounded-xl object-contain"
              priority
            />
          </div>

          {/* Textos */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Sobre nós!</h2>
            <h3 className="text-lg md:text-2xl leading-relaxed opacity-80">
              O ReUse é uma plataforma que incentiva o consumo consciente por meio da troca, doação e venda de itens usados. Nosso objetivo é prolongar o ciclo de vida dos objetos, reduzir o desperdício e conectar pessoas dispostas a fazer a diferença através de pequenas atitudes sustentáveis.
            </h3>
          </div>
        </div>
      </section>
    </section>
  );
}