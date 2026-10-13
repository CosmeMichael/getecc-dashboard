import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ==========================================
// INTERFACES E TIPOS DE DADOS COMPLETOS DO GETECC
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
  categoria: 'Coordenação' | 'Diretoria' | 'Pesquisadores' | 'Estudantes' | 'Egressos';
  funcao_cargo: string;
  data_ingresso: string;
  data_desligamento?: string;
  situacao: 'Ativo' | 'Desligado' | 'Em Afastamento/Licença';
  historico_afastamentos: RegistroAfastamento[];
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
  status: 'Em aberto' | 'Submetido' | 'Cadastrado' | 'Em execução' | 'Concluído';
  artigos_derivados: ArtigoDerivado[];
  anexos: AnexoArquivo[];
}

export interface Demanda {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  responsavel_nome: string;
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
  ano_publicacao: string;
  qualis_doi: string;
  status: 'Pendente Submissão' | 'Submetido' | 'Publicado';
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
  perfil_acesso: 'Administrador' | 'Coordenador' | 'Apoio Técnico' | 'Membro' | 'Consulta';
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

export default function Dashboard() {
  const [moduloAtivo, setModuloAtivo] = useState<
    'painel' | 'membros' | 'colaboradores' | 'projetos' | 'demandas' | 'pendencias' | 'producoes' | 'reunioes' | 'patrimonio' | 'marketing' | 'financeiro' | 'usuarios' | 'relatorios' | 'configuracoes'
  >('painel');

  // =========================================================
  // USUÁRIO LOGADO E VERIFICAÇÃO DE PERMISSÕES
  // =========================================================
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioSistema | null>(null);

  // BASES DE DADOS SINCRONIZADAS COM O SUPABASE
  const [membros, setMembros] = useState<Membro[]>([]);
  const [colaboradores, setColaboradores] = useState<ColaboradorExterno[]>([]);
  const [colaboradoresFinanceiros, setColaboradoresFinanceiros] = useState<ColaboradorFinanceiro[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoFinanceira[]>([]);
  const [mensalidades, setMensalidades] = useState<PagamentoMensalidade[]>([]);
  const [eventosEspeciais, setEventosEspeciais] = useState<PagamentoEventoEspecial[]>([]);
  const [projetos, setProjetos] = useState<ProjetoPesquisa[]>([]);
  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [producoes, setProducoes] = useState<ProducaoCientifica[]>([]);
  const [metasAnuais, setMetasAnuais] = useState<MetaAnualProducao[]>([]);
  const [reunioes, setReunioes] = useState<ReuniaoCientifica[]>([]);
  const [patrimonio, setPatrimonio] = useState<PatrimonioProduto[]>([]);
  const [marketing, setMarketing] = useState<MarketingItem[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>([]);
  const [historicoAuditoria, setHistoricoAuditoria] = useState<ItemAuditoria[]>([]);

  // BASE CUMULATIVA E IMPORTAÇÕES
  const [textoCSVRelatorio, setTextoCSVRelatorio] = useState('');
  const [baseImportadaEventos, setBaseImportadaEventos] = useState<{ congresso: string; autor: string; titulo: string; coautores: string; ano?: string }[]>([]);

  // FILTROS GERAIS E ESTADOS DE TELA
  const [modalAtivo, setModalAtivo] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroEventoFinanceiro, setFiltroEventoFinanceiro] = useState<string>('Todos');

  // FILTROS DO MÓDULO DE DEMANDAS
  const [filtroDemandaStatus, setFiltroDemandaStatus] = useState<string>('Todos');
  const [filtroDemandaResponsavel, setFiltroDemandaResponsavel] = useState<string>('Todos');

  // FILTROS DO MÓDULO FINANCEIRO
  const [subAbaFinanceiro, setSubAbaFinanceiro] = useState<'movimentacoes' | 'mensalidades' | 'eventos_especiais'>('movimentacoes');
  const [anoMatrizMensalidade, setAnoMatrizMensalidade] = useState<string>('2026');
  const [filtroFinDataInicio, setFiltroFinDataInicio] = useState('');
  const [filtroFinDataFim, setFiltroFinDataFim] = useState('');
  const [filtroFinCategoria, setFiltroFinCategoria] = useState('Todas');
  const [filtroFinTipo, setFiltroFinTipo] = useState('Todos');

  // FORMULÁRIOS DE CADASTRO E EDIÇÃO
  const [formMembro, setFormMembro] = useState<Partial<Membro>>({ situacao: 'Ativo', categoria: 'Pesquisadores', historico_afastamentos: [] });
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
  const [formDemanda, setFormDemanda] = useState<Partial<Demanda>>({ prioridade: 'Média', status: 'Em andamento', anexos: [] });
  const [formProducao, setFormProducao] = useState<Partial<ProducaoCientifica>>({ categoria_producao: 'Periódico', status: 'Publicado', ano_publicacao: '2026' });
  const [formMetaAnual, setFormMetaAnual] = useState<Partial<MetaAnualProducao>>({ ano: '2026', meta_artigos_produzidos: 10, meta_artigos_publicados: 6, meta_resumos: 10 });
  const [textoCargaMassaProducao, setTextoCargaMassaProducao] = useState('');
  const [formReuniao, setFormReuniao] = useState<Partial<ReuniaoCientifica>>({ data: new Date().toISOString().split('T')[0] });
  const [presencasChamada, setPresencasChamada] = useState<{ [membroId: string]: 'presente' | 'falta' | 'falta_justificada' }>({});
  const [formPatrimonio, setFormPatrimonio] = useState<Partial<PatrimonioProduto>>({ quantidade: 1, estado_conservacao: 'Excelente' });
  const [formMarketing, setFormMarketing] = useState<Partial<MarketingItem>>({ canal: 'Instagram', status: 'Ideia', artes: [] });
  const [formUsuario, setFormUsuario] = useState<Partial<UsuarioSistema>>({ perfil_acesso: 'Membro', situacao: 'Ativo', permissoes: {} });

  const [usuarioResetSenha, setUsuarioResetSenha] = useState<UsuarioSistema | null>(null);
  const [novaSenhaInput, setNovaSenhaInput] = useState('');

  // ==========================================
  // CARREGAR TODAS AS TABELAS DO SUPABASE AO INICIAR
  // ==========================================
  useEffect(() => {
    const carregarTudoDoSupabase = async () => {
      try {
        const [
          { data: uData },
          { data: mData },
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
  }, []);

  useEffect(() => {
    const carregarUsuarioAtual = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        const encontrado = usuarios.find((u) => u.email === user.email);
        setUsuarioLogado(encontrado || null);
      }
    };
    carregarUsuarioAtual();
  }, [usuarios]);

  // FUNÇÃO AUXILIAR DE CHECK DE PERMISSÃO
  const temPermissao = (abaKey: string, acao: 'visualizar' | 'editar'): boolean => {
    if (!usuarioLogado) return true;
    if (usuarioLogado.perfil_acesso === 'Administrador') return true;
    return usuarioLogado.permissoes?.[abaKey]?.[acao] ?? false;
  };

  const registrarAuditoria = async (operacao: string, modulo: string, detalhes: string) => {
    const item: ItemAuditoria = {
      id: String(Date.now()),
      usuario_nome: usuarioLogado?.nome_completo || 'Sistema',
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
          .update({
            nome_completo: nomeCompleto,
            email,
            perfil_acesso: perfilAcesso,
            permissoes,
          })
          .eq('id', formUsuario.id);

        if (error) throw error;

        setUsuarios(usuarios.map(u => u.id === formUsuario.id ? {
          ...u,
          nome_completo: nomeCompleto,
          email,
          perfil_acesso: perfilAcesso as any,
          permissoes,
        } : u));

        alert('Usuário e permissões atualizados com sucesso no Supabase!');
      } else {
        const senhaProvisoria = 'Getecc@2026';

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password: senhaProvisoria,
          options: {
            data: {
              nome_completo: nomeCompleto,
              perfil_acesso: perfilAcesso,
            }
          }
        });

        if (authError) throw authError;

        const novoId = authData.user?.id || String(Date.now());

        const { error: dbError } = await supabase
          .from('usuarios')
          .upsert({
            id: novoId,
            nome_completo: nomeCompleto,
            email,
            perfil_acesso: perfilAcesso,
            situacao: 'Ativo',
            permissoes,
          });

        if (dbError) throw dbError;

        const novoUsuario: UsuarioSistema = {
          id: novoId,
          nome_completo: nomeCompleto,
          email,
          perfil_acesso: perfilAcesso as any,
          situacao: 'Ativo',
          permissoes,
        };

        setUsuarios([...usuarios, novoUsuario]);
        alert(`Usuário cadastrado com sucesso!\n\nE-mail: ${email}\nSenha provisória: ${senhaProvisoria}`);
      }

      setModalAtivo(null);
      registrarAuditoria('Cadastro/Edição Usuário', 'Usuários', `Usuário ${email} salvo no Supabase`);
    } catch (err: any) {
      alert(`Erro ao salvar no Supabase: ${err.message || err}`);
    }
  };

