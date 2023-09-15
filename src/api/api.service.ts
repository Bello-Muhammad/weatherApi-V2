import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager'
import { map, catchError, lastValueFrom } from 'rxjs'


@Injectable()
export class ApiService {
    constructor(
        private http: HttpService,
        @Inject(CACHE_MANAGER) private cacheService: Cache
        ) {}

    async apiResponse(city) {
        let City = city.toLowerCase()
        const apikey = process.env.API_KEY;
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${City}&units=metric&appid=${apikey}`;

        const request = this.http
        .get(apiUrl)
        .pipe(map((res) => res.data))
        .pipe(
            catchError(() => {
                throw new ForbiddenException('api can not be reach and make sure you have internet connection')
            })
        )

        const weather = await lastValueFrom(request)
        const cacheData = await this.cacheService.get(city)
    
        if(cacheData) {
            let resPonse = JSON.stringify(cacheData)
            return resPonse;
        };
        

        let place = `${weather.name}, ${weather.sys.country}`;
        let icon = 'http://openweathermap.org/img/wn/'+weather.weather[0].icon+'@2x.png';
        let description = `${weather.weather[0].description}`
        let weatherTimezone = `${
            new Date( weather.dt * 1000 - weather.timezone * 1000)
        }`;
        let temp = `${weather.main.temp}`;
        let sunRise = `${new Date(weather.sys.sunrise * 1000)}`;
        let sunSet = `${new Date(weather.sys.sunset * 1000)}`;
        let date = weatherTimezone.substring(4,15);
        let day = weatherTimezone.substring(0,3);
        let sunrise = sunRise.substring(17,21);
        let sunset = sunSet.substring(17,21);
        let speed = weather.wind.speed;
        let clouds = `${weather.clouds.all}`;

        const details = {
            place,
            date,
            day,
            icon,
            sunrise,
            sunset,
            speed,
            clouds,
            description,
            temp,
        };


        await this.cacheService.set(city, details);
        return details;

    }

}
