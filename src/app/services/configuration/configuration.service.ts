import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, lastValueFrom, shareReplay, map } from 'rxjs';

import {
  Configuration, Course, Project,
  Person, Instructor, Student, Deliverable
} from '@app/definitions';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  // private configuration$: Observable<Configuration> = this.http
  //   .get<Configuration>(`${environment.resourcePath}course.json`)
  //   .pipe(
  //     shareReplay(1)
  //   );
  
  // course$: Observable<Course> = this.configuration$
  //   .pipe(
  //     map(configuration => configuration.course)
  //   );
  
  // instructors$: Observable<Instructor[]> = this.course$
  //   .pipe(
  //     map(course => course.instructors)
  //   );
  
  // students$: Observable<Student[]> = this.course$
  //   .pipe(
  //     map(course => course.students)
  //   );
  
  // persons$: Observable<Person[]> = this.course$
  //   .pipe(
  //     map(course => [...course.instructors, ...course.students])
  //   );
  
  // projects$: Observable<Project[]> = this.course$
  //   .pipe(
  //     map(course => course.projects
  //       .filter(project => project.hidden !== true)
  //     )
  //   );

  // deliverables$: Observable<Deliverable[]> = this.projects$
  //   .pipe(
  //     map(projects => projects
  //       .reduce((combinedDeliverables: Deliverable[], project: Project) => {
  //         const deliverables: Deliverable[] = project.deliverables ?? [];
  //         const visibleDeliverables: Deliverable[] = deliverables
  //           .filter(deliverable => deliverable.hidden !== true);
  //         const deliverablesWithProjectSlugs: Deliverable[] = visibleDeliverables
  //           .map(deliverable => ({...deliverable, projectSlug: project.slug}));
  //         return [...combinedDeliverables, ...deliverablesWithProjectSlugs]
  //           .sort((a: Deliverable, b: Deliverable) => new Date(a.due).valueOf() - new Date(b.due).valueOf());
  //       }, [])
  //     )  
  //   );
  
  // instructor$forSlug = (
  //   slug: string
  // ): Observable<Instructor|undefined> => this.instructors$
  //   .pipe(
  //     map(instructors => instructors
  //       .find(instructor => instructor.slug === slug)
  //     )
  //   );
      
  // student$forSlug = (
  //   slug: string
  // ): Observable<Student|undefined> => this.students$
  //   .pipe(
  //     map(students => students
  //       .find(student => student.slug === slug)
  //     )
  //   );
  
  // person$forSlug = (
  //   slug: string
  // ): Observable<Person|undefined> => this.persons$
  //   .pipe(
  //     map(persons => persons
  //       .find(person => person.slug === slug)
  //     )
  //   );
  
  // project$forSlug = (
  //   slug: string
  // ): Observable<Project|undefined> => this.projects$
  //   .pipe(
  //     map(projects => projects
  //       .find(project => project.slug === slug)
  //     )
  //   );

  
  
  private configuration?: Configuration;
  

  constructor(
    private http: HttpClient
  ) { }

  load(): Promise<Configuration> {
    if (this.configuration) {
      return Promise.resolve(this.configuration);
    }
    return lastValueFrom(this.http.get(`${environment.resourcePath}course.json`))
      .then(configuration => this.configuration = configuration as Configuration);
  }

  course(): Promise<Course> {
    return this.load()
      .then((configuration: Configuration) => configuration.course);
  }

  instructors(): Promise<Instructor[]> {
    return this.course()
      .then((course: Course) => course.instructors);
  }

  instructor(slug?: string): Promise<Instructor|void> {
    return !slug ? Promise.resolve() : this.instructors()
      .then((instructors: Instructor[]) => instructors
        .find((instructor: Instructor) => instructor.slug === slug));
  }

  students(): Promise<Student[]> {
    return this.course()
      .then((course: Course) => course.students);
  }

  student(slug?: string): Promise<Student|void> {
    return !slug ? Promise.resolve() : this.students()
      .then((students: Student[]) => students
        .find((student: Student) => student.slug === slug));
  }

  persons(): Promise<Person[]> {
    return Promise.all([this.instructors(), this.students()])
      .then(responses => {
        const people: Person[] = [...responses[0], ...responses[1]];
        return people;
      });
  }

  person(slug?: string): Promise<Person|void> {
    return !slug ? Promise.resolve() : this.persons()
      .then((persons: Person[]) => persons
        .find((person: Person) => person.slug === slug));
  }

  projects(): Promise<Project[]> {
    return this.course()
      .then((course: Course) => course.projects
        .filter((project: Project) => project.hidden !== true)
      );
  }

  project(slug?: string): Promise<Project|void> {
    return !slug ? Promise.resolve() : this.projects()
      .then((projects: Project[]) => projects
        .find((project: Project) => project.slug === slug));
  }

  deliverables(): Promise<Deliverable[]> {
    return this.projects()
      .then((projects: Project[]) => projects
        .reduce((accumulator: Deliverable[], project: Project) => {
          const deliverables: Deliverable[] = project?.deliverables ?? [];
          return accumulator
            .concat(deliverables
              .filter((deliverable: Deliverable) => deliverable.hidden !== true)
              .map((deliverable: Deliverable) => {
                deliverable.projectSlug = project.slug;
                return deliverable;
              }) as Deliverable[]
            );
        }, [])
        .sort((a: Deliverable, b: Deliverable) => new Date(a.due).getTime() - new Date(b.due).getTime())
      );
  }
}
