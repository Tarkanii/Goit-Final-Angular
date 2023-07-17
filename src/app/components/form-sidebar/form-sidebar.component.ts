import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IStore } from '../../shared/interfaces/store';
import { closeSidebarFormAction } from 'src/app/store/projects/projects.actions';

@Component({
  selector: 'app-form-sidebar',
  templateUrl: './form-sidebar.component.html',
  styleUrls: ['./form-sidebar.component.scss']
})
export class FormSidebarComponent implements OnInit {

  @Input() public open: boolean | null = false;

  constructor(
    private store: Store<IStore>
  ) { }

  ngOnInit(): void {
  }

  public closeSidebar(): void {
    this.store.dispatch(closeSidebarFormAction());
  }

}
