import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  authError: any;
  constructor(private auth:AuthService,private router:Router) { }

  ngOnInit() {
    this.auth.eventAuthError$.subscribe(data =>{
this.authError = data;
    })
  }

  createUser(frm)
  {
this.auth.createUser(frm.value);
  }

  cancel(){
this.router.navigate(['/home']);
  }

}
