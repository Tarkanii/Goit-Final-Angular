import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IValidationRules } from '../shared/interfaces/validation';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor( private http: HttpClient) { }

  public getValidationRules(): Observable<{data: IValidationRules}> {
    return this.http.get<{data: IValidationRules}>(`${environment.backend_url}/api/validation`);
  }
}
