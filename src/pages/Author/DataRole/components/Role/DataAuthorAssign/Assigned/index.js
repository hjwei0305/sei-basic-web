import React, { Suspense } from 'react';
import { ListLoader } from 'suid';

const List = React.lazy(() => import('./List'));
const Tree = React.lazy(() => import('./Tree'));

const DataAuthorAssigned = ({ ...props }) => {
  const { currentDataAuthorType, ...rest } = props;
  const assignProps = {
    currentDataAuthorType,
    ...rest,
  };
  if (currentDataAuthorType.beTree) {
    return (
      <Suspense fallback={<ListLoader />}>
        <Tree {...assignProps} />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<ListLoader />}>
      <List {...assignProps} />
    </Suspense>
  );
};

export default DataAuthorAssigned;
