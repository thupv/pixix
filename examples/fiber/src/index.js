import React from 'react';
import './index.css';
import App from './App';
import PixiX from 'pixix';

PixiX.fiberRender(<App/>, document.getElementById('app'));
