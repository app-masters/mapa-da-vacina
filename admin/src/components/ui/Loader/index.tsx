import { LoadingOutlined } from '@ant-design/icons';
import { theme } from '../../../styles/theme';
import { LoaderWrapper } from './styles';

/**
 * Loader
 */
const Loader = () => {
  return (
    <LoaderWrapper>
      <LoadingOutlined color={theme.colors.primary} size={60} spin />
    </LoaderWrapper>
  );
};

export default Loader;
