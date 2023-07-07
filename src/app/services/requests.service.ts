import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IValidationResponse } from '../shared/interfaces/validation';
import { IAuthRequestBody, ILoginResponseBody, IRegisterResponseBody } from '../shared/interfaces/user';
import { IProject } from '../shared/interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private token: string = '';

  constructor( private http: HttpClient) { }

  public setToken(token: string): void {
    this.token = token;
  }

  public getValidationRules(): Observable<IValidationResponse> {
    return this.http.get<IValidationResponse>(`${environment.backend_url}/api/validation`);
  }

  public register(body: IAuthRequestBody): Observable<IRegisterResponseBody> {
    return this.http.post<IRegisterResponseBody>(`${environment.backend_url}/api/auth/register`, body);
  }

  public login(body: IAuthRequestBody): Observable<ILoginResponseBody> {
    return this.http.post<ILoginResponseBody>(`${environment.backend_url}/api/auth/login`, body);
  }

  public logout(): Observable<void> {
    
    return this.http.get<void>(`${environment.backend_url}/api/auth/logout`, { headers: this.autharizationHeader });
  }

  public getProjects(): Observable<{ projects: IProject[] }> {
    return this.http.get<{ projects: IProject[] }>(`${environment.backend_url}/api/projects`, { headers: this.autharizationHeader });
  }

  public deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}/api/projects/${id}`, { headers: this.autharizationHeader });
  }

  public convertMessageFromBackend(message: string): string {
    return message.toUpperCase().split(' ').join('_');
  }

  private get autharizationHeader(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  }
}
