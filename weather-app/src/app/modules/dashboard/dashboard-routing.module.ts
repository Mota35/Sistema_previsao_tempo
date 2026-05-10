import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { AdminLogsComponent } from './components/admin-logs/admin-logs.component';

const routes: Routes = [
  {
    path: '', canActivate: [AuthGuard], children: [
      { path: '',          component: DashboardHomeComponent },
      { path: 'favorites', component: FavoritesListComponent },
      { path: 'history',   component: HistoryTableComponent  },
      { path: 'admin',     component: AdminLogsComponent, canActivate: [AuthGuard], data: { roles: ['admin'] } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
