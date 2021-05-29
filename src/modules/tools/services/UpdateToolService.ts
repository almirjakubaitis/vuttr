import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IToolsRepository from '@modules/tools/repositories/IToolsRepository';

import IToolDTO from '@modules/tools/dtos/IToollDTO';
import ITagDTO from '@modules/tags/dtos/ITagDTO';

@injectable()
export default class ListProviderService {
  constructor(
    @inject('ToolsRepository')
    private ormRepository: IToolsRepository,
  ) {}

  public async execute({
    id,
    title,
    link,
    description,
    tags,
  }: IToolDTO): Promise<IToolDTO> {
    const tools = await this.ormRepository.updateTool({
      id,
      title,
      link,
      description,
      tags,
    });

    if (!tools) {
      throw new AppError('Transaction not found', 400);
    }

    const existentTagsInTagTools = await this.ormRepository.findManyTagTools(
      id,
    );

    let existentTagsInTagToolTitles = [] as any[];

    if (existentTagsInTagTools) {
      existentTagsInTagToolTitles = await Promise.all(
        existentTagsInTagTools?.map(tagTool => {
          const results = this.ormRepository.findOneTagById(tagTool.tag_id);

          return results;
        }),
      );
    }

    const existentTagsToolsTitles = existentTagsInTagToolTitles.map(
      maptitle => maptitle.title,
    );

    const TitlesTagsToDelete = tags
      .filter(x => !existentTagsToolsTitles.includes(x))
      .concat(existentTagsToolsTitles.filter(x => !tags.includes(x)));

    TitlesTagsToDelete.map(async tagTitletoDelete => {
      const checkTagExists = await this.ormRepository.findOneTagByTitle(
        tagTitletoDelete,
      );

      let tag = {} as any;

      if (checkTagExists) {
        tag = await this.ormRepository.findOneTagByTitle(tagTitletoDelete);

        await this.ormRepository.deleteOneTagTool({
          tag_id: tag.id,
          tool_id: id,
        });
      }
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

        await this.ormRepository.createTagTool({
          tag_id: tag.id,
          tool_id: id,
        });
      }

      if (checkTagExists) {
        const checkTagToolExists = await this.ormRepository.findOneTagTool({
          tag_id: checkTagExists.id,
          tool_id: id,
        });

        if (!checkTagToolExists) {
          await this.ormRepository.createTagTool({
            tag_id: checkTagExists.id,
            tool_id: id,
          });
        }
      }
    });

    return {
      id,
      title,
      link,
      description,
      tags,
    };
  }
}
