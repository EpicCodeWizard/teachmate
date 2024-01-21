// @ts-nocheck
'use client';

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import Link from "next/link"
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
      if (user != null) {
        document.getElementById('my_modal_3').showModal();
      }
    });
  }, []);
  // return <>
  //   <button onClick={() => {signOut();signIn();}}>d</button>
  // </>

  return (
    <>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Actions:</h3>
        <p className="py-4">Here are the actions that you can do using the Google Classroom integration.</p>
        <Link href="/grading"><btn className="btn">Grade homework</btn></Link>
        <Link href="/lessonplan"><btn className="btn">Generate lesson plan</btn></Link>
        <Link href="/slideshow"><btn className="btn">Teach</btn></Link>
      </div>
    </dialog>

<div className="hero min-h-screen bg-base-200" >
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">AI Substitute Teacher</h1>
      <p className="py-6">The hassle of teaching will be lessened by this Google Classroom integration.</p>
      <button className="btn btn-outline"onClick={() => {signOut();signIn();}}>Sign in to Google Classroom</button>
    </div>
  </div>
</div>

    </>
  );
}