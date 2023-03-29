import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './components/nav';
import SimpleContainer from './components/container';

function App() {
  return (
    <div className="App">
    <ResponsiveAppBar/>
    <SimpleContainer/>  
    </div>
  );
}

export default App;
