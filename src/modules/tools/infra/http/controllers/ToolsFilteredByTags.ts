import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListToolService from '@modules/tools/services/ListToolServiceByTag';

interface IRequest {
  tag?: string;
}

export default class ToolsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listToolService = container.resolve(ListToolService);

    const { tag }: IRequest = request.query;

    const tool = await listToolService.execute({ tag });

    return response.json(tool);
  }
}
