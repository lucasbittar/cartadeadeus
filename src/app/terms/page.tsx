'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1A1A]">
      {/* Noise texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: NOISE_URL, backgroundRepeat: 'repeat' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 md:py-32">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-burgundy transition-colors mb-12"
        >
          &larr; Voltar ao site
        </Link>

        {/* Decorative flourish */}
        <div className="flex items-center gap-4 mb-10">
          <span className="block w-12 h-[1px] bg-gradient-to-r from-transparent to-burgundy/30" />
          <span className="text-burgundy/60 text-4xl">&#10087;</span>
          <span className="block w-12 h-[1px] bg-gradient-to-l from-transparent to-burgundy/30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Title */}
          <p className="uppercase text-xs tracking-[0.3em] text-burgundy mb-4 font-mono">
            Termos de Uso
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white mb-12">
            Termos de Uso
          </h1>

          <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">
            <section>
              <h2 className="font-playfair text-xl text-white mb-4">1. Aceite dos Termos</h2>
              <p>
                Ao acessar e utilizar o site Carta de Adeus (&ldquo;cartadeadeus.cc&rdquo;),
                você concorda com estes Termos de Uso. Caso não concorde, pedimos que não utilize
                o site. O uso continuado do site constitui aceite integral destes termos.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">2. Sobre o Projeto</h2>
              <p>
                O Carta de Adeus é um hotsite criado em homenagem ao álbum &ldquo;Carta de Adeus&rdquo;
                da banda Fresno. O site permite que fãs enviem cartas de despedida anônimas de até 280
                caracteres, que são exibidas em um globo interativo e em um mural de cartas.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">3. Envio de Cartas</h2>
              <p className="mb-3">Ao enviar uma carta, você declara que:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>O conteúdo é de sua autoria e não infringe direitos de terceiros;</li>
                <li>A carta não contém conteúdo ilegal, ofensivo, discriminatório, ou que incite violência;</li>
                <li>A carta não contém informações pessoais de terceiros sem consentimento;</li>
                <li>Autoriza a exibição pública da carta no site de forma anônima.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">4. Moderação de Conteúdo</h2>
              <p>
                Todas as cartas são submetidas a um processo de moderação automática e manual.
                Reservamo-nos o direito de aprovar, rejeitar ou remover qualquer carta que viole
                estes termos, sem necessidade de aviso prévio. Cartas sinalizadas pelo sistema
                automático passam por revisão manual antes da publicação.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">5. Coleta de E-mail</h2>
              <p>
                O fornecimento de e-mail é opcional. Caso fornecido, o e-mail será armazenado de
                forma segura e poderá ser utilizado exclusivamente para comunicações relacionadas
                ao projeto Carta de Adeus e à banda Fresno. O e-mail nunca será exibido publicamente
                no site. Para mais detalhes, consulte nossa{' '}
                <Link href="/privacy" className="text-burgundy hover:underline underline-offset-2">
                  Política de Privacidade
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">6. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo do site, incluindo mas não limitado a design, código, imagens,
                tipografia e textos editoriais, é protegido por direitos autorais. O nome
                &ldquo;Fresno&rdquo; e marcas relacionadas são propriedade de seus respectivos
                titulares. As cartas enviadas pelos usuários permanecem de autoria de quem as escreveu,
                sendo concedida ao site uma licença não exclusiva para exibição pública.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">7. Limitação de Responsabilidade</h2>
              <p>
                O site é fornecido &ldquo;como está&rdquo;, sem garantias de qualquer tipo.
                Não nos responsabilizamos por indisponibilidade temporária, perda de dados ou
                pelo conteúdo enviado por terceiros. O uso do site é por conta e risco do usuário.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">8. Alterações nos Termos</h2>
              <p>
                Estes termos podem ser atualizados a qualquer momento. Recomendamos que você
                os revise periodicamente. Alterações significativas serão comunicadas no próprio site.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">9. Contato</h2>
              <p>
                Em caso de dúvidas sobre estes termos, entre em contato através do site{' '}
                <a
                  href="https://lucasbittar.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burgundy hover:underline underline-offset-2"
                >
                  lucasbittar.dev
                </a>.
              </p>
            </section>

            <p className="text-white/40 text-sm pt-6 border-t border-white/10">
              Última atualização: Março de 2026
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
