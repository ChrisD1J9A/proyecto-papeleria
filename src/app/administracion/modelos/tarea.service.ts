import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Tarea } from '../servicios/tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {
  private urlPerfiles : string = environment.urlAdmin+`/tarea`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tarea[]>{
      return this.http.get<Tarea[]>(`${this.urlPerfiles}`);
  }
  getByID(id:number): Observable<Tarea[]>{
    return this.http.get<Tarea[]>(`${this.urlPerfiles}/${id}`);
}
getByIDSietma(id:number): Observable<Tarea[]>{
  return this.http.get<Tarea[]>(`${this.urlPerfiles}/${id}/sistema`);
}
  create(tarea:Tarea): Observable<Tarea>{
    return this.http.post<Tarea>(`${this.urlPerfiles}`, tarea);
  }
  update(id:number,tarea:Tarea): Observable<Tarea>{
    return this.http.put<Tarea>(`${this.urlPerfiles}/{id}`, tarea);
  }


}
