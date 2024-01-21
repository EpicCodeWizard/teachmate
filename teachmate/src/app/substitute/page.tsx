// @ts-nocheck
'use client';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDPa95pNxL201wnZuY72YJPrG2nxMBVSn4",
  authDomain: "teachmate-e3b6d.firebaseapp.com",
  projectId: "teachmate-e3b6d",
  storageBucket: "teachmate-e3b6d.appspot.com",
  messagingSenderId: "523658089401",
  appId: "1:523658089401:web:dc013aba5109e93b01dc68",
  measurementId: "G-HPTCDNJLKZ"
};
// Initialize firebase and google provider
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly");
provider.addScope("https://www.googleapis.com/auth/classroom.announcements.readonly");
provider.addScope("https://www.googleapis.com/auth/classroom.coursework.students");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.setCustomParameters({ prompt: "select_account" });
// Sign in and sign out functins
const signIn = () => auth.signInWithPopup(provider);
const signOut = () => auth.signOut();


export default function MyApp() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      console.log(user);
    });
  }, []);
  // return <>
  //   <button onClick={() => {signOut();signIn();}}>d</button>
  // </>

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">AI Substitute Teacher</h1>
            <p className="py-6">TODO write description.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body"  onSubmit={(event) => {
              event.preventDefault();
            }}>
              <div className="form-control mt-6">
                <button className="btn btn-primary" onClick={() => {signOut();signIn();}}>Sign in with Google Classroom</button>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Elaborate</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}