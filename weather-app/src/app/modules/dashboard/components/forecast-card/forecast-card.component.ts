import { Component, Input } from '@angular/core';
import { ForecastItem } from '../../../../core/models/models';
import { WeatherService } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-forecast-card',
  templateUrl: './forecast-card.component.html',
  styleUrls: ['./forecast-card.component.scss'],
})
export class ForecastCardComponent {
  @Input() item!: ForecastItem;
  constructor(public ws: WeatherService) {}
}
