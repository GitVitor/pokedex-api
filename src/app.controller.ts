import { Controller, Get, Logger, Query, Req } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AppService } from './app.service';
import { PaginatedDTO } from './dto/paginated.dto';
import { GetPokemonListDTO } from './dto/pokemon.adapter.dto';

@Controller('pokemon')
export class AppController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);

  @ApiResponse({
    status: 200,
    description:
      "Returns a paginated list of available resources for that API. By default, a list 'page' will contain up to 20 resources. If you would like to change this just add a 'limit' query parameter to the GET request, e.g. ?limit=60. You can use 'offset' to move to the next page, e.g. ?limit=60&offset=60.",
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedDTO) },
        {
          properties: {
            results: {
              type: 'array',
              items: { $ref: getSchemaPath(GetPokemonListDTO) },
            },
          },
        },
      ],
    },
  })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiExtraModels(PaginatedDTO, GetPokemonListDTO)
  @Get('/')
  public async getAll(
    @Req() req: Request,
    @Query('offset') offset?: number,
    @Query('limit') limit = 20,
  ): Promise<PaginatedDTO<GetPokemonListDTO>> {
    this.logger.log({
      httpEndpoint: req.path,
      message: 'request received',
    });

    const { data, count: total } = await this.appService.getAll(offset, limit);

    return {
      total,
      offset: offset ?? 0,
      limit: limit ?? 0,
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description:
      'Pokémon are the creatures that inhabit the world of the Pokémon games. They can be caught using Pokéballs and trained by battling with other Pokémon. Each Pokémon belongs to a specific species but may take on a variant which makes it differ from other Pokémon of the same species, such as base stats, available abilities and typings',
  })
  @Get('/findByName')
  public findByName(@Req() req: Request, @Query('query') query?: string) {
    this.logger.log({
      httpEndpoint: req.path,
      message: 'request received',
    });

    return this.appService.findByName(query);
  }
}
