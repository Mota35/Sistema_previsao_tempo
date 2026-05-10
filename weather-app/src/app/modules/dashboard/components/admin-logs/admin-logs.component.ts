import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { ExportService } from '../../../../core/services/export.service';
import { HistoricoConsulta, User } from '../../../../core/models/models';

type Tab = 'historico' | 'utilizadores';

@Component({
  selector: 'app-admin-logs',
  templateUrl: './admin-logs.component.html',
  styleUrls: ['./admin-logs.component.scss'],
})
export class AdminLogsComponent implements OnInit {
  activeTab: Tab = 'historico';
  logs: (HistoricoConsulta & { utilizador?: string; email?: string })[] = [];
  filterText = '';
  users: User[] = [];
  usersFilter  = '';
  loading    = false;
  error      = '';
  successMsg = '';

  constructor(private adminSvc: AdminService, private exportSvc: ExportService) {}

  ngOnInit(): void { this.loadHistory(); this.loadUsers(); }
  setTab(tab: Tab): void { this.activeTab = tab; }

  loadHistory(): void {
    this.loading = true;
    this.adminSvc.getAllHistory(500).subscribe({
      next:  (r) => { this.logs = r.data ?? []; this.loading = false; },
      error: (e) => { this.error = e.error?.message ?? 'Erro.'; this.loading = false; },
    });
  }

  get filteredLogs() {
    const q = this.filterText.toLowerCase();
    return q ? this.logs.filter((l: any) =>
      l.cidade_consultada.toLowerCase().includes(q) ||
      (l.email ?? '').toLowerCase().includes(q) ||
      (l.utilizador ?? '').toLowerCase().includes(q)
    ) : this.logs;
  }

  exportCSV(): void { this.exportSvc.exportHistoricoCSV(this.filteredLogs); }
  exportPDF(): void { this.exportSvc.exportHistoricoPDF(this.filteredLogs, 'Admin'); }

  loadUsers(): void {
    this.adminSvc.getAllUsers().subscribe({
      next: (r) => this.users = r.data ?? [],
      error: () => {},
    });
  }

  get filteredUsers() {
    const q = this.usersFilter.toLowerCase();
    return q ? this.users.filter(u =>
      u.nome.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ) : this.users;
  }

  toggleRole(user: User): void {
    const newRole: 'admin' | 'utilizador' = user.role === 'admin' ? 'utilizador' : 'admin';
    if (!confirm(`Alterar role de "${user.nome}" para "${newRole}"?`)) return;
    this.adminSvc.updateRole(user.id, newRole).subscribe({
      next: () => { user.role = newRole; this.successMsg = `Role de ${user.nome} → ${newRole}.`; },
      error: (e: any) => this.error = e.error?.message,
    });
  }

  deleteUser(user: User): void {
    if (!confirm(`Eliminar "${user.nome}"? Esta acção é irreversível.`)) return;
    this.adminSvc.deleteUser(user.id).subscribe({
      next: () => { this.users = this.users.filter(u => u.id !== user.id); this.successMsg = 'Utilizador eliminado.'; },
      error: (e: any) => this.error = e.error?.message,
    });
  }
}
