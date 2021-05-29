import Tag from '@modules/tags/infra/typeorm/entities/Tag';
import TagTool from '@modules/tools/infra/typeorm/entities/TagTool';

import ICreateToolDTO from '@modules/tools/dtos/ICreateToolDTO';
import IToolDTO from '@modules/tools/dtos/IToollDTO';
import ICreateTagToolDTO from '@modules/tools/dtos/ICreateTagToolDTO';
import IDeleteToolDTO from '@modules/tools/dtos/IDeleteToolDTO';

import ICreateTagDTO from '@modules/tags/dtos/ICreateTagDTO';

export default interface IToolsRepository {
  // tool
  createTool(data: ICreateToolDTO): Promise<IToolDTO>;
  updateTool(data: IToolDTO): Promise<IToolDTO | undefined>;
  deleteOneTool(data: IDeleteToolDTO): Promise<void>;
  findOneToolById(data: IDeleteToolDTO): Promise<IToolDTO | undefined>;
  findOneToolByTitle(title: string): Promise<IToolDTO | undefined>;
  findAllToolsWithTags(): Promise<IToolDTO[]>;

  // tag
  createTag(data: ICreateTagDTO): Promise<Tag>;
  findOneTagByTitle(title: string): Promise<Tag | undefined>;
  findOneTagById(id: string): Promise<Tag | undefined>;

  // tagtool
  createTagTool(data: ICreateTagToolDTO): Promise<TagTool>;
  findOneTagTool(data: ICreateTagToolDTO): Promise<TagTool | undefined>;
  findManyTagTools(tool_id: string): Promise<TagTool[] | undefined>;
  deleteOneTagTool({ tool_id, tag_id }: ICreateTagToolDTO): Promise<void>;
}
