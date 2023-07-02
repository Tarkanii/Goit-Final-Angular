import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IValidationResponse } from '../shared/interfaces/validation';
import { IAuthRequestBody, ILoginResponseBody, IRegisterResponseBody } from '../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor( private http: HttpClient) { }

  public getValidationRules(): Observable<IValidationResponse> {
    return this.http.get<IValidationResponse>(`${environment.backend_url}/api/validation`);
  }

  public register(body: IAuthRequestBody): Observable<IRegisterResponseBody> {
    return this.http.post<IRegisterResponseBody>(`${environment.backend_url}/api/auth/register`, body);
  }

  public login(body: IAuthRequestBody): Observable<ILoginResponseBody> {
    return this.http.post<ILoginResponseBody>(`${environment.backend_url}/api/auth/login`, body);
  }

  public logout(token: string): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    })
    
    return this.http.get<void>(`${environment.backend_url}/api/auth/logout`, { headers });
  }
}
