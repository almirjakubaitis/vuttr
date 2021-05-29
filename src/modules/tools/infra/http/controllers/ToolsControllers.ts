import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListToolService from '@modules/tools/services/ListToolService';
import CreateToolService from '@modules/tools/services/CreateToolService';
import DeleteToolService from '@modules/tools/services/DeleteToolService';
import UpdateToolService from '@modules/tools/services/UpdateToolService';

export default class ToolsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listToolService = container.resolve(ListToolService);

    const tool = await listToolService.execute();

    return response.json(tool);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, link, description, tags } = request.body;

    const createToolService = container.resolve(CreateToolService);

    const tool = await createToolService.execute({
      title,
      link,
      description,
      tags,
    });

    return response.status(201).json(tool);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const deleteToolService = container.resolve(DeleteToolService);

    await deleteToolService.execute({
      id,
    });

    return response.status(204).json();
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { title, link, description, tags } = request.body;
    const { id } = request.params;

    const updateToolService = container.resolve(UpdateToolService);

    const tool = await updateToolService.execute({
      id,
      title,
      link,
      description,
      tags,
    });

    return response.status(200).json(tool);
  }
}
