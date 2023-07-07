import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent implements OnInit {

  @Input() public mainButton: boolean = false;
  @Input() public addType: 'project' | 'sprint' | 'task' = 'project';
  @Output() public buttonClick: EventEmitter<void> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  public onClick(): void {
    this.buttonClick.emit();
  }

}
