"use client";

/**
 *
 * Asynchronously loads the component for Wheel
 *
 */

import { lazyLoad } from '../../../../../utils/loadable';

// import { lazyLoad } from 'utils/loadable';

const Wheel = lazyLoad(
  () => import('.'),
  module => module.default,
);
export default Wheel;