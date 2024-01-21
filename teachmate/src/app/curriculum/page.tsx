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

  const [plan, setPlan] = useState({__html: '<p className="py-4" id="out">Loading...</p>'});

  return (
    <>
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Curriculum:</h3>
        <div dangerouslySetInnerHTML={plan}></div>
      </div>
    </dialog>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Find the curriculum and standards</h1>
            <p className="py-6">Once you provide a couple sentences describing, this app will find the curriculum and standards that you need.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(event) => {
              event.preventDefault();
            }}>
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Describe the curriculum</span>
                  <span className="label-text-alt">(1-2) sentences minimum</span>
                </div>
                <textarea id="f"className="textarea textarea-bordered h-24" placeholder="Description"></textarea>
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Duration</span>
                  <span className="label-text-alt">Minutes</span>
                </div>
                <input type="text" id="f2" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
              <div className="form-control mt-6">
                <button id="fb"className="btn" onClick={
                  () => {
                    document.getElementById('my_modal_3').showModal();

                    setPlan({__html: fetch('/generate_curriculum?topic=' + encodeURIComponent(document.getElementById('f').textContent) + '&lesson_time=' + encodeURIComponent(document.getElementById('f2').textContent) + '&user_id=' + encodeURIComponent(user_id), {
                      method: 'POST'
                  }).json()})
                  

                    
                  }
                }>Find</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}