import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'apsi-meanstack';

  constructor(private authservice: AuthService) {}
  ngOnInit() {
    this.authservice.autoAuthUser();
  }
}
