import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PassosIconComponent } from '../../../shared/components/passos-icon/passos-icon.component';
import { HelpTopic, HelpSection } from './ajuda-manuais.models';

@Component({
  selector: 'app-ajuda-manuais',
  standalone: true,
  imports: [CommonModule, ButtonComponent, PassosIconComponent],
  templateUrl: './ajuda-manuais.component.html',
  styleUrl: './ajuda-manuais.component.css',
})
export class AjudaManuaisComponent {
  selectedTopic: HelpTopic | null = null;

  helpTopics: HelpTopic[] = [
    {
      id: 'arcatest',
      title: 'ArcaTest',
      description:
        'Gerenciamento e execução de testes automatizados com Selenium',
      icon: '🤖',
      sections: [
        {
          title: 'O que é ArcaTest?',
          content:
            'ArcaTest é uma ferramenta integrada para criar, gerenciar e executar casos de teste automatizados usando Selenium. Permite criar ações automatizadas, executar testes em tempo real e visualizar resultados.',
        },
        {
          title: 'Criar um Caso de Teste',
          content:
            'Para criar um novo caso de teste, acesse o painel ArcaTest e clique em "Criar Caso de Teste". Preencha os detalhes como nome, descrição, pré-condições e pós-condições.',
          steps: [
            'Navegue para Painel ArcaTest',
            'Clique em "Criar Caso de Teste"',
            'Preencha nome, descrição e detalhes',
            'Adicione ações automatizadas',
            'Salve o caso de teste',
          ],
        },
        {
          title: 'Executar Testes',
          content:
            'Execute testes e visualize os logs em tempo real. O sistema fornece informações detalhadas sobre cada etapa da execução, incluindo screenshots e mensagens de erro.',
          steps: [
            'Selecione o caso de teste',
            'Clique em "Executar Teste"',
            'Acompanhe os logs em tempo real',
            'Visualize resultados e screenshots',
          ],
        },
        {
          title: 'Configurações Selenium',
          content:
            'Configure as preferências de execução como navegador, resolução, timeouts, modo headless e outras opções avançadas como proxy e certificados SSL.',
          steps: [
            'Acesse Configurações de Selenium',
            'Escolha o navegador (Chrome, Firefox, Edge, Safari)',
            'Configure resoluções, timeouts e opções',
            'Salve as configurações',
            'Use na execução de testes',
          ],
        },
      ],
    },
    {
      id: 'flyingcards',
      title: 'Flying Cards',
      description: 'Gestão de tarefas e Kanban para organizar o trabalho',
      icon: '📋',
      sections: [
        {
          title: 'O que é Flying Cards?',
          content:
            'Flying Cards é a ferramenta de gerenciamento de tarefas baseada em Kanban. Organize as atividades do projeto em colunas de status e acompanhe o progresso visualmente.',
        },
        {
          title: 'Usando o Kanban',
          content:
            'O quadro Kanban mostra as tarefas em diferentes etapas. Você pode arrastá-las entre colunas para atualizar o status.',
          steps: [
            'Acesse o painel Flying Cards',
            'Visualize as colunas de status',
            'Arraste tarefas entre colunas',
            'As mudanças são salvas automaticamente',
          ],
        },
        {
          title: 'Criar User Stories',
          content:
            'User Stories representam funcionalidades ou tarefas do projeto. Crie-as para organizar o trabalho em unidades gerenciáveis.',
          steps: [
            'Clique em "Criar User Story"',
            'Preencha título e descrição',
            'Defina prioridade e complexidade',
            'Atribua a membros da equipe',
            'Salve a User Story',
          ],
        },
        {
          title: 'Gerenciar Sprints',
          content:
            'Sprints permitem organizar o trabalho em ciclos de tempo. Agrupe User Stories em sprints e acompanhe o progresso.',
        },
      ],
    },
    {
      id: 'prioreasy',
      title: 'Prioreasy',
      description: 'Priorização de requisitos e gestão de stakeholders',
      icon: '⚖️',
      sections: [
        {
          title: 'O que é Prioreasy?',
          content:
            'Prioreasy ajuda a priorizar requisitos usando técnicas estruturadas. Envolva stakeholders e tome decisões baseadas em análise sistemática.',
        },
        {
          title: 'Gerenciar Stakeholders',
          content:
            'Adicione stakeholders ao projeto e defina seus papéis e responsabilidades na priorização.',
          steps: [
            'Acesse Stakeholders',
            'Clique em "Adicionar Stakeholder"',
            'Preencha nome, e-mail e papel',
            'Salve o stakeholder',
          ],
        },
        {
          title: 'Priorizar Requisitos',
          content:
            'Use o status de priorização para definir a ordem de implementação dos requisitos com base nas análises dos stakeholders.',
          steps: [
            'Acesse Status da Priorização',
            'Veja o resultado final de cada requisito',
            'Use os resultados para planejar sprints',
          ],
        },
      ],
    },
    {
      id: 'estima',
      title: 'Estima',
      description: 'Gerenciamento de casos de uso e estimação de esforços',
      icon: '📊',
      sections: [
        {
          title: 'O que é Estima?',
          content:
            'Estima permite documentar casos de uso do sistema e estimar o esforço necessário para implementar cada funcionalidade.',
        },
        {
          title: 'Criar Casos de Uso',
          content:
            'Casos de uso descrevem as interações entre usuários e o sistema. Documente o cenário principal, pré-condições e pós-condições.',
        },
        {
          title: 'Estimar Esforços',
          content:
            'Estime quanto tempo e recursos serão necessários para implementar cada caso de uso, considerando complexidade e fatores técnicos/ambientais.',
        },
      ],
    },
    {
      id: 'colaboracao',
      title: 'Colaboração',
      description: 'Trabalhe em equipe de forma eficiente',
      icon: '👥',
      sections: [
        {
          title: 'Adicionar Colaboradores',
          content:
            'Convide membros da equipe para colaborar no projeto. Defina seus papéis e permissões.',
          steps: [
            'Acesse Colaboradores do Projeto',
            'Clique em "Adicionar Colaborador"',
            'Selecione o usuário e defina o papel',
            'Salve as alterações',
          ],
        },
        {
          title: 'Papéis e Permissões',
          content:
            'Diferentes papéis têm diferentes permissões. Admin pode gerenciar projeto, colaboradores podem executar testes e visualizar dados.',
        },
        {
          title: 'Atribuir Tarefas',
          content:
            'Atribua casos de teste, User Stories e outras tarefas aos membros da equipe para distribuir o trabalho.',
        },
      ],
    },
    {
      id: 'geral',
      title: 'Informações Gerais',
      description: 'Dicas e informações úteis',
      icon: '💡',
      sections: [
        {
          title: 'Estrutura do Projeto',
          content:
            'Todo projeto é organizado com um painel principal que oferece acesso às diferentes ferramentas e funcionalidades.',
        },
        {
          title: 'Navegação',
          content:
            'Use a barra lateral para navegar entre as diferentes seções. Clique no ícone de menu em dispositivos móveis para expandir a barra lateral.',
        },
        {
          title: 'Dados e Sincronização',
          content:
            'Todos os dados são salvos automaticamente. As mudanças são sincronizadas em tempo real entre todos os usuários do projeto.',
        },
        {
          title: 'Dicas de Performance',
          content:
            'Para melhor performance, mantenha a janela do navegador atualizada e limpe o cache periodicamente. Use navegadores modernos para melhor compatibilidade.',
        },
      ],
    },
  ];

  constructor(private router: Router) {}

  selectTopic(topic: HelpTopic): void {
    this.selectedTopic = topic;
  }

  backToTopics(): void {
    this.selectedTopic = null;
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
