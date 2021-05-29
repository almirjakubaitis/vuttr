import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IToolsRepository from '@modules/tools/repositories/IToolsRepository';

import ICreateToolDTO from '@modules/tools/dtos/ICreateToolDTO';
import IToolDTO from '@modules/tools/dtos/IToollDTO';
import ITagDTO from '@modules/tags/dtos/ITagDTO';

@injectable()
export default class ListProviderService {
  constructor(
    @inject('ToolsRepository')
    private ormRepository: IToolsRepository,
  ) {}

  public async execute({
    title,
    link,
    description,
    tags,
  }: ICreateToolDTO): Promise<IToolDTO> {
    const checkToolExists = await this.ormRepository.findOneToolByTitle(title);

    if (checkToolExists) {
      throw new AppError('This tool Title already exists', 409);
    }

    const tools = await this.ormRepository.createTool({
      title,
      link,
      description,
      tags,
    });

    tags.map(async tagTitle => {
      const checkTagExists = await this.ormRepository.findOneTagByTitle(
        tagTitle,
      );

      let tag = {} as ITagDTO;

      if (!checkTagExists) {
        tag = await this.ormRepository.createTag({
          title: tagTitle,
        });
      }

      if (!checkTagExists) {
        await this.ormRepository.createTagTool({
          tag_id: tag.id,
          tool_id: tools.id,
        });
      } else {
        await this.ormRepository.createTagTool({
          tag_id: checkTagExists.id,
          tool_id: tools.id,
        });
      }
    });

    return {
      id: tools.id,
      title: tools.title,
      link: tools.link,
      description: tools.description,
      tags,
    };
  }
}
