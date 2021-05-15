import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { throwError } from 'rxjs';
import { CommentPayload } from 'src/app/comment/comment.payload';
import { CommentService } from 'src/app/comment/comment.service';
import { PostModel } from 'src/app/shared/post.model';
import { PostService } from 'src/app/shared/post.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  postId: number=0;
  post!: PostModel;
  commentForm !: FormGroup;
  commentPayload:CommentPayload;
  comments!: CommentPayload[];
  
  constructor(private postService: PostService, private activateRoute: ActivatedRoute
    ,private commentService: CommentService) { 

     //getting id from url 
    this.postId = this.activateRoute.snapshot.params.id;
    
    //initialize comment form
    this.commentForm = new FormGroup({
      text: new FormControl('', Validators.required)
    });

    //initialize the comment payload
    this.commentPayload = {
      text: '',
      postId:this.postId
    };
  }

  ngOnInit(): void {

    //these methods are called on initialize
    this.getPostById();
    this.getCommentsForPost();
  }

  postComment() {
    this.commentPayload.text = this.commentForm.get('text')?.value;
    this.commentService.postComment(this.commentPayload).subscribe(data => {
      this.commentForm.get('text')?.setValue('');//setting the form blank after successful commenting
      this.getCommentsForPost();//reloading all the comments again
    }, error => {
      throwError(error);
    })
  }

  //this method get the post from backend
  private getPostById() {
    this.postService.getPost(this.postId).subscribe(data => {
      this.post = data;
    }, error => {
      throwError(error);
    });
  }

  //this gets the comments related to a post
  private getCommentsForPost() {
    this.commentService.getAllCommentsForPost(this.postId).subscribe(data => {
      this.comments = data;
    }, error => {
      throwError(error);
    });
  }


}
