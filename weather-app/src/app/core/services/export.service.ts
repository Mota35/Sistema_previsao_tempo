import { Injectable } from '@angular/core';
import { HistoricoConsulta, CidadeFavorita } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ExportService {

  // ── CSV ─────────────────────────────────────────────────────────────────────
  exportHistoricoCSV(data: HistoricoConsulta[]): void {
    const headers = ['ID', 'Cidade', 'Temperatura (°C)', 'Clima', 'Data'];
    const rows    = data.map(h => [
      h.id, h.cidade_consultada, h.temperatura, h.clima, h.data_consulta
    ]);
    this.downloadCSV('historico_consultas', headers, rows);
  }

  exportFavoritasCSV(data: CidadeFavorita[]): void {
    const headers = ['ID', 'Cidade', 'País', 'Adicionada Em'];
    const rows    = data.map(f => [f.id, f.nome_cidade, f.pais, f.adicionada_em]);
    this.downloadCSV('cidades_favoritas', headers, rows);
  }

  private downloadCSV(filename: string, headers: string[], rows: any[][]): void {
    const BOM = '\uFEFF';
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines  = [
      headers.map(escape).join(','),
      ...rows.map(r => r.map(escape).join(',')),
    ];
    const blob = new Blob([BOM + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, `${filename}_${this.stamp()}.csv`);
  }

  // ── PDF (browser print via hidden iframe) ──────────────────────────────────
  exportHistoricoPDF(data: HistoricoConsulta[], userName: string): void {
    const rows = data.map(h => `
      <tr>
        <td>${h.cidade_consultada}</td>
        <td>${h.temperatura}°C</td>
        <td>${h.clima}</td>
        <td>${new Date(h.data_consulta).toLocaleString()}</td>
      </tr>`).join('');

    const html = this.pdfTemplate('Histórico de Consultas', userName, `
      <table>
        <thead><tr><th>Cidade</th><th>Temperatura</th><th>Clima</th><th>Data</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`);
    this.printHTML(html);
  }

  exportFavoritasPDF(data: CidadeFavorita[], userName: string): void {
    const rows = data.map(f => `
      <tr>
        <td>${f.nome_cidade}</td>
        <td>${f.pais}</td>
        <td>${new Date(f.adicionada_em).toLocaleString()}</td>
      </tr>`).join('');

    const html = this.pdfTemplate('Cidades Favoritas', userName, `
      <table>
        <thead><tr><th>Cidade</th><th>País</th><th>Adicionada Em</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`);
    this.printHTML(html);
  }

  private pdfTemplate(title: string, user: string, content: string): string {
    return `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; padding: 2rem; color: #1a1a2e; }
      h1   { font-size: 1.5rem; border-bottom: 2px solid #4fc3f7; padding-bottom: .5rem; }
      p    { color: #666; font-size: .875rem; margin: .25rem 0 1.5rem; }
      table{ width: 100%; border-collapse: collapse; }
      th   { background: #0d47a1; color: #fff; padding: .6rem 1rem; text-align: left; font-size:.8rem; }
      td   { padding: .5rem 1rem; border-bottom: 1px solid #e0e0e0; font-size: .85rem; }
      tr:nth-child(even) td { background: #f5f5f5; }
    </style></head><body>
    <h1>${title}</h1>
    <p>Gerado em ${new Date().toLocaleString()} • ${user}</p>
    ${content}
    </body></html>`;
  }

  private printHTML(html: string): void {
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private stamp(): string {
    return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  }
}
