import './MuteToggleBtn.css';
import { useGameStore } from '../../store/gameStore';

const MuteToggleBtn = () => {
  const { gameFundamentals, setGameFundamentals } = useGameStore();

  const isSoundOn = gameFundamentals.isSoundOn;
  const className = `sound-button ${isSoundOn ? 'sound-on' : 'sound-off'}`;
  const imgSrc = isSoundOn
    ? '/pixelButtons/sound-on.png'
    : '/pixelButtons/sound-off.png';

  const handleMuteToggleBtnClick = () => {
    setGameFundamentals((prev) => ({
      ...prev,
      isSoundOn: !prev.isSoundOn,
    }));
  };

  return (
    <div className={className} onClick={handleMuteToggleBtnClick}>
      <img src={imgSrc} alt={isSoundOn ? 'Sound On' : 'Sound Off'} width={28} />
    </div>
  );
};

export default MuteToggleBtn;
