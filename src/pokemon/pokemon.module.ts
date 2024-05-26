import { Module } from '@nestjs/common';
import { PokemonRepository } from './pokemon.repository';

@Module({
  providers: [PokemonRepository],
  exports: [PokemonRepository],
})
export class PokemonModule {}
