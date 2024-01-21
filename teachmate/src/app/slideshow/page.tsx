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
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
    {
      objectives: ['1'],
      content: '1',
      questions: ['1'],
    },
  ];

  return (
    <>

<div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
  {data.map((element, index) => {
    return <div key={index} className="carousel-item w-full">
      {<img src="https://daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.jpg" className="rounded-box" />}
    </div>;
  })}
</div>

    </>
  );
}