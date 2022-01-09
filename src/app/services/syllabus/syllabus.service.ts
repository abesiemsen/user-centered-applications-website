import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SyllabusService {

  private syllabus?: string;

  constructor(
    private http: HttpClient
  ) { }

  load(url: string): Promise<string> {
    if (this.syllabus) {
      return Promise.resolve(this.syllabus);
    }
    return lastValueFrom(this.http.get(`${environment.resourcePath}${url}`, { responseType: 'text' }))
      .then((syllabus: string) => {
        this.syllabus = syllabus;
        return this.syllabus;
      });
  }
  
}
