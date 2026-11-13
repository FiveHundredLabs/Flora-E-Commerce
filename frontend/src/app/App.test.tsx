import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect } from 'vitest';
import { App } from './App';
describe('foundation routes',()=>{
 it('shows an honest unavailable catalog state',()=>{render(<MemoryRouter><App/></MemoryRouter>);expect(screen.getByRole('heading',{name:'Welcome to Flower & Flora'})).toBeVisible();expect(screen.getByText(/Stores and products are not available/)).toBeVisible();});
 it('provides recovery for unknown routes',()=>{render(<MemoryRouter initialEntries={['/missing']}><App/></MemoryRouter>);expect(screen.getByRole('link',{name:'Return home'})).toHaveAttribute('href','/');});
});
