import { Component, Input, OnInit } from '@angular/core';
import { ISprint } from '../../interfaces/project';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
  
  @Input() public sprint!: ISprint;
  public dateFormat: string = 'dd MMM y';

  constructor() { }

  ngOnInit(): void {
  }

}
