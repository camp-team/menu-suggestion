import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post/post.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [PostComponent, PostDetailComponent],
  imports: [
    CommonModule,
    PostRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
})
export class PostModule {}
