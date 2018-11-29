/*
* 由于sessionStorage和localStorage只能存储字符串，不能从存储json对象
* 因此在存储之前需要把json对象转换成字符串
*/
const Storage = {
    // ==========sessionStorage设置缓存==========
    //设置sessionStorage缓存
    //存储数据之前先清除之前已经存在的数据
    sessionSet(name, data) {
        window.sessionStorage.removeItem(name);
        window.sessionStorage.setItem(name, JSON.stringify(data))
    },

    //获取sessionStorage缓存
    sessionGet(name) {
        return JSON.parse(window.sessionStorage.getItem(name))
    },

    //清除sessionStorage
    sessionRemove(name) {
        window.sessionStorage.removeItem(name);
    },

    // ==========localStorage设置缓存==========
    //设置localStorage缓存
    //存储数据之前先清除之前已经存在的数据
    localSet(name, data) {
        window.localStorage.removeItem(name);
        window.localStorage.setItem(name, JSON.stringify(data))
    },

    //获取localStorage缓存
    localGet(name) {
        return JSON.parse(window.localStorage.getItem(name))
    },

    //清除localStorage
    localRemove(name) {
        window.localStorage.removeItem(name);
    }
};

export default Storage;
