import React from 'react';
import { Preloader, TailSpin, Oval, Audio } from 'react-preloader-icon';

import {oscilloscopeSettings} from '../constants'

const Loader = () => {
    return <Preloader
      use={Oval}
      size={128}
      strokeWidth={2}
      strokeColor={oscilloscopeSettings.scanColour}
      duration={3000}
    /> 
};
export default Loader;