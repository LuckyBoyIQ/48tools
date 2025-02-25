import { IDBReduxInstance, type IndexedDBRedux } from '@indexeddb-tools/indexeddb-redux';
import dbConfig from './IDBConfig';

/* indexeddb redux */
const IDBRedux: IndexedDBRedux = IDBReduxInstance(dbConfig.name, dbConfig.version);

export const bilibiliLiveObjectStoreName: string = dbConfig.objectStore[0].name;
export const acfunLiveObjectStoreName: string = dbConfig.objectStore[1].name;
export const optionsObjectStoreName: string = dbConfig.objectStore[2].name;
export const weiboLoginListObjectStoreName: string = dbConfig.objectStore[3].name;
export const ffmpegTemplateObjectStore: string = dbConfig.objectStore[4].name;
export const pocket48RoomVoiceObjectStoreName: string = dbConfig.objectStore[5].name;
export const douyinLiveObjectStoreName: string = dbConfig.objectStore[6].name;
export const kuaishouLiveObjectStoreName: string = dbConfig.objectStore[7].name;
export default IDBRedux;