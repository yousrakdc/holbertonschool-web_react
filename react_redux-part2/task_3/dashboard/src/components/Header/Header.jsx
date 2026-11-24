import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import holbertonLogo from '../../assets/holberton-logo.jpg';

function Header() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = (event) => {
    event.preventDefault();
    dispatch(logout());
  };

  return (
    <>
      <header className="App-header flex flex-col max-[520px]:items-center max-[520px]:gap-2 sm:flex-row border-b-2 border-[var(--main-color)]">
        <img
          src={holbertonLogo}
          alt="holberton logo"
          className="h-[250px] w-[250px] max-[520px]:h-[150px] max-[520px]:w-[150px]"
        />
        <h1 className="flex items-center text-[var(--main-color)] max-[520px]:text-lg sm:text-xl md:text-2xl">
          School Dashboard
        </h1>
      </header>
      {isLoggedIn && (
        <section id="logoutSection" className="mt-2 px-4">
          Welcome <b>{user.email}</b>{' '}
          <a href="#" onClick={handleLogout}>
            (logout)
          </a>
        </section>
      )}
    </>
  );
}

export default Header;
