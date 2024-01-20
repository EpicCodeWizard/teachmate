export default async function About() {
    return (
        <>
            <div className="hero min-h-screen" style={{backgroundImage: 'url(https://daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.jpg)'}}>
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                <h1 className="mb-5 text-5xl font-bold">ABOUT ECOFRIDGE</h1>
                <h3 className="mb-5">Our app provides a modern experience for reducing food waste. Built by Sarvesh Madullapalli, Kosei Tsukamoto, and Vedant Garg.</h3>
                </div>
            </div>
            </div>
        </>
    )
}