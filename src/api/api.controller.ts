import { Get, Query, Controller, Render, UseInterceptors } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CacheInterceptor, CacheTTL, CacheKey} from '@nestjs/cache-manager';
import { ApiService } from './api.service';
import { query } from 'express';

@Controller('api')
export class ApiController {
    constructor(private apiService: ApiService) {}

    @Get()
    @Render('index')
    root() {

        
        // return await this.apiService.apiResponse(query.city)
    }

    @UseInterceptors(CacheInterceptor)//automatically cache the response for the route
    @CacheKey('Custom-key')
    @CacheTTL(30)//override TTL to 30 sec
    @Get('/weather')
    @Render('index')
    async getWeather(
        @Query()
        query: ExpressQuery
    ) {
        
        
        return await this.apiService
                         .apiResponse(query.city)
                         .then((result) => result ? { location: result } : { location: []})
    }

}
