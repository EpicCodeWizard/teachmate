// @ts-nocheck
'use client'




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
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Expand on feedback</h1>
            <p className="py-6">Once you provide a couple sentences of feedback, this app will elaborate on it and create more helpful feedback that is suited for the student.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(event) => {
              event.preventDefault();
            }}>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick your work</span>
                  <span className="label-text-alt">.pdf</span>
                </div>
                <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
                {/* <div className="label">
                  <span className="label-text-alt">Alt label</span>
                  <span className="label-text-alt">Alt label</span>
                </div> */}
              </label>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Upload your teacher's feedback</span>
                  <span className="label-text-alt">(1-2) sentences recommended</span>
                </div>
                <textarea id="f"className="textarea textarea-bordered h-24" placeholder="Feedback"></textarea>
              </label>
              <div className="form-control mt-6">
                <button id="fb"className="btn btn-primary" onClick={
                  () => {

                    let f = document.getElementById("f");
                    let str = f.textContent;
                    // TODO: POST REQUEST AND GET BACK DATA HERE



                    // let out = `
                    // asdasd
                    // `
                    // f.textContent = out;

                    document.getElementById('my_modal_3').showModal();
                  }
                }>Elaborate</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}