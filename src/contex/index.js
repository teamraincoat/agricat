import React from 'react';
import { LocalizeContext, LocalizeProvider } from '../provider/LocalizeProvider';

export const useLocal = () => React.useContext(LocalizeContext);

export const RootProvider = (props) => <LocalizeProvider>{props.children}</LocalizeProvider>;
export default RootProvider;
