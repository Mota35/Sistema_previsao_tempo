import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { WeatherCardComponent } from './components/weather-card/weather-card.component';
import { ForecastCardComponent } from './components/forecast-card/forecast-card.component';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';
import { HistoryTableComponent } from './components/history-table/history-table.component';
import { AdminLogsComponent } from './components/admin-logs/admin-logs.component';
import { ExportPanelComponent } from './components/export-panel/export-panel.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    WeatherCardComponent,
    ForecastCardComponent,
    FavoritesListComponent,
    HistoryTableComponent,
    AdminLogsComponent,
    ExportPanelComponent,
  ],
  imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
