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
      return this.getByName(name);
    });

    const response = (await Promise.allSettled(promises))
      .filter((response) => response.status === 'fulfilled')
      .map((response: PromiseFulfilledResult<IPokemon>) => {
        return convertPokemonToPokemonListDTO(response.value);
      });

    return { count: resources.count, data: response };
  }

  async searchByName(nameToFind: string, offset: number, limit: number) {
    const resources = await this.pokemonRepository.getAll(0, 99999);
    const nameToFindLower = nameToFind.toLowerCase();

    const promises = resources.results
      .filter(({ name }) => name.toLowerCase().includes(nameToFindLower))
      .map(({ name }) => this.getByName(name));

    const response = (await Promise.allSettled(promises))
      .filter((response) => response.status === 'fulfilled')
      .map((response: PromiseFulfilledResult<IPokemon>) => {
        return convertPokemonToPokemonListDTO(response.value);
      });

    return { count: resources.count, data: response };
  }

  async getByName(query: string) {
    const allData = await this.pokemonRepository.getByName(query);

    return allData;
  }
}
