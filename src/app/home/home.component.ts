import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { User } from '../auth/user.model';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;
  userData: any;
  selectedFile = null;
  constructor(private auth:AuthService,private router:Router,private toastrService:ToastrService,http:HttpClient) { }

  ngOnInit() {
    this.auth.getUserState().subscribe(user =>{
      debugger;
      this.user = user;
      
      if(this.user != null)
      {
        this.auth.getUserById(this.user.uid).subscribe(userData =>{
          this.userData = userData;
          debugger;
        });
        this.toastrService.success("Login Success","Login");
      }
     
    });

    
  
  }

  login1(){
    this.router.navigate(['/login']);
      }
    
      register(){
        this.router.navigate(['/register']);
      }
    
      logout(){
        this.auth.logout();
      }

      onFileSelected(event)
      {
        this.selectedFile = event.target.files[0];
      }

      onUpload(){

      }

}
