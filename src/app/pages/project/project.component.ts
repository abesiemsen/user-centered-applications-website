import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfigurationService, LinkService } from '@app/services';
import { Project, Deliverable, Person } from '@app/definitions';

@Component({
  selector: 'wu-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  ready = false;
  project?: Project;
  persons!: Person[];

  constructor(
    private configuration: ConfigurationService,
    public linkService: LinkService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const slug: string|undefined = this.route.snapshot.paramMap.get('slug') ?? undefined;
    Promise.all([
      this.loadProject(slug),
      this.loadPersons()
    ])
      .then(() => this.ready = true);
  }

  private loadProject(slug: string|undefined): Promise<Project|undefined> {
    return !slug ? Promise.resolve(undefined) : this.configuration.project(slug)
      .then((project: Project|void) => this.project = project ? project : undefined);
  }

  private loadPersons(): Promise<Person[]> {
    // return this.configuration.students()
    return this.configuration.persons()
      .then((persons: Person[]) => this.persons = persons);
  }

  public get visibleDeliverables(): Deliverable[] {
    const deliverables: Deliverable[] = this.project?.deliverables ?? [];
    return deliverables
      .filter(deliverable => deliverable.hidden !== true);
  }

  have(value?: any[]): boolean {
    return !!value && !!value.length;
  }

}
