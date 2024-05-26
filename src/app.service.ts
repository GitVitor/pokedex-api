import { Injectable } from '@nestjs/common';
import {
  GetPokemonListDTO,
  convertPokemonToPokemonListDTO,
} from './dto/pokemon.adapter.dto';
import { IPokemon } from './interface/pokemon.interface';
import { PokemonRepository } from './pokemon/pokemon.repository';

@Injectable()
export class AppService {
  constructor(private readonly pokemonRepository: PokemonRepository) {}
  async getAll(
    offset: number,
    limit: number,
  ): Promise<{ count: number; data: GetPokemonListDTO[] }> {
    const resources = await this.pokemonRepository.getAll(offset, limit);

    const promises = resources.results.map(({ name }) => {
      return this.findByName(name);
    });

    const response = (await Promise.allSettled(promises))
      .filter((response) => response.status === 'fulfilled')
      .map((response: PromiseFulfilledResult<IPokemon>) => {
        return convertPokemonToPokemonListDTO(response.value);
      });

    return { count: resources.count, data: response };
  }

  async findByName(query: string) {
    const allData = await this.pokemonRepository.findByName(query);

    return allData;
  }
}
