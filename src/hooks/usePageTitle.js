import { useLayoutEffect } from 'react';

const usePageTitle = (title) => {
  useLayoutEffect(() => {
    document.title = title ? `${title} | MetaPusher` : 'MetaPusher';
  }, [title]);
};

export default usePageTitle;