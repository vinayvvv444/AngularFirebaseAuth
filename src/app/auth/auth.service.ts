import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore,AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject,Observable,of } from 'rxjs';
import { switchMap } from "rxjs/operators";
import { auth } from "firebase/app";
import { User } from "../auth/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$:Observable<any>;

  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();
  newUser: any;
  constructor(private afAuth: AngularFireAuth,private afs:AngularFirestore, private db: AngularFirestore, private router: Router) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user =>{
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        else{
          return of(null);
        }
      })
    );
   }

   async googleSignin(){
     const provider = new auth.GoogleAuthProvider();
     const credential = await this.afAuth.auth.signInWithPopup(provider);
     return this.updateUserData(credential.user);
     
   }

   async signOut(){
     await this.afAuth.auth.signOut();
     return this.router.navigate(['/home']);
   }

   private updateUserData({uid,email,displayName,photoURL}:User)
   {
     const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

     const data = {
       uid,
       email,
       displayName,
       photoURL
     };

     return userRef.set(data,{merge:true});
   }

  getUserState() {
    return this.afAuth.authState;
  }
  createUser(user) {
    this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredential => {
        this.newUser = user;
        console.log(userCredential);
        userCredential.user.updateProfile({
          displayName: user.firstName + ' ' + user.lastName,
          photoURL: user.photoURL

        });

        this.insertUserData(userCredential).then(() => {
          this.router.navigate(['/home']);
          this.logout();
        });
        
      })
      .catch(error => {
        this.eventAuthError.next(error);
      })
  }

  login(email:string,password:string)
  {
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
  .catch(error =>{
    this.eventAuthError.next(error);
  })
  .then(userCredential => {
    if(userCredential){
      this.router.navigate(['/home']);
    }
  });
  }



  insertUserData(userCredential: firebase.auth.UserCredential) {
    return this.db.doc(`Users/${userCredential.user.uid}`).set({
      email: this.newUser.email,
      firstname: this.newUser.firstName,
      lastname: this.newUser.lastName,
      photoURL:this.newUser.photoURL,
      role: 'network user'

    })
  }


  logout() {
    return this.afAuth.auth.signOut();
  }

  getUser()
  {
    return this.afs.collection('Users').snapshotChanges();
  }

  getUserById(id:string)
  {
    return this.afs.doc('Users/'+id).valueChanges();
  }
}
