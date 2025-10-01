import { useGameStore } from '../../store/gameStore';
import './NameInput.css';

const NameInput = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyEng = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    if (
      gameFundamentals.currentNameInput.length >= 15 &&
      e.target.value.length > gameFundamentals.currentNameInput.length
    ) {
      return;
    } else {
      setGameFundamentals((prev) => ({
        ...prev,
        currentNameInput: onlyEng,
      }));
    }
  };

  return (
    <div className='name-input-container'>
      <input
        className='name-input'
        type='text'
        placeholder='Enter your name'
        value={gameFundamentals.currentNameInput}
        onChange={handleChange}
      />
    </div>
  );
};

export default NameInput;
