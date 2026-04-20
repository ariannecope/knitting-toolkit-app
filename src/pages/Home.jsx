import HomeCollage from "../assets/HomeCollage.jpg";

export default function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Knitting Toolkit</h1>
      <p>
        Explore tools for yarn, gauge, projects, and more.
      </p>
      <img src={HomeCollage} alt="A collage of photos of yarn and a spinning wheel"/>
    </div>
  );
}