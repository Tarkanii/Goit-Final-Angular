import { Component, OnInit } from '@angular/core';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
  
})
export class AuthPageComponent implements OnInit {

  constructor(
    private formService: FormsService
  ) { }

  ngOnInit(): void {
    this.formService.getValidationRules();
  }

}
