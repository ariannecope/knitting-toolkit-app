import { Link } from "react-router-dom";
import HomeCollage from "../assets/HomeCollage.JPG";
// cropped copy of public/images/Arianne.JPG, framed around Arianne and the lamb for the oval
import ArianneOval from "../assets/ArianneOval.jpg";
// shetland.jpg sketch cut out from its paper (transparent around the sheep)
import ShetlandCutout from "../assets/ShetlandCutout.webp";

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Knitting Toolkit</h1>
      <p>
        Explore tools for yarn, gauge, projects, and more.
      </p>
      <img src={HomeCollage} alt="A collage of photos of yarn and a spinning wheel"/>

      {/* about the maker */}
      <section className="home-section">
        <h2>A Fiber Artist's Welcome</h2>
        <img
          src={ArianneOval}
          alt="Arianne smiling down at a black lamb held in her arms, in front of a weathered barn wall"
          className="image-standard home-portrait"
        />
        <p className="home-greeting">Hello, and welcome!</p>
        <p>
          I'm Arianne, a lifelong maker, fiber artist, and now a developer.
          I've spent years exploring the possibilities of wool, yarn, and the
          many ways we turn natural fibers into something useful and beautiful.
          Along the way, my curiosity led me into coding, where I discovered a
          new way to bring ideas to life.
        </p>
        <p>
          I built this toolkit to bring those two worlds together. I wanted a
          place where the practical side of working with fiber could meet the
          fascinating details behind the animals that produce it. It's a
          project born from a love of making, a love of learning, and a belief
          that understanding our materials makes the things we create even more
          meaningful.
        </p>
      </section>

      {/* invitation to the breed explorer, using one of the sketches */}
      <section className="home-section">
        <h2>Meet the Sheep Behind the Wool</h2>
        <p>Every fleece has a story, and it begins with the sheep.</p>
        <p>
          From fine, soft fleeces to sturdy, hardworking wool, different breeds
          bring their own characteristics, histories, and possibilities to the
          fiber world. The Sheep Breed Explorer is a growing collection
          designed to help you discover those differences and get to know the
          animals behind the fibers you love.
        </p>
        <p>
          I've illustrated these breeds myself, so each sketch is a little
          piece of my fiber-art journey, too. Click the sheep below to start
          exploring!
        </p>

        <Link to="/breeds" className="home-breed-link">
          <img
            src={ShetlandCutout}
            alt="Pencil sketch of a horned Shetland ram standing in grass, looking toward the viewer"
            className="home-breed-sketch"
          />
          <span className="home-breed-link-text">Explore the sheep breeds</span>
        </Link>
      </section>
    </div>
  );
}
