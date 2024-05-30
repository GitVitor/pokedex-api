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

    const pokemonsToFind = resources.results.map(({ name }) => name);

    const response = (
      await this.pokemonRepository.getByNameBulk(pokemonsToFind)
    ).map((response: IPokemon) => {
      const background = this.findBestBackgroundPicture(response.sprites);
      return convertPokemonToPokemonListDTO(response, background);
    });

    return { count: resources.count, data: response };
  }

  async searchByName(nameToFind: string, offset: number, limit: number) {
    const resources = await this.pokemonRepository.getAll(0, 99999);
    const nameToFindLower = nameToFind.toLowerCase();

    const pokemonsToFind = resources.results
      .filter(({ name }) => name.toLowerCase().includes(nameToFindLower))
      .map(({ name }) => name);

    const response = (
      await this.pokemonRepository.getByNameBulk(pokemonsToFind)
    )
      .map((response: IPokemon) => {
        const background = this.findBestBackgroundPicture(response.sprites);
        return convertPokemonToPokemonListDTO(response, background);
      })
      .slice(offset, limit);

    return { count: resources.count, data: response };
  }

  private findBestBackgroundPicture(sprites: IPokemon['sprites']): string {
    if (sprites.other?.['official-artwork']) {
      return this.findBestBackgroundPicture(sprites.other['official-artwork']);
    }
    return sprites.front_default || sprites.back_default;
  }
}
