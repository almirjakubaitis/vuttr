import { Router } from 'express';

import ToolsController from '@modules/tools/infra/http/controllers/ToolsControllers';
import ToolsFilteredByTags from '@modules/tools/infra/http/controllers/ToolsFilteredByTags';

const toolsRouter = Router();

const toolsControler = new ToolsController();
const toolsFilteredByTags = new ToolsFilteredByTags();

toolsRouter.get('/', toolsControler.index);
toolsRouter.get('/tools', toolsFilteredByTags.index);
toolsRouter.post('/tools', toolsControler.create);
toolsRouter.delete('/tools/:id', toolsControler.delete);
toolsRouter.put('/tools/:id', toolsControler.update);

export default toolsRouter;
