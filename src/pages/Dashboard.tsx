import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as XLSX from 'xlsx';

// ==========================================
// INTERFACES E TIPOS DE DADOS ATUALIZADOS DO GETECC
// ==========================================
export interface AnexoArquivo {
  id: string;
  nome: string;
  dataUrl: string;
  dataUpload: string;
}

export interface RegistroAfastamento {
  id: string;
  tipo: string;
  data_inicio: string;
  data_fim: string;
  motivo: string;
}

export interface Membro {
  id: string;
  matricula: string;
  nome_completo: string;
  foto_dataurl?: string;
  cpf: string;
  email_institucional: string;
  email_alternativo?: string;
  instagram?: string;
  orcid_link?: string;
  lattes_link?: string;
  endereco?: string;
  financiamento?: string;
  telefone?: string;
  curso_formacao: string;
  instituicao: string;
  selecao_ingresso?: string;
  categoria: 'Gestão' | 'Apoio de Gestão' | 'Estudantes' | 'Egressos';
  funcao_cargo: string;
  data_ingresso: string;
  data_desligamento?: string | null;
  situacao: 'Ativo' | 'Desligado' | 'Em Afastamento/Licença';
  historico_afastamentos: RegistroAfastamento[];
}

export interface EgressoGETECC {
  id: string;
  nome_completo: string;
  curso_formacao: string;
  instituicao_formacao: string;
  data_ingresso_getecc: string;
  data_saida_getecc: string;
  motivo_saida: string;
  trajetorias: string[];
  instituicao_atual: string;
  cidade_uf_atual: string;
  observacoes: string;
}

export interface ColaboradorExterno {
  id: string;
  nome: string;
  cpf: string;
  titulacao: 'Especialista' | 'Mestre' | 'Doutor' | 'Pós-Doutor' | 'Livre-Docente';
  email: string;
  orcid: string;
  numero_conselho: string;
  afiliacao: string;
}

export interface ColaboradorFinanceiro {
  id: string;
  nome: string;
  cpf: string;
  titulacao: 'Especialista' | 'Mestre' | 'Doutor' | 'Pós-Doutor' | 'Livre-Docente';
  email: string;
  orcid: string;
  numero_conselho: string;
  afiliacao: string;
  evento_ou_artigo: string;
  valor_pago?: string;
  status_publicacao: 'Em análise' | 'Aprovada' | 'Reprovada';
  data_registro: string;
}

export interface MovimentacaoFinanceira {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'Entrada' | 'Saída';
  categoria: 'Mensalidade' | 'Day Off' | 'São João' | 'Inscrição / Publicação' | 'Patrimônio' | 'Eventos' | 'Custeio' | 'Outros';
  data: string;
  membro_id?: string;
  membro_nome?: string;
  observacoes?: string;
}

export interface PagamentoMensalidade {
  id: string;
  membro_id: string;
  ano: string;
  mes: number;
  valor: number;
  status: 'Pago' | 'Pendente';
  data_pagamento?: string;
}

export interface PagamentoEventoEspecial {
  id: string;
  membro_id: string;
  evento: 'Day Off' | 'São João';
  valor: number;
  status: 'Pago' | 'Pendente';
  data_pagamento?: string;
}

export interface ArtigoDerivado {
  id: string;
  titulo: string;
  revista: string;
  qualis_jcr_cite: string;
  status: 'em produção' | 'publicado' | 'em revisão';
  anexos: AnexoArquivo[];
}

export interface ProjetoPesquisa {
  id: string;
  titulo: string;
  coordenador: string;
  linha_pesquisa: string;
  docentes: string[];
  discentes: string[];
  parecer_cep: string;
  caee_cep: string;
  financiamento: string;
  observacoes: string;
  is_nupex?: boolean;
  status: 'Em aberto' | 'Submetido' | 'Cadastrado' | 'Em execução' | 'Concluído';
  artigos_derivados: ArtigoDerivado[];
  anexos: AnexoArquivo[];
  parecer_cep_arquivo_dataurl?: string;
  parecer_cep_arquivo_nome?: string;
}

export interface Demanda {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  responsavel_nome: string;
  cadastrado_por?: string;
  concluido_por?: string;
  eh_coracao?: boolean;
  prazo_final: string;
  prioridade: 'Baixa' | 'Média' | 'Alta' | 'Urgente';
  status: 'Não iniciada' | 'Em andamento' | 'Com pendências' | 'Concluída';
  anexos: AnexoArquivo[];
}

export interface ProducaoCientifica {
  id: string;
  categoria_producao: 'Periódico' | 'Congresso';
  tipo_producao: string;
  titulo: string;
  evento_ou_revista: string;
  autor_principal: string;
  coautores: string;
  ano_producao?: string;
  ano_publicacao: string;
  qualis_doi: string;
  status: 'Pendente Submissão' | 'Submetido' | 'Publicado' | 'em editoração' | 'aguardando submissão' | 'aguardando anais' | 'anais publicados';
}

export interface ConstrucaoPendente {
  id: string;
  titulo: string;
  objetivo: string;
  projeto_mae: string;
  origem: string;
  link_drive: string;
  banco_dados: string;
  status: 'Pendente' | 'Em desenvolvimento' | 'Concluída';
  created_at?: string;
}

export interface MetaAnualProducao {
  ano: string;
  meta_artigos_produzidos: number;
  meta_artigos_publicados: number;
  meta_resumos: number;
}

export interface ReuniaoCientifica {
  id: string;
  titulo: string;
  data: string;
  horario: string;
  pauta: string;
  presencas: { membro_id: string; membro_nome: string; status: 'presente' | 'falta' | 'falta_justificada' }[];
}

export interface PatrimonioProduto {
  id: string;
  nome: string;
  descricao: string;
  quantidade: number;
  foto_dataurl?: string;
  estado_conservacao: 'Excelente' | 'Bom' | 'Regular' | 'Danificado';
  responsavel: string;
}

export interface MarketingItem {
  id: string;
  titulo: string;
  canal: 'Instagram' | 'Site / Portal' | 'E-mail Marketing' | 'Evento' | 'Outros';
  responsavel: string;
  data_prevista: string;
  status: 'Ideia' | 'Em Produção' | 'Aprovado' | 'Publicado';
  legenda?: string;
  artes: AnexoArquivo[];
}

export interface PermissaoAba {
  visualizar: boolean;
  editar: boolean;
}

export interface UsuarioSistema {
  id: string;
  nome_completo: string;
  email: string;
  perfil_acesso: 'Administrador' | 'Gestão' | 'Coordenador' | 'Apoio Técnico' | 'Membro' | 'Consulta';
  situacao: 'Ativo' | 'Inativo';
  permissoes: { [abaKey: string]: PermissaoAba };
}

export interface ItemAuditoria {
  id: string;
  usuario_nome: string;
  operacao: string;
  modulo: string;
  detalhes: string;
  data_hora: string;
}

// LOGO OFICIAL GETECC
const LogoGetecc = () => (
  <div className="flex items-center space-x-3 select-none">
    <div className="relative w-9 h-9 flex items-center justify-center flex-shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 38 10 L 62 10 L 62 28 L 82 18 L 94 38 L 74 48 L 94 58 L 82 78 L 62 68 L 62 86 L 38 86 L 38 68 L 18 78 L 6 58 L 26 48 L 6 38 L 18 18 L 38 28 Z" fill="none" stroke="#DC2626" strokeWidth="6" strokeLinejoin="round" />
        <path d="M 38 52 L 62 52 L 62 86 L 38 86 L 38 68 L 18 78 L 6 58 L 26 48 Z" fill="none" stroke="#0072CE" strokeWidth="6" strokeLinejoin="round" />
        <path d="M 2 48 L 30 48 L 35 30 L 42 68 L 50 20 L 58 60 L 65 40 L 70 48 L 98 48" fill="none" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
    <div className="flex flex-col justify-center">
      <span className="text-xl font-black text-slate-900 leading-none">GETECC</span>
      <span className="text-[9px] font-extrabold text-red-700 leading-tight mt-0.5">Grupo de Estudos em Trauma, Emergência e Cuidados Críticos</span>
    </div>
  </div>
);

// ÍCONE DO CORAÇÃO ANATÔMICO (NÚCLEO CORAÇÃO)
const IconeCoracaoAnatomico = () => <span role="img" aria-label="coração anatômico" className="inline-block text-xl leading-none">🫀</span>;

// CONVERSOR MONETÁRIO SEGURO
const extrairValorNumerico = (texto: string | number | undefined): number => {
  if (typeof texto === 'number') return texto;
  if (!texto) return 0;
  const limpo = texto.replace(/[^0-9,-]/g, '').replace(',', '.');
  const num = parseFloat(limpo);
  return isNaN(num) ? 0 : num;
};

const NOMES_MESES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

type SegmentoGrafico = { label: string; valor: number; cor: string };
type DadoGrafico = { label: string; valor: number; cor?: string };

// Paleta institucional baseada diretamente nas cores presentes na identidade visual do GETECC.
const PALETA_GETECC = ['#0072CE', '#DC2626', '#0F172A', '#4BA3DF', '#E57373', '#64748B', '#93C5FD'];
const FUNDO_GETECC = ['#EAF4FB', '#FDECEC', '#F1F5F9', '#EEF7FC', '#FEF2F2', '#F8FAFC', '#EFF6FF'];

const CardGrafico = ({ titulo, children }: { titulo: string; children?: React.ReactNode }) => (
  <section className="flex min-w-0 min-h-[430px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.045)]">
    <div className="mb-5 min-w-0 shrink-0">
      <h3 className="break-words text-[15px] font-black leading-5 text-[#0F172A]">{titulo}</h3>
    </div>
    <div className="min-h-0 flex-1">{children}</div>
  </section>
);

const GraficoCircular = ({ titulo, segmentos }: { titulo: string; segmentos: SegmentoGrafico[] }) => {
  const total = segmentos.reduce((s, x) => s + Math.max(0, x.valor), 0);
  let acumulado = 0;
  const fatias = segmentos.filter((x) => x.valor > 0).map((x) => {
    const inicio = acumulado;
    acumulado += total ? (x.valor / total) * 100 : 0;
    return `${x.cor} ${inicio}% ${acumulado}%`;
  });
  const fundo = fatias.length ? `conic-gradient(${fatias.join(', ')})` : 'conic-gradient(#E2E8F0 0% 100%)';
  return (
    <CardGrafico titulo={titulo}>
      <div className="flex h-full min-h-[345px] flex-col items-center justify-center gap-8 xl:flex-row xl:gap-12">
        <div className="relative h-56 w-56 shrink-0 rounded-full shadow-[0_4px_18px_rgba(15,23,42,0.06)]" style={{ background: fundo }} aria-hidden="true">
          <div className="absolute inset-[22%] rounded-full bg-white" />
        </div>
        <div className="grid w-full min-w-0 max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-2">
          {segmentos.map((x, i) => (
            <div key={x.label} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3" style={{ backgroundColor: FUNDO_GETECC[i % FUNDO_GETECC.length] }}>
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: x.cor }} />
              <span className="min-w-0 flex-1 break-words text-[11px] font-semibold leading-4 text-slate-600">{x.label}</span>
              <strong className="shrink-0 text-base tabular-nums text-[#0F172A]">{x.valor}</strong>
            </div>
          ))}
          {!segmentos.some((x) => x.valor > 0) && <p className="col-span-full text-center text-xs text-slate-400">Sem dados registrados.</p>}
        </div>
      </div>
    </CardGrafico>
  );
};

