import { Component, Input, OnInit } from '@angular/core';
import { PostModel } from '../post.model';
import { faArrowUp,faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Voting } from './vote-request';
import { VoteService } from '../vote-serve/vote.service';
import { VoteType } from './vote-Type';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { PostService } from '../post.service';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vote-button',
  templateUrl: './vote-button.component.html',
  styleUrls: ['./vote-button.component.css']
})
export class VoteButtonComponent implements OnInit {

  @Input() post !:PostModel;
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  voteRequest:Voting;
  isLoggedIn!: boolean;

  constructor(private voteService:VoteService,
    private authService:AuthService,
    private postService:PostService,
    private toastr:ToastrService
    ) { 
    this.voteRequest={
      postId:0,
      voteType:VoteType.DOWNVOTE
    };
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.updateVoteDetails();
  }

  upvotePost(id:number){
    this.voteRequest.postId=id;
    console.log("Upvoted");
    
    this.voteRequest.voteType=VoteType.UPVOTE;
    this.postVote(this.voteRequest);
  }

  downvotePost(id:number){
    console.log("Downvoted");
    
    this.voteRequest.postId=id;
    this.voteRequest.voteType=VoteType.DOWNVOTE;
    this.postVote(this.voteRequest);
  }

  postVote(request:Voting){
    this.voteService.vote(request).subscribe(
      ()=>{
        this.updateVoteDetails();
      },
      error=>{
        if(!this.isLoggedIn)
        {
          console.log('logged in : '+this.isLoggedIn);
          
           this.toastr.error('Please Login first');
        }else{
          if(request.voteType==1){
           this.toastr.error("You have already DownVote'd for this post");
          }
          else{
            this.toastr.error("You have already UpVote'd for this post")
          }
        }
        throwError(error);
      }
    );
  }


  private updateVoteDetails() {
    this.postService.getPost(this.post.id).subscribe(post => {
      this.post = post;
    });
  }
}
