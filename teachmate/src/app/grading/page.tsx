// @ts-nocheck
'use client'














// const {google} = require('googleapis');
// const classroom = google.classroom({version: 'v1', USER_OBJECT_FROM_CALLBACK});
// async function listCourses() {
//     const response = await classroom.courses.list({
//         pageSize: 10 // Adjust pageSize as needed
//     });
//     const courses = response.data.courses;
//     if (!courses || courses.length === 0) {
//         console.log('No courses found.');
//         return;
//     }
//     return courses;
// }
// async function listCourseWork(courseId) {
//     const response = await classroom.courses.courseWork.list({
//         courseId: courseId
//     });
//     const courseWorks = response.data.courseWork;
//     if (!courseWorks || courseWorks.length === 0) {
//         console.log(`No course works found for course ID: ${courseId}`);
//         return;
//     }
//     return courseWorks;
// }
// async function listStudentSubmissions(courseId, courseWorkId) {
//     const response = await classroom.courses.courseWork.studentSubmissions.list({
//         courseId: courseId,
//         courseWorkId: courseWorkId
//     });
//     const submissions = response.data.studentSubmissions;
//     if (!submissions || submissions.length === 0) {
//         console.log(`No student submissions found for course work ID: ${courseWorkId}`);
//         return;
//     }
//     return submissions;
// }
// const courses = await listCourses();
// if (courses && courses.length > 0) {
//     const firstCourseId = courses[0].id;
//     const assignments = await listCourseWork(firstCourseId);
//     if (assignments && assignments.length > 0) {
//         const firstAssignmentId = assignments[0].id;
//         const submissions = await listStudentSubmissions(firstCourseId, firstAssignmentId);
//         if (submissions) {
//             submissions.forEach(submission => {
//                 // SEND submission.attachments[0].link TO API ROUTE
//             });
//         }
//     }
// }













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
        <h3 className="font-bold text-lg">Feedback:</h3>
        <div dangerouslySetInnerHTML={plan}></div>
      </div>
    </dialog>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Grade homework</h1>
            <p className="py-6">You can select assignments through Google Classroom and it will be graded by our knowledgable AI.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(event) => {
              event.preventDefault();
            }}>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Pick your assignment</span>
                  <span className="label-text-alt">.pdf</span>
                </div>
                <input id="fi" type="file" className="file-input file-input-bordered w-full max-w-xs" />
                {/* <div className="label">
                  <span className="label-text-alt">Alt label</span>
                  <span className="label-text-alt">Alt label</span>
                </div> */}
              </label>
              <div className="form-control mt-6">
                <button id="fb"className="btn" onClick={
                  () => {
                    document.getElementById('my_modal_3').showModal();

                    const formData = new FormData();
                    formData.append('document', document.getElementById('fi').files[0]);
                    setPlan({__html: fetch('/grade?user_id=' + encodeURIComponent(user_id), {
                      method: 'POST',
                      body: formData
                  }).json()})

                    
                  }
                }>Grade</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}