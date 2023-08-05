import './App.css';
import Flow from "./flow-builder/FlowBuilder";

function App() {
  return (
    <div className="App">
        <div style={{ width: '100vw', height: '100vh' }} className="flex">
            <Flow/>
        </div>
    </div>
  );
}

export default App;
