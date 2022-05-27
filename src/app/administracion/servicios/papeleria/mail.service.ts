import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mail } from '../../modelos/papeleria/Mail';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private urlEndPoint: string = environment.apiUrl + 'correo';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient,
              ) { }

  /**
   * @param mail
   * @returns servicio que recibe un objeto correo, para ser enviado
   */
  enviar(mail: Mail) : Observable<Mail> {
    return this.http.post<Mail>(this.urlEndPoint, mail, {headers: this.httpHeaders})
  }

}
