import './App.css';
import Pikachu from './components/Pikachu/Pikachu';

function App() {
  return (
    <div className='App'>
      <h1>Run Pikachu!</h1>
      <div className='game-container'>
        <Pikachu isJumping={false} />
      </div>
    </div>
  );
}

export default App;
