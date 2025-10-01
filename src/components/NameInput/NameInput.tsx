import { useGameStore } from '../../store/gameStore';
import './NameInput.css';

const NameInput = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 영어와 숫자만 허용 (정규식)
    const onlyEng = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    setGameFundamentals((prev) => ({
      ...prev,
      currentNameInput: onlyEng,
    }));
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
