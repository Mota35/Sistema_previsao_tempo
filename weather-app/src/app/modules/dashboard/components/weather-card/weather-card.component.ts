import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WeatherData } from '../../../../core/models/models';
import { WeatherService } from '../../../../core/services/weather.service';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.scss'],
})
export class WeatherCardComponent {
  @Input() data!: WeatherData;
  @Input() isFavorite = false;
  @Output() addFavorite = new EventEmitter<void>();

  constructor(public weatherSvc: WeatherService) {}
}
