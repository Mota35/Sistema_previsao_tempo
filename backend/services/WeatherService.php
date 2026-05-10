<?php

class WeatherService {
    private string $apiKey  = '1575f1947fc68e88f4dbf4bb9de8a9fe';
    private string $baseUrl = 'https://api.openweathermap.org/data/2.5';
    private string $units   = 'metric'; // metric = Celsius
    private string $lang    = 'pt';

    /**
     * Fetch current weather for a city name.
     */
    public function getCurrentWeather(string $city, ?string $country = null): array {
        $query = $country ? "{$city},{$country}" : $city;
        $url   = "{$this->baseUrl}/weather?" . http_build_query([
            'q'     => $query,
            'appid' => $this->apiKey,
            'units' => $this->units,
            'lang'  => $this->lang,
        ]);
        return $this->request($url);
    }

    /**
     * Fetch 5-day / 3-hour forecast.
     */
    public function getForecast(string $city, ?string $country = null): array {
        $query = $country ? "{$city},{$country}" : $city;
        $url   = "{$this->baseUrl}/forecast?" . http_build_query([
            'q'     => $query,
            'appid' => $this->apiKey,
            'units' => $this->units,
            'lang'  => $this->lang,
        ]);
        return $this->request($url);
    }

    /**
     * Fetch weather by geographic coordinates.
     */
    public function getWeatherByCoords(float $lat, float $lon): array {
        $url = "{$this->baseUrl}/weather?" . http_build_query([
            'lat'   => $lat,
            'lon'   => $lon,
            'appid' => $this->apiKey,
            'units' => $this->units,
            'lang'  => $this->lang,
        ]);
        return $this->request($url);
    }

    /**
     * Parse the relevant fields from a weather API response.
     */
    public function parse(array $data): array {
        return [
            'cidade'      => $data['name'] ?? '',
            'pais'        => $data['sys']['country'] ?? '',
            'temperatura' => $data['main']['temp'] ?? 0,
            'sensacao'    => $data['main']['feels_like'] ?? 0,
            'humidade'    => $data['main']['humidity'] ?? 0,
            'clima'       => $data['weather'][0]['description'] ?? '',
            'icone'       => $data['weather'][0]['icon'] ?? '',
            'vento'       => $data['wind']['speed'] ?? 0,
            'visibilidade'=> ($data['visibility'] ?? 0) / 1000, // km
            'pressao'     => $data['main']['pressure'] ?? 0,
        ];
    }

    private function request(string $url): array {
        $ctx = stream_context_create(['http' => [
            'timeout' => 10,
            'header'  => 'Accept: application/json',
        ]]);
        $response = @file_get_contents($url, false, $ctx);

        if ($response === false) {
            throw new RuntimeException('Erro ao conectar com a API do OpenWeatherMap.');
        }

        $data = json_decode($response, true);

        if (isset($data['cod']) && (int)$data['cod'] !== 200) {
            throw new RuntimeException($data['message'] ?? 'Erro na API do OpenWeatherMap.', (int)$data['cod']);
        }

        return $data;
    }
}
