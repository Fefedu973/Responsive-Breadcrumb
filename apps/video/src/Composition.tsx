import { Composition } from "remotion";
import { LaunchVideo } from "./LaunchVideo";

export const MyComposition = () => {
  return (
    <Composition
      id="ResponsiveBreadcrumbLaunch"
      component={LaunchVideo}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