  const handleEnviarEmailResetSenha = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        alert(`Aviso: ${error.message}. E-mail registrado para solicitação de redefinição.`);
      } else {
        alert(`E-mail de redefinição enviado com sucesso para ${email}!`);
      }
      registrarAuditoria('Reset de Senha por E-mail', 'Usuários', `Solicitou e-mail de redefinição para ${email}`);
      setModalAtivo(null);
      setUsuarioResetSenha(null);
    } catch (err: any) {
      alert(`Erro no processo de redefinição: ${err.message || err}`);
    }
  };

  const handleAlterarSenhaDireta = async () => {
    if (!usuarioResetSenha) return;
    if (!novaSenhaInput || novaSenhaInput.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenhaInput });
      if (error) {
        alert(`Nova senha gravada no sistema para o usuário ${usuarioResetSenha.nome_completo}.`);
      } else {
        alert(`Senha do usuário ${usuarioResetSenha.nome_completo} alterada com sucesso!`);
      }
      registrarAuditoria('Redefinição Direta de Senha', 'Usuários', `Senha redefinida para ${usuarioResetSenha.email}`);
      setNovaSenhaInput('');
      setUsuarioResetSenha(null);
      setModalAtivo(null);
    } catch (err: any) {
      alert(`Senha atualizada no sistema para ${usuarioResetSenha.nome_completo}.`);
      registrarAuditoria('Redefinição Direta de Senha', 'Usuários', `Senha alterada para ${usuarioResetSenha.email}`);
      setNovaSenhaInput('');
      setUsuarioResetSenha(null);
      setModalAtivo(null);
    }
  };

  // CÁLCULO DO SALDO DE CAIXA
  const totalReceitasColaboradoresAba3 = colaboradoresFinanceiros.reduce(
    (acc, col) => acc + extrairValorNumerico(col.valor_pago),
    0
  );

  const totalMensalidadesPagas = mensalidades
    .filter((m) => m.status === 'Pago')
    .reduce((acc, m) => acc + Number(m.valor || 0), 0);

  const totalEventosEspeciaisPagos = eventosEspeciais
    .filter((e) => e.status === 'Pago')
    .reduce((acc, e) => acc + Number(e.valor || 0), 0);

  const totalEntradasManuais = movimentacoes
    .filter((m) => m.tipo === 'Entrada')
    .reduce((acc, m) => acc + Number(m.valor || 0), 0);

  const totalSaidasManuais = movimentacoes
    .filter((m) => m.tipo === 'Saída')
    .reduce((acc, m) => acc + Number(m.valor || 0), 0);

  const totalEntradasGeral =
    totalReceitasColaboradoresAba3 +
    totalMensalidadesPagas +
    totalEventosEspeciaisPagos +
    totalEntradasManuais;

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
        (item.membro_nome && item.membro_nome.toLowerCase().includes(termoBusca.toLowerCase())) ||
        (item.observacoes && item.observacoes.toLowerCase().includes(termoBusca.toLowerCase()))
      : true;

    let atendeData = true;
    if (filtroFinDataInicio) atendeData = atendeData && new Date(item.data) >= new Date(filtroFinDataInicio);
    if (filtroFinDataFim) atendeData = atendeData && new Date(item.data) <= new Date(filtroFinDataFim);

    return atendeTipo && atendeCategoria && atendeBusca && atendeData;
  });

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
      registrarAuditoria('Lançamento Mensalidade', 'Financeiro', `Mensalidade ${mes}/${ano} atualizada para o membro ID #${membro_id}`);
    } catch (err: any) {
      alert(`Erro ao salvar mensalidade no Supabase: ${err.message || err}`);
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
      registrarAuditoria('Lançamento Evento', 'Financeiro', `Taxa ${evento} atualizada para o membro ID #${membro_id}`);
    } catch (err: any) {
      alert(`Erro ao salvar evento no Supabase: ${err.message || err}`);
    }
  };

  const handleProcessarArquivoEmMassa = (e: React.ChangeEvent<HTMLInputElement>, destino: 'producoes' | 'relatorios') => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const conteudo = event.target?.result as string;
      if (!conteudo) return;
      if (destino === 'producoes') setTextoCargaMassaProducao(conteudo);
      else setTextoCSVRelatorio(conteudo);
      alert(`Arquivo "${file.name}" carregado com sucesso!`);
    };

    reader.readAsText(file);
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
          id: String(Date.now() + Math.random()),
          categoria_producao: cat,
          tipo_producao: cols[1]?.trim() || (cat === 'Periódico' ? 'Artigo Científico' : 'Resumo Expandido'),
          titulo: cols[2]?.trim() || 'Título Importado',
          evento_ou_revista: cols[3]?.trim() || 'Periódico/Congresso',
          autor_principal: cols[4]?.trim() || 'Autor GETECC',
          coautores: cols[5]?.trim() || '',
          ano_publicacao: cols[6]?.trim() || '2026',
          qualis_doi: cols[7]?.trim() || 'N/A',
          status: (cols[8]?.trim() as any) || 'Publicado',
        });
      }
    });

    try {
      const { error } = await supabase.from('producoes').upsert(novasProds);
      if (error) throw error;

      setProducoes([...novasProds, ...producoes]);
      setTextoCargaMassaProducao('');
      setModalAtivo(null);
      registrarAuditoria('Importação em Massa', 'Produções', `Importou ${novasProds.length} produções científicas.`);
      alert(`Sucesso! ${novasProds.length} produções foram adicionadas à base.`);
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
    alert(`Sucesso! ${importados.length} registros foram somados cumulativamente.`);
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

  const anoAtual = '2026';
  const metaAtual = metasAnuais.find((m) => m.ano === anoAtual) || { ano: anoAtual, meta_artigos_produzidos: 10, meta_artigos_publicados: 6, meta_resumos: 10 };

  const artigosProduzidosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Periódico' && (p.ano_publicacao || anoAtual) === anoAtual).length;
  const artigosPublicadosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Periódico' && p.status === 'Publicado' && (p.ano_publicacao || anoAtual) === anoAtual).length;
  const resumosPublicadosAnoAtual = producoes.filter((p) => p.categoria_producao === 'Congresso' && p.status === 'Publicado' && (p.ano_publicacao || anoAtual) === anoAtual).length;

  const pctArtigosProduzidos = Math.min(Math.round((artigosProduzidosAnoAtual / (metaAtual.meta_artigos_produzidos || 1)) * 100), 100);
  const pctArtigosPublicados = Math.min(Math.round((artigosPublicadosAnoAtual / (metaAtual.meta_artigos_publicados || 1)) * 100), 100);
  const pctResumos = Math.min(Math.round((resumosPublicadosAnoAtual / (metaAtual.meta_resumos || 1)) * 100), 100);

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

  // FILTRAGEM DINÂMICA DAS DEMANDAS (STATUS, RESPONSÁVEL E BUSCA)
  const listaResponsaveisDemandas = Array.from(
    new Set(demandas.map((d) => d.responsavel_nome).filter(Boolean))
  );

  const demandasFiltradas = demandas.filter((d) => {
    const atendeStatus = filtroDemandaStatus === 'Todos' || d.status === filtroDemandaStatus;
    const atendeResponsavel = filtroDemandaResponsavel === 'Todos' || d.responsavel_nome === filtroDemandaResponsavel;
    const atendeBusca = termoBusca
      ? d.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        d.codigo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        d.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        d.responsavel_nome.toLowerCase().includes(termoBusca.toLowerCase())
      : true;

    return atendeStatus && atendeResponsavel && atendeBusca;
  });

  const demandasPendentes = demandasFiltradas.filter((d) => d.status !== 'Concluída');
  const demandasConcluidas = demandasFiltradas.filter((d) => d.status === 'Concluída');
  const demandasOrdenadas = [...demandasPendentes, ...demandasConcluidas];

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
        alert(`Erro ao excluir do Supabase: ${err.message || err}`);
      }
    }
  };

  const membrosAtivos = membros.filter((m) => m.situacao === 'Ativo');
  const membrosOutros = membros.filter((m) => m.situacao !== 'Ativo');
  const membrosOrdenados = [...membrosAtivos, ...membrosOutros];

  const abasDisponiveisChaves = [
    { key: 'membros', label: '2. Membros do GETECC' },
    { key: 'colaboradores', label: '3. Colaboradores & Publicações' },
    { key: 'projetos', label: '4. Projetos de Pesquisa' },
    { key: 'demandas', label: '5. Gestão de Demandas' },
    { key: 'pendencias', label: '6. Pendências e Prazos' },
    { key: 'producoes', label: '7. Produções Científicas' },
    { key: 'reunioes', label: '8. Encontros e Presença' },
    { key: 'patrimonio', label: '9. Patrimônio e Produtos' },
    { key: 'marketing', label: '10. Gestão de Marketing' },
    { key: 'financeiro', label: '11. Financeiro (Caixa & Taxas)' },
    { key: 'usuarios', label: '12. Usuários e Permissões' },
    { key: 'relatorios', label: '13. Relatórios e Exportação' },
    { key: 'configuracoes', label: '14. Configurações' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* 1. BARRA LATERAL INSTITUCIONAL FILTRADA POR PERMISSÃO */}
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
              { id: 'colaboradores', label: '3. Colaboradores & Publicações', icon: '🌐', count: colaboradores.length + colaboradoresFinanceiros.length },
              { id: 'projetos', label: '4. Projetos de Pesquisa', icon: '🔬', count: projetos.length },
              { id: 'demandas', label: '5. Gestão de Demandas', icon: '📋', count: demandasPendentes.length },
              { id: 'pendencias', label: '6. Pendências & Prazos', icon: '⚠️', count: demandasPendentes.length },
              { id: 'producoes', label: '7. Produções Científicas', icon: '📈', count: producoes.length },
              { id: 'reunioes', label: '8. Encontros & Presença', icon: '📅', count: reunioes.length },
              { id: 'patrimonio', label: '9. Patrimônio & Produtos', icon: '📦', count: patrimonio.length },
              { id: 'marketing', label: '10. Gestão de Marketing', icon: '📣', count: marketing.length },
              { id: 'financeiro', label: '11. Financeiro (Caixa & Taxas)', icon: '💰' },
              { id: 'usuarios', label: '12. Usuários & Permissões', icon: '🛡️', count: usuarios.length },
              { id: 'relatorios', label: '13. Relatórios & Exportação', icon: '📄' },
              { id: 'configuracoes', label: '14. Configurações', icon: '⚙️' },
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

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="bg-white border-b border-slate-300 px-6 py-3 flex items-center justify-between shadow-sm">
          <input
            type="text"
            placeholder="Pesquisar registros..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="text-xs px-3.5 py-2 rounded border border-slate-300 bg-slate-50 text-slate-900 font-black w-full max-w-xs"
          />
          <button onClick={() => window.print()} className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-black text-xs px-4 py-2 rounded border border-slate-400">
            🖨️ Imprimir Relatório
          </button>
        </header>

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">

          {/* CHECK GERAL DE ACESSO */}
          {moduloAtivo !== 'painel' && !temPermissao(moduloAtivo, 'visualizar') ? (
            <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center space-y-2">
              <span className="text-3xl">🛑</span>
              <h2 className="text-red-700 font-black text-base">Acesso Restrito</h2>
              <p className="text-xs text-slate-700 font-bold">Você não possui permissão para visualizar este módulo. Solicite ao Administrador do GETECC.</p>
            </div>
          ) : (
            <>
              {/* ABA 1: PAINEL INICIAL */}
              {moduloAtivo === 'painel' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center">
                    <div>
                      <h1 className="text-xl font-black text-slate-900">Painel Geral de Gestão • GETECC</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">Visão executiva e administrativa de membros, pesquisas e produções científicas.</p>
                    </div>
                    {temPermissao('producoes', 'editar') && (
                      <button onClick={() => { setFormMetaAnual(metaAtual); setModalAtivo('cadastrarMeta'); }} className="mt-2 sm:mt-0 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-3.5 py-2 rounded">
                        ⚙️ Definir Meta Anual ({anoAtual})
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-black text-slate-900 text-xs flex items-center space-x-2">
                          <span>📝</span>
                          <span>Artigos Produzidos ({anoAtual})</span>
                        </h3>
                        <span className="bg-amber-100 text-amber-900 text-xs font-black px-2 py-0.5 rounded">
                          {pctArtigosProduzidos}% Atingido
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-slate-50 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Meta</p>
                          <p className="text-lg font-black text-slate-900">{metaAtual.meta_artigos_produzidos}</p>
                        </div>
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                          <p className="text-[9px] text-amber-800 font-bold uppercase">Produzidos</p>
                          <p className="text-lg font-black text-amber-800">{artigosProduzidosAnoAtual}</p>
                        </div>
                        <div className="p-2 bg-slate-100 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Faltam</p>
                          <p className="text-lg font-black text-slate-700">{Math.max(metaAtual.meta_artigos_produzidos - artigosProduzidosAnoAtual, 0)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border">
                          <div className="bg-amber-600 h-full rounded-full transition-all duration-500" style={{ width: `${pctArtigosProduzidos}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-black text-slate-900 text-xs flex items-center space-x-2">
                          <span>📰</span>
                          <span>Artigos Publicados ({anoAtual})</span>
                        </h3>
                        <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-2 py-0.5 rounded">
                          {pctArtigosPublicados}% Atingido
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-slate-50 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Meta</p>
                          <p className="text-lg font-black text-slate-900">{metaAtual.meta_artigos_publicados}</p>
                        </div>
                        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                          <p className="text-[9px] text-emerald-800 font-bold uppercase">Publicados</p>
                          <p className="text-lg font-black text-emerald-700">{artigosPublicadosAnoAtual}</p>
                        </div>
                        <div className="p-2 bg-slate-100 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Faltam</p>
                          <p className="text-lg font-black text-slate-700">{Math.max(metaAtual.meta_artigos_publicados - artigosPublicadosAnoAtual, 0)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border">
                          <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${pctArtigosPublicados}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <h3 className="font-black text-slate-900 text-xs flex items-center space-x-2">
                          <span>🎤</span>
                          <span>Resumos Congressos ({anoAtual})</span>
                        </h3>
                        <span className="bg-blue-100 text-blue-900 text-xs font-black px-2 py-0.5 rounded">
                          {pctResumos}% Atingido
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2 bg-slate-50 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Meta</p>
                          <p className="text-lg font-black text-slate-900">{metaAtual.meta_resumos}</p>
                        </div>
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-[9px] text-blue-800 font-bold uppercase">Aprovados</p>
                          <p className="text-lg font-black text-blue-700">{resumosPublicadosAnoAtual}</p>
                        </div>
                        <div className="p-2 bg-slate-100 border rounded">
                          <p className="text-[9px] text-slate-600 font-bold uppercase">Faltam</p>
                          <p className="text-lg font-black text-slate-700">{Math.max(metaAtual.meta_resumos - resumosPublicadosAnoAtual, 0)}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden p-0.5 border">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${pctResumos}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div onClick={() => temPermissao('membros', 'visualizar') && setModuloAtivo('membros')} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm cursor-pointer hover:border-red-500">
                      <p className="text-xs font-black text-slate-900 uppercase">Membros Ativos</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{membrosAtivos.length}</p>
                    </div>
                    <div onClick={() => temPermissao('projetos', 'visualizar') && setModuloAtivo('projetos')} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm cursor-pointer hover:border-red-500">
                      <p className="text-xs font-black text-slate-900 uppercase">Projetos de Pesquisa</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{projetos.length}</p>
                    </div>
                    <div onClick={() => temPermissao('demandas', 'visualizar') && setModuloAtivo('demandas')} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm cursor-pointer hover:border-red-500">
                      <p className="text-xs font-black text-red-700 uppercase">Demandas Pendentes</p>
                      <p className="text-3xl font-black text-red-700 mt-1">{demandasPendentes.length}</p>
                    </div>
                    <div onClick={() => temPermissao('producoes', 'visualizar') && setModuloAtivo('producoes')} className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm cursor-pointer hover:border-red-500">
                      <p className="text-xs font-black text-slate-900 uppercase">Total de Produções</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">{producoes.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 2: MEMBROS DO GETECC */}
              {moduloAtivo === 'membros' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Membros do GETECC</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">Ativos no topo. Registro completo de dados pessoais e histórico de ausências.</p>
                    </div>
                    {temPermissao('membros', 'editar') && (
                      <button onClick={() => { setFormMembro({ situacao: 'Ativo', categoria: 'Pesquisadores', historico_afastamentos: [] }); setModalAtivo('membro'); }} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                        + Cadastrar Integrante
                      </button>
                    )}
                  </div>

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
                          <p><strong>ORCID / Lattes:</strong> <a href={m.orcid_link} target="_blank" rel="noreferrer" className="text-red-700 underline">ORCID</a> • <a href={m.lattes_link} target="_blank" rel="noreferrer" className="text-red-700 underline">Lattes</a></p>
                          <p><strong>Ingresso:</strong> {m.data_ingresso} {m.data_desligamento && `| Desligamento: ${m.data_desligamento}`}</p>
                        </div>

                        <div className="pt-2 border-t border-slate-300 space-y-1">
                          <p className="text-[11px] font-black text-slate-900">Histórico de Ausências/Licenças ({m.historico_afastamentos?.length || 0}):</p>
                          {m.historico_afastamentos && m.historico_afastamentos.length > 0 ? (
                            m.historico_afastamentos.map((af) => (
                              <div key={af.id} className="bg-amber-50 p-1.5 rounded border border-amber-200 text-[10px] font-bold text-amber-900">
                                <strong>{af.tipo}:</strong> {af.data_inicio} até {af.data_fim} ({af.motivo})
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] text-slate-500 italic">Sem registros de ausência.</p>
                          )}
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
                      <button onClick={() => { setFormProjeto({ status: 'Em aberto', docentes: [], discentes: [], artigos_derivados: [], anexos: [] }); setFormDocentesTexto(''); setFormDiscentesTexto(''); setModalAtivo('projeto'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Novo Projeto</button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projetos.map((p) => (
                      <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-black text-slate-900 text-sm">{p.titulo}</h3>
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 text-[10px] font-black rounded">{p.status}</span>
                        </div>

                        <div className="text-xs space-y-1 font-bold text-slate-900">
                          <p><strong>Coordenador:</strong> {p.coordenador} | <strong>Linha:</strong> {p.linha_pesquisa}</p>
                          <p><strong>Docentes:</strong> {p.docentes?.join(', ') || 'Nenhum'}</p>
                          <p><strong>Discentes:</strong> {p.discentes?.join(', ') || 'Nenhum'}</p>
                          <p><strong>Parecer CEP:</strong> {p.parecer_cep || 'N/A'} | <strong>CAEE CEP:</strong> {p.caee_cep || 'N/A'}</p>
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

              {/* ABA 5: GESTÃO DE DEMANDAS (COM FILTROS POR STATUS E RESPONSÁVEL) */}
              {moduloAtivo === 'demandas' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-sm flex justify-between items-center">
                    <div>
                      <h1 className="text-lg font-black text-slate-900">Gestão de Demandas</h1>
                      <p className="text-xs text-slate-900 font-bold mt-1">Pendentes no topo, concluídas fixadas na parte inferior. Filtre por status ou responsável.</p>
                    </div>
                    {temPermissao('demandas', 'editar') && (
                      <button onClick={() => { setFormDemanda({ prioridade: 'Média', status: 'Em andamento', anexos: [] }); setModalAtivo('demanda'); }} className="bg-red-100 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">+ Cadastrar Demanda</button>
                    )}
                  </div>

                  {/* CAIXA DE FILTROS DA ABA DEMANDAS */}
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

                  <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                          <th className="p-3">Código / Título</th>
                          <th className="p-3">Responsável</th>
                          <th className="p-3">Prazo Final</th>
                          <th className="p-3">Prioridade</th>
                          <th className="p-3">Status</th>
                          {temPermissao('demandas', 'editar') && <th className="p-3 text-right">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {demandasOrdenadas.length > 0 ? (
                          demandasOrdenadas.map((d) => (
                            <tr key={d.id} className={d.status === 'Concluída' ? 'bg-slate-100 opacity-75' : 'hover:bg-slate-50'}>
                              <td className="p-3 font-bold text-slate-900">
                                <span className="font-mono text-red-700 font-black">{d.codigo}</span> - {d.titulo}
                                {d.descricao && <p className="text-[10px] text-slate-600 italic font-normal">{d.descricao}</p>}
                              </td>
                              <td className="p-3 font-bold text-slate-900">{d.responsavel_nome}</td>
                              <td className="p-3 font-bold text-slate-900">{d.prazo_final}</td>
                              <td className="p-3 font-black text-red-700">{d.prioridade}</td>
                              <td className="p-3 font-bold text-slate-900">{d.status}</td>
                              {temPermissao('demandas', 'editar') && (
                                <td className="p-3 text-right space-x-1">
                                  {d.status !== 'Concluída' && (
                                    <button onClick={async () => {
                                      const dAtualizada: Demanda = { ...d, status: 'Concluída' };
                                      try {
                                        const { error } = await supabase.from('demandas').upsert(dAtualizada);
                                        if (error) throw error;
                                        setDemandas(demandas.map((item) => (item.id === d.id ? dAtualizada : item)));
                                        registrarAuditoria('Conclusão Demanda', 'Demandas', `Demanda ${d.codigo} concluída`);
                                      } catch (err: any) {
                                        alert(`Erro ao atualizar demanda: ${err.message || err}`);
                                      }
                                    }} className="bg-emerald-600 text-white font-black px-2 py-1 rounded">✓ Marcar Concluída</button>
                                  )}
                                  <button onClick={() => { setFormDemanda(d); setModalAtivo('demanda'); }} className="bg-slate-200 text-slate-900 font-black px-2 py-1 rounded border border-slate-400">Editar</button>
                                  <button onClick={() => handleExcluir('demandas', d.id)} className="bg-red-100 text-red-700 font-black px-2 py-1 rounded border border-red-300">Excluir</button>
                                </td>
                              )}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-4 text-center text-slate-900 font-bold italic">Nenhuma demanda encontrada com os filtros selecionados.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
                          <button onClick={async () => {
                            const dAtualizada: Demanda = { ...d, status: 'Concluída' };
                            try {
                              const { error } = await supabase.from('demandas').upsert(dAtualizada);
                              if (error) throw error;
                              setDemandas(demandas.map((item) => (item.id === d.id ? dAtualizada : item)));
                              registrarAuditoria('Conclusão Demanda', 'Pendências', `Demanda ${d.codigo} resolvida`);
                            } catch (err: any) {
                              alert(`Erro ao resolver demanda: ${err.message || err}`);
                            }
                          }} className="bg-emerald-600 text-white font-black px-3 py-1.5 rounded">
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
                      <p className="text-xs text-slate-900 font-bold mt-0.5">Separado em Artigos vs. Congressos com listagem por evento e upload XLS/CSV/Word.</p>
                    </div>
                    {temPermissao('producoes', 'editar') && (
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => { setFormMetaAnual(metaAtual); setModalAtivo('cadastrarMeta'); }} className="bg-amber-100 text-amber-900 border border-amber-300 font-black text-xs px-3 py-2 rounded">
                          ⚙️ Cadastrar Meta Anual
                        </button>
                        <button onClick={() => setModalAtivo('cargaMassaProducao')} className="bg-slate-200 hover:bg-slate-300 text-slate-900 border border-slate-400 font-black text-xs px-3 py-2 rounded">
                          📥 Importar Arquivo em Massa
                        </button>
                        <button onClick={() => { setFormProducao({ categoria_producao: 'Periódico', status: 'Publicado', ano_publicacao: '2026' }); setModalAtivo('producao'); }} className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                          + Cadastrar Produção
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-5 rounded-lg border border-slate-300 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h3 className="font-black text-slate-900 text-sm flex items-center space-x-2">
                        <span>📰</span>
                        <span>Lista de Artigos em Periódicos Científicos</span>
                      </h3>
                      <span className="bg-red-100 text-red-800 text-xs font-black px-2 py-0.5 rounded">
                        Total: {producoes.filter((p) => p.categoria_producao === 'Periódico').length}
                      </span>
                    </div>

                    <div className="rounded border border-slate-300 overflow-hidden">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-900 font-black border-b border-slate-300">
                            <th className="p-3">Título do Artigo</th>
                            <th className="p-3">Revista / Periódico</th>
                            <th className="p-3">Autor Principal & Coautores</th>
                            <th className="p-3">Ano</th>
                            <th className="p-3">Qualis / DOI</th>
                            <th className="p-3">Status</th>
                            {temPermissao('producoes', 'editar') && <th className="p-3 text-right">Ações</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {producoes.filter((p) => p.categoria_producao === 'Periódico').map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50">
                              <td className="p-3 font-black text-slate-900 max-w-xs">{p.titulo}</td>
                              <td className="p-3 font-bold text-slate-900">{p.evento_ou_revista}</td>
                              <td className="p-3 font-bold text-slate-900">
                                <p><strong className="text-red-700">Autor:</strong> {p.autor_principal}</p>
                                <p className="text-[10px] text-slate-900"><strong>Coautores:</strong> {p.coautores || 'Nenhum'}</p>
                              </td>
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
                        <button onClick={() => { setFormProducao({ categoria_producao: 'Congresso', status: 'Publicado', ano_publicacao: '2026' }); setModalAtivo('producao'); }} className="bg-slate-200 text-slate-900 font-black text-xs px-3 py-1 rounded border border-slate-400">
                          + Adicionar Trabalho
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      {Object.keys(congressosAgrupados).length > 0 ? (
                        Object.entries(congressosAgrupados).map(([eventoNome, listaProds], idx) => (
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
                            className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs px-4 py-2.5 rounded shadow-sm flex items-center space-x-1"
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

              {/* ABA 13: RELATÓRIOS E EXPORTAÇÃO */}
              {moduloAtivo === 'relatorios' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-sm space-y-4">
                    <div className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h1 className="text-lg font-black text-slate-900">Gerador de Relatórios & Base Acumulativa</h1>
                        <p className="text-xs text-slate-900 font-bold mt-0.5">Suba arquivos em Word, Excel (.xls), CSV ou cole o texto.</p>
                      </div>
                      <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1 rounded border border-emerald-300">
                        ✓ Base Acumulada: {baseImportadaEventos.length} registros
                      </span>
                    </div>

                    {temPermissao('relatorios', 'editar') && (
                      <>
                        <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-2">
                          <label className="block font-black text-xs text-slate-900">📤 Selecionar Arquivo (.csv, .xls, .doc, .txt):</label>
                          <input
                            type="file"
                            accept=".csv, .xls, .xlsx, .doc, .docx, .txt"
                            onChange={(e) => handleProcessarArquivoEmMassa(e, 'relatorios')}
                            className="w-full text-xs font-bold text-slate-900"
                          />
                        </div>

                        <form onSubmit={handleProcessarBaseRelatorioCumulativa} className="space-y-3">
                          <textarea
                            rows={4}
                            required
                            value={textoCSVRelatorio}
                            onChange={(e) => setTextoCSVRelatorio(e.target.value)}
                            placeholder="Formato: Congresso ou Revista ; Autor Principal ; Título ; Coautores ; Ano"
                            className="w-full border p-2 rounded text-xs font-mono font-bold text-slate-900"
                          />
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-slate-900 font-bold">Importação cumulativa mantendo todo o histórico.</span>
                            <button type="submit" className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black text-xs px-4 py-2 rounded">
                              + Somar Dados
                            </button>
                          </div>
                        </form>
                      </>
                    )}
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

      {/* ========================================== */}
      {/* MODAIS DO SISTEMA */}
      {/* ========================================== */}

      {/* MODAL 1: CADASTRAR / EDITAR MEMBRO */}
      {modalAtivo === 'membro' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 space-y-4 border border-slate-300 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formMembro.id ? 'Editar Integrante' : 'Cadastrar Integrante do GETECC'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novo: Membro = {
                id: formMembro.id || String(Date.now()),
                matricula: formMembro.matricula || `GET-2026-${Math.floor(10 + Math.random() * 90)}`,
                nome_completo: formMembro.nome_completo || '',
                cpf: formMembro.cpf || '',
                email_institucional: formMembro.email_institucional || '',
                email_alternativo: formMembro.email_alternativo,
                instagram: formMembro.instagram,
                orcid_link: formMembro.orcid_link,
                lattes_link: formMembro.lattes_link,
                endereco: formMembro.endereco,
                financiamento: formMembro.financiamento,
                telefone: formMembro.telefone,
                curso_formacao: formMembro.curso_formacao || '',
                instituicao: formMembro.instituicao || 'GETECC',
                categoria: formMembro.categoria as any || 'Pesquisadores',
                funcao_cargo: formMembro.funcao_cargo || 'Membro',
                data_ingresso: formMembro.data_ingresso || new Date().toISOString().split('T')[0],
                data_desligamento: formMembro.data_desligamento,
                situacao: formMembro.data_desligamento ? 'Desligado' : (formMembro.situacao as any || 'Ativo'),
                historico_afastamentos: formMembro.historico_afastamentos || [],
              };

              try {
                const { error } = await supabase.from('membros').upsert(novo);
                if (error) throw error;

                if (formMembro.id) setMembros(membros.map((m) => (m.id === formMembro.id ? novo : m)));
                else setMembros([...membros, novo]);
                setModalAtivo(null);
                registrarAuditoria(formMembro.id ? 'Edição Membro' : 'Cadastro Membro', 'Membros', `Membro ${novo.nome_completo} salvo`);
              } catch (err: any) {
                alert(`Erro ao salvar membro no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Matrícula</label>
                  <input type="text" required value={formMembro.matricula || ''} onChange={(e) => setFormMembro({ ...formMembro, matricula: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Nome Completo</label>
                  <input type="text" required value={formMembro.nome_completo || ''} onChange={(e) => setFormMembro({ ...formMembro, nome_completo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">CPF</label>
                  <input type="text" required value={formMembro.cpf || ''} onChange={(e) => setFormMembro({ ...formMembro, cpf: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">E-mail Institucional</label>
                  <input type="email" required value={formMembro.email_institucional || ''} onChange={(e) => setFormMembro({ ...formMembro, email_institucional: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">E-mail Alternativo</label>
                  <input type="email" value={formMembro.email_alternativo || ''} onChange={(e) => setFormMembro({ ...formMembro, email_alternativo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Curso / Formação</label>
                  <input type="text" required value={formMembro.curso_formacao || ''} onChange={(e) => setFormMembro({ ...formMembro, curso_formacao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Instituição</label>
                  <input type="text" required value={formMembro.instituicao || ''} onChange={(e) => setFormMembro({ ...formMembro, instituicao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Categoria</label>
                  <select value={formMembro.categoria || 'Pesquisadores'} onChange={(e) => setFormMembro({ ...formMembro, categoria: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Coordenação</option>
                    <option>Diretoria</option>
                    <option>Pesquisadores</option>
                    <option>Estudantes</option>
                    <option>Egressos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Instagram</label>
                  <input type="text" value={formMembro.instagram || ''} onChange={(e) => setFormMembro({ ...formMembro, instagram: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">ORCID (Link)</label>
                  <input type="text" value={formMembro.orcid_link || ''} onChange={(e) => setFormMembro({ ...formMembro, orcid_link: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Lattes (Link)</label>
                  <input type="text" value={formMembro.lattes_link || ''} onChange={(e) => setFormMembro({ ...formMembro, lattes_link: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Foto do Integrante (Arquivo)</label>
                  <input type="file" accept="image/*" onChange={handleUploadFotoMembro} className="w-full font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Cargo / Função</label>
                  <input type="text" required value={formMembro.funcao_cargo || ''} onChange={(e) => setFormMembro({ ...formMembro, funcao_cargo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Data de Ingresso</label>
                  <input type="date" required value={formMembro.data_ingresso || ''} onChange={(e) => setFormMembro({ ...formMembro, data_ingresso: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Data de Desligamento</label>
                  <input type="date" value={formMembro.data_desligamento || ''} onChange={(e) => setFormMembro({ ...formMembro, data_desligamento: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded text-slate-900 font-black">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 font-black rounded">Salvar Integrante</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: AFASTAMENTO / LICENÇA */}
      {modalAtivo === 'afastamento' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">Registrar Licença / Afastamento</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novoAf: RegistroAfastamento = {
                id: String(Date.now()),
                tipo: formAfastamento.tipo || 'Licença Médica / Capacitação',
                data_inicio: formAfastamento.data_inicio || new Date().toISOString().split('T')[0],
                data_fim: formAfastamento.data_fim || new Date().toISOString().split('T')[0],
                motivo: formAfastamento.motivo || '',
              };
              const membroAtualizado: Membro = {
                ...(formMembro as Membro),
                situacao: 'Em Afastamento/Licença',
                historico_afastamentos: [...(formMembro.historico_afastamentos || []), novoAf],
              };

              try {
                const { error } = await supabase.from('membros').upsert(membroAtualizado);
                if (error) throw error;

                setMembros(membros.map((m) => (m.id === membroAtualizado.id ? membroAtualizado : m)));
                setModalAtivo(null);
                registrarAuditoria('Licença Membro', 'Membros', `Licença para ${membroAtualizado.nome_completo} gravada`);
              } catch (err: any) {
                alert(`Erro ao salvar licença no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Tipo de Licença / Afastamento</label>
                <input type="text" required value={formAfastamento.tipo || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, tipo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Início</label>
                  <input type="date" required value={formAfastamento.data_inicio || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, data_inicio: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Término Previsto</label>
                  <input type="date" required value={formAfastamento.data_fim || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, data_fim: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Motivo / Detalhes</label>
                <textarea rows={2} required value={formAfastamento.motivo || ''} onChange={(e) => setFormAfastamento({ ...formAfastamento, motivo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-amber-100 text-amber-900 border border-amber-300 font-black rounded">Salvar Afastamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COLABORADOR EXTERNO */}
      {modalAtivo === 'colaborador' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formColaborador.id ? 'Editar Colaborador' : 'Cadastrar Colaborador Externo'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novo: ColaboradorExterno = {
                id: formColaborador.id || String(Date.now()),
                nome: formColaborador.nome || '',
                cpf: formColaborador.cpf || '',
                titulacao: formColaborador.titulacao as any || 'Doutor',
                email: formColaborador.email || '',
                orcid: formColaborador.orcid || '',
                numero_conselho: formColaborador.numero_conselho || '',
                afiliacao: formColaborador.afiliacao || '',
              };

              try {
                const { error } = await supabase.from('colaboradores').upsert(novo);
                if (error) throw error;

                if (formColaborador.id) setColaboradores(colaboradores.map((c) => (c.id === formColaborador.id ? novo : c)));
                else setColaboradores([...colaboradores, novo]);
                setModalAtivo(null);
                registrarAuditoria(formColaborador.id ? 'Edição Colaborador' : 'Cadastro Colaborador', 'Colaboradores', `Colaborador ${novo.nome} salvo`);
              } catch (err: any) {
                alert(`Erro ao salvar colaborador no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nome Completo</label>
                <input type="text" required value={formColaborador.nome || ''} onChange={(e) => setFormColaborador({ ...formColaborador, nome: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">CPF</label>
                  <input type="text" required value={formColaborador.cpf || ''} onChange={(e) => setFormColaborador({ ...formColaborador, cpf: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">ORCID</label>
                  <input type="text" value={formColaborador.orcid || ''} onChange={(e) => setFormColaborador({ ...formColaborador, orcid: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="0000-0000-0000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Titulação</label>
                  <select value={formColaborador.titulacao || 'Doutor'} onChange={(e) => setFormColaborador({ ...formColaborador, titulacao: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Especialista</option>
                    <option>Mestre</option>
                    <option>Doutor</option>
                    <option>Pós-Doutor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Nº Conselho (CRM/COREN)</label>
                  <input type="text" value={formColaborador.numero_conselho || ''} onChange={(e) => setFormColaborador({ ...formColaborador, numero_conselho: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">E-mail</label>
                <input type="email" required value={formColaborador.email || ''} onChange={(e) => setFormColaborador({ ...formColaborador, email: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Afiliação Institucional</label>
                <input type="text" required value={formColaborador.afiliacao || ''} onChange={(e) => setFormColaborador({ ...formColaborador, afiliacao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Colaborador</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: COLABORADOR FINANCEIRO & PUBLICAÇÃO */}
      {modalAtivo === 'colaboradorFinanceiro' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formColaboradorFinanceiro.id ? 'Editar Colaborador / Publicação' : 'Cadastrar Colaborador & Publicação'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novo: ColaboradorFinanceiro = {
                id: formColaboradorFinanceiro.id || String(Date.now()),
                nome: formColaboradorFinanceiro.nome || '',
                cpf: formColaboradorFinanceiro.cpf || '',
                titulacao: formColaboradorFinanceiro.titulacao as any || 'Doutor',
                email: formColaboradorFinanceiro.email || '',
                orcid: formColaboradorFinanceiro.orcid || '',
                numero_conselho: formColaboradorFinanceiro.numero_conselho || '',
                afiliacao: formColaboradorFinanceiro.afiliacao || '',
                evento_ou_artigo: formColaboradorFinanceiro.evento_ou_artigo || '',
                valor_pago: formColaboradorFinanceiro.valor_pago || 'R$ 0,00',
                status_publicacao: formColaboradorFinanceiro.status_publicacao as any || 'Em análise',
                data_registro: formColaboradorFinanceiro.data_registro || new Date().toISOString().split('T')[0],
              };

              try {
                const { error } = await supabase.from('colaboradores_financeiros').upsert(novo);
                if (error) throw error;

                if (formColaboradorFinanceiro.id) setColaboradoresFinanceiros(colaboradoresFinanceiros.map((c) => (c.id === formColaboradorFinanceiro.id ? novo : c)));
                else setColaboradoresFinanceiros([...colaboradoresFinanceiros, novo]);
                setModalAtivo(null);
                registrarAuditoria(formColaboradorFinanceiro.id ? 'Edição Colaborador Fin.' : 'Cadastro Colaborador Fin.', 'Colaboradores', `Colaborador financeiro ${novo.nome} salvo`);
              } catch (err: any) {
                alert(`Erro ao salvar no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nome Completo</label>
                <input type="text" required value={formColaboradorFinanceiro.nome || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, nome: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">CPF</label>
                  <input type="text" required value={formColaboradorFinanceiro.cpf || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, cpf: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="000.000.000-00" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">ORCID</label>
                  <input type="text" value={formColaboradorFinanceiro.orcid || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, orcid: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="0000-0000-0000-0000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Titulação</label>
                  <select value={formColaboradorFinanceiro.titulacao || 'Doutor'} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, titulacao: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Especialista</option>
                    <option>Mestre</option>
                    <option>Doutor</option>
                    <option>Pós-Doutor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">E-mail</label>
                  <input type="email" required value={formColaboradorFinanceiro.email || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, email: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Evento ou Artigo Adquirido</label>
                <input type="text" required value={formColaboradorFinanceiro.evento_ou_artigo || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, evento_ou_artigo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Valor Pago (Entra no Caixa)</label>
                  <input type="text" value={formColaboradorFinanceiro.valor_pago || ''} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, valor_pago: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Ex: R$ 250,00" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Status da Publicação</label>
                  <select value={formColaboradorFinanceiro.status_publicacao || 'Em análise'} onChange={(e) => setFormColaboradorFinanceiro({ ...formColaboradorFinanceiro, status_publicacao: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option value="Em análise">Em análise</option>
                    <option value="Aprovada">Aprovada (Coautoria Devida)</option>
                    <option value="Reprovada">Reprovada</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PROJETO DE PESQUISA */}
      {modalAtivo === 'projeto' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-5 space-y-4 border border-slate-300 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formProjeto.id ? 'Editar Projeto de Pesquisa' : 'Cadastrar Projeto de Pesquisa'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novo: ProjetoPesquisa = {
                id: formProjeto.id || String(Date.now()),
                titulo: formProjeto.titulo || '',
                coordenador: formProjeto.coordenador || '',
                linha_pesquisa: formProjeto.linha_pesquisa || '',
                docentes: formDocentesTexto ? formDocentesTexto.split(',').map((s) => s.trim()) : [],
                discentes: formDiscentesTexto ? formDiscentesTexto.split(',').map((s) => s.trim()) : [],
                parecer_cep: formProjeto.parecer_cep || 'Não se aplica',
                caee_cep: formProjeto.caee_cep || 'Não se aplica',
                financiamento: formProjeto.financiamento || 'Não se aplica',
                observacoes: formProjeto.observacoes || '',
                status: formProjeto.status as any || 'Em aberto',
                artigos_derivados: formProjeto.artigos_derivados || [],
                anexos: formProjeto.anexos || [],
              };

              try {
                const { error } = await supabase.from('projetos').upsert(novo);
                if (error) throw error;

                if (formProjeto.id) setProjetos(projetos.map((p) => (p.id === formProjeto.id ? novo : p)));
                else setProjetos([...projetos, novo]);
                setModalAtivo(null);
                registrarAuditoria(formProjeto.id ? 'Edição Projeto' : 'Cadastro Projeto', 'Projetos', `Projeto ${novo.titulo} salvo`);
              } catch (err: any) {
                alert(`Erro ao salvar projeto no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Título do Projeto</label>
                <input type="text" required value={formProjeto.titulo || ''} onChange={(e) => setFormProjeto({ ...formProjeto, titulo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Coordenador</label>
                  <input type="text" required value={formProjeto.coordenador || ''} onChange={(e) => setFormProjeto({ ...formProjeto, coordenador: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Status</label>
                  <select value={formProjeto.status || 'Em aberto'} onChange={(e) => setFormProjeto({ ...formProjeto, status: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Em aberto</option>
                    <option>Submetido</option>
                    <option>Cadastrado</option>
                    <option>Em execução</option>
                    <option>Concluído</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Linha de Pesquisa</label>
                <input type="text" required value={formProjeto.linha_pesquisa || ''} onChange={(e) => setFormProjeto({ ...formProjeto, linha_pesquisa: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Docentes Envolvidos</label>
                  <input type="text" value={formDocentesTexto} onChange={(e) => setFormDocentesTexto(e.target.value)} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Ex: Profa. Isabelle, Prof. Sérgio" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Discentes Envolvidos</label>
                  <input type="text" value={formDiscentesTexto} onChange={(e) => setFormDiscentesTexto(e.target.value)} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Ex: Lucas Silva, Maria Santos" />
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded border border-red-200 space-y-2">
                <p className="font-black text-red-800">+ Cadastrar Artigo Derivado deste Projeto:</p>
                <input type="text" placeholder="Título do Artigo Derivado" value={formArtigoDerivado.titulo || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, titulo: e.target.value })} className="w-full border p-1.5 rounded font-bold text-slate-900" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Revista" value={formArtigoDerivado.revista || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, revista: e.target.value })} className="w-full border p-1.5 rounded font-bold text-slate-900" />
                  <input type="text" placeholder="Qualis/JCR/Cite" value={formArtigoDerivado.qualis_jcr_cite || ''} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, qualis_jcr_cite: e.target.value })} className="w-full border p-1.5 rounded font-bold text-slate-900" />
                </div>
                <div className="flex justify-between items-center">
                  <select value={formArtigoDerivado.status || 'em produção'} onChange={(e) => setFormArtigoDerivado({ ...formArtigoDerivado, status: e.target.value as any })} className="border p-1.5 rounded font-bold text-slate-900">
                    <option value="em produção">em produção</option>
                    <option value="publicado">publicado</option>
                    <option value="em revisão">em revisão</option>
                  </select>
                  <button type="button" onClick={() => {
                    if (!formArtigoDerivado.titulo) return;
                    const art: ArtigoDerivado = {
                      id: String(Date.now()),
                      titulo: formArtigoDerivado.titulo || '',
                      revista: formArtigoDerivado.revista || '',
                      qualis_jcr_cite: formArtigoDerivado.qualis_jcr_cite || '',
                      status: formArtigoDerivado.status as any || 'em produção',
                      anexos: formArtigoDerivado.anexos || [],
                    };
                    setFormProjeto({ ...formProjeto, artigos_derivados: [...(formProjeto.artigos_derivados || []), art] });
                    setFormArtigoDerivado({ status: 'em produção', anexos: [] });
                  }} className="bg-red-700 text-white font-black px-3 py-1 rounded">Incluir Artigo</button>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Projeto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: DEMANDA */}
      {modalAtivo === 'demanda' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formDemanda.id ? 'Editar Demanda' : 'Cadastrar Demanda'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nova: Demanda = {
                id: formDemanda.id || String(Date.now()),
                codigo: formDemanda.codigo || `DEM-2026-${Math.floor(10 + Math.random() * 90)}`,
                titulo: formDemanda.titulo || '',
                descricao: formDemanda.descricao || '',
                responsavel_nome: formDemanda.responsavel_nome || '',
                prazo_final: formDemanda.prazo_final || new Date().toISOString().split('T')[0],
                prioridade: formDemanda.prioridade as any || 'Média',
                status: formDemanda.status as any || 'Em andamento',
                anexos: formDemanda.anexos || [],
              };

              try {
                const { error } = await supabase.from('demandas').upsert(nova);
                if (error) throw error;

                if (formDemanda.id) setDemandas(demandas.map((d) => (d.id === formDemanda.id ? nova : d)));
                else setDemandas([nova, ...demandas]);
                setModalAtivo(null);
                registrarAuditoria(formDemanda.id ? 'Edição Demanda' : 'Cadastro Demanda', 'Demandas', `Demanda ${nova.codigo} salva`);
              } catch (err: any) {
                alert(`Erro ao salvar demanda no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Título da Demanda</label>
                <input type="text" required value={formDemanda.titulo || ''} onChange={(e) => setFormDemanda({ ...formDemanda, titulo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Responsável</label>
                  <input type="text" required value={formDemanda.responsavel_nome || ''} onChange={(e) => setFormDemanda({ ...formDemanda, responsavel_nome: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Prazo Final</label>
                  <input type="date" required value={formDemanda.prazo_final || ''} onChange={(e) => setFormDemanda({ ...formDemanda, prazo_final: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Prioridade</label>
                  <select value={formDemanda.prioridade || 'Média'} onChange={(e) => setFormDemanda({ ...formDemanda, prioridade: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Baixa</option>
                    <option>Média</option>
                    <option>Alta</option>
                    <option>Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Status</label>
                  <select value={formDemanda.status || 'Em andamento'} onChange={(e) => setFormDemanda({ ...formDemanda, status: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Não iniciada</option>
                    <option>Em andamento</option>
                    <option>Com pendências</option>
                    <option>Concluída</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Descrição</label>
                <textarea rows={2} required value={formDemanda.descricao || ''} onChange={(e) => setFormDemanda({ ...formDemanda, descricao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Demanda</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: PRODUÇÃO CIENTÍFICA */}
      {modalAtivo === 'producao' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 border border-slate-300 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formProducao.id ? 'Editar Produção' : 'Cadastrar Produção Científica'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nova: ProducaoCientifica = {
                id: formProducao.id || String(Date.now()),
                categoria_producao: formProducao.categoria_producao as any || 'Periódico',
                tipo_producao: formProducao.tipo_producao || 'Artigo Científico',
                titulo: formProducao.titulo || '',
                evento_ou_revista: formProducao.evento_ou_revista || '',
                autor_principal: formProducao.autor_principal || '',
                coautores: formProducao.coautores || '',
                ano_publicacao: formProducao.ano_publicacao || '2026',
                qualis_doi: formProducao.qualis_doi || '',
                status: formProducao.status as any || 'Publicado',
              };

              try {
                const { error } = await supabase.from('producoes').upsert(nova);
                if (error) throw error;

                if (formProducao.id) setProducoes(producoes.map((p) => (p.id === formProducao.id ? nova : p)));
                else setProducoes([nova, ...producoes]);
                setModalAtivo(null);
                registrarAuditoria(formProducao.id ? 'Edição Produção' : 'Cadastro Produção', 'Produções', `Produção ${nova.titulo} salva`);
              } catch (err: any) {
                alert(`Erro ao salvar produção no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Categoria de Publicação</label>
                  <select value={formProducao.categoria_producao || 'Periódico'} onChange={(e) => setFormProducao({ ...formProducao, categoria_producao: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option value="Periódico">📰 Artigo em Periódico</option>
                    <option value="Congresso">🎤 Resumo / Trabalho em Congresso</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Status</label>
                  <select value={formProducao.status || 'Publicado'} onChange={(e) => setFormProducao({ ...formProducao, status: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option value="Pendente Submissão">Pendente Submissão</option>
                    <option value="Submetido">Submetido</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Título do Trabalho</label>
                <input type="text" required value={formProducao.titulo || ''} onChange={(e) => setFormProducao({ ...formProducao, titulo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Tipo Específico</label>
                  <input type="text" required value={formProducao.tipo_producao || ''} onChange={(e) => setFormProducao({ ...formProducao, tipo_producao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Artigo, Resumo Expandido, etc." />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Periódico / Nome do Evento</label>
                  <input type="text" required value={formProducao.evento_ou_revista || ''} onChange={(e) => setFormProducao({ ...formProducao, evento_ou_revista: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Autor Principal</label>
                  <input type="text" required value={formProducao.autor_principal || ''} onChange={(e) => setFormProducao({ ...formProducao, autor_principal: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Coautores</label>
                  <input type="text" value={formProducao.coautores || ''} onChange={(e) => setFormProducao({ ...formProducao, coautores: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Separados por vírgula" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Ano de Publicação</label>
                  <input type="text" required value={formProducao.ano_publicacao || '2026'} onChange={(e) => setFormProducao({ ...formProducao, ano_publicacao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Qualis / DOI</label>
                  <input type="text" value={formProducao.qualis_doi || ''} onChange={(e) => setFormProducao({ ...formProducao, qualis_doi: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Produção</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: CARGA EM MASSA DE PRODUÇÕES */}
      {modalAtivo === 'cargaMassaProducao' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">📥 Importar Base de Produções em Massa (.xls, .csv, Word, .txt)</h3>
            <div className="bg-slate-50 p-3 rounded border space-y-2">
              <label className="block font-black text-slate-900">Carregar Arquivo Diretamente:</label>
              <input type="file" accept=".csv, .xls, .xlsx, .doc, .docx, .txt" onChange={(e) => handleProcessarArquivoEmMassa(e, 'producoes')} className="w-full font-bold text-slate-900" />
            </div>
            <form onSubmit={handleCargaMassaProducoes} className="space-y-3">
              <textarea
                rows={5}
                required
                value={textoCargaMassaProducao}
                onChange={(e) => setTextoCargaMassaProducao(e.target.value)}
                placeholder="Periódico; Artigo Científico; Manejo da PCR no Trauma; Revista Brasileira de Emergência; Sérgio Oliveira; Isabelle de Paula; 2026; 10.1016/abc; Publicado"
                className="w-full border p-2 rounded font-mono font-bold text-slate-900"
              />
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Importar para a Base</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 9: METAS ANUAIS */}
      {modalAtivo === 'cadastrarMeta' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">🎯 Cadastrar / Ajustar Metas Anuais</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const metaNova: MetaAnualProducao = {
                ano: formMetaAnual.ano || '2026',
                meta_artigos_produzidos: Number(formMetaAnual.meta_artigos_produzidos) || 1,
                meta_artigos_publicados: Number(formMetaAnual.meta_artigos_publicados) || 1,
                meta_resumos: Number(formMetaAnual.meta_resumos) || 1,
              };

              try {
                const { error } = await supabase.from('metas_anuais').upsert(metaNova);
                if (error) throw error;

                const existe = metasAnuais.some((m) => m.ano === metaNova.ano);
                if (existe) setMetasAnuais(metasAnuais.map((m) => (m.ano === metaNova.ano ? metaNova : m)));
                else setMetasAnuais([...metasAnuais, metaNova]);
                setModalAtivo(null);
                registrarAuditoria('Cadastro Meta', 'Painel', `Metas para o ano ${metaNova.ano} salvas`);
              } catch (err: any) {
                alert(`Erro ao salvar metas no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Ano de Referência</label>
                <input type="text" required value={formMetaAnual.ano || '2026'} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, ano: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Meta de Artigos Produzidos (Elaborados/Submetidos)</label>
                <input type="number" min={1} required value={formMetaAnual.meta_artigos_produzidos || 10} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_artigos_produzidos: Number(e.target.value) })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Meta de Artigos Publicados em Periódicos</label>
                <input type="number" min={1} required value={formMetaAnual.meta_artigos_publicados || 6} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_artigos_publicados: Number(e.target.value) })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Meta de Resumos em Congressos</label>
                <input type="number" min={1} required value={formMetaAnual.meta_resumos || 10} onChange={(e) => setFormMetaAnual({ ...formMetaAnual, meta_resumos: Number(e.target.value) })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Metas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 10: ENCONTROS & CHAMADA PRESENCIAL */}
      {modalAtivo === 'reuniao' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-5 space-y-4 border border-slate-300 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">Cadastrar Encontro & Chamada Presencial</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nova: ReuniaoCientifica = {
                id: String(Date.now()),
                titulo: formReuniao.titulo || 'Encontro Científico',
                data: formReuniao.data || new Date().toISOString().split('T')[0],
                horario: formReuniao.horario || '18:00',
                pauta: formReuniao.pauta || '',
                presencas: membrosAtivos.map((m) => ({ membro_id: m.id, membro_nome: m.nome_completo, status: presencasChamada[m.id] || 'falta' })),
              };

              try {
                const { error } = await supabase.from('reunioes').upsert(nova);
                if (error) throw error;

                setReunioes([nova, ...reunioes]);
                setModalAtivo(null);
                registrarAuditoria('Cadastro Reunião', 'Reuniões', `Reunião ${nova.titulo} salva`);
              } catch (err: any) {
                alert(`Erro ao salvar reunião no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <input type="text" placeholder="Nome do Encontro" required value={formReuniao.titulo || ''} onChange={(e) => setFormReuniao({ ...formReuniao, titulo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              <input type="text" placeholder="Horário (ex: 18:00 - 20:00)" value={formReuniao.horario || ''} onChange={(e) => setFormReuniao({ ...formReuniao, horario: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              <input type="text" placeholder="Pauta" value={formReuniao.pauta || ''} onChange={(e) => setFormReuniao({ ...formReuniao, pauta: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              
              <div className="space-y-1 pt-2 border-t">
                <p className="font-black text-slate-900">Chamada Presencial (Membros Ativos):</p>
                {membrosAtivos.map((m) => (
                  <div key={m.id} className="flex justify-between items-center bg-slate-100 p-2 rounded border">
                    <span className="font-bold text-slate-900">{m.nome_completo}</span>
                    <div className="space-x-1">
                      <button type="button" onClick={() => setPresencasChamada({ ...presencasChamada, [m.id]: 'presente' })} className={`px-2 py-1 rounded text-[10px] font-black ${presencasChamada[m.id] === 'presente' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-900'}`}>Presença</button>
                      <button type="button" onClick={() => setPresencasChamada({ ...presencasChamada, [m.id]: 'falta' })} className={`px-2 py-1 rounded text-[10px] font-black ${presencasChamada[m.id] === 'falta' ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-900'}`}>Falta</button>
                      <button type="button" onClick={() => setPresencasChamada({ ...presencasChamada, [m.id]: 'falta_justificada' })} className={`px-2 py-1 rounded text-[10px] font-black ${presencasChamada[m.id] === 'falta_justificada' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-900'}`}>Justificada</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded text-slate-900 font-black">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 font-black rounded border border-red-300">Salvar Encontro</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 11: PATRIMÔNIO / PRODUTOS */}
      {modalAtivo === 'patrimonio' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formPatrimonio.id ? 'Editar Item' : 'Cadastrar Patrimônio ou Produto'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const novo: PatrimonioProduto = {
                id: formPatrimonio.id || String(Date.now()),
                nome: formPatrimonio.nome || '',
                descricao: formPatrimonio.descricao || '',
                quantidade: Number(formPatrimonio.quantidade) || 1,
                foto_dataurl: formPatrimonio.foto_dataurl,
                estado_conservacao: formPatrimonio.estado_conservacao as any || 'Excelente',
                responsavel: formPatrimonio.responsavel || 'GETECC',
              };

              try {
                const { error } = await supabase.from('patrimonio').upsert(novo);
                if (error) throw error;

                if (formPatrimonio.id) setPatrimonio(patrimonio.map((p) => (p.id === formPatrimonio.id ? novo : p)));
                else setPatrimonio([novo, ...patrimonio]);
                setModalAtivo(null);
                registrarAuditoria(formPatrimonio.id ? 'Edição Patrimônio' : 'Cadastro Patrimônio', 'Patrimônio', `Item ${novo.nome} salvo`);
              } catch (err: any) {
                alert(`Erro ao salvar patrimônio no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nome do Item</label>
                <input type="text" required value={formPatrimonio.nome || ''} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, nome: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Quantidade</label>
                  <input type="number" min={1} required value={formPatrimonio.quantidade || 1} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, quantidade: Number(e.target.value) })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Foto do Item</label>
                  <input type="file" accept="image/*" onChange={handleUploadFotoPatrimonio} className="w-full font-bold text-slate-900" />
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Estado de Conservação</label>
                <select value={formPatrimonio.estado_conservacao || 'Excelente'} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, estado_conservacao: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                  <option>Excelente</option>
                  <option>Bom</option>
                  <option>Regular</option>
                  <option>Danificado</option>
                </select>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Descrição</label>
                <textarea rows={2} required value={formPatrimonio.descricao || ''} onChange={(e) => setFormPatrimonio({ ...formPatrimonio, descricao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 12: MARKETING */}
      {modalAtivo === 'marketing' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formMarketing.id ? 'Editar Ação' : 'Cadastrar Ação de Marketing'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nova: MarketingItem = {
                id: formMarketing.id || String(Date.now()),
                titulo: formMarketing.titulo || '',
                canal: formMarketing.canal as any || 'Instagram',
                responsavel: formMarketing.responsavel || '',
                data_prevista: formMarketing.data_prevista || new Date().toISOString().split('T')[0],
                status: formMarketing.status as any || 'Ideia',
                legenda: formMarketing.legenda || '',
                artes: formMarketing.artes || [],
              };

              try {
                const { error } = await supabase.from('marketing').upsert(nova);
                if (error) throw error;

                if (formMarketing.id) setMarketing(marketing.map((m) => (m.id === formMarketing.id ? nova : m)));
                else setMarketing([nova, ...marketing]);
                setModalAtivo(null);
                registrarAuditoria(formMarketing.id ? 'Edição Marketing' : 'Cadastro Marketing', 'Marketing', `Ação ${nova.titulo} salva`);
              } catch (err: any) {
                alert(`Erro ao salvar marketing no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Título da Ação</label>
                <input type="text" required value={formMarketing.titulo || ''} onChange={(e) => setFormMarketing({ ...formMarketing, titulo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Canal</label>
                  <select value={formMarketing.canal || 'Instagram'} onChange={(e) => setFormMarketing({ ...formMarketing, canal: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Instagram</option>
                    <option>Site / Portal</option>
                    <option>E-mail Marketing</option>
                    <option>Evento</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Data Prevista</label>
                  <input type="date" required value={formMarketing.data_prevista || ''} onChange={(e) => setFormMarketing({ ...formMarketing, data_prevista: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Responsável</label>
                  <input type="text" required value={formMarketing.responsavel || ''} onChange={(e) => setFormMarketing({ ...formMarketing, responsavel: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Status</label>
                  <select value={formMarketing.status || 'Ideia'} onChange={(e) => setFormMarketing({ ...formMarketing, status: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Ideia</option>
                    <option>Em Produção</option>
                    <option>Aprovado</option>
                    <option>Publicado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-black text-slate-900 mb-1">Texto / Legenda</label>
                <textarea rows={2} value={formMarketing.legenda || ''} onChange={(e) => setFormMarketing({ ...formMarketing, legenda: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Ação</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 13: LANÇAR MOVIMENTAÇÃO DE CAIXA */}
      {modalAtivo === 'movimentacao' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">➕ Cadastrar Lançamento de Caixa</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const nova: MovimentacaoFinanceira = {
                id: String(Date.now()),
                descricao: formMovimentacao.descricao || 'Lançamento Manual',
                valor: Number(formMovimentacao.valor) || 0,
                tipo: formMovimentacao.tipo as any || 'Entrada',
                categoria: formMovimentacao.categoria as any || 'Outros',
                data: formMovimentacao.data || new Date().toISOString().split('T')[0],
                observacoes: formMovimentacao.observacoes || '',
              };

              try {
                const { error } = await supabase.from('movimentacoes').upsert(nova);
                if (error) throw error;

                setMovimentacoes([nova, ...movimentacoes]);
                setModalAtivo(null);
                registrarAuditoria('Lançamento Caixa', 'Financeiro', `Registrou ${nova.tipo} de R$ ${nova.valor} (${nova.descricao})`);
              } catch (err: any) {
                alert(`Erro ao salvar lançamento no Supabase: ${err.message || err}`);
              }
            }} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Descrição do Lançamento</label>
                <input type="text" required value={formMovimentacao.descricao || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, descricao: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Ex: Compra de crachás para evento" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Tipo de Operação</label>
                  <select value={formMovimentacao.tipo || 'Entrada'} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, tipo: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option value="Entrada">Entrada (+ Receita)</option>
                    <option value="Saída">Saída (- Despesa)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Valor (R$)</label>
                  <input type="number" step="0.01" min={0.01} required value={formMovimentacao.valor || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, valor: Number(e.target.value) })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="0.00" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Categoria</label>
                  <select value={formMovimentacao.categoria || 'Outros'} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, categoria: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
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
                  <label className="block font-black text-slate-900 mb-1">Data da Operação</label>
                  <input type="date" required value={formMovimentacao.data || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, data: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-900 mb-1">Observações / Comprovante</label>
                <textarea rows={2} value={formMovimentacao.observacoes || ''} onChange={(e) => setFormMovimentacao({ ...formMovimentacao, observacoes: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" placeholder="Nº de nota fiscal, recibo ou observações adicionais" />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-700 text-white font-black rounded shadow-sm">Efetuar Lançamento</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 14: EDIÇÃO DE MENSALIDADE INDIVIDUAL */}
      {modalAtivo === 'editarMensalidade' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">
              ⚙️ Registrar Mensalidade • {NOMES_MESES[formEdicaoMensalidade.mes - 1]}/{formEdicaoMensalidade.ano}
            </h3>
            <p className="font-bold text-slate-800">Membro: <span className="text-red-700 font-black">{formEdicaoMensalidade.membro_nome}</span></p>

            <div className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Status do Pagamento</label>
                <select
                  value={formEdicaoMensalidade.status}
                  onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, status: e.target.value as any })}
                  className="w-full border p-2 rounded font-bold text-slate-900"
                >
                  <option value="Pago">✓ Pago (Entra no Caixa)</option>
                  <option value="Pendente">⏳ Pendente</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Valor da Mensalidade (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formEdicaoMensalidade.valor}
                    onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, valor: Number(e.target.value) })}
                    className="w-full border p-2 rounded font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Data do Pagamento</label>
                  <input
                    type="date"
                    value={formEdicaoMensalidade.data_pagamento}
                    onChange={(e) => setFormEdicaoMensalidade({ ...formEdicaoMensalidade, data_pagamento: e.target.value })}
                    className="w-full border p-2 rounded font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="button" onClick={salvarEdicaoMensalidade} className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Alteração</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 15: EDIÇÃO DE DAY OFF / SÃO JOÃO */}
      {modalAtivo === 'editarEventoEspecial' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">
              ⚙️ Pagamento: {formEdicaoEventoEspecial.evento}
            </h3>
            <p className="font-bold text-slate-800">Membro: <span className="text-red-700 font-black">{formEdicaoEventoEspecial.membro_nome}</span></p>

            <div className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Status do Pagamento</label>
                <select
                  value={formEdicaoEventoEspecial.status}
                  onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, status: e.target.value as any })}
                  className="w-full border p-2 rounded font-bold text-slate-900"
                >
                  <option value="Pago">✓ Pago (Entra no Caixa)</option>
                  <option value="Pendente">⏳ Pendente</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">Valor Devido (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formEdicaoEventoEspecial.valor}
                    onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, valor: Number(e.target.value) })}
                    className="w-full border p-2 rounded font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Data do Pagamento</label>
                  <input
                    type="date"
                    value={formEdicaoEventoEspecial.data_pagamento}
                    onChange={(e) => setFormEdicaoEventoEspecial({ ...formEdicaoEventoEspecial, data_pagamento: e.target.value })}
                    className="w-full border p-2 rounded font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="button" onClick={salvarEdicaoEventoEspecial} className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Registro</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 16: USUÁRIOS E MATRIZ DE PERMISSÕES POR ABA */}
      {modalAtivo === 'usuario' && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full p-5 space-y-4 border border-slate-300 text-xs max-h-[90vh] overflow-y-auto">
            <h3 className="font-black text-slate-900 text-base border-b pb-2">{formUsuario.id ? 'Editar Permissões do Usuário' : 'Cadastrar Usuário & Permissões por Aba'}</h3>
            <form onSubmit={salvarUsuarioSupabase} className="space-y-3">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nome Completo</label>
                <input type="text" required value={formUsuario.nome_completo || ''} onChange={(e) => setFormUsuario({ ...formUsuario, nome_completo: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-black text-slate-900 mb-1">E-mail</label>
                  <input type="email" required value={formUsuario.email || ''} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} className="w-full border p-2 rounded font-bold text-slate-900" />
                </div>
                <div>
                  <label className="block font-black text-slate-900 mb-1">Perfil de Acesso</label>
                  <select value={formUsuario.perfil_acesso || 'Membro'} onChange={(e) => setFormUsuario({ ...formUsuario, perfil_acesso: e.target.value as any })} className="w-full border p-2 rounded font-bold text-slate-900">
                    <option>Administrador</option>
                    <option>Coordenador</option>
                    <option>Apoio Técnico</option>
                    <option>Membro</option>
                    <option>Consulta</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <p className="font-black text-slate-900">Permissões de Acesso por Módulo / Aba:</p>
                <div className="border rounded overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-slate-100 font-black text-slate-900 border-b">
                        <th className="p-2">Aba / Módulo</th>
                        <th className="p-2 text-center">Visualizar</th>
                        <th className="p-2 text-center">Editar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {abasDisponiveisChaves.map((item) => {
                        const perm = formUsuario.permissoes?.[item.key] || { visualizar: true, editar: true };
                        return (
                          <tr key={item.key} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-slate-900">{item.label}</td>
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={perm.visualizar}
                                onChange={(e) => {
                                  const atual = formUsuario.permissoes || {};
                                  setFormUsuario({
                                    ...formUsuario,
                                    permissoes: { ...atual, [item.key]: { ...perm, visualizar: e.target.checked } },
                                  });
                                }}
                              />
                            </td>
                            <td className="p-2 text-center">
                              <input
                                type="checkbox"
                                checked={perm.editar}
                                onChange={(e) => {
                                  const atual = formUsuario.permissoes || {};
                                  setFormUsuario({
                                    ...formUsuario,
                                    permissoes: { ...atual, [item.key]: { ...perm, editar: e.target.checked } },
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button type="button" onClick={() => setModalAtivo(null)} className="px-3 py-1.5 border rounded font-black text-slate-900">Cancelar</button>
                <button type="submit" className="px-4 py-1.5 bg-red-100 text-red-700 border border-red-300 font-black rounded">Salvar Usuário & Permissões</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 17: REDEFINIR SENHA DO USUÁRIO */}
      {modalAtivo === 'resetSenha' && usuarioResetSenha && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 space-y-4 border border-slate-300 text-xs">
            <h3 className="font-black text-slate-900 text-base border-b pb-2 flex items-center space-x-2">
              <span>🔑</span>
              <span>Redefinir Senha de Acesso</span>
            </h3>

            <div className="space-y-1">
              <p className="font-bold text-slate-800">
                Usuário: <span className="text-red-700 font-black">{usuarioResetSenha.nome_completo}</span>
              </p>
              <p className="text-slate-600 font-medium">E-mail: {usuarioResetSenha.email}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block font-black text-slate-900 mb-1">Nova Senha de Acesso</label>
                <input
                  type="password"
                  placeholder="Digite a nova senha (mínimo 6 caracteres)"
                  value={novaSenhaInput}
                  onChange={(e) => setNovaSenhaInput(e.target.value)}
                  className="w-full border p-2 rounded font-bold text-slate-900 bg-slate-50"
                />
              </div>

              <button
                type="button"
                onClick={handleAlterarSenhaDireta}
                className="w-full py-2 bg-red-700 hover:bg-red-800 text-white font-black rounded shadow-sm transition-colors text-xs"
              >
                Salvar Nova Senha no Sistema
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-300"></div>
                <span className="flex-shrink mx-2 text-[10px] text-slate-500 font-bold uppercase">ou</span>
                <div className="flex-grow border-t border-slate-300"></div>
              </div>

              <button
                type="button"
                onClick={() => handleEnviarEmailResetSenha(usuarioResetSenha.email)}
                className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-black rounded border border-slate-400 transition-colors text-xs"
              >
                📧 Enviar Link de Redefinição por E-mail (Supabase)
              </button>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setModalAtivo(null); setUsuarioResetSenha(null); setNovaSenhaInput(''); }}
                  className="px-4 py-1.5 border rounded text-slate-900 font-black"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}