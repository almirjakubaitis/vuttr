import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import IToolsRepository from '@modules/tools/repositories/IToolsRepository';

import IDeleteToolDTO from '@modules/tools/dtos/IDeleteToolDTO';

@injectable()
export default class ListProviderService {
  constructor(
    @inject('ToolsRepository')
    private ormRepository: IToolsRepository,
  ) {}

  public async execute({ id }: IDeleteToolDTO): Promise<string> {
    const tool = await this.ormRepository.findOneToolById({
      id,
    });

    if (!tool) {
      throw new AppError('Tool not found', 400);
    } else {
      await this.ormRepository.deleteOneTool({
        id,
      });
    }

    return id;
  }
}
