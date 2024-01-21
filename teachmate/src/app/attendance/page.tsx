// @ts-nocheck
'use client'
export default function MyApp() {
  return (
    <>
        <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Attendance:</h3>
        <p className="py-4" id="out1">Loading...</p>
        <p className="py-4" id="out2"></p>
      </div>
    </dialog>

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Attendance</h1>
            <p className="py-6">Upload a picture of your seating chart along with a picture of the entire classroom.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={(event) => {
              event.preventDefault();
            }}>
              <div className="form-control">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Picture of seating chart</span>
                    <span className="label-text-alt">.pdf</span>
                  </div>
                  <input accept=".pdf" type="file" className="file-input file-input-bordered w-full max-w-xs" id="f" />
                </label>
              </div>
              <div className="form-control">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Picture of entire classroom, from the front</span>
                    <span className="label-text-alt">image</span>
                  </div>
                  <input accept="image/*" type="file" className="file-input file-input-bordered w-full max-w-xs" id="f2" />
                </label>
              </div>
              <div className="form-control mt-6" onClick={
                  () => {
                    document.getElementById('my_modal_3').showModal();


                    
                    const formData = new FormData();
                    formData.append('attendance', document.getElementById('f').files[0]);
                    formData.append('photo', document.getElementById('f2').files[0]);
                    document.getElementById('out1').textContent  = fetch('/attendance', {
                        method: 'POST',
                        body: formData
                    }).json();

                  }
                }>
                <button className="btn">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}