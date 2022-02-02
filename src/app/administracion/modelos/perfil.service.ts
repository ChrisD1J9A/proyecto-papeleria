import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Perfil } from '../servicios/perfil';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private urlPerfiles : string = environment.urlAdmin+`/perfiles`;

  constructor(private http: HttpClient) { }

  getAllPerfiles(): Observable<Perfil[]>{
      return this.http.get<Perfil[]>(`${this.urlPerfiles}`);
  }

  getById(id: any): Observable<Perfil>{
      return this.http.get<Perfil>(`${this.urlPerfiles}/${id}`);
  }

  deletePerfil(id: any) {
    return this.http.delete(`${this.urlPerfiles}/${id}`);
  }

  createPerfil(perfil: any) {
    return this.http.post<Perfil>(this.urlPerfiles, perfil);
  }

  updatePerfil(id: any, perfil: any) {
    return this.http.put<Perfil>(`${this.urlPerfiles}/${id}`, perfil);
  }

  getByNombrePerfil(nomPerfil: any) {
    return this.http.get<Perfil>(`${this.urlPerfiles}/${nomPerfil}/nombrePerfil`);
  }
}