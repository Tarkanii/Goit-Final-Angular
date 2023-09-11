import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss']
})
export class AddButtonComponent {

  @Input() public mainButton: boolean = false;
  @Input() public addType: 'project' | 'sprint' | 'task' = 'project';
  @Output() public buttonClick: EventEmitter<void> = new EventEmitter();

  constructor() { }

  public onClick(): void {
    this.buttonClick.emit();
  }

}
