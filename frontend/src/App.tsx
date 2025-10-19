import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import { EnrollmentWizard } from './components/EnrollmentWizard/EnrollmentWizard';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <EnrollmentWizard />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