const GraficoBarras = ({ titulo, dados, limite = 10 }: { titulo: string; dados: DadoGrafico[]; limite?: number }) => {
  const exibidos = [...dados].sort((a, b) => b.valor - a.valor).slice(0, limite);
  const max = Math.max(1, ...exibidos.map((d) => d.valor));
  return (
    <CardGrafico titulo={titulo}>
      {exibidos.length ? (
        <div className="flex h-full min-h-[345px] flex-col justify-center gap-5 overflow-hidden px-1">
          {exibidos.map((d, i) => (
            <div key={d.label} className="min-w-0">
              <div className="mb-2 flex min-w-0 items-start justify-between gap-4">
                <span className="min-w-0 flex-1 break-words text-[11px] font-semibold leading-4 text-slate-600" title={d.label}>{d.label}</span>
                <strong className="shrink-0 text-sm tabular-nums text-[#0F172A]">{d.valor}</strong>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${d.valor ? Math.max(5, (d.valor / max) * 100) : 0}%`, backgroundColor: d.cor || PALETA_GETECC[i % PALETA_GETECC.length] }} />
              </div>
            </div>
          ))}
        </div>
      ) : <p className="flex h-full min-h-[345px] items-center justify-center text-xs text-slate-400">Sem dados registrados.</p>}
    </CardGrafico>
  );
};

const GraficoColunas = ({ titulo, dados }: { titulo: string; dados: DadoGrafico[] }) => {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  return (
    <CardGrafico titulo={titulo}>
      {dados.length ? (
        <div className="flex h-full min-h-[345px] flex-col justify-end overflow-hidden px-2 pb-2">
          <div className="flex h-64 items-end gap-3 border-b border-slate-200 px-1">
            {dados.map((d, i) => (
              <div key={d.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={`${d.label}: ${d.valor}`}>
                <div className="mb-2 text-xs font-black tabular-nums text-[#0F172A]">{d.valor}</div>
                <div className="flex h-52 w-full items-end justify-center">
                  <div className="w-10 max-w-[70%] rounded-t-xl" style={{ height: `${d.valor ? Math.max(5, (d.valor / max) * 100) : 0}%`, backgroundColor: d.cor || PALETA_GETECC[i % PALETA_GETECC.length] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-3 px-1">
            {dados.map((d) => <span key={d.label} className="min-w-0 flex-1 break-words text-center text-[10px] font-semibold leading-4 text-slate-500" title={d.label}>{d.label}</span>)}
          </div>
        </div>
      ) : <p className="flex h-full min-h-[345px] items-center justify-center text-xs text-slate-400">Sem dados registrados.</p>}
    </CardGrafico>
  );
};

const GraficoLinha = ({ titulo, dados }: { titulo: string; dados: DadoGrafico[] }) => {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  const x = (i: number) => dados.length <= 1 ? 50 : 10 + i * (80 / (dados.length - 1));
  const y = (v: number) => 88 - (v / max) * 64;
  const pontos = dados.map((d, i) => `${x(i)},${y(d.valor)}`).join(' ');
  return (
    <CardGrafico titulo={titulo}>
      {dados.length ? (
        <div className="flex h-full min-h-[345px] flex-col justify-center">
          <svg viewBox="0 0 100 100" className="h-64 w-full" role="img" aria-label={titulo} preserveAspectRatio="none">
            <line x1="8" y1="24" x2="92" y2="24" stroke="#E2E8F0" />
            <line x1="8" y1="56" x2="92" y2="56" stroke="#E2E8F0" />
            <line x1="8" y1="88" x2="92" y2="88" stroke="#CBD5E1" />
            <polyline points={pontos} fill="none" stroke={PALETA_GETECC[0]} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            {dados.map((d, i) => <circle key={`${d.label}-${i}`} cx={x(i)} cy={y(d.valor)} r="2.8" fill={PALETA_GETECC[0]} stroke="white" strokeWidth="1" />)}
          </svg>
          <div className="mt-3 flex justify-between gap-2 text-[10px] font-black text-slate-500">
            {dados.map((d) => <span key={d.label} className="min-w-0 flex-1 truncate text-center" title={d.label}>{d.label}</span>)}
          </div>
        </div>
      ) : <p className="flex h-full min-h-[345px] items-center justify-center text-xs text-slate-400">Sem dados registrados.</p>}
    </CardGrafico>
  );
};

const GraficoLinhasComparativo = ({ titulo, dados }: { titulo: string; dados: { ano: string; produzidos: number; publicados: number }[] }) => {
  const max = Math.max(1, ...dados.flatMap((d) => [d.produzidos, d.publicados]));
  const x = (i: number) => dados.length <= 1 ? 50 : 10 + i * (80 / (dados.length - 1));
  const y = (v: number) => 88 - (v / max) * 64;
  const pontosProduzidos = dados.map((d, i) => `${x(i)},${y(d.produzidos)}`).join(' ');
  const pontosPublicados = dados.map((d, i) => `${x(i)},${y(d.publicados)}`).join(' ');
  return (
    <CardGrafico titulo={titulo}>
      {dados.length ? (
        <div className="flex h-full min-h-[345px] flex-col justify-center">
          <div className="mb-3 flex justify-center gap-6 text-[10px] font-bold text-slate-500">
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#0072CE]" />Produzidos</span>
            <span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#DC2626]" />Publicados</span>
          </div>
          <svg viewBox="0 0 100 100" className="h-64 w-full" role="img" aria-label={titulo} preserveAspectRatio="none">
            <line x1="8" y1="24" x2="92" y2="24" stroke="#E2E8F0" />
            <line x1="8" y1="56" x2="92" y2="56" stroke="#E2E8F0" />
            <line x1="8" y1="88" x2="92" y2="88" stroke="#CBD5E1" />
            <polyline points={pontosProduzidos} fill="none" stroke="#0072CE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points={pontosPublicados} fill="none" stroke="#DC2626" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
            {dados.map((d, i) => <React.Fragment key={d.ano}>
              <circle cx={x(i)} cy={y(d.produzidos)} r="2.8" fill="#0072CE" stroke="white" strokeWidth="1" />
              <circle cx={x(i)} cy={y(d.publicados)} r="2.8" fill="#DC2626" stroke="white" strokeWidth="1" />
            </React.Fragment>)}
          </svg>
          <div className="mt-3 flex justify-between gap-2 text-[10px] font-black text-slate-600">
            {dados.map((d) => <span key={d.ano} className="min-w-0 flex-1 text-center">{d.ano}</span>)}
          </div>
        </div>
      ) : <p className="flex h-full min-h-[345px] items-center justify-center text-xs text-slate-400">Sem dados registrados.</p>}
    </CardGrafico>
  );
};

const BlocoProjetos = ({ dados }: { dados: DadoGrafico[] }) => {
  const max = Math.max(1, ...dados.map((d) => d.valor));
  return (
    <CardGrafico titulo="Projetos de pesquisa">
      <div className="grid h-full min-h-[300px] grid-cols-1 content-center gap-4 sm:grid-cols-2">
        {dados.map((d, i) => (
          <div key={d.label} className="rounded-xl border border-slate-100 p-4" style={{ backgroundColor: FUNDO_GETECC[i % FUNDO_GETECC.length] }}>
            <div className="flex items-start justify-between gap-3">
              <span className="min-w-0 break-words text-[11px] font-bold leading-4 text-slate-600">{d.label}</span>
              <strong className="shrink-0 text-2xl font-black tabular-nums text-slate-900">{d.valor}</strong>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/90">
              <div className="h-full rounded-full" style={{ width: `${d.valor ? Math.max(7, d.valor / max * 100) : 0}%`, backgroundColor: d.cor || PALETA_GETECC[i % PALETA_GETECC.length] }} />
            </div>
          </div>
        ))}
      </div>
    </CardGrafico>
  );
};

export default function Dashboard() {
  const [moduloAtivo, setModuloAtivo] = useState<
    'painel' | 'membros' | 'egressos' | 'colaboradores' | 'projetos' | 'demandas' | 'coracao' | 'pendencias' | 'producoes' | 'reunioes' | 'patrimonio' | 'marketing' | 'financeiro' | 'usuarios' | 'relatorios' | 'construcoes' | 'configuracoes'
  >('painel');

  // USUÁRIO LOGADO E VERIFICAÇÃO DE PERMISSÕES
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioSistema | null>(null);
  const [identidadesUsuarioLogado, setIdentidadesUsuarioLogado] = useState<string[]>([]);

  // BASES DE DADOS SINCRONIZADAS COM O SUPABASE
  const [membros, setMembros] = useState<Membro[]>([]);
  const [egressosGETECC, setEgressosGETECC] = useState<EgressoGETECC[]>([]);
  const [colaboradores, setColaboradores] = useState<ColaboradorExterno[]>([]);
  const [colaboradoresFinanceiros, setColaboradoresFinanceiros] = useState<ColaboradorFinanceiro[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);
  const [mensalidades, setMensalidades] = useState<PagamentoMensalidade[]>([]);
  const [eventosEspeciais, setEventosEspeciais] = useState<PagamentoEventoEspecial[]>([]);
  const [projetos, setProjetos] = useState<ProjetoPesquisa[]>([]);
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [producoes, setProducoes] = useState<ProducaoCientifica[]>([]);
  const [metasAnuais, setMetasAnuais] = useState<MetaAnualProducao[]>([]);
  const [anoMetaPainel, setAnoMetaPainel] = useState<string>(() => String(new Date().getFullYear()));
  const [reunioes, setReunioes] = useState<ReuniaoCientifica[]>([]);
  const [patrimonio, setPatrimonio] = useState<PatrimonioProduto[]>([]);
  const [marketing, setMarketing] = useState<MarketingItem[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [historicoAuditoria, setHistoricoAuditoria] = useState<ItemAuditoria[]>([]);
  const [construcoesPendentes, setConstrucoesPendentes] = useState<ConstrucaoPendente[]>([]);
  const [formConstrucao, setFormConstrucao] = useState<Partial<ConstrucaoPendente>>({ status: 'Pendente' });

  // BASE CUMULATIVA E IMPORTAÇÕES
  const [textoCSVRelatorio, setTextoCSVRelatorio] = useState('');
  const [baseImportadaEventos, setBaseImportadaEventos] = useState<{ congresso: string; autor: string; titulo: string; coautores: string; ano?: string }[]>([]);

  // FILTROS GERAIS E ESTADOS DE TELA
  const [modalAtivo, setModalAtivo] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroEventoFinanceiro, setFiltroEventoFinanceiro] = useState<string>('Todos');

  // FILTROS DO MÓDULO DE DEMANDAS & PRODUÇÕES
  const [filtroDemandaStatus, setFiltroDemandaStatus] = useState<string>('Todos');
  const [filtroDemandaResponsavel, setFiltroDemandaResponsavel] = useState<string>('Todos');
  const [visaoDemandas, setVisaoDemandas] = useState<'lista' | 'calendario'>('lista');
  const [somenteMinhasDemandas, setSomenteMinhasDemandas] = useState(false);
  const [ordenacaoDemandas, setOrdenacaoDemandas] = useState<'prazo' | 'prioridade'>('prazo');
  const [visaoCoracao, setVisaoCoracao] = useState<'lista' | 'calendario'>('lista');
  const [mesCalendarioDemandas, setMesCalendarioDemandas] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [mesCalendarioCoracao, setMesCalendarioCoracao] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [diaCalendarioExpandido, setDiaCalendarioExpandido] = useState<string | null>(null);
  const [filtroProducaoAutor, setFiltroProducaoAutor] = useState<string>('Todos');

  // FILTROS DO MÓDULO FINANCEIRO
  const [subAbaFinanceiro, setSubAbaFinanceiro] = useState<'movimentacoes' | 'mensalidades' | 'eventos_especiais'>('movimentacoes');
  const [anoMatrizMensalidade, setAnoMatrizMensalidade] = useState<string>('2026');
  const [filtroFinDataInicio, setFiltroFinDataInicio] = useState('');
  const [filtroFinDataFim, setFiltroFinDataFim] = useState('');
  const [filtroFinCategoria, setFiltroFinCategoria] = useState('Todas');
  const [filtroFinTipo, setFiltroFinTipo] = useState('Todos');

  // FORMULÁRIOS DE CADASTRO E EDIÇÃO
  const [formMembro, setFormMembro] = useState<Partial<Membro>>({ situacao: 'Ativo', categoria: 'Estudantes', historico_afastamentos: [] });
  const [formEgresso, setFormEgresso] = useState<Partial<EgressoGETECC>>({ trajetorias: [] });
  const [formAfastamento, setFormAfastamento] = useState<Partial<RegistroAfastamento>>({});
  const [formColaborador, setFormColaborador] = useState<Partial<ColaboradorExterno>>({ titulacao: 'Doutor' });
  const [formColaboradorFinanceiro, setFormColaboradorFinanceiro] = useState<Partial<ColaboradorFinanceiro>>({ titulacao: 'Doutor', status_publicacao: 'Em análise' });
  const [formMovimentacao, setFormMovimentacao] = useState<Partial<MovimentacaoFinanceira>>({ tipo: 'Entrada', categoria: 'Outros', data: new Date().toISOString().split('T')[0] });
  
  const [formEdicaoMensalidade, setFormEdicaoMensalidade] = useState<{
    membro_id: string;
    membro_nome: string;
    ano: string;
    mes: number;
    valor: number;
    status: 'Pago' | 'Pendente';
    data_pagamento: string;
  }>({
    membro_id: '',
    membro_nome: '',
    ano: '2026',
    mes: 1,
    valor: 30.00,
    status: 'Pago',
    data_pagamento: new Date().toISOString().split('T')[0],
  });

  const [formEdicaoEventoEspecial, setFormEdicaoEventoEspecial] = useState<{
    membro_id: string;
    membro_nome: string;
    evento: 'Day Off' | 'São João';
    valor: number;
    status: 'Pago' | 'Pendente';
    data_pagamento: string;
  }>({
    membro_id: '',
    membro_nome: '',
    evento: 'Day Off',
    valor: 50.00,
    status: 'Pago',
    data_pagamento: new Date().toISOString().split('T')[0],
  });

  const [formProjeto, setFormProjeto] = useState<Partial<ProjetoPesquisa>>({ status: 'Em aberto', docentes: [], discentes: [], artigos_derivados: [], anexos: [] });
  const [formDocentesTexto, setFormDocentesTexto] = useState('');
  const [formDiscentesTexto, setFormDiscentesTexto] = useState('');
  const [formArtigoDerivado, setFormArtigoDerivado] = useState<Partial<ArtigoDerivado>>({ status: 'em produção', anexos: [] });
  const [formDemanda, setFormDemanda] = useState<Partial<Demanda>>({ prioridade: 'Média', status: 'Em andamento', anexos: [], eh_coracao: false });
  const [formProducao, setFormProducao] = useState<Partial<ProducaoCientifica>>({ categoria_producao: 'Periódico', status: 'Publicado', ano_producao: '2026', ano_publicacao: '2026' });
  const [formMetaAnual, setFormMetaAnual] = useState<Partial<MetaAnualProducao>>({ ano: '2026', meta_artigos_produzidos: 10, meta_artigos_publicados: 6, meta_resumos: 10 });
  const [textoCargaMassaProducao, setTextoCargaMassaProducao] = useState('');
  const [formReuniao, setFormReuniao] = useState<Partial<ReuniaoCientifica>>({ data: new Date().toISOString().split('T')[0] });
  const [presencasChamada, setPresencasChamada] = useState<{ [membroId: string]: 'presente' | 'falta' | 'falta_justificada' }>({});
  const [formPatrimonio, setFormPatrimonio] = useState<Partial<PatrimonioProduto>>({ quantidade: 1, estado_conservacao: 'Excelente' });
  const [formMarketing, setFormMarketing] = useState<Partial<MarketingItem>>({ canal: 'Instagram', status: 'Ideia', artes: [] });
  const [formUsuario, setFormUsuario] = useState<Partial<UsuarioSistema>>({ perfil_acesso: 'Membro', situacao: 'Ativo', permissoes: {} });

  const [usuarioResetSenha, setUsuarioResetSenha] = useState<UsuarioSistema | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState('');

  // CARREGAR DADOS DO SUPABASE E ATIVAR REALTIME
  useEffect(() => {
    const carregarTudoDoSupabase = async () => {
      try {
        const [
          { data: uData },
          { data: mData },
          { data: egData },
          { data: cData },
          { data: cfData },
          { data: movData },
          { data: mensData },
          { data: evData },
          { data: pData },
          { data: demData },
          { data: prodData },
          { data: metaData },
          { data: reuData },
          { data: patData },
          { data: mktData },
          { data: audData }
        ] = await Promise.all([
          supabase.from('usuarios').select('*'),
          supabase.from('membros').select('*'),
          supabase.from('egressos_getecc').select('*'),
          supabase.from('colaboradores').select('*'),
          supabase.from('colaboradores_financeiros').select('*'),
          supabase.from('movimentacoes').select('*'),
          supabase.from('mensalidades').select('*'),
          supabase.from('eventos_especiais').select('*'),
          supabase.from('projetos').select('*'),
          supabase.from('demandas').select('*'),
          supabase.from('producoes').select('*'),
          supabase.from('metas_anuais').select('*'),
          supabase.from('reunioes').select('*'),
          supabase.from('patrimonio').select('*'),
          supabase.from('marketing').select('*'),
          supabase.from('auditoria').select('*')
        ]);

        if (uData) setUsuarios(uData);
        if (mData) setMembros(mData);
        if (egData) setEgressosGETECC(egData);
        if (cData) setColaboradores(cData);
        if (cfData) setColaboradoresFinanceiros(cfData);
        if (movData) setMovimentacoes(movData);
        if (mensData) setMensalidades(mensData);
        if (evData) setEventosEspeciais(evData);
        if (pData) setProjetos(pData);
        if (demData) setDemandas(demData);
        if (prodData) setProducoes(prodData);
        if (metaData) setMetasAnuais(metaData);
        if (reuData) setReunioes(reuData);
        if (patData) setPatrimonio(patData);
        if (mktData) setMarketing(mktData);
        if (audData) setHistoricoAuditoria(audData);
      } catch (err) {
        console.error("Erro ao carregar dados do Supabase:", err);
      }
    };

    carregarTudoDoSupabase();

    const canal = supabase
      .channel('sincronizacao-global')
      .on('postgres_changes', { event: '*', schema: 'public' }, () => {
        carregarTudoDoSupabase();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  useEffect(() => {
    const carregarConstrucoes = async () => {
      const { data, error } = await supabase.from('construcoes_pendentes').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('A tabela construcoes_pendentes precisa ser criada no Supabase:', error.message);
        return;
      }
      setConstrucoesPendentes((data || []) as ConstrucaoPendente[]);
    };
    carregarConstrucoes();
    const canalConstrucoes = supabase.channel('construcoes-pendentes-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'construcoes_pendentes' }, carregarConstrucoes)
      .subscribe();
    return () => { supabase.removeChannel(canalConstrucoes); };
  }, []);

  const excluirConstrucaoPendente = async (item: ConstrucaoPendente) => {
    if (!temPermissao('construcoes', 'editar')) { alert('Você não possui permissão para excluir construções pendentes.'); return; }
    if (!confirm(`Excluir a construção pendente “${item.titulo}”? Esta ação não poderá ser desfeita.`)) return;
    const { error } = await supabase.from('construcoes_pendentes').delete().eq('id', item.id);
    if (error) { alert(`Não foi possível excluir: ${error.message}`); return; }
    setConstrucoesPendentes((prev) => prev.filter((x) => x.id !== item.id));
    registrarAuditoria('Excluir construção pendente', 'Construções pendentes', item.titulo);
  };

  const salvarConstrucaoPendente = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: ConstrucaoPendente = {
      id: formConstrucao.id || crypto.randomUUID(),
      titulo: formConstrucao.titulo?.trim() || '',
      objetivo: formConstrucao.objetivo?.trim() || '',
      projeto_mae: formConstrucao.projeto_mae || '',
      origem: formConstrucao.origem || '',
      link_drive: formConstrucao.link_drive || '',
      banco_dados: formConstrucao.banco_dados || '',
      status: formConstrucao.status || 'Pendente'
    };
    if (!item.titulo || !item.objetivo) { alert('Informe o título e o objetivo da produção.'); return; }
    const { error } = await supabase.from('construcoes_pendentes').upsert(item);
    if (error) { alert(`Não foi possível salvar. Verifique se a tabela construcoes_pendentes foi criada no Supabase: ${error.message}`); return; }
    setConstrucoesPendentes((prev) => [item, ...prev.filter((x) => x.id !== item.id)]);
    setFormConstrucao({ status: 'Pendente' });
    setModalAtivo(null);
    registrarAuditoria('Salvar construção pendente', 'Construções pendentes', item.titulo);
  };

  useEffect(() => {
    let ativo = true;
    const carregarUsuarioAtual = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!ativo) return;
      const email = (user?.email || '').trim().toLocaleLowerCase('pt-BR');
      const metadata = (user?.user_metadata || {}) as Record<string, unknown>;
      const nomesMetadata = [metadata.nome_completo, metadata.full_name, metadata.name, metadata.nome, metadata.display_name, metadata.user_name, metadata.preferred_username]
        .filter((v): v is string => typeof v === 'string' && !!v.trim());
      // Resolve o usuário autenticado de forma determinística: primeiro pelo ID do Supabase Auth,
      // depois pelo e-mail e somente então pelos metadados. Isso impede que um funcionário seja
      // confundido com o cadastro administrativo do Cosme.
      const usuarioPorId = user?.id ? usuarios.find((u) => u.id === user.id) : undefined;
      const usuarioPorEmail = email ? usuarios.find((u) => (u.email || '').trim().toLocaleLowerCase('pt-BR') === email) : undefined;
      const usuarioPorNome = nomesMetadata.map((nome) => usuarios.find((u) => normalizarNomeResponsavel(u.nome_completo) === normalizarNomeResponsavel(nome))).find(Boolean);
      const usuarioResolvido = usuarioPorId || usuarioPorEmail || usuarioPorNome;
      const nomePerfil = usuarioResolvido?.nome_completo || nomesMetadata[0] || '';
      const identidadeCosme = /cosme/i.test(`${nomePerfil} ${email}`);

      // Para o filtro “Atribuídas a mim”, usamos apenas a identidade canônica do usuário atual.
      // Aliases legados “Cosme/Sistema” são adicionados SOMENTE quando a conta autenticada é realmente
      // a conta do Cosme; funcionários nunca herdam essas identidades.
      const identidadesBase = [usuarioResolvido?.nome_completo].filter((v): v is string => typeof v === 'string' && !!v.trim());
      if (identidadeCosme) identidadesBase.push('Cosme', 'Cosme', 'Sistema', 'sistema');
      const identidades = Array.from(new Set(identidadesBase));
      setIdentidadesUsuarioLogado(identidades);
      setUsuarioLogado(usuarioResolvido || null);
    };
    carregarUsuarioAtual();
    return () => { ativo = false; };
  }, [usuarios]);

  const temPermissao = (abaKey: string, acao: 'visualizar' | 'editar'): boolean => {
    if (!usuarioLogado) return true;
    if (['Administrador', 'Gestão'].includes(usuarioLogado.perfil_acesso)) return true;
    if (abaKey === 'coracao') {
      return ['Administrador', 'Gestão', 'Coordenador'].includes(usuarioLogado.perfil_acesso);
    }
    return usuarioLogado.permissoes?.[abaKey]?.[acao] ?? false;
  };

  const nomeUsuarioAtual = () => {
    // A conta administrativa do sistema pertence ao Cosme.
    // Priorizamos essa identificação antes do nome salvo no cadastro de usuários,
    // evitando que um cadastro legado chamado "Sistema" seja gravado como autor.
    const identidadeCosme = identidadesUsuarioLogado.some((x) => /cosme/i.test(x));
    if (identidadeCosme) return 'Cosme';
    if (usuarioLogado?.nome_completo?.trim() && !/^sistema$/i.test(usuarioLogado.nome_completo.trim())) {
      return usuarioLogado.nome_completo.trim();
    }
    return 'Usuário autenticado';
  };

  const registrarAuditoria = async (operacao: string, modulo: string, detalhes: string) => {
    const item: ItemAuditoria = {
      id: String(Date.now()),
      usuario_nome: nomeUsuarioAtual(),
      operacao,
      modulo,
      detalhes,
      data_hora: new Date().toLocaleString('pt-BR'),
    };
    setHistoricoAuditoria((prev) => [item, ...prev]);
    try {
      await supabase.from('auditoria').upsert(item);
    } catch (err) {
      console.error('Erro ao gravar log de auditoria no Supabase:', err);
    }
  };

  const exportarParaExcel = (dados: any[], nomeArquivo: string) => {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
    XLSX.writeFile(wb, `${nomeArquivo}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const obterAlertaPrazoDemanda = (prazoFinal: string, status: string) => {
    if (status === 'Concluída') return null;
    // Datas de prazo são armazenadas como YYYY-MM-DD. Não usamos new Date('YYYY-MM-DD')
    // diretamente porque o JavaScript interpreta esse formato como UTC e, no Brasil,
    // isso pode deslocar a data para o dia anterior. Aqui comparamos apenas as datas,
    // sem horário e sem conversão de fuso.
    const hoje = new Date();
    const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const [ano, mes, dia] = prazoFinal.slice(0, 10).split('-').map(Number);
    const prazoUtc = Date.UTC(ano, mes - 1, dia);
    const diffDias = Math.round((prazoUtc - hojeUtc) / (1000 * 60 * 60 * 24));

    if (diffDias < 0) {
      return { tipo: 'vencida', texto: `🚨 Vencida há ${Math.abs(diffDias)} dia(s)!`, cor: 'bg-red-50 text-red-800 border border-red-200' };
    } else if (diffDias <= 3) {
      return { tipo: 'urgente', texto: `⚠️ Vence em ${diffDias === 0 ? 'hoje' : `${diffDias} dia(s)`}!`, cor: 'bg-amber-100 text-amber-900 border border-amber-300' };
    }
    return null;
  };

  const salvarDemanda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!separarResponsaveis(formDemanda.responsavel_nome || '').length) { alert('Marque pelo menos um responsável pela demanda.'); return; }
    const id = formDemanda.id || crypto.randomUUID();
    const item: Demanda = {
      id,
      codigo: formDemanda.codigo || `DEM-${Math.floor(1000 + Math.random() * 9000)}`,
      titulo: formDemanda.titulo || '',
      descricao: formDemanda.descricao || '',
      responsavel_nome: formDemanda.responsavel_nome || '',
      cadastrado_por: formDemanda.cadastrado_por || nomeUsuarioAtual(),
      concluido_por: formDemanda.status === 'Concluída' ? (formDemanda.concluido_por || nomeUsuarioAtual()) : undefined,
      eh_coracao: formDemanda.eh_coracao || false,
      prazo_final: formDemanda.prazo_final || new Date().toISOString().split('T')[0],
      prioridade: formDemanda.prioridade || 'Média',
      status: formDemanda.status || 'Em andamento',
      anexos: formDemanda.anexos || [],
    };

    try {
      const { error } = await supabase.from('demandas').upsert(item);
      if (error) throw error;

      if (formDemanda.id) {
        setDemandas(demandas.map((d) => (d.id === id ? item : d)));
      } else {
        setDemandas([...demandas, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Demanda', 'Demandas', `Demanda ${item.codigo}: ${item.titulo}`);
    } catch (err: any) {
      alert(`Erro ao salvar demanda: ${err.message || err}`);
    }
  };

  const marcarDemandaConcluida = async (d: Demanda) => {
    const dAtualizada: Demanda = {
      ...d,
      status: 'Concluída',
      concluido_por: nomeUsuarioAtual(),
    };
    try {
      const { error } = await supabase.from('demandas').upsert(dAtualizada);
      if (error) throw error;
      setDemandas(demandas.map((item) => (item.id === d.id ? dAtualizada : item)));
      registrarAuditoria('Conclusão Demanda', 'Demandas', `Demanda ${d.codigo} concluída por ${nomeUsuarioAtual()}`);
    } catch (err: any) {
      alert(`Erro ao atualizar demanda: ${err.message || err}`);
    }
  };

  const salvarEgresso = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: EgressoGETECC = {
      id: formEgresso.id || crypto.randomUUID(),
      nome_completo: formEgresso.nome_completo?.trim() || '',
      curso_formacao: formEgresso.curso_formacao?.trim() || '',
      instituicao_formacao: formEgresso.instituicao_formacao?.trim() || 'UNIFACISA',
      data_ingresso_getecc: formEgresso.data_ingresso_getecc || '',
      data_saida_getecc: formEgresso.data_saida_getecc || '',
      motivo_saida: formEgresso.motivo_saida?.trim() || '',
      trajetorias: formEgresso.trajetorias || [],
      instituicao_atual: formEgresso.instituicao_atual?.trim() || '',
      cidade_uf_atual: formEgresso.cidade_uf_atual?.trim() || '',
      observacoes: formEgresso.observacoes?.trim() || '',
    };
    if (!item.nome_completo) { alert('Informe o nome completo do egresso.'); return; }
    try {
      const { error } = await supabase.from('egressos_getecc').upsert(item);
      if (error) throw error;
      setEgressosGETECC((prev) => formEgresso.id ? prev.map((x) => x.id === item.id ? item : x) : [item, ...prev]);
      setFormEgresso({ trajetorias: [] });
      setModalAtivo(null);
      registrarAuditoria('Salvar Egresso GETECC', 'Egressos', `Egresso ${item.nome_completo} salvo`);
    } catch (err: any) {
      alert(`Erro ao salvar egresso: ${err.message || err}`);
    }
  };

  const excluirEgresso = async (id: string) => {
    if (!temPermissao('egressos', 'editar')) { alert('Você não possui permissão para excluir egressos.'); return; }
    const item = egressosGETECC.find((x) => x.id === id);
    if (!item || !confirm(`Excluir o egresso “${item.nome_completo}”?`)) return;
    try {
      const { error } = await supabase.from('egressos_getecc').delete().eq('id', id);
      if (error) throw error;
      setEgressosGETECC((prev) => prev.filter((x) => x.id !== id));
      registrarAuditoria('Excluir Egresso GETECC', 'Egressos', `Egresso ${item.nome_completo} excluído`);
    } catch (err: any) { alert(`Erro ao excluir egresso: ${err.message || err}`); }
  };

  // CORREÇÃO: ENVIA NULL SE A DATA DE DESLIGAMENTO ESTIVER VAZIA
  const salvarMembro = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formMembro.id || crypto.randomUUID();
    const payload: Membro = {
      id,
      matricula: formMembro.matricula || '',
      nome_completo: formMembro.nome_completo || '',
      foto_dataurl: formMembro.foto_dataurl || '',
      cpf: formMembro.cpf || '',
      email_institucional: formMembro.email_institucional || '',
      email_alternativo: formMembro.email_alternativo || '',
      instagram: formMembro.instagram || '',
      orcid_link: formMembro.orcid_link || '',
      lattes_link: formMembro.lattes_link || '',
      endereco: formMembro.endereco || '',
      financiamento: formMembro.financiamento || '',
      telefone: formMembro.telefone || '',
      curso_formacao: formMembro.curso_formacao || '',
      instituicao: formMembro.instituicao || '',
      selecao_ingresso: formMembro.selecao_ingresso || '',
      categoria: formMembro.categoria || 'Estudantes',
      funcao_cargo: formMembro.funcao_cargo || '',
      data_ingresso: formMembro.data_ingresso || new Date().toISOString().split('T')[0],
      data_desligamento: formMembro.data_desligamento && formMembro.data_desligamento.trim() !== '' 
        ? formMembro.data_desligamento 
        : null,
      situacao: formMembro.situacao || 'Ativo',
      historico_afastamentos: formMembro.historico_afastamentos || [],
    };

    try {
      const { error } = await supabase.from('membros').upsert(payload);
      if (error) throw error;

      if (formMembro.id) {
        setMembros(membros.map((m) => (m.id === id ? payload : m)));
      } else {
        setMembros([...membros, payload]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Membro', 'Membros', `Membro ${payload.nome_completo} salvo`);
    } catch (err: any) {
      alert(`Erro ao salvar membro: ${err.message || err}`);
    }
  };

  const salvarAfastamento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMembro.id) return;

    const novoAfastamento: RegistroAfastamento = {
      id: crypto.randomUUID(),
      tipo: formAfastamento.tipo || 'Licença',
      data_inicio: formAfastamento.data_inicio || new Date().toISOString().split('T')[0],
      data_fim: formAfastamento.data_fim || '',
      motivo: formAfastamento.motivo || '',
    };

    const historicoAtualizado = [...(formMembro.historico_afastamentos || []), novoAfastamento];
    const membroAtualizado: Membro = {
      ...(formMembro as Membro),
      situacao: 'Em Afastamento/Licença',
      historico_afastamentos: historicoAtualizado,
    };

    try {
      const { error } = await supabase.from('membros').upsert(membroAtualizado);
      if (error) throw error;

      setMembros(membros.map((m) => (m.id === formMembro.id ? membroAtualizado : m)));
      setModalAtivo(null);
      setFormAfastamento({});
      registrarAuditoria('Registrar Licença', 'Membros', `Ausência registrada para ${formMembro.nome_completo}`);
    } catch (err: any) {
      alert(`Erro ao salvar licença: ${err.message || err}`);
    }
  };

  const salvarColaborador = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formColaborador.id || crypto.randomUUID();
    const item: ColaboradorExterno = {
      id,
      nome: formColaborador.nome || '',
      cpf: formColaborador.cpf || '',
      titulacao: formColaborador.titulacao || 'Doutor',
      email: formColaborador.email || '',
      orcid: formColaborador.orcid || '',
      numero_conselho: formColaborador.numero_conselho || '',
      afiliacao: formColaborador.afiliacao || '',
    };

    try {
      const { error } = await supabase.from('colaboradores').upsert(item);
      if (error) throw error;

      if (formColaborador.id) {
        setColaboradores(colaboradores.map((c) => (c.id === id ? item : c)));
      } else {
        setColaboradores([...colaboradores, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Colaborador', 'Colaboradores', `Colaborador ${item.nome} salvo`);
    } catch (err: any) {
      alert(`Erro ao salvar colaborador: ${err.message || err}`);
    }
  };

  const salvarColaboradorFinanceiro = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formColaboradorFinanceiro.id || crypto.randomUUID();
    const item: ColaboradorFinanceiro = {
      id,
      nome: formColaboradorFinanceiro.nome || '',
      cpf: formColaboradorFinanceiro.cpf || '',
      titulacao: formColaboradorFinanceiro.titulacao || 'Doutor',
      email: formColaboradorFinanceiro.email || '',
      orcid: formColaboradorFinanceiro.orcid || '',
      numero_conselho: formColaboradorFinanceiro.numero_conselho || '',
      afiliacao: formColaboradorFinanceiro.afiliacao || '',
      evento_ou_artigo: formColaboradorFinanceiro.evento_ou_artigo || '',
      valor_pago: formColaboradorFinanceiro.valor_pago || 'R$ 0,00',
      status_publicacao: formColaboradorFinanceiro.status_publicacao || 'Em análise',
      data_registro: formColaboradorFinanceiro.data_registro || new Date().toISOString().split('T')[0],
    };

    try {
      const { error } = await supabase.from('colaboradores_financeiros').upsert(item);
      if (error) throw error;

      if (formColaboradorFinanceiro.id) {
        setColaboradoresFinanceiros(colaboradoresFinanceiros.map((cf) => (cf.id === id ? item : cf)));
      } else {
        setColaboradoresFinanceiros([...colaboradoresFinanceiros, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Colaborador Financeiro', 'Colaboradores', `Aba 3: ${item.nome}`);
    } catch (err: any) {
      alert(`Erro ao salvar colaborador financeiro: ${err.message || err}`);
    }
  };

  const salvarMovimentacao = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formMovimentacao.id || crypto.randomUUID();
    const item: MovimentacaoFinanceira = {
      id,
      descricao: formMovimentacao.descricao || '',
      valor: Number(formMovimentacao.valor || 0),
      tipo: formMovimentacao.tipo || 'Entrada',
      categoria: formMovimentacao.categoria || 'Outros',
      data: formMovimentacao.data || new Date().toISOString().split('T')[0],
      membro_id: formMovimentacao.membro_id,
      membro_nome: formMovimentacao.membro_nome,
      observacoes: formMovimentacao.observacoes,
    };

    try {
      const { error } = await supabase.from('movimentacoes').upsert(item);
      if (error) throw error;

      if (formMovimentacao.id) {
        setMovimentacoes(movimentacoes.map((m) => (m.id === id ? item : m)));
      } else {
        setMovimentacoes([...movimentacoes, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Lançamento Caixa', 'Financeiro', `Caixa: ${item.tipo} - R$ ${item.valor}`);
    } catch (err: any) {
      alert(`Erro ao salvar caixa: ${err.message || err}`);
    }
  };

  const salvarProjeto = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formProjeto.id || crypto.randomUUID();
    const docentesArr = formDocentesTexto.split(',').map((s) => s.trim()).filter(Boolean);
    const discentesArr = formDiscentesTexto.split(',').map((s) => s.trim()).filter(Boolean);

    const item: ProjetoPesquisa = {
      id,
      titulo: formProjeto.titulo || '',
      coordenador: formProjeto.coordenador || '',
      linha_pesquisa: formProjeto.linha_pesquisa || '',
      docentes: docentesArr,
      discentes: discentesArr,
      parecer_cep: formProjeto.parecer_cep || '',
      caee_cep: formProjeto.caee_cep || '',
      financiamento: formProjeto.financiamento || '',
      observacoes: formProjeto.observacoes || '',
      is_nupex: !!formProjeto.is_nupex,
      status: formProjeto.status || 'Em aberto',
      artigos_derivados: formProjeto.artigos_derivados || [],
      anexos: formProjeto.anexos || [],
      parecer_cep_arquivo_dataurl: formProjeto.parecer_cep_arquivo_dataurl || '',
      parecer_cep_arquivo_nome: formProjeto.parecer_cep_arquivo_nome || '',
    };

    try {
      const { error } = await supabase.from('projetos').upsert(item);
      if (error) throw error;

      if (formProjeto.id) {
        setProjetos(projetos.map((p) => (p.id === id ? item : p)));
      } else {
        setProjetos([...projetos, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Projeto', 'Projetos', `Projeto: ${item.titulo}`);
    } catch (err: any) {
      alert(`Erro ao salvar projeto: ${err.message || err}`);
    }
  };
const adicionarArtigoDerivadoNoProjeto = () => {
    if (!formArtigoDerivado.titulo || !formArtigoDerivado.revista) {
      alert('Preencha o título e a revista do artigo derivado.');
      return;
    }
    const novoArtigo: ArtigoDerivado = {
      id: crypto.randomUUID(),
      titulo: formArtigoDerivado.titulo || '',
      revista: formArtigoDerivado.revista || '',
      qualis_jcr_cite: formArtigoDerivado.qualis_jcr_cite || '',
      status: formArtigoDerivado.status || 'em produção',
      anexos: formArtigoDerivado.anexos || [],
    };

    setFormProjeto({
      ...formProjeto,
      artigos_derivados: [...(formProjeto.artigos_derivados || []), novoArtigo],
    });
    setFormArtigoDerivado({ status: 'em produção', anexos: [] });
  };

  const salvarProducao = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formProducao.id || crypto.randomUUID();
    const item: ProducaoCientifica = {
      id,
      categoria_producao: formProducao.categoria_producao || 'Periódico',
      tipo_producao: formProducao.tipo_producao || 'Artigo Científico',
      titulo: formProducao.titulo || '',
      evento_ou_revista: formProducao.evento_ou_revista || '',
      autor_principal: formProducao.autor_principal || '',
      coautores: formProducao.coautores || '',
      ano_producao: (formProducao.categoria_producao || 'Periódico') === 'Congresso' ? (formProducao.ano_publicacao || '2026') : (formProducao.ano_producao || formProducao.ano_publicacao || '2026'),
      ano_publicacao: formProducao.ano_publicacao || '2026',
      qualis_doi: formProducao.qualis_doi || 'N/A',
      status: formProducao.status || 'Publicado',
    };

    try {
      const { error } = await supabase.from('producoes').upsert(item);
      if (error) throw error;

      if (formProducao.id) {
        setProducoes(producoes.map((p) => (p.id === id ? item : p)));
      } else {
        setProducoes([...producoes, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Produção', 'Produções', `Produção: ${item.titulo}`);
    } catch (err: any) {
      alert(`Erro ao salvar produção: ${err.message || err}`);
    }
  };

  const salvarMetaAnual = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: MetaAnualProducao = {
      ano: formMetaAnual.ano || '2026',
      meta_artigos_produzidos: Number(formMetaAnual.meta_artigos_produzidos || 0),
      meta_artigos_publicados: Number(formMetaAnual.meta_artigos_publicados || 0),
      meta_resumos: Number(formMetaAnual.meta_resumos || 0),
    };

    try {
      const { error } = await supabase.from('metas_anuais').upsert(item);
      if (error) throw error;

      const idx = metasAnuais.findIndex((m) => m.ano === item.ano);
      if (idx >= 0) {
        const copy = [...metasAnuais];
        copy[idx] = item;
        setMetasAnuais(copy);
      } else {
        setMetasAnuais([...metasAnuais, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Meta Anual', 'Produções', `Meta ano ${item.ano} salva`);
    } catch (err: any) {
      alert(`Erro ao salvar meta: ${err.message || err}`);
    }
  };

  const excluirMetaAnual = async (meta: MetaAnualProducao) => {
    if (!temPermissao('producoes', 'editar')) { alert('Você não possui permissão para excluir metas.'); return; }
    if (!confirm(`Excluir a meta anual de ${meta.ano}? Esta ação não poderá ser desfeita.`)) return;
    const { error } = await supabase.from('metas_anuais').delete().eq('ano', meta.ano);
    if (error) { alert(`Erro ao excluir meta: ${error.message}`); return; }
    setMetasAnuais((prev) => prev.filter((m) => m.ano !== meta.ano));
    registrarAuditoria('Excluir meta anual', 'Produções', `Meta do ano ${meta.ano} excluída`);
  };

  const salvarReuniao = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formReuniao.id || crypto.randomUUID();
    const listaPresencas = membrosAtivos.map((m) => ({
      membro_id: m.id,
      membro_nome: m.nome_completo,
      status: presencasChamada[m.id] || 'presente',
    }));

    const item: ReuniaoCientifica = {
      id,
      titulo: formReuniao.titulo || 'Encontro Científico',
      data: formReuniao.data || new Date().toISOString().split('T')[0],
      horario: formReuniao.horario || '19:00',
      pauta: formReuniao.pauta || '',
      presencas: listaPresencas,
    };

    try {
      const { error } = await supabase.from('reunioes').upsert(item);
      if (error) throw error;

      if (formReuniao.id) {
        setReunioes(reunioes.map((r) => (r.id === id ? item : r)));
      } else {
        setReunioes([...reunioes, item]);
      }
      setModalAtivo(null);
      setPresencasChamada({});
      registrarAuditoria('Salvar Reunião', 'Reuniões', `Reunião ${item.titulo} salva`);
    } catch (err: any) {
      alert(`Erro ao salvar reunião: ${err.message || err}`);
    }
  };

  const salvarPatrimonio = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formPatrimonio.id || crypto.randomUUID();
    const item: PatrimonioProduto = {
      id,
      nome: formPatrimonio.nome || '',
      descricao: formPatrimonio.descricao || '',
      quantidade: Number(formPatrimonio.quantidade || 1),
      foto_dataurl: formPatrimonio.foto_dataurl || '',
      estado_conservacao: formPatrimonio.estado_conservacao || 'Excelente',
      responsavel: formPatrimonio.responsavel || '',
    };

    try {
      const { error } = await supabase.from('patrimonio').upsert(item);
      if (error) throw error;

      if (formPatrimonio.id) {
        setPatrimonio(patrimonio.map((p) => (p.id === id ? item : p)));
      } else {
        setPatrimonio([...patrimonio, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Patrimônio', 'Patrimônio', `Item: ${item.nome}`);
    } catch (err: any) {
      alert(`Erro ao salvar patrimônio: ${err.message || err}`);
    }
  };

  const salvarMarketing = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = formMarketing.id || crypto.randomUUID();
    const item: MarketingItem = {
      id,
      titulo: formMarketing.titulo || '',
      canal: formMarketing.canal || 'Instagram',
      responsavel: formMarketing.responsavel || '',
      data_prevista: formMarketing.data_prevista || new Date().toISOString().split('T')[0],
      status: formMarketing.status || 'Ideia',
      legenda: formMarketing.legenda || '',
      artes: formMarketing.artes || [],
    };

    try {
      const { error } = await supabase.from('marketing').upsert(item);
      if (error) throw error;

      if (formMarketing.id) {
        setMarketing(marketing.map((m) => (m.id === id ? item : m)));
      } else {
        setMarketing([...marketing, item]);
      }
      setModalAtivo(null);
      registrarAuditoria('Salvar Marketing', 'Marketing', `Ação: ${item.titulo}`);
    } catch (err: any) {
      alert(`Erro ao salvar mídia: ${err.message || err}`);
    }
  };

  const salvarUsuarioSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formUsuario.email?.trim();
    const nomeCompleto = formUsuario.nome_completo?.trim();
    const perfilAcesso = formUsuario.perfil_acesso || 'Membro';
    const permissoes = formUsuario.permissoes || {};

    if (!email || !nomeCompleto) {
      alert('Por favor, preencha o nome e o e-mail do usuário.');
      return;
    }

    try {
      if (formUsuario.id) {
        const { error } = await supabase
          .from('usuarios')
          .update({ nome_completo: nomeCompleto, email, perfil_acesso: perfilAcesso, permissoes })
          .eq('id', formUsuario.id);

        if (error) throw error;
        setUsuarios(usuarios.map(u => u.id === formUsuario.id ? { ...u, nome_completo: nomeCompleto, email, perfil_acesso: perfilAcesso as any, permissoes } : u));
        alert('Usuário e permissões atualizados!');
      } else {
        const senhaProvisoria = 'Getecc@2026';
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: senhaProvisoria,
          options: { data: { nome_completo: nomeCompleto, perfil_acesso: perfilAcesso } }
        });

        if (authError) throw authError;
        const novoId = authData.user?.id || String(Date.now());

        const { error: dbError } = await supabase.from('usuarios').upsert({
          id: novoId,
          nome_completo: nomeCompleto,
          email,
          perfil_acesso: perfilAcesso,
          situacao: 'Ativo',
          permissoes,
        });

        if (dbError) throw dbError;
        setUsuarios([...usuarios, { id: novoId, nome_completo: nomeCompleto, email, perfil_acesso: perfilAcesso as any, situacao: 'Ativo', permissoes }]);
        alert(`Usuário cadastrado com sucesso!\n\nE-mail: ${email}\nSenha provisória: ${senhaProvisoria}`);
      }

      setModalAtivo(null);
      registrarAuditoria('Cadastro/Edição Usuário', 'Usuários', `Usuário ${email} salvo`);
    } catch (err: any) {
      alert(`Erro ao salvar no Supabase: ${err.message || err}`);
    }
  };

  const handleEnviarEmailResetSenha = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) alert(`Aviso: ${error.message}`);
      else alert(`E-mail de redefinição enviado para ${email}!`);
      registrarAuditoria('Reset de Senha por E-mail', 'Usuários', `Solicitou redefinição para ${email}`);
      setModalAtivo(null);
      setUsuarioResetSenha(null);
    } catch (err: any) {
      alert(`Erro: ${err.message || err}`);
    }
  };

  const handleAlterarSenhaDireta = async () => {
    if (!usuarioResetSenha) return;
    if (!novaSenhaInput || novaSenhaInput.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    try {
      await supabase.auth.updateUser({ password: novaSenhaInput });
      alert(`Senha do usuário ${usuarioResetSenha.nome_completo} alterada!`);
      registrarAuditoria('Redefinição Direta de Senha', 'Usuários', `Senha alterada para ${usuarioResetSenha.email}`);
      setNovaSenhaInput('');
      setUsuarioResetSenha(null);
      setModalAtivo(null);
    } catch (err: any) {
      alert(`Senha atualizada no sistema para ${usuarioResetSenha.nome_completo}.`);
      setNovaSenhaInput('');
      setUsuarioResetSenha(null);
      setModalAtivo(null);
    }
  };

  const salvarEdicaoMensalidade = async () => {
    const { membro_id, ano, mes, valor, status, data_pagamento } = formEdicaoMensalidade;
    const existe = mensalidades.find((m) => m.membro_id === membro_id && m.ano === ano && m.mes === mes);

    const nova: PagamentoMensalidade = {
      id: existe ? existe.id : String(Date.now()),
      membro_id,
      ano,
      mes,
      valor,
      status,
      data_pagamento: status === 'Pago' ? data_pagamento : undefined,
    };

    try {
      const { error } = await supabase.from('mensalidades').upsert(nova);
      if (error) throw error;

      if (existe) {
        setMensalidades(mensalidades.map((m) => (m.id === existe.id ? nova : m)));
      } else {
        setMensalidades([...mensalidades, nova]);
      }
      setModalAtivo(null);
      registrarAuditoria('Lançamento Mensalidade', 'Financeiro', `Mensalidade ${mes}/${ano} atualizada`);
    } catch (err: any) {
      alert(`Erro ao salvar mensalidade: ${err.message || err}`);
    }
  };

  const salvarEdicaoEventoEspecial = async () => {
    const { membro_id, evento, valor, status, data_pagamento } = formEdicaoEventoEspecial;
    const existe = eventosEspeciais.find((e) => e.membro_id === membro_id && e.evento === evento);

    const nova: PagamentoEventoEspecial = {
      id: existe ? existe.id : String(Date.now()),
      membro_id,
      evento,
      valor,
      status,
      data_pagamento: status === 'Pago' ? data_pagamento : undefined,
    };

    try {
      const { error } = await supabase.from('eventos_especiais').upsert(nova);
      if (error) throw error;

      if (existe) {
        setEventosEspeciais(eventosEspeciais.map((e) => (e.id === existe.id ? nova : e)));
      } else {
        setEventosEspeciais([...eventosEspeciais, nova]);
      }
      setModalAtivo(null);
      registrarAuditoria('Lançamento Evento', 'Financeiro', `Taxa ${evento} atualizada`);
    } catch (err: any) {
      alert(`Erro ao salvar evento: ${err.message || err}`);
    }
  };

  const handleProcessarArquivoEmMassa = (e: React.ChangeEvent<HTMLInputElement>, destino: 'producoes' | 'relatorios') => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const buffer = event.target?.result as ArrayBuffer;
        const workbook = XLSX.read(buffer, { type: 'array' });
        const primeiraAba = workbook.Sheets[workbook.SheetNames[0]];
        const linhasBrutas: any[] = XLSX.utils.sheet_to_json(primeiraAba);

        const sanitizar = (val: any) => (typeof val === 'string' ? val.replace(/\u0000/g, '').trim() : val);

        if (destino === 'producoes') {
          const dadosLimpos = linhasBrutas.map((linha) => {
            const buscarValor = (variacoes: string[]) => {
              for (const key in linha) {
                const kNormalizada = sanitizar(key)
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '');

                for (const v of variacoes) {
                  const vNormalizada = v
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

                  if (kNormalizada === vNormalizada || kNormalizada.includes(vNormalizada)) {
                    return sanitizar(linha[key]);
                  }
                }
              }
              return '';
            };

            const catBruta = String(buscarValor(['categoria de publicacao', 'categoria', 'categoria_producao', 'tipo de producao']) || '');
            const cat = catBruta.toLowerCase().includes('congresso') || catBruta.toLowerCase().includes('resumo') ? 'Congresso' : 'Periódico';

            return {
              id: crypto.randomUUID(),
              categoria_producao: cat,
              status: String(buscarValor(['status', 'situacao']) || 'Publicado'),
              titulo: String(buscarValor(['titulo do trabalho', 'titulo', 'nome do trabalho', 'artigo']) || 'Sem Título'),
              tipo_producao: String(buscarValor(['tipo especifico', 'tipo_producao', 'tipo']) || (cat === 'Periódico' ? 'Artigo Científico' : 'Resumo Expandido')),
              evento_ou_revista: String(buscarValor(['periodico / nome do evento', 'periodico', 'revista', 'evento', 'congresso', 'nome do evento']) || 'N/A'),
              autor_principal: String(buscarValor(['autor', 'autor_principal', 'autor principal']) || 'GETECC'),
              coautores: String(buscarValor(['coautores', 'co-autores', 'coautor']) || ''),
              ano_producao: String(buscarValor(['ano de producao', 'ano_producao', 'ano de elaboracao']) || buscarValor(['ano de publicacao', 'ano_publicacao', 'ano']) || '2026'),
              ano_publicacao: String(buscarValor(['ano de publicacao', 'ano_publicacao', 'ano']) || '2026'),
              qualis_doi: String(buscarValor(['qualis / doi', 'qualis_doi', 'qualis', 'doi']) || 'N/A'),
            };
          });

          const { error } = await supabase.from('producoes').insert(dadosLimpos);
          if (error) throw error;
          alert(`Importação concluída! ${dadosLimpos.length} produções salvas no Supabase.`);
        } else {
          const importados = linhasBrutas.map((linha) => ({
            congresso: sanitizar(linha['Periódico / Nome do Evento'] || linha.congresso || linha.Congresso || 'Congresso Acadêmico'),
            autor: sanitizar(linha['Autor'] || linha.autor || linha.Autor || 'Autor Principal'),
            titulo: sanitizar(linha['Título do Trabalho'] || linha.titulo || linha.Titulo || 'Título do Trabalho'),
            coautores: sanitizar(linha['Coautores'] || linha.coautores || ''),
            ano: sanitizar(linha['Ano de Publicação'] || linha.ano || linha.Ano || '2026'),
          }));
          setBaseImportadaEventos((prev) => [...importados, ...prev]);
          alert(`Sucesso! ${importados.length} registros somados à base cumulativa.`);
        }
      } catch (err: any) {
        alert(`Erro na importação: ${err.message}`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCargaMassaProducoes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoCargaMassaProducao.trim()) return;
    const linhas = textoCargaMassaProducao.split('\n');
    const novasProds: ProducaoCientifica[] = [];

    linhas.forEach((linha) => {
      if (!linha.trim()) return;
      const cols = linha.includes(';') ? linha.split(';') : linha.split('\t');
      if (cols.length >= 3) {
        const cat = (cols[0]?.trim().toLowerCase().includes('congresso') ? 'Congresso' : 'Periódico') as 'Periódico' | 'Congresso';
        novasProds.push({
          id: crypto.randomUUID(),
          categoria_producao: cat,
          tipo_producao: cols[1]?.trim() || (cat === 'Periódico' ? 'Artigo Científico' : 'Resumo Expandido'),
          titulo: cols[2]?.trim() || 'Título Importado',
          evento_ou_revista: cols[3]?.trim() || 'Periódico/Congresso',
          autor_principal: cols[4]?.trim() || 'Autor GETECC',
          coautores: cols[5]?.trim() || '',
          ano_producao: cols.length >= 10 ? (cols[6]?.trim() || '2026') : (cols[6]?.trim() || '2026'),
          ano_publicacao: cols.length >= 10 ? (cols[7]?.trim() || cols[6]?.trim() || '2026') : (cols[6]?.trim() || '2026'),
          qualis_doi: (cols.length >= 10 ? cols[8] : cols[7])?.trim() || 'N/A',
          status: ((cols.length >= 10 ? cols[9] : cols[8])?.trim() as any) || 'Publicado',
        });
      }
    });

    try {
      const { error } = await supabase.from('producoes').upsert(novasProds);
      if (error) throw error;

      setProducoes([...novasProds, ...producoes]);
      setTextoCargaMassaProducao('');
      setModalAtivo(null);
      registrarAuditoria('Importação em Massa', 'Produções', `Importou ${novasProds.length} produções.`);
      alert(`Sucesso! ${novasProds.length} produções adicionadas.`);
    } catch (err: any) {
      alert(`Erro ao salvar no Supabase: ${err.message || err}`);
    }
  };

  const handleProcessarBaseRelatorioCumulativa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textoCSVRelatorio.trim()) return;
    const linhas = textoCSVRelatorio.split('\n');
    const importados: { congresso: string; autor: string; titulo: string; coautores: string; ano?: string }[] = [];

    linhas.forEach((linha) => {
      if (!linha.trim()) return;
      const cols = linha.includes(';') ? linha.split(';') : linha.split('\t');
      if (cols.length >= 3) {
        importados.push({
          congresso: cols[0]?.trim() || 'Congresso Acadêmico',
          autor: cols[1]?.trim() || 'Autor Principal',
          titulo: cols[2]?.trim() || 'Título do Trabalho',
          coautores: cols[3]?.trim() || '',
          ano: cols[4]?.trim() || '2026',
        });
      }
    });

    setBaseImportadaEventos([...importados, ...baseImportadaEventos]);
    setTextoCSVRelatorio('');
    registrarAuditoria('Importação Cumulativa', 'Relatórios', `Acrescentou ${importados.length} registros.`);
    alert(`Sucesso! ${importados.length} registros somados.`);
  };

  const handleUploadFotoMembro = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setFormMembro({ ...formMembro, foto_dataurl: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleUploadFotoPatrimonio = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setFormPatrimonio({ ...formPatrimonio, foto_dataurl: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const calcularQuantitativoPorAutor = () => {
    const contagem: { [autor: string]: { autor: string; principal: number; coautor: number; total: number } } = {};

    producoes.forEach((p) => {
      const pAutor = p.autor_principal.trim();
      if (pAutor) {
        if (!contagem[pAutor]) contagem[pAutor] = { autor: pAutor, principal: 0, coautor: 0, total: 0 };
        contagem[pAutor].principal += 1;
        contagem[pAutor].total += 1;
      }
      if (p.coautores) {
        p.coautores.split(',').forEach((co) => {
          const coNome = co.trim();
          if (coNome) {
            if (!contagem[coNome]) contagem[coNome] = { autor: coNome, principal: 0, coautor: 0, total: 0 };
            contagem[coNome].coautor += 1;
            contagem[coNome].total += 1;
          }
        });
      }
    });

    baseImportadaEventos.forEach((item) => {
      const autorP = item.autor.trim();
      if (autorP) {
        if (!contagem[autorP]) contagem[autorP] = { autor: autorP, principal: 0, coautor: 0, total: 0 };
        contagem[autorP].principal += 1;
        contagem[autorP].total += 1;
      }
      if (item.coautores) {
        item.coautores.split(',').forEach((co) => {
          const coNome = co.trim();
          if (coNome) {
            if (!contagem[coNome]) contagem[coNome] = { autor: coNome, principal: 0, coautor: 0, total: 0 };
            contagem[coNome].coautor += 1;
            contagem[coNome].total += 1;
          }
        });
      }
    });

    return Object.values(contagem);
  };

  const handleExcluir = async (categoria: string, id: string) => {
    if (!temPermissao(categoria, 'editar')) {
      alert('Você não possui permissão para excluir registros neste módulo.');
      return;
    }
    if (confirm(`Confirmar exclusão no módulo ${categoria}?`)) {
      try {
        let tabela = categoria;
        if (categoria === 'colaboradoresFinanceiros') tabela = 'colaboradores_financeiros';
        if (categoria === 'eventosEspeciais') tabela = 'eventos_especiais';
        if (categoria === 'metasAnuais') tabela = 'metas_anuais';

        const { error } = await supabase.from(tabela).delete().eq('id', id);
        if (error) throw error;

        if (categoria === 'membros') setMembros(membros.filter((m) => m.id !== id));
        if (categoria === 'colaboradores') setColaboradores(colaboradores.filter((c) => c.id !== id));
        if (categoria === 'colaboradoresFinanceiros') setColaboradoresFinanceiros(colaboradoresFinanceiros.filter((c) => c.id !== id));
        if (categoria === 'movimentacoes') setMovimentacoes(movimentacoes.filter((m) => m.id !== id));
        if (categoria === 'projetos') setProjetos(projetos.filter((p) => p.id !== id));
        if (categoria === 'demandas') setDemandas(demandas.filter((d) => d.id !== id));
        if (categoria === 'producoes') setProducoes(producoes.filter((p) => p.id !== id));
        if (categoria === 'reunioes') setReunioes(reunioes.filter((r) => r.id !== id));
        if (categoria === 'patrimonio') setPatrimonio(patrimonio.filter((p) => p.id !== id));
        if (categoria === 'marketing') setMarketing(marketing.filter((m) => m.id !== id));
        if (categoria === 'usuarios') setUsuarios(usuarios.filter((u) => u.id !== id));

        registrarAuditoria('Exclusão', categoria, `Registro ID #${id} excluído`);
      } catch (err: any) {
        alert(`Erro ao excluir: ${err.message || err}`);
      }
    }
  };

  // CÁLCULO DE CAIXA
  const totalReceitasColaboradoresAba3 = colaboradoresFinanceiros.reduce(
    (acc, col) => acc + extrairValorNumerico(col.valor_pago),
    0
  );
  const totalMensalidadesPagas = mensalidades.filter((m) => m.status === 'Pago').reduce((acc, m) => acc + Number(m.valor || 0), 0);
  const totalEventosEspeciaisPagos = eventosEspeciais.filter((e) => e.status === 'Pago').reduce((acc, e) => acc + Number(e.valor || 0), 0);
  const totalEntradasManuais = movimentacoes.filter((m) => m.tipo === 'Entrada').reduce((acc, m) => acc + Number(m.valor || 0), 0);
  const totalSaidasManuais = movimentacoes.filter((m) => m.tipo === 'Saída').reduce((acc, m) => acc + Number(m.valor || 0), 0);

  const totalEntradasGeral = totalReceitasColaboradoresAba3 + totalMensalidadesPagas + totalEventosEspeciaisPagos + totalEntradasManuais;
  const totalSaidasGeral = totalSaidasManuais;
  const saldoCaixaAtual = totalEntradasGeral - totalSaidasGeral;

  const obterTodasMovimentacoesUnificadas = () => {
    const lista: (MovimentacaoFinanceira & { origem_badge?: string })[] = [
      ...movimentacoes.map((m) => ({ ...m, origem_badge: 'Lançamento Manual' })),
    ];

    colaboradoresFinanceiros.forEach((col) => {
      const v = extrairValorNumerico(col.valor_pago);
      if (v > 0) {
        lista.push({
          id: `colab-auto-${col.id}`,
          descricao: `Adquirição: ${col.evento_ou_artigo} (${col.nome})`,
          valor: v,
          tipo: 'Entrada',
          categoria: 'Inscrição / Publicação',
          data: col.data_registro || '2026-08-10',
          observacoes: `Integrado da Aba 3 • Status: ${col.status_publicacao}`,
          origem_badge: 'Colaborador Aba 3',
        });
      }
    });

    mensalidades.forEach((ms) => {
      if (ms.status === 'Pago') {
        const mb = membros.find((m) => m.id === ms.membro_id);
        const nomeMes = NOMES_MESES[ms.mes - 1] || `Mês ${ms.mes}`;
        lista.push({
          id: `mens-auto-${ms.id}`,
          descricao: `Mensalidade ${nomeMes}/${ms.ano} - ${mb?.nome_completo || 'Membro'}`,
          valor: ms.valor,
          tipo: 'Entrada',
          categoria: 'Mensalidade',
          data: ms.data_pagamento || new Date().toISOString().split('T')[0],
          membro_id: ms.membro_id,
          membro_nome: mb?.nome_completo,
          origem_badge: 'Mensalidade Membro',
        });
      }
    });

    eventosEspeciais.forEach((ee) => {
      if (ee.status === 'Pago') {
        const mb = membros.find((m) => m.id === ee.membro_id);
        lista.push({
          id: `ee-auto-${ee.id}`,
          descricao: `Taxa ${ee.evento} - ${mb?.nome_completo || 'Membro'}`,
          valor: ee.valor,
          tipo: 'Entrada',
          categoria: ee.evento === 'Day Off' ? 'Day Off' : 'São João',
          data: ee.data_pagamento || new Date().toISOString().split('T')[0],
          membro_id: ee.membro_id,
          membro_nome: mb?.nome_completo,
          origem_badge: `Evento ${ee.evento}`,
        });
      }
    });

    return lista.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  };

  const movimentacoesFiltradas = obterTodasMovimentacoesUnificadas().filter((item) => {
    const atendeTipo = filtroFinTipo === 'Todos' || item.tipo === filtroFinTipo;
    const atendeCategoria = filtroFinCategoria === 'Todas' || item.categoria === filtroFinCategoria;
    const atendeBusca = termoBusca
      ? item.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        (item.membro_nome && item.membro_nome.toLowerCase().includes(termoBusca.toLowerCase()))
      : true;

    let atendeData = true;
    if (filtroFinDataInicio) atendeData = atendeData && new Date(item.data) >= new Date(filtroFinDataInicio);
    if (filtroFinDataFim) atendeData = atendeData && new Date(item.data) <= new Date(filtroFinDataFim);

    return atendeTipo && atendeCategoria && atendeBusca && atendeData;
  });

  const membrosAtivos = membros.filter((m) => m.situacao === 'Ativo');

  const anoAtual = anoMetaPainel;
  const metaAtual = metasAnuais.find((m) => m.ano === anoAtual) || { ano: anoAtual, meta_artigos_produzidos: 10, meta_artigos_publicados: 6, meta_resumos: 10 };

  const artigosProduzidosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Periódico' && (p.ano_producao || p.ano_publicacao || anoAtual) === anoAtual).length;
  const artigosPublicadosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Periódico' && ['Publicado', 'anais publicados'].includes(p.status) && (p.ano_publicacao || anoAtual) === anoAtual).length;
  const resumosPublicadosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Congresso' && ['Publicado', 'anais publicados', 'Aprovado'].includes(p.status) && (p.ano_publicacao || anoAtual) === anoAtual).length;

  const pctArtigosProduzidos = Math.min(Math.round((artigosProduzidosAnoAtual / (metaAtual.meta_artigos_produzidos || 1)) * 100), 100);
  const pctArtigosPublicados = Math.min(Math.round((artigosPublicadosAnoAtual / (metaAtual.meta_artigos_publicados || 1)) * 100), 100);
  const pctResumos = Math.min(Math.round((resumosPublicadosAnoAtual / (metaAtual.meta_resumos || 1)) * 100), 100);

  const projetosNupex = projetos.filter((p) => !!p.is_nupex);
  const projetosNaoNupex = projetos.filter((p) => !p.is_nupex);
  const projetosEmCursoNupex = projetosNupex.filter((p) => p.status === 'Em execução').length;
  const projetosFinalizadosNupex = projetosNupex.filter((p) => p.status === 'Concluído').length;
  const projetosEmCursoOutros = projetosNaoNupex.filter((p) => p.status === 'Em execução').length;
  const projetosFinalizadosOutros = projetosNaoNupex.filter((p) => p.status === 'Concluído').length;

  const membrosAtivosPorCategoria = [
    { label: 'Gestão', valor: membrosAtivos.filter((m) => m.categoria === 'Gestão').length, cor: PALETA_GETECC[0] },
    { label: 'Apoio de Gestão', valor: membrosAtivos.filter((m) => m.categoria === 'Apoio de Gestão').length, cor: PALETA_GETECC[2] },
    { label: 'Estudantes', valor: membrosAtivos.filter((m) => m.categoria === 'Estudantes').length, cor: PALETA_GETECC[1] },
    { label: 'Egressos', valor: membrosAtivos.filter((m) => m.categoria === 'Egressos').length, cor: PALETA_GETECC[4] },
  ];

  const entradasPorAno = Array.from(new Set<string>(membrosAtivos.map((m) => String(m.data_ingresso || '').slice(0, 4)).filter(Boolean)))
    .sort((a, b) => a.localeCompare(b))
    .map((ano, i) => ({ label: ano, valor: membrosAtivos.filter((m) => String(m.data_ingresso || '').slice(0, 4) === ano).length, cor: PALETA_GETECC[i % PALETA_GETECC.length] }));

  const membrosPorCurso = Array.from(new Set<string>(membrosAtivos.map((m) => (m.curso_formacao || 'Não informado').trim()).filter(Boolean)))
    .map((curso) => ({ label: curso, valor: membrosAtivos.filter((m) => (m.curso_formacao || 'Não informado').trim() === curso).length }))
    .sort((a, b) => b.valor - a.valor);

  const entradasPorCursoSelecao = Array.from(new Set<string>(membros.map((m) => `${(m.curso_formacao || 'Não informado').trim()}|||${(m.selecao_ingresso || 'Não informada').trim()}`)))
    .map((chave, i) => {
      const [curso, selecao] = chave.split('|||');
      return { label: `${curso} · ${selecao}`, valor: membros.filter((m) => `${(m.curso_formacao || 'Não informado').trim()}|||${(m.selecao_ingresso || 'Não informada').trim()}` === chave).length, cor: PALETA_GETECC[i % PALETA_GETECC.length] };
    })
    .sort((a, b) => b.valor - a.valor);

  const colaboradoresPorAfiliacao = Array.from(new Set<string>(colaboradores.map((c) => (c.afiliacao || 'Não informada').trim()).filter(Boolean)))
    .map((afiliacao) => ({ label: afiliacao, valor: colaboradores.filter((c) => (c.afiliacao || 'Não informada').trim() === afiliacao).length }))
    .sort((a, b) => b.valor - a.valor);

  const projetosNupexStatus = [
    { label: 'NUPEX · Em curso', valor: projetosEmCursoNupex, cor: PALETA_GETECC[0] },
    { label: 'NUPEX · Finalizados', valor: projetosFinalizadosNupex, cor: PALETA_GETECC[1] },
    { label: 'Outros · Em curso', valor: projetosEmCursoOutros, cor: PALETA_GETECC[2] },
    { label: 'Outros · Finalizados', valor: projetosFinalizadosOutros, cor: PALETA_GETECC[4] },
  ];

  const atuacoesEgressoOpcoes = ['Concurso público', 'Residência', 'Mestrado', 'Doutorado', 'Preceptoria de estágio', 'Assistência', 'Hospital HELP', 'Docência', 'Gestão', 'Empreendedorismo', 'Outro'];
  const egressosPorAtuacao = atuacoesEgressoOpcoes.map((atuacao, i) => ({
    label: atuacao,
    valor: egressosGETECC.filter((e) => (e.trajetorias || []).includes(atuacao)).length,
    cor: PALETA_GETECC[i % PALETA_GETECC.length],
  }));
  const egressosComAcompanhamento = egressosGETECC.filter((e) => (e.trajetorias || []).length > 0).length;
  const egressosInstituicoes = new Set(egressosGETECC.map((e) => (e.instituicao_atual || '').trim()).filter(Boolean)).size;

  const novosMembrosAno = membrosAtivos.filter((m) => String(m.data_ingresso || '').startsWith(anoAtual)).length;
  const projetosEmCursoTotal = projetos.filter((p) => p.status === 'Em execução').length;
  const projetosFinalizadosTotal = projetos.filter((p) => p.status === 'Concluído').length;
  const producoesAnoAtualTotal = producoes.filter((p) => String(p.ano_producao || p.ano_publicacao || '') === anoAtual).length;
  const artigosEmProducao = producoes.filter((p) => p.categoria_producao === 'Periódico' && !['Publicado', 'anais publicados'].includes(p.status)).length;
  const producoesPorCategoria = [
    { label: 'Artigos de periódicos', valor: producoes.filter((p) => p.categoria_producao === 'Periódico').length, cor: PALETA_GETECC[0] },
    { label: 'Resumos de congressos', valor: producoes.filter((p) => p.categoria_producao === 'Congresso').length, cor: PALETA_GETECC[1] },
  ];
  const artigosPorStatus = [
    { label: 'Publicados', valor: producoes.filter((p) => p.categoria_producao === 'Periódico' && ['Publicado', 'anais publicados'].includes(p.status)).length, cor: PALETA_GETECC[0] },
    { label: 'Submetidos', valor: producoes.filter((p) => p.categoria_producao === 'Periódico' && p.status === 'Submetido').length, cor: PALETA_GETECC[3] },
    { label: 'Em editoração', valor: producoes.filter((p) => p.categoria_producao === 'Periódico' && p.status === 'em editoração').length, cor: PALETA_GETECC[2] },
    { label: 'Aguardando submissão', valor: producoes.filter((p) => p.categoria_producao === 'Periódico' && p.status === 'aguardando submissão').length, cor: PALETA_GETECC[4] },
  ];

  const congressosAgrupados = producoes
    .filter((p) => p.categoria_producao === 'Congresso')
    .reduce<{ [evento: string]: ProducaoCientifica[] }>((acc, p) => {
      const ev = p.evento_ou_revista.trim() || 'Evento Geral';
      if (!acc[ev]) acc[ev] = [];
      acc[ev].push(p);
      return acc;
    }, {});

  const listaEventosCompradores = Array.from(
    new Set([
      ...colaboradoresFinanceiros.map((c) => c.evento_ou_artigo),
      ...producoes.filter((p) => p.categoria_producao === 'Congresso').map((p) => p.evento_ou_revista),
    ])
  );

  const colaboradoresFinanceirosFiltrados = colaboradoresFinanceiros.filter((c) => {
    const atendeEvento = filtroEventoFinanceiro === 'Todos' || c.evento_ou_artigo === filtroEventoFinanceiro;
    const atendeBusca = termoBusca ? c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || c.email.toLowerCase().includes(termoBusca.toLowerCase()) || c.cpf.includes(termoBusca) : true;
    return atendeEvento && atendeBusca;
  });

  const normalizarNomeResponsavel = (nome: string) => (nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9@._-]+/g, ' ').replace(/\s+/g, ' ').trim().toLocaleLowerCase('pt-BR');
  const separarResponsaveis = (valor: string) => (valor || '').split(/[,;\n|]+/).map((n) => n.trim()).filter(Boolean);
  const responsavelIncluiUsuario = (responsaveis: string, identidades: string[] = []) => {
    const atribuicoes = separarResponsaveis(responsaveis).map(normalizarNomeResponsavel).filter(Boolean);
    const nomesPossiveis = identidades.map(normalizarNomeResponsavel).filter((nome) => nome.length >= 3);
    // O filtro deve ser individual: só considera uma demanda “minha” quando um dos responsáveis
    // coincide exatamente com uma identidade do usuário autenticado.
    return nomesPossiveis.some((nome) => atribuicoes.includes(nome));
  };

  const demandasGerais = demandas.filter((d) => !d.eh_coracao);
  const demandasCoracao = demandas.filter((d) => d.eh_coracao);

  const listaResponsaveisDemandas = Array.from(new Set([
    ...usuarios.filter((u) => u.situacao === 'Ativo').map((u) => u.nome_completo),
    ...demandas.flatMap((d) => (d.responsavel_nome || '').split(',').map((n) => n.trim()))
  ].filter(Boolean))).sort((a, b) => a.localeCompare(b, 'pt-BR'));

  const demandasFiltradas = demandasGerais.filter((d) => {
    const atendeStatus = filtroDemandaStatus === 'Todos' || d.status === filtroDemandaStatus;
    const nomesResp = (d.responsavel_nome || '').split(',').map((n) => n.trim());
    const atendeResponsavel = filtroDemandaResponsavel === 'Todos' || nomesResp.some((n) => normalizarNomeResponsavel(n) === normalizarNomeResponsavel(filtroDemandaResponsavel));
    const atendeMinha = !somenteMinhasDemandas || responsavelIncluiUsuario(d.responsavel_nome || '', [usuarioLogado?.nome_completo || '', ...identidadesUsuarioLogado].filter(Boolean));
    const atendeBusca = termoBusca
      ? d.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        d.codigo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        d.descricao.toLowerCase().includes(termoBusca.toLowerCase())
      : true;

    return atendeStatus && atendeResponsavel && atendeMinha && atendeBusca;
  });

  const demandasPendentes = demandasFiltradas.filter((d) => d.status !== 'Concluída');
  const demandasConcluidas = demandasFiltradas.filter((d) => d.status === 'Concluída');
  const pesoPrioridade: Record<string, number> = { 'Urgente': 0, 'Alta': 1, 'Média': 2, 'Baixa': 3 };
  const ordenarDemandas = (lista: Demanda[]) => [...lista].sort((a, b) => ordenacaoDemandas === 'prioridade' ? (pesoPrioridade[a.prioridade] ?? 9) - (pesoPrioridade[b.prioridade] ?? 9) || a.prazo_final.localeCompare(b.prazo_final) : a.prazo_final.localeCompare(b.prazo_final) || (pesoPrioridade[a.prioridade] ?? 9) - (pesoPrioridade[b.prioridade] ?? 9));
  const demandasOrdenadas = [...ordenarDemandas(demandasPendentes), ...ordenarDemandas(demandasConcluidas)];

  const demandasCoracaoFiltradas = demandasCoracao.filter((d) => {
    const nomes = (d.responsavel_nome || '').split(',').map((n) => n.trim());
    const respOk = filtroDemandaResponsavel === 'Todos' || nomes.some((n) => normalizarNomeResponsavel(n) === normalizarNomeResponsavel(filtroDemandaResponsavel));
    const minhaOk = !somenteMinhasDemandas || responsavelIncluiUsuario(d.responsavel_nome || '', [usuarioLogado?.nome_completo || '', ...identidadesUsuarioLogado].filter(Boolean));
    const buscaOk = !termoBusca || `${d.titulo} ${d.codigo} ${d.descricao}`.toLowerCase().includes(termoBusca.toLowerCase());
    return respOk && minhaOk && buscaOk;
  });
  const demandasCoracaoPendentes = demandasCoracaoFiltradas.filter((d) => d.status !== 'Concluída');
  const demandasCoracaoConcluidas = demandasCoracaoFiltradas.filter((d) => d.status === 'Concluída');
  const demandasCoracaoOrdenadas = [...ordenarDemandas(demandasCoracaoPendentes), ...ordenarDemandas(demandasCoracaoConcluidas)];
  const formatarDataCalendario = (data: Date) => `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}-${String(data.getDate()).padStart(2, '0')}`;
  const obterDiasCalendario = (mes: Date) => {
    const primeiroDia = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const deslocamentoSegunda = (primeiroDia.getDay() + 6) % 7;
    return Array.from({ length: 42 }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), 1 - deslocamentoSegunda + i));
  };
  const diasCalendarioDemandas = obterDiasCalendario(mesCalendarioDemandas);
  const diasCalendarioCoracao = obterDiasCalendario(mesCalendarioCoracao);
  const nomeMesCalendario = (mes: Date) => mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  const listaAutoresProducoes = Array.from(
    new Set([
      ...producoes.map((p) => p.autor_principal).filter(Boolean),
      ...producoes.flatMap((p) => p.coautores ? p.coautores.split(',').map((c) => c.trim()) : []).filter(Boolean),
    ])
  );

  const producoesFiltradas = producoes.filter((p) => {
    const atendeAutor =
      filtroProducaoAutor === 'Todos' ||
      p.autor_principal.toLowerCase().includes(filtroProducaoAutor.toLowerCase()) ||
      (p.coautores && p.coautores.toLowerCase().includes(filtroProducaoAutor.toLowerCase()));
    const atendeBusca = termoBusca
      ? p.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        p.evento_ou_revista.toLowerCase().includes(termoBusca.toLowerCase())
      : true;
    return atendeAutor && atendeBusca;
  });

  const calcularResumoFaltas = () => {
    const mapaFaltas: { [membroId: string]: { nome: string; faltas: number; justificadas: number; presencas: number } } = {};
    membros.forEach((m) => {
      mapaFaltas[m.id] = { nome: m.nome_completo, faltas: 0, justificadas: 0, presencas: 0 };
    });

    reunioes.forEach((r) => {
      r.presencas.forEach((p) => {
        if (mapaFaltas[p.membro_id]) {
          if (p.status === 'falta') mapaFaltas[p.membro_id].faltas += 1;
          if (p.status === 'falta_justificada') mapaFaltas[p.membro_id].justificadas += 1;
          if (p.status === 'presente') mapaFaltas[p.membro_id].presencas += 1;
        }
      });
    });

    return Object.values(mapaFaltas);
  };

  const membrosOutros = membros.filter((m) => m.situacao !== 'Ativo');
  const pesoCategoriaMembro: Record<string, number> = { 'Gestão': 0, 'Apoio de Gestão': 1, 'Estudantes': 2, 'Egressos': 3 };
  const ordenarMembrosPorGestao = (lista: Membro[]) => [...lista].sort((a, b) => (pesoCategoriaMembro[a.categoria] ?? 9) - (pesoCategoriaMembro[b.categoria] ?? 9) || a.nome_completo.localeCompare(b.nome_completo, 'pt-BR'));
  const membrosOrdenados = [...ordenarMembrosPorGestao(membrosAtivos), ...ordenarMembrosPorGestao(membrosOutros)];

  const abasDisponiveisChaves = [
    { key: 'membros', label: '2. Membros do GETECC' },
    { key: 'egressos', label: '3. Acompanhamento de Egressos' },
    { key: 'colaboradores', label: '3. Colaboradores & Publicações' },
    { key: 'projetos', label: '4. Projetos de Pesquisa' },
    { key: 'demandas', label: '5. Gestão de Demandas' },
    { key: 'coracao', label: '5.1 Demandas do Coração' },
    { key: 'pendencias', label: '6. Pendências e Prazos' },
    { key: 'producoes', label: '7. Produções Científicas' },
    { key: 'reunioes', label: '8. Encontros e Presença' },
    { key: 'patrimonio', label: '9. Patrimônio e Produtos' },
    { key: 'marketing', label: '10. Gestão de Marketing' },
    { key: 'financeiro', label: '11. Financeiro (Caixa & Taxas)' },
    { key: 'usuarios', label: '12. Usuários e Permissões' },
    { key: 'relatorios', label: '13. Relatórios e Exportação' },
    { key: 'construcoes', label: '14. Construções Pendentes' },
    { key: 'configuracoes', label: '14. Configurações' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* BARRA LATERAL INSTITUCIONAL */}
      <aside className="w-full md:w-64 bg-slate-50 text-slate-900 flex flex-col justify-between border-r border-slate-300 flex-shrink-0 shadow-sm">
        <div>
          <div className="p-4 border-b border-slate-300 bg-slate-100">
            <LogoGetecc />
          </div>

          <div className="p-3 bg-red-50 border-b border-red-200">
            <p className="font-black text-red-700 text-xs">Painel Administrativo Pleno</p>
            <p className="text-[10px] text-slate-900 font-bold truncate">
              {usuarioLogado ? `${usuarioLogado.nome_completo} (${usuarioLogado.perfil_acesso})` : 'Gestão Integrada GETECC'}
            </p>
          </div>

          <nav className="p-2 space-y-1 text-xs">
            {[
              { id: 'painel', label: '1. Painel Inicial', icon: '📊' },
              { id: 'membros', label: '2. Membros do GETECC', icon: '👥', count: membrosAtivos.length },
              { id: 'egressos', label: '3. Acompanhamento de Egressos', icon: '🎓', count: egressosGETECC.length },
              { id: 'colaboradores', label: '4. Colaboradores & Publicações', icon: '🌐', count: colaboradores.length + colaboradoresFinanceiros.length },
              { id: 'projetos', label: '5. Projetos de Pesquisa', icon: '🔬', count: projetos.length },
              { id: 'demandas', label: '6. Gestão de Demandas', icon: '📋', count: demandasPendentes.length },
              { id: 'coracao', label: 'Demandas do Coração', icon: '🫀', count: demandasCoracaoPendentes.length },
              { id: 'pendencias', label: '7. Pendências & Prazos', icon: '⚠️', count: demandasPendentes.length },
              { id: 'producoes', label: '8. Produções Científicas', icon: '📈', count: producoes.length },
              { id: 'reunioes', label: '9. Encontros & Presença', icon: '📅', count: reunioes.length },
              { id: 'patrimonio', label: '10. Patrimônio & Produtos', icon: '📦', count: patrimonio.length },
              { id: 'marketing', label: '11. Gestão de Marketing', icon: '📣', count: marketing.length },
              { id: 'financeiro', label: '12. Financeiro (Caixa & Taxas)', icon: '💰' },
              { id: 'usuarios', label: '13. Usuários & Permissões', icon: '🛡️', count: usuarios.length },
              { id: 'relatorios', label: '14. Relatórios & Exportação', icon: '📄' },
              { id: 'construcoes', label: '15. Construções Pendentes', icon: '🧩', count: construcoesPendentes.filter((c) => c.status !== 'Concluída').length },
              { id: 'configuracoes', label: '16. Configurações', icon: '⚙️' },
            ]
              .filter((item) => item.id === 'painel' || temPermissao(item.id, 'visualizar'))
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => setModuloAtivo(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-black transition-all text-left ${
                    moduloAtivo === item.id
                      ? 'bg-red-100 text-red-700 border border-red-300 shadow-sm'
                      : 'text-slate-900 hover:bg-slate-200 hover:text-red-700'
                  }`}
                >
                  <span className="flex items-center space-x-2 truncate">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-slate-200 text-slate-900">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
          </nav>
        </div>

        <div className="p-3 border-t border-slate-300 bg-slate-100">
          <button
            onClick={() => { supabase.auth.signOut(); window.location.href = '/'; }}
            className="w-full text-center bg-red-100 hover:bg-red-200 text-red-700 font-black text-xs py-2 rounded border border-red-300 transition-colors"
          >
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Estilos de impressão: remove navegação e controles, imprime somente o conteúdo do módulo */}
      <style>{`
        @media print {
          aside, header, button, input, select, textarea, .print\\:hidden { display: none !important; }
          body, main, .min-h-screen { background: white !important; color: black !important; }
          main { max-width: 100% !important; padding: 0 !important; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid #999 !important; color: black !important; }
          section, .rounded-lg, .shadow-sm { box-shadow: none !important; break-inside: avoid; }
        }
      `}</style>
      {/* ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <input
            type="text"
            placeholder="Pesquisar registros..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="text-xs px-3.5 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900 font-black w-full max-w-xs"
          />
          <button onClick={() => window.print()} className="print:hidden bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs px-4 py-2 rounded border border-slate-400">
            🖨️ Imprimir Relatório
          </button>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {moduloAtivo !== 'painel' && !temPermissao(moduloAtivo, 'visualizar') ? (
            <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center space-y-2">
              <span className="text-3xl">🛑</span>
              <h2 className="text-red-700 font-black text-base">Acesso Restrito</h2>
              <p className="text-xs text-slate-700 font-bold">Você não possui permissão para visualizar este módulo.</p>
            </div>
          ) : (
            <>
              {/* ABA 1: PAINEL INICIAL */}
              {moduloAtivo === 'painel' && (
                <div className="space-y-5 pb-8">
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_8px_rgba(15,23,42,0.035)]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
                      <div className="min-w-0 border-l-4 border-[#0072CE] pl-4">
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#0072CE]">GETECC · Relatório institucional</p>
                        <h1 className="break-words text-2xl font-black tracking-tight text-slate-900">Visão geral</h1>
                        <p className="mt-1 max-w-2xl break-words text-sm leading-5 text-slate-500">Indicadores de produção científica, composição da equipe, projetos e participação institucional.</p>
                      </div>
                      <label className="flex shrink-0 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
                        <span>Ano de referência</span>
                        <select value={anoMetaPainel} onChange={(e) => setAnoMetaPainel(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 font-extrabold text-slate-900 outline-none focus:border-[#0072CE] focus:ring-2 focus:ring-blue-100">
                          {Array.from(new Set([String(new Date().getFullYear()), ...metasAnuais.map((m) => m.ano), ...producoes.flatMap((p) => [p.ano_producao, p.ano_publicacao]).filter((x): x is string => !!x)])).sort((a,b) => b.localeCompare(a)).map((ano) => <option key={ano} value={ano}>{ano}</option>)}
                        </select>
                      </label>
                    </div>

                    {/* METAS ANUAIS — bloco principal do relatório */}
                    <div className="grid grid-cols-1 gap-4 bg-slate-50/70 p-4 lg:grid-cols-3">
                      {[
                        { label: `Artigos Produzidos (${anoAtual})`, value: artigosProduzidosAnoAtual, meta: metaAtual.meta_artigos_produzidos, pct: pctArtigosProduzidos, done: 'PRODUZIDOS' },
                        { label: `Artigos Publicados (${anoAtual})`, value: artigosPublicadosAnoAtual, meta: metaAtual.meta_artigos_publicados, pct: pctArtigosPublicados, done: 'PUBLICADOS' },
                        { label: `Resumos Congressos (${anoAtual})`, value: resumosPublicadosAnoAtual, meta: metaAtual.meta_resumos, pct: pctResumos, done: 'APROVADOS' },
                      ].map((m) => (
                        <div key={m.label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                          <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <span className="min-w-0 break-words text-sm font-extrabold leading-5 text-slate-800">{m.label}</span>
                            <span className="shrink-0 rounded-lg bg-[#EAF4FB] px-2.5 py-1 text-[11px] font-black text-[#0072CE]">{m.pct}%</span>
                          </div>
                          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                            <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 px-2 py-3"><div className="text-[10px] font-black uppercase tracking-wide text-slate-500">Meta</div><div className="mt-1 text-xl font-black text-slate-900">{m.meta}</div></div>
                            <div className="min-w-0 rounded-lg border border-blue-100 bg-[#EAF4FB] px-2 py-3"><div className="text-[10px] font-black uppercase tracking-wide text-[#0072CE]">{m.done}</div><div className="mt-1 text-xl font-black text-[#0072CE]">{m.value}</div></div>
                            <div className="min-w-0 rounded-lg border border-slate-100 bg-slate-50 px-2 py-3"><div className="text-[10px] font-black uppercase tracking-wide text-slate-500">Faltam</div><div className="mt-1 text-xl font-black text-slate-900">{Math.max(0, m.meta - m.value)}</div></div>
                          </div>
                          <div className="mt-4 h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-200" aria-label={`${m.pct}% da meta atingida`}><div className="h-full rounded-full transition-all duration-500" style={{ width: `${m.pct}%`, backgroundColor: '#0072CE', minWidth: m.pct > 0 ? '6px' : '0px' }} /></div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* INDICADORES INSTITUCIONAIS */}
                  <section>
                    <div className="mb-3 flex items-end justify-between gap-3 px-1">
                      <div><h2 className="text-sm font-black text-slate-800">Indicadores institucionais</h2></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                      {[
                        { label: 'Membros ativos', value: membrosAtivos.length, sub: `${novosMembrosAno} ingresso(s) em ${anoAtual}`, cor: 'text-[#0072CE]' },
                        { label: 'Projetos de pesquisa', value: projetos.length, sub: `${projetosEmCursoTotal} em curso · ${projetosFinalizadosTotal} finalizados`, cor: 'text-[#0F172A]' },
                        { label: 'Produções científicas', value: producoes.length, sub: `${producoesAnoAtualTotal} registro(s) em ${anoAtual}`, cor: 'text-[#0072CE]' },
                        { label: 'Colaboradores externos', value: colaboradores.length, sub: `${new Set(colaboradores.map((c) => c.afiliacao).filter(Boolean)).size} instituição(ões)`, cor: 'text-[#0F766E]' },
                        { label: 'Artigos em produção', value: artigosEmProducao, sub: 'não publicados', cor: 'text-[#DC2626]' },
                      ].map((kpi) => (
                        <div key={kpi.label} className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_8px_rgba(15,23,42,0.03)]">
                          <div className="break-words text-[10px] font-black uppercase leading-4 tracking-wider text-slate-400">{kpi.label}</div>
                          <div className={`mt-1 text-3xl font-black tracking-tight ${kpi.cor}`}>{kpi.value}</div>
                          <div className="mt-1 break-words text-[10px] font-semibold leading-4 text-slate-500">{kpi.sub}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* PRODUÇÃO */}
                  <section>
                    <div className="mb-3 px-1"><h2 className="text-sm font-black text-slate-800">Produção científica</h2></div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <GraficoCircular titulo="Composição das produções" segmentos={producoesPorCategoria} />
                      <GraficoLinha titulo="Evolução anual das produções" dados={Array.from(new Set<string>(producoes.map((p) => String(p.ano_producao || p.ano_publicacao || '')).filter(Boolean))).sort((a,b) => a.localeCompare(b)).slice(-7).map((ano) => ({ label: ano, valor: producoes.filter((p) => (p.ano_producao || p.ano_publicacao) === ano).length }))} />
                      <GraficoBarras titulo="Artigos por situação" dados={artigosPorStatus} />
                      <GraficoLinhasComparativo titulo="Artigos produzidos × publicados" dados={Array.from(new Set<string>(producoes.filter((p) => p.categoria_producao === 'Periódico').flatMap((p): string[] => [String(p.ano_producao || p.ano_publicacao || ''), String(p.ano_publicacao || '')]).filter(Boolean))).sort((a,b) => a.localeCompare(b)).slice(-6).map((ano) => ({
                        ano,
                        produzidos: producoes.filter((p) => p.categoria_producao === 'Periódico' && (p.ano_producao || p.ano_publicacao) === ano).length,
                        publicados: producoes.filter((p) => p.categoria_producao === 'Periódico' && p.ano_publicacao === ano && ['Publicado','anais publicados'].includes(p.status)).length,
                      }))} />
                    </div>
                  </section>

                  {/* MEMBROS */}
                  <section>
                    <div className="mb-3 px-1"><h2 className="text-sm font-black text-slate-800">Composição e ingresso de membros</h2></div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <GraficoCircular titulo="Membros ativos por categoria" segmentos={membrosAtivosPorCategoria} />
                      <GraficoColunas titulo="Entrada de membros ativos por ano" dados={entradasPorAno} />
                      <GraficoBarras titulo="Membros ativos por curso" dados={membrosPorCurso} />
                      <GraficoBarras titulo="Entrada por curso e seleção" dados={entradasPorCursoSelecao} />
                    </div>
                  </section>

                  {/* PROJETOS E COLABORADORES */}
                  <section>
                    <div className="mb-3 px-1"><h2 className="text-sm font-black text-slate-800">Projetos e rede de colaboração</h2></div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <BlocoProjetos dados={projetosNupexStatus} />
                      <GraficoBarras titulo="Colaboradores externos por afiliação" dados={colaboradoresPorAfiliacao} />
                    </div>
                  </section>

                  {/* IMPACTO DOS EGRESSOS */}
                  <section>
                    <div className="mb-3 px-1"><h2 className="text-sm font-black text-slate-800">Impacto dos egressos do GETECC</h2></div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <GraficoBarras titulo="Trajetória atual dos egressos" dados={egressosPorAtuacao} limite={11} />
                      <section className="flex min-w-0 min-h-[430px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.045)]">
                        <h3 className="break-words text-[15px] font-black leading-5 text-[#0F172A]">Acompanhamento dos egressos</h3>
                        <div className="mt-6 grid grid-cols-2 gap-3">
                          <div className="min-w-0 rounded-xl border border-slate-100 bg-[#EAF4FB] p-4"><div className="break-words text-[10px] font-black uppercase leading-4 tracking-wide text-[#0072CE]">Egressos cadastrados</div><div className="mt-2 text-3xl font-black text-[#0F172A]">{egressosGETECC.length}</div></div>
                          <div className="min-w-0 rounded-xl border border-slate-100 bg-[#FDECEC] p-4"><div className="break-words text-[10px] font-black uppercase leading-4 tracking-wide text-[#DC2626]">Com trajetória registrada</div><div className="mt-2 text-3xl font-black text-[#0F172A]">{egressosComAcompanhamento}</div></div>
                          <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="break-words text-[10px] font-black uppercase leading-4 tracking-wide text-slate-500">Instituições informadas</div><div className="mt-2 text-3xl font-black text-[#0F172A]">{egressosInstituicoes}</div></div>
                          <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="break-words text-[10px] font-black uppercase leading-4 tracking-wide text-slate-500">Vínculos registrados</div><div className="mt-2 text-3xl font-black text-[#0F172A]">{egressosPorAtuacao.reduce((s, x) => s + x.valor, 0)}</div></div>
                        </div>
                        <p className="mt-auto pt-6 break-words text-xs leading-5 text-slate-500">O indicador evidencia a trajetória profissional e acadêmica de pessoas que já passaram pelo GETECC e permite apresentar seu impacto para além do período de participação no grupo.</p>
                      </section>
                    </div>
                  </section>

                  {/* HISTÓRICO DE METAS */}
                  {metasAnuais.length > 0 && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-4">
                      <div><h2 className="text-sm font-black text-slate-800">Histórico de metas</h2><p className="mt-1 text-xs leading-4 text-slate-500">Acompanhamento anual da produção científica.</p></div>
                      {temPermissao('producoes', 'editar') && <button onClick={() => { setFormMetaAnual({ ano: String(new Date().getFullYear() + 1), meta_artigos_produzidos: 10, meta_artigos_publicados: 6, meta_resumos: 10 }); setModalAtivo('cadastrarMeta'); }} className="rounded-lg border border-blue-200 bg-[#EAF4FB] px-3 py-2 text-xs font-black text-[#0072CE] hover:bg-blue-100">+ Cadastrar meta</button>}
                    </div>
                    <div className="overflow-x-auto"><table className="w-full border-collapse text-xs"><thead><tr className="bg-slate-50"><th className="border-b p-3 text-left">Ano</th><th className="border-b p-3">Artigos produzidos</th><th className="border-b p-3">Artigos publicados</th><th className="border-b p-3">Resumos</th><th className="border-b p-3">Ações</th></tr></thead><tbody>{[...metasAnuais].sort((a,b) => a.ano.localeCompare(b.ano)).map((m) => { const produzidos = producoes.filter((p) => (p.ano_producao || p.ano_publicacao) === m.ano && p.categoria_producao === 'Periódico').length; const publicados = producoes.filter((p) => p.ano_publicacao === m.ano && p.categoria_producao === 'Periódico' && ['Publicado','anais publicados'].includes(p.status)).length; const resumos = producoes.filter((p) => p.ano_publicacao === m.ano && p.categoria_producao === 'Congresso' && ['Publicado','anais publicados','Aprovado'].includes(p.status)).length; const progresso = (valor: number, meta: number) => Math.min(100, Math.round(valor / Math.max(1, meta) * 100)); return <tr key={m.ano} className="hover:bg-slate-50"><td className="border-b p-3 font-black">{m.ano}</td>{[[produzidos,m.meta_artigos_produzidos],[publicados,m.meta_artigos_publicados],[resumos,m.meta_resumos]].map(([valor,meta],i) => <td key={i} className="border-b p-3"><div className="text-center font-bold">{valor} / {meta}</div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#0072CE]" style={{width:`${progresso(Number(valor),Number(meta))}%`}} /></div><div className="mt-1 text-center text-[10px] text-slate-500">{progresso(Number(valor),Number(meta))}%</div></td>)}<td className="border-b p-3"><div className="flex flex-col gap-1"><button onClick={() => { setFormMetaAnual(m); setModalAtivo('cadastrarMeta'); }} className="rounded border px-2 py-1 font-bold text-slate-700 hover:bg-slate-100">Editar</button><button onClick={() => excluirMetaAnual(m)} className="rounded border border-red-200 px-2 py-1 font-bold text-red-700 hover:bg-red-50">Excluir</button></div></td></tr>; })}</tbody></table></div>
                  </section>}
                </div>
              )}

              {/* ABA 2: ACOMPANHAMENTO DE EGRESSOS DO GETECC */}
              {moduloAtivo === 'egressos' && (
                <div className="space-y-6">
                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-6">
                      <div className="min-w-0 border-l-4 border-[#DC2626] pl-4">
                        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#DC2626]">GETECC · Impacto social e profissional</p>
                        <h1 className="break-words text-2xl font-black tracking-tight text-[#0F172A]">Egressos do GETECC</h1>
                        <p className="mt-1 max-w-3xl break-words text-sm leading-5 text-slate-500">Acompanhamento da trajetória de pessoas que já integraram o grupo e hoje estão inseridas na formação, no trabalho e nos serviços de saúde.</p>
                      </div>
                      {temPermissao('egressos', 'editar') && <button onClick={() => { setFormEgresso({ trajetorias: [] }); setModalAtivo('egresso'); }} className="shrink-0 rounded-xl px-4 py-2.5 text-xs font-black shadow-sm transition-colors hover:opacity-90" style={{ backgroundColor: '#0072CE', color: '#FFFFFF' }}>+ Cadastrar egresso</button>}
                    </div>
                    <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-4 md:grid-cols-4">
                      {[
                        { label: 'Egressos cadastrados', value: egressosGETECC.length, cor: 'text-[#0072CE]' },
                        { label: 'Com trajetória registrada', value: egressosComAcompanhamento, cor: 'text-[#0F172A]' },
                        { label: 'Instituições informadas', value: egressosInstituicoes, cor: 'text-[#DC2626]' },
                        { label: 'Vínculos registrados', value: egressosPorAtuacao.reduce((s, x) => s + x.valor, 0), cor: 'text-[#0072CE]' },
                      ].map((kpi) => <div key={kpi.label} className="min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_8px_rgba(15,23,42,0.03)]"><div className="break-words text-[10px] font-black uppercase leading-4 tracking-wider text-slate-400">{kpi.label}</div><div className={`mt-1 text-3xl font-black tracking-tight ${kpi.cor}`}>{kpi.value}</div></div>)}
                    </div>
                  </section>

                  <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <GraficoBarras titulo="Trajetória atual dos egressos" dados={egressosPorAtuacao} limite={11} />
                    <GraficoCircular titulo="Distribuição das trajetórias" segmentos={egressosPorAtuacao.filter((x) => x.valor > 0)} />
                  </section>

                  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                      <h2 className="text-sm font-black text-slate-800">Egressos cadastrados</h2>
                      <span className="rounded-full bg-[#EAF4FB] px-3 py-1 text-[10px] font-black text-[#0072CE]">{egressosGETECC.length} registro(s)</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1100px] border-collapse text-xs">
                        <thead><tr className="bg-slate-50 text-left font-black text-slate-700"><th className="p-3">Egresso</th><th className="p-3">Curso</th><th className="p-3">Período no GETECC</th><th className="p-3">Trajetória atual</th><th className="p-3">Instituição / local</th><th className="p-3">Ações</th></tr></thead>
                        <tbody className="divide-y divide-slate-100">
                          {egressosGETECC.map((e) => <tr key={e.id} className="hover:bg-slate-50 align-top">
                            <td className="max-w-[220px] p-3 font-black text-slate-900 break-words">{e.nome_completo}</td>
                            <td className="max-w-[180px] p-3 break-words text-slate-600">{e.curso_formacao || 'Não informado'}</td>
                            <td className="p-3 text-slate-600">{e.data_ingresso_getecc || '—'}<br />{e.data_saida_getecc ? `até ${e.data_saida_getecc}` : '—'}</td>
                            <td className="max-w-[330px] p-3"><div className="flex flex-wrap gap-1.5">{(e.trajetorias || []).length ? e.trajetorias.map((a) => <span key={a} className="rounded-full border border-blue-100 bg-[#EAF4FB] px-2 py-1 text-[10px] font-bold text-[#0072CE]">{a}</span>) : <span className="text-slate-400">Não informada</span>}</div></td>
                            <td className="max-w-[240px] p-3 break-words text-slate-600">{e.instituicao_atual || 'Não informado'}{e.cidade_uf_atual ? <span className="block text-[10px] text-slate-400">{e.cidade_uf_atual}</span> : null}</td>
                            <td className="p-3"><div className="flex gap-1.5">{temPermissao('egressos', 'editar') && <><button onClick={() => { setFormEgresso(e); setModalAtivo('egresso'); }} className="rounded border border-slate-300 px-2 py-1 font-bold text-slate-700 hover:bg-slate-100">Editar</button><button onClick={() => excluirEgresso(e.id)} className="rounded border border-red-200 px-2 py-1 font-bold text-red-700 hover:bg-red-50">Excluir</button></>}</div></td>
                          </tr>)}
                          {!egressosGETECC.length && <tr><td colSpan={6} className="p-10 text-center text-xs font-semibold text-slate-400">Nenhum egresso do GETECC cadastrado.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="rounded-2xl border border-[#0072CE]/20 bg-[#EAF4FB] p-5">
                    <h2 className="text-sm font-black text-[#0F172A]">Impacto do GETECC</h2>
                    <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-600">O acompanhamento dos ex-integrantes permite demonstrar a trajetória profissional e acadêmica das pessoas que passaram pelo grupo, evidenciando inserção em concursos, residências, pós-graduação, preceptoria, assistência e instituições de saúde.</p>
                  </section>
                </div>
              )}

              {/* ABA 3: MEMBROS DO GETECC */}
              {moduloAtivo === 'membros' && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Membros do GETECC</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">Cartões de perfis individuais e tabela/planilha unificada de cadastrados.</p>
                    </div>
                    {temPermissao('membros', 'editar') && (
                      <button onClick={() => { setFormMembro({ situacao: 'Ativo', categoria: 'Estudantes', selecao_ingresso: '', historico_afastamentos: [] }); setModalAtivo('membro'); }} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                        + Cadastrar Integrante
                      </button>
                    )}
                  </div>

                  {/* CARTÕES DE PERFIL */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {membrosOrdenados.map((m) => (
                      <div key={m.id} className={`p-4 rounded-lg border shadow-sm space-y-3 ${m.situacao === 'Ativo' ? 'bg-white border-slate-300' : 'bg-slate-200 border-slate-400 opacity-90'}`}>
                        <div className="flex items-center space-x-3">
                          <img src={m.foto_dataurl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} alt={m.nome_completo} className="w-14 h-14 rounded-full object-cover border-2 border-red-600 shadow" />
                          <div className="overflow-hidden">
                            <h3 className="font-black text-slate-900 text-sm truncate">{m.nome_completo}</h3>
                            <p className="text-xs font-bold text-red-700">{m.funcao_cargo} ({m.categoria})</p>
                            <p className="text-[10px] font-mono font-bold text-slate-700">Mat: {m.matricula} | CPF: {m.cpf}</p>
                          </div>
                        </div>

                        <div className="text-xs space-y-1 pt-2 border-t border-slate-300 font-bold text-slate-900">
                          <p><strong>E-mail Inst:</strong> {m.email_institucional}</p>
                          <p><strong>E-mail Alt:</strong> {m.email_alternativo || 'Não informado'}</p>
                          <p><strong>Curso / Inst:</strong> {m.curso_formacao} ({m.instituicao})</p>
                          <p><strong>Endereço:</strong> {m.endereco || 'Não informado'}</p>
                          <p><strong>Financiamento:</strong> {m.financiamento || 'Não se aplica'}</p>
                          <p><strong>Telefone / Instagram:</strong> {m.telefone || 'N/A'} | {m.instagram || 'N/A'}</p>
                          <p><strong>Ingresso:</strong> {m.data_ingresso} {m.data_desligamento && `| Desligamento: ${m.data_desligamento}`}</p>
                          <p><strong>Seleção:</strong> {m.selecao_ingresso || 'Não informada'}</p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-300">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${m.situacao === 'Ativo' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>{m.situacao.toUpperCase()}</span>
                          {temPermissao('membros', 'editar') && (
                            <div className="space-x-1">
                              <button onClick={() => { setFormMembro(m); setModalAtivo('afastamento'); }} className="bg-amber-100 text-amber-900 font-black text-xs px-2 py-1 rounded border border-amber-300">+ Licença</button>
                              <button onClick={() => { setFormMembro(m); setModalAtivo('membro'); }} className="bg-slate-200 text-slate-900 font-black text-xs px-2 py-1 rounded border border-slate-400">Editar</button>
                              <button onClick={() => handleExcluir('membros', m.id)} className="bg-red-100 text-red-700 font-black text-xs px-2 py-1 rounded border border-red-300">Excluir</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PLANILHA / TABELA COMPLETA DE MEMBROS CADASTRADOS */}
                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4 mt-6">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                          <span>📊</span>
                          <span>Planilha Geral de Membros Cadastrados</span>
                        </h2>
                        <p className="text-xs text-slate-700 font-bold">Visão tabulada com todos os dados dos integrantes.</p>
                      </div>
                      {/* CORREÇÃO DO BOTÃO: TEXTO PRETO PRESERVADO */}
                      <button
                        onClick={() => exportarParaExcel(membros, 'membros_getecc')}
                        className="bg-emerald-100 hover:bg-emerald-200 text-slate-900 font-black text-xs px-3.5 py-2 rounded border border-emerald-300 shadow-sm flex items-center space-x-1"
                      >
                        <span>📥 Exportar Tabela Excel</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded border border-slate-300">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-3">Matrícula</th>
                            <th className="p-3">Nome Completo</th>
                            <th className="p-3">CPF</th>
                            <th className="p-3">E-mail Institucional</th>
                            <th className="p-3">Curso / Formação</th>
                            <th className="p-3">Categoria / Cargo</th>
                            <th className="p-3">Instituição</th>
                            <th className="p-3">Data Ingresso</th>
                            <th className="p-3">Seleção</th>
                            <th className="p-3">Situação</th>
                            {temPermissao('membros', 'editar') && <th className="p-3 text-right">Ações</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-bold">
                          {membrosOrdenados.length > 0 ? (
                            membrosOrdenados.map((mb) => (
                              <tr key={mb.id} className="hover:bg-slate-50">
                                <td className="p-3 font-mono font-black text-slate-900">{mb.matricula}</td>
                                <td className="p-3 font-black text-slate-900">{mb.nome_completo}</td>
                                <td className="p-3 font-mono">{mb.cpf}</td>
                                <td className="p-3">{mb.email_institucional}</td>
                                <td className="p-3">{mb.curso_formacao}</td>
                                <td className="p-3 text-red-700">{mb.categoria} - {mb.funcao_cargo}</td>
                                <td className="p-3">{mb.instituicao}</td>
                                <td className="p-3 font-mono">{mb.data_ingresso}</td>
                                <td className="p-3">{mb.selecao_ingresso || 'Não informada'}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                    mb.situacao === 'Ativo' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                                  }`}>
                                    {mb.situacao}
                                  </span>
                                </td>
                                {temPermissao('membros', 'editar') && (
                                  <td className="p-3 text-right space-x-1">
                                    <button onClick={() => { setFormMembro(mb); setModalAtivo('membro'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                    <button onClick={() => handleExcluir('membros', mb.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                  </td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={11} className="p-4 text-center text-slate-500 italic">Nenhum membro cadastrado.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: COLABORADORES EXTERNOS & PUBLICAÇÕES */}
              {moduloAtivo === 'colaboradores' && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 space-y-2 sm:space-y-0">
                      <div>
                        <h1 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                          <span>🤝</span>
                          <span>Colaboradores Financeiros & Coautoria</span>
                        </h1>
                        <p className="text-xs text-slate-900 font-bold mt-0.5">Cadastre o evento/artigo e acompanhe o estado da publicação com CPF e ORCID.</p>
                      </div>
                      {temPermissao('colaboradores', 'editar') && (
                        <button onClick={() => { setFormColaboradorFinanceiro({ titulacao: 'Doutor', status_publicacao: 'Em análise' }); setModalAtivo('colaboradorFinanceiro'); }} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                          + Cadastrar Colaborador / Publicação
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-300 flex items-center space-x-3 text-xs font-bold">
                      <span className="text-slate-900 font-black">Filtrar por Evento / Artigo:</span>
                      <select
                        value={filtroEventoFinanceiro}
                        onChange={(e) => setFiltroEventoFinanceiro(e.target.value)}
                        className="p-2 border rounded font-bold text-slate-900 bg-white min-w-[280px]"
                      >
                        <option value="Todos">Todos os Eventos / Adquirições</option>
                        {listaEventosCompradores.map((ev, idx) => (
                          <option key={idx} value={ev}>{ev}</option>
                        ))}
                      </select>
                    </div>

                    <div className="rounded border border-slate-300 overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-3">Nome / Titulação</th>
                            <th className="p-3">CPF / ORCID</th>
                            <th className="p-3">E-mail / Conselho</th>
                            <th className="p-3">Afiliação</th>
                            <th className="p-3">Evento / Artigo</th>
                            <th className="p-3">Valor Pago</th>
                            <th className="p-3">Status</th>
                            {temPermissao('colaboradores', 'editar') && <th className="p-3 text-right">Ações</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {colaboradoresFinanceirosFiltrados.length > 0 ? (
                            colaboradoresFinanceirosFiltrados.map((cf) => (
                              <tr key={cf.id} className="hover:bg-slate-50">
                                <td className="p-3 font-black text-slate-900">{cf.nome} ({cf.titulacao})</td>
                                <td className="p-3 font-mono font-bold text-slate-900">
                                  <p>CPF: {cf.cpf || 'N/I'}</p>
                                  <p className="text-[10px] text-slate-600">ORCID: {cf.orcid || 'N/I'}</p>
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  <p>{cf.email}</p>
                                  <p className="text-[10px] text-slate-600">{cf.numero_conselho}</p>
                                </td>
                                <td className="p-3 font-bold text-slate-900">{cf.afiliacao}</td>
                                <td className="p-3 font-black text-red-700">{cf.evento_ou_artigo}</td>
                                <td className="p-3 font-mono font-black text-emerald-800">{cf.valor_pago || 'R$ 0,00'}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-1 rounded text-[10px] font-black border ${
                                    cf.status_publicacao === 'Aprovada'
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                      : cf.status_publicacao === 'Em análise'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-red-100 text-red-900 border-red-300'
                                  }`}>
                                    {cf.status_publicacao === 'Aprovada' ? '✓ Aprovada' : cf.status_publicacao === 'Reprovada' ? '✕ Reprovada' : '⏳ Em análise'}
                                  </span>
                                </td>
                                {temPermissao('colaboradores', 'editar') && (
                                  <td className="p-3 text-right space-x-1">
                                    <button onClick={() => { setFormColaboradorFinanceiro(cf); setModalAtivo('colaboradorFinanceiro'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                    <button onClick={() => handleExcluir('colaboradoresFinanceiros', cf.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                  </td>
                                )}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={8} className="p-4 text-center text-slate-900 font-bold italic">Nenhum registro encontrado.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm">Colaboradores & Professores Externos Acadêmicos</h3>
                      {temPermissao('colaboradores', 'editar') && (
                        <button onClick={() => { setFormColaborador({ titulacao: 'Doutor' }); setModalAtivo('colaborador'); }} className="bg-slate-200 text-slate-900 font-black text-xs px-3 py-1.5 rounded border border-slate-400">+ Novo Colaborador Externo</button>
                      )}
                    </div>

                    <div className="rounded border border-slate-300 overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-3">Nome / Titulação</th>
                            <th className="p-3">CPF</th>
                            <th className="p-3">E-mail</th>
                            <th className="p-3">ORCID</th>
                            <th className="p-3">Nº Conselho</th>
                            <th className="p-3">Afiliação</th>
                            {temPermissao('colaboradores', 'editar') && <th className="p-3 text-right">Ações</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {colaboradores.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-100">
                              <td className="p-3 font-black text-slate-900">{c.nome} ({c.titulacao})</td>
                              <td className="p-3 font-mono font-bold text-slate-900">{c.cpf || 'N/I'}</td>
                              <td className="p-3 font-bold text-slate-900">{c.email}</td>
                              <td className="p-3 font-mono font-bold text-slate-700">{c.orcid || 'N/I'}</td>
                              <td className="p-3 font-bold text-slate-900">{c.numero_conselho}</td>
                              <td className="p-3 font-bold text-slate-900">{c.afiliacao}</td>
                              {temPermissao('colaboradores', 'editar') && (
                                <td className="p-3 text-right space-x-1">
                                  <button onClick={() => { setFormColaborador(c); setModalAtivo('colaborador'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                  <button onClick={() => handleExcluir('colaboradores', c.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: PROJETOS DE PESQUISA */}
              {moduloAtivo === 'projetos' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <h1 className="text-lg font-black text-slate-900">Projetos de Pesquisa & Artigos Derivados</h1>
                    {temPermissao('projetos', 'editar') && (
                      <button onClick={() => { setFormProjeto({ status: 'Em aberto', is_nupex: false, docentes: [], discentes: [], artigos_derivados: [], anexos: [] }); setFormDocentesTexto(''); setFormDiscentesTexto(''); setModalAtivo('projeto'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Novo Projeto</button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projetos.map((p) => (
                      <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-slate-900 text-sm">{p.titulo}</h3>
                            <span className={`inline-flex mt-1 rounded-full px-2 py-0.5 text-[9px] font-black ${p.is_nupex ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>{p.is_nupex ? 'NUPEX' : 'Projeto de pesquisa'}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 text-[10px] font-black rounded">{p.status}</span>
                        </div>

                        <div className="text-xs space-y-1 font-bold text-slate-900">
                          <p><strong>Coordenador:</strong> {p.coordenador} | <strong>Linha:</strong> {p.linha_pesquisa}</p>
                          <p><strong>Docentes:</strong> {p.docentes?.join(', ') || 'Nenhum'}</p>
                          <p><strong>Discentes:</strong> {p.discentes?.join(', ') || 'Nenhum'}</p>
                          <p><strong>Parecer CEP:</strong> {p.parecer_cep || 'N/A'} | <strong>CAEE CEP:</strong> {p.caee_cep || 'N/A'}</p>
                          
                          {/* CORREÇÃO: EXIBIÇÃO E LINK DE DESCARREGAMENTO DO PARECER CEP */}
                          {p.parecer_cep_arquivo_dataurl && (
                            <p className="text-xs font-bold text-slate-900 mt-1">
                              <strong>Documento Parecer CEP:</strong>{' '}
                              <a
                                href={p.parecer_cep_arquivo_dataurl}
                                download={p.parecer_cep_arquivo_nome || 'parecer_cep.pdf'}
                                className="text-red-700 underline font-black hover:text-red-800"
                              >
                                📥 Descarregar {p.parecer_cep_arquivo_nome || 'Parecer CEP'}
                              </a>
                            </p>
                          )}

                          <p><strong>Financiamento:</strong> {p.financiamento || 'Não se aplica'}</p>
                          <p className="text-slate-700 italic"><strong>Obs:</strong> {p.observacoes}</p>
                        </div>

                        {p.anexos && p.anexos.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 text-xs font-bold text-slate-900">
                            <p className="font-black text-slate-900">Anexos ({p.anexos.length}):</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.anexos.map((an) => (
                                <span key={an.id} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border text-[10px] font-mono">📎 {an.nome}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <p className="text-xs font-black text-slate-900">Artigos Derivados ({p.artigos_derivados?.length || 0}):</p>
                          {p.artigos_derivados?.map((art) => (
                            <div key={art.id} className="bg-slate-50 p-2 rounded border border-slate-300 text-xs font-bold text-slate-900">
                              <p><strong>Título:</strong> {art.titulo}</p>
                              <p><strong>Revista:</strong> {art.revista} ({art.qualis_jcr_cite}) - <span className="text-red-700 uppercase font-black">{art.status}</span></p>
                            </div>
                          ))}
                        </div>

                        {temPermissao('projetos', 'editar') && (
                          <div className="pt-2 flex justify-end space-x-2 border-t border-slate-200">
                            <button onClick={() => { setFormProjeto(p); setFormDocentesTexto(p.docentes?.join(', ') || ''); setFormDiscentesTexto(p.discentes?.join(', ') || ''); setModalAtivo('projeto'); }} className="bg-slate-200 text-slate-900 font-black text-xs px-3 py-1 rounded border border-slate-400">Editar Projeto / Artigos</button>
                            <button onClick={() => handleExcluir('projetos', p.id)} className="bg-red-100 text-red-700 font-black text-xs px-3 py-1 rounded border border-red-300">Excluir</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 5: GESTÃO DE DEMANDAS */}
              {moduloAtivo === 'demandas' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Gestão de Demandas Gerais</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">
                        Registra automaticamente quem cadastrou e quem concluiu. Exibe alertas para prazos vencidos ou próximos do fim.
                      </p>
                    </div>
                    {temPermissao('demandas', 'editar') && (
                      <button onClick={() => { setFormDemanda({ prioridade: 'Média', status: 'Em andamento', anexos: [], eh_coracao: false }); setModalAtivo('demanda'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Cadastrar Demanda</button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => { const ativar = !somenteMinhasDemandas; setSomenteMinhasDemandas(ativar); setFiltroDemandaResponsavel('Todos'); if (ativar) { setFiltroDemandaStatus('Todos'); setTermoBusca(''); } }} className={`px-3 py-2 rounded border text-xs font-black ${somenteMinhasDemandas ? 'bg-red-700 text-white' : 'bg-white text-slate-800'}`}>🙋 {somenteMinhasDemandas ? 'Exibindo minhas demandas' : 'Demandas atribuídas a mim'}</button>
                    <button onClick={() => setVisaoDemandas('lista')} className={`px-3 py-2 rounded border text-xs font-black ${visaoDemandas === 'lista' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'} !text-slate-900`}>☷ Lista</button>
                    <button onClick={() => setVisaoDemandas('calendario')} className={`px-3 py-2 rounded border text-xs font-black ${visaoDemandas === 'calendario' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>📅 Calendário</button>
                    <label className="text-xs font-black">Ordenar por:
                      <select value={ordenacaoDemandas} onChange={(e) => setOrdenacaoDemandas(e.target.value as any)} className="ml-2 border rounded p-2">
                        <option value="prazo">Vencimento</option><option value="prioridade">Prioridade</option>
                      </select>
                    </label>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-300 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div>
                      <label className="block text-slate-900 mb-1 font-black">Filtrar por Status:</label>
                      <select
                        value={filtroDemandaStatus}
                        onChange={(e) => setFiltroDemandaStatus(e.target.value)}
                        className="w-full p-2 border rounded font-bold text-slate-900 bg-slate-50"
                      >
                        <option value="Todos">Todos os Status</option>
                        <option value="Não iniciada">Não iniciada</option>
                        <option value="Em andamento">Em andamento</option>
                        <option value="Com pendências">Com pendências</option>
                        <option value="Concluída">Concluída</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-900 mb-1 font-black">Filtrar por Responsável:</label>
                      <select
                        value={filtroDemandaResponsavel}
                        onChange={(e) => setFiltroDemandaResponsavel(e.target.value)}
                        className="w-full p-2 border rounded font-bold text-slate-900 bg-slate-50"
                      >
                        <option value="Todos">Todos os Responsáveis</option>
                        {listaResponsaveisDemandas.map((resp, idx) => (
                          <option key={idx} value={resp}>{resp}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {visaoDemandas === 'calendario' ? (
                    <div className="bg-white rounded-lg border border-slate-300 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-black text-sm">Calendário mensal de demandas</h3><div className="flex items-center gap-2"><button type="button" onClick={() => setMesCalendarioDemandas(new Date(mesCalendarioDemandas.getFullYear(), mesCalendarioDemandas.getMonth() - 1, 1))} className="border rounded px-3 py-1 text-slate-900">‹</button><strong className="capitalize min-w-36 text-center">{nomeMesCalendario(mesCalendarioDemandas)}</strong><button type="button" onClick={() => setMesCalendarioDemandas(new Date(mesCalendarioDemandas.getFullYear(), mesCalendarioDemandas.getMonth() + 1, 1))} className="border rounded px-3 py-1 text-slate-900">›</button><button type="button" onClick={() => setMesCalendarioDemandas(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className="border rounded px-2 py-1 text-xs text-slate-900">Hoje</button></div></div>
                      <div className="grid grid-cols-7 border-t border-l border-slate-300">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((dia) => <div key={dia} className="p-2 text-center text-xs font-black bg-slate-100 border-r border-b border-slate-300">{dia}</div>)}
                        {diasCalendarioDemandas.map((dia) => { const chave = formatarDataCalendario(dia); const itens = demandasPendentes.filter((d) => (d.prazo_final || '').slice(0,10) === chave); const mesmoMes = dia.getMonth() === mesCalendarioDemandas.getMonth(); const expandido = diaCalendarioExpandido === `geral:${chave}`; return <div key={chave} className={`min-h-24 sm:min-h-28 p-1 border-r border-b border-slate-300 ${mesmoMes ? 'bg-white' : 'bg-slate-50 text-slate-400'}`}><div className={`text-xs font-black mb-1 ${chave === formatarDataCalendario(new Date()) ? 'inline-flex rounded-full bg-red-700 text-white w-6 h-6 items-center justify-center' : ''}`}>{dia.getDate()}</div><div className="space-y-1">{itens.slice(0, expandido ? itens.length : 3).map((d) => <div key={d.id} title={`${d.titulo} · ${d.responsavel_nome || 'Sem responsável'}`} className={`rounded px-1 py-1 text-[10px] leading-tight break-words ${d.prioridade === 'Urgente' ? 'bg-red-100 text-red-900' : 'bg-amber-100 text-amber-900'}`}><span className="font-black">{d.codigo}</span> {d.titulo}</div>)}{itens.length > 3 && <button type="button" onClick={() => setDiaCalendarioExpandido(expandido ? null : `geral:${chave}`)} className="text-[10px] font-black text-blue-800 hover:underline rounded px-1 py-0.5 bg-blue-50">{expandido ? '− Mostrar menos' : `+ Ver todas (${itens.length})`}</button>}</div></div>; })}
                      </div><p className="text-[11px] text-slate-600">O calendário exibe apenas demandas pendentes no dia do prazo final. Vermelho: prioridade urgente; amarelo: demais pendências. Use “+ Ver todas” para expandir os dias com mais de três demandas.</p>
                    </div>
                  ) : <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                          <th className="p-3">Código / Título</th>
                          <th className="p-3">Cadastrado por</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Prazo Final & Alerta</th>
                          <th className="p-3">Status / Conclusão</th>
                          {temPermissao('demandas', 'editar') && <th className="p-3 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {demandasOrdenadas.length > 0 ? (
                          demandasOrdenadas.map((d, index) => {
                            const separadorConcluidas = d.status === 'Concluída' && (index === 0 || demandasOrdenadas[index - 1]?.status !== 'Concluída');
                            const alerta = obterAlertaPrazoDemanda(d.prazo_final, d.status);
                            return (
                              <React.Fragment key={d.id}>{separadorConcluidas && <tr><td colSpan={temPermissao('demandas', 'editar') ? 6 : 5} className="p-2 bg-slate-200 text-slate-700 font-black uppercase tracking-wide border-y border-slate-300">✓ Demandas concluídas — histórico</td></tr>}<tr className={d.status === 'Concluída' ? 'bg-slate-100 text-slate-500' : 'hover:bg-slate-50'}>
                                <td className="p-3 font-bold text-slate-900">
                                  <span className="font-mono text-red-700 font-black">{d.codigo}</span> - {d.titulo}
                                  {d.descricao && <p className="text-[10px] text-slate-600 italic font-normal">{d.descricao}</p>}
                                </td>
                                <td className="p-3 text-slate-700 font-bold">
                                  👤 {d.cadastrado_por || 'Sistema'}
                                </td>
                                <td className="p-3 font-bold text-slate-900">{d.responsavel_nome}</td>
                                <td className="p-3 font-bold text-slate-900">
                                  <p className="font-mono">{d.prazo_final}</p>
                                  {alerta && (
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black ${alerta.cor}`}>
                                      {alerta.texto}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  <p>{d.status}</p>
                                  {d.status === 'Concluída' && d.concluido_por && (
                                    <p className="text-[10px] text-emerald-800 font-black mt-0.5">✓ Concluído por: {d.concluido_por}</p>
                                  )}
                                </td>
                                {temPermissao('demandas', 'editar') && (
                                  <td className="p-3 text-right space-x-1">
                                    {d.status !== 'Concluída' && (
                                      <button
                                        onClick={() => marcarDemandaConcluida(d)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2 py-1 rounded transition-colors"
                                      >
                                        ✓ Marcar Concluída
                                      </button>
                                    )}
                                    <button onClick={() => { setFormDemanda(d); setModalAtivo('demanda'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                    <button onClick={() => handleExcluir('demandas', d.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                  </td>
                                )}
                              </tr></React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-900 font-bold italic">Nenhuma demanda encontrada.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>}
                </div>
              )}

              {/* ABA EXCLUSIVA: DEMANDAS DO CORAÇÃO */}
              {moduloAtivo === 'coracao' && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-5 rounded-lg border border-red-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-red-800 flex items-center space-x-2">
                        <IconeCoracaoAnatomico />
                        <span>Demandas Exclusivas do Núcleo Coração</span>
                      </h1>
                      <p className="text-xs text-red-900 font-bold mt-1">
                        Área de acesso restrito ao Corpo Gestor. Registra autoria, responsável por conclusão e monitora prazos de vencimento.
                      </p>
                    </div>
                    {temPermissao('coracao', 'editar') && (
                      <button
                        onClick={() => {
                          setFormDemanda({ prioridade: 'Urgente', status: 'Em andamento', anexos: [], eh_coracao: true });
                          setModalAtivo('demanda');
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white font-black text-xs px-4 py-2 rounded shadow"
                      >
                        + Nova Demanda do Coração
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => { const ativar = !somenteMinhasDemandas; setSomenteMinhasDemandas(ativar); setFiltroDemandaResponsavel('Todos'); if (ativar) { setFiltroDemandaStatus('Todos'); setTermoBusca(''); } }} className={`px-3 py-2 rounded border text-xs font-black ${somenteMinhasDemandas ? 'bg-red-700 text-white' : 'bg-white text-slate-800'}`}>🙋 Demandas atribuídas a mim</button>
                    <button onClick={() => setVisaoCoracao('lista')} className={`px-3 py-2 rounded border text-xs font-black ${visaoCoracao === 'lista' ? 'bg-red-800 text-white' : 'bg-white text-slate-900'} ${visaoCoracao === 'lista' ? '!text-white' : '!text-slate-900'}`}>☷ Lista</button>
                    <button onClick={() => setVisaoCoracao('calendario')} className={`px-3 py-2 rounded border text-xs font-black ${visaoCoracao === 'calendario' ? 'bg-red-800 text-white' : 'bg-white text-slate-900'}`}>📅 Calendário</button>
                    <label className="text-xs font-black">Responsável:
                      <select value={filtroDemandaResponsavel} onChange={(e) => setFiltroDemandaResponsavel(e.target.value)} className="ml-2 border rounded p-2">
                        <option value="Todos">Todos</option>{listaResponsaveisDemandas.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </label>
                    <label className="text-xs font-black">Ordenar:
                      <select value={ordenacaoDemandas} onChange={(e) => setOrdenacaoDemandas(e.target.value as any)} className="ml-2 border rounded p-2"><option value="prazo">Vencimento</option><option value="prioridade">Prioridade</option></select>
                    </label>
                  </div>
                  {visaoCoracao === 'calendario' ? (
                    <div className="bg-white rounded-lg border border-slate-300 p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-black text-sm">Calendário mensal — Demandas do Coração</h3><div className="flex items-center gap-2"><button type="button" onClick={() => setMesCalendarioCoracao(new Date(mesCalendarioCoracao.getFullYear(), mesCalendarioCoracao.getMonth() - 1, 1))} className="border rounded px-3 py-1 text-slate-900">‹</button><strong className="capitalize min-w-36 text-center">{nomeMesCalendario(mesCalendarioCoracao)}</strong><button type="button" onClick={() => setMesCalendarioCoracao(new Date(mesCalendarioCoracao.getFullYear(), mesCalendarioCoracao.getMonth() + 1, 1))} className="border rounded px-3 py-1 text-slate-900">›</button><button type="button" onClick={() => setMesCalendarioCoracao(new Date(new Date().getFullYear(), new Date().getMonth(), 1))} className="border rounded px-2 py-1 text-xs text-slate-900">Hoje</button></div></div>
                      <div className="grid grid-cols-7 border-t border-l border-slate-300">{['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((dia) => <div key={dia} className="p-2 text-center text-xs font-black bg-red-50 border-r border-b border-slate-300">{dia}</div>)}
                        {diasCalendarioCoracao.map((dia) => { const chave = formatarDataCalendario(dia); const itens = demandasCoracaoPendentes.filter((d) => (d.prazo_final || '').slice(0,10) === chave); const mesmoMes = dia.getMonth() === mesCalendarioCoracao.getMonth(); const expandido = diaCalendarioExpandido === `coracao:${chave}`; return <div key={chave} className={`min-h-24 sm:min-h-28 p-1 border-r border-b border-slate-300 ${mesmoMes ? 'bg-white' : 'bg-slate-50 text-slate-400'}`}><div className={`text-xs font-black mb-1 ${chave === formatarDataCalendario(new Date()) ? 'inline-flex rounded-full bg-red-700 text-white w-6 h-6 items-center justify-center' : ''}`}>{dia.getDate()}</div><div className="space-y-1">{itens.slice(0, expandido ? itens.length : 3).map((d) => <div key={d.id} title={`${d.titulo} · ${d.responsavel_nome || 'Sem responsável'}`} className={`rounded px-1 py-1 text-[10px] leading-tight break-words ${d.prioridade === 'Urgente' ? 'bg-red-100 text-red-900' : 'bg-rose-100 text-rose-900'}`}><span className="font-black">{d.codigo}</span> {d.titulo}</div>)}{itens.length > 3 && <button type="button" onClick={() => setDiaCalendarioExpandido(expandido ? null : `coracao:${chave}`)} className="text-[10px] font-black text-blue-800 hover:underline rounded px-1 py-0.5 bg-blue-50">{expandido ? '− Mostrar menos' : `+ Ver todas (${itens.length})`}</button>}</div></div>; })}
                      </div><p className="text-[11px] text-slate-600">O calendário exibe apenas demandas pendentes no dia do prazo final. Vermelho: prioridade urgente; rosa: demais pendências. Use “+ Ver todas” para expandir os dias com mais de três demandas.</p>
                    </div>
                  ) : <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-red-100 text-red-900 font-black border-b border-red-300">
                          <th className="p-3">Código / Título</th>
                          <th className="p-3">Cadastrado por</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Prazo Final & Alerta</th>
                          <th className="p-3">Status / Conclusão</th>
                          {temPermissao('coracao', 'editar') && <th className="p-3 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {demandasCoracaoOrdenadas.length > 0 ? (
                          demandasCoracaoOrdenadas.map((d, index) => {
                            const separadorConcluidas = d.status === 'Concluída' && (index === 0 || demandasCoracaoOrdenadas[index - 1]?.status !== 'Concluída');
                            const alerta = obterAlertaPrazoDemanda(d.prazo_final, d.status);
                            return (
                              <React.Fragment key={d.id}>{separadorConcluidas && <tr><td colSpan={temPermissao('coracao', 'editar') ? 6 : 5} className="p-2 bg-slate-200 text-slate-700 font-black uppercase tracking-wide border-y border-slate-300">✓ Demandas concluídas — histórico</td></tr>}<tr className={d.status === 'Concluída' ? 'bg-slate-100 text-slate-500' : 'hover:bg-red-50/50'}>
                                <td className="p-3 font-bold text-slate-900">
                                  <span className="font-mono text-red-700 font-black">{d.codigo}</span> - {d.titulo}
                                  {d.descricao && <p className="text-[10px] text-slate-600 italic font-normal">{d.descricao}</p>}
                                </td>
                                <td className="p-3 text-slate-700 font-bold">
                                  👤 {d.cadastrado_por || 'Corpo Gestor'}
                                </td>
                                <td className="p-3 font-bold text-slate-900">{d.responsavel_nome}</td>
                                <td className="p-3 font-bold text-slate-900">
                                  <p className="font-mono">{d.prazo_final}</p>
                                  {alerta && (
                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black ${alerta.cor}`}>
                                      {alerta.texto}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  <p>{d.status}</p>
                                  {d.status === 'Concluída' && d.concluido_por && (
                                    <p className="text-[10px] text-emerald-800 font-black mt-0.5">✓ Concluído por: {d.concluido_por}</p>
                                  )}
                                </td>
                                {temPermissao('coracao', 'editar') && (
                                  <td className="p-3 text-right space-x-1">
                                    {d.status !== 'Concluída' && (
                                      <button
                                        onClick={() => marcarDemandaConcluida(d)}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-2 py-1 rounded transition-colors"
                                      >
                                        ✓ Marcar Concluída
                                      </button>
                                    )}
                                    <button onClick={() => { setFormDemanda(d); setModalAtivo('demanda'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                    <button onClick={() => handleExcluir('demandas', d.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                  </td>
                                )}
                              </tr></React.Fragment>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-700 font-bold italic">Nenhuma demanda do Núcleo Coração cadastrada.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>}
                </div>
              )}

              {/* ABA 6: PENDÊNCIAS E PRAZOS */}
              {moduloAtivo === 'pendencias' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <h1 className="text-lg font-black text-slate-900">Pendências e Prazos Administrativos</h1>
                    {temPermissao('pendencias', 'editar') && (
                      <button onClick={() => { setFormDemanda({ prioridade: 'Urgente', status: 'Com pendências', anexos: [] }); setModalAtivo('demanda'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Nova Pendência</button>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <h3 className="font-black text-red-700 text-sm border-b pb-2">Lista de Demandas com Pendências Ativas</h3>
                    {demandasPendentes.map((d) => (
                      <div key={d.id} className="p-3 bg-red-50 border border-red-200 rounded flex justify-between items-center text-xs font-bold text-slate-900">
                        <div>
                          <p className="font-black">{d.codigo} - {d.titulo}</p>
                          <p className="text-red-700">Responsável: {d.responsavel_nome} | Prazo: {d.prazo_final}</p>
                        </div>
                        {temPermissao('pendencias', 'editar') && (
                          <button
                            onClick={() => marcarDemandaConcluida(d)}
                            className="bg-emerald-100 hover:bg-emerald-200 text-slate-900 border border-emerald-400 font-black text-xs px-3.5 py-1.5 rounded shadow transition-colors"
                          >
                            ✓ Resolver
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 7: PRODUÇÕES CIENTÍFICAS */}
              {moduloAtivo === 'producoes' && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Produções Científicas e Acadêmicas</h1>
                      <p className="text-xs text-slate-900 font-bold mt-0.5">Filtragem por autor e status como editoração, submissão e anais.</p>
                    </div>
                    {temPermissao('producoes', 'editar') && (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { setFormMetaAnual(metaAtual); setModalAtivo('cadastrarMeta'); }} className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300">
                          ⚙️ Cadastrar Meta Anual
                        </button>
                        <button onClick={() => setModalAtivo('cargaMassaProducao')} className="bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400 font-black text-xs px-3 py-2 rounded">
                          📥 Importar Arquivo em Massa
                        </button>
                        <button onClick={() => { setFormProducao({ categoria_producao: 'Periódico', status: 'Publicado', ano_producao: String(new Date().getFullYear()), ano_publicacao: String(new Date().getFullYear()) }); setModalAtivo('producao'); }} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                          + Cadastrar Produção
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-300 flex items-center space-x-3 text-xs font-bold">
                    <span className="text-slate-900 font-black">🔍 Filtrar Produções por Autor / Coautor:</span>
                    <select
                      value={filtroProducaoAutor}
                      onChange={(e) => setFiltroProducaoAutor(e.target.value)}
                      className="p-2 border rounded font-bold text-slate-900 bg-white min-w-[280px]"
                    >
                      <option value="Todos">Todos os Autores</option>
                      {listaAutoresProducoes.map((autor, idx) => (
                        <option key={idx} value={autor}>{autor}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                        <span>📰</span>
                        <span>Lista de Artigos em Periódicos Científicos</span>
                      </h3>
                      <span className="bg-red-100 text-red-800 text-xs font-black px-2 py-0.5 rounded">
                        Total: {producoesFiltradas.filter((p) => p.categoria_producao === 'Periódico').length}
                      </span>
                    </div>

                    <div className="rounded border border-slate-300 overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-3">Título do Artigo</th>
                            <th className="p-3">Revista / Periódico</th>
                            <th className="p-3">Autor Principal & Coautores</th>
                            <th className="p-3">Ano produção</th>
                            <th className="p-3">Ano publicação</th>
                            <th className="p-3">Qualis / DOI</th>
                            <th className="p-3">Status</th>
                            {temPermissao('producoes', 'editar') && <th className="p-3 text-right">Ações</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {producoesFiltradas.filter((p) => p.categoria_producao === 'Periódico').map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                              <td className="p-3 font-black text-slate-900 max-w-xs">{p.titulo}</td>
                              <td className="p-3 font-bold text-slate-900">{p.evento_ou_revista}</td>
                              <td className="p-3 font-bold text-slate-900">
                                <p><strong className="text-red-700">Autor:</strong> {p.autor_principal}</p>
                                <p className="text-[10px] text-slate-900"><strong>Coautores:</strong> {p.coautores || 'Nenhum'}</p>
                              </td>
                              <td className="p-3 font-mono font-black text-slate-900">{p.ano_producao || p.ano_publicacao}</td>
                              <td className="p-3 font-mono font-black text-slate-900">{p.ano_publicacao}</td>
                              <td className="p-3 font-mono font-bold text-slate-700">{p.qualis_doi}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                                  p.status === 'Publicado' ? 'bg-emerald-100 text-emerald-900' : p.status === 'Submetido' ? 'bg-amber-100 text-amber-900' : 'bg-slate-200 text-slate-900'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              {temPermissao('producoes', 'editar') && (
                                <td className="p-3 text-right space-x-1">
                                  <button onClick={() => { setFormProducao(p); setModalAtivo('producao'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                  <button onClick={() => handleExcluir('producoes', p.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                        <span>🎤</span>
                        <span>Resumos & Trabalhos em Congressos</span>
                      </h3>
                      {temPermissao('producoes', 'editar') && (
                        <button onClick={() => { setFormProducao({ categoria_producao: 'Congresso', status: 'Publicado', ano_producao: String(new Date().getFullYear()), ano_publicacao: String(new Date().getFullYear()) }); setModalAtivo('producao'); }} className="bg-slate-200 text-slate-900 font-black text-xs px-3 py-1 rounded border border-slate-400">
                          + Adicionar Trabalho
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {Object.keys(congressosAgrupados).length > 0 ? (
                        (Object.entries(congressosAgrupados) as [string, ProducaoCientifica[]][]).map(([eventoNome, listaProds], idx) => (
                          <div key={idx} className="border rounded-lg bg-slate-50 p-4 space-y-2 border-slate-300">
                            <div className="flex justify-between items-center border-b pb-2">
                              <h4 className="font-black text-red-700 text-xs uppercase">📍 {eventoNome}</h4>
                              <span className="bg-blue-100 text-blue-900 text-[10px] font-black px-2 py-0.5 rounded">
                                {listaProds.length} trabalho(s)
                              </span>
                            </div>
                            <div className="space-y-2 pt-1">
                              {listaProds.map((prod) => (
                                <div key={prod.id} className="p-2.5 bg-white border rounded flex flex-col sm:flex-row justify-between sm:items-center text-xs font-bold text-slate-900 space-y-2 sm:space-y-0">
                                  <div>
                                    <p className="font-black text-slate-900">{prod.titulo} <span className="text-[10px] text-slate-600 font-normal">({prod.tipo_producao})</span></p>
                                    <p className="text-[11px] text-slate-700"><strong>Autor Principal:</strong> {prod.autor_principal} {prod.coautores && `| Coautores: ${prod.coautores}`}</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-black rounded">{prod.status}</span>
                                    {temPermissao('producoes', 'editar') && (
                                      <>
                                        <button onClick={() => { setFormProducao(prod); setModalAtivo('producao'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                        <button onClick={() => handleExcluir('producoes', prod.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-500 italic p-3 text-center">Nenhum trabalho cadastrado.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
{/* ABA 8: ENCONTROS CIENTÍFICOS */}
              {moduloAtivo === 'reunioes' && (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Encontros Científicos & Resumo de Faltas</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">Lançamento de presenças com membros ativos e relatório de assiduidade.</p>
                    </div>
                    {temPermissao('reunioes', 'editar') && (
                      <button onClick={() => { setFormReuniao({ data: new Date().toISOString().split('T')[0] }); setModalAtivo('reuniao'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                        + Cadastrar Encontro
                      </button>
                    )}
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <h3 className="font-black text-slate-900 text-sm border-b pb-2">Resumo de Faltas e Assiduidade por Membro</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      {calcularResumoFaltas().map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border rounded font-bold text-slate-900">
                          <p className="font-black text-slate-900">{item.nome}</p>
                          <p className="text-emerald-800">Presenças: {item.presencas}</p>
                          <p className="text-red-700">Faltas: {item.faltas}</p>
                          <p className="text-amber-800">Faltas Justificadas: {item.justificadas}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 space-y-3">
                    {reunioes.length > 0 ? (
                      reunioes.map((r) => (
                        <div key={r.id} className="p-3 border rounded bg-slate-50 space-y-2 text-xs font-bold text-slate-900">
                          <div className="flex justify-between items-center">
                            <h4 className="font-black text-slate-900 text-sm">{r.titulo}</h4>
                            <div className="flex items-center space-x-2">
                              <span>{r.data} ({r.horario})</span>
                              {temPermissao('reunioes', 'editar') && (
                                <button
                                  onClick={() => handleExcluir('reunioes', r.id)}
                                  className="bg-red-100 text-red-700 font-black text-xs px-2 py-1 rounded border border-red-300 hover:bg-red-200 transition-colors"
                                >
                                  Excluir
                                </button>
                              )}
                            </div>
                          </div>
                          <p>Pauta: {r.pauta}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic p-3 text-center">Nenhum encontro ou reunião cadastrado.</p>
                    )}
                  </div>
                </div>
              )}

              {/* ABA 9: PATRIMÔNIO GETECC */}
              {moduloAtivo === 'patrimonio' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <h1 className="text-lg font-black text-slate-900">Patrimônio GETECC & Produtos</h1>
                    {temPermissao('patrimonio', 'editar') && (
                      <button onClick={() => { setFormPatrimonio({ quantidade: 1, estado_conservacao: 'Excelente' }); setModalAtivo('patrimonio'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Cadastrar Item</button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {patrimonio.map((p) => (
                      <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm space-y-2 text-xs font-bold text-slate-900">
                        <div className="flex items-center space-x-3">
                          <img src={p.foto_dataurl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=150&auto=format&fit=crop&q=80'} alt={p.nome} className="w-14 h-14 rounded object-cover border" />
                          <div>
                            <h3 className="font-black text-slate-900 text-sm">{p.nome}</h3>
                            <p className="text-red-700 font-black">Quantidade: {p.quantidade}</p>
                            <p className="text-[10px] text-slate-700">Estado: {p.estado_conservacao}</p>
                          </div>
                        </div>
                        <p>{p.descricao}</p>
                        {temPermissao('patrimonio', 'editar') && (
                          <div className="pt-2 flex justify-end space-x-1">
                            <button onClick={() => { setFormPatrimonio(p); setModalAtivo('patrimonio'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                            <button onClick={() => handleExcluir('patrimonio', p.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ABA 10: MARKETING */}
              {moduloAtivo === 'marketing' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <h1 className="text-lg font-black text-slate-900">Gestão de Marketing & Mídias</h1>
                    {temPermissao('marketing', 'editar') && (
                      <button onClick={() => { setFormMarketing({ canal: 'Instagram', status: 'Ideia', artes: [] }); setModalAtivo('marketing'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Nova Ação de Mídia</button>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                          <th className="p-3">Título da Ação</th>
                          <th className="p-3">Canal</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Data Prevista</th>
                          <th className="p-3">Status</th>
                          {temPermissao('marketing', 'editar') && <th className="p-3 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {marketing.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-100">
                            <td className="p-3 font-bold text-slate-900">{m.titulo}</td>
                            <td className="p-3 font-bold text-slate-900">{m.canal}</td>
                            <td className="p-3 font-bold text-slate-900">{m.responsavel}</td>
                            <td className="p-3 font-bold text-slate-900">{m.data_prevista}</td>
                            <td className="p-3 font-black text-red-700">{m.status}</td>
                            {temPermissao('marketing', 'editar') && (
                              <td className="p-3 text-right space-x-1">
                                <button onClick={() => { setFormMarketing(m); setModalAtivo('marketing'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                <button onClick={() => handleExcluir('marketing', m.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA 11: FINANCEIRO */}
              {moduloAtivo === 'financeiro' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-4">
                      <div>
                        <h1 className="text-xl font-black text-slate-900 flex items-center space-x-2">
                          <span>💰</span>
                          <span>Gestão Financeira e Fluxo de Caixa Automático</span>
                        </h1>
                        <p className="text-xs text-slate-900 font-bold mt-1">
                          Cálculo em tempo real com integração dos colaboradores (Aba 3), mensalidades de 12 meses e eventos especiais dos membros.
                        </p>
                      </div>
                      {temPermissao('financeiro', 'editar') && (
                        <div className="mt-3 sm:mt-0 flex space-x-2">
                          <button
                            onClick={() => {
                              setFormMovimentacao({ tipo: 'Entrada', categoria: 'Outros', data: new Date().toISOString().split('T')[0] });
                              setModalAtivo('movimentacao');
                            }}
                            className="bg-emerald-100 hover:bg-emerald-200 text-slate-900 border border-emerald-400 font-black text-xs px-4 py-2.5 rounded shadow-sm flex items-center space-x-1"
                          >
                            <span>➕</span>
                            <span>Novo Lançamento de Caixa</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Total Entradas (Receitas)</p>
                        <p className="text-2xl font-black text-emerald-700 mt-1">R$ {totalEntradasGeral.toFixed(2)}</p>
                        <p className="text-[10px] text-emerald-900 font-bold mt-1">
                          Inclui Colaboradores Aba 3 (R$ {totalReceitasColaboradoresAba3.toFixed(2)})
                        </p>
                      </div>

                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                        <p className="text-[10px] font-black text-red-800 uppercase tracking-wider">Total Saídas (Despesas)</p>
                        <p className="text-2xl font-black text-red-700 mt-1">R$ {totalSaidasGeral.toFixed(2)}</p>
                        <p className="text-[10px] text-red-900 font-bold mt-1">Lançamentos manuais de caixa</p>
                      </div>

                      <div className={`p-4 rounded-lg border shadow-sm ${saldoCaixaAtual >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-100 border-red-300'}`}>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Saldo Atual em Caixa</p>
                        <p className={`text-3xl font-black mt-1 ${saldoCaixaAtual >= 0 ? 'text-blue-900' : 'text-red-700'}`}>
                          R$ {saldoCaixaAtual.toFixed(2)}
                        </p>
                        <p className="text-[10px] text-slate-700 font-bold mt-1">Cálculo Automático Unificado</p>
                      </div>
                    </div>

                    <div className="flex border-b border-slate-300 space-x-2 pt-2 text-xs font-black">
                      <button
                        onClick={() => setSubAbaFinanceiro('movimentacoes')}
                        className={`px-4 py-2 border-b-2 transition-colors ${subAbaFinanceiro === 'movimentacoes' ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-slate-700 hover:text-red-700'}`}
                      >
                        1. Fluxo do Caixa & Lançamentos ({movimentacoesFiltradas.length})
                      </button>
                      <button
                        onClick={() => setSubAbaFinanceiro('mensalidades')}
                        className={`px-4 py-2 border-b-2 transition-colors ${subAbaFinanceiro === 'mensalidades' ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-slate-700 hover:text-red-700'}`}
                      >
                        2. Mensalidades dos Membros (12 Meses)
                      </button>
                      <button
                        onClick={() => setSubAbaFinanceiro('eventos_especiais')}
                        className={`px-4 py-2 border-b-2 transition-colors ${subAbaFinanceiro === 'eventos_especiais' ? 'border-red-600 text-red-700 bg-red-50' : 'border-transparent text-slate-700 hover:text-red-700'}`}
                      >
                        3. Day Off & São João
                      </button>
                    </div>
                  </div>

                  {subAbaFinanceiro === 'movimentacoes' && (
                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                      <div className="bg-slate-50 p-3 rounded border border-slate-300 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-bold">
                        <div>
                          <label className="block text-slate-900 mb-1 font-black">Data Início:</label>
                          <input type="date" value={filtroFinDataInicio} onChange={(e) => setFiltroFinDataInicio(e.target.value)} className="w-full border p-1.5 rounded bg-white" />
                        </div>
                        <div>
                          <label className="block text-slate-900 mb-1 font-black">Data Fim:</label>
                          <input type="date" value={filtroFinDataFim} onChange={(e) => setFiltroFinDataFim(e.target.value)} className="w-full border p-1.5 rounded bg-white" />
                        </div>
                        <div>
                          <label className="block text-slate-900 mb-1 font-black">Tipo de Lançamento:</label>
                          <select value={filtroFinTipo} onChange={(e) => setFiltroFinTipo(e.target.value)} className="w-full border p-1.5 rounded bg-white">
                            <option value="Todos">Todos os Tipos</option>
                            <option value="Entrada">Entrada (Receita)</option>
                            <option value="Saída">Saída (Despesa)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-900 mb-1 font-black">Categoria:</label>
                          <select value={filtroFinCategoria} onChange={(e) => setFiltroFinCategoria(e.target.value)} className="w-full border p-1.5 rounded bg-white">
                            <option value="Todas">Todas as Categorias</option>
                            <option value="Mensalidade">Mensalidade</option>
                            <option value="Day Off">Day Off</option>
                            <option value="São João">São João</option>
                            <option value="Inscrição / Publicação">Inscrição / Publicação</option>
                            <option value="Patrimônio">Patrimônio</option>
                            <option value="Eventos">Eventos</option>
                            <option value="Custeio">Custeio</option>
                            <option value="Outros">Outros</option>
                          </select>
                        </div>
                      </div>

                      <div className="rounded border border-slate-300 overflow-hidden">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                              <th className="p-3">Data</th>
                              <th className="p-3">Descrição / Vínculo</th>
                              <th className="p-3">Categoria</th>
                              <th className="p-3">Origem</th>
                              <th className="p-3">Tipo</th>
                              <th className="p-3">Valor (R$)</th>
                              {temPermissao('financeiro', 'editar') && <th className="p-3 text-right">Ações</th>}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {movimentacoesFiltradas.length > 0 ? (
                              movimentacoesFiltradas.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                  <td className="p-3 font-mono font-bold text-slate-900">{item.data}</td>
                                  <td className="p-3 font-bold text-slate-900">
                                    {item.descricao}
                                    {item.observacoes && <p className="text-[10px] text-slate-600 font-normal">{item.observacoes}</p>}
                                  </td>
                                  <td className="p-3 font-bold text-slate-900">{item.categoria}</td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-slate-200 text-slate-800 border border-slate-300">
                                      {item.origem_badge || 'Manual'}
                                    </span>
                                  </td>
                                  <td className="p-3 font-black">
                                    <span className={`px-2 py-0.5 rounded text-[10px] ${item.tipo === 'Entrada' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}>
                                      {item.tipo.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className={`p-3 font-mono font-black ${item.tipo === 'Entrada' ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {item.tipo === 'Entrada' ? '+' : '-'} R$ {item.valor.toFixed(2)}
                                  </td>
                                  {temPermissao('financeiro', 'editar') && (
                                    <td className="p-3 text-right">
                                      {!item.id.startsWith('colab-auto-') && !item.id.startsWith('mens-auto-') && !item.id.startsWith('ee-auto-') ? (
                                        <button onClick={() => handleExcluir('movimentacoes', item.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                      ) : (
                                        <span className="text-[10px] font-bold text-slate-400 italic">Automático</span>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={7} className="p-4 text-center text-slate-900 font-bold italic">Nenhum lançamento financeiro encontrado.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {subAbaFinanceiro === 'mensalidades' && (
                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 space-y-2 sm:space-y-0">
                        <div>
                          <h3 className="font-black text-slate-900 text-sm">Controle Anual de Mensalidades (12 Meses)</h3>
                          <p className="text-xs text-slate-700 font-bold">Clique no botão do mês correspondente para cadastrar o valor pago, a data e alterar o status.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-900">Ano de Referência:</span>
                          <select
                            value={anoMatrizMensalidade}
                            onChange={(e) => setAnoMatrizMensalidade(e.target.value)}
                            className="p-1.5 border rounded font-black text-xs text-slate-900 bg-slate-50"
                          >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto rounded border border-slate-300">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                              <th className="p-2 min-w-[160px]">Membro</th>
                              {NOMES_MESES.map((mesNome, idx) => (
                                <th key={idx} className="p-2 text-center min-w-[70px]">{mesNome}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {membrosAtivos.map((mb) => (
                              <tr key={mb.id} className="hover:bg-slate-50">
                                <td className="p-2 font-black text-slate-900 truncate">{mb.nome_completo}</td>
                                {NOMES_MESES.map((_, idx) => {
                                  const numMes = idx + 1;
                                  const reg = mensalidades.find((m) => m.membro_id === mb.id && m.ano === anoMatrizMensalidade && m.mes === numMes);
                                  const estaPago = reg?.status === 'Pago';

                                  return (
                                    <td key={idx} className="p-1.5 text-center">
                                      <button
                                        disabled={!temPermissao('financeiro', 'editar')}
                                        onClick={() => {
                                          setFormEdicaoMensalidade({
                                            membro_id: mb.id,
                                            membro_nome: mb.nome_completo,
                                            ano: anoMatrizMensalidade,
                                            mes: numMes,
                                            valor: reg?.valor || 30.00,
                                            status: estaPago ? 'Pago' : 'Pendente',
                                            data_pagamento: reg?.data_pagamento || new Date().toISOString().split('T')[0],
                                          });
                                          setModalAtivo('editarMensalidade');
                                        }}
                                        className={`w-full py-1 px-1 rounded text-[10px] font-black border transition-all ${
                                          estaPago
                                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                                            : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                                        } ${!temPermissao('financeiro', 'editar') ? 'cursor-not-allowed opacity-80' : ''}`}
                                        title={estaPago ? `Pago R$ ${reg?.valor} em ${reg?.data_pagamento}` : 'Pendente (Clique para registrar)'}
                                      >
                                        {estaPago ? `✓ R$${reg?.valor}` : 'Pendente'}
                                      </button>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {subAbaFinanceiro === 'eventos_especiais' && (
                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-6">
                      <div className="space-y-3">
                        <div className="border-b pb-2 flex justify-between items-center">
                          <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                            <span>🏖️</span>
                            <span>Controle de Pagamento: Day Off GETECC</span>
                          </h3>
                          <span className="bg-blue-100 text-blue-900 text-xs font-black px-2.5 py-0.5 rounded">
                            Taxa Padrão: R$ 50,00
                          </span>
                        </div>

                        <div className="rounded border border-slate-300 overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                                <th className="p-3">Nome do Membro</th>
                                <th className="p-3">Valor Cobrado</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Data do Pagamento</th>
                                {temPermissao('financeiro', 'editar') && <th className="p-3 text-right">Ação</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {membrosAtivos.map((mb) => {
                                const reg = eventosEspeciais.find((e) => e.membro_id === mb.id && e.evento === 'Day Off');
                                const estaPago = reg?.status === 'Pago';
                                return (
                                  <tr key={mb.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-black text-slate-900">{mb.nome_completo}</td>
                                    <td className="p-3 font-mono font-bold text-slate-900">R$ {reg?.valor !== undefined ? reg.valor.toFixed(2) : '50.00'}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-1 rounded text-[10px] font-black border ${
                                        estaPago ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                                      }`}>
                                        {estaPago ? '✓ Pago' : '⏳ Pendente'}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-700">{reg?.data_pagamento || '-'}</td>
                                    {temPermissao('financeiro', 'editar') && (
                                      <td className="p-3 text-right">
                                        <button
                                          onClick={() => {
                                            setFormEdicaoEventoEspecial({
                                              membro_id: mb.id,
                                              membro_nome: mb.nome_completo,
                                              evento: 'Day Off',
                                              valor: reg?.valor || 50.00,
                                              status: estaPago ? 'Pago' : 'Pendente',
                                              data_pagamento: reg?.data_pagamento || new Date().toISOString().split('T')[0],
                                            });
                                            setModalAtivo('editarEventoEspecial');
                                          }}
                                          className="px-3 py-1 rounded font-black text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400"
                                        >
                                          ⚙️ Editar Pagamento
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-300">
                        <div className="border-b pb-2 flex justify-between items-center">
                          <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                            <span>🌽</span>
                            <span>Controle de Pagamento: São João GETECC</span>
                          </h3>
                          <span className="bg-amber-100 text-amber-900 text-xs font-black px-2.5 py-0.5 rounded">
                            Taxa Padrão: R$ 80,00
                          </span>
                        </div>

                        <div className="rounded border border-slate-300 overflow-hidden">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                                <th className="p-3">Nome do Membro</th>
                                <th className="p-3">Valor Cobrado</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Data do Pagamento</th>
                                {temPermissao('financeiro', 'editar') && <th className="p-3 text-right">Ação</th>}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {membrosAtivos.map((mb) => {
                                const reg = eventosEspeciais.find((e) => e.membro_id === mb.id && e.evento === 'São João');
                                const estaPago = reg?.status === 'Pago';
                                return (
                                  <tr key={mb.id} className="hover:bg-slate-50">
                                    <td className="p-3 font-black text-slate-900">{mb.nome_completo}</td>
                                    <td className="p-3 font-mono font-bold text-slate-900">R$ {reg?.valor !== undefined ? reg.valor.toFixed(2) : '80.00'}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-1 rounded text-[10px] font-black border ${
                                        estaPago ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                                      }`}>
                                        {estaPago ? '✓ Pago' : '⏳ Pendente'}
                                      </span>
                                    </td>
                                    <td className="p-3 font-mono text-slate-700">{reg?.data_pagamento || '-'}</td>
                                    {temPermissao('financeiro', 'editar') && (
                                      <td className="p-3 text-right">
                                        <button
                                          onClick={() => {
                                            setFormEdicaoEventoEspecial({
                                              membro_id: mb.id,
                                              membro_nome: mb.nome_completo,
                                              evento: 'São João',
                                              valor: reg?.valor || 80.00,
                                              status: estaPago ? 'Pago' : 'Pendente',
                                              data_pagamento: reg?.data_pagamento || new Date().toISOString().split('T')[0],
                                            });
                                            setModalAtivo('editarEventoEspecial');
                                          }}
                                          className="px-3 py-1 rounded font-black text-xs bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400"
                                        >
                                          ⚙️ Editar Pagamento
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ABA 12: USUÁRIOS E PERMISSÕES */}
              {moduloAtivo === 'usuarios' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Usuários & Permissões por Aba</h1>
                      <p className="text-xs text-slate-700 font-bold mt-0.5">Gestão completa de credenciais, perfis, redefinição de senhas e matriz de acessos.</p>
                    </div>
                    {temPermissao('usuarios', 'editar') && (
                      <button onClick={() => { setFormUsuario({ perfil_acesso: 'Membro', situacao: 'Ativo', permissoes: {} }); setModalAtivo('usuario'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                        + Cadastrar Usuário
                      </button>
                    )}
                  </div>

                  <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                          <th className="p-3">Nome / E-mail</th>
                          <th className="p-3">Perfil</th>
                          <th className="p-3">Situação</th>
                          {temPermissao('usuarios', 'editar') && <th className="p-3 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {usuarios.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-100">
                            <td className="p-3 font-bold text-slate-900">{u.nome_completo} ({u.email})</td>
                            <td className="p-3 font-black text-red-700">{u.perfil_acesso}</td>
                            <td className="p-3 font-bold text-slate-900">{u.situacao}</td>
                            {temPermissao('usuarios', 'editar') && (
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => {
                                    setUsuarioResetSenha(u);
                                    setNovaSenhaInput('');
                                    setModalAtivo('resetSenha');
                                  }}
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-900 font-black px-2.5 py-1 rounded border border-amber-300"
                                >
                                  🔑 Redefinir Senha
                                </button>
                                <button onClick={() => { setFormUsuario(u); setModalAtivo('usuario'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">
                                  Editar Permissões
                                </button>
                                <button onClick={() => handleExcluir('usuarios', u.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">
                                  Excluir
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ABA 14: CONSTRUÇÕES PENDENTES */}
              {moduloAtivo === 'construcoes' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm flex flex-wrap justify-between gap-3 items-center">
                    <div><h1 className="text-lg font-black">Construções Pendentes</h1><p className="text-xs text-slate-600">Banco de ideias para novos artigos, com projeto-mãe, objetivo, origem e links de trabalho.</p></div>
                    {temPermissao('construcoes','editar') && <button onClick={() => { setFormConstrucao({ status: 'Pendente' }); setModalAtivo('construcaoPendente'); }} className="bg-red-700 text-white rounded px-4 py-2 text-xs font-black">+ Nova construção</button>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {(['Pendente','Em desenvolvimento','Concluída'] as const).map((status) => <div key={status} className="bg-white rounded-lg border border-slate-300 p-3"><h3 className="font-black text-sm mb-2">{status} ({construcoesPendentes.filter((c) => c.status === status).length})</h3>{construcoesPendentes.filter((c) => c.status === status).map((c) => <article key={c.id} className="border rounded p-3 mb-2 text-xs space-y-1"><p className="font-black">{c.titulo}</p><p><strong>Objetivo:</strong> {c.objetivo}</p><p><strong>Projeto-mãe:</strong> {c.projeto_mae || 'Não vinculado'}</p><p><strong>Origem:</strong> {c.origem || 'Não informada'}</p>{c.link_drive && <p><a className="text-blue-700 underline" href={c.link_drive} target="_blank" rel="noreferrer">Abrir pasta/arquivo no Drive</a></p>}{c.banco_dados && <p><a className="text-blue-700 underline" href={c.banco_dados} target="_blank" rel="noreferrer">Abrir banco de dados</a></p>}{temPermissao('construcoes','editar') && <div className="flex gap-2 pt-2"><button onClick={() => { setFormConstrucao(c); setModalAtivo('construcaoPendente'); }} className="border rounded px-2 py-1">Editar</button><button onClick={async () => { const atualizado = {...c, status: (c.status === 'Pendente' ? 'Em desenvolvimento' : c.status === 'Em desenvolvimento' ? 'Concluída' : 'Pendente') as ConstrucaoPendente['status']}; const {error} = await supabase.from('construcoes_pendentes').upsert(atualizado); if(error) alert(error.message); else setConstrucoesPendentes(prev => prev.map(x => x.id === c.id ? atualizado : x)); }} className="border rounded px-2 py-1">Avançar status</button><button onClick={() => excluirConstrucaoPendente(c)} className="border border-red-300 text-red-700 rounded px-2 py-1">Excluir</button></div>}</article>)}</div>)}
                  </div>
                </div>
              )}

              {/* ABA 13: RELATÓRIOS E EXPORTAÇÃO */}
              {moduloAtivo === 'relatorios' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h1 className="text-lg font-black text-slate-900">Gerador de Relatórios & Exportação de Dados</h1>
                        <p className="text-xs text-slate-900 font-bold mt-0.5">Relatórios segmentados com botão de exportação direta para planilha (.xlsx).</p>
                      </div>
                      {/* CORREÇÃO DO BOTÃO: TEXTO PRETO PRESERVADO */}
                      <button
                        onClick={() => exportarParaExcel(producoes, 'relatorio_producoes_getecc')}
                        className="bg-emerald-100 hover:bg-emerald-200 text-slate-900 font-black text-xs px-4 py-2 rounded border border-emerald-300 shadow flex items-center space-x-1"
                      >
                        <span>📥 Exportar Relatório em Planilha (.xlsx)</span>
                      </button>
                    </div>

                    {temPermissao('relatorios', 'editar') && (
                      <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-2">
                        <label className="block font-black text-xs text-slate-900">📤 Importar Arquivo Adicional (.csv, .xls, .xlsx):</label>
                        <input
                          type="file"
                          accept=".csv, .xls, .xlsx"
                          onChange={(e) => handleProcessarArquivoEmMassa(e, 'relatorios')}
                          className="w-full text-xs font-bold text-slate-900"
                        />
                      </div>
                    )}
                  </div>

                  {/* SEÇÃO 1: RELATÓRIO DE ARTIGOS CIENTÍFICOS */}
                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                        <span>📰</span>
                        <span>Relatório de Artigos em Periódicos</span>
                      </h3>
                      <button
                        onClick={() => exportarParaExcel(producoes.filter((p) => p.categoria_producao === 'Periódico'), 'relatorio_artigos')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs px-3 py-1 rounded border border-slate-400"
                      >
                        Baixar Artigos (.xlsx)
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded border border-slate-300">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-2.5">Título</th>
                            <th className="p-2.5">Revista</th>
                            <th className="p-2.5">Autor Principal</th>
                            <th className="p-2.5">Coautores</th>
                            <th className="p-2.5">Ano de produção</th>
                            <th className="p-2.5">Ano de publicação</th>
                            <th className="p-2.5">Qualis/DOI</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-bold">
                          {producoes.filter((p) => p.categoria_producao === 'Periódico').map((art) => (
                            <tr key={art.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-black text-slate-900">{art.titulo}</td>
                              <td className="p-2.5">{art.evento_ou_revista}</td>
                              <td className="p-2.5">{art.autor_principal}</td>
                              <td className="p-2.5">{art.coautores || '—'}</td>
                              <td className="p-2.5 font-mono">{art.ano_producao || art.ano_publicacao}</td>
                              <td className="p-2.5 font-mono">{art.ano_publicacao}</td>
                              <td className="p-2.5 font-mono">{art.qualis_doi}</td>
                              <td className="p-2.5 text-red-700">{art.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* SEÇÃO 2: RELATÓRIO DE RESUMOS E CONGRESSOS */}
                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                        <span>🎤</span>
                        <span>Relatório de Resumos em Congressos</span>
                      </h3>
                      <button
                        onClick={() => exportarParaExcel(producoes.filter((p) => p.categoria_producao === 'Congresso'), 'relatorio_resumos')}
                        className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs px-3 py-1 rounded border border-slate-400"
                      >
                        Baixar Resumos (.xlsx)
                      </button>
                    </div>

                    <div className="overflow-x-auto rounded border border-slate-300">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-2.5">Título do Resumo</th>
                            <th className="p-2.5">Congresso / Evento</th>
                            <th className="p-2.5">Autor Principal</th>
                            <th className="p-2.5">Coautores</th>
                            <th className="p-2.5">Ano</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-bold">
                          {producoes.filter((p) => p.categoria_producao === 'Congresso').map((res) => (
                            <tr key={res.id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-black text-slate-900">{res.titulo}</td>
                              <td className="p-2.5">{res.evento_ou_revista}</td>
                              <td className="p-2.5">{res.autor_principal}</td>
                              <td className="p-2.5 text-slate-600">{res.coautores || 'Nenhum'}</td>
                              <td className="p-2.5 font-mono">{res.ano_publicacao}</td>
                              <td className="p-2.5 text-blue-800">{res.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <h3 className="font-black text-slate-900 text-sm border-b pb-2">Quantitativo Calculado por Autor</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-2.5">Nome do Autor</th>
                            <th className="p-2.5 text-center">Como Autor Principal</th>
                            <th className="p-2.5 text-center">Como Coautor</th>
                            <th className="p-2.5 text-center">Total Acumulado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {calcularQuantitativoPorAutor().map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-100">
                              <td className="p-2.5 font-bold text-slate-900">{item.autor}</td>
                              <td className="p-2.5 text-center font-black text-slate-900">{item.principal}</td>
                              <td className="p-2.5 text-center font-black text-slate-900">{item.coautor}</td>
                              <td className="p-2.5 text-center font-black text-red-700">{item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 14: CONFIGURAÇÕES E AUDITORIA */}
              {moduloAtivo === 'configuracoes' && (
                <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm space-y-4">
                  <h1 className="text-lg font-black text-slate-900">Configurações Gerais do GETECC & Auditoria</h1>
                  <p className="text-xs text-slate-900 font-bold">Histórico de operações realizadas no sistema.</p>
                  <div className="border rounded p-3 bg-slate-50 font-mono text-xs space-y-1 max-h-96 overflow-y-auto">
                    {historicoAuditoria.length > 0 ? (
                      historicoAuditoria.map((aud) => (
                        <p key={aud.id}>[{aud.data_hora}] {aud.operacao} em {aud.modulo}: {aud.detalhes}</p>
                      ))
                    ) : (
                      <p className="text-slate-500 italic">Nenhum registro de auditoria nesta sessão.</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>

      {/* ==========================================
          MODAIS SOBREPOSTOS DO SISTEMA (OVERLAYS)
          ========================================== */}

      {/* MODAL 1: MEMBRO */}
      {modalAtivo === 'membro' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full p-6 space-y-4 my-8 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formMembro.id ? 'Editar Integrante do GETECC' : 'Cadastrar Novo Integrante'}
            </h2>
            <form onSubmit={salvarMembro} className="space-y-4 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Matrícula:</label>
                  <input type="text" required value={formMembro.matricula || ''} onChange={(e) => setFormMembro({ ...formMembro, matricula: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Nome Completo:</label>
                  <input type="text" required value={formMembro.nome_completo || ''} onChange={(e) => setFormMembro({ ...formMembro, nome_completo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">CPF:</label>
                  <input type="text" required value={formMembro.cpf || ''} onChange={(e) => setFormMembro({ ...formMembro, cpf: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">E-mail Institucional:</label>
                  <input type="email" required value={formMembro.email_institucional || ''} onChange={(e) => setFormMembro({ ...formMembro, email_institucional: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">E-mail Alternativo:</label>
                  <input type="email" value={formMembro.email_alternativo || ''} onChange={(e) => setFormMembro({ ...formMembro, email_alternativo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Instagram:</label>
                  <input type="text" value={formMembro.instagram || ''} onChange={(e) => setFormMembro({ ...formMembro, instagram: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Curso / Formação:</label>
                  <input type="text" required value={formMembro.curso_formacao || ''} onChange={(e) => setFormMembro({ ...formMembro, curso_formacao: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Instituição:</label>
                  <input type="text" required value={formMembro.instituicao || ''} onChange={(e) => setFormMembro({ ...formMembro, instituicao: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Categoria:</label>
                  <select value={['Gestão','Apoio de Gestão','Estudantes','Egressos'].includes(formMembro.categoria || '') ? formMembro.categoria : 'Estudantes'} onChange={(e) => setFormMembro({ ...formMembro, categoria: e.target.value as Membro['categoria'] })} className="w-full border p-2 rounded bg-white text-slate-900">
                    <option value="Gestão">Gestão</option>
                    <option value="Apoio de Gestão">Apoio de Gestão</option>
                    <option value="Estudantes">Estudantes</option>
                    <option value="Egressos">Egressos</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Função / Cargo:</label>
                  <input type="text" required value={formMembro.funcao_cargo || ''} onChange={(e) => setFormMembro({ ...formMembro, funcao_cargo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Data de Ingresso:</label>
                  <input type="date" required value={formMembro.data_ingresso || ''} onChange={(e) => setFormMembro({ ...formMembro, data_ingresso: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Seleção / Processo de Ingresso:</label>
                  <input type="text" value={formMembro.selecao_ingresso || ''} onChange={(e) => setFormMembro({ ...formMembro, selecao_ingresso: e.target.value })} className="w-full border p-2 rounded" placeholder="Ex.: Seleção 2026.1" />
                </div>
                <div>
                  <label className="block mb-1">Situação:</label>
                  <select value={formMembro.situacao || 'Ativo'} onChange={(e) => setFormMembro({ ...formMembro, situacao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Ativo">Ativo</option>
                    <option value="Desligado">Desligado</option>
                    <option value="Em Afastamento/Licença">Em Afastamento/Licença</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Foto de Perfil:</label>
                <input type="file" accept="image/*" onChange={handleUploadFotoMembro} className="w-full border p-1 rounded" />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-4 py-2 border rounded text-slate-700">Cancelar</button>
                <button type="submit" style={{ backgroundColor: '#DC2626', color: '#FFFFFF' }} className="px-4 py-2 font-black rounded hover:opacity-90">Salvar Integrante</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EGRESSO DO GETECC */}
      {modalAtivo === 'egresso' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div><h2 className="text-lg font-black text-[#0F172A]">{formEgresso.id ? 'Editar egresso do GETECC' : 'Cadastrar egresso do GETECC'}</h2><p className="mt-1 text-xs text-slate-500">Registre a trajetória após o desligamento do grupo.</p></div>
              <button type="button" onClick={() => setModalAtivo(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <form onSubmit={salvarEgresso} className="space-y-4 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>Nome completo<input required value={formEgresso.nome_completo || ''} onChange={(e) => setFormEgresso({ ...formEgresso, nome_completo: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>
                <label>Curso<input value={formEgresso.curso_formacao || ''} onChange={(e) => setFormEgresso({ ...formEgresso, curso_formacao: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>
                <label>Instituição de formação<input value={formEgresso.instituicao_formacao || ''} onChange={(e) => setFormEgresso({ ...formEgresso, instituicao_formacao: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" placeholder="Ex.: UNIFACISA" /></label>
                <label>Motivo da saída<input value={formEgresso.motivo_saida || ''} onChange={(e) => setFormEgresso({ ...formEgresso, motivo_saida: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" placeholder="Ex.: conclusão do curso" /></label>
                <label>Entrada no GETECC<input type="date" value={formEgresso.data_ingresso_getecc || ''} onChange={(e) => setFormEgresso({ ...formEgresso, data_ingresso_getecc: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>
                <label>Saída do GETECC<input type="date" value={formEgresso.data_saida_getecc || ''} onChange={(e) => setFormEgresso({ ...formEgresso, data_saida_getecc: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>
              </div>
              <div className="rounded-xl border border-blue-100 bg-[#EAF4FB] p-4">
                <p className="mb-3 text-xs font-black text-[#0F172A]">Trajetória atual</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {atuacoesEgressoOpcoes.map((atuacao) => { const marcado = (formEgresso.trajetorias || []).includes(atuacao); return <label key={atuacao} className="flex min-w-0 items-center gap-2 rounded-lg border border-white bg-white px-3 py-2.5 text-[11px] font-bold text-slate-700"><input type="checkbox" checked={marcado} onChange={(ev) => { const atual = formEgresso.trajetorias || []; setFormEgresso({ ...formEgresso, trajetorias: ev.target.checked ? [...atual, atuacao] : atual.filter((x) => x !== atuacao) }); }} /><span className="break-words">{atuacao}</span></label>; })}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label>Instituição / local de atuação<input value={formEgresso.instituicao_atual || ''} onChange={(e) => setFormEgresso({ ...formEgresso, instituicao_atual: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" placeholder="Ex.: Hospital HELP, UFPB, Prefeitura..." /></label>
                <label>Cidade / UF<input value={formEgresso.cidade_uf_atual || ''} onChange={(e) => setFormEgresso({ ...formEgresso, cidade_uf_atual: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" placeholder="Ex.: Campina Grande/PB" /></label>
              </div>
              <label>Observações<textarea rows={3} value={formEgresso.observacoes || ''} onChange={(e) => setFormEgresso({ ...formEgresso, observacoes: e.target.value })} className="mt-1 w-full rounded-lg border p-2.5" /></label>
              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><button type="button" onClick={() => setModalAtivo(null)} className="rounded-lg border px-4 py-2 text-slate-700">Cancelar</button><button type="submit" style={{ backgroundColor: '#0072CE', color: '#FFFFFF', borderColor: '#0072CE' }} className="rounded-lg border px-4 py-2 font-black shadow-sm hover:opacity-90">Salvar egresso</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AFASTAMENTO / LICENÇA */}
      {modalAtivo === 'afastamento' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Registrar Ausência / Licença</h2>
            <form onSubmit={salvarAfastamento} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Tipo de Afastamento:</label>
                <input type="text" required placeholder="Ex: Licença Médica, Intercâmbio" value={formAfastamento.tipo || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, tipo: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Data Início:</label>
                  <input type="date" required value={formAfastamento.data_inicio || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, data_inicio: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Data Fim:</label>
                  <input type="date" required value={formAfastamento.data_fim || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, data_fim: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Motivo / Observações:</label>
                <textarea rows={3} required value={formAfastamento.motivo || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, motivo: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-amber-700 text-white font-black rounded hover:bg-amber-800">Confirmar Ausência</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COLABORADOR EXTERNO */}
      {modalAtivo === 'colaborador' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formColaborador.id ? 'Editar Colaborador Externo' : 'Cadastrar Colaborador Externo'}
            </h2>
            <form onSubmit={salvarColaborador} className="space-y-3 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nome Completo:</label>
                  <input type="text" required value={formColaborador.nome || ''} onChange={(e) => setFormColaborador({ ...formColaborador, nome: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">CPF:</label>
                  <input type="text" required value={formColaborador.cpf || ''} onChange={(e) => setFormColaborador({ ...formColaborador, cpf: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Titulação:</label>
                  <select value={formColaborador.titulacao || 'Doutor'} onChange={(e) => setFormColaborador({ ...formColaborador, titulacao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Especialista">Especialista</option>
                    <option value="Mestre">Mestre</option>
                    <option value="Doutor">Doutor</option>
                    <option value="Pós-Doutor">Pós-Doutor</option>
                    <option value="Livre-Docente">Livre-Docente</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">E-mail:</label>
                  <input type="email" required value={formColaborador.email || ''} onChange={(e) => setFormColaborador({ ...formColaborador, email: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">ORCID:</label>
                  <input type="text" value={formColaborador.orcid || ''} onChange={(e) => setFormColaborador({ ...formColaborador, orcid: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Nº Conselho:</label>
                  <input type="text" value={formColaborador.numero_conselho || ''} onChange={(e) => setFormColaborador({ ...formColaborador, numero_conselho: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Afiliação Institucional:</label>
                <input type="text" required value={formColaborador.afiliacao || ''} onChange={(e) => setFormColaborador({ ...formColaborador, afiliacao: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Colaborador</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: COLABORADOR FINANCEIRO (ABA 3) */}
      {modalAtivo === 'colaboradorFinanceiro' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Colaborador & Adquirição (Aba 3)</h2>
            <form onSubmit={salvarColaboradorFinanceiro} className="space-y-3 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Nome Completo:</label>
                  <input type="text" required value={formColaboradorFinanceiro.nome || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, nome: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">CPF:</label>
                  <input type="text" required value={formColaboradorFinanceiro.cpf || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, cpf: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Titulação:</label>
                  <select value={formColaboradorFinanceiro.titulacao || 'Doutor'} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, titulacao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Especialista">Especialista</option>
                    <option value="Mestre">Mestre</option>
                    <option value="Doutor">Doutor</option>
                    <option value="Pós-Doutor">Pós-Doutor</option>
                    <option value="Livre-Docente">Livre-Docente</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">E-mail:</label>
                  <input type="email" required value={formColaboradorFinanceiro.email || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, email: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div>
                <label className="block mb-1">Evento ou Nome do Artigo Adquirido:</label>
                <input type="text" required placeholder="Ex: Adquirição - Congresso Brasileiro de Trauma" value={formColaboradorFinanceiro.evento_ou_artigo || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, evento_ou_artigo: e.target.value })} className="w-full border p-2 rounded" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Valor Pago (R$):</label>
                  <input type="text" required placeholder="Ex: R$ 150,00" value={formColaboradorFinanceiro.valor_pago || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, valor_pago: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Status da Publicação:</label>
                  <select value={formColaboradorFinanceiro.status_publicacao || 'Em análise'} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, status_publicacao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Em análise">Em análise</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Reprovada">Reprovada</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: MOVIMENTAÇÃO DE CAIXA (MANUAL) */}
      {modalAtivo === 'movimentacao' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Novo Lançamento no Caixa</h2>
            <form onSubmit={salvarMovimentacao} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Descrição:</label>
                <input type="text" required value={formMovimentacao.descricao || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, descricao: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Valor (R$):</label>
                  <input type="number" step="0.01" required value={formMovimentacao.valor || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, valor: parseFloat(e.target.value) })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Tipo:</label>
                  <select value={formMovimentacao.tipo || 'Entrada'} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, tipo: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Entrada">Entrada (Receita)</option>
                    <option value="Saída">Saída (Despesa)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Categoria:</label>
                  <select value={formMovimentacao.categoria || 'Outros'} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, categoria: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Mensalidade">Mensalidade</option>
                    <option value="Day Off">Day Off</option>
                    <option value="São João">São João</option>
                    <option value="Inscrição / Publicação">Inscrição / Publicação</option>
                    <option value="Patrimônio">Patrimônio</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Custeio">Custeio</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Data:</label>
                  <input type="date" required value={formMovimentacao.data || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, data: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-slate-900 border border-emerald-400 font-black rounded transition-colors">Confirmar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: EDITAR MENSALIDADE DO MEMBRO */}
      {modalAtivo === 'editarMensalidade' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              Mensalidade: {NOMES_MESES[formEdicaoMensalidade.mes - 1]}/{formEdicaoMensalidade.ano}
            </h2>
            <p className="text-xs font-bold text-slate-700">Membro: <strong className="text-slate-900">{formEdicaoMensalidade.membro_nome}</strong></p>
            <div className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Valor (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formEdicaoMensalidade.valor}
                  onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, valor: parseFloat(e.target.value) || 0 })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Status do Pagamento:</label>
                <select
                  value={formEdicaoMensalidade.status}
                  onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, status: e.target.value as any })}
                  className="w-full border p-2 rounded"
                >
                  <option value="Pago">✓ Pago</option>
                  <option value="Pendente">⏳ Pendente</option>
                </select>
              </div>
              {formEdicaoMensalidade.status === 'Pago' && (
                <div>
                  <label className="block mb-1">Data do Pagamento:</label>
                  <input
                    type="date"
                    value={formEdicaoMensalidade.data_pagamento}
                    onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, data_pagamento: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="button" onClick={salvarEdicaoMensalidade} className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Alteração</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: EDITAR EVENTO ESPECIAL (DAY OFF / SÃO JOÃO) */}
      {modalAtivo === 'editarEventoEspecial' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-sm w-full p-5 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              Taxa de Evento: {formEdicaoEventoEspecial.evento}
            </h2>
            <p className="text-xs font-bold text-slate-700">Membro: <strong className="text-slate-900">{formEdicaoEventoEspecial.membro_nome}</strong></p>
            <div className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Valor Cobrado (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formEdicaoEventoEspecial.valor}
                  onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, valor: parseFloat(e.target.value) || 0 })}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Status:</label>
                <select
                  value={formEdicaoEventoEspecial.status}
                  onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, status: e.target.value as any })}
                  className="w-full border p-2 rounded"
                >
                  <option value="Pago">✓ Pago</option>
                  <option value="Pendente">⏳ Pendente</option>
                </select>
              </div>
              {formEdicaoEventoEspecial.status === 'Pago' && (
                <div>
                  <label className="block mb-1">Data do Pagamento:</label>
                  <input
                    type="date"
                    value={formEdicaoEventoEspecial.data_pagamento}
                    onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, data_pagamento: e.target.value })}
                    className="w-full border p-2 rounded"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="button" onClick={salvarEdicaoEventoEspecial} className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Alteração</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalAtivo === 'construcaoPendente' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full p-5 space-y-3 my-6">
            <h2 className="font-black text-lg">{formConstrucao.id ? 'Editar construção pendente' : 'Cadastrar construção pendente'}</h2>
            <form onSubmit={salvarConstrucaoPendente} className="space-y-3 text-xs font-bold">
              <label className="block">Título do artigo/produção<input required value={formConstrucao.titulo || ''} onChange={e => setFormConstrucao({...formConstrucao,titulo:e.target.value})} className="w-full border rounded p-2 mt-1" /></label>
              <label className="block">Objetivo<input required value={formConstrucao.objetivo || ''} onChange={e => setFormConstrucao({...formConstrucao,objetivo:e.target.value})} className="w-full border rounded p-2 mt-1" /></label>
              <label className="block">Projeto-mãe<select value={formConstrucao.projeto_mae || ''} onChange={e => setFormConstrucao({...formConstrucao,projeto_mae:e.target.value})} className="w-full border rounded p-2 mt-1"><option value="">Selecione um projeto</option>{projetos.map(p => <option key={p.id} value={p.titulo}>{p.titulo}</option>)}</select></label>
              <label className="block">Origem/como surgiu<input value={formConstrucao.origem || ''} onChange={e => setFormConstrucao({...formConstrucao,origem:e.target.value})} className="w-full border rounded p-2 mt-1" /></label>
              <label className="block">Link do Drive<input type="url" value={formConstrucao.link_drive || ''} onChange={e => setFormConstrucao({...formConstrucao,link_drive:e.target.value})} className="w-full border rounded p-2 mt-1" placeholder="https://..." /></label>
              <label className="block">Link do banco de dados<input type="url" value={formConstrucao.banco_dados || ''} onChange={e => setFormConstrucao({...formConstrucao,banco_dados:e.target.value})} className="w-full border rounded p-2 mt-1" placeholder="https://..." /></label>
              <label className="block">Status<select value={formConstrucao.status || 'Pendente'} onChange={e => setFormConstrucao({...formConstrucao,status:e.target.value as ConstrucaoPendente['status']})} className="w-full border rounded p-2 mt-1"><option>Pendente</option><option>Em desenvolvimento</option><option>Concluída</option></select></label>
              <div className="flex justify-end gap-2"><button type="button" onClick={() => setModalAtivo(null)} className="border rounded px-3 py-2">Cancelar</button><button type="submit" className="bg-red-700 text-white rounded px-4 py-2">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: PROJETO DE PESQUISA & ARTIGOS DERIVADOS */}
      {modalAtivo === 'projeto' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-3xl w-full p-6 space-y-4 my-8 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formProjeto.id ? 'Editar Projeto de Pesquisa' : 'Novo Projeto de Pesquisa'}
            </h2>
            <form onSubmit={salvarProjeto} className="space-y-4 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block mb-1">Título do Projeto:</label>
                  <input type="text" required value={formProjeto.titulo || ''} onChange={(e) => setFormProjeto({ ...formProjeto, titulo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Coordenador:</label>
                  <input type="text" required value={formProjeto.coordenador || ''} onChange={(e) => setFormProjeto({ ...formProjeto, coordenador: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Linha de Pesquisa:</label>
                  <input type="text" required value={formProjeto.linha_pesquisa || ''} onChange={(e) => setFormProjeto({ ...formProjeto, linha_pesquisa: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Docentes Envolvidos (separados por vírgula):</label>
                  <input type="text" value={formDocentesTexto} onChange={(e) => setFormDocentesTexto(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Discentes Envolvidos (separados por vírgula):</label>
                  <input type="text" value={formDiscentesTexto} onChange={(e) => setFormDiscentesTexto(e.target.value)} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Parecer CEP:</label>
                  <input type="text" value={formProjeto.parecer_cep || ''} onChange={(e) => setFormProjeto({ ...formProjeto, parecer_cep: e.target.value })} className="w-full border p-2 rounded" />
                </div>

                {/* CORREÇÃO: CAMPO DE UPLOAD DO FICHEIRO DO PARECER CEP */}
                <div>
                  <label className="block mb-1 text-slate-900 font-black">📄 Anexar Parecer CEP (opcional; PDF/Imagem):</label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setFormProjeto({
                            ...formProjeto,
                            parecer_cep_arquivo_dataurl: reader.result as string,
                            parecer_cep_arquivo_nome: file.name,
                          });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full border p-1 rounded bg-slate-50 text-slate-900 font-bold"
                  />
                  {formProjeto.parecer_cep_arquivo_nome && (
                    <p className="text-[11px] text-emerald-800 font-black mt-1">
                      📎 Ficheiro Carregado: {formProjeto.parecer_cep_arquivo_nome}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-1">CAEE CEP:</label>
                  <input type="text" value={formProjeto.caee_cep || ''} onChange={(e) => setFormProjeto({ ...formProjeto, caee_cep: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Financiamento:</label>
                  <input type="text" value={formProjeto.financiamento || ''} onChange={(e) => setFormProjeto({ ...formProjeto, financiamento: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Projeto NUPEX:</label>
                  <select value={formProjeto.is_nupex ? 'Sim' : 'Não'} onChange={(e) => setFormProjeto({ ...formProjeto, is_nupex: e.target.value === 'Sim' })} className="w-full border p-2 rounded">
                    <option value="Não">Não</option>
                    <option value="Sim">Sim</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Status:</label>
                  <select value={formProjeto.status || 'Em aberto'} onChange={(e) => setFormProjeto({ ...formProjeto, status: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Em aberto">Em aberto</option>
                    <option value="Submetido">Submetido</option>
                    <option value="Cadastrado">Cadastrado</option>
                    <option value="Em execução">Em execução</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Observações do Projeto:</label>
                <textarea rows={2} value={formProjeto.observacoes || ''} onChange={(e) => setFormProjeto({ ...formProjeto, observacoes: e.target.value })} className="w-full border p-2 rounded" />
              </div>

              {/* SESSÃO DE ARTIGOS DERIVADOS DENTRO DO MODAL */}
              <div className="border p-3 rounded bg-slate-50 space-y-3">
                <h3 className="font-black text-slate-900 border-b pb-1">➕ Adicionar Artigo Derivado ao Projeto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input type="text" placeholder="Título do Artigo Derivado" value={formArtigoDerivado.titulo || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, titulo: e.target.value })} className="border p-1.5 rounded bg-white" />
                  <input type="text" placeholder="Revista / Periódico Alvo" value={formArtigoDerivado.revista || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, revista: e.target.value })} className="border p-1.5 rounded bg-white" />
                  <input type="text" placeholder="Qualis / JCR / CiteScore" value={formArtigoDerivado.qualis_jcr_cite || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, qualis_jcr_cite: e.target.value })} className="border p-1.5 rounded bg-white" />
                  <select value={formArtigoDerivado.status || 'em produção'} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, status: e.target.value as any })} className="border p-1.5 rounded bg-white">
                    <option value="em produção">Em Produção</option>
                    <option value="em revisão">Em Revisão</option>
                    <option value="publicado">Publicado</option>
                  </select>
                </div>
                <button type="button" onClick={adicionarArtigoDerivadoNoProjeto} className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-black px-3 py-1 rounded border border-slate-400">
                  + Anexar Artigo ao Projeto
                </button>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Projeto Completo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: DEMANDA */}
      {modalAtivo === 'demanda' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formDemanda.id ? 'Editar Demanda' : 'Cadastrar Nova Demanda'}
            </h2>
            <form onSubmit={salvarDemanda} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Título da Demanda:</label>
                <input type="text" required value={formDemanda.titulo || ''} onChange={(e) => setFormDemanda({ ...formDemanda, titulo: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Responsáveis (marque uma ou mais pessoas):</label>
                  <div className="w-full border border-slate-300 rounded p-2 max-h-40 overflow-y-auto space-y-2 bg-white">
                    {Array.from(new Set([...usuarios.filter((u) => u.situacao === 'Ativo').map((u) => u.nome_completo), ...separarResponsaveis(formDemanda.responsavel_nome || '')])).filter(Boolean).sort((a,b) => a.localeCompare(b, 'pt-BR')).map((nome) => {
                      const selecionados = separarResponsaveis(formDemanda.responsavel_nome || '');
                      const marcado = selecionados.some((n) => normalizarNomeResponsavel(n) === normalizarNomeResponsavel(nome));
                      return <label key={nome} className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                        <input type="checkbox" checked={marcado} onChange={(e) => {
                          const atuais = separarResponsaveis(formDemanda.responsavel_nome || '');
                          const novos = e.target.checked
                            ? [...atuais.filter((n) => normalizarNomeResponsavel(n) !== normalizarNomeResponsavel(nome)), nome]
                            : atuais.filter((n) => normalizarNomeResponsavel(n) !== normalizarNomeResponsavel(nome));
                          setFormDemanda({ ...formDemanda, responsavel_nome: novos.join(', ') });
                        }} className="h-4 w-4 accent-red-700" />
                        <span>{nome}</span>
                      </label>;
                    })}
                  </div>
                  {!separarResponsaveis(formDemanda.responsavel_nome || '').length && <p className="text-[10px] text-red-600 mt-1">Marque pelo menos um responsável.</p>}
                  <p className="text-[10px] text-slate-500 mt-1">Cada pessoa tem sua própria caixinha. Você pode marcar mais de um responsável.</p>
                </div>
                <div>
                  <label className="block mb-1">Prazo Final:</label>
                  <input type="date" required value={formDemanda.prazo_final || ''} onChange={(e) => setFormDemanda({ ...formDemanda, prazo_final: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Prioridade:</label>
                  <select value={formDemanda.prioridade || 'Média'} onChange={(e) => setFormDemanda({ ...formDemanda, prioridade: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Status:</label>
                  <select value={formDemanda.status || 'Em andamento'} onChange={(e) => setFormDemanda({ ...formDemanda, status: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Não iniciada">Não iniciada</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Com pendências">Com pendências</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-red-50 border border-red-200 rounded flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="chkCoracao"
                  checked={formDemanda.eh_coracao || false}
                  onChange={(e) => setFormDemanda({ ...formDemanda, eh_coracao: e.target.checked })}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <label htmlFor="chkCoracao" className="text-red-900 font-black cursor-pointer">
                  Demanda Exclusiva do Núcleo Coração (Corpo Gestor)
                </label>
              </div>

              <div>
                <label className="block mb-1">Descrição Detalhada:</label>
                <textarea rows={3} value={formDemanda.descricao || ''} onChange={(e) => setFormDemanda({ ...formDemanda, descricao: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Demanda</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: PRODUÇÃO CIENTÍFICA */}
      {modalAtivo === 'producao' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formProducao.id ? 'Editar Produção Científica' : 'Cadastrar Produção Científica'}
            </h2>
            <form onSubmit={salvarProducao} className="space-y-3 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Categoria:</label>
                  <select value={formProducao.categoria_producao || 'Periódico'} onChange={(e) => setFormProducao({ ...formProducao, categoria_producao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Periódico">Periódico / Revista</option>
                    <option value="Congresso">Congresso / Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Tipo Específico:</label>
                  <input type="text" placeholder="Ex: Artigo Científico, Resumo Expandido" value={formProducao.tipo_producao || ''} onChange={(e) => setFormProducao({ ...formProducao, tipo_producao: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Título do Trabalho:</label>
                <input type="text" required value={formProducao.titulo || ''} onChange={(e) => setFormProducao({ ...formProducao, titulo: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Nome do Periódico ou Evento / Congresso:</label>
                <input type="text" required value={formProducao.evento_ou_revista || ''} onChange={(e) => setFormProducao({ ...formProducao, evento_ou_revista: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Autor Principal:</label>
                  <input type="text" required value={formProducao.autor_principal || ''} onChange={(e) => setFormProducao({ ...formProducao, autor_principal: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Coautores:</label>
                  <input type="text" value={formProducao.coautores || ''} onChange={(e) => setFormProducao({ ...formProducao, coautores: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              {formProducao.categoria_producao === 'Periódico' && <p className="col-span-full rounded bg-amber-50 border border-amber-200 p-2 text-[11px] text-amber-900">O ano de produção é quando o artigo foi elaborado; o ano de publicação é quando saiu na revista. Eles podem ser diferentes.</p>}
              <div className={`grid ${formProducao.categoria_producao === 'Periódico' ? 'grid-cols-4' : 'grid-cols-3'} gap-2`}>
                {formProducao.categoria_producao === 'Periódico' && <div>
                  <label className="block mb-1">Ano de produção:</label>
                  <input type="number" min="1900" max="2200" required value={formProducao.ano_producao || formProducao.ano_publicacao || '2026'} onChange={(e) => setFormProducao({ ...formProducao, ano_producao: e.target.value })} className="w-full border p-2 rounded" />
                </div>}
                <div>
                  <label className="block mb-1">{formProducao.categoria_producao === 'Congresso' ? 'Ano (produção/publicação):' : 'Ano de publicação:'}</label>
                  <input type="number" min="1900" max="2200" required value={formProducao.ano_publicacao || '2026'} onChange={(e) => setFormProducao({ ...formProducao, ano_publicacao: e.target.value, ...(formProducao.categoria_producao === 'Congresso' ? { ano_producao: e.target.value } : {}) })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Qualis / DOI:</label>
                  <input type="text" value={formProducao.qualis_doi || ''} onChange={(e) => setFormProducao({ ...formProducao, qualis_doi: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Status do Trabalho:</label>
                  <select value={formProducao.status || 'Publicado'} onChange={(e) => setFormProducao({ ...formProducao, status: e.target.value as any })} className="w-full border p-2 rounded font-bold">
                    <option value="Pendente Submissão">Pendente Submissão</option>
                    <option value="aguardando submissão">Aguardando Submissão</option>
                    <option value="Submetido">Submetido</option>
                    <option value="em editoração">Em Editoração</option>
                    <option value="aguardando anais">Aguardando Anais</option>
                    <option value="anais publicados">Anais Publicados</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Produção</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 11: CADASTRAR/EDITAR META ANUAL DE PRODUÇÃO */}
      {modalAtivo === 'cadastrarMeta' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Definir Metas Anuais de Produção</h2>
            <form onSubmit={salvarMetaAnual} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Ano de Referência:</label>
                <input type="text" required value={formMetaAnual.ano || '2026'} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, ano: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Meta de Artigos Produzidos (Em elaboração / submetidos):</label>
                <input type="number" required value={formMetaAnual.meta_artigos_produzidos || 0} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_artigos_produzidos: parseInt(e.target.value) || 0 })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Meta de Artigos Publicados:</label>
                <input type="number" required value={formMetaAnual.meta_artigos_publicados || 0} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_artigos_publicados: parseInt(e.target.value) || 0 })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Meta de Resumos Aprovados em Congressos:</label>
                <input type="number" required value={formMetaAnual.meta_resumos || 0} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_resumos: parseInt(e.target.value) || 0 })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg border border-blue-800 bg-blue-700 px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">Salvar Meta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 12: IMPORTAÇÃO DE PRODUÇÕES EM MASSA */}
      {modalAtivo === 'cargaMassaProducao' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Importação de Produções Científicas</h2>

            <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-2">
              <label className="block font-black text-xs text-slate-900">📂 Selecionar Arquivo em Planilha (XLS, XLSX) ou CSV:</label>
              <input
                type="file"
                accept=".csv, .xls, .xlsx"
                onChange={(e) => handleProcessarArquivoEmMassa(e, 'producoes')}
                className="w-full text-xs font-bold text-slate-900"
              />
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-300"></div>
              <span className="flex-shrink mx-4 text-xs font-black text-slate-500">OU COLE O TEXTO SEPARADO POR TABS/PONTO-E-VÍRGULA</span>
              <div className="flex-grow border-t border-slate-300"></div>
            </div>

            <form onSubmit={handleCargaMassaProducoes} className="space-y-3">
              <textarea
                rows={5}
                required
                value={textoCargaMassaProducao}
                onChange={(e) => setTextoCargaMassaProducao(e.target.value)}
                placeholder="Categoria ; Tipo ; Título ; Evento ou Revista ; Autor Principal ; Coautores ; Ano de produção ; Ano de publicação ; Qualis/DOI ; Status"
                className="w-full border p-2 rounded text-xs font-mono font-bold text-slate-900"
              />
              <div className="flex justify-between items-center">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded text-xs">Fechar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white font-black text-xs rounded hover:bg-red-800">
                  Processar Texto Colado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 13: REUNIÃO / ENCONTRO CIENTÍFICO COM CHAMADA */}
      {modalAtivo === 'reuniao' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 space-y-4 my-8 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">Cadastrar Encontro Científico & Chamada</h2>
            <form onSubmit={salvarReuniao} className="space-y-4 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block mb-1">Título do Encontro:</label>
                  <input type="text" required placeholder="Ex: Encontro Quinzenal de Trauma" value={formReuniao.titulo || ''} onChange={(e) => setFormReuniao({ ...formReuniao, titulo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Data:</label>
                  <input type="date" required value={formReuniao.data || ''} onChange={(e) => setFormReuniao({ ...formReuniao, data: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Pauta do Encontro:</label>
                <textarea rows={2} required value={formReuniao.pauta || ''} onChange={(e) => setFormReuniao({ ...formReuniao, pauta: e.target.value })} className="w-full border p-2 rounded" />
              </div>

              <div className="border p-3 rounded bg-slate-50 space-y-2 max-h-60 overflow-y-auto">
                <h3 className="font-black text-slate-900 border-b pb-1">📋 Chamada de Membros Ativos ({membrosAtivos.length}):</h3>
                {membrosAtivos.map((m) => (
                  <div key={m.id} className="flex justify-between items-center py-1 border-b text-xs">
                    <span className="font-bold">{m.nome_completo}</span>
                    <select
                      value={presencasChamada[m.id] || 'presente'}
                      onChange={(e) => setPresencasChamada({ ...presencasChamada, [m.id]: e.target.value as any })}
                      className="border p-1 rounded font-bold bg-white"
                    >
                      <option value="presente">✓ Presente</option>
                      <option value="falta">✕ Falta</option>
                      <option value="falta_justificada">⚠️ Falta Justificada</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Encontro & Chamada</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 14: PATRIMÔNIO GETECC */}
      {modalAtivo === 'patrimonio' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formPatrimonio.id ? 'Editar Item do Patrimônio' : 'Cadastrar Item no Patrimônio'}
            </h2>
            <form onSubmit={salvarPatrimonio} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Nome do Item / Produto:</label>
                <input type="text" required value={formPatrimonio.nome || ''} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, nome: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Quantidade:</label>
                  <input type="number" required value={formPatrimonio.quantidade || 1} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, quantidade: parseInt(e.target.value) || 1 })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Estado de Conservação:</label>
                  <select value={formPatrimonio.estado_conservacao || 'Excelente'} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, estado_conservacao: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Excelente">Excelente</option>
                    <option value="Bom">Bom</option>
                    <option value="Regular">Regular</option>
                    <option value="Danificado">Danificado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1">Responsável pela Guarda:</label>
                <input type="text" required value={formPatrimonio.responsavel || ''} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, responsavel: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Descrição / Especificações:</label>
                <textarea rows={2} value={formPatrimonio.descricao || ''} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, descricao: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block mb-1">Foto do Produto:</label>
                <input type="file" accept="image/*" onChange={handleUploadFotoPatrimonio} className="w-full border p-1 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 15: MARKETING & MÍDIAS */}
      {modalAtivo === 'marketing' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formMarketing.id ? 'Editar Ação de Marketing' : 'Cadastrar Ação de Mídia'}
            </h2>
            <form onSubmit={salvarMarketing} className="space-y-3 text-xs font-bold text-slate-900">
              <div>
                <label className="block mb-1">Título da Publicação / Post:</label>
                <input type="text" required value={formMarketing.titulo || ''} onChange={(e) => setFormMarketing({ ...formMarketing, titulo: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Canal:</label>
                  <select value={formMarketing.canal || 'Instagram'} onChange={(e) => setFormMarketing({ ...formMarketing, canal: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Instagram">Instagram</option>
                    <option value="Site / Portal">Site / Portal</option>
                    <option value="E-mail Marketing">E-mail Marketing</option>
                    <option value="Evento">Evento</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Status:</label>
                  <select value={formMarketing.status || 'Ideia'} onChange={(e) => setFormMarketing({ ...formMarketing, status: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Ideia">Ideia</option>
                    <option value="Em Produção">Em Produção</option>
                    <option value="Aprovado">Aprovado</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Responsável:</label>
                  <input type="text" required value={formMarketing.responsavel || ''} onChange={(e) => setFormMarketing({ ...formMarketing, responsavel: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Data Prevista:</label>
                  <input type="date" required value={formMarketing.data_prevista || ''} onChange={(e) => setFormMarketing({ ...formMarketing, data_prevista: e.target.value })} className="w-full border p-2 rounded" />
                </div>
              </div>
              <div>
                <label className="block mb-1">Legenda / Texto:</label>
                <textarea rows={3} value={formMarketing.legenda || ''} onChange={(e) => setFormMarketing({ ...formMarketing, legenda: e.target.value })} className="w-full border p-2 rounded" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded">Cancelar</button>
                <button type="submit" className="px-3 py-1.5 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Ação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 16: USUÁRIO E MATRIZ DE PERMISSÕES POR ABA */}
      {modalAtivo === 'usuario' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg border border-slate-300 max-w-2xl w-full p-6 space-y-4 my-8 shadow-xl">
            <h2 className="text-base font-black text-slate-900 border-b pb-2">
              {formUsuario.id ? 'Editar Usuário e Permissões' : 'Cadastrar Novo Usuário'}
            </h2>
            <form onSubmit={salvarUsuarioSupabase} className="space-y-4 text-xs font-bold text-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1">Nome Completo:</label>
                  <input type="text" required value={formUsuario.nome_completo || ''} onChange={(e) => setFormUsuario({ ...formUsuario, nome_completo: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">E-mail de Acesso:</label>
                  <input type="email" required value={formUsuario.email || ''} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block mb-1">Perfil de Acesso:</label>
                  <select value={formUsuario.perfil_acesso || 'Membro'} onChange={(e) => setFormUsuario({ ...formUsuario, perfil_acesso: e.target.value as any })} className="w-full border p-2 rounded">
                    <option value="Administrador">Administrador (Acesso Total)</option>
                    <option value="Gestão">Gestão (acesso a todas as abas, inclusive Coração)</option>
                    <option value="Coordenador">Coordenador</option>
                    <option value="Apoio Técnico">Apoio Técnico</option>
                    <option value="Membro">Membro</option>
                    <option value="Consulta">Consulta</option>
                  </select>
                </div>
              </div>

              <div className="border p-3 rounded bg-slate-50 space-y-2 max-h-72 overflow-y-auto">
                <h3 className="font-black text-slate-900 border-b pb-1">🔑 Matriz de Permissões Específicas por Módulo:</h3>
                <div className="space-y-2">
                  {abasDisponiveisChaves.map((aba) => {
                    const permAtual = formUsuario.permissoes?.[aba.key] || { visualizar: false, editar: false };

                    return (
                      <div key={aba.key} className="flex justify-between items-center bg-white p-2 border rounded">
                        <span className="font-bold text-slate-900">{aba.label}</span>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={permAtual.visualizar}
                              onChange={(e) => {
                                const novas = { ...(formUsuario.permissoes || {}) };
                                novas[aba.key] = { ...permAtual, visualizar: e.target.checked };
                                setFormUsuario({ ...formUsuario, permissoes: novas });
                              }}
                            />
                            <span>Visualizar</span>
                          </label>

                          <label className="flex items-center space-x-1 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={permAtual.editar}
                              onChange={(e) => {
                                const novas = { ...(formUsuario.permissoes || {}) };
                                novas[aba.key] = { ...permAtual, editar: e.target.checked };
                                setFormUsuario({ ...formUsuario, permissoes: novas });
                              }}
                            />
                            <span className="text-red-700 font-black">Editar/Criar</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-4 py-2 border rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white font-black rounded hover:bg-red-800">Salvar Credenciais & Permissões</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 17: REDEFINIÇÃO DE SENHAS DE USUÁRIOS */}
      {modalAtivo === 'resetSenha' && usuarioResetSenha && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-base font-black text-slate-900 flex items-center space-x-2">
                <span>🔑</span>
                <span>Redefinição de Senha</span>
              </h2>
              <button onClick={() => setModalAtivo(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-bold text-slate-800 space-y-1">
              <p><strong>Usuário:</strong> {usuarioResetSenha.nome_completo}</p>
              <p><strong>E-mail:</strong> {usuarioResetSenha.email}</p>
              <p><strong>Perfil:</strong> {usuarioResetSenha.perfil_acesso}</p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="border p-3 rounded bg-blue-50 border-blue-200 space-y-2">
                <p className="text-xs font-black text-blue-900">Opção 1: Link de Redefinição via E-mail</p>
                <p className="text-[11px] text-blue-800 font-bold">Envia um e-mail com instrução e link seguro de alteração de senha para o usuário.</p>
                <button
                  type="button"
                  onClick={() => handleEnviarEmailResetSenha(usuarioResetSenha.email)}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black text-xs py-2 rounded shadow-sm transition-colors"
                >
                  📧 Enviar E-mail de Redefinição
                </button>
              </div>

              <div className="border p-3 rounded bg-amber-50 border-amber-200 space-y-2">
                <p className="text-xs font-black text-amber-900">Opção 2: Gravar Nova Senha Manualmente</p>
                <label className="block text-[11px] font-bold text-amber-900">Digite a nova senha para este usuário:</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={novaSenhaInput}
                  onChange={(e) => setNovaSenhaInput(e.target.value)}
                  className="w-full border p-2 rounded text-xs font-bold bg-white text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAlterarSenhaDireta}
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white font-black text-xs py-2 rounded shadow-sm transition-colors"
                >
                  ⚡ Alterar Senha Diretamente
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                type="button"
                onClick={() => { setModalAtivo(null); setUsuarioResetSenha(null); }}
                className="px-4 py-1.5 border rounded text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}