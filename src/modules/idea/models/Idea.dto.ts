import { IsString, IsNotEmpty } from 'class-validator'

export class IdeaDto {
  @IsString({ message: 'idea must be a string' })
  @IsNotEmpty({ message: 'idea must not be empty' })
  idea: string;

  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description must not be empty' })
  description: string;
}