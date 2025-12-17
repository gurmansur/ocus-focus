import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AcaoDeTesteDto,
  CreateAcaoDeTesteDto,
  UpdateAcaoDeTesteDto,
} from '../models/test-flow.models';

@Injectable({ providedIn: 'root' })
export class AcaoDeTesteService {
  private baseUrl = `${environment.apiBaseUrl}/acao-de-teste`;

  constructor(private http: HttpClient) {}

  findByCasoDeTesteId(casoDeTesteId: number): Observable<AcaoDeTesteDto[]> {
    return this.http.get<AcaoDeTesteDto[]>(
      `${this.baseUrl}?casoDeTesteId=${casoDeTesteId}`
    );
  }

  create(data: CreateAcaoDeTesteDto): Observable<AcaoDeTesteDto> {
    return this.http.post<AcaoDeTesteDto>(this.baseUrl, data);
  }

  update(id: number, data: UpdateAcaoDeTesteDto): Observable<AcaoDeTesteDto> {
    return this.http.patch<AcaoDeTesteDto>(`${this.baseUrl}/${id}`, data);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
