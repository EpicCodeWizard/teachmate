export default function MyApp() {
  return (
    <>

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Attendance</h1>
            <p className="py-6">Upload a picture of your seating chart along with a picture of the entire classroom.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <div className="form-control">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Picture of seating chart</span>
                    {/* <span className="label-text-alt">.pdf</span> */}
                  </div>
                  <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
                </label>
              </div>
              <div className="form-control">
                <label className="form-control w-full max-w-xs">
                  <div className="label">
                    <span className="label-text">Picture of entire classroom, from the front</span>
                    {/* <span className="label-text-alt">.pdf</span> */}
                  </div>
                  <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}