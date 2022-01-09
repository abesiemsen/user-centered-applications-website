import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ConfigurationService } from '@app/services';
import { Project, Deliverable, Student } from '@app/definitions';

@Component({
  selector: 'wu-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  student?: Student;
  projects!: Project[];

  constructor(
    private configuration: ConfigurationService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const slug: string|undefined = this.route.snapshot.paramMap.get('slug') ?? undefined;
    this.configuration.projects()
      .then((projects: Project[]) => this.projects = projects);
    this.configuration.student(slug)
      .then((student: Student|void) => this.student = student ? student : undefined);
  }

  public get visibleProjects(): Project[] {
    if (!this.projects) {
      return [];
    }
    return this.projects
      .filter(project => project.hidden !== true);
  }

  public visibleDeliverables(project: Project): Deliverable[] {
    const deliverables: Deliverable[] = project?.deliverables ?? [];
    return deliverables
      .filter(deliverable => deliverable.hidden !== true)
      .filter(deliverable => !!deliverable.file);
  }

  pathFor(project: Project, deliverable: Deliverable, student: Student) {
    return student.basePath + '/' + project.slug + '/' + deliverable.slug + '/' + deliverable.file;
  }

}
