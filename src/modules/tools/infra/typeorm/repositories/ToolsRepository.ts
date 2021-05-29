import { Repository, getRepository, getManager } from 'typeorm';
import AppError from '@shared/errors/AppError';

import Tool from '@modules/tools/infra/typeorm/entities/Tool';
import TagTool from '@modules/tools/infra/typeorm/entities/TagTool';
import IToolsRepository from '@modules/tools/repositories/IToolsRepository';

import Tag from '@modules/tags/infra/typeorm/entities/Tag';

import ICreateToolDTO from '@modules/tools/dtos/ICreateToolDTO';
import IToolDTO from '@modules/tools/dtos/IToollDTO';

import ICreateTagDTO from '@modules/tags/dtos/ICreateTagDTO';
import ICreateTagToolDTO from '@modules/tools/dtos/ICreateTagToolDTO';

import IDeleteToolDTO from '@modules/tools/dtos/IDeleteToolDTO';

class ToolsRepository implements IToolsRepository {
  private ormRepository: Repository<Tool>;

  private ormTagRepository: Repository<Tag>;

  private ormTagToolRepository: Repository<TagTool>;

  constructor() {
    this.ormRepository = getRepository(Tool);
    this.ormTagRepository = getRepository(Tag);
    this.ormTagToolRepository = getRepository(TagTool);
  }

  // tool

  public async createTool({
    title,
    link,
    description,
    tags,
  }: ICreateToolDTO): Promise<Tool> {
    const tool = this.ormRepository.create({
      title,
      link,
      description,
      tags,
    });

    await this.ormRepository.save(tool);

    return tool;
  }

  public async updateTool({
    id,
    title,
    link,
    description,
    tags,
  }: IToolDTO): Promise<IToolDTO | undefined> {
    const tool = await this.ormRepository.findOne({ where: { id } });

    if (!tool) {
      throw new AppError('Transaction not found', 400);
    }

    await this.ormRepository
      .createQueryBuilder()
      .update()
      .set({
        id,
        title,
        link,
        description,
      })
      .where('id = :id', { id })
      .execute();
    return { id: tool.id, title, link, description, tags };
  }

  public async deleteOneTool({ id }: IDeleteToolDTO): Promise<void> {
    await this.ormRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async findOneToolById({
    id,
  }: IDeleteToolDTO): Promise<IToolDTO | undefined> {
    const tool = await this.ormRepository.findOne({
      where: { id },
    });

    return tool;
  }

  public async findOneToolByTitle(
    title: string,
  ): Promise<IToolDTO | undefined> {
    const tool = await this.ormRepository.findOne({
      where: { title },
    });

    return tool;
  }

  public async findAllToolsWithTags(): Promise<IToolDTO[]> {
    const toolsQuery = getManager();

    const tools = await toolsQuery.query(`
    SELECT tools.id,
    tools.title,
    tools.link,
    tools.description,
    tags.title as tags
    FROM tools, tags, tag_tool
    WHERE tools.id = tag_tool.tool_id
    AND tags.id = tag_tool.tag_id
    ;`);

    return tools;
  }

  // tag

  public async createTag({ title }: ICreateTagDTO): Promise<Tag> {
    const tag = this.ormTagRepository.create({
      title,
    });

    await this.ormTagRepository.save(tag);

    return tag;
  }

  public async findOneTagByTitle(title: string): Promise<Tag | undefined> {
    const tag = await this.ormTagRepository.findOne({
      where: { title },
    });

    return tag;
  }

  public async findOneTagById(id: string): Promise<Tag | undefined> {
    const tag = await this.ormTagRepository.findOne({
      where: { id },
    });

    return tag;
  }

  // tagtool

  public async createTagTool({
    tool_id,
    tag_id,
  }: ICreateTagToolDTO): Promise<TagTool> {
    const tagTool = this.ormTagToolRepository.create({
      tool_id,
      tag_id,
    });

    await this.ormTagToolRepository.save(tagTool);

    return tagTool;
  }

  public async findOneTagTool({
    tool_id,
    tag_id,
  }: ICreateTagToolDTO): Promise<TagTool | undefined> {
    const tagTool = await this.ormTagToolRepository
      .createQueryBuilder()
      .where('tool_id = :tool_id', { tool_id })
      .andWhere('tag_id = :tag_id', { tag_id })
      .getOne();

    // console.log(tagTool);

    if (tagTool) {
      return tagTool;
    }
    return undefined;
  }

  public async findManyTagTools(
    tool_id: string,
  ): Promise<TagTool[] | undefined> {
    const tagTool = await this.ormTagToolRepository
      .createQueryBuilder()
      .where('tool_id = :tool_id', { tool_id })
      .getMany();

    // console.log(tagTool);

    if (tagTool) {
      return tagTool;
    }
    return undefined;
  }

  public async deleteOneTagTool({
    tool_id,
    tag_id,
  }: ICreateTagToolDTO): Promise<void> {
    await this.ormTagToolRepository
      .createQueryBuilder()
      .delete()
      .where('tool_id = :tool_id', { tool_id })
      .andWhere('tag_id = :tag_id', { tag_id })
      .execute();
  }
}
export default ToolsRepository;
