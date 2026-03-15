import "./App.css";
// import FloatingLines from '
import { Button } from "@/components/ui/button";
import FloatingLines from "@/components/FloatingLines";
function App() {
  return (
    <>
      <div style={{ width: "100%", height: "600px", position: "relative" }}>
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          // Array - specify line count per wave; Number - same count for all waves
          lineCount={5}
          // Array - specify line distance per wave; Number - same distance for all waves
          lineDistance={5}
          bendRadius={5}
          bendStrength={-0.5}
          interactive={true}
          parallax={true}
        />
      </div>
      <Button />
    </>
  );
}

export default App;
