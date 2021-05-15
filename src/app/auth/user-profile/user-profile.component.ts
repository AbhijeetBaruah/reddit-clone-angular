import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post.model';
import { PostService } from 'src/app/shared/post.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  name: string='';
  posts!: PostModel[];
  comments!: CommentPayload[];
  postLength!: number;
  commentLength!: number;
  username!:string;

  constructor(private activatedRoute:ActivatedRoute,private postService:PostService,
    private commentService:CommentService,private authService:AuthService,private router:Router) { 
      this.name = this.activatedRoute.snapshot.params.username;
      console.log('name:'+this.name);
      console.log('type : '+typeof(name));
      
      
      this.username = authService.getUserName();
      console.log('default:'+this.username);

      if(this.name!=this.username){
        console.log("inside if statement");
        this.router.navigateByUrl('/bad-request');
      }
      
      this.postService.getAllPostsByUser(this.name).subscribe(data => {
        this.posts = data;
        this.postLength = data.length;
      });
      this.commentService.getAllCommentsByUser(this.name).subscribe(data => {
        this.comments = data;
        this.commentLength = data.length;
      });
    }

  ngOnInit(): void {
  }

}
