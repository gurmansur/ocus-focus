import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './containers/dashboard.component';
import { colaboradorGuard, stakeholderGuard } from './guards/role.guard';
import { ArcatestCasosFormComponent } from './pages/arcatest-casos-form/arcatest-casos-form.component';
import { ArcatestCasosComponent } from './pages/arcatest-casos/arcatest-casos.component';
import { ArcatestExecucoesFormComponent } from './pages/arcatest-execucoes-form/arcatest-execucoes-form.component';
import { ArcatestExecucoesComponent } from './pages/arcatest-execucoes/arcatest-execucoes.component';
import { ArcatestPlanosComponent } from './pages/arcatest-planos/arcatest-planos.component';
import { ArcatestSuitesComponent } from './pages/arcatest-suites/arcatest-suites.component';
import { AtoresComponent } from './pages/atores/atores.component';
import { CasoDeUsoComponent } from './pages/caso-de-uso/caso-de-uso.component';
import { CenariosComponent } from './pages/cenarios/cenarios.component';
import { ColaboradoresProjetoComponent } from './pages/colaboradores-projeto/colaboradores-projeto.component';
import { EditarAtoresComponent } from './pages/editar-atores/editar-atores.component';
import { EditarCasoComponent } from './pages/editar-caso/editar-caso.component';
import { EditarCenariosComponent } from './pages/editar-cenarios/editar-cenarios.component';
import { EditarProjetoComponent } from './pages/editar-projeto/editar-projeto.component';
import { EditarRequisitoComponent } from './pages/editar-requisito/editar-requisito.component';
import { EstimativaComponent } from './pages/estimativa/estimativa.component';
import { FatoresAmbientaisComponent } from './pages/fatores-ambientais/fatores-ambientais.component';
import { FatoresTecnicosComponent } from './pages/fatores-tecnicos/fatores-tecnicos.component';
import { InserirAtoresComponent } from './pages/inserir-atores/inserir-atores.component';
import { InserirCasoComponent } from './pages/inserir-caso/inserir-caso.component';
import { InserirCenariosComponent } from './pages/inserir-cenarios/inserir-cenarios.component';
import { InserirColaboradorProjetoComponent } from './pages/inserir-colaborador-projeto/inserir-colaborador-projeto.component';
import { InserirFatorAmbientalComponent } from './pages/inserir-fator-ambiental/inserir-fator-ambiental.component';
import { InserirFatorTecnicoComponent } from './pages/inserir-fator-tecnico/inserir-fator-tecnico.component';
import { InserirProjetoComponent } from './pages/inserir-projeto/inserir-projeto.component';
import { InserirRequisitoComponent } from './pages/inserir-requisito/inserir-requisito.component';
import { InserirStakeholderComponent } from './pages/inserir-stakeholder/inserir-stakeholder.component';
import { PainelArcatestComponent } from './pages/painel-arcatest/painel-arcatest.component';
import { PainelEstimaComponent } from './pages/painel-estima/painel-estima.component';
import { PainelPrioreasyComponent } from './pages/painel-prioreasy/painel-prioreasy.component';
import { PainelStakeholderComponent } from './pages/painel-stakeholder/painel-stakeholder.component';
import { PriorizarRequisitosComponent } from './pages/priorizar-requisitos/priorizar-requisitos.component';
import { ProjetoComponent } from './pages/projeto/projeto.component';
import { ProjetosComponent } from './pages/projetos/projetos.component';
import { RequisitosProjetoComponent } from './pages/requisitos-projeto/requisitos-projeto.component';
import { StakeholdersProjetoComponent } from './pages/stakeholders-projeto/stakeholders-projeto.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'projetos', pathMatch: 'full' },
      {
        path: 'projetos',
        component: ProjetosComponent,
        canActivate: [colaboradorGuard],
      },

      // Projeto
      {
        path: 'inserir-projeto/:id',
        component: InserirProjetoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'editar-projeto/:id',
        component: EditarProjetoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id',
        component: ProjetoComponent,
        canActivate: [colaboradorGuard],
      },

      // Colaboradores Projeto
      {
        path: 'projeto/:id/colaboradores',
        component: ColaboradoresProjetoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-colaborador',
        component: InserirColaboradorProjetoComponent,
        canActivate: [colaboradorGuard],
      },

      // Requisitos Projeto
      {
        path: 'projeto/:id/requisitos',
        component: RequisitosProjetoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-requisito',
        component: InserirRequisitoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/editar-requisito/:idReq',
        component: EditarRequisitoComponent,
        canActivate: [colaboradorGuard],
      },

      // Painel Prioreasy
      {
        path: 'projeto/:id/painel-prioreasy',
        component: PainelPrioreasyComponent,
        canActivate: [colaboradorGuard],
      },

      // Prioreasy - Stakeholders
      {
        path: 'projeto/:id/stakeholders',
        component: StakeholdersProjetoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-stakeholder',
        component: InserirStakeholderComponent,
        canActivate: [colaboradorGuard],
      },

      // Stakeholders
      {
        path: 'painel-stakeholder',
        component: PainelStakeholderComponent,
        canActivate: [stakeholderGuard],
      },
      {
        path: 'priorizacao-stakeholder/:id',
        component: PriorizarRequisitosComponent,
        canActivate: [stakeholderGuard],
      },

      // Estima - Atores

      {
        path: 'projeto/:id/atores',
        component: AtoresComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-atores',
        component: InserirAtoresComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/editar-atores/:idAtor',
        component: EditarAtoresComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Caso de Uso

      {
        path: 'projeto/:idPro/requisitos/:id/caso-de-uso',
        component: CasoDeUsoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:idPro/requisitos/:id/inserir-caso',
        component: InserirCasoComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:idPro/requisitos/:id/editar-caso/:idCaso',
        component: EditarCasoComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Cenários

      {
        path: 'projeto/:idPro/requisitos/:idReq/caso-de-uso/:id/cenarios',
        component: CenariosComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:idPro/requisitos/:idReq/caso-de-uso/:id/inserir-cenarios',
        component: InserirCenariosComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:idPro/requisitos/:idReq/caso-de-uso/:id/editar-cenarios/:idCen',
        component: EditarCenariosComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Fatores Ambientais

      {
        path: 'projeto/:id/fatores-ambientais',
        component: FatoresAmbientaisComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-fator-ambiental',
        component: InserirFatorAmbientalComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Fatores Técnicos

      {
        path: 'projeto/:id/fatores-tecnicos',
        component: FatoresTecnicosComponent,
        canActivate: [colaboradorGuard],
      },
      {
        path: 'projeto/:id/inserir-fator-tecnico',
        component: InserirFatorTecnicoComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Estimativa

      {
        path: 'projeto/:id/estimativa',
        component: EstimativaComponent,
        canActivate: [colaboradorGuard],
      },

      //Estima - Painel Estimativa

      {
        path: 'projeto/:id/painel-estima',
        component: PainelEstimaComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Painel ArcaTest

      {
        path: 'projeto/:id/painel-arcatest',
        component: PainelArcatestComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Execuções de Teste

      {
        path: 'projeto/:id/execucoes-teste',
        component: ArcatestExecucoesComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Casos de Teste

      {
        path: 'projeto/:id/casos-teste',
        component: ArcatestCasosComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Planos de Teste

      {
        path: 'projeto/:id/planos-teste',
        component: ArcatestPlanosComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Suites de Teste

      {
        path: 'projeto/:id/suites-teste',
        component: ArcatestSuitesComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Criar Caso de Teste

      {
        path: 'projeto/:id/casos-teste/criar',
        component: ArcatestCasosFormComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Editar Caso de Teste

      {
        path: 'projeto/:id/casos-teste/:idCaso/editar',
        component: ArcatestCasosFormComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Criar Execução de Teste

      {
        path: 'projeto/:id/execucoes-teste/criar',
        component: ArcatestExecucoesFormComponent,
        canActivate: [colaboradorGuard],
      },

      //ArcaTest - Editar Execução de Teste

      {
        path: 'projeto/:id/execucoes-teste/:idExec/editar',
        component: ArcatestExecucoesFormComponent,
        canActivate: [colaboradorGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), PainelArcatestComponent],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
