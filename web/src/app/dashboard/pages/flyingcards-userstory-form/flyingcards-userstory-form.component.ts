import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {} from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { UserStory } from '../../models/userStory';

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
  userStoryFormGroup: any;
  userStory: UserStory;
  membros = new FormControl();
  membrosList = [
    'Breno Lisi Romano',
    'Felipe de Andrade',
    'Gustavo Mansur',
    'Zacarias da Silva',
  ];
  membrosEscolhidos: string[] = [];

  formBuilder: FormBuilder = new FormBuilder();

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.userStory = new UserStory();
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }

  ngOnInit(): void {
    this.userStoryFormGroup = this.formBuilder.group({
      titulo: new FormControl(
        this.userStory?.titulo || '',
        Validators.required
      ),
      responsavel: new FormControl(
        this.userStory?.responsavel || '',
        Validators.required
      ),
      membros: new FormControl(
        this.userStory.membros || [''],
        Validators.required
      ),
      prazo: new FormControl(
        this.userStory?.prazo || new Date().toISOString().split('T')[0],
        Validators.required
      ),
      tags: new FormControl(this.userStory?.tags || '', Validators.required),
    });
  }

  addMembro(event: Event): void {
    const nome = (event.target as HTMLSelectElement).value;

    this.membrosEscolhidos.push(nome);
  }
}
