'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const NOISE_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export default function PrivacyPage() {
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
            Privacidade
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl text-white mb-12">
            Política de Privacidade
          </h1>

          <div className="space-y-10 text-white/70 leading-relaxed text-[15px]">
            <section>
              <h2 className="font-playfair text-xl text-white mb-4">1. Dados Coletados</h2>
              <p className="mb-3">Ao utilizar o site Carta de Adeus, podemos coletar os seguintes dados:</p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li><strong className="text-white/70">Conteúdo da carta</strong>: o texto de até 280 caracteres que você envia;</li>
                <li><strong className="text-white/70">Cidade</strong>: a localização informada por você no momento do envio;</li>
                <li><strong className="text-white/70">E-mail</strong> (opcional): caso você opte por fornecer;</li>
                <li><strong className="text-white/70">Dados técnicos</strong>: endereço IP (para controle de abuso), tipo de navegador e dados de uso agregados.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">2. Finalidade do Uso dos Dados</h2>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li><strong className="text-white/70">Cartas</strong>: exibidas anonimamente no globo interativo e no mural do site;</li>
                <li><strong className="text-white/70">Cidade</strong>: utilizada para posicionar a carta no globo interativo;</li>
                <li><strong className="text-white/70">E-mail</strong>: utilizado exclusivamente para comunicações futuras relacionadas ao projeto Carta de Adeus e à banda Fresno. Nunca será compartilhado com terceiros para fins comerciais;</li>
                <li><strong className="text-white/70">Dados técnicos</strong>: utilizados para segurança, prevenção de abuso e análise agregada de uso.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">3. Armazenamento e Segurança</h2>
              <p>
                Os dados são armazenados em servidores seguros fornecidos pela Supabase,
                com criptografia em trânsito (TLS/SSL) e em repouso. O acesso aos dados é
                restrito a administradores autorizados. Aplicamos medidas de segurança técnicas
                e organizacionais para proteger seus dados contra acesso não autorizado,
                alteração ou destruição.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">4. Seus Direitos (LGPD)</h2>
              <p className="mb-3">
                Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60">
                <li>Confirmar a existência de tratamento de seus dados;</li>
                <li>Acessar seus dados pessoais;</li>
                <li>Solicitar a correção de dados incompletos ou incorretos;</li>
                <li>Solicitar a exclusão de seus dados pessoais;</li>
                <li>Revogar o consentimento a qualquer momento.</li>
              </ul>
              <p className="mt-3">
                Para exercer qualquer desses direitos, entre em contato conosco através do site{' '}
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

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">5. Cookies</h2>
              <p>
                O site utiliza cookies essenciais para autenticação de administradores e
                funcionamento do sistema. Não utilizamos cookies de rastreamento ou publicidade.
                Serviços de terceiros (como Vercel Analytics) podem coletar dados agregados
                de performance de forma anônima.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">6. Compartilhamento de Dados</h2>
              <p>
                Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros
                para fins comerciais. Seus dados podem ser compartilhados apenas com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 mt-3">
                <li>Provedores de infraestrutura (Supabase, Vercel) necessários para o funcionamento do site;</li>
                <li>Autoridades legais, quando exigido por lei ou ordem judicial.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">7. Retenção de Dados</h2>
              <p>
                As cartas e dados associados são mantidos enquanto o projeto estiver ativo.
                E-mails coletados serão mantidos até que o usuário solicite sua remoção ou
                o projeto seja encerrado. Ao término do projeto, todos os dados pessoais
                serão deletados de forma segura.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">8. Menores de Idade</h2>
              <p>
                O site não coleta intencionalmente dados de menores de 13 anos. Caso identifiquemos
                que dados foram coletados de um menor sem consentimento dos pais ou responsáveis,
                tomaremos medidas para deletá-los prontamente.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">9. Alterações nesta Política</h2>
              <p>
                Esta política pode ser atualizada periodicamente. Alterações significativas serão
                comunicadas no site. Recomendamos a revisão regular desta página.
              </p>
            </section>

            <section>
              <h2 className="font-playfair text-xl text-white mb-4">10. Contato</h2>
              <p>
                Para questões relacionadas à privacidade, entre em contato através do site{' '}
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
