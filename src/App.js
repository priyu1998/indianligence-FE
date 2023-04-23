// import logo from './logo.svg';
import './App.css';
import ResponsiveAppBar from './components/nav';
import SimpleContainer from './components/container';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  document.title = "BharatGPT"
  return (
    <div className="App">
    <ResponsiveAppBar/>
    <SimpleContainer/>  
    </div>
  );
}

export default App;
