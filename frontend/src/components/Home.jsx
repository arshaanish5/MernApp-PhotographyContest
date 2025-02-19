import React, { useEffect, useState } from 'react'; 
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
	const [welcomeMessage, setWelcomeMessage] = useState("Welcome to ShutterFlash!");

	useEffect(() => {
		const user = JSON.parse(sessionStorage.getItem("user") || "null");
		const admin = JSON.parse(sessionStorage.getItem("admin") || "null");

		if (admin) {
			setWelcomeMessage(`Welcome, ${admin.username}!`);
		} else if (user) {
			setWelcomeMessage(`Welcome, ${user.username}!`);
		}
	}, []);

	return (
		<>
			<div className='welcome-text'>
				<h1 className='page-text'>Welcome to Photography Contest Platform</h1>
				<p className='lead'>
					<span className='welcome-text' style={{ fontSize: "1.8rem" }}>
						{welcomeMessage}
					</span>
				</p>
			</div>

			{/* Bootstrap Carousel */}
			<div className="carousel-container">
				<Carousel>
					<Carousel.Item>
						<img className='carousel-img' src='/FirstSlide.webp' alt='Nature Photography' />
						<Carousel.Caption>
							<h1>Nature Photography</h1>
							<h5>Capture the beauty of the world around you.</h5>
						</Carousel.Caption>
					</Carousel.Item>

					<Carousel.Item>
						<img className='carousel-img' src='/secondSlide.png' alt='Portrait Photography' />
						<Carousel.Caption>
							<h1>Celebrate Portraits</h1>
							<h5>Discover the art of capturing emotions and personalities.</h5>
						</Carousel.Caption>
					</Carousel.Item>

					<Carousel.Item>
						<img className='carousel-img' src='/thirdSlide.jpg' alt='Street Photography' />
						<Carousel.Caption>
							<h1>Travel and Adventure</h1>
							<h5>Share your journeys through captivating travel photography.</h5>
						</Carousel.Caption>
					</Carousel.Item>
				</Carousel>
			</div>
		</>
	);
};

export default Home;
