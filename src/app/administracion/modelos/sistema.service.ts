import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { Sistema } from '../servicios/sistema';

@Injectable({
  providedIn: 'root'
})
export class SistemaService {
  private urlRegiones : string = environment.urlAdmin+`/sistema`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Sistema[]>{
      return this.http.get<Sistema[]>(`${this.urlRegiones}`);
  }
  getByID(id:number): Observable<Sistema[]>{
    return this.http.get<Sistema[]>(`${this.urlRegiones}/${id}`);
}
  createArea(area:Sistema) {
    return this.http.post<Sistema>(`${this.urlRegiones}`, area);
  }

  updateArea(id:number, area:Sistema) {
    return this.http.put<Sistema>(`${this.urlRegiones}/${id}`, area);
  }
}
