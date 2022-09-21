import { Card } from "@mui/material";
import "./App.css";
import TotalChart from "./charts/TotalChart";
import totalData from "./data/total.json";

function App() {
  return (
    <div className="App">
      <div className="Cards">
        <Card style={{ height: 500, width: 800 }}>
          <TotalChart data={totalData} lines={["total"]} />
        </Card>
      </div>
    </div>
  );
}

export default App;
