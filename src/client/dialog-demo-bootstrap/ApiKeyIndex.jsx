import { createRoot } from 'react-dom/client';
import ApiKey from './components/ApiKey';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<ApiKey />);
