import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { Colaborador } from '../../models/colaborador';
import { UserStory } from '../../models/userStory';
import { ColaboradorService } from '../../services/colaborador.service';
import { KanbanService } from '../../services/kanban.service';

@Component({
  selector: 'app-flyingcards-userstory-form',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatSelectModule,
    ProjectHeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    PlusIconComponent,
    ButtonComponent,
  ],
  templateUrl: './flyingcards-userstory-form.component.html',
  styleUrl: './flyingcards-userstory-form.component.css',
})
export class FlyingcardsUserstoryFormComponent implements OnInit {
  private projectId: number;
  private kanbanId: number = -1;
  userStoryFormGroup: any;
  criador = Number(localStorage.getItem('usu_id'));
  userStory: UserStory;
  usuarios: Colaborador[] = [];
  swimlanes: ISelectSwimlane[] = [];

  formBuilder: FormBuilder = new FormBuilder();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colaboradorService: ColaboradorService,
    private kanbanService: KanbanService
  ) {
    this.projectId = parseInt(this.route.snapshot.params['id']);
    this.userStory = new UserStory();
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }

  ngOnInit(): void {
    this.colaboradorService
      .findAllFromProject(this.projectId)
      .subscribe((colaboradores) => {
        this.usuarios = colaboradores;
      });

    console.log(this.usuarios);

    this.kanbanService
      .getSwimlaneFromProject(this.projectId)
      .subscribe((swimlanes) => {
        this.swimlanes = swimlanes;
      });

    this.kanbanService.getKanbanId(this.projectId).subscribe((kanban) => {
      this.kanbanId = kanban;
    });

    this.userStoryFormGroup = this.formBuilder.group({
      titulo: new FormControl(
        this.userStory?.titulo || '',
        Validators.required
      ),
      descricao: new FormControl(
        this.userStory.descricao || '',
        Validators.required
      ),
      responsavel: new FormControl<number>(
        this.userStory?.responsavel || -1,
        Validators.required
      ),
      estimativa_tempo: new FormControl<number>(
        this.userStory?.estimativa_tempo || 0,
        Validators.required
      ),
      swimlane: new FormControl<number>(
        this.userStory?.swimlane || -1,
        Validators.required
      ),
    });
  }

  createUserStory() {
    const newUserStory = {
      ...this.userStoryFormGroup.value,
      projeto: +this.projectId,
      criador: +this.criador,
      kanban: +this.kanbanId,
    };

    console.log(newUserStory);

    this.kanbanService
      .createUserStory(newUserStory)
      .subscribe({ next: () => this.navigateToKanban() });
  }

  // addMembro(event: Event): void {
  //   const nome = (event.target as HTMLSelectElement).value;

  //   this.membrosEscolhidos.push(nome);
  // }
}

interface ISelectSwimlane {
  id: number;
  nome: string;
}
