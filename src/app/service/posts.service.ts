import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Posts } from '../models/posts';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  http = inject(HttpClient);

  getPosts(): Observable<Posts[]> {
    return this.http.get<Posts[]>('https://jsonplaceholder.typicode.com/posts');
  }
}
