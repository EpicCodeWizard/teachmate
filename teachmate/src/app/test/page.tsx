// @ts-nocheck
"use client";

import Image from 'next/image'
// import { Inter } from 'next/font/google'
import { SignInButton, SignUpButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from 'next/link';
import { useState } from 'react';
// import { useRouter } from 'next/router'
import { useUser } from "@clerk/nextjs";
// import { redirect } from 'next/navigation';
import { useRouter } from "next/navigation";


// const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [SstructuredData, setSStructuredData] = useState([]);
    const NofQuestions = 10;

    // const router = useRouter();

    const { isSignedIn, user, isLoaded } = useUser();
    const router = useRouter();

    if (SstructuredData.length == 0) {
        // get data
        setSStructuredData([
            {
                title: "Pasta",
                image: "https://thedizzycook.com/wp-content/uploads/2019/12/Boursin-pasta.jpg",
                description: "3 Days Old, cheese, linguini, salt, pepper",
                author: "Vedant",
                price: "2",
                date: "9/30/2023",
            },
            {
                title: "Pizza",
                image: "https://thumbs.dreamstime.com/b/pizza-seafood-cheese-piza-shop-thailand-67920871.jpg",
                description: "1 Day Old, From CPK, tomato and cheese, pizza dough bread, olive oil",
                author: "Kosei",
                price: "4",
                date: "9/30/2023",
            },
            {
                title: "Free Sandwich",
                image: "https://hips.hearstapps.com/hmg-prod/images/italian-sandwich-recipe-2-1674500643.jpg?crop=0.505xw:1.00xh;0.337xw,0&resize=1200:*",
                description: "2 Days Old, ham, cheese, spinach, sesame bread",
                author: "Sarvesh",
                price: "0",
                date: "9/30/2023",
            },

        ])
    }









        // The width and height of the captured photo. We will set the
        // width to the value defined here, but the height will be
        // calculated based on the aspect ratio of the input stream.
      
        const width = 800; // We will scale the photo width to this
        let height = 800; // This will be computed based on the input stream
      
        // |streaming| indicates whether or not we're currently streaming
        // video from the camera. Obviously, we start at false.
      
        let streaming = false;
      
        // The various HTML elements we need to configure or control. These
        // will be set by the startup() function.
      
        let video = null;
        let canvas = null;
        let photo = null;
        let startbutton = null;
      
        function showViewLiveResultButton() {
          if (window.self !== window.top) {
            // Ensure that if our document is in a frame, we get the user
            // to first open it in its own tab or window. Otherwise, it
            // won't be able to request permission for camera access.
            document.querySelector(".contentarea").remove();
            const button = document.createElement("button");
            button.textContent = "View live result of the example code above";
            document.body.append(button);
            button.addEventListener("click", () => window.open(location.href));
            return true;
          }
          return false;
        }
      
        function startup() {
          if (showViewLiveResultButton()) {
            return;
          }
          video = document.getElementById("video");
          canvas = document.getElementById("canvas");
          photo = document.getElementById("photo");
          startbutton = document.getElementById("startbutton");
      
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
              video.srcObject = stream;
              video.play();
            })
            .catch((err) => {
              console.error(`An error occurred: ${err}`);
            });
      
          video.addEventListener(
            "canplay",
            (ev) => {
              if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);
      
                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.
      
                if (isNaN(height)) {
                  height = width / (4 / 3);
                }
      
                video.setAttribute("width", width);
                video.setAttribute("height", height);
                canvas.setAttribute("width", width);
                canvas.setAttribute("height", height);
                streaming = true;
              }
            },
            false,
          );
      
          startbutton.addEventListener(
            "click",
            (ev) => {
              takepicture();
              ev.preventDefault();
            },
            false,
          );
      
          clearphoto();
        }
      
        // Fill the photo with an indication that none has been
        // captured.
      
        function clearphoto() {
        //   const context = canvas.getContext("2d");
        //   context.fillStyle = "#AAA";
        //   context.fillRect(0, 0, canvas.width, canvas.height);
      
        //   const data = canvas.toDataURL("image/png");
        //   photo.setAttribute("src", data);
        }
      
        // Capture a photo by fetching the current contents of the video
        // and drawing it into a canvas, then converting that to a PNG
        // format data URL. By drawing it on an offscreen canvas and then
        // drawing that to the screen, we can change its size and/or apply
        // other changes before drawing it.
      
        function takepicture() {
          const context = canvas.getContext("2d");
          if (width && height) {
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);
      
            const data = canvas.toDataURL("image/png");
            photo.setAttribute("src", data);

            return data;
          } else {
            clearphoto();
          }
        }
      
        // // Set up our event listener to run the startup process
        // // once loading is complete.
        // window.addEventListener("load", startup, false);
      
        const [started, setStarted] = useState(false);

      async function onCreateButtonClicked() {
        console.log('button clicked');

        if (!started) {
        startup();

        // var button = document.getElementById('startbutton');
        // button.textContent = 'Take photo'
        setStarted(true)
        } else {
            document.getElementById('createmodal').showModal()
            var url = takepicture()
            console.log(url)
            // document.getElementById('createmodal').showModal()
            
            // API POST
            setTimeout(async () => {
                var rawResponse = await fetch('/api/scan', {
                  method: 'POST',
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({uid: window.Clerk.user.id, nid: router.query.id, data: btoa(url)})
                });
                setSStructuredData(rawResponse)
            },0)
        }
        
    }

    // document.getElementById('createmodal').showModal()

  return (
    <>






<div style={{minHeight: "50px"}}/>
{/* <div className="hero min-h-screen bg-base-200"> */}
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"

integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="

crossorigin="anonymous" referrerpolicy="no-referrer" />








<dialog id="createmodal" className="modal">
  <div className="modal-box w-4/12 max-w-5xl">
  <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Recipes!</h3>
    <p className="py-4">Your photo was analyzed to have:
    
    {/* API  */}
    



     </p>




    

     <div className="carousel w-full">
  <div id="item1" className="carousel-item w-full">
    {/* <img src="/images/stock/photo-1625726411847-8cbb60cc71e6.jpg" className="w-full" /> */}
    
<div className="card card-compact w-96 bg-base-100 shadow-xl bg-slate-200">
<div className="card-body">
<h2 className="card-title">Cheesy Veggie Quesadillas</h2>
<p>In a small bowl, whisk together 1/4 cup of milk, 2 teaspoons of taco seasoning, and 1/4 teaspoon of garlic powder. Spray a large skillet with cooking spray and heat over medium-high heat. Add 1 cup of shredded cheddar cheese and cook, stirring, until melted. Spoon the cheese mixture evenly over 4 tortillas. Top with 2 cups of chopped spinach, 1/4 cup of diced red onion, and another 4 tortillas. Cook for about 3 minutes per side or until golden and crisp. Cut into wedges and serve with salsa and sour cream.</p>
</div>
</div>

    </div> 
  <div id="item2" className="carousel-item w-full">

<div className="card card-compact w-96 bg-base-100 shadow-xl bg-slate-200">
<div className="card-body">
<h2 className="card-title">Spicy Creamy Tortilla Soup</h2>
<p>In a large pot, heat 2 tablespoons of oil over medium-high heat. Add 1 chopped onion, 2 minced garlic cloves, 1 teaspoon of cumin, 1/2 teaspoon of oregano, and 1/4 teaspoon of cayenne pepper. Cook, stirring, for about 10 minutes or until soft. Stir in 4 cups of chicken broth, 1 cup of salsa, and 1/4 cup of chopped cilantro. Bring to a boil and then reduce the heat and simmer for about 15 minutes. Stir in 1/4 cup of cream cheese and cook until melted. Cut 4 tortillas into thin strips and bake in a preheated oven at 375°F for about 10 minutes or until crisp. Ladle the soup into bowls and top with shredded cheese, tortilla strips, and more cilantro.</p>
</div>
</div>

  </div> 
  <div id="item3" className="carousel-item w-full">

<div className="card card-compact w-96 bg-base-100 shadow-xl bg-slate-200">
<div className="card-body">
<h2 className="card-title">Veggie Tortilla Roll-Ups</h2>
<p>In a small bowl, beat together 8 oz of cream cheese, 1/4 cup of sour cream, 2 tablespoons of ranch dressing mix, and 1/4 teaspoon of black pepper. Spread the mixture evenly over 8 tortillas. Top with 2 cups of shredded lettuce, 1 cup of shredded carrots, 1/2 cup of sliced black olives, and 1/4 cup of sliced green onions. Roll up the tortillas tightly and wrap in plastic wrap. Refrigerate for at least an hour or overnight. Cut into slices and serve with your favorite dip.</p>
</div>
</div>

  </div> 
</div> 
<div className="flex justify-center w-full py-2 gap-2">
  <a href="#item1" className="btn btn-xs">1</a> 
  <a href="#item2" className="btn btn-xs">2</a> 
  <a href="#item3" className="btn btn-xs">3</a> 
</div>




    </div>
    {/* <div className="modal-action">
  </div> */}
</dialog>














<div class="grid grid-cols-3 gap-0 overflow">

  {/* <div className="hero-content flex-col lg:flex-row-reverse" disabled> */}



    {/* <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100" style={{marginLeft: 50, marginRight: 25}}>
      <div className="card-body" style={{margin: 20}}>
      <div className="text-center lg:text-left">
      <h1 className="text-5xl font-bold">Generate flash cards!</h1>
      <p className="py-6">Generate flash cards based on your notes.</p>
    </div>
          <button className="btn btn-primary" onClick={()=>{quiz();window.form.showModal()}} id="submit">Generate</button>


      </div>
    </div> */}



{/* <div style={{minHeight: "100px"}}/> */}
<div class="contentarea">
  <div class="camera">
    <video id="video">Video stream not available.</video>
    <button id="startbutton" className='btn bg-green-500 hover:bg-green-400' onClick={() => {onCreateButtonClicked()}}>{started ? "Take photo" : "Start video"}</button>
  </div>
  <canvas id="canvas" className='display:none'> </canvas>
  <div class="output" className='display:none'>
    <img id="photo" alt="" />
  </div>
</div>





    

  {/* </div> */}
  










</div>

{/* 
<dialog id="form" className="modal">
  <form method="dialog" className="modal-box w-11/12 max-w-7xl">
    <button htmlFor="form" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    <h3 className="font-bold text-lg">Flash cards! (Hover to show answer)</h3>
    


    <div class="flip">
      <div class="flip-content">
        <div class="flip-front">
          <div class="card w-96 bg-base-100 shadow-xl flip">
            <div class="card-body items-center text-center">
              <p id="0">Loading...</p>
            </div>
          </div>
        </div>
        <div class="flip-back">
          <div class="card w-96 bg-base-100 shadow-xl flip">
            <div class="card-body items-center text-center">
              <p>Loading...</p>
            </div>
          </div>
        </div>
      </div>
    </div>


    


  </form>
  
</dialog> */}
    
    </>
  )
}
