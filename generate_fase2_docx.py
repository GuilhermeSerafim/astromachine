#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Gera o documento PI4_Fase2_AstroMachine_Guilherme_Gustavo.docx
Fase 2 completa do Projeto Integrador IV - AstroMachine
"""

from docx import Document
from docx.shared import Pt, Cm, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
import os

doc = Document()

# ============================================================
# CONFIGURAÇÃO DE MARGENS (Superior=2, Inferior=2, Esq=3, Dir=2)
# ============================================================
for section in doc.sections:
    section.top_margin = Cm(2)
    section.bottom_margin = Cm(2)
    section.left_margin = Cm(3)
    section.right_margin = Cm(2)

# ============================================================
# ESTILOS
# ============================================================
style_normal = doc.styles['Normal']
style_normal.font.name = 'Arial'
style_normal.font.size = Pt(10)
style_normal.paragraph_format.line_spacing = 1.5
style_normal.paragraph_format.space_after = Pt(0)

style_h1 = doc.styles['Heading 1']
style_h1.font.name = 'Arial'
style_h1.font.size = Pt(12)
style_h1.font.bold = True
style_h1.font.color.rgb = RGBColor(0, 0, 0)

style_h2 = doc.styles['Heading 2']
style_h2.font.name = 'Arial'
style_h2.font.size = Pt(12)
style_h2.font.bold = True
style_h2.font.color.rgb = RGBColor(0, 0, 0)

# ============================================================
# HELPERS
# ============================================================
def add_paragraph(text, bold=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, indent_cm=2, size=10, spacing_after=0):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.first_line_indent = Cm(indent_cm)
    p.paragraph_format.space_after = Pt(spacing_after)
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(size)
    run.bold = bold
    return p

def add_bullet(text, level=0):
    p = doc.add_paragraph(style='List Bullet')
    p.clear()
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.font.size = Pt(10)
    if level > 0:
        p.paragraph_format.left_indent = Cm(1.5 * level)
    return p

def set_cell_shading(cell, color):
    shading_elm = OxmlElement('w:shd')
    shading_elm.set(qn('w:fill'), color)
    shading_elm.set(qn('w:val'), 'clear')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def format_table_header(table, header_color='2E4057'):
    row = table.rows[0]
    for cell in row.cells:
        set_cell_shading(cell, header_color)
        for paragraph in cell.paragraphs:
            paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in paragraph.runs:
                run.font.color.rgb = RGBColor(255, 255, 255)
                run.font.bold = True
                run.font.name = 'Arial'
                run.font.size = Pt(10)

def format_table_cells(table, start_row=1):
    for row_idx in range(start_row, len(table.rows)):
        for cell in table.rows[row_idx].cells:
            for paragraph in cell.paragraphs:
                paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
                for run in paragraph.runs:
                    run.font.name = 'Arial'
                    run.font.size = Pt(10)

def add_table(headers, rows, header_color='2E4057'):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.style = 'Table Grid'
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Header
    for i, h in enumerate(headers):
        table.rows[0].cells[i].text = h
    # Data
    for r_idx, row_data in enumerate(rows):
        for c_idx, cell_data in enumerate(row_data):
            table.rows[r_idx + 1].cells[c_idx].text = str(cell_data)
    format_table_header(table, header_color)
    format_table_cells(table)
    doc.add_paragraph()
    return table

def add_empty_lines(n=1):
    for _ in range(n):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(0)

# ============================================================
# CAPA
# ============================================================
add_empty_lines(3)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('CENTRO UNIVERSITÁRIO SENAC\nTECNOLOGIA EM ANÁLISE E DESENVOLVIMENTO DE SISTEMAS')
run.font.name = 'Arial'
run.font.size = Pt(14)
run.font.bold = True

add_empty_lines(5)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('PROJETO INTEGRADOR - DESENVOLVIMENTO PARA DISPOSITIVOS MÓVEIS:\nASTROMACHINE')
run.font.name = 'Arial'
run.font.size = Pt(14)
run.font.bold = True

add_empty_lines(6)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('Guilherme da Silva Serafim: 1143043623\nGustavo Magalhães Prada de Castro: 1142536492')
run.font.name = 'Arial'
run.font.size = Pt(12)

add_empty_lines(8)

p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('São Paulo – 2026')
run.font.name = 'Arial'
run.font.size = Pt(12)

doc.add_page_break()

# ============================================================
# SUMÁRIO (placeholder - atualizar no Word com Ctrl+A -> F9)
# ============================================================
doc.add_heading('Sumário', level=1)
add_paragraph('(Atualize o sumário no Word: clique com botão direito → Atualizar campo, ou selecione tudo com Ctrl+A e pressione F9)', indent_cm=0, size=9)
add_empty_lines(1)

# Sumário manual
summary_items = [
    ('1. Introdução', '4'),
    ('   1.1. Visão do Produto (Product Vision)', '4'),
    ('   1.2. Escopo do Projeto', '4'),
    ('2. Desenvolvimento do Projeto', '5'),
    ('   2.1 MVP – Produto Mínimo Viável', '5'),
    ('   2.2 Estruturação do Planejamento Ágil', '5'),
    ('   2.3 Pesquisa de Mercado e Design de Interface', '6'),
    ('   2.4 História do Usuário', '7'),
    ('   2.5 Definição de Pronto', '7'),
    ('   2.6 Roadmap do Projeto', '7'),
    ('   2.7 Stakeholders', '8'),
    ('   2.8 Configuração do Ambiente e Interface Inicial', '9'),
    ('   2.9 Modelagem e Estrutura do Banco de Dados', '10'),
    ('   2.10 Monitoramento e Sprint Review', '12'),
    ('   2.11 Análise e Mitigação de Riscos', '14'),
    ('3. Conclusão', '16'),
    ('4. Bibliografia', '16'),
]
for item, page in summary_items:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run(f'{item} {"." * (60 - len(item))} {page}')
    run.font.name = 'Arial'
    run.font.size = Pt(10)

doc.add_page_break()

# ============================================================
# 1. INTRODUÇÃO
# ============================================================
doc.add_heading('1. Introdução', level=1)

doc.add_heading('1.1. Visão do Produto (Product Vision)', level=2)

p = doc.add_paragraph()
run = p.add_run('1.1.1 Nome do Projeto')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('AstroMachine', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('1.1.2 Problema a Ser Resolvido')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Entusiastas de hardware e astronomia não encontram no mercado opções de computadores que unam performance técnica a uma estética personalizada (pintura, gravura e iluminação) baseada no espaço sideral.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('1.1.3 Visão do Produto')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Uma aplicação mobile que oferece serviços de montagem e personalização de PCs com temas de galáxias e exoplanetas, facilitando a escolha e contratação de builds exclusivas.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('1.1.4 Público-Alvo')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_bullet('Usuários principais: Gamers e entusiastas de hardware.')
add_bullet('Usuários secundários: Admiradores de astronomia e design.')

doc.add_heading('1.2. Escopo do Projeto', level=2)

p = doc.add_paragraph()
run = p.add_run('1.2.1 Escopo do Produto')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_bullet('Cadastro e login de usuários.')
add_bullet('Tela principal com catálogo de PCs já personalizados (ex: Build Andromeda, PC Orion).')
add_bullet('Módulo Administrativo (CRUD): Inserir, Alterar, Excluir e Consultar os modelos de customização no catálogo.')
add_bullet('Carrinho de compras para os serviços selecionados.')
add_bullet('Formulário para simulação de pagamento.')
add_bullet('Interface Acessível: Implementação de padrões básicos de acessibilidade (contraste, suporte a leitores de tela e fontes escaláveis) para garantir a inclusão de todos os perfis de entusiastas.')

add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('1.2.2 Fora do Escopo')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_bullet('Relatórios avançados.')
add_bullet('Integração com gateway de pagamentos.')

doc.add_page_break()

# ============================================================
# 2. DESENVOLVIMENTO DO PROJETO
# ============================================================
doc.add_heading('2. Desenvolvimento do Projeto', level=1)

# 2.1 MVP
doc.add_heading('2.1 MVP – Produto Mínimo Viável', level=2)

p = doc.add_paragraph()
run = p.add_run('2.1.1 Objetivo do MVP')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Validar a jornada de contratação de serviços de customização de hardware temático, garantindo que o entusiasta consiga selecionar uma "build" espacial e que o administrador consiga gerenciar esse catálogo de forma centralizada e ágil.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.1.2 Funcionalidades Essenciais do MVP')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Funcionalidade', 'Descrição', 'Prioridade'],
    [
        ['Vitrine Espacial', 'Exibição dos modelos de PCs personalizados.', 'Alta'],
        ['Painel de Controle', 'Interface de CRUD para o administrador gerenciar os serviços (Inserir, Alterar, Excluir, Consultar).', 'Alta'],
        ['Fluxo de Reserva', 'Adição ao carrinho e formulário de checkout para fechamento do pedido.', 'Alta'],
        ['Autenticação e Perfil', 'Cadastro e login para personalização de hardware e acesso seguro ao sistema.', 'Alta'],
        ['Acessibilidade Digital', 'Suporte a leitores de tela e padrões de contraste WCAG em todas as telas.', 'Média'],
    ]
)

# 2.2 Planejamento Ágil
doc.add_heading('2.2. Estruturação do Planejamento Ágil', level=2)

p = doc.add_paragraph()
run = p.add_run('2.2.1. Processo SCRUM')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Para o desenvolvimento do AstroMachine, será adotado o framework Scrum adaptado para uma equipe de dois desenvolvedores, com Sprints de periodicidade semanal.', indent_cm=2)
add_paragraph('Papéis (Roles): A equipe dividirá as responsabilidades para garantir a agilidade no desenvolvimento:', indent_cm=2)

add_bullet('Guilherme Serafim: Atuará como Product Owner (PO), responsável pela definição de requisitos e prioridades do produto, acumulando também a função de Developer em React Native.')
add_bullet('Gustavo Magalhães: Atuará como Scrum Master (SM), focando na gestão do processo ágil e na remoção de impedimentos, acumulando também a função de Developer em React Native.')

add_paragraph('Artefatos: O projeto será guiado pelo Product Backlog (lista de todas as histórias de usuário) e pelo Sprint Backlog (conjunto de tarefas selecionadas para a semana), gerenciados de forma compartilhada pela dupla.', indent_cm=2)
add_paragraph('Cerimônias: Serão realizadas reuniões de Sprint Planning no início de cada ciclo para definição de metas, e sessões de Sprint Review/Retrospective ao final de cada semana para validação do código produzido e melhoria contínua dos processos da equipe.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.2.2. Estimativa de Esforço (Planning Poker)')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('A complexidade técnica de cada funcionalidade foi estimada individualmente através da técnica de Planning Poker, utilizando a sequência de Fibonacci (1, 2, 3, 5, 8) para atribuir pontos de esforço.', indent_cm=2)
add_empty_lines(1)

add_table(
    ['ID', 'Funcionalidade / História', 'Prioridade', 'Esforço (Pontos)'],
    [
        ['US01', 'Cadastro e login de usuários', 'Alta', '3'],
        ['US02', 'Catálogo de PCs personalizados (Vitrine)', 'Alta', '5'],
        ['US03', 'Módulo Administrativo (CRUD completo)', 'Alta', '8'],
        ['US04', 'Carrinho de Compras e Pagamento', 'Média', '5'],
        ['US05', 'Acessibilidade e Inclusão', 'Média', '3'],
    ]
)

# 2.3 Pesquisa e Wireframes
doc.add_heading('2.3 Pesquisa de Mercado e Design de Interface (Wireframing)', level=2)

p = doc.add_paragraph()
run = p.add_run('2.3.1 Pesquisa Exploratória de Mercado')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Concorrentes Diretos: Empresas como Pichau e Terabyte Shop (Brasil), que focam em performance gamer genérica, e boutiques como Origin PC (Global), focadas em estética premium, mas sem nicho na New Space Economy.', indent_cm=2)
add_paragraph('Diferencial AstroMachine: Especialização estética e técnica em hardware com temática espacial (nebulosas e exoplanetas). Este MVP foca exclusivamente na venda e personalização de builds, validando a marca como uma base sólida ("alicerce") para a futura expansão de serviços técnicos especializados no setor aeroespacial.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.3.2 Wireframes')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Os wireframes a seguir representam as seis telas do MVP, conforme projetado na Fase 1 do projeto. Cada tela foi desenhada priorizando a clareza do fluxo do usuário e a consistência visual com a temática espacial.', indent_cm=2)
add_empty_lines(1)

# Tabela de telas
add_table(
    ['Tela', 'Objetivo'],
    [
        ['Login', 'Autenticar usuários já cadastrados no sistema.'],
        ['Cadastro', 'Registrar novos usuários na plataforma.'],
        ['Vitrine (Tela Principal)', 'Exibir o catálogo de serviços de hardware personalizado.'],
        ['Carrinho de Compra', 'Revisão dos serviços selecionados antes da finalização.'],
        ['Checkout', 'Cumprir o requisito de formulário para simulação de pagamento.'],
        ['Dashboard Admin', 'Interface de CRUD para o administrador manter o catálogo atualizado.'],
    ]
)

# Inserir wireframes
wireframe_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs', 'contexto das entregas')
wf1 = os.path.join(wireframe_dir, 'figma-wireframe-1.png')
wf2 = os.path.join(wireframe_dir, 'figma-wireframe-2.png')

if os.path.exists(wf1):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('Wireframes – Telas de Login, Cadastro e Vitrine')
    run.font.name = 'Arial'
    run.font.size = Pt(10)
    run.bold = True
    run.italic = True
    doc.add_picture(wf1, width=Inches(5.5))
    last_paragraph = doc.paragraphs[-1]
    last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_empty_lines(1)

if os.path.exists(wf2):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run('Wireframes – Telas de Carrinho, Checkout e Dashboard Admin')
    run.font.name = 'Arial'
    run.font.size = Pt(10)
    run.bold = True
    run.italic = True
    doc.add_picture(wf2, width=Inches(5.5))
    last_paragraph = doc.paragraphs[-1]
    last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
    add_empty_lines(1)

# 2.4 Histórias do Usuário
doc.add_heading('2.4 História do Usuário', level=2)

add_table(
    ['ID', 'História do Usuário', 'Prioridade'],
    [
        ['US01', 'Como cliente, quero me cadastrar e realizar login, para salvar minhas preferências de customização.', 'Alta'],
        ['US02', 'Como cliente, quero visualizar o catálogo de PCs personalizados, para escolher uma build baseada no tema espacial.', 'Alta'],
        ['US03', 'Como administrador, quero inserir, alterar e excluir produtos do catálogo (CRUD), para manter a vitrine de hardware atualizada.', 'Alta'],
        ['US04', 'Como cliente, quero adicionar itens ao carrinho e preencher o formulário de pagamento, para finalizar a contratação do serviço de montagem.', 'Média'],
        ['US05', 'Como usuário com baixa visão, quero poder ajustar o contraste e o tamanho das fontes no app, para navegar pelo catálogo com autonomia.', 'Média'],
    ]
)

# 2.5 Definição de Pronto
doc.add_heading('2.5 Definição de Pronto', level=2)

add_bullet('Funcionalidade totalmente implementada em React Native conforme o protótipo.')
add_bullet('Código versionado com sucesso no repositório GitHub do grupo.')
add_bullet('Interface mobile operando sem erros fatais ou travamentos aparentes.')
add_bullet('Código devidamente comentado para facilitar a manutenção futura.')
add_bullet('História validada e aprovada pelo professor orientador da disciplina.')
add_bullet('Interface acessível validada pelas APIs de acessibilidade do React Native.')

# 2.6 Roadmap
doc.add_heading('2.6 Roadmap do Projeto', level=2)

p = doc.add_paragraph()
run = p.add_run('2.6.1 Planejamento por Sprints')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Sprint', 'Objetivo', 'Principais Entregas'],
    [
        ['Sprint 1', 'Planejamento Inicial', 'Documento de Visão, Backlog Priorizado e Wireframes.'],
        ['Sprint 2', 'Estrutura e Gestão', 'Telas de Login e o Módulo Administrativo (CRUD de produtos).'],
        ['Sprint 3', 'Fluxo do Cliente', 'Tela Principal (Catálogo), Carrinho e Fluxo de Pagamento.'],
        ['Sprint 4', 'Finalização', 'Refinamento de UI/UX, gravação do vídeo demo e entrega final.'],
    ]
)

# 2.7 Stakeholders
doc.add_heading('2.7 Stakeholders', level=2)

add_bullet('Público-alvo: Startups da nova economia espacial e entusiastas de hardware especializado.')
add_bullet('Público com necessidades específicas: Usuários que dependem de tecnologias assistivas e interfaces acessíveis.')
add_bullet('Orientador: Wilson da Silva Lourenço.')
add_bullet('Desenvolvedores Responsáveis: Guilherme da Silva Serafim e Gustavo Magalhães Prada de Castro.')

doc.add_page_break()

# ============================================================
# 2.8 CONFIGURAÇÃO DO AMBIENTE E INTERFACE INICIAL
# ============================================================
doc.add_heading('2.8 Configuração do Ambiente e Interface Inicial', level=2)

add_paragraph('Esta seção documenta a configuração do ambiente de desenvolvimento e a criação do projeto base em React Native com Expo, garantindo que o aplicativo compile e inicie corretamente em emuladores Android e iOS.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.8.1 Ferramentas e Versões Utilizadas')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Ferramenta', 'Versão / Configuração'],
    [
        ['VS Code', '1.99.x com extensões: React Native Tools, ESLint, Prettier'],
        ['Node.js', '22.x LTS'],
        ['Expo CLI / SDK', 'SDK 54 (npx create-expo-app)'],
        ['React Native', '0.81.5'],
        ['TypeScript', '5.9.x'],
        ['Zustand (State)', '5.x'],
        ['Android Studio / Emulador', 'Android 14 (API 34)'],
        ['Git / GitHub', 'Repositório privado do grupo'],
    ]
)

p = doc.add_paragraph()
run = p.add_run('2.8.2 Criação do Projeto Base')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('O projeto foi criado utilizando o Expo CLI com template TypeScript. A estrutura de pastas adotada separa as telas (screens), serviços de comunicação com a API (services), gerenciamento de estado (store), tipagem (types) e configuração de navegação (navigation), conforme demonstrado a seguir:', indent_cm=2)
add_empty_lines(1)

structure_lines = [
    'AstroMachine/',
    '├── mobile/',
    '│   ├── App.tsx',
    '│   ├── src/',
    '│   │   ├── screens/       # Login, Cadastro, Vitrine, Carrinho, Checkout, AdminDashboard, AdminForm',
    '│   │   ├── services/      # api.ts (Axios + Node backend)',
    '│   │   ├── store/         # authStore.ts, cartStore.ts (Zustand)',
    '│   │   ├── types/         # index.ts (interfaces do domínio)',
    '│   │   ├── theme/         # index.ts (cores, espaçamentos, fontes)',
    '│   │   ├── utils/         # validation.ts, format.ts, dialog.ts',
    '│   │   ├── db/            # database.native.ts, database.web.ts (SQLite)',
    '│   │   └── navigation/    # AppNavigator.tsx',
    '│   └── package.json',
    '├── server/',
    '│   ├── src/',
    '│   │   ├── index.ts           # Entry point Express',
    '│   │   ├── routes/            # auth, products, services, appointments, checkout',
    '│   │   ├── middlewares/       # auth.ts (JWT)',
    '│   │   ├── models/            # types.ts',
    '│   │   └── services/          # database.ts (in-memory DB)',
    '│   └── package.json',
    '└── README.md',
]

for line in structure_lines:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.space_before = Pt(0)
    run = p.add_run(line)
    run.font.name = 'Courier New'
    run.font.size = Pt(9)

add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.8.3 Telas Implementadas na Sprint 2')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('As seguintes telas foram implementadas, compiladas e validadas sem erros fatais nesta sprint:', indent_cm=2)
add_empty_lines(1)

add_table(
    ['Tela', 'Descrição', 'Status'],
    [
        ['Login', 'Campos de e-mail e senha + botão de acesso', 'Concluída'],
        ['Cadastro', 'Formulário com nome, e-mail e senha', 'Concluída'],
        ['Admin Dashboard', 'Listagem com opções de Inserir, Editar e Excluir produto', 'Concluída'],
        ['Admin Form', 'Formulário de criação/edição de produto com validação', 'Concluída'],
        ['Vitrine (Catálogo)', 'Grid de cards com builds espaciais e botão "Adicionar ao Carrinho"', 'Concluída'],
        ['Detalhe do Produto', 'Tela com especificações técnicas completas e ação de compra', 'Concluída'],
        ['Carrinho de Compras', 'Lista de itens selecionados com quantidade e valor total', 'Concluída'],
        ['Checkout', 'Formulário de simulação de pagamento (dados fictícios)', 'Concluída'],
        ['Acessibilidade', 'Tela de configuração de contraste e tamanho de fonte', 'Concluída'],
    ]
)

doc.add_page_break()

# ============================================================
# 2.9 MODELAGEM E ESTRUTURA DO BANCO DE DADOS
# ============================================================
doc.add_heading('2.9 Modelagem e Estrutura do Banco de Dados', level=2)

add_paragraph('Esta seção apresenta o Diagrama de Entidade-Relacionamento (DER), a arquitetura do backend em Node.js e a configuração do banco de dados local mobile em SQLite.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.9.1 Arquitetura de Dados')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('O projeto adota uma arquitetura de dois níveis de persistência:', indent_cm=2)
add_bullet('Backend (Servidor): API RESTful desenvolvida em Node.js + Express com TypeScript, utilizando banco de dados em memória (in-memory) que centraliza os dados de produtos (catálogo), serviços, agendamentos, usuários e pedidos.')
add_bullet('Mobile Local (Cache): O aplicativo utiliza expo-sqlite para armazenar localmente os dados do carrinho de compras e as informações do usuário autenticado via Zustand + AsyncStorage, garantindo funcionamento offline parcial.')
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.9.2 Diagrama de Entidade-Relacionamento (DER)')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('O DER a seguir modela as seis entidades principais do sistema e seus relacionamentos:', indent_cm=2)
add_empty_lines(1)

# Diagrama ER textual
er_title = doc.add_paragraph()
er_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = er_title.add_run('Diagrama Entidade-Relacionamento – AstroMachine')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
run.italic = True
add_empty_lines(1)

er_lines = [
    '┌──────────────┐       1:N        ┌──────────────┐       1:N        ┌──────────────┐',
    '│   USUARIOS   │─────────────────▶│    PEDIDOS    │─────────────────▶│ ITENS_PEDIDO │',
    '│──────────────│                  │──────────────│                  │──────────────│',
    '│ id       (PK)│                  │ id       (PK)│                  │ id       (PK)│',
    '│ nome         │                  │ usuario_id(FK)│                 │ pedido_id(FK)│',
    '│ email   (UQ) │                  │ status       │                  │ produto_id(FK)│',
    '│ senha_hash   │                  │ valor_total  │                  │ quantidade   │',
    '│ perfil       │                  │ metodo_pag   │                  │ preco_unit   │',
    '│ created_at   │                  │ created_at   │                  └──────────────┘',
    '└──────┬───────┘                  └──────────────┘                         ▲',
    '       │                                                                   │',
    '       │ 1:N         ┌──────────────┐                                N:1  │',
    '       └────────────▶│ AGENDAMENTOS │         ┌──────────────┐            │',
    '                     │──────────────│    N:1   │   PRODUTOS   │────────────┘',
    '                     │ id       (PK)│◀────────│──────────────│',
    '                     │ usuario_id(FK)│         │ id       (PK)│',
    '                     │ produto_id(FK)│         │ nome         │',
    '                     │ servico_ids  │         │ descricao    │',
    '                     │ data         │         │ preco        │',
    '                     │ status       │         │ imagem_url   │',
    '                     │ notas        │         │ categoria    │',
    '                     │ created_at   │         │ specs        │',
    '                     └──────────────┘         │ em_estoque   │',
    '                           ▲                  │ created_at   │',
    '                           │ N:M              └──────────────┘',
    '                     ┌──────────────┐',
    '                     │   SERVICOS   │',
    '                     │──────────────│',
    '                     │ id       (PK)│',
    '                     │ nome         │',
    '                     │ descricao    │',
    '                     │ preco        │',
    '                     │ horas_est    │',
    '                     │ categoria    │',
    '                     │ created_at   │',
    '                     └──────────────┘',
]

for line in er_lines:
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(0)
    p.paragraph_format.space_before = Pt(0)
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    run = p.add_run(line)
    run.font.name = 'Courier New'
    run.font.size = Pt(7)

add_empty_lines(1)

# Tabela detalhada do DER - USUARIOS
add_paragraph('Tabela: usuarios', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['nome', 'VARCHAR(100)', 'NOT NULL'],
        ['email', 'VARCHAR(150)', 'UNIQUE, NOT NULL'],
        ['senha_hash', 'VARCHAR(255)', 'NOT NULL'],
        ['perfil', "ENUM('cliente','admin')", "DEFAULT 'cliente'"],
        ['created_at', 'DATETIME', 'DEFAULT NOW()'],
    ]
)

add_paragraph('Tabela: produtos', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['nome', 'VARCHAR(100)', 'NOT NULL'],
        ['descricao', 'TEXT', '—'],
        ['preco', 'DECIMAL(10,2)', 'NOT NULL'],
        ['imagem_url', 'VARCHAR(255)', '—'],
        ['categoria', 'VARCHAR(80)', 'NOT NULL'],
        ['specs', 'TEXT', '—'],
        ['em_estoque', 'BOOLEAN', 'DEFAULT TRUE'],
        ['created_at', 'DATETIME', 'DEFAULT NOW()'],
    ]
)

add_paragraph('Tabela: servicos', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['nome', 'VARCHAR(100)', 'NOT NULL'],
        ['descricao', 'TEXT', '—'],
        ['preco', 'DECIMAL(10,2)', 'NOT NULL'],
        ['horas_estimadas', 'INTEGER', 'DEFAULT 1'],
        ['categoria', 'VARCHAR(80)', 'NOT NULL'],
        ['created_at', 'DATETIME', 'DEFAULT NOW()'],
    ]
)

add_paragraph('Tabela: agendamentos', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['usuario_id', 'VARCHAR (UUID)', 'FK → usuarios.id'],
        ['produto_id', 'VARCHAR (UUID)', 'FK → produtos.id (opcional)'],
        ['servico_ids', 'JSON (array de UUIDs)', 'FK → servicos.id'],
        ['data', 'DATETIME', 'NOT NULL'],
        ['status', "ENUM('pendente','confirmado','concluido','cancelado')", "DEFAULT 'pendente'"],
        ['notas', 'TEXT', '—'],
        ['created_at', 'DATETIME', 'DEFAULT NOW()'],
    ]
)

add_paragraph('Tabela: pedidos', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['usuario_id', 'VARCHAR (UUID)', 'FK → usuarios.id'],
        ['status', "ENUM('pendente','confirmado','entregue')", "DEFAULT 'pendente'"],
        ['valor_total', 'DECIMAL(10,2)', 'NOT NULL'],
        ['metodo_pagamento', 'VARCHAR(100)', 'NOT NULL'],
        ['created_at', 'DATETIME', 'DEFAULT NOW()'],
    ]
)

add_paragraph('Tabela: itens_pedido', bold=True, indent_cm=0, size=10)
add_table(
    ['Atributo', 'Tipo', 'Restrição'],
    [
        ['id', 'VARCHAR (UUID)', 'PK'],
        ['pedido_id', 'VARCHAR (UUID)', 'FK → pedidos.id'],
        ['produto_id', 'VARCHAR (UUID)', 'FK → produtos.id'],
        ['nome_produto', 'VARCHAR(100)', 'NOT NULL'],
        ['quantidade', 'INTEGER', 'NOT NULL'],
        ['preco_unitario', 'DECIMAL(10,2)', 'NOT NULL'],
    ]
)

add_paragraph('Relacionamentos:', bold=True, indent_cm=0, size=10)
add_bullet('Um usuário pode ter vários pedidos (1:N) e vários agendamentos (1:N).')
add_bullet('Um pedido é composto por vários itens (1:N). Cada item referencia um produto do catálogo (N:1).')
add_bullet('Um agendamento referencia opcionalmente um produto (N:1) e pode incluir múltiplos serviços (N:M via array JSON).')
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.9.3 Configuração do Backend Node.js')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('A API foi estruturada em Node.js com Express e TypeScript, com as seguintes rotas principais:', indent_cm=2)
add_empty_lines(1)

add_table(
    ['Método', 'Rota', 'Descrição', 'Autenticação'],
    [
        ['POST', '/auth/register', 'Cadastro de novo usuário com hash bcrypt', 'Pública'],
        ['POST', '/auth/login', 'Autenticação com retorno de JWT', 'Pública'],
        ['GET', '/products', 'Listagem pública do catálogo', 'Pública'],
        ['GET', '/products/:id', 'Detalhes de um produto', 'Pública'],
        ['POST', '/products', 'Inserção de novo produto', 'Admin'],
        ['PUT', '/products/:id', 'Atualização de produto existente', 'Admin'],
        ['DELETE', '/products/:id', 'Exclusão de produto', 'Admin'],
        ['GET', '/services', 'Listagem de serviços', 'Pública'],
        ['POST', '/services', 'Inserção de novo serviço', 'Admin'],
        ['PUT', '/services/:id', 'Atualização de serviço', 'Admin'],
        ['DELETE', '/services/:id', 'Exclusão de serviço', 'Admin'],
        ['GET', '/appointments', 'Listagem de agendamentos (filtrado por perfil)', 'Autenticado'],
        ['POST', '/appointments', 'Criação de agendamento', 'Autenticado'],
        ['POST', '/checkout/simulate', 'Simulação de pedido com itens do carrinho', 'Autenticado'],
    ]
)

doc.add_page_break()

# ============================================================
# 2.10 MONITORAMENTO E SPRINT REVIEW
# ============================================================
doc.add_heading('2.10 Monitoramento e Sprint Review', level=2)

add_paragraph('Esta seção registra a primeira Sprint Review realizada ao final da Sprint 2, conforme a cerimônia prevista no framework Scrum adotado pelo projeto.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.10.1 Reunião de Sprint Review – Sprint 2')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Item', 'Detalhes'],
    [
        ['Data da Reunião', '01/04/2026'],
        ['Participantes', 'Guilherme Serafim (PO), Gustavo Magalhães (SM/Dev), Prof. Wilson da Silva Lourenço (Orientador)'],
        ['Duração', '45 minutos (online via Google Meet)'],
        ['Objetivo', 'Apresentar as interfaces desenvolvidas na Sprint 2 e validar o backlog para Sprint 3'],
    ]
)

p = doc.add_paragraph()
run = p.add_run('2.10.2 Interfaces Apresentadas')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True

add_paragraph('Foram demonstradas ao orientador as telas de Login, Cadastro e Admin Dashboard, todas funcionando no emulador Android. A navegação entre as telas foi apresentada via navegação customizada implementada com gerenciamento de estado local (useState).', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.10.3 Feedback Recebido e Ajustes no Backlog')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Feedback do Orientador', 'Ação Definida', 'Prioridade'],
    [
        ['Validação de formulários (e-mail e senha) ausente nas telas de autenticação', 'Implementar validação com Zod + React Hook Form na Sprint 3', 'Alta'],
        ['Ausência de mensagem de feedback ao usuário após ações (ex: produto adicionado ao carrinho)', 'Adicionar diálogos de confirmação via Alert nativo', 'Média'],
        ['Botão de logout não visível no Admin Dashboard', 'Adicionar botão de logout no header do painel', 'Alta'],
    ]
)

p = doc.add_paragraph()
run = p.add_run('2.10.4 Relatório de Status – Sprint 2')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Métrica', 'Planejado', 'Realizado', 'Observação'],
    [
        ['Story Points da Sprint', '14', '11', 'US03 (CRUD) parcialmente concluída'],
        ['Telas Entregues', '3', '3', 'Login, Cadastro e Admin Dashboard'],
        ['Bugs Críticos', '0', '1', 'Crash no Android ao navegar sem token JWT – corrigido'],
        ['Cobertura de Acessibilidade', '50%', '30%', 'Labels de acessibilidade adicionados na Sprint 3'],
    ]
)

add_paragraph('Velocidade da equipe: 11 pontos/sprint. Meta ajustada para Sprint 3: 13 pontos, considerando a conclusão do CRUD e o desenvolvimento do fluxo do cliente (Vitrine, Carrinho e Checkout).', indent_cm=2)
add_empty_lines(1)

# Pauta da Sprint Review
p = doc.add_paragraph()
run = p.add_run('2.10.5 Pauta da Sprint Review – Sprint 2')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['#', 'Item da Pauta', 'Responsável', 'Tempo'],
    [
        ['1', 'Abertura e objetivos da reunião', 'Gustavo (SM)', '5 min'],
        ['2', 'Demonstração das telas implementadas (Login, Cadastro, Admin Dashboard)', 'Guilherme (PO)', '15 min'],
        ['3', 'Apresentação da estrutura do backend Node.js e rotas da API', 'Guilherme (PO)', '10 min'],
        ['4', 'Feedback do orientador sobre as interfaces e a modelagem', 'Prof. Wilson', '10 min'],
        ['5', 'Revisão do backlog e definição de prioridades para Sprint 3', 'Todos', '5 min'],
    ]
)

# Ata da Sprint Review
p = doc.add_paragraph()
run = p.add_run('2.10.6 Ata da Sprint Review – Sprint 2')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['Item', 'Detalhes'],
    [
        ['Data', '01/04/2026'],
        ['Horário', '19h00 – 19h45'],
        ['Local', 'Google Meet (remoto)'],
        ['Participantes', 'Guilherme Serafim, Gustavo Magalhães, Prof. Wilson da Silva Lourenço'],
        ['Registrador', 'Gustavo Magalhães'],
    ]
)

add_paragraph('Pontos discutidos:', bold=True, indent_cm=0, size=10)
add_bullet('As telas de Login e Cadastro foram apresentadas com navegação funcional. O orientador aprovou o visual e sugeriu adicionar validação de campos.')
add_bullet('O Admin Dashboard foi demonstrado com listagem de produtos e operações de inserção e exclusão. A edição foi apresentada parcialmente implementada.')
add_bullet('O orientador destacou a necessidade de feedback visual ao usuário após ações (ex: toast/alert ao adicionar produto ao carrinho).')
add_bullet('Foi decidido priorizar a validação de formulários e o botão de logout para a Sprint 3.')
add_empty_lines(1)

add_paragraph('Decisões tomadas:', bold=True, indent_cm=0, size=10)
add_bullet('Implementar validação com Zod + React Hook Form em todas as telas de formulário.')
add_bullet('Adicionar botão de logout visível no header do Admin Dashboard.')
add_bullet('Manter o escopo do MVP sem redução, ajustando apenas a velocidade da sprint.')
add_empty_lines(1)

add_paragraph('Próximos passos:', bold=True, indent_cm=0, size=10)
add_bullet('Sprint 3: Concluir CRUD completo, implementar Vitrine, Carrinho e Checkout.')
add_bullet('Adicionar labels de acessibilidade em todas as telas.')
add_bullet('Preparar demonstração funcional para a próxima Sprint Review.')

doc.add_page_break()

# ============================================================
# 2.11 ANÁLISE E MITIGAÇÃO DE RISCOS
# ============================================================
doc.add_heading('2.11 Análise e Mitigação de Riscos', level=2)

add_paragraph('Esta seção apresenta a identificação sistemática dos riscos do projeto AstroMachine e os respectivos planos de mitigação, com foco nos riscos de alta prioridade.', indent_cm=2)
add_empty_lines(1)

p = doc.add_paragraph()
run = p.add_run('2.11.1 Identificação de Riscos')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_table(
    ['ID', 'Risco', 'Probabilidade', 'Impacto', 'Prioridade', 'Categoria'],
    [
        ['R01', 'Falha ou instabilidade da API Node.js em ambiente de produção/demonstração', 'Média', 'Alto', 'Alta', 'Técnico'],
        ['R02', 'Incompatibilidade de bibliotecas React Native com versão do Expo SDK', 'Média', 'Alto', 'Alta', 'Técnico'],
        ['R03', 'Atraso nas entregas por sobrecarga acadêmica dos desenvolvedores', 'Alta', 'Médio', 'Alta', 'Cronograma'],
        ['R04', 'Redução da equipe de 3 para 2 integrantes (já ocorrida)', 'Ocorrido', 'Alto', 'Alta', 'Pessoas'],
        ['R05', 'Erros de sincronização de dados entre SQLite local e backend remoto', 'Baixa', 'Médio', 'Média', 'Técnico'],
        ['R06', 'Interface não atender padrões WCAG de acessibilidade', 'Média', 'Baixo', 'Baixa', 'Qualidade'],
    ]
)

p = doc.add_paragraph()
run = p.add_run('2.11.2 Plano de Mitigação para Riscos de Alta Prioridade')
run.font.name = 'Arial'
run.font.size = Pt(10)
run.bold = True
add_empty_lines(1)

add_paragraph('R01 – Falha na API Node.js', bold=True, indent_cm=0, size=10)
add_paragraph('Plano A: Implementar tratamento de erros (try/catch) em todas as chamadas à API com mensagens de feedback ao usuário. Plano B: Caso a API esteja indisponível durante a demonstração final, utilizar dados mockados (JSON estático) armazenados localmente no aplicativo, simulando o retorno da API sem dependência de rede.', indent_cm=2)
add_empty_lines(1)

add_paragraph('R02 – Incompatibilidade de Bibliotecas', bold=True, indent_cm=0, size=10)
add_paragraph('Plano A: Fixar versões de todas as dependências críticas no package.json (sem uso de "^" ou "~") para evitar atualizações automáticas. Plano B: Em caso de conflito irresolvível, substituir a biblioteca problemática por alternativa compatível (ex: substituir react-native-vector-icons por @expo/vector-icons, nativo do Expo).', indent_cm=2)
add_empty_lines(1)

add_paragraph('R03 – Atraso por Sobrecarga Acadêmica', bold=True, indent_cm=0, size=10)
add_paragraph('Plano A: Manter quadro Kanban atualizado semanalmente no GitHub Projects, com revisões toda segunda-feira. Plano B: Priorizar as funcionalidades de maior nota (autenticação e CRUD) e adiar funcionalidades de menor prioridade (acessibilidade avançada) caso o cronograma seja comprometido.', indent_cm=2)
add_empty_lines(1)

add_paragraph('R04 – Redução da Equipe (Risco Ocorrido)', bold=True, indent_cm=0, size=10)
add_paragraph('Ação Tomada: Com a saída de um integrante, as responsabilidades foram redistribuídas entre Guilherme (PO + Dev) e Gustavo (SM + Dev). O escopo do MVP foi mantido integralmente, porém o ritmo das sprints foi recalibrado de 3 integrantes para 2, reduzindo a velocidade esperada de 21 para 14 pontos/sprint. O roadmap original permanece exequível dentro do prazo semestral.', indent_cm=2)

doc.add_page_break()

# ============================================================
# 3. CONCLUSÃO
# ============================================================
doc.add_heading('3. Conclusão', level=1)

add_paragraph('Ao término da Fase 2 do projeto AstroMachine, o grupo concluiu a configuração do ambiente de desenvolvimento, a implementação das primeiras telas funcionais em React Native com TypeScript e a modelagem completa do banco de dados, incluindo as seis entidades exigidas (Usuários, Produtos, Serviços, Agendamentos, Pedidos e Itens de Pedido). A primeira Sprint Review confirmou a viabilidade técnica do projeto e gerou ajustes importantes no backlog para as próximas sprints.', indent_cm=2)

add_paragraph('A adaptação da equipe, reduzida de três para dois integrantes, foi gerenciada de forma estruturada com redistribuição de papéis e ajuste de velocidade, sem comprometimento do escopo essencial do MVP. O plano de mitigação de riscos documentado oferece alternativas concretas para os principais pontos de falha identificados, garantindo a continuidade do desenvolvimento.', indent_cm=2)

add_paragraph('As fases seguintes concentrarão esforços na conclusão do fluxo completo do cliente (Vitrine, Carrinho e Checkout), no refinamento de UI/UX com a estética espacial e na preparação do vídeo demonstrativo para a entrega final.', indent_cm=2)

add_empty_lines(1)

# ============================================================
# 4. BIBLIOGRAFIA
# ============================================================
doc.add_heading('4. Bibliografia', level=1)

add_bullet('SENAC. Roteiro do Projeto Integrador: Desenvolvimento para Dispositivos Móveis. São Paulo: Centro Universitário Senac, 2026.')
add_bullet('REACT NATIVE. Documentação oficial: Components and APIs. Disponível em: https://reactnative.dev/. Acesso em: 28 fev. 2026.')
add_bullet('SCHWABER, Ken; SUTHERLAND, Jeff. O Guia do Scrum. Scrum.org, 2020.')
add_bullet('EXPO. Documentação oficial: expo-sqlite. Disponível em: https://docs.expo.dev/versions/latest/sdk/sqlite/. Acesso em: 01 abr. 2026.')
add_bullet('EXPRESS. Documentação oficial: Express.js. Disponível em: https://expressjs.com/. Acesso em: 01 abr. 2026.')
add_bullet('ZUSTAND. Documentação oficial: Zustand State Management. Disponível em: https://zustand-demo.pmnd.rs/. Acesso em: 01 abr. 2026.')
add_bullet('ZOD. Documentação oficial: TypeScript-first schema validation. Disponível em: https://zod.dev/. Acesso em: 01 abr. 2026.')

# ============================================================
# SALVAR
# ============================================================
output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs', 'PI4_Fase2_AstroMachine_Guilherme_Gustavo.docx')
os.makedirs(os.path.dirname(output_path), exist_ok=True)
doc.save(output_path)
print(f'Documento salvo em: {output_path}')
