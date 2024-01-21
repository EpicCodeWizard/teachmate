// @ts-nocheck
"use client"

import {useState} from "react";

export default function MyApp() {
  // const response = await fetch("http://example.com/movies.json");
  // const data = await response.json();
  /*
  just indexed with slide #
  */
  const [images, setImages] = useState([]); // also links
  const [recordings, setRecordings] = useState([]); // links

  const [audio, setAudio] = useState(null);
  function play(index) {
    if (audio != null) {
      audio.pause();
audio.currentTime = 0;
    }
    console.log(recordings[index])
    let audion = new Audio(recordings[index])
    setAudio(audion);
    audion.play();
  }

  const h = 75

  return (
    <>
    {images.length != 0 ? 
    <>
      <div className="carousel w-full">
        {images.map((image, index) => {
          return <div id={"slide" + index} key={index} className="carousel-item relative w-full">
            <img src={image} className="w-full" />
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={"#slide" + (index > 0 ? index - 1 : index)} className="btn btn-circle" onClick={() => {play(index > 0 ? index - 1 : index)}}>❮</a> 
              <a href={"#slide" + (index < image.length - 1 ? index + 1 : index)} className="btn btn-circle" onClick={() => {play(index < image.length - 1 ? index + 1 : index)}}>❯</a>
            </div>
          </div>;
        })}
      </div>
      <button className="btn" onClick={() => {play(0)}}>
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> */}
        Start presentation
      </button>
      </>
      : 
      

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Teach</h1>
            <p className="py-6">Once you provide a slideshow, this app will generate recordings and will present the slides.</p>
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
                <input type="file" className="file-input file-input-bordered w-full max-w-xs" id="fi" />
                {/* <div className="label">
                  <span className="label-text-alt">Alt label</span>
                  <span className="label-text-alt">Alt label</span>
                </div> */}
              </label>
              <div className="form-control mt-6">
                <button id="fb"className="btn" onClick={
                  () => {
                    const formData = new FormData();
                    formData.append('slideshow', document.getElementById('fi').files[0]);
                    // formData.append('doc1', doc1);
                    // formData.append('doc2', doc2);
                    // formData.append('doc3', doc3);
                    // and all other doc[id] from google classroom api
                    var data = fetch('/substitute?user_id=' + encodeURIComponent(user_id), {
                        method: 'POST',
                        body: formData
                    }).json();
                    var images = [];
                    var recordings = [];
                    for (const [key, value] of Object.entries(data)) {
                      // console.log(key, value);
                      images.push(key);
                      recordings.push(value);
                    }
                    setImages(images);
                    setRecordings(recordings);
                  }
                }>Generate</button>
              </div>
            </form>
          </div>
        </div>
      </div>}
    







      {/* <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{height: h + 'vh'}}>
        <div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box flex flex-row h-screen w-1/2" style={{height: h + 'vh'}}>
          {data.map((element, index) => {
            return <div key={index} className="carousel-item">
              <div className="card w-96 bg-base-100 shadow-xl h-screen" style={{height: h - 6 + 'vh'}}>
                <div className="card-body">
                  <h2 className="card-title">{element.title}</h2>
                  <p>{element.content}</p>
                  {element.questions.map((content, index2) => {
                    <div key={index2} className="form-control">
                      <label className="label cursor-pointer content-start text-left">
                        <input type="checkbox" checked="checked" className="checkbox" />
                        {content}
                      </label>
                    </div>
                  })}
                </div>
              </div>

            </div>;
          })}
        </div>
      </div> */}

    </>
  );
}