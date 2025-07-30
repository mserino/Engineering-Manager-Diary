import { render } from '@testing-library/react';
import { UserProvider } from '../contexts/UserContext';

const customRender = (ui: React.ReactElement, options = {}) =>
    render(ui, {
        wrapper: ({ children }) => (
            <UserProvider>
                {children}
            </UserProvider>
        ),
        ...options,
    });

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { customRender as render };
