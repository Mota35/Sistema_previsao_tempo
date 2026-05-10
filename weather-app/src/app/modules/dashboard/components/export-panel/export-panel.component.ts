import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-export-panel',
  templateUrl: './export-panel.component.html',
  styleUrls: ['./export-panel.component.scss'],
})
export class ExportPanelComponent {
  @Output() exportCSV = new EventEmitter<void>();
  @Output() exportPDF = new EventEmitter<void>();
}
