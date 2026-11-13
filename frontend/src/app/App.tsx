import { Link, Route, Routes } from 'react-router';
export function App() {
 return <><a href="#main">Skip to content</a><header><Link to="/">Flower & Flora</Link></header><main id="main"><Routes><Route path="/" element={<><h1>Welcome to Flower & Flora</h1><p>Our marketplace is being prepared.</p><p>Stores and products are not available yet. Please check back later.</p></>}/><Route path="*" element={<><h1>Page not found</h1><Link to="/">Return home</Link></>}/></Routes></main></>;
}
