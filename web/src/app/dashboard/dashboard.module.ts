import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './containers/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ArcatestFileTreeComponent } from './pages/arcatest-file-tree/arcatest-file-tree.component';
import { AtoresComponent } from './pages/atores/atores.component';
import { CasoDeUsoComponent } from './pages/caso-de-uso/caso-de-uso.component';
import { CenariosComponent } from './pages/cenarios/cenarios.component';
import { ColaboradoresProjetoComponent } from './pages/colaboradores-projeto/colaboradores-projeto.component';
import { ConfiguracaoSeleniumFormComponent } from './pages/configuracao-selenium-form/configuracao-selenium-form.component';
import { ConfiguracaoSeleniumComponent } from './pages/configuracao-selenium/configuracao-selenium.component';
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
import { TestExecutionModalComponent } from './pages/shared/test-execution-modal/test-execution-modal.component';
import { StakeholdersProjetoComponent } from './pages/stakeholders-projeto/stakeholders-projeto.component';
import { DialogoConfirmacaoComponent } from './shared/dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from './shared/dialogo-mensagem/dialogo-mensagem.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarItemComponent } from './shared/sidebar-item/sidebar-item.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TabelaComponent } from './shared/tabela/tabela.component';

@NgModule({
  declarations: [
    ProjetosComponent,
    DashboardComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    SidebarItemComponent,
    TabelaComponent,
    AtoresComponent,
    InserirAtoresComponent,
    EditarAtoresComponent,
    CasoDeUsoComponent,
    EditarCasoComponent,
    InserirCasoComponent,
    CenariosComponent,
    InserirCenariosComponent,
    EditarCenariosComponent,
    FatoresTecnicosComponent,
    FatoresAmbientaisComponent,
    EstimativaComponent,
    InserirProjetoComponent,
    EditarProjetoComponent,
    DialogoConfirmacaoComponent,
    ProjetoComponent,
    ColaboradoresProjetoComponent,
    InserirColaboradorProjetoComponent,
    RequisitosProjetoComponent,
    InserirRequisitoComponent,
    EditarRequisitoComponent,
    PainelPrioreasyComponent,
    StakeholdersProjetoComponent,
    InserirStakeholderComponent,
    PainelStakeholderComponent,
    PriorizarRequisitosComponent,
    InserirFatorAmbientalComponent,
    InserirFatorTecnicoComponent,
    PainelEstimaComponent,
    DialogoMensagemComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PainelArcatestComponent,
    ArcatestFileTreeComponent,
    ConfiguracaoSeleniumComponent,
    ConfiguracaoSeleniumFormComponent,
    TestExecutionModalComponent,
  ],
})
export class DashboardModule {}
