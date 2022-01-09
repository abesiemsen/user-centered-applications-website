import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import {
  Project, Deliverable, Person,
  DeliverableConfig, Entrypoint
} from '@app/definitions';


@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor(
    private http: HttpClient
  ) { }

  check(url: string): Promise<boolean> {
    return lastValueFrom(this.http.get(url, { responseType: 'text' }))
      .then(() => true)
      .catch(() => false);
  }

  loadDeliverableConfig(deliverablePath: string): Promise<DeliverableConfig|undefined> {
    return lastValueFrom(this.http.get(deliverablePath))
      .catch(() => undefined);
  }

  expandEntrypointPaths(
    deliverableConfig: DeliverableConfig,
    project: Project,
    deliverable: Deliverable,
    person: Person
  ): DeliverableConfig {
    const entrypoints: Entrypoint[] = deliverableConfig?.entrypoints ?? [];
    entrypoints
      .map((entrypoint: Entrypoint) => {
        entrypoint.file = this.deliverablePathForPerson(project, deliverable, person) + entrypoint.file;
        return entrypoint;
      });
    return deliverableConfig;
  }


  abstractDeliverablePath(project: Project, deliverable: Deliverable): string {
    return project.slug + '/' + deliverable.slug + '/';
  }

  deliverablePathForPerson(project: Project, deliverable: Deliverable, person: Person): string {
    return person.basePath + this.abstractDeliverablePath(project, deliverable);
  }

  abstractDeliverableSingleFilePath(project: Project, deliverable: Deliverable): string {
    return this.abstractDeliverablePath(project, deliverable) + deliverable.file;
  }

  abstractDeliverableConfigPath(project: Project, deliverable: Deliverable): string {
    return this.abstractDeliverablePath(project, deliverable) + 'deliverable.json';
  }

  deliverableSingleFilePathForPerson(project: Project, deliverable: Deliverable, person: Person): string {
    return this.deliverablePathForPerson(project, deliverable, person) + deliverable.file;
  }

  deliverableConfigPathForPerson(project: Project, deliverable: Deliverable, person: Person): string {
    return this.deliverablePathForPerson(project, deliverable, person) + 'deliverable.json';
  }
}
