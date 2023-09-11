import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IValidationResponse } from '../shared/interfaces/validation';
import { IAuthRequestBody, ILoginResponseBody, IRegisterResponseBody } from '../shared/interfaces/user';
import { ICreateSprintBody, IProject, ISprint, ITask } from '../shared/interfaces/project';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private token: string = '';

  constructor( private http: HttpClient) { }

  // Sets token after successful login or on the project init, if user was authorized 
  public setToken(token: string): void {
    this.token = token;
  }

  // Gets validation rules for login and register forms( email regexp, min length of password, etc.)
  public getValidationRules(): Observable<IValidationResponse> {
    return this.http.get<IValidationResponse>(`${environment.backend_url}/api/validation`);
  }

  // Auth requests

  public register(body: IAuthRequestBody): Observable<IRegisterResponseBody> {
    return this.http.post<IRegisterResponseBody>(`${environment.backend_url}/api/auth/register`, body);
  }

  public login(body: IAuthRequestBody): Observable<ILoginResponseBody> {
    return this.http.post<ILoginResponseBody>(`${environment.backend_url}/api/auth/login`, body);
  }

  public logout(): Observable<void> {    
    return this.http.get<void>(`${environment.backend_url}/api/auth/logout`, { headers: this.autharizationHeader });
  }

  // Projects requests

  public getProjects(): Observable<{ projects: IProject[] }> {
    return this.http.get<{ projects: IProject[] }>(`${environment.backend_url}/api/projects`, { headers: this.autharizationHeader });
  }

  public addProject(body: { name: string, description: string }): Observable<{ project: IProject }> {
    return this.http.post<{ project: IProject }>(`${environment.backend_url}/api/projects/`, body, { headers: this.autharizationHeader });
  }

  public changeProject(id: string, body: { name?: string, description?: string }): Observable<{ project: IProject }> {
    return this.http.put<{ project: IProject }>(`${environment.backend_url}/api/projects/${id}`, body, { headers: this.autharizationHeader });
  }

  public deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}/api/projects/${id}`, { headers: this.autharizationHeader });
  }

  public addParticipant(id: string, email: string): Observable<{ project: IProject }> {
    return this.http.patch<{ project: IProject }>(`${environment.backend_url}/api/projects/${id}/participants`, { email, action: 'add' }, { headers: this.autharizationHeader });
  }

  public deleteParticipant(id: string, email: string): Observable<{ project: IProject }> {
    return this.http.patch<{ project: IProject }>(`${environment.backend_url}/api/projects/${id}/participants`, { email, action: 'delete' }, { headers: this.autharizationHeader });
  }

  // Sprints requests

  public addSprint(body: ICreateSprintBody): Observable<{ sprint: ISprint }> {
    return this.http.post<{ sprint: ISprint }>(`${environment.backend_url}/api/sprints/`, body, { headers: this.autharizationHeader });
  }

  public changeSprint(id: string, name: string, project: string): Observable<{ sprint: ISprint }> {
    return this.http.patch<{ sprint: ISprint}>(`${environment.backend_url}/api/sprints/${id}/name`, { name, project }, { headers: this.autharizationHeader });
  }

  public deleteSprint(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}/api/sprints/${id}`, { headers: this.autharizationHeader });
  }

  // Tasks requests

  public addTask(body: { sprint: string, name: string, scheduledHours: number }): Observable<{ task: ITask }> {
    return this.http.post<{ task: ITask }>(`${environment.backend_url}/api/tasks`, body, { headers: this.autharizationHeader });
  }

  public changeTaskName(id: string, name: string, sprint: string): Observable<{ task: ITask }> {
    return this.http.patch<{ task: ITask }>(`${environment.backend_url}/api/tasks/${id}/name`, { name, sprint }, { headers: this.autharizationHeader });
  }

  public changeTaskSpentHours(id: string, body: { date: string, hours: number }): Observable<{ task: ITask }> {
    return this.http.patch<{ task: ITask }>(`${environment.backend_url}/api/tasks/${id}/spent`, body, { headers: this.autharizationHeader });
  }

  public deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.backend_url}/api/tasks/${id}`, { headers: this.autharizationHeader });
  }

  // Converts message into the key, which we can use for i18 lang file
  public convertMessageFromBackend(message: string): string {
    return message.toUpperCase().split(' ').join('_');
  }

  // Gets auth header
  private get autharizationHeader(): HttpHeaders {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
  }
}
