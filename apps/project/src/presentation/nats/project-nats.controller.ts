import { Controller } from '@nestjs/common';
import { ProjectService } from '../../application/services/project.service';

@Controller()
export class ProjectNatsController {
  constructor(private readonly projectService: ProjectService) {}
}
