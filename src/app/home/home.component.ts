import { Component, inject, OnInit, signal } from '@angular/core';
import { PostsService } from '../service/posts.service';
import { Posts } from '../models/posts';
import { FormsModule } from '@angular/forms';
import { AboutUsComponent } from '../about-us/about-us.component';
@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  post = inject(PostsService);
  posts: Posts[] = [];
  softPosts: Posts[] = [];
  isLoading = signal<boolean>(false);
  searchTerm = '';
  msg: string = 'Msg From Chlid Component!';

  ngOnInit() {
    // this.getAllPosts();
  }

  searchPosts(): void {
    this.softPosts = this.posts.filter(
      (post) => post.userId === +this.searchTerm
    );
  }

  getAllPosts() {
    this.isLoading.set(true);
    this.post.getPosts().subscribe({
      next: (posts) => {
        this.posts = this.softPosts = posts;
        this.isLoading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.isLoading.set(false);
      },
    });
  }
}
