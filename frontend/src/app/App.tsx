import { Link, Route, Routes } from 'react-router';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header><Link to="/">Flower & Flora</Link></header>
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  );
}
