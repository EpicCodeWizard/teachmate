// @ts-nocheck

export default async function MyApp() {
  // const response = await fetch("http://example.com/movies.json");
  // const data = await response.json();
  /*
  Format: 
  [
    {
      
    },
    ...
  ]
  */
  var data = [
    {
      title: '1',
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      title: '1',
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      title: '1',
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      title: '1',
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      title: '1',
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
  ];

  const h = 75

  return (
    <>
      <div className="absolute p-4 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" style={{height: h + 'vh'}}>
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
      </div>

    </>
  );
}