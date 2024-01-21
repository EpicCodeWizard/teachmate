export default function MyApp() {
  return (
    <>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Upload a picture of a seating chart</span>
          <span className="label-text-alt">Alt label</span>
        </div>
        <input type="file" className="file-input file-input-bordered w-full max-w-xs" />
        <div className="label">
          <span className="label-text-alt">Alt label</span>
          <span className="label-text-alt">Alt label</span>
        </div>
      </label>
    </>
  );
}