import { useSelector } from 'react-redux';
import { getCurrentYear, getFooterCopy } from '../../utils/utils.js';

function Footer() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <footer className="App-footer flex flex-col items-center border-t-2 border-[var(--main-color)] py-4 text-center mt-auto">
      <p className="text-xs sm:text-sm md:text-base italic">
        Copyright {getCurrentYear()} - {getFooterCopy(true)}
      </p>
      {isLoggedIn && (
        <p>
          <a href="#">Contact us</a>
        </p>
      )}
    </footer>
  );
}

export default Footer;
