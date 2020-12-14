import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string | null = null;
  post: Post | null = null;
  loading = true;

  constructor(
    public router: Router,
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.postId = paramMap.get('postId');
      this.reload();
    });
  }

  reload() {
    this.loading = true;
    if (!this.postId) {
      this.mode = 'create';
      this.postId = null;
      this.loading = false;
    } else {
      this.mode = 'edit';
      if (this.postId) {
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            creator: postData.creator  
          };
          this.loading = false;
        });
      }
    }
  }

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else if (this.postId) {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
    this.loading = false;
    this.router.navigate(['']);
  }
}
