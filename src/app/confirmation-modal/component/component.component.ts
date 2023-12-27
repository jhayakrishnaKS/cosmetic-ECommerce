import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-component',
  templateUrl: './component.component.html',
  styleUrls: ['./component.component.css']
})
export class ComponentComponent {
  @Input() title: string = 'Confirmation';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
 
  onConfirm() {
    this.confirm.emit();
  }
 
  onCancel() {
    this.cancel.emit();
  }

}
