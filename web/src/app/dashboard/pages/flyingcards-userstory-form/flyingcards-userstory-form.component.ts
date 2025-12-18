import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { Colaborador } from '../../models/colaborador';
import { UserStory } from '../../models/userStory';
import { CasoUsoService } from '../../services/casoUso.service';
import { ColaboradorService } from '../../services/colaborador.service';
import { KanbanService } from '../../services/kanban.service';
import { UserStoryService } from '../../services/user-story.service';

@Component({
  selector: 'app-flyingcards-userstory-form',
  standalone: true,
  imports: [
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

  isEdit: boolean = false;
  usId: number = -1;

  userStoryFormGroup: any;
  criador = Number(localStorage.getItem('usu_id'));
  userStory: UserStory;
  usuarios: Colaborador[] = [];
  swimlanes: ISelectSwimlane[] = [];
  linkedCasos: any[] = [];
  availableCasos: any[] = [];
  filteredCasos$!: Observable<any[]>;
  casoSearchControl = new FormControl<string>('');
  selectedCasoId: number | null = null;
  loadingCasos = false;
  linking = false;
  showCasoOptions = false;

  formBuilder: FormBuilder = new FormBuilder();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private colaboradorService: ColaboradorService,
    private kanbanService: KanbanService,
    private casoUsoService: CasoUsoService,
    private userStoryService: UserStoryService,
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
    this.userStoryFormGroup = this.formBuilder.group({
      titulo: new FormControl<string>(
        this.userStory?.titulo || '',
        Validators.required,
      ),
      descricao: new FormControl<string>(
        this.userStory.descricao || '',
        Validators.required,
      ),
      responsavel: new FormControl<number | string>(
        this.userStory?.responsavel && Number(this.userStory.responsavel) > 0
          ? this.userStory.responsavel
          : '',
        Validators.required,
      ),
      estimativa_tempo: new FormControl<string>(
        this.userStory?.estimativa_tempo && this.userStory.estimativa_tempo > 0
          ? this.userStory.estimativa_tempo.toString()
          : '',
        Validators.required,
      ),
      swimlane: new FormControl<number | string>(
        this.userStory?.swimlane && Number(this.userStory.swimlane) > 0
          ? this.userStory.swimlane
          : '',
        Validators.required,
      ),
    });

    this.setupCasoUsoFilter();

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

    if (this.isEdit) {
      this.kanbanService.findUserStory(this.usId).subscribe((userStory) => {
        this.userStoryFormGroup.patchValue(userStory);
        this.loadCasosUso();
      });
    }
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

  private setupCasoUsoFilter(): void {
    this.filteredCasos$ = this.casoSearchControl.valueChanges.pipe(
      startWith(''),
      map((term) => this.filterCasos(term || '')),
    );
  }

  private filterCasos(term: string): any[] {
    const query = term.toLowerCase().trim();
    return this.availableCasos.filter((caso) =>
      (caso?.nome || '').toLowerCase().includes(query),
    );
  }

  private loadCasosUso(): void {
    if (!this.usId) return;
    this.loadingCasos = true;

    this.userStoryService.getCasosUso(this.usId).subscribe({
      next: (casos) => {
        this.linkedCasos = casos || [];
        this.loadAvailableCasos();
      },
      error: () => {
        this.loadingCasos = false;
      },
    });
  }

  private loadAvailableCasos(): void {
    this.casoUsoService.list(this.projectId).subscribe({
      next: (resp: any) => {
        const items = resp?.items || resp || [];
        this.availableCasos = items.filter(
          (caso: any) =>
            !this.linkedCasos.some((linked) => linked.id === caso.id),
        );
        this.selectedCasoId = null;
        this.loadingCasos = false;
        this.casoSearchControl.setValue(this.casoSearchControl.value || '');
      },
      error: () => {
        this.loadingCasos = false;
      },
    });
  }

  onSelectCasoUso(casoUsoId: number): void {
    this.selectedCasoId = casoUsoId;
  }

  selectCasoUso(caso: any): void {
    this.selectedCasoId = caso.id;
    this.casoSearchControl.setValue(caso.nome, { emitEvent: false });
    this.showCasoOptions = false;
  }

  openCasoDropdown(): void {
    if (this.loadingCasos || !this.availableCasos.length) return;
    this.showCasoOptions = true;
  }

  closeCasoDropdown(): void {
    // Delay to allow click selection before hiding
    setTimeout(() => (this.showCasoOptions = false), 120);
  }

  addCasoUso(): void {
    if (!this.usId || !this.selectedCasoId) return;
    this.linking = true;

    this.userStoryService
      .linkCasoUso(this.usId, this.selectedCasoId)
      .subscribe({
        next: () => {
          this.loadCasosUso();
          this.selectedCasoId = null;
          this.casoSearchControl.setValue('');
          this.showCasoOptions = false;
          this.linking = false;
        },
        error: () => {
          this.linking = false;
        },
      });
  }

  removeCasoUso(casoUsoId: number): void {
    if (!this.usId) return;
    this.linking = true;

    this.userStoryService.unlinkCasoUso(this.usId, casoUsoId).subscribe({
      next: () => {
        this.loadCasosUso();
        this.linking = false;
      },
      error: () => {
        this.linking = false;
      },
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
