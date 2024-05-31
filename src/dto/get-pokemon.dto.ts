import { ApiProperty } from '@nestjs/swagger';
import { IPokemon, Stat, Type } from '../interface/pokemon.interface';
import { ISpecie } from '../interface/specie.interface';

export class GetPokemonDTO {
  constructor(
    name: string,
    attack: Stat,
    defense: Stat,
    types: Type[],
    background: string,
    pokedexEntryDescription: string,
  ) {
    this.name = name;
    this.attack = attack;
    this.defense = defense;
    this.types = types;
    this.background = background;
    this.pokedexEntryDescription = pokedexEntryDescription;
  }
  @ApiProperty({ description: 'Pokemon name' })
  name: string;

  @ApiProperty({ description: 'Pokemon attack stats data' })
  attack: Stat;

  @ApiProperty({ description: 'Pokemon defense stats data' })
  defense: Stat;

  @ApiProperty({ description: 'Pokemon type i.e. poison, eletric, water' })
  types: Type[];

  @ApiProperty({ description: 'URL Link to a image that can be used as URL' })
  background: string;

  @ApiProperty({ description: 'Description about' })
  pokedexEntryDescription: string;
}

export function convertPokemonToGetPokemonDTO(
  pokemon: IPokemon,
  background: string,
  specie: ISpecie,
) {
  const attack = pokemon.stats.filter((stat) => {
    return stat.stat.name === 'attack';
  })[0];

  const defense = pokemon.stats.filter((stat) => {
    return stat.stat.name === 'defense';
  })[0];
  const dtoData = new GetPokemonDTO(
    pokemon.name,
    attack,
    defense,
    pokemon.types,
    background,
    specie.flavor_text_entries[0].flavor_text,
  );
  return dtoData;
}
