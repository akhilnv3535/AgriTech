import { fetchWeatherApi } from 'openmeteo';


const WeatherDashboard = async () => {
    const params = {
        "latitude": 17.384,
        "longitude": 78.4564,
        "daily": ["temperature_2m_max", "temperature_2m_min", "sunrise", "sunset", "uv_index_max", "rain_sum"],
        "hourly": ["temperature_2m", "soil_temperature_0cm", "soil_moisture_0_to_1cm", "rain", "showers", "relative_humidity_2m", "visibility", "evapotranspiration", "wind_speed_10m"],
        "current": ["temperature_2m", "rain", "precipitation", "wind_speed_10m"],
        "timezone": "auto"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    const sunrise = daily.variables(2)!;
    const sunset = daily.variables(3)!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0)!.value(),
            rain: current.variables(1)!.value(),
            precipitation: current.variables(2)!.value(),
            windSpeed10m: current.variables(3)!.value(),
        },
        hourly: {
            time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
                (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            soilTemperature0cm: hourly.variables(1)!.valuesArray()!,
            soilMoisture0To1cm: hourly.variables(2)!.valuesArray()!,
            rain: hourly.variables(3)!.valuesArray()!,
            showers: hourly.variables(4)!.valuesArray()!,
            relativeHumidity2m: hourly.variables(5)!.valuesArray()!,
            visibility: hourly.variables(6)!.valuesArray()!,
            evapotranspiration: hourly.variables(7)!.valuesArray()!,
            windSpeed10m: hourly.variables(8)!.valuesArray()!,
        },
        daily: {
            time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
                (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature2mMax: daily.variables(0)!.valuesArray()!,
            temperature2mMin: daily.variables(1)!.valuesArray()!,
            sunrise: [...Array(sunrise.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            sunset: [...Array(sunset.valuesInt64Length())].map(
                (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
            ),
            uvIndexMax: daily.variables(4)!.valuesArray()!,
            rainSum: daily.variables(5)!.valuesArray()!,
        },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.temperature2m[i],
            weatherData.hourly.soilTemperature0cm[i],
            weatherData.hourly.soilMoisture0To1cm[i],
            weatherData.hourly.rain[i],
            weatherData.hourly.showers[i],
            weatherData.hourly.relativeHumidity2m[i],
            weatherData.hourly.visibility[i],
            weatherData.hourly.evapotranspiration[i],
            weatherData.hourly.windSpeed10m[i]
        );
    }
    for (let i = 0; i < weatherData.daily.time.length; i++) {
        console.log(
            weatherData.daily.time[i].toISOString(),
            weatherData.daily.temperature2mMax[i],
            weatherData.daily.temperature2mMin[i],
            weatherData.daily.sunrise[i].toISOString(),
            weatherData.daily.sunset[i].toISOString(),
            weatherData.daily.uvIndexMax[i],
            weatherData.daily.rainSum[i]
        );
    }

    return (<>
    </>)
}

export default WeatherDashboard;