import { useState } from "react";
import SheepSockCollage from "../assets/SheepSockCollage.jpg";

export default function ProjectTracker() {
  const [projects, setProjects] = useState([]);
  const [input, setInput] = useState("");

  function addProject() {
    if (!input.trim()) return;

    setProjects(prev => [
      ...prev,
      { id: Date.now(), name: input }
    ]);

    setInput("");
  }

  return (
    <div className="tracker-page">
      <h1>Project Tracker</h1>
      <p>Keep track of your knitting projects.</p>
      <img src={SheepSockCollage} alt="A collage of photos of handknit projects, wool, and a black sheep"/>

      <div className="tracker-input">
        <input
          type="text"
          placeholder="Add a new project..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button onClick={addProject}>Add</button>
      </div>

      <div className="tracker-list">
        {projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="tracker-item">
              {project.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
}