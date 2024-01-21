export default function MyApp() {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Expand on feedback</h1>
            <p className="py-6">Once you provide a couple sentences of feedback, this app will elaborate on it and create more helpful feedback that is suited for the student.</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <form className="card-body">
              <label className="form-control">
                <div className="label">
                  <span className="label-text">Upload your teacher's feedback</span>
                  <span className="label-text-alt">(1-2) sentences recommended</span>
                </div>
                <textarea className="textarea textarea-bordered h-24" placeholder="Bio"></textarea>
              </label>
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