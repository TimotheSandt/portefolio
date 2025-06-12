import { type ProjectProps } from "../../../../script/projectsReader";

import "./TraceSection.css";

interface TraceProps extends ProjectProps {
  index: number;
  id?: string;
}

function Trace({ id, index, title, description, image }: TraceProps) {
  const newDescription = description.map((desc) => desc.replace(/%s/g, `${index + 1}`));
  const newImage = { ...image, legend: image.legend?.replace(/%s/g, `${index + 1}`) || "" };

  return (
    <div id={id} className="trace-section">
      <div className="trace-container">
        <h2 className="trace-title">{title}</h2>
        <div className="trace-image">
          <img className="trace-image" src={image.src} alt={image.alt} />
          {newImage.legend && <p className="trace-legend">{newImage.legend}</p>}
        </div>
        {newDescription.map((desc, index) => (
          <p className="trace-description" key={index}>
            {desc}
          </p>
        ))}
      </div>
    </div>
  );
}

interface TraceSectionProps extends ProjectProps {
  id?: string;
  index: number;
}

function TraceSection({ id, index, ...project }: TraceSectionProps) {
  

  return <Trace id={id} index={index} {...(project as ProjectProps)} />;
}

export default TraceSection;
