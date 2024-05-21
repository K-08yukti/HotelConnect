import React, { useState, useEffect } from 'react';

const LandingPage: React.FC = () => {
    const images = ["image1.jpeg", "image2.jpeg", "image3.jpeg", "image4.jpeg", "image5.jpeg", "image6.jpeg"];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const backgroundImageStyle = {
        backgroundImage: `linear-gradient(rgba(3, 9, 19, 0.8), rgba(3, 25, 36, 0.2)), url('/images/${images[currentImageIndex]}')`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        overflow: 'hidden',
        width: '100%',
        height: '100vh',
    };

    return (
        <div style={backgroundImageStyle} className="flex flex-col items-center justify-center">
            <header className="text-white">
                <div className="text-3xl font-bold">HotelConnect</div>
            </header>
            <section className="text-center text-gray-400 mt-12">
                <span className="text-lg">खम्मा घणी</span>
                <h1 className="text-4xl font-bold mt-4">पधारो म्हारे देश</h1>
                <br />
                <a href="/search" className="inline-block bg-yellow-400 text-gray-900 py-2 px-6 rounded-md font-semibold mt-6 hover:bg-yellow-500">Book a Hotel</a>
            </section>
        </div>
    );
};

export default LandingPage;
