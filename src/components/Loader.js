import React from 'react';
import { Preloader, Oval } from 'react-preloader-icon';

import {oscilloscopeSettings} from '../constants'

const Loader = ({size}) => {
    return <Preloader
      use={Oval}
      size={size}
      strokeWidth={2}
      strokeColor={oscilloscopeSettings.scanColour}
      duration={3000}
    /> 
};
export default Loader;