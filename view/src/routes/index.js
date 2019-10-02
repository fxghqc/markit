import loadable from 'loadable-components';
import PProgress from '../components/PProgress';

const options = {
  LoadingComponent: PProgress,
};

export const Home = loadable(() => import('./Home'), options);
export const Tags = loadable(() => import('./Tags'), options);
