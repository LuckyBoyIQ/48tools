import { createRoot, type Root } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'antd/dist/reset.css';
import * as dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { storeFactory } from './store/store';
import AntdConfig from './components/basic/AntdConfig/AntdConfig';
import ThemeProvider from './components/basic/Theme/ThemeProvider';
import Routers from './router/Routers';
import IDBInit from './utils/IDB/IDBInit';
import './main.tailwindcss.css';
import './components/basic/Accessibility/Accessibility';
import './utils/logProtocol/logProtocolBroadcastChannel';

dayjs.locale('zh-cn');

/* app */
const root: Root = createRoot(document.getElementById('app')!);

root.render(
  <Provider store={ storeFactory() }>
    <ThemeProvider>
      <AntdConfig>
        <HashRouter>
          <Routers />
        </HashRouter>
      </AntdConfig>
    </ThemeProvider>
  </Provider>
);

IDBInit();