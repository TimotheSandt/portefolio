export interface ProjectProps {
  title: string;
  image: {
    src: string;
    alt: string;
    legend: string;
  };
  page: string;
  summary: string;
  description: string[];
}

export async function getProjects(): Promise<ProjectProps[]> {
  try {
    // Simple approach - just use root path
    const response = await fetch("/trace/Projects.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Projects data loaded:", data);

    // Assuming your JSON contains paths like "/trace/images/" and "/trace/descriptions/"
    const dirImages = data.DirImages;
    const dirDescriptions = data.DirDescriptions;
    const projectsInfo = data.projects;

    const projects = await Promise.all(
      projectsInfo.map(async (projectInfo: any) => {
        try {
          const projectPath = dirDescriptions + projectInfo.src;
          console.log("Fetching project:", projectPath);
          console.log("projectInfo.src:", projectInfo.src);
          console.log("dirDescriptions:", dirDescriptions);

          const projectResponse = await fetch(projectPath);

          console.log("Response status:", projectResponse.status);
          console.log("Response URL:", projectResponse.url);

          if (!projectResponse.ok) {
            // Log the actual response to see what we're getting
            const responseText = await projectResponse.text();
            console.log("Response text (first 200 chars):", responseText.substring(0, 200));
            throw new Error(`HTTP error! status: ${projectResponse.status} for ${projectPath}`);
          }

          const contentType = projectResponse.headers.get("content-type");
          console.log("Content-Type:", contentType);

          if (!contentType || !contentType.includes("application/json")) {
            const responseText = await projectResponse.text();
            console.log("Non-JSON response:", responseText.substring(0, 200));
            throw new Error(`Response is not JSON for ${projectPath}`);
          }

          const projectData = await projectResponse.json();
          projectData.image.src = dirImages + projectData.image.src;

          return projectData;
        } catch (error) {
          console.error(`Error fetching project data for ${projectInfo.src}:`, error);
          throw error;
        }
      })
    );

    return projects;
  } catch (error) {
    console.error("Error in getProjects:", error);
    throw error;
  }
}
