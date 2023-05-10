import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
//import 'antd/dist/antd.css'; //ant design 5버전으로 올라가면서 import 필요없어짐
import { applyMiddleware } from 'redux';
import promiseMiddleWare from 'redux-promise';
import ReducxThunk from 'redux-thunk';
import Reducer from './_reducers'
import { createStore } from 'redux';

const createStoreWithMiddlware = applyMiddleware(promiseMiddleWare, ReducxThunk)(createStore)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider
    store={createStoreWithMiddlware(Reducer,
        //크롬 확장프로그램 Redux DevTools 설치 후 추가
        window._REDUX_DEVTOOLS_EXTENSION_&&
        window._REDUX_DEVTOOLS_EXTENSION_()
      )}
  >
    <App />
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
