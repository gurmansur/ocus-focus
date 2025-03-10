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
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { SendIconComponent } from 'src/app/shared/icons/send-icon/send-icon.component';
import { ThreeDotsIconComponent } from 'src/app/shared/icons/three-dots-icon/three-dots-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { Colaborador } from '../../models/colaborador';
import { Comentario } from '../../models/comentario';
import { UserStory } from '../../models/userStory';
import { ColaboradorService } from '../../services/colaborador.service';
import { ComentarioService } from '../../services/comentario.service';
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
    PlusIconComponent,
    ButtonComponent,
    SendIconComponent,
    ThreeDotsIconComponent,
  ],
  templateUrl: './flyingcards-userstory-form.component.html',
  styleUrl: './flyingcards-userstory-form.component.css',
})
export class FlyingcardsUserstoryFormComponent implements OnInit {
  private projectId: number;
  private kanbanId: number = -1;

  isEdit: boolean = false;
  usId: number = -1;

  userStoryFormGroup: any;
  criador = Number(localStorage.getItem('usu_id'));
  userStory: UserStory;
  usuarios: Colaborador[] = [];
  swimlanes: ISelectSwimlane[] = [];
  comentarios: Comentario[] = [];
  newComentario: string = '';

  formBuilder: FormBuilder = new FormBuilder();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colaboradorService: ColaboradorService,
    private kanbanService: KanbanService,
    private comentarioService: ComentarioService
  ) {
    this.projectId = parseInt(this.route.snapshot.params['id']);
    this.isEdit = this.route.snapshot.params['usId'] ? true : false;
    if (this.isEdit) this.usId = parseInt(this.route.snapshot.params['usId']);
    this.userStory = new UserStory();
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }

  ngOnInit(): void {
    this.newComentario = '';
    this.colaboradorService
      .findAllFromProject(this.projectId)
      .subscribe((colaboradores) => {
        this.usuarios = colaboradores;
      });

    this.kanbanService
      .getSwimlaneFromProject(this.projectId)
      .subscribe((swimlanes) => {
        this.swimlanes = swimlanes;
      });

    this.kanbanService.getKanbanId(this.projectId).subscribe((kanban) => {
      this.kanbanId = kanban;
    });

    this.comentarioService
      .getComentariosUserStory(this.usId)
      .subscribe((comentarios) => {
        console.log(comentarios);
        this.comentarios = comentarios;
      });

    if (this.isEdit) {
      this.kanbanService.findUserStory(this.usId).subscribe((userStory) => {
        this.userStoryFormGroup.patchValue(userStory);
      });
    }

    this.userStoryFormGroup = this.formBuilder.group({
      titulo: new FormControl<string>(
        this.userStory?.titulo || '',
        Validators.required
      ),
      descricao: new FormControl<string>(
        this.userStory.descricao || '',
        Validators.required
      ),
      responsavel: new FormControl<number | string>(
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

  handleUserStory() {
    if (!this.isEdit) {
      const newUserStory = {
        ...this.userStoryFormGroup.value,
        projeto: +this.projectId,
        criador: +this.criador,
        kanban: +this.kanbanId,
      };

      this.kanbanService
        .createUserStory(newUserStory)
        .subscribe({ next: () => this.navigateToKanban() });
    } else {
      let editedUserStory: EditUserstory = {
        ...this.userStoryFormGroup.value,
        projeto: +this.projectId,
        criador: +this.criador,
        kanban: +this.kanbanId,
      };

      editedUserStory.responsavel = editedUserStory.responsavel.toString();
      editedUserStory.swimlane = editedUserStory.swimlane.toString();
      editedUserStory.estimativa_tempo =
        editedUserStory.estimativa_tempo.toString();

      this.kanbanService.updateUserStory(this.usId, editedUserStory).subscribe({
        next: () => this.navigateToKanban(),
      });
    }
  }

  deletarUserStory() {
    this.kanbanService.deletarUserStory(this.usId).subscribe({
      next: () => this.navigateToKanban(),
    });
  }

  enviarComentario() {
    const novo_comentario: IPostComentario = {
      comentario: this.newComentario,
      user_story_id: this.usId,
      usuario_id: this.criador,
    };

    this.comentarioService.postComentario(novo_comentario).subscribe((id) => {
      this.comentarios.push({
        comentario: this.newComentario,
        nome_usuario: localStorage.getItem('usu_name') || '<Nome não definido>',
        user_story_id: this.usId,
        id: id,
      });

      this.newComentario = '';
    });
  }
}

interface ISelectSwimlane {
  id: number;
  nome: string;
}

interface EditUserstory {
  titulo: string;
  descricao: string;
  responsavel: string;
  estimativa_tempo: string;
  swimlane: string;
  projeto: number;
  criador: number;
  kanban: number;
}

interface IPostComentario {
  comentario: string;
  usuario_id: number;
  user_story_id: number;
}
