import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../../../core/services/weather.service';
import { ExportService } from '../../../../core/services/export.service';
import { HistoricoConsulta } from '../../../../core/models/models';
import { I18nService } from '../../../../core/services/theme-i18n.service';

@Component({
  selector: 'app-history-table',
  templateUrl: './history-table.component.html',
  styleUrls: ['./history-table.component.scss'],
})
export class HistoryTableComponent implements OnInit {
  history: HistoricoConsulta[] = [];
  loading    = false;
  error      = '';
  successMsg = '';
  filterText = '';

  constructor(
    private weatherSvc: WeatherService,
    private exportSvc: ExportService,
    public  i18n: I18nService,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.weatherSvc.getHistorico().subscribe({
      next:  (r) => { this.history = r.data ?? []; this.loading = false; },
      error: ()  => this.loading = false,
    });
  }

  clear(): void {
    if (!confirm('Apagar todo o histórico?')) return;
    this.weatherSvc.limparHistorico().subscribe({
      next: () => { this.history = []; this.successMsg = 'Histórico eliminado.'; },
      error: (e) => this.error = e.error?.message,
    });
  }

  exportCSV(): void { this.exportSvc.exportHistoricoCSV(this.filteredHistory); }
  exportPDF(): void { this.exportSvc.exportHistoricoPDF(this.filteredHistory, ''); }

  get filteredHistory(): HistoricoConsulta[] {
    const q = this.filterText.toLowerCase();
    return q
      ? this.history.filter(h => h.cidade_consultada.toLowerCase().includes(q))
      : this.history;
  }
}
