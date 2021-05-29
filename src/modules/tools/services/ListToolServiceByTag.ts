import { injectable, inject } from 'tsyringe';

import IToolsRepository from '@modules/tools/repositories/IToolsRepository';
import IToolDTO from '@modules/tools/dtos/IToollDTO';

interface IRequest {
  tag?: string;
}

@injectable()
export default class ListProviderService {
  constructor(
    @inject('ToolsRepository')
    private toolsRepository: IToolsRepository,
  ) {}

  public async execute({ tag }: IRequest): Promise<IToolDTO[]> {
    const query = await this.toolsRepository.findAllToolsWithTags();

    let queryNoDuplicates = [] as IToolDTO[];

    queryNoDuplicates = Object.values(
      query.reduce(
        (acc: any, cur: any) => Object.assign(acc, { [cur.id]: cur }),
        {},
      ),
    );

    const toolsToFilter = queryNoDuplicates.map(tool => {
      return {
        id: tool.id,
        title: tool.title,
        link: tool.link,
        description: tool.description,
        tags: query
          .filter((equalToolId: any) => {
            return tool.id === equalToolId.id;
          })
          .map((returnOnlyTags: any) => returnOnlyTags.tags),
      };
    });

    const tools = toolsToFilter.filter(tool =>
      tool.tags.find(tags => tags === tag),
    );

    return tools;
  }
}
