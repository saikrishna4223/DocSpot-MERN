// client/src/components/common/PageContainer.js
import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Box for common layout
const PageContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export default PageContainer;